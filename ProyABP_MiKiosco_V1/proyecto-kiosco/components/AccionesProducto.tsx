import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import Boton from './Boton'
import { cambiarEstadoProducto, eliminarProducto } from '../services/productos'
import { useSesion } from '../store/sesion'
import { tema } from '../styles/theme'
import type { ProductoConStock } from '../tipos/producto'

type Props = {
  producto: ProductoConStock
}

/** Los botones para modificar, habilitar o inhabilitar y eliminar un producto. */
export default function AccionesProducto({ producto }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const usuario = useSesion((estado) => estado.usuario)

  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const habilitado = producto.habilitado === 1

  async function habilitar() {
    if (!usuario) return
    setOcupado(true)
    setError(null)
    try {
      await cambiarEstadoProducto(producto.ID, true, null, usuario.ID)
      queryClient.invalidateQueries()
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
    } finally {
      setOcupado(false)
    }
  }

  async function eliminar() {
    setOcupado(true)
    setError(null)
    try {
      await eliminarProducto(producto.ID)
      // El producto ya no existe: se vuelve al listado y se saca del caché
      router.back()
      queryClient.removeQueries({ queryKey: ['producto', producto.ID] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    } catch (problema) {
      // La base explica por qué no se puede, por ejemplo si tiene movimientos
      setError(problema instanceof Error ? problema.message : String(problema))
      setConfirmandoBorrado(false)
      setOcupado(false)
    }
  }

  return (
    <View style={styles.acciones}>
      <Boton
        texto="Modificar producto"
        variante="secundario"
        onPress={() => router.push({ pathname: '/editar/[id]', params: { id: producto.ID } })}
      />

      {habilitado ? (
        <Boton
          texto="Inhabilitar producto"
          variante="secundario"
          onPress={() => router.push({ pathname: '/inhabilitar/[id]', params: { id: producto.ID } })}
        />
      ) : (
        <Boton texto="Habilitar producto" variante="secundario" onPress={habilitar} ocupado={ocupado} />
      )}

      {confirmandoBorrado ? (
        <View style={styles.confirmacion}>
          <Text style={styles.pregunta}>¿Eliminar {producto.nombre}? No se puede deshacer.</Text>
          <View style={styles.fila}>
            <View style={styles.opcion}>
              <Boton texto="Cancelar" variante="secundario" onPress={() => setConfirmandoBorrado(false)} />
            </View>
            <View style={styles.opcion}>
              <Boton texto="Eliminar" variante="peligro" onPress={eliminar} ocupado={ocupado} />
            </View>
          </View>
        </View>
      ) : (
        <Boton texto="Eliminar producto" variante="peligro" onPress={() => setConfirmandoBorrado(true)} />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  acciones: {
    gap: tema.espaciado.chico,
  },
  confirmacion: {
    gap: tema.espaciado.chico,
    borderColor: tema.colores.error,
    borderWidth: 1,
    borderRadius: tema.bordes.radio,
    padding: tema.espaciado.medio,
  },
  pregunta: {
    fontSize: tema.tipografia.media,
    color: tema.colores.texto,
  },
  fila: {
    flexDirection: 'row',
    gap: tema.espaciado.chico,
  },
  opcion: {
    flex: 1,
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
  },
})
