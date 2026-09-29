import { useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Boton from '../../components/Boton'
import CampoTexto from '../../components/CampoTexto'
import Dato from '../../components/Dato'
import { cambiarEstadoProducto, obtenerProductoConStock } from '../../services/productos'
import { useSesion } from '../../store/sesion'
import { tema } from '../../styles/theme'

/** Pantalla para dar de baja un producto: pide el motivo, que queda guardado. */
export default function InhabilitarProducto() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const usuario = useSesion((estado) => estado.usuario)
  const idProducto = Number(id)

  const { data: producto, isLoading, error: errorDeCarga, refetch } = useQuery({
    queryKey: ['producto', idProducto],
    queryFn: () => obtenerProductoConStock(idProducto),
  })

  const [motivo, setMotivo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function inhabilitar() {
    if (motivo.trim() === '') {
      setError('El motivo es obligatorio: es lo que queda registrado de la baja.')
      return
    }
    if (!usuario) return

    setGuardando(true)
    setError(null)

    try {
      await cambiarEstadoProducto(idProducto, false, motivo.trim(), usuario.ID)
      queryClient.invalidateQueries()
      router.back()
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
      setGuardando(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={tema.colores.secundario} />
      </View>
    )
  }

  if (errorDeCarga || !producto) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>
          {errorDeCarga ? errorDeCarga.message : 'No se encontró el producto.'}
        </Text>
        <Boton texto="Reintentar" onPress={() => refetch()} />
      </View>
    )
  }

  // La base no deja inhabilitar con stock: se avisa antes de pedir el motivo
  if (producto.cantidad !== null && producto.cantidad > 0) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.mensaje}>
          {producto.nombre} tiene {producto.cantidad} unidades en stock. Para inhabilitarlo,
          primero registrá un egreso hasta dejarlo en 0.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <Dato etiqueta="Producto" valor={producto.nombre} destacado />

      <CampoTexto
        etiqueta="Motivo de la baja"
        valor={motivo}
        onChangeText={setMotivo}
        placeholder="Producto discontinuado"
        multilinea
        maximo={200}
      />

      {usuario ? (
        <Dato etiqueta="Registra" valor={`${usuario.nombre} ${usuario.apellido}`} />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Boton texto="Inhabilitar producto" variante="peligro" onPress={inhabilitar} ocupado={guardando} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
  mensaje: {
    fontSize: tema.tipografia.media,
    color: tema.colores.textoSuave,
    textAlign: 'center',
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
    textAlign: 'center',
  },
})
