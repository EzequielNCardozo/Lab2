import type { Ref } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { fechaDeHoy } from '../utils/fecha'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'
import type { ProductoConStock } from '../tipos/producto'

type Props = {
  productos: ProductoConStock[]
  /** Apunta a la tarjeta: es lo que se convierte en imagen para compartir. */
  ref?: Ref<View>
}

/** La tarjeta del pedido de reposición, tal como llega por WhatsApp. */
export default function PedidoReposicion({ productos, ref }: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  // collapsable={false}: en Android, sin esto la vista puede no existir y no hay qué capturar.
  // Va map y no FlatList porque la imagen tiene que llevar todas las filas, y FlatList solo
  // dibuja las que entran en pantalla.
  return (
    <View ref={ref} collapsable={false} style={styles.tarjeta}>
      <Text style={styles.titulo}>Pedido de reposición</Text>
      <Text style={styles.fecha}>MiKiosco · {fechaDeHoy()}</Text>

      {productos.map((producto) => (
        <View key={producto.ID} style={styles.fila}>
          <Text style={styles.nombre}>{producto.nombre}</Text>
          <Text style={styles.cantidades}>
            Hay {producto.cantidad ?? 0} · mínimo {producto.stock_minimo}
          </Text>
        </View>
      ))}
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    // El fondo es obligatorio: sin él, la imagen sale transparente
    tarjeta: {
      backgroundColor: colores.superficie,
      borderColor: colores.borde,
      borderWidth: 1,
      borderRadius: tema.bordes.radio,
      padding: tema.espaciado.medio,
      gap: tema.espaciado.chico,
    },
    titulo: {
      fontSize: tema.tipografia.grande,
      fontWeight: '700',
      color: colores.texto,
    },
    fecha: {
      fontSize: tema.tipografia.chica,
      color: colores.textoSuave,
      marginBottom: tema.espaciado.chico,
    },
    fila: {
      borderTopColor: colores.borde,
      borderTopWidth: 1,
      paddingTop: tema.espaciado.chico,
    },
    nombre: {
      fontSize: tema.tipografia.media,
      fontWeight: '600',
      color: colores.texto,
    },
    cantidades: {
      fontSize: tema.tipografia.chica,
      color: colores.error,
    },
  })
}
