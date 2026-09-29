import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import Boton from '../components/Boton'
import FilaMovimiento from '../components/FilaMovimiento'
import { obtenerHistorial } from '../services/movimientos'
import { tema } from '../styles/theme'

/** El historial de todos los movimientos de stock, del más nuevo al más viejo. */
export default function Historial() {
  const { data: movimientos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['historial'],
    queryFn: obtenerHistorial,
  })

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.secundario} />
        <Text style={styles.mensaje}>Cargando movimientos…</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error.message}</Text>
        <Boton texto="Reintentar" onPress={() => refetch()} />
      </View>
    )
  }

  if (movimientos.length === 0) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>
          Todavía no se registró ningún movimiento de stock.
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      contentContainerStyle={styles.lista}
      data={movimientos}
      keyExtractor={(movimiento) => String(movimiento.ID)}
      renderItem={({ item }) => <FilaMovimiento movimiento={item} />}
    />
  )
}

const styles = StyleSheet.create({
  lista: {
    padding: tema.espaciado.medio,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tema.espaciado.grande,
    gap: tema.espaciado.medio,
  },
  mensaje: {
    fontSize: tema.tipografia.media,
    color: tema.colores.textoSuave,
    textAlign: 'center',
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
    textAlign: 'center',
  },
})
