import { Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { tema } from '../styles/theme'

type Props = {
  texto: string
  onPress: () => void
  /** 'secundario' es el mismo botón con menos peso visual. */
  variante?: 'principal' | 'secundario'
  /** Mientras está en true el botón no responde, para evitar el doble envío. */
  ocupado?: boolean
}

/** El botón de toda la app. */
export default function Boton({ texto, onPress, variante = 'principal', ocupado = false }: Props) {
  const esSecundario = variante === 'secundario'

  return (
    <Pressable
      style={[styles.boton, esSecundario && styles.botonSecundario, ocupado && styles.botonOcupado]}
      onPress={onPress}
      disabled={ocupado}
    >
      {ocupado ? (
        <ActivityIndicator color={esSecundario ? tema.colores.primario : tema.colores.superficie} />
      ) : (
        <Text style={[styles.texto, esSecundario && styles.textoSecundario]}>{texto}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: tema.colores.primario,
    borderColor: tema.colores.primario,
    borderWidth: 1,
    borderRadius: tema.bordes.radio,
    paddingVertical: tema.espaciado.medio,
    paddingHorizontal: tema.espaciado.grande,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonSecundario: {
    backgroundColor: tema.colores.superficie,
    borderColor: tema.colores.borde,
  },
  botonOcupado: {
    opacity: 0.6,
  },
  texto: {
    color: tema.colores.superficie,
    fontSize: tema.tipografia.media,
    fontWeight: '600',
  },
  textoSecundario: {
    color: tema.colores.texto,
  },
})
