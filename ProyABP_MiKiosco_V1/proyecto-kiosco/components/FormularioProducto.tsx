import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Boton from './Boton'
import CampoTexto from './CampoTexto'
import { tema } from '../styles/theme'

type Props = {
  /** Valores con los que arranca: vacíos en el alta, los actuales al modificar. */
  nombreInicial?: string
  descripcionInicial?: string
  textoBoton: string
  /** Guarda el producto; si falla, el mensaje del error se muestra en el formulario. */
  onGuardar: (nombre: string, descripcion: string) => Promise<void>
}

/** El formulario de nombre y descripción, compartido por el alta y la modificación. */
export default function FormularioProducto({
  nombreInicial = '',
  descripcionInicial = '',
  textoBoton,
  onGuardar,
}: Props) {
  const [nombre, setNombre] = useState(nombreInicial)
  const [descripcion, setDescripcion] = useState(descripcionInicial)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function guardar() {
    const nombreLimpio = nombre.trim()

    // La API no valida, así que un nombre vacío se guardaría vacío
    if (nombreLimpio === '') {
      setError('El nombre del producto es obligatorio.')
      return
    }

    setGuardando(true)
    setError(null)

    try {
      await onGuardar(nombreLimpio, descripcion.trim())
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
      setGuardando(false)
    }
  }

  // Los topes son los largos de las columnas en la base
  return (
    <View style={styles.formulario}>
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

      <Boton texto={textoBoton} onPress={guardar} ocupado={guardando} />
    </View>
  )
}

const styles = StyleSheet.create({
  formulario: {
    gap: tema.espaciado.medio,
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
  },
})
