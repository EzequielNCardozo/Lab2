import { Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { tema } from '../styles/theme'

type Props = {
  texto: string
  onPress: () => void
  /** 'secundario' tiene menos peso visual; 'peligro' es para acciones que borran. */
  variante?: 'principal' | 'secundario' | 'peligro'
  /** Mientras está en true el botón no responde, para evitar el doble envío. */
  ocupado?: boolean
  /** Nombre de un ícono de Ionicons (se buscan en icons.expo.fyi). */
  icono?: keyof typeof Ionicons.glyphMap
}

/** El botón de toda la app. */
export default function Boton({ texto, onPress, variante = 'principal', ocupado = false, icono }: Props) {
  const esSecundario = variante === 'secundario'
  const esPeligro = variante === 'peligro'
  const conFondoClaro = esSecundario || esPeligro
  const colorTexto = esPeligro ? tema.colores.error : esSecundario ? tema.colores.texto : tema.colores.superficie

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
        <>
          {icono ? <Ionicons name={icono} size={tema.medidas.icono} color={colorTexto} /> : null}
          <Text
            style={[styles.texto, esSecundario && styles.textoSecundario, esPeligro && styles.textoPeligro]}
          >
            {texto}
          </Text>
        </>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tema.espaciado.chico,
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
