import { motion } from 'framer-motion';
import { useGameStore, getNivelActual, getProgresoSiguienteNivel } from '../stores/gameStore';
import { todasLasPreguntas } from '@praxis/data';

interface Props {
  onSelectModo: (modo: 'urgencias' | 'consulta' | 'repaso' | 'simulacro') => void;
  onOpenExpediente: () => void;
}

interface SalaInfo {
  id: 'urgencias' | 'consultorio' | 'hospitalizacion';
  nombre: string;
  fondo: string;
  modo: 'urgencias' | 'consulta';
  descripcion: string;
}

const SALAS: SalaInfo[] = [
  {
    id: 'urgencias',
    nombre: 'Urgencias',
    fondo: '/assets/fondos/fondo_urgencias.png',
    modo: 'urgencias',
    descripcion: 'Casos agudos, trauma, toxicología',
  },
  {
    id: 'consultorio',
    nombre: 'Consultorio',
    fondo: '/assets/fondos/fondo_consultorio.png',
    modo: 'consulta',
    descripcion: 'Ambulatorio, gineco, psiquiatría, derma',
  },
  {
    id: 'hospitalizacion',
    nombre: 'Hospitalización',
    fondo: '/assets/fondos/fondo_hospitalizacion.png',
    modo: 'consulta',
    descripcion: 'Casos hospitalizados, UCI, complejos',
  },
];

export function Hub({ onSelectModo, onOpenExpediente }: Props) {
  const xp = useGameStore((s) => s.xp);
  const racha = useGameStore((s) => s.racha);
  const casosResueltos = useGameStore((s) => s.casosResueltos);
  const casosPendientes = useGameStore((s) => s.casosPendientes);
  const statsPorEspecialidad = useGameStore((s) => s.statsPorEspecialidad);

  const nivel = getNivelActual(xp);
  const progreso = getProgresoSiguienteNivel(xp);

  const dominioSala = (sala: SalaInfo['id']) => {
    const total = todasLasPreguntas.filter((p) => p.sala === sala).length;
    const correctas = casosResueltos.filter((c) => c.sala === sala && c.outcome === 'acierto').length;
    return { correctas, total, porcentaje: total > 0 ? Math.round((correctas / total) * 100) : 0 };
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-b from-praxis-900 via-praxis-800 to-praxis-900 safe-top safe-bottom">
      <div className="mx-auto w-full max-w-md px-4 pb-8 pt-4">
        {/* Header con logo, nivel y racha */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/assets/ui/logo.png" alt="Praxis" className="h-10 w-10 shrink-0 object-contain" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-praxis-300">Nivel</div>
              <div className="truncate font-display text-base font-bold text-warm-50">{nivel.nombre}</div>
            </div>
          </div>
          <button
            onClick={onOpenExpediente}
            aria-label="Mi expediente"
            className="shrink-0 rounded-2xl border border-warm-50/20 bg-warm-50/10 px-3 py-2 text-xs font-semibold text-warm-50 backdrop-blur-sm active:scale-95"
          >
            Expediente
          </button>
        </div>

        {/* Barra de XP */}
        <div className="mb-6 rounded-2xl border border-warm-50/15 bg-warm-50/5 p-3">
          <div className="mb-1 flex items-baseline justify-between text-xs">
            <span className="text-praxis-200">XP</span>
            <span className="font-mono font-semibold text-warm-50">{xp.toLocaleString()}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-praxis-900">
            <motion.div
              className="h-full bg-gradient-to-r from-praxis-300 to-praxis-400"
              initial={{ width: 0 }}
              animate={{ width: `${progreso.porcentaje}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-praxis-200">Racha</span>
            <span className="font-semibold text-warm-50">{racha} {racha === 1 ? 'día' : 'días'}</span>
          </div>
        </div>

        {/* Saludo de la asistente */}
        <div className="mb-5 rounded-2xl bg-warm-50/95 px-4 py-3 text-praxis-900 shadow-lg">
          <p className="font-medium leading-snug">
            ¿Qué hacemos hoy, doctor? Elige una sala para empezar.
          </p>
        </div>

        {/* Salas (mapa del hospital, vertical mobile-first) */}
        <div className="space-y-3">
          {SALAS.map((sala) => {
            const dom = dominioSala(sala.id);
            return (
              <motion.button
                key={sala.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectModo(sala.modo)}
                className="relative w-full overflow-hidden rounded-3xl border border-warm-50/20 shadow-xl active:shadow-md transition-shadow"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(22,46,44,0.85), rgba(22,46,44,0.45)), url('${sala.fondo}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  aspectRatio: '16 / 9',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-start justify-end p-4 text-left">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-praxis-200">
                    Sala
                  </div>
                  <div className="mb-1 font-display text-2xl font-bold text-warm-50">
                    {sala.nombre}
                  </div>
                  <div className="mb-2 text-sm text-warm-100">{sala.descripcion}</div>
                  <div className="flex items-center gap-2 text-xs text-warm-100">
                    <div className="flex h-2 w-24 overflow-hidden rounded-full bg-warm-50/20">
                      <div
                        className="h-full bg-praxis-300"
                        style={{ width: `${dom.porcentaje}%` }}
                      />
                    </div>
                    <span className="font-mono">
                      {dom.correctas}/{dom.total}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Modos especiales (repaso + simulacro) */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            disabled={casosPendientes.length === 0}
            onClick={() => onSelectModo('repaso')}
            className="rounded-2xl border-2 border-urgent-500/40 bg-urgent-500/10 p-3 text-left transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-urgent-400">
              Modo Repaso
            </div>
            <div className="font-display text-base font-bold text-warm-50">
              {casosPendientes.length} pendiente{casosPendientes.length === 1 ? '' : 's'}
            </div>
          </button>
          <button
            onClick={() => onSelectModo('simulacro')}
            className="rounded-2xl border-2 border-praxis-300/40 bg-praxis-300/10 p-3 text-left transition-all active:scale-95"
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-praxis-300">
              Simulacro
            </div>
            <div className="font-display text-base font-bold text-warm-50">Examen completo</div>
          </button>
        </div>

        {/* Pie con totales */}
        <div className="mt-6 text-center text-xs text-praxis-300">
          {casosResueltos.length} de {todasLasPreguntas.length} casos atendidos
          {' · '}
          {Object.keys(statsPorEspecialidad).length} especialidades
        </div>
      </div>
    </div>
  );
}
