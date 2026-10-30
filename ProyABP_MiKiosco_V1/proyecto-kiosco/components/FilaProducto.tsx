import { View, Text, Pressable, StyleSheet } from 'react-native'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'
import { necesitaReposicion } from '../utils/reposicion'
import type { ProductoConStock } from '../tipos/producto'

type Props = {
  producto: ProductoConStock
  onPress: () => void
}

/** Una fila del listado: el producto de un lado y su stock del otro. */
export default function FilaProducto({ producto, onPress }: Props) {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const sinRegistrar = producto.cantidad === null

  return (
    <Pressable style={styles.fila} onPress={onPress}>
      <View style={styles.datos}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        {producto.descripcion ? (
          <Text style={styles.descripcion}>{producto.descripcion}</Text>
        ) : null}
        {producto.habilitado === 0 ? (
          <Text style={styles.aviso}>Inhabilitado</Text>
        ) : null}
        {necesitaReposicion(producto) ? (
          <Text style={styles.aviso}>Para reponer (mínimo {producto.stock_minimo})</Text>
        ) : null}
      </View>

      <View style={styles.stock}>
        {/* Un guión y no un 0: sin registro de stock no es lo mismo que cero. */}
        <Text style={[styles.cantidad, sinRegistrar && styles.cantidadSuave]}>
          {sinRegistrar ? '—' : producto.cantidad}
        </Text>
        <Text style={styles.etiqueta}>{sinRegistrar ? 'sin registrar' : 'unidades'}</Text>
      </View>
    </Pressable>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    fila: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colores.superficie,
      borderColor: colores.borde,
      borderWidth: 1,
      borderRadius: tema.bordes.radio,
      padding: tema.espaciado.medio,
      marginBottom: tema.espaciado.chico,
    },
    datos: {
      flex: 1,
      paddingRight: tema.espaciado.medio,
    },
    nombre: {
      fontSize: tema.tipografia.media,
      fontWeight: '600',
      color: colores.texto,
    },
    descripcion: {
      fontSize: tema.tipografia.chica,
      color: colores.textoSuave,
      marginTop: 2,
    },
    aviso: {
      fontSize: tema.tipografia.chica,
      color: colores.error,
      marginTop: tema.espaciado.chico,
    },
    stock: {
      alignItems: 'center',
      minWidth: 72,
    },
    cantidad: {
      fontSize: tema.tipografia.grande,
      fontWeight: '700',
      color: colores.primario,
    },
    cantidadSuave: {
      color: colores.textoSuave,
    },
    etiqueta: {
      fontSize: tema.tipografia.chica,
      color: colores.textoSuave,
    },
  })
}
