import { Text, Pressable, StyleSheet } from 'react-native'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

type Props = {
  texto: string
  elegido: boolean
  onPress: () => void
}

/** Botón redondeado de una opción, con dos estados: elegido y no elegido. */
export default function Chip({ texto, elegido, onPress }: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  return (
    <Pressable style={[styles.chip, elegido && styles.chipElegido]} onPress={onPress}>
      <Text style={[styles.texto, elegido && styles.textoElegido]}>{texto}</Text>
    </Pressable>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    chip: {
      borderColor: colores.borde,
      borderWidth: 1,
      borderRadius: tema.bordes.radio,
      paddingVertical: tema.espaciado.chico,
      paddingHorizontal: tema.espaciado.medio,
      backgroundColor: colores.superficie,
    },
    chipElegido: {
      backgroundColor: colores.secundario,
      borderColor: colores.secundario,
    },
    texto: {
      fontSize: tema.tipografia.chica,
      color: colores.texto,
    },
    textoElegido: {
      color: colores.textoSobrePrimario,
      fontWeight: '600',
    },
  })
}
