import Constants from 'expo-constants'

/**
 * Dirección donde escucha la API (la de `api-y-base/API_Express`).
 *
 * No hace falta tocarla: se arma sola con la IP de la PC que corre
 * `npx expo start`, que es la misma donde corre la API. Así funciona en
 * cualquier máquina y también desde el celular, sin poner la IP a mano.
 *
 * Si la API corre en otra PC o en otro puerto, se puede forzar la dirección
 * con la variable EXPO_PUBLIC_API_URL (ver INSTALACION.md). El `/api` del final va incluido.
 */
const PUERTO_API = 3001

// hostUri viene como "192.168.100.14:8081": nos quedamos con la IP
const ipDeLaPc = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost'

export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${ipDeLaPc}:${PUERTO_API}/api`
