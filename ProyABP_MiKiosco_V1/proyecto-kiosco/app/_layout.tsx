import { Stack } from 'expo-router'
import { tema } from '../styles/theme'

/** Layout raíz: la navegación y el encabezado de todas las pantallas. */
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.colores.primario },
        headerTintColor: tema.colores.superficie,
        contentStyle: { backgroundColor: tema.colores.fondo },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Productos y stock' }} />
      <Stack.Screen name="nuevo" options={{ title: 'Agregar producto' }} />
      <Stack.Screen name="historial" options={{ title: 'Historial de movimientos' }} />
      <Stack.Screen name="producto/[id]" options={{ title: 'Detalle del producto' }} />
      <Stack.Screen name="movimiento/[id]" options={{ title: 'Registrar movimiento' }} />
    </Stack>
  )
}
