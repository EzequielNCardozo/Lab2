import { Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { tema } from '../styles/theme'

type Props = {
  texto: string
  onPress: () => void
  /** 'secundario' tiene menos peso visual; 'peligro' es para acciones que borran. */
  variante?: 'principal' | 'secundario' | 'peligro'
  /** Mientras está en true el botón no responde, para evitar el doble envío. */
  ocupado?: boolean
}

/** El botón de toda la app. */
export default function Boton({ texto, onPress, variante = 'principal', ocupado = false }: Props) {
  const esSecundario = variante === 'secundario'
  const esPeligro = variante === 'peligro'
  const conFondoClaro = esSecundario || esPeligro

  return (
    <Pressable
      style={[
        styles.boton,
        esSecundario && styles.botonSecundario,
        esPeligro && styles.botonPeligro,
        ocupado && styles.botonOcupado,
      ]}
      onPress={onPress}
      disabled={ocupado}
    >
      {ocupado ? (
        <ActivityIndicator color={conFondoClaro ? tema.colores.primario : tema.colores.superficie} />
      ) : (
        <Text
          style={[styles.texto, esSecundario && styles.textoSecundario, esPeligro && styles.textoPeligro]}
        >
          {texto}
        </Text>
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
  botonPeligro: {
    backgroundColor: tema.colores.superficie,
    borderColor: tema.colores.error,
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
  textoPeligro: {
    color: tema.colores.error,
  },
})
