
export interface Tema {
  colores: {
    primario: string
    secundario: string
    fondo: string
    superficie: string
    texto: string
    textoSuave: string
    borde: string
    error: string
    exito: string
  }
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
}

export const tema: Tema = {
  colores: {
    primario: '#1F1B16',
    secundario: '#B08D57',
    fondo: '#FAF7F2',
    superficie: '#FFFFFF',
    texto: '#2B2620',
    textoSuave: '#7A7168',
    borde: '#E5DED3',
    error: '#B3261E',
    exito: '#1B5E20',
  },
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
}
