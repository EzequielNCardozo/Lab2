import { useEffect } from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { Stack, useRouter, useSegments, ThemeProvider, DarkTheme, DefaultTheme, type Theme } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSesion } from '../store/sesion'
import { paletas } from '../styles/theme'

// Guarda en caché lo que se trae de la API. Se crea una sola vez para toda la app.
const queryClient = new QueryClient()

/** Layout raíz: el tema, la navegación, el encabezado y el control de la sesión. */
export default function Layout() {
  const usuario = useSesion((estado) => estado.usuario)
  const segmentos = useSegments()
  const router = useRouter()

  // El modo (claro u oscuro) es el que tiene configurado el celular
  const esOscuro = useColorScheme() === 'dark'
  const colores = esOscuro ? paletas.oscuro : paletas.claro
  const base = esOscuro ? DarkTheme : DefaultTheme

  // El tema de la navegación con nuestros colores: pinta el encabezado y el fondo de las pantallas
  const temaNavegacion: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colores.secundario,
      background: colores.fondo,
      card: colores.superficie,
      text: colores.texto,
      border: colores.borde,
      notification: colores.error,
    },
  }

  // Sin sesión solo se puede estar en el login; con sesión, el login lleva al catálogo
  useEffect(() => {
    const enLogin = segmentos[0] === 'login'
    if (!usuario && !enLogin) router.replace('/login')
    if (usuario && enLogin) router.replace('/')
  }, [usuario, segmentos, router])

  return (
    <ThemeProvider value={temaNavegacion}>
      <QueryClientProvider client={queryClient}>
        {/* Arriba ya protege el encabezado; abajo evita que la barra del celular tape los botones */}
        <SafeAreaView style={[styles.pantalla, { backgroundColor: colores.fondo }]} edges={['bottom', 'left', 'right']}>
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Productos y stock' }} />
            <Stack.Screen name="login" options={{ title: 'Iniciar sesión', headerBackVisible: false }} />
            <Stack.Screen name="nuevo" options={{ title: 'Agregar producto' }} />
            <Stack.Screen name="escanear" options={{ title: 'Escanear código' }} />
            <Stack.Screen name="historial" options={{ title: 'Historial de movimientos' }} />
            <Stack.Screen name="reposicion" options={{ title: 'Pedido de reposición' }} />
            <Stack.Screen name="producto/[id]" options={{ title: 'Detalle del producto' }} />
            <Stack.Screen name="movimiento/[id]" options={{ title: 'Registrar movimiento' }} />
            <Stack.Screen name="editar/[id]" options={{ title: 'Modificar producto' }} />
            <Stack.Screen name="inhabilitar/[id]" options={{ title: 'Inhabilitar producto' }} />
          </Stack>
        </SafeAreaView>
        {/* auto: íconos de la barra de estado oscuros en modo claro y claros en modo oscuro */}
        <StatusBar style="auto" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
})
