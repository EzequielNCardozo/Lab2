import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Boton from '../../components/Boton'
import FormularioProducto from '../../components/FormularioProducto'
import { modificarProducto, obtenerProductoConStock } from '../../services/productos'
import { tema } from '../../styles/theme'

/** Pantalla para cambiar el nombre y la descripción de un producto. */
export default function EditarProducto() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const idProducto = Number(id)

  const { data: producto, isLoading, error, refetch } = useQuery({
    queryKey: ['producto', idProducto],
    queryFn: () => obtenerProductoConStock(idProducto),
  })

  async function guardar(nombre: string, descripcion: string) {
    await modificarProducto(idProducto, nombre, descripcion)
    // El nombre se ve en el listado, el detalle y el historial
    queryClient.invalidateQueries()
    router.back()
  }

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.secundario} />
      </View>
    )
  }

  if (error || !producto) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error ? error.message : 'No se encontró el producto.'}</Text>
        <Boton texto="Reintentar" onPress={() => refetch()} />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <FormularioProducto
        nombreInicial={producto.nombre}
        descripcionInicial={producto.descripcion ?? ''}
        textoBoton="Guardar cambios"
        onGuardar={guardar}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    padding: tema.espaciado.medio,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tema.espaciado.grande,
    gap: tema.espaciado.medio,
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
    textAlign: 'center',
  },
})
