import { create } from 'zustand'
import type { UsuarioLogueado } from '../tipos/usuario'

/** Lo que guarda el store de la sesión y las acciones que lo cambian. */
interface SesionStore {
  usuario: UsuarioLogueado | null
  entrar: (usuario: UsuarioLogueado) => void
  salir: () => void
}

/** Guarda quién inició sesión, para que cualquier pantalla lo pueda leer. */
export const useSesion = create<SesionStore>((set) => ({
  // Nadie entró todavía
  usuario: null,

  entrar: (usuario) => set({ usuario }),

  salir: () => set({ usuario: null }),
}))
