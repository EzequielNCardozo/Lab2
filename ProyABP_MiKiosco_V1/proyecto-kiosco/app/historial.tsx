import { useCallback, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useFocusEffect } from 'expo-router'
import Boton from '../components/Boton'
import FilaMovimiento from '../components/FilaMovimiento'
import { obtenerHistorial } from '../services/movimientos'
import { tema } from '../styles/theme'
import type { MovimientoDetallado } from '../tipos/movimiento'

/** El historial de todos los movimientos de stock, del más nuevo al más viejo. */
export default function Historial() {
  const [movimientos, setMovimientos] = useState<MovimientoDetallado[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setMovimientos(await obtenerHistorial())
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
    } finally {
      setCargando(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      cargar()
    }, [cargar])
  )

  if (cargando) {
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
        <Text style={styles.error}>{error}</Text>
        <Boton texto="Reintentar" onPress={cargar} />
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
