/**
 * Un usuario, tal como lo devuelve GET /api/usuarios.
 *
 * La app no tiene login: los usa solo para saber quién registra cada movimiento.
 */
export interface Usuario {
  ID: number
  usuario: string
  nombre: string
  apellido: string
  mail: string | null
  habilitado: number
  motivo_baja: string | null
  ID_usuario_baja: number | null
  fecha_baja: string | null
}
