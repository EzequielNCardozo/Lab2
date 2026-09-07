/**
 * Un movimiento de stock, tal como lo devuelve GET /api/auditoria.
 *
 * La cantidad va en `ingreso` o en `egreso`; el otro queda en 0.
 */
export interface Movimiento {
  ID: number
  ingreso: number | null
  egreso: number | null
  observacion: string | null
  ID_stock: number | null
  ID_usuario: number | null
  fecha: string | null
}

/** Un movimiento con el nombre del producto y del responsable ya resueltos. */
export interface MovimientoDetallado {
  ID: number
  producto: string
  responsable: string
  tipo: 'ingreso' | 'egreso'
  cantidad: number
  observacion: string | null
  fecha: string | null
}

/** Lo que espera POST /api/stock/movimiento. */
export interface NuevoMovimiento {
  ID_producto: number
  /** 'I' = ingreso (suma), 'E' = egreso (resta). */
  tipo: 'I' | 'E'
  cantidad: number
  observacion: string
  ID_usuario: number
}
