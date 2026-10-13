import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

export type Pestana = 'todos' | 'habilitados' | 'inhabilitados'

// Afuera del componente porque no cambian: así React no las vuelve a crear en cada render
const PESTANAS: { valor: Pestana; texto: string }[] = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'habilitados', texto: 'Habilitados' },
  { valor: 'inhabilitados', texto: 'Inhabilitados' },
]

type Props = {
  elegida: Pestana
  onElegir: (pestana: Pestana) => void
}

/** Las pestañas del catálogo: todos los productos, solo los habilitados o solo los inhabilitados. */
export default function PestanasCatalogo({ elegida, onElegir }: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  return (
    <View style={styles.barra}>
      {PESTANAS.map((pestana) => {
        const activa = pestana.valor === elegida

        return (
          <TouchableOpacity
            key={pestana.valor}
            style={[styles.pestana, activa && styles.pestanaActiva]}
            onPress={() => onElegir(pestana.valor)}
          >
            <Text style={[styles.texto, activa && styles.textoActivo]}>{pestana.texto}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    barra: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colores.borde,
      marginBottom: tema.espaciado.chico,
    },
    pestana: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: tema.espaciado.chico,
      // La línea existe siempre del color del fondo, así la pestaña activa no salta al marcarse
      borderBottomWidth: tema.medidas.lineaPestana,
      borderBottomColor: colores.fondo,
    },
    pestanaActiva: {
      borderBottomColor: colores.secundario,
    },
    texto: {
      fontSize: tema.tipografia.media,
      color: colores.textoSuave,
    },
    textoActivo: {
      color: colores.texto,
      fontWeight: '600',
    },
  })
}
