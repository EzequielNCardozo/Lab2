import { useState } from 'react'
import { Text, ScrollView, StyleSheet } from 'react-native'
import Boton from '../components/Boton'
import CampoTexto from '../components/CampoTexto'
import { iniciarSesion } from '../services/usuarios'
import { useSesion } from '../store/sesion'
import { tema } from '../styles/theme'

/** Pantalla para entrar con usuario y contraseña. */
export default function Login() {
  const entrar = useSesion((estado) => estado.entrar)

  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [ingresando, setIngresando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function ingresar() {
    if (usuario.trim() === '' || contrasena === '') {
      setError('Completá el usuario y la contraseña.')
      return
    }

    setIngresando(true)
    setError(null)

    try {
      // Al guardar el usuario, el layout lleva al catálogo
      entrar(await iniciarSesion(usuario.trim(), contrasena))
    } catch (problema) {
      setError(problema instanceof Error ? problema.message : String(problema))
      setIngresando(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <Text style={styles.titulo}>Kiosco</Text>

      <CampoTexto
        etiqueta="Usuario"
        valor={usuario}
        onChangeText={setUsuario}
        sinCorrector
        maximo={50}
      />

      <CampoTexto
        etiqueta="Contraseña"
        valor={contrasena}
        onChangeText={setContrasena}
        oculto
        sinCorrector
        maximo={100}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Boton texto="Ingresar" onPress={ingresar} ocupado={ingresando} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: tema.espaciado.grande,
    gap: tema.espaciado.medio,
  },
  titulo: {
    fontSize: tema.tipografia.grande,
    fontWeight: '700',
    color: tema.colores.texto,
    textAlign: 'center',
  },
  error: {
    fontSize: tema.tipografia.media,
    color: tema.colores.error,
    textAlign: 'center',
  },
})
