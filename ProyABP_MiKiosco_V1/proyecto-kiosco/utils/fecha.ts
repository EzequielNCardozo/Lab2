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
