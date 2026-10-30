import { useRef, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import * as Sharing from 'expo-sharing'
import { captureRef } from 'react-native-view-shot'
import Boton from '../components/Boton'
import PedidoReposicion from '../components/PedidoReposicion'
import { obtenerProductosAReponer } from '../services/productos'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

/** El pedido de reposición: los productos en su mínimo, listos para mandar por WhatsApp. */
export default function Reposicion() {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const pedidoRef = useRef<View>(null)
  const [compartiendo, setCompartiendo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Empieza con 'productos': al dar de alta o mover stock se invalida junto con el catálogo
  const { data: productos = [], isLoading, error: errorDeCarga, refetch } = useQuery({
    queryKey: ['productos', 'reposicion'],
    queryFn: obtenerProductosAReponer,
  })

  async function compartir() {
    setCompartiendo(true)
    setError(null)

    try {
      if (!(await Sharing.isAvailableAsync())) {
        setError('Este dispositivo no permite compartir. Probalo en el celular con Expo Go.')
        return
      }

      // Saca una imagen solo de la tarjeta del pedido, no de toda la pantalla
      const imagen = await captureRef(pedidoRef, { format: 'png', quality: 1 })

      // Abre el menú de compartir del celular: ahí se elige WhatsApp y el contacto
      await Sharing.shareAsync(imagen, { mimeType: 'image/png', dialogTitle: 'Pedido de reposición' })
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
    } finally {
      setCompartiendo(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colores.secundario} />
      </View>
    )
  }

  if (errorDeCarga) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{errorDeCarga.message}</Text>
        <Boton texto="Reintentar" icono="refresh" onPress={() => refetch()} />
      </View>
    )
  }

  if (productos.length === 0) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>
          No hay productos para reponer. Entran los que tienen un stock mínimo cargado y llegaron a ese mínimo.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <PedidoReposicion ref={pedidoRef} productos={productos} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Boton texto="Compartir por WhatsApp" icono="share-social-outline" onPress={compartir} ocupado={compartiendo} />
    </ScrollView>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    pantalla: {
      padding: tema.espaciado.medio,
      gap: tema.espaciado.medio,
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
