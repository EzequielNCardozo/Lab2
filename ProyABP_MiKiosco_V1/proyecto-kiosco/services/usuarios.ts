import { traer } from './api'
import type { Usuario } from '../tipos/usuario'

/** Todos los usuarios. */
export function obtenerUsuarios(): Promise<Usuario[]> {
  return traer<Usuario[]>('/usuarios', 'los usuarios')
}

/** responsables de un movimiento nuevo. */
export async function obtenerUsuariosHabilitados(): Promise<Usuario[]> {
  const usuarios = await obtenerUsuarios()
  return usuarios.filter((usuario) => usuario.habilitado === 1)
}
