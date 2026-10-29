import { useState } from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import LectorCodigo from '../components/LectorCodigo'
import { buscarPorCodigo } from '../services/productos'
import { tema } from '../styles/theme'

/** Escanea un paquete y lleva directo a registrar el movimiento de ese producto. */
export default function Escanear() {
  const router = useRouter()
  const [buscando, setBuscando] = useState(false)

  async function alLeer(codigo: string) {
    setBuscando(true)

    try {
      const producto = await buscarPorCodigo(codigo)

      // replace y no push: al volver del movimiento se vuelve al catálogo, no a la cámara
      if (producto) {
        router.replace({ pathname: '/movimiento/[id]', params: { id: producto.ID } })
        return
      }

      Alert.alert('Código sin cargar', `Ningún producto tiene el código ${codigo}. ¿Querés darlo de alta?`, [
        { text: 'Seguir escaneando', style: 'cancel', onPress: () => setBuscando(false) },
        { text: 'Dar de alta', onPress: () => router.replace({ pathname: '/nuevo', params: { codigo } }) },
      ])
    } catch (problema) {
      Alert.alert('No se pudo buscar el producto', problema instanceof Error ? problema.message : String(problema))
      setBuscando(false)
    }
  }

  return (
    <View style={styles.pantalla}>
      <LectorCodigo onLeido={alLeer} pausado={buscando} />
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: tema.espaciado.medio,
  },
})
