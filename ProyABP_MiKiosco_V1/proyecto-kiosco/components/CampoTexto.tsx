import { View, Text, TextInput, StyleSheet } from 'react-native'
import { tema } from '../styles/theme'

type Props = {
  etiqueta: string
  valor: string
  onChangeText: (texto: string) => void
  placeholder?: string
  /** Para los textos largos, como la descripción. */
  multilinea?: boolean
  /** Abre el teclado numérico en el celular. */
  soloNumeros?: boolean
  /** Tope de caracteres, igual al largo de la columna en la base. */
  maximo?: number
}

/** Un campo del formulario: la etiqueta arriba y el input abajo. */
export default function CampoTexto({
  etiqueta,
  valor,
  onChangeText,
  placeholder,
  multilinea = false,
  soloNumeros = false,
  maximo,
}: Props) {
  return (
    <View style={styles.campo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[styles.input, multilinea && styles.inputMultilinea]}
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tema.colores.textoSuave}
        multiline={multilinea}
        keyboardType={soloNumeros ? 'numeric' : 'default'}
        maxLength={maximo}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  campo: {
    gap: tema.espaciado.chico,
  },
  etiqueta: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
    fontWeight: '600',
  },
  input: {
    backgroundColor: tema.colores.superficie,
    borderColor: tema.colores.borde,
    borderWidth: 1,
    borderRadius: tema.bordes.radio,
    padding: tema.espaciado.medio,
    fontSize: tema.tipografia.media,
    color: tema.colores.texto,
  },
  inputMultilinea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
})
