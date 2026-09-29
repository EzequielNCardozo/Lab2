import { View, Text, StyleSheet } from 'react-native'
import { tema } from '../styles/theme'

type Props = {
  etiqueta: string
  valor: string
  /** Para el dato principal de la pantalla, que se lee más grande. */
  destacado?: boolean
}

/** Un dato con su etiqueta arriba, como los muestra el detalle del producto. */
export default function Dato({ etiqueta, valor, destacado = false }: Props) {
  return (
    <View style={styles.dato}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={[styles.valor, destacado && styles.valorDestacado]}>{valor}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  dato: {
    gap: 2,
  },
  etiqueta: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
    fontWeight: '600',
  },
  valor: {
    fontSize: tema.tipografia.media,
    color: tema.colores.texto,
  },
  valorDestacado: {
    fontSize: tema.tipografia.grande,
    fontWeight: '700',
    color: tema.colores.primario,
  },
})
