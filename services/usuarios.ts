import { traer, enviar } from './api'
import type { Usuario, UsuarioLogueado } from '../tipos/usuario'

/** Todos los usuarios. El historial los necesita, incluso los inhabilitados. */
export function obtenerUsuarios(): Promise<Usuario[]> {
  return traer<Usuario[]>('/usuarios', 'los usuarios')
}

/** Valida usuario y contraseña, y devuelve los datos de quien entra. */
export function iniciarSesion(usuario: string, contrasena: string): Promise<UsuarioLogueado> {
  return enviar<UsuarioLogueado>('/login', { usuario, contrasena }, 'iniciar sesión')
}
