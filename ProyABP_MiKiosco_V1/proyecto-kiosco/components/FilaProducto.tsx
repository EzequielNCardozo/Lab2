import { View, Text, Pressable, StyleSheet } from 'react-native'
import { tema } from '../styles/theme'
import type { ProductoConStock } from '../tipos/producto'

type Props = {
  producto: ProductoConStock
  onPress: () => void
}

/** Una fila del listado: el producto de un lado y su stock del otro. */
export default function FilaProducto({ producto, onPress }: Props) {
  const sinRegistrar = producto.cantidad === null

  return (
    <Pressable style={styles.fila} onPress={onPress}>
      <View style={styles.datos}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        {producto.descripcion ? (
          <Text style={styles.descripcion}>{producto.descripcion}</Text>
        ) : null}
        {producto.habilitado === 0 ? (
          <Text style={styles.inhabilitado}>Inhabilitado</Text>
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

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tema.colores.superficie,
    borderColor: tema.colores.borde,
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
    color: tema.colores.texto,
  },
  descripcion: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
    marginTop: 2,
  },
  inhabilitado: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.error,
    marginTop: tema.espaciado.chico,
  },
  stock: {
    alignItems: 'center',
    minWidth: 72,
  },
  cantidad: {
    fontSize: tema.tipografia.grande,
    fontWeight: '700',
    color: tema.colores.primario,
  },
  cantidadSuave: {
    color: tema.colores.textoSuave,
  },
  etiqueta: {
    fontSize: tema.tipografia.chica,
    color: tema.colores.textoSuave,
  },
})
