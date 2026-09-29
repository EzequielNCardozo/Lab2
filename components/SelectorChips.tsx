import { View, Text, StyleSheet } from 'react-native'
import Chip from './Chip'
import { tema } from '../styles/theme'

type Opcion = {
  valor: string
  texto: string
}

type Props = {
  etiqueta: string
  opciones: Opcion[]
  /** null cuando todavía no se eligió nada. */
  elegido: string | null
  onElegir: (valor: string) => void
}

/**
 * Una fila de chips para elegir una opción entre varias.
 *
 * Los valores van como texto; la pantalla los convierte si hace falta.
 */
export default function SelectorChips({ etiqueta, opciones, elegido, onElegir }: Props) {
  return (
    <View style={styles.selector}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={styles.opciones}>
        {opciones.map((opcion) => (
          <Chip
            key={opcion.valor}
            texto={opcion.texto}
            elegido={opcion.valor === elegido}
            onPress={() => onElegir(opcion.valor)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selector: {
    gap: tema.espaciado.chico,
  },
  etiqueta: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
    fontWeight: '600',
  },
  opciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tema.espaciado.chico,
  },
})
