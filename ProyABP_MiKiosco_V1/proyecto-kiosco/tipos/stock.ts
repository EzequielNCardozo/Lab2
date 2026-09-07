/**
 * Una fila de stock, tal como la devuelve GET /api/stock.
 *
 * `nombre` es el del producto, que agrega el JOIN del stored procedure.
 */
export interface Stock {
  ID_stock: number
  ID_producto: number
  nombre: string
  cantidad: number
}
