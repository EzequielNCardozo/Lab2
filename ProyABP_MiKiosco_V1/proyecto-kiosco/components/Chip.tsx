import { Text, Pressable, StyleSheet } from 'react-native'
import { tema } from '../styles/theme'

type Props = {
  texto: string
  elegido: boolean
  onPress: () => void
}

/** Botón redondeado de una opción, con dos estados: elegido y no elegido. */
export default function Chip({ texto, elegido, onPress }: Props) {
  return (
    <Pressable style={[styles.chip, elegido && styles.chipElegido]} onPress={onPress}>
      <Text style={[styles.texto, elegido && styles.textoElegido]}>{texto}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    borderColor: tema.colores.borde,
    borderWidth: 1,
    borderRadius: tema.bordes.radio,
    paddingVertical: tema.espaciado.chico,
    paddingHorizontal: tema.espaciado.medio,
    backgroundColor: tema.colores.superficie,
  },
  chipElegido: {
    backgroundColor: tema.colores.secundario,
    borderColor: tema.colores.secundario,
  },
  texto: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.texto,
  },
  textoElegido: {
    color: tema.colores.superficie,
    fontWeight: '600',
  },
})
