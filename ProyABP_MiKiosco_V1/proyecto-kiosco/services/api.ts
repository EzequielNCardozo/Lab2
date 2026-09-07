import { API_URL } from '../config'



/** Devuelve el mensaje de error que manda la API */
async function mensajeDeError(respuesta: Response, porDefecto: string): Promise<string> {
  try {
    const cuerpo: { error?: string; message?: string } = await respuesta.json()
    return cuerpo.error || cuerpo.message || porDefecto
  } catch {
    return porDefecto
  }
}


export async function traer<T>(ruta: string, queSePedia: string): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`)

  if (!respuesta.ok) {
    throw new Error(await mensajeDeError(respuesta, `El servidor no pudo devolver ${queSePedia}`))
  }

  return respuesta.json()
}

/** Manda datos a la API. */
export async function enviar(ruta: string, cuerpo: object, queSeQueriaHacer: string): Promise<void> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })

  if (!respuesta.ok) {
    throw new Error(await mensajeDeError(respuesta, `No se pudo ${queSeQueriaHacer}`))
  }
}
