import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Boton from './Boton'
import CampoTexto from './CampoTexto'
import CampoCodigoBarras from './CampoCodigoBarras'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

type Props = {
  /** Valores con los que arranca: vacíos en el alta, los actuales al modificar. */
  nombreInicial?: string
  descripcionInicial?: string
  codigoInicial?: string
  stockMinimoInicial?: string
  textoBoton: string
  /** Guarda el producto; si falla, el mensaje del error se muestra en el formulario. */
  onGuardar: (nombre: string, descripcion: string, codigo: string, stockMinimo: number | null) => Promise<void>
}

/** El formulario del producto, compartido por el alta y la modificación. */
export default function FormularioProducto({
  nombreInicial = '',
  descripcionInicial = '',
  codigoInicial = '',
  stockMinimoInicial = '',
  textoBoton,
  onGuardar,
}: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const [nombre, setNombre] = useState(nombreInicial)
  const [descripcion, setDescripcion] = useState(descripcionInicial)
  const [codigo, setCodigo] = useState(codigoInicial)
  const [stockMinimo, setStockMinimo] = useState(stockMinimoInicial)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function guardar() {
    const nombreLimpio = nombre.trim()

    // La API no valida, así que un nombre vacío se guardaría vacío
    if (nombreLimpio === '') {
      setError('El nombre del producto es obligatorio.')
      return
    }

    const codigoLimpio = codigo.trim()
    if (!/^\d*$/.test(codigoLimpio)) {
      setError('El código de barras solo lleva números.')
      return
    }

    // Vacío quiere decir que el producto no entra en el pedido de reposición
    const minimo = stockMinimo.trim() === '' ? null : Number(stockMinimo)
    if (minimo !== null && (!Number.isInteger(minimo) || minimo < 0)) {
      setError('El stock mínimo tiene que ser un número entero, cero o mayor.')
      return
    }

    setGuardando(true)
    setError(null)

    try {
      await onGuardar(nombreLimpio, descripcion.trim(), codigoLimpio, minimo)
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
      setGuardando(false)
    }
  }

  // Los topes son los largos de las columnas en la base
  return (
    <View style={styles.formulario}>
      <CampoTexto
        etiqueta="Nombre"
        valor={nombre}
        onChangeText={setNombre}
        placeholder="Coca Cola 500ml"
        maximo={50}
      />

      <CampoTexto
        etiqueta="Descripción (opcional)"
        valor={descripcion}
        onChangeText={setDescripcion}
        placeholder="Gaseosa cola"
        multilinea
        maximo={100}
      />

      <CampoCodigoBarras valor={codigo} onChangeText={setCodigo} />

      <CampoTexto
        etiqueta="Stock mínimo (opcional)"
        valor={stockMinimo}
        onChangeText={setStockMinimo}
        placeholder="Con 5 o menos, entra en el pedido de reposición"
        soloNumeros
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Boton texto={textoBoton} icono="save-outline" onPress={guardar} ocupado={guardando} />
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    formulario: {
      gap: tema.espaciado.medio,
    },
    error: {
      fontSize: tema.tipografia.media,
      color: colores.error,
    },
  })
}
