import { motion } from 'framer-motion';
import { useGameStore, getNivelActual } from '../stores/gameStore';
import { todasLasPreguntas } from '@praxis/data';

interface Props {
  onClose: () => void;
}

export function Expediente({ onClose }: Props) {
  const xp = useGameStore((s) => s.xp);
  const racha = useGameStore((s) => s.racha);
  const casosResueltos = useGameStore((s) => s.casosResueltos);
  const casosPendientes = useGameStore((s) => s.casosPendientes);
  const stats = useGameStore((s) => s.statsPorEspecialidad);
  const insignias = useGameStore((s) => s.insignias);
  const reiniciar = useGameStore((s) => s.reiniciarProgreso);
  const nivel = getNivelActual(xp);

  const aciertos = casosResueltos.filter((c) => c.outcome === 'acierto').length;
  const aciertosPrimerIntento = casosResueltos.filter(
    (c) => c.outcome === 'acierto' && c.intentos === 1
  ).length;

  const especialidadesOrdenadas = Object.entries(stats).sort(
    ([, a], [, b]) => b.totales - a.totales
  );

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      className="absolute inset-0 z-40 overflow-y-auto bg-gradient-to-b from-praxis-900 to-praxis-800 safe-top safe-bottom"
    >
      <div className="mx-auto max-w-md px-5 pb-12 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-warm-50">Mi Expediente</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-warm-50/30 px-3 py-1 text-sm font-semibold text-warm-50 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Resumen tarjetas */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-warm-50/15 bg-warm-50/5 p-3">
            <div className="text-xs text-praxis-300">Nivel</div>
            <div className="font-display text-lg font-bold text-warm-50">{nivel.nombre}</div>
          </div>
          <div className="rounded-2xl border border-warm-50/15 bg-warm-50/5 p-3">
            <div className="text-xs text-praxis-300">XP</div>
            <div className="font-mono text-lg font-bold text-warm-50">{xp.toLocaleString()}</div>
          </div>
          <div className="rounded-2xl border border-warm-50/15 bg-warm-50/5 p-3">
            <div className="text-xs text-praxis-300">Racha</div>
            <div className="font-display text-lg font-bold text-warm-50">
              {racha} {racha === 1 ? 'día' : 'días'}
            </div>
          </div>
          <div className="rounded-2xl border border-warm-50/15 bg-warm-50/5 p-3">
            <div className="text-xs text-praxis-300">Pendientes</div>
            <div className="font-display text-lg font-bold text-warm-50">
              {casosPendientes.length}
            </div>
          </div>
        </div>

        {/* Casos */}
        <div className="mb-5 rounded-2xl border border-warm-50/15 bg-warm-50/5 p-4">
          <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-praxis-300">
            Casos
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-display text-2xl font-bold text-warm-50">
                {casosResueltos.length}
              </div>
              <div className="text-xs text-praxis-300">Atendidos</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-green-400">{aciertos}</div>
              <div className="text-xs text-praxis-300">Aciertos</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-praxis-300">
                {aciertosPrimerIntento}
              </div>
              <div className="text-xs text-praxis-300">Salvados</div>
            </div>
          </div>
          <div className="mt-3 text-center text-xs text-praxis-300">
            de {todasLasPreguntas.length} casos totales del banco
          </div>
        </div>

        {/* Insignias */}
        {insignias.length > 0 && (
          <div className="mb-5 rounded-2xl border border-warm-50/15 bg-warm-50/5 p-4">
            <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-praxis-300">
              Insignias
            </h3>
            <div className="flex flex-wrap gap-2">
              {insignias.map((id) => (
                <div
                  key={id}
                  className="rounded-full bg-praxis-300/20 px-3 py-1 text-sm font-semibold text-praxis-200"
                >
                  {id.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dominio por especialidad */}
        {especialidadesOrdenadas.length > 0 && (
          <div className="mb-5 rounded-2xl border border-warm-50/15 bg-warm-50/5 p-4">
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-praxis-300">
              Por especialidad
            </h3>
            <div className="space-y-2">
              {especialidadesOrdenadas.map(([esp, s]) => {
                const pct = s.totales > 0 ? Math.round((s.correctas / s.totales) * 100) : 0;
                return (
                  <div key={esp}>
                    <div className="mb-1 flex items-baseline justify-between text-xs">
                      <span className="font-semibold capitalize text-warm-50">
                        {esp.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono text-praxis-300">
                        {s.correctas}/{s.totales} · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-praxis-900">
                      <div
                        className="h-full bg-gradient-to-r from-praxis-300 to-praxis-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reset */}
        <button
          onClick={() => {
            if (confirm('¿Reiniciar todo el progreso? No se puede deshacer.')) reiniciar();
          }}
          className="w-full rounded-2xl border-2 border-urgent-500/40 bg-urgent-500/10 py-3 text-sm font-semibold text-urgent-400 active:scale-95"
        >
          Reiniciar progreso
        </button>
      </div>
    </motion.div>
  );
}
