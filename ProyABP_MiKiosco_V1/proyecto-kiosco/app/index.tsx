import { useCallback, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import Boton from '../components/Boton'
import EncabezadoCatalogo from '../components/EncabezadoCatalogo'
import FilaProducto from '../components/FilaProducto'
import { obtenerProductosConStock } from '../services/productos'
import { API_URL } from '../config'
import { tema } from '../styles/theme'
import type { ProductoConStock } from '../tipos/producto'

/** Pantalla principal: el listado de productos con su stock, y el buscador. */
export default function Inicio() {
  const router = useRouter()
  const [productos, setProductos] = useState<ProductoConStock[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setProductos(await obtenerProductosConStock())
    } catch (problema) {
      // Se agrega la URL, que es lo que hace falta para ubicar el problema.
      const detalle = problema instanceof Error ? problema.message : String(problema)
      setError(
        `${detalle}.\n\nRevisá que la API de Laboratorio I esté corriendo y que ${API_URL} sea la dirección correcta.`
      )
    } finally {
      setCargando(false)
    }
  }, [])

  // Recarga la primera vez y cada vez que se vuelve a esta pantalla.
  useFocusEffect(
    useCallback(() => {
      cargar()
    }, [cargar])
  )

  // El buscador filtra sobre lo que ya se trajo, sin volver a pedirle a la API.
  const termino = busqueda.trim().toLowerCase()
  const visibles =
    termino === ''
      ? productos
      : productos.filter((producto) => producto.nombre.toLowerCase().includes(termino))

  function contenido() {
    if (cargando) {
      return (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={tema.colores.secundario} />
          <Text style={styles.mensaje}>Cargando productos…</Text>
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centrado}>
          <Text style={styles.error}>{error}</Text>
          <Boton texto="Reintentar" onPress={cargar} />
        </View>
      )
    }

    if (visibles.length === 0) {
      return (
        <View style={styles.centrado}>
          <Text style={styles.mensaje}>
            {productos.length === 0
              ? 'Todavía no hay productos cargados en el catálogo.'
              : `Ningún producto coincide con "${busqueda.trim()}".`}
          </Text>
        </View>
      )
    }

    return (
      <FlatList
        style={styles.lista}
        data={visibles}
        keyExtractor={(producto) => String(producto.ID)}
        renderItem={({ item }) => (
          <FilaProducto
            producto={item}
            onPress={() => router.push({ pathname: '/producto/[id]', params: { id: item.ID } })}
          />
        )}
      />
    )
  }

  return (
    <View style={styles.pantalla}>
      <EncabezadoCatalogo
        busqueda={busqueda}
        onBuscar={setBusqueda}
        onAgregar={() => router.push('/nuevo')}
        onHistorial={() => router.push('/historial')}
      />
      {contenido()}
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: tema.espaciado.medio,
  },
  lista: {
    flex: 1,
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
    textAlign: 'center',
  },
})
