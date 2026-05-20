import banco from './preguntas.json';
import type { BancoPreguntas, Pregunta, Sala, Especialidad, Letra } from './types';

export const bancoPreguntas = banco as BancoPreguntas;

export const todasLasPreguntas: Pregunta[] = bancoPreguntas.preguntas;

export function preguntasPorSala(sala: Sala): Pregunta[] {
  return todasLasPreguntas.filter((p) => p.sala === sala);
}

export function preguntasPorEspecialidad(esp: string): Pregunta[] {
  return todasLasPreguntas.filter((p) => p.especialidad === esp);
}

export function preguntaPorId(id: number): Pregunta | undefined {
  return todasLasPreguntas.find((p) => p.id === id);
}

export function preguntaAleatoria(filtro?: (p: Pregunta) => boolean): Pregunta {
  const pool = filtro ? todasLasPreguntas.filter(filtro) : todasLasPreguntas;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const especialidadesUnicas: string[] = Array.from(
  new Set(todasLasPreguntas.map((p) => p.especialidad))
);

export const salasDisponibles: Sala[] = ['urgencias', 'consultorio', 'hospitalizacion'];

export type { Pregunta, Opcion, FichaClinica, Explicacion, PalabraClave, Sala, Especialidad, Letra, BancoPreguntas } from './types';
