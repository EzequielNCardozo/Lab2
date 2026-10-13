import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { tema } from '../styles/theme'

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

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: tema.colores.borde,
    marginBottom: tema.espaciado.chico,
  },
  pestana: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: tema.espaciado.chico,
    // La línea existe siempre del color del fondo, así la pestaña activa no salta al marcarse
    borderBottomWidth: tema.medidas.lineaPestana,
    borderBottomColor: tema.colores.fondo,
  },
  pestanaActiva: {
    borderBottomColor: tema.colores.secundario,
  },
  texto: {
    fontSize: tema.tipografia.media,
    color: tema.colores.textoSuave,
  },
  textoActivo: {
    color: tema.colores.texto,
    fontWeight: '600',
  },
})
