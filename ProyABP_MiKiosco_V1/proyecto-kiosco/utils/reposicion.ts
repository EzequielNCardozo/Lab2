import type { ProductoConStock } from '../tipos/producto'

/**
 * Dice si un producto tiene que entrar en el pedido de reposición.
 *
 * Solo cuentan los habilitados que tienen un mínimo cargado. Sin fila de stock
 * no hay unidades, así que para comparar con el mínimo cuenta como 0.
 */
export function necesitaReposicion(producto: ProductoConStock): boolean {
  if (producto.habilitado === 0 || producto.stock_minimo === null) return false
  return (producto.cantidad ?? 0) <= producto.stock_minimo
}
