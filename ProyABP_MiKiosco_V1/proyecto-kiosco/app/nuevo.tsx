import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Boton from '../components/Boton'
import CampoTexto from '../components/CampoTexto'
import { agregarProducto } from '../services/productos'
import { tema } from '../styles/theme'

/**
 * Formulario de alta de un producto.
 *
 * Los topes de 50 y 100 son los largos de las columnas en la base.
 */
export default function Nuevo() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function guardar() {
    const nombreLimpio = nombre.trim()

    // La API no valida, así que un nombre vacío se guardaría vacío.
    if (nombreLimpio === '') {
      setError('El nombre del producto es obligatorio.')
      return
    }

    setGuardando(true)
    setError(null)

    try {
      await agregarProducto(nombreLimpio, descripcion.trim())
      // Se vuelve al listado, que se recarga solo y ya muestra el producto nuevo.
      router.back()
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
      setGuardando(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <CampoTexto
        etiqueta="Nombre"
        valor={nombre}
        onChangeText={setNombre}
        placeholder="Coca Cola 500ml"
        maximo={50}
      />

      <CampoTexto
        etiqueta="Descripción (opcional)"
        valor={descripcion}
        onChangeText={setDescripcion}
        placeholder="Gaseosa cola"
        multilinea
        maximo={100}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Boton texto="Guardar producto" onPress={guardar} ocupado={guardando} />

      <View style={styles.nota}>
        <Text style={styles.textoNota}>
          El producto se crea sin stock. Para cargarle las primeras unidades,
          entrá a su detalle y registrá un ingreso.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    padding: tema.espaciado.medio,
    gap: tema.espaciado.medio,
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
  },
  nota: {
    borderColor: tema.colores.borde,
    borderWidth: 1,
    borderRadius: tema.bordes.radio,
    padding: tema.espaciado.medio,
  },
  textoNota: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
  },
})
