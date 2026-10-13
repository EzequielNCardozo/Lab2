import { Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

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
  const colores = useColores()
  const styles = crearEstilos(colores)

  const esSecundario = variante === 'secundario'
  const esPeligro = variante === 'peligro'
  const colorTexto = esPeligro ? colores.error : esSecundario ? colores.texto : colores.textoSobrePrimario

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
        <ActivityIndicator color={colorTexto} />
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

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    boton: {
      backgroundColor: colores.primario,
      borderColor: colores.primario,
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
      backgroundColor: colores.superficie,
      borderColor: colores.borde,
    },
    botonPeligro: {
      backgroundColor: colores.superficie,
      borderColor: colores.error,
    },
    botonOcupado: {
      opacity: 0.6,
    },
    texto: {
      color: colores.textoSobrePrimario,
      fontSize: tema.tipografia.media,
      fontWeight: '600',
    },
    textoSecundario: {
      color: colores.texto,
    },
    textoPeligro: {
      color: colores.error,
    },
  })
}
