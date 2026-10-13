import { useTheme } from 'expo-router'
import { paletas, type Colores } from '../styles/theme'

/**
 * Los colores del modo que eligió el ThemeProvider del layout (claro u oscuro).
 *
 * Como cambian con el modo, cada pantalla arma sus estilos con crearEstilos(colores).
 */
export function useColores(): Colores {
  const { dark } = useTheme()
  return dark ? paletas.oscuro : paletas.claro
}
