import { View, Text, TextInput, StyleSheet } from 'react-native'
import Boton from './Boton'
import { tema } from '../styles/theme'

type Props = {
  /** Nombre de quien inició sesión. */
  atiende: string
  onCerrarSesion: () => void
  busqueda: string
  onBuscar: (texto: string) => void
  onAgregar: () => void
  onHistorial: () => void
}

/** La parte fija de arriba del catálogo: la sesión, el buscador y las acciones. */
export default function EncabezadoCatalogo({
  atiende,
  onCerrarSesion,
  busqueda,
  onBuscar,
  onAgregar,
  onHistorial,
}: Props) {
  return (
    <View style={styles.encabezado}>
      <View style={styles.sesion}>
        <Text style={styles.atiende}>Atiende: {atiende}</Text>
        <Boton texto="Cerrar sesión" variante="secundario" onPress={onCerrarSesion} />
      </View>

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
  sesion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tema.espaciado.chico,
  },
  atiende: {
    flex: 1,
    fontSize: tema.tipografia.media,
    color: tema.colores.texto,
    fontWeight: '600',
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
