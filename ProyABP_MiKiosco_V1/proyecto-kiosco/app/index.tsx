import { useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import Boton from '../components/Boton'
import EncabezadoCatalogo from '../components/EncabezadoCatalogo'
import FilaProducto from '../components/FilaProducto'
import PestanasCatalogo, { type Pestana } from '../components/PestanasCatalogo'
import { obtenerProductosConStock } from '../services/productos'
import { useSesion } from '../store/sesion'
import { API_URL } from '../config'
import { tema, type Colores } from '../styles/theme'
import { useColores } from '../hooks/useColores'

/** Pantalla principal: el listado de productos con su stock, las pestañas y el buscador. */
export default function Inicio() {
  const colores = useColores()
  const styles = crearEstilos(colores)

  const router = useRouter()
  const { usuario, salir } = useSesion()
  const [busqueda, setBusqueda] = useState('')
  const [pestana, setPestana] = useState<Pestana>('todos')

  const { data: productos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['productos'],
    queryFn: obtenerProductosConStock,
  })

  // Pestaña y buscador filtran sobre lo que ya se trajo, sin volver a pedirle a la API.
  const termino = busqueda.trim().toLowerCase()
  const visibles = productos.filter(
    (producto) =>
      (pestana === 'todos' || producto.habilitado === (pestana === 'habilitados' ? 1 : 0)) &&
      producto.nombre.toLowerCase().includes(termino)
  )

  function contenido() {
    if (isLoading) {
      return (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={colores.secundario} />
          <Text style={styles.mensaje}>Cargando productos…</Text>
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centrado}>
          <Text style={styles.error}>
            {`${error.message}.\n\nRevisá que la API de Laboratorio I esté corriendo y que ${API_URL} sea la dirección correcta.`}
          </Text>
          <Boton texto="Reintentar" icono="refresh" onPress={() => refetch()} />
        </View>
      )
    }

    if (visibles.length === 0) {
      return (
        <View style={styles.centrado}>
          <Text style={styles.mensaje}>
            {productos.length === 0
              ? 'Todavía no hay productos cargados en el catálogo.'
              : termino !== ''
                ? `Ningún producto coincide con "${busqueda.trim()}".`
                : `No hay productos ${pestana}.`}
          </Text>
        </View>
      )
    }

    return (
      <FlatList
        style={styles.lista}
        data={visibles}
        keyExtractor={(producto) => String(producto.ID)}
        renderItem={({ item }) => (
          <FilaProducto
            producto={item}
            onPress={() => router.push({ pathname: '/producto/[id]', params: { id: item.ID } })}
          />
        )}
      />
    )
  }

  return (
    <View style={styles.pantalla}>
      <EncabezadoCatalogo
        atiende={usuario ? `${usuario.nombre} ${usuario.apellido}` : ''}
        onCerrarSesion={salir}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        onAgregar={() => router.push('/nuevo')}
        onHistorial={() => router.push('/historial')}
      />
      <PestanasCatalogo elegida={pestana} onElegir={setPestana} />
      {contenido()}
    </View>
  )
}

function crearEstilos(colores: Colores) {
  return StyleSheet.create({
    pantalla: {
      flex: 1,
      padding: tema.espaciado.medio,
    },
    lista: {
      flex: 1,
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
      color: colores.textoSuave,
      textAlign: 'center',
    },
    error: {
      fontSize: tema.tipografia.media,
      color: colores.error,
      textAlign: 'center',
    },
  })
}
