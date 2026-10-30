/**
 * Pasa la fecha que manda la API (ISO) a dd/mm/aaaa.
 *
 * Se corta el texto en vez de construir un Date, para no meter la zona horaria.
 */
export function formatearFecha(iso: string | null): string {
  if (!iso) return 'sin fecha'

  const [anio, mes, dia] = iso.slice(0, 10).split('-')
  if (!anio || !mes || !dia) return 'sin fecha'

  return `${dia}/${mes}/${anio}`
}

/** La fecha de hoy en dd/mm/aaaa, según el reloj del celular. */
export function fechaDeHoy(): string {
  const hoy = new Date()
  const dia = String(hoy.getDate()).padStart(2, '0')
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}/${hoy.getFullYear()}`
}
