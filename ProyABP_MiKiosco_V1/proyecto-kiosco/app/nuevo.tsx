import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import FormularioProducto from '../components/FormularioProducto'
import { agregarProducto } from '../services/productos'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

/** Pantalla de alta de un producto. */
export default function Nuevo() {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const router = useRouter()
  const queryClient = useQueryClient()

  async function guardar(nombre: string, descripcion: string) {
    await agregarProducto(nombre, descripcion)
    // Marca el listado como viejo para que se vuelva a pedir
    queryClient.invalidateQueries({ queryKey: ['productos'] })
    router.back()
  }

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <FormularioProducto textoBoton="Guardar producto" onGuardar={guardar} />

      <View style={styles.nota}>
        <Text style={styles.textoNota}>
          El producto se crea sin stock. Para cargarle las primeras unidades,
          entrá a su detalle y registrá un ingreso.
        </Text>
      </View>
    </ScrollView>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    pantalla: {
      padding: tema.espaciado.medio,
      gap: tema.espaciado.medio,
    },
    nota: {
      borderColor: colores.borde,
      borderWidth: 1,
      borderRadius: tema.bordes.radio,
      padding: tema.espaciado.medio,
    },
    textoNota: {
      fontSize: tema.tipografia.chica,
      color: colores.textoSuave,
    },
  })
}
