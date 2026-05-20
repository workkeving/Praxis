export type Sala = 'urgencias' | 'consultorio' | 'hospitalizacion';

export type Especialidad =
  | 'cirugia' | 'pediatria' | 'ortopedia' | 'neurologia' | 'cardiologia'
  | 'obstetricia' | 'toxicologia' | 'ginecologia' | 'psiquiatria'
  | 'neumologia' | 'oftalmologia' | 'otorrinolaringologia'
  | 'gastroenterologia' | 'medicina_interna' | 'urologia' | 'dermatologia'
  | 'medicina_preventiva' | 'reumatologia' | 'endocrinologia' | 'nefrologia';

export type Letra = 'a' | 'b' | 'c' | 'd';

export interface Opcion {
  letra: Letra;
  texto: string;
}

export interface FichaClinica {
  paciente?: string;
  tiempo_evolucion?: string;
  sintomas?: string;
  examen?: string;
  [key: string]: string | undefined;
}

export interface Explicacion {
  tldr: string;
  tratamiento?: string;
  por_que_otras_no: Partial<Record<Letra, string>>;
}

export interface PalabraClave {
  termino: string;
  wiki: string;
}

export interface Pregunta {
  id: number;
  especialidad: Especialidad | string;
  sala: Sala;
  dificultad: 1 | 2 | 3;
  llegada: string;
  narracion_caso: string;
  ficha_clinica: FichaClinica;
  pregunta: string;
  opciones: Opcion[];
  correcta: Letra;
  reaccion_acierto: string;
  reaccion_error: string;
  explicacion: Explicacion;
  cierre_acierto: string;
  cierre_error: string;
  palabras_clave: PalabraClave[];
  revisar?: boolean;
  nota_revisar?: string;
}

export interface BancoPreguntas {
  metadata: {
    proyecto: string;
    fuente: string;
    total_preguntas: number;
    version: string;
    fecha_proceso: string;
    nota_critica: string;
    estilo: string;
  };
  preguntas: Pregunta[];
}
