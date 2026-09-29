
import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSesion } from '../store/sesion'
import { tema } from '../styles/theme'

// Guarda en caché lo que se trae de la API. Se crea una sola vez para toda la app.
const queryClient = new QueryClient()

/** Layout raíz: la navegación, el encabezado y el control de la sesión. */
export default function Layout() {
  const usuario = useSesion((estado) => estado.usuario)
  const segmentos = useSegments()
  const router = useRouter()

  // Sin sesión solo se puede estar en el login; con sesión, el login lleva al catálogo
  useEffect(() => {
    const enLogin = segmentos[0] === 'login'
    if (!usuario && !enLogin) router.replace('/login')
    if (usuario && enLogin) router.replace('/')
  }, [usuario, segmentos, router])

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: tema.colores.primario },
          headerTintColor: tema.colores.superficie,
          contentStyle: { backgroundColor: tema.colores.fondo },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Productos y stock' }} />
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión', headerBackVisible: false }} />
        <Stack.Screen name="nuevo" options={{ title: 'Agregar producto' }} />
        <Stack.Screen name="historial" options={{ title: 'Historial de movimientos' }} />
        <Stack.Screen name="producto/[id]" options={{ title: 'Detalle del producto' }} />
        <Stack.Screen name="movimiento/[id]" options={{ title: 'Registrar movimiento' }} />
        <Stack.Screen name="editar/[id]" options={{ title: 'Modificar producto' }} />
        <Stack.Screen name="inhabilitar/[id]" options={{ title: 'Inhabilitar producto' }} />
      </Stack>
    </QueryClientProvider>
  )
}
=======
import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSesion } from '../store/sesion'
import { tema } from '../styles/theme'

// Guarda en caché lo que se trae de la API. Se crea una sola vez para toda la app.
const queryClient = new QueryClient()

/** Layout raíz: la navegación, el encabezado y el control de la sesión. */
export default function Layout() {
  const usuario = useSesion((estado) => estado.usuario)
  const segmentos = useSegments()
  const router = useRouter()

  // Sin sesión solo se puede estar en el login; con sesión, el login lleva al catálogo
  useEffect(() => {
    const enLogin = segmentos[0] === 'login'
    if (!usuario && !enLogin) router.replace('/login')
    if (usuario && enLogin) router.replace('/')
  }, [usuario, segmentos, router])

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: tema.colores.primario },
          headerTintColor: tema.colores.superficie,
          contentStyle: { backgroundColor: tema.colores.fondo },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Productos y stock' }} />
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión', headerBackVisible: false }} />
        <Stack.Screen name="nuevo" options={{ title: 'Agregar producto' }} />
        <Stack.Screen name="historial" options={{ title: 'Historial de movimientos' }} />
        <Stack.Screen name="producto/[id]" options={{ title: 'Detalle del producto' }} />
        <Stack.Screen name="movimiento/[id]" options={{ title: 'Registrar movimiento' }} />
      </Stack>
    </QueryClientProvider>
  )
}

