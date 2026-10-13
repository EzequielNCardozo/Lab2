import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import Boton from '../components/Boton'
import FilaMovimiento from '../components/FilaMovimiento'
import { obtenerPaginaHistorial } from '../services/movimientos'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

/** El historial de todos los movimientos de stock, del más nuevo al más viejo. */
export default function Historial() {
  const colores = useColores()
  const styles = crearEstilos(colores)

  // Trae el historial de a páginas: la siguiente se pide al llegar al final de la lista
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['historial'],
      queryFn: ({ pageParam }) => obtenerPaginaHistorial(pageParam),
      initialPageParam: 0,
      getNextPageParam: (ultima) => ultima.siguiente,
    })

  // Junta todas las páginas que ya llegaron en una sola lista
  const movimientos = data?.pages.flatMap((pagina) => pagina.movimientos) ?? []

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colores.secundario} />
        <Text style={styles.mensaje}>Cargando movimientos…</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error.message}</Text>
        <Boton texto="Reintentar" icono="refresh" onPress={() => refetch()} />
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
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator color={colores.secundario} /> : null
      }
    />
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
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
      color: colores.textoSuave,
      textAlign: 'center',
    },
    error: {
      fontSize: tema.tipografia.media,
      color: colores.error,
      textAlign: 'center',
    },
  })
}
