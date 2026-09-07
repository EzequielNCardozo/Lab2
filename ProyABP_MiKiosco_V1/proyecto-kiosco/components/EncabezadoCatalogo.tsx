import { View, TextInput, StyleSheet } from 'react-native'
import Boton from './Boton'
import { tema } from '../styles/theme'

type Props = {
  busqueda: string
  onBuscar: (texto: string) => void
  onAgregar: () => void
  onHistorial: () => void
}

/**
 * La parte fija de arriba del catálogo: el buscador y las dos acciones.
 *
 * Queda siempre montado, para que el buscador no pierda el foco al recargar.
 */
export default function EncabezadoCatalogo({ busqueda, onBuscar, onAgregar, onHistorial }: Props) {
  return (
    <View style={styles.encabezado}>
      <TextInput
        style={styles.buscador}
        value={busqueda}
        onChangeText={onBuscar}
        placeholder="Buscar un producto por nombre"
        placeholderTextColor={tema.colores.textoSuave}
        autoCorrect={false}
      />

      <View style={styles.acciones}>
        <View style={styles.accion}>
          <Boton texto="+ Agregar producto" onPress={onAgregar} />
        </View>
        <View style={styles.accion}>
          <Boton texto="Historial" variante="secundario" onPress={onHistorial} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  encabezado: {
    gap: tema.espaciado.chico,
    paddingBottom: tema.espaciado.medio,
  },
  buscador: {
    backgroundColor: tema.colores.superficie,
    borderColor: tema.colores.borde,
    borderWidth: 1,
    borderRadius: tema.bordes.radio,
    padding: tema.espaciado.medio,
    fontSize: tema.tipografia.media,
    color: tema.colores.texto,
  },
  acciones: {
    flexDirection: 'row',
    gap: tema.espaciado.chico,
  },
  accion: {
    flex: 1,
  },
})
