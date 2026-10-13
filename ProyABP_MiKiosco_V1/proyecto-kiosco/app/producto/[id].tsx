import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import Boton from '../../components/Boton'
import AccionesProducto from '../../components/AccionesProducto'
import Dato from '../../components/Dato'
import { obtenerProductoConStock } from '../../services/productos'
import { formatearFecha } from '../../utils/fecha'
import { tema, type Colores } from '../../styles/theme'
import { useColores } from '../../hooks/useColores'

/** El detalle de un producto. El id llega en la ruta (`/producto/4`) como texto. */
export default function DetalleProducto() {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const idProducto = Number(id)

  const { data: producto, isLoading, error, refetch } = useQuery({
    queryKey: ['producto', idProducto],
    queryFn: () => obtenerProductoConStock(idProducto),
  })

  if (Number.isNaN(idProducto)) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>La dirección no trae un id de producto válido.</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colores.secundario} />
      </View>
    )
  }

  if (error || !producto) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>{error ? error.message : 'No se encontró el producto.'}</Text>
        <Boton texto="Reintentar" icono="refresh" onPress={() => refetch()} />
      </View>
    )
  }

  const habilitado = producto.habilitado === 1

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <Text style={styles.nombre}>{producto.nombre}</Text>

      <Dato etiqueta="Descripción" valor={producto.descripcion || 'Sin descripción'} />

      <Dato
        etiqueta="Stock"
        valor={producto.cantidad === null ? 'Sin registrar' : `${producto.cantidad} unidades`}
        destacado
      />

      <Dato etiqueta="Estado" valor={habilitado ? 'Habilitado' : 'Inhabilitado'} />

      {!habilitado ? (
        <Dato
          etiqueta="Motivo de la baja"
          valor={`${producto.motivo_baja || 'Sin motivo registrado'} (${formatearFecha(producto.fecha_baja)})`}
        />
      ) : null}

      {habilitado ? (
        <Boton
          texto="Registrar movimiento de stock"
          icono="swap-vertical"
          onPress={() =>
            router.push({ pathname: '/movimiento/[id]', params: { id: producto.ID } })
          }
        />
      ) : (
        <Text style={styles.aviso}>
          Un producto inhabilitado no puede recibir movimientos de stock.
        </Text>
      )}

      <AccionesProducto producto={producto} />
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
    nombre: {
      fontSize: tema.tipografia.grande,
      fontWeight: '700',
      color: colores.texto,
    },
    error: {
      fontSize: tema.tipografia.media,
      color: colores.error,
      textAlign: 'center',
    },
    aviso: {
      fontSize: tema.tipografia.chica,
      color: colores.textoSuave,
    },
  })
}
