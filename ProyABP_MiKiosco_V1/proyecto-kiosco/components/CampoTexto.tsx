import { View, Text, TextInput, StyleSheet } from 'react-native'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

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
  /** Tapa lo que se escribe, para la contraseña. */
  oculto?: boolean
  /** Sin mayúscula automática ni corrector, para usuario y contraseña. */
  sinCorrector?: boolean
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
  oculto = false,
  sinCorrector = false,
}: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  return (
    <View style={styles.campo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[styles.input, multilinea && styles.inputMultilinea]}
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colores.textoSuave}
        multiline={multilinea}
        keyboardType={soloNumeros ? 'numeric' : 'default'}
        maxLength={maximo}
        secureTextEntry={oculto}
        autoCapitalize={sinCorrector ? 'none' : 'sentences'}
        autoCorrect={!sinCorrector}
      />
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    campo: {
      gap: tema.espaciado.chico,
    },
    etiqueta: {
      fontSize: tema.tipografia.chica,
      color: colores.textoSuave,
      fontWeight: '600',
    },
    input: {
      backgroundColor: colores.superficie,
      borderColor: colores.borde,
      borderWidth: 1,
      borderRadius: tema.bordes.radio,
      padding: tema.espaciado.medio,
      fontSize: tema.tipografia.media,
      color: colores.texto,
    },
    inputMultilinea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
  })
}
