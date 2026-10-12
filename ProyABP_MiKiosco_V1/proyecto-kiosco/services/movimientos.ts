import { traer, enviar } from './api'
import { obtenerStock } from './productos'
import { obtenerUsuarios } from './usuarios'
import type { Movimiento, MovimientoDetallado, NuevoMovimiento, PaginaHistorial } from '../tipos/movimiento'

// Cuántos movimientos trae cada página del historial
const POR_PAGINA = 5

/** ingreso o un egreso de stock. */
export function registrarMovimiento(movimiento: NuevoMovimiento): Promise<void> {
  return enviar('/stock/movimiento', movimiento, 'registrar el movimiento')
}

/**El historial de movimientos, con nombre de producto y de responsable.*/
export async function obtenerHistorial(): Promise<MovimientoDetallado[]> {
  const [movimientos, stock, usuarios] = await Promise.all([
    traer<Movimiento[]>('/auditoria', 'el historial de movimientos'),
    obtenerStock(),
    obtenerUsuarios(),
  ])

  const productoPorStock = new Map(stock.map((fila) => [fila.ID_stock, fila.nombre]))
  const responsablePorUsuario = new Map(
    usuarios.map((usuario) => [usuario.ID, `${usuario.nombre} ${usuario.apellido}`])
  )

  return movimientos
    .map((movimiento): MovimientoDetallado => {
      const ingreso = movimiento.ingreso || 0
      const egreso = movimiento.egreso || 0
      const esIngreso = ingreso > 0

      return {
        ID: movimiento.ID,
        producto:
          movimiento.ID_stock === null
            ? 'Producto sin identificar'
            : productoPorStock.get(movimiento.ID_stock) || 'Producto dado de baja',
        responsable:
          movimiento.ID_usuario === null
            ? 'Sin responsable'
            : responsablePorUsuario.get(movimiento.ID_usuario) || 'Usuario eliminado',
        tipo: esIngreso ? 'ingreso' : 'egreso',
        cantidad: esIngreso ? ingreso : egreso,
        observacion: movimiento.observacion,
        fecha: movimiento.fecha,
      }
    })
    .sort((uno, otro) => {
      const fechaUno = uno.fecha || ''
      const fechaOtro = otro.fecha || ''
      if (fechaUno !== fechaOtro) return fechaOtro.localeCompare(fechaUno)
      return otro.ID - uno.ID
    })
}

/** Una página del historial. La API no pagina, así que se trae todo y se corta acá. */
export async function obtenerPaginaHistorial(desde: number): Promise<PaginaHistorial> {
  const todos = await obtenerHistorial()
  const hasta = desde + POR_PAGINA

  return {
    movimientos: todos.slice(desde, hasta),
    siguiente: hasta < todos.length ? hasta : undefined,
  }
}
