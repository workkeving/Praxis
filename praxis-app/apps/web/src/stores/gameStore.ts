import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Letra, Sala } from '@praxis/data';

export interface CasoResuelto {
  id: number;
  outcome: 'acierto' | 'error';
  intentos: number;
  fecha: string;
  especialidad: string;
  sala: Sala;
  respuestaDada?: Letra;
}

export interface EstadisticaEspecialidad {
  correctas: number;
  totales: number;
}

export type InsigniaId =
  | 'primera_consulta'
  | 'diagnostico_certero'
  | 'estudioso'
  | 'maestro_urgencias'
  | 'racha_fuego'
  | 'trasnochador'
  | 'generalista'
  | 'perfeccionista';

export const NIVELES = [
  { min: 0, nombre: 'Estudiante' },
  { min: 100, nombre: 'Interno' },
  { min: 250, nombre: 'Médico general' },
  { min: 500, nombre: 'R1' },
  { min: 850, nombre: 'R2' },
  { min: 1300, nombre: 'R3' },
  { min: 1850, nombre: 'Residente jefe' },
  { min: 2500, nombre: 'Especialista' },
  { min: 3250, nombre: 'Jefe de servicio' },
  { min: 4100, nombre: 'Maestro de la praxis' },
];

export interface GameState {
  // progreso global
  xp: number;
  racha: number;
  ultimoLogin: string | null;
  // casos
  casosResueltos: CasoResuelto[];
  casosPendientes: number[];
  // stats
  statsPorEspecialidad: Record<string, EstadisticaEspecialidad>;
  // insignias
  insignias: InsigniaId[];
  // config
  config: { notificaciones: boolean };

  // acciones
  registrarRespuesta: (
    idCaso: number,
    correcta: boolean,
    respuestaDada: Letra,
    especialidad: string,
    sala: Sala
  ) => { xpGanado: number; subioNivel: boolean; nivelAnterior: string; nivelNuevo: string };
  marcarLogin: () => void;
  desbloquearInsignia: (id: InsigniaId) => boolean;
  reiniciarProgreso: () => void;
}

const initialState = {
  xp: 0,
  racha: 0,
  ultimoLogin: null as string | null,
  casosResueltos: [] as CasoResuelto[],
  casosPendientes: [] as number[],
  statsPorEspecialidad: {} as Record<string, EstadisticaEspecialidad>,
  insignias: [] as InsigniaId[],
  config: { notificaciones: false },
};

function nivelActual(xp: number): { idx: number; nombre: string } {
  let idx = 0;
  for (let i = 0; i < NIVELES.length; i++) {
    if (xp >= NIVELES[i].min) idx = i;
  }
  return { idx, nombre: NIVELES[idx].nombre };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      registrarRespuesta: (idCaso, correcta, respuestaDada, especialidad, sala) => {
        const state = get();
        const yaResuelto = state.casosResueltos.find((c) => c.id === idCaso);
        const eraPendiente = state.casosPendientes.includes(idCaso);
        const intentos = yaResuelto ? yaResuelto.intentos + 1 : 1;

        let xpGanado = 0;
        if (correcta) {
          if (eraPendiente) xpGanado = 5;
          else if (intentos === 1) xpGanado = 10;
          else xpGanado = 3;
        }

        const nuevoCaso: CasoResuelto = {
          id: idCaso,
          outcome: correcta ? 'acierto' : 'error',
          intentos,
          fecha: new Date().toISOString(),
          especialidad,
          sala,
          respuestaDada,
        };
        const casosResueltos = yaResuelto
          ? state.casosResueltos.map((c) => (c.id === idCaso ? nuevoCaso : c))
          : [...state.casosResueltos, nuevoCaso];

        const casosPendientes = correcta
          ? state.casosPendientes.filter((id) => id !== idCaso)
          : state.casosPendientes.includes(idCaso)
          ? state.casosPendientes
          : [...state.casosPendientes, idCaso];

        const statsActual = state.statsPorEspecialidad[especialidad] ?? {
          correctas: 0,
          totales: 0,
        };
        const statsPorEspecialidad = {
          ...state.statsPorEspecialidad,
          [especialidad]: {
            correctas: statsActual.correctas + (correcta ? 1 : 0),
            totales: statsActual.totales + 1,
          },
        };

        const nivelAnterior = nivelActual(state.xp);
        const nuevoXp = state.xp + xpGanado;
        const nivelNuevo = nivelActual(nuevoXp);

        set({
          xp: nuevoXp,
          casosResueltos,
          casosPendientes,
          statsPorEspecialidad,
        });

        return {
          xpGanado,
          subioNivel: nivelNuevo.idx > nivelAnterior.idx,
          nivelAnterior: nivelAnterior.nombre,
          nivelNuevo: nivelNuevo.nombre,
        };
      },

      marcarLogin: () => {
        const hoy = new Date().toISOString().slice(0, 10);
        const state = get();
        if (state.ultimoLogin === hoy) return;
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        const fueAyer = state.ultimoLogin === ayer.toISOString().slice(0, 10);
        set({
          ultimoLogin: hoy,
          racha: fueAyer ? state.racha + 1 : 1,
        });
      },

      desbloquearInsignia: (id) => {
        const state = get();
        if (state.insignias.includes(id)) return false;
        set({ insignias: [...state.insignias, id] });
        return true;
      },

      reiniciarProgreso: () => set(initialState),
    }),
    {
      name: 'praxis:state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function getNivelActual(xp: number) {
  return nivelActual(xp);
}

export function getProgresoSiguienteNivel(xp: number): { actual: number; siguiente: number; porcentaje: number } {
  const { idx } = nivelActual(xp);
  const min = NIVELES[idx].min;
  const next = NIVELES[idx + 1]?.min ?? NIVELES[idx].min + 1000;
  return {
    actual: xp - min,
    siguiente: next - min,
    porcentaje: Math.min(100, ((xp - min) / (next - min)) * 100),
  };
}
