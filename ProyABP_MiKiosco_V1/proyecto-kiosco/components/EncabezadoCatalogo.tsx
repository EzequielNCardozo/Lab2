import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Boton from './Boton'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

type Props = {
  /** Nombre de quien inició sesión. */
  atiende: string
  onCerrarSesion: () => void
  busqueda: string
  onBuscar: (texto: string) => void
  onAgregar: () => void
  onEscanear: () => void
  onHistorial: () => void
}

/** La parte fija de arriba del catálogo: la sesión, el buscador y las acciones. */
export default function EncabezadoCatalogo({
  atiende,
  onCerrarSesion,
  busqueda,
  onBuscar,
  onAgregar,
  onEscanear,
  onHistorial,
}: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  return (
    <View style={styles.encabezado}>
      <View style={styles.sesion}>
        <Text style={styles.atiende}>Atiende: {atiende}</Text>
        <Boton texto="Cerrar sesión" icono="log-out-outline" variante="secundario" onPress={onCerrarSesion} />
      </View>

      <View style={styles.buscador}>
        <Ionicons name="search" size={tema.medidas.icono} color={colores.textoSuave} />
        <TextInput
          style={styles.campoBusqueda}
          value={busqueda}
          onChangeText={onBuscar}
          placeholder="Buscar un producto por nombre"
          placeholderTextColor={colores.textoSuave}
          autoCorrect={false}
        />
      </View>

      <View style={styles.acciones}>
        <View style={styles.accion}>
          <Boton texto="Agregar" icono="add-circle-outline" onPress={onAgregar} />
        </View>
        <View style={styles.accion}>
          <Boton texto="Escanear" icono="barcode-outline" onPress={onEscanear} />
        </View>
      </View>

      <View style={styles.acciones}>
        <View style={styles.accion}>
          <Boton texto="Historial" icono="time-outline" variante="secundario" onPress={onHistorial} />
        </View>
      </View>
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
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
      color: colores.texto,
      fontWeight: '600',
    },
    buscador: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tema.espaciado.chico,
      backgroundColor: colores.superficie,
      borderColor: colores.borde,
      borderWidth: 1,
      borderRadius: tema.bordes.radio,
      paddingHorizontal: tema.espaciado.medio,
    },
    campoBusqueda: {
      flex: 1,
      paddingVertical: tema.espaciado.medio,
      fontSize: tema.tipografia.media,
      color: colores.texto,
    },
    acciones: {
      flexDirection: 'row',
      gap: tema.espaciado.chico,
    },
    accion: {
      flex: 1,
    },
  })
}
