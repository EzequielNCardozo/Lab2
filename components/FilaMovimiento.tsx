import { View, Text, StyleSheet } from 'react-native'
import { tema } from '../styles/theme'
import { formatearFecha } from '../utils/fecha'
import type { MovimientoDetallado } from '../tipos/movimiento'

type Props = {
  movimiento: MovimientoDetallado
}

/** Una fila del historial: qué se movió, cuánto, quién lo registró y cuándo. */
export default function FilaMovimiento({ movimiento }: Props) {
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

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    backgroundColor: tema.colores.superficie,
    borderColor: tema.colores.borde,
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
    color: tema.colores.exito,
  },
  numeroEgreso: {
    color: tema.colores.error,
  },
  datos: {
    flex: 1,
  },
  producto: {
    fontSize: tema.tipografia.media,
    fontWeight: '600',
    color: tema.colores.texto,
  },
  observacion: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
    marginTop: 2,
  },
  pie: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
    marginTop: tema.espaciado.chico,
  },
})
