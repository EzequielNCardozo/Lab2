/** Un usuario, tal como lo devuelve GET /api/usuarios. */
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

/** El usuario que inició sesión, tal como lo devuelve POST /api/login. */
export interface UsuarioLogueado {
  ID: number
  usuario: string
  nombre: string
  apellido: string
  mail: string | null
  habilitado: number
}
