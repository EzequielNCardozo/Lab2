import { View, Text, StyleSheet } from 'react-native'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'
import { formatearFecha } from '../utils/fecha'
import type { MovimientoDetallado } from '../tipos/movimiento'

type Props = {
  movimiento: MovimientoDetallado
}

/** Una fila del historial: qué se movió, cuánto, quién lo registró y cuándo. */
export default function FilaMovimiento({ movimiento }: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const esIngreso = movimiento.tipo === 'ingreso'

  return (
    <View style={styles.fila}>
      <View style={styles.cantidad}>
        <Text style={[styles.numero, esIngreso ? styles.numeroIngreso : styles.numeroEgreso]}>
          {esIngreso ? '+' : '−'}
          {movimiento.cantidad}
        </Text>
      </View>

      <View style={styles.datos}>
        <Text style={styles.producto}>{movimiento.producto}</Text>
        {movimiento.observacion ? (
          <Text style={styles.observacion}>{movimiento.observacion}</Text>
        ) : null}
        <Text style={styles.pie}>
          {movimiento.responsable} · {formatearFecha(movimiento.fecha)}
        </Text>
      </View>
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    fila: {
      flexDirection: 'row',
      backgroundColor: colores.superficie,
      borderColor: colores.borde,
      borderWidth: 1,
      borderRadius: tema.bordes.radio,
      padding: tema.espaciado.medio,
      marginBottom: tema.espaciado.chico,
    },
    cantidad: {
      minWidth: 64,
    },
    numero: {
      fontSize: tema.tipografia.grande,
      fontWeight: '700',
    },
    numeroIngreso: {
      color: colores.exito,
    },
    numeroEgreso: {
      color: colores.error,
    },
    datos: {
      flex: 1,
    },
    producto: {
      fontSize: tema.tipografia.media,
      fontWeight: '600',
      color: colores.texto,
    },
    observacion: {
      fontSize: tema.tipografia.chica,
      color: colores.textoSuave,
      marginTop: 2,
    },
    pie: {
      fontSize: tema.tipografia.chica,
      color: colores.textoSuave,
      marginTop: tema.espaciado.chico,
    },
  })
}
