/** Un producto del catálogo, tal como lo devuelve GET /api/productos. */
export interface Producto {
  ID: number
  nombre: string
  descripcion: string | null
  /** 1 = habilitado, 0 = inhabilitado. */
  habilitado: number
  motivo_baja: string | null
  ID_usuario_baja: number | null
  fecha_baja: string | null
}

/**
 * Un producto con la cantidad que hay en stock.
 *

 */
export interface ProductoConStock extends Producto {
  /** null si el producto todavía no tiene registro de stock. */
  ID_stock: number | null
  cantidad: number | null
}
