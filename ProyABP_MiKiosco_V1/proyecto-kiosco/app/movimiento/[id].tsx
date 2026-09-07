import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Boton from '../../components/Boton'
import CampoTexto from '../../components/CampoTexto'
import Dato from '../../components/Dato'
import SelectorChips from '../../components/SelectorChips'
import { crearStockInicial, obtenerProductoConStock } from '../../services/productos'
import { obtenerUsuariosHabilitados } from '../../services/usuarios'
import { registrarMovimiento } from '../../services/movimientos'
import { tema } from '../../styles/theme'
import type { ProductoConStock } from '../../tipos/producto'
import type { Usuario } from '../../tipos/usuario'

/** Los valores son los que espera la API: 'I' suma, 'E' resta. */
const TIPOS = [
  { valor: 'I', texto: 'Ingreso' },
  { valor: 'E', texto: 'Egreso' },
]

/**
 * Formulario para registrar un ingreso o un egreso de stock.
 *
 * El selector de "quién registra" es lo que deja el movimiento asentado a
 * nombre de alguien, ya que la app no tiene login.
 */
export default function RegistrarMovimiento() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const idProducto = Number(id)

  const [producto, setProducto] = useState<ProductoConStock | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)
  const [errorDeCarga, setErrorDeCarga] = useState<string | null>(null)

  const [tipo, setTipo] = useState('I')
  const [cantidad, setCantidad] = useState('')
  const [observacion, setObservacion] = useState('')
  const [responsable, setResponsable] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setErrorDeCarga(null)
    try {
      const [productoTraido, usuariosTraidos] = await Promise.all([
        obtenerProductoConStock(idProducto),
        obtenerUsuariosHabilitados(),
      ])
      setProducto(productoTraido)
      setUsuarios(usuariosTraidos)
    } catch (problema) {
      setErrorDeCarga(problema instanceof Error ? problema.message : String(problema))
    } finally {
      setCargando(false)
    }
  }, [idProducto])

  // useEffect y no useFocusEffect: recargar un formulario borraría lo escrito.
  useEffect(() => {
    cargar()
  }, [cargar])

  /** Devuelve qué está mal en el formulario, o null si se puede mandar. */
  function queFalta(): string | null {
    if (!producto) return 'Todavía no se cargó el producto.'

    const unidades = Number(cantidad)
    if (!Number.isInteger(unidades) || unidades <= 0) {
      return 'La cantidad tiene que ser un número entero mayor que cero.'
    }

    if (observacion.trim() === '') {
      return 'La razón es obligatoria: es lo que queda guardado en el historial.'
    }

    if (responsable === null) {
      return 'Elegí quién registra el movimiento.'
    }

    if (tipo === 'E') {
      // La API no lo valida: sin este control el stock puede quedar negativo.
      if (producto.cantidad === null) {
        return 'Este producto todavía no tiene stock registrado, así que no se puede sacar nada.'
      }
      if (unidades > producto.cantidad) {
        return `No se puede sacar ${unidades}: hay ${producto.cantidad} en stock.`
      }
    }

    return null
  }

  async function registrar() {
    const falta = queFalta()
    if (falta) {
      setError(falta)
      return
    }

    // Repetido para TypeScript: queFalta() ya se aseguró de que estén.
    if (!producto || responsable === null) return

    setGuardando(true)
    setError(null)

    try {
      // Un producto recién dado de alta no tiene fila de stock todavía, y sin
      // ella el movimiento no queda registrado.
      if (producto.ID_stock === null) {
        await crearStockInicial(producto.ID, 0)
      }

      await registrarMovimiento({
        ID_producto: producto.ID,
        tipo: tipo === 'I' ? 'I' : 'E',
        cantidad: Number(cantidad),
        observacion: observacion.trim(),
        ID_usuario: Number(responsable),
      })

      // Se vuelve al detalle, que se recarga solo y ya muestra el stock nuevo.
      router.back()
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.secundario} />
      </View>
    )
  }

  if (errorDeCarga || !producto) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{errorDeCarga || 'No se encontró el producto.'}</Text>
        <Boton texto="Reintentar" onPress={cargar} />
      </View>
    )
  }

  if (producto.habilitado === 0) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>
          {producto.nombre} está inhabilitado, así que no puede recibir movimientos de stock.
        </Text>
      </View>
    )
  }

  if (usuarios.length === 0) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>
          No hay usuarios habilitados, y todo movimiento tiene que quedar a nombre de
          alguien. Habilitá un usuario antes de registrar.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <Dato
        etiqueta={producto.nombre}
        valor={
          producto.cantidad === null ? 'Sin stock registrado' : `${producto.cantidad} unidades`
        }
        destacado
      />

      <SelectorChips
        etiqueta="Tipo de movimiento"
        opciones={TIPOS}
        elegido={tipo}
        onElegir={setTipo}
      />

      <CampoTexto
        etiqueta="Cantidad"
        valor={cantidad}
        onChangeText={setCantidad}
        placeholder="12"
        soloNumeros
      />

      <CampoTexto
        etiqueta="Razón"
        valor={observacion}
        onChangeText={setObservacion}
        placeholder={tipo === 'I' ? 'Reposición del proveedor' : 'Venta del día'}
        multilinea
        maximo={150}
      />

      <SelectorChips
        etiqueta="Quién registra"
        opciones={usuarios.map((usuario) => ({
          valor: String(usuario.ID),
          texto: `${usuario.nombre} ${usuario.apellido}`,
        }))}
        elegido={responsable}
        onElegir={setResponsable}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Boton
        texto={tipo === 'I' ? 'Registrar ingreso' : 'Registrar egreso'}
        onPress={registrar}
        ocupado={guardando}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    padding: tema.espaciado.medio,
    gap: tema.espaciado.medio,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tema.espaciado.grande,
    gap: tema.espaciado.medio,
  },
  mensaje: {
    fontSize: tema.tipografia.media,
    color: tema.colores.textoSuave,
    textAlign: 'center',
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
  },
})
