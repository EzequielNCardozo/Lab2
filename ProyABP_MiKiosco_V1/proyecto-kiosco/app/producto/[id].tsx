import { useCallback, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import Boton from '../../components/Boton'
import Dato from '../../components/Dato'
import { obtenerProductoConStock } from '../../services/productos'
import { formatearFecha } from '../../utils/fecha'
import { tema } from '../../styles/theme'
import type { ProductoConStock } from '../../tipos/producto'

/**
 * El detalle de un producto.
 *
 * El id llega en la ruta (`/producto/4`) y siempre como texto.
 */
export default function DetalleProducto() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const idProducto = Number(id)

  const [producto, setProducto] = useState<ProductoConStock | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setProducto(await obtenerProductoConStock(idProducto))
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
    } finally {
      setCargando(false)
    }
  }, [idProducto])

  // Se recarga al volver, para mostrar el stock actualizado.
  useFocusEffect(
    useCallback(() => {
      cargar()
    }, [cargar])
  )

  if (Number.isNaN(idProducto)) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>La dirección no trae un id de producto válido.</Text>
      </View>
    )
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.secundario} />
      </View>
    )
  }

  if (error || !producto) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error || 'No se encontró el producto.'}</Text>
        <Boton texto="Reintentar" onPress={cargar} />
      </View>
    )
  }

  const habilitado = producto.habilitado === 1

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <Text style={styles.nombre}>{producto.nombre}</Text>

      <Dato etiqueta="Descripción" valor={producto.descripcion || 'Sin descripción'} />

      <Dato
        etiqueta="Stock"
        valor={producto.cantidad === null ? 'Sin registrar' : `${producto.cantidad} unidades`}
        destacado
      />

      <Dato etiqueta="Estado" valor={habilitado ? 'Habilitado' : 'Inhabilitado'} />

      {!habilitado ? (
        <Dato
          etiqueta="Motivo de la baja"
          valor={`${producto.motivo_baja || 'Sin motivo registrado'} (${formatearFecha(producto.fecha_baja)})`}
        />
      ) : null}

      {habilitado ? (
        <Boton
          texto="Registrar movimiento de stock"
          onPress={() =>
            router.push({ pathname: '/movimiento/[id]', params: { id: producto.ID } })
          }
        />
      ) : (
        <Text style={styles.aviso}>
          Un producto inhabilitado no puede recibir movimientos de stock.
        </Text>
      )}
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
  nombre: {
    fontSize: tema.tipografia.grande,
    fontWeight: '700',
    color: tema.colores.texto,
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
    textAlign: 'center',
  },
  aviso: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
  },
})
