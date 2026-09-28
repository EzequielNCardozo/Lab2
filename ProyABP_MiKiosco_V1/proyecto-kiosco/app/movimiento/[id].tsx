import { useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Boton from '../../components/Boton'
import CampoTexto from '../../components/CampoTexto'
import Dato from '../../components/Dato'
import SelectorChips from '../../components/SelectorChips'
import { crearStockInicial, obtenerProductoConStock } from '../../services/productos'
import { registrarMovimiento } from '../../services/movimientos'
import { useSesion } from '../../store/sesion'
import { tema } from '../../styles/theme'

/** Los valores son los que espera la API: 'I' suma, 'E' resta. */
const TIPOS = [
  { valor: 'I', texto: 'Ingreso' },
  { valor: 'E', texto: 'Egreso' },
]

/** Formulario para registrar un ingreso o un egreso de stock a nombre de quien inició sesión. */
export default function RegistrarMovimiento() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const usuario = useSesion((estado) => estado.usuario)
  const idProducto = Number(id)

  // Misma clave que el detalle, así usa el producto que ya está en caché
  const { data: producto, isLoading, error: errorDeCarga, refetch } = useQuery({
    queryKey: ['producto', idProducto],
    queryFn: () => obtenerProductoConStock(idProducto),
  })

  const [tipo, setTipo] = useState('I')
  const [cantidad, setCantidad] = useState('')
  const [observacion, setObservacion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    if (!usuario) {
      return 'Iniciá sesión para registrar movimientos.'
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
    if (!producto || !usuario) return

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
        ID_usuario: usuario.ID,
      })

      // Cambió el stock y el historial: se marcan todos los datos como viejos
      queryClient.invalidateQueries()
      router.back()
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
      setGuardando(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.secundario} />
      </View>
    )
  }

  if (errorDeCarga || !producto) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>
          {errorDeCarga ? errorDeCarga.message : 'No se encontró el producto.'}
        </Text>
        <Boton texto="Reintentar" onPress={() => refetch()} />
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

      {usuario ? (
        <Dato etiqueta="Registra" valor={`${usuario.nombre} ${usuario.apellido}`} />
      ) : null}

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
