import { useState } from 'react'
import { View, Modal, StyleSheet } from 'react-native'
import Boton from './Boton'
import CampoTexto from './CampoTexto'
import LectorCodigo from './LectorCodigo'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

type Props = {
  valor: string
  onChangeText: (codigo: string) => void
}

/** El campo del código de barras: se escribe a mano o se escanea con la cámara. */
export default function CampoCodigoBarras({ valor, onChangeText }: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const [escaneando, setEscaneando] = useState(false)

  function alLeer(codigo: string) {
    onChangeText(codigo)
    setEscaneando(false)
  }

  // El tope es el largo de la columna: un EAN-13 tiene 13 dígitos
  return (
    <View style={styles.campo}>
      <CampoTexto
        etiqueta="Código de barras (opcional)"
        valor={valor}
        onChangeText={onChangeText}
        placeholder="7790895000997"
        soloNumeros
        maximo={13}
      />
      <Boton texto="Escanear código" icono="barcode-outline" variante="secundario" onPress={() => setEscaneando(true)} />

      <Modal visible={escaneando} animationType="slide" onRequestClose={() => setEscaneando(false)}>
        <View style={styles.modal}>
          <LectorCodigo onLeido={alLeer} />
          <Boton texto="Cancelar" variante="secundario" onPress={() => setEscaneando(false)} />
        </View>
      </Modal>
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    campo: {
      gap: tema.espaciado.chico,
    },
    modal: {
      flex: 1,
      padding: tema.espaciado.medio,
      gap: tema.espaciado.medio,
      backgroundColor: colores.fondo,
    },
  })
}
