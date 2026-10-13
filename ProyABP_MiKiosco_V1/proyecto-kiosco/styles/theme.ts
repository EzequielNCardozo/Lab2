export interface Colores {
  primario: string
  secundario: string
  fondo: string
  superficie: string
  texto: string
  textoSuave: string
  /** El texto que va arriba de un fondo primario o secundario, como el de los botones. */
  textoSobrePrimario: string
  borde: string
  error: string
  exito: string
}

export interface Tema {
  tipografia: {
    grande: number
    media: number
    chica: number
  }
  espaciado: {
    chico: number
    medio: number
    grande: number
  }
  bordes: {
    radio: number
  }
  medidas: {
    logo: number
    icono: number
    lineaPestana: number
  }
}

// Una paleta por modo: el layout elige cuál según el modo del celular
export const paletas: { claro: Colores; oscuro: Colores } = {
  claro: {
    primario: '#1F1B16',
    secundario: '#B08D57',
    fondo: '#FAF7F2',
    superficie: '#FFFFFF',
    texto: '#2B2620',
    textoSuave: '#7A7168',
    textoSobrePrimario: '#FFFFFF',
    borde: '#E5DED3',
    error: '#B3261E',
    exito: '#1B5E20',
  },
  oscuro: {
    primario: '#D4B483',
    secundario: '#B08D57',
    fondo: '#171411',
    superficie: '#221E1A',
    texto: '#F2EDE6',
    textoSuave: '#A89F94',
    textoSobrePrimario: '#1A1714',
    borde: '#3A342D',
    error: '#F2B8B5',
    exito: '#81C784',
  },
}

// Tamaños y espacios: son iguales en los dos modos
export const tema: Tema = {
  tipografia: {
    grande: 24,
    media: 16,
    chica: 13,
  },
  espaciado: {
    chico: 8,
    medio: 16,
    grande: 24,
  },
  bordes: {
    radio: 10,
  },
  medidas: {
    logo: 120,
    icono: 20,
    lineaPestana: 3,
  },
}
