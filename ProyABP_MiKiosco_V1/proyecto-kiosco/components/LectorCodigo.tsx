import { useEffect, useRef } from 'react'
import { View, Text, ActivityIndicator, Linking, StyleSheet } from 'react-native'
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import Boton from './Boton'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

type Props = {
  /** Recibe el código leído. */
  onLeido: (codigo: string) => void
  /** Mientras está en true no lee, por ejemplo mientras se busca el producto. */
  pausado?: boolean
}

/** La cámara que lee códigos de barras, con el pedido de permiso. */
export default function LectorCodigo({ onLeido, pausado = false }: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const [permiso, pedirPermiso] = useCameraPermissions()

  // La cámara avisa varias veces por segundo: sin esto, un mismo código se procesaría repetido
  const yaLeyo = useRef(false)

  // Cuando la pantalla vuelve a habilitar la lectura, se puede leer otro código
  useEffect(() => {
    if (!pausado) yaLeyo.current = false
  }, [pausado])

  function alLeer(resultado: BarcodeScanningResult) {
    if (yaLeyo.current || pausado) return
    yaLeyo.current = true
    onLeido(resultado.data)
  }

  // Todavía no se sabe si hay permiso
  if (!permiso) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colores.secundario} />
      </View>
    )
  }

  if (!permiso.granted) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>Para escanear hace falta permiso para usar la cámara.</Text>
        {/* Si ya lo rechazó, el celular no lo vuelve a preguntar: hay que ir a Ajustes */}
        {permiso.canAskAgain ? (
          <Boton texto="Dar permiso" icono="camera-outline" onPress={pedirPermiso} />
        ) : (
          <Boton texto="Abrir ajustes" icono="settings-outline" onPress={() => Linking.openSettings()} />
        )}
      </View>
    )
  }

  return (
    <View style={styles.contenedor}>
      <CameraView
        style={styles.camara}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
        onBarcodeScanned={alLeer}
      />
      <Text style={styles.ayuda}>Apuntá al código de barras del paquete.</Text>
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    contenedor: {
      flex: 1,
      gap: tema.espaciado.medio,
    },
    camara: {
      flex: 1,
      borderRadius: tema.bordes.radio,
      overflow: 'hidden',
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
    ayuda: {
      fontSize: tema.tipografia.media,
      color: colores.texto,
      textAlign: 'center',
    },
  })
}
