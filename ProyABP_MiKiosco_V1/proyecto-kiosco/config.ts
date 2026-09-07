/**
 * Dirección donde escucha la API, que es la de Laboratorio I.
 *
 * Es lo único que hay que cambiar de una máquina a otra. Va la IP de la PC y no
 * `localhost`, así funciona también desde el celular; si el router la cambia,
 * se saca con `ipconfig` y se actualiza acá. El `/api` del final va incluido.
 */
export const API_URL = 'http://192.168.X.X:3001/api'
