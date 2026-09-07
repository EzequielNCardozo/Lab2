import { traer, enviar } from './api'
import type { Producto, ProductoConStock } from '../tipos/producto'
import type { Stock } from '../tipos/stock'

/** Todas las llamadas del catálogo. Las pantallas nunca usan fetch. */

/** Trae todos los productos del catálogo. */
export function obtenerProductos(): Promise<Producto[]> {
  return traer<Producto[]>('/productos', 'el listado de productos')
}

/** Trae los registros de stock: uno por producto que tenga stock creado. */
export function obtenerStock(): Promise<Stock[]> {
  return traer<Stock[]>('/stock', 'el stock')
}

/** Trae un producto solo, sin su stock. */
export function obtenerProducto(id: number): Promise<Producto> {
  return traer<Producto>(`/productos/${id}`, 'el producto')
}

/**
 * El listado de productos con su stock.
 *
 * Son dos pedidos porque la API expone Producto y Stock por separado. Se
 * recorren los productos, para que uno sin stock creado aparezca igual.
 */
export async function obtenerProductosConStock(): Promise<ProductoConStock[]> {
  const [productos, stock] = await Promise.all([obtenerProductos(), obtenerStock()])

  const stockPorProducto = new Map(stock.map((fila) => [fila.ID_producto, fila]))

  return productos.map((producto) => {
    const suStock = stockPorProducto.get(producto.ID)
    return {
      ...producto,
      ID_stock: suStock ? suStock.ID_stock : null,
      cantidad: suStock ? suStock.cantidad : null,
    }
  })
}

/**
 * El detalle de un producto con su stock.
 *
 * El stock se pide entero porque GET /api/stock/:id espera un ID_stock, no un
 * ID_producto.
 */
export async function obtenerProductoConStock(id: number): Promise<ProductoConStock> {
  const [producto, stock] = await Promise.all([obtenerProducto(id), obtenerStock()])

  const suStock = stock.find((fila) => fila.ID_producto === id)

  return {
    ...producto,
    ID_stock: suStock ? suStock.ID_stock : null,
    cantidad: suStock ? suStock.cantidad : null,
  }
}

/** Da de alta un producto. El ID lo genera la base. */
export function agregarProducto(nombre: string, descripcion: string): Promise<void> {
  return enviar('/productos', { nombre, descripcion }, 'agregar el producto')
}

/**
 * Crea la fila de stock de un producto que todavía no la tenía.
 *
 * Sin esa fila, un movimiento no tiene qué actualizar y no queda registrado.
 */
export function crearStockInicial(ID_producto: number, cantidad: number): Promise<void> {
  return enviar('/stock', { ID_producto, cantidad }, 'crear el stock inicial del producto')
}
