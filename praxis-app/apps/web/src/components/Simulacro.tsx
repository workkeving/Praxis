import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { todasLasPreguntas, type Pregunta, type Letra } from '@praxis/data';
import { useGameStore } from '../stores/gameStore';

type Estado = 'intro' | 'corriendo' | 'resultado';

const TIEMPO_TOTAL_SEG = 60 * 60 * 2; // 2 horas

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  onClose: () => void;
}

export function Simulacro({ onClose }: Props) {
  const [estado, setEstado] = useState<Estado>('intro');
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Record<number, Letra>>({});
  const [idx, setIdx] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_TOTAL_SEG);
  const registrarRespuesta = useGameStore((s) => s.registrarRespuesta);

  function iniciar() {
    setPreguntas(shuffle(todasLasPreguntas));
    setRespuestas({});
    setIdx(0);
    setTiempoRestante(TIEMPO_TOTAL_SEG);
    setEstado('corriendo');
  }

  useEffect(() => {
    if (estado !== 'corriendo') return;
    const t = setInterval(() => {
      setTiempoRestante((s) => {
        if (s <= 1) {
          clearInterval(t);
          terminarYRegistrar();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  function terminarYRegistrar() {
    // Registrar todas las respuestas en bloque
    Object.entries(respuestas).forEach(([id, letra]) => {
      const p = preguntas.find((x) => x.id === Number(id));
      if (!p) return;
      registrarRespuesta(p.id, letra === p.correcta, letra, p.especialidad, p.sala);
    });
    setEstado('resultado');
  }

  const resultados = useMemo(() => {
    if (estado !== 'resultado') return null;
    const aciertos: Record<string, { c: number; t: number }> = {};
    let total = 0;
    let correctas = 0;
    preguntas.forEach((p) => {
      const r = respuestas[p.id];
      total++;
      if (!aciertos[p.especialidad]) aciertos[p.especialidad] = { c: 0, t: 0 };
      aciertos[p.especialidad].t++;
      if (r === p.correcta) {
        correctas++;
        aciertos[p.especialidad].c++;
      }
    });
    return { total, correctas, porEsp: aciertos };
  }, [estado, preguntas, respuestas]);

  const min = Math.floor(tiempoRestante / 60);
  const seg = tiempoRestante % 60;
  const pActual = preguntas[idx];

  if (estado === 'intro') {
    return (
      <div className="safe-top safe-bottom flex h-full flex-col items-center justify-center bg-gradient-to-b from-praxis-900 to-praxis-800 px-6 text-center">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-praxis-300">
          Modo
        </div>
        <h1 className="mb-4 font-display text-4xl font-bold text-warm-50">Simulacro</h1>
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-warm-100">
          {todasLasPreguntas.length} preguntas mezcladas de todas las especialidades. 2 horas.
          Sin retroalimentación durante el examen. Al final ves tu desempeño por especialidad.
        </p>
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={iniciar}
            className="w-full rounded-full bg-praxis-500 py-4 font-display text-lg font-bold text-warm-50 shadow-2xl active:scale-95"
          >
            Iniciar examen
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-full border border-warm-50/30 py-3 font-semibold text-warm-50 active:scale-95"
          >
            Volver al hub
          </button>
        </div>
      </div>
    );
  }

  if (estado === 'corriendo' && pActual) {
    const seleccion = respuestas[pActual.id];
    return (
      <div className="safe-top safe-bottom flex h-full flex-col bg-gradient-to-b from-praxis-900 to-praxis-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-warm-50/10 px-4 py-3">
          <div className="text-sm font-mono text-praxis-300">
            {idx + 1} / {preguntas.length}
          </div>
          <div
            className={`rounded-full px-3 py-1 font-mono text-sm font-semibold ${
              tiempoRestante < 5 * 60
                ? 'bg-urgent-500/20 text-urgent-400'
                : 'bg-warm-50/10 text-warm-50'
            }`}
          >
            {min.toString().padStart(2, '0')}:{seg.toString().padStart(2, '0')}
          </div>
          <button
            onClick={() => {
              if (confirm('¿Terminar el simulacro ahora?')) terminarYRegistrar();
            }}
            className="text-xs font-semibold text-urgent-400"
          >
            Terminar
          </button>
        </div>

        {/* Caso */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-3 rounded-2xl bg-warm-50/95 p-4 text-praxis-900">
            <p className="text-sm leading-relaxed font-medium">{pActual.narracion_caso}</p>
          </div>

          <div className="mb-3 font-display text-base font-bold text-warm-50">
            {pActual.pregunta}
          </div>

          <div className="space-y-2">
            {pActual.opciones.map((op) => (
              <button
                key={op.letra}
                onClick={() => setRespuestas({ ...respuestas, [pActual.id]: op.letra })}
                className={`option-card ${
                  seleccion === op.letra ? 'border-praxis-300 bg-praxis-300/20' : ''
                }`}
              >
                <span className="mr-2 font-bold text-praxis-300">{op.letra.toUpperCase()})</span>
                {op.texto}
              </button>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div className="border-t border-warm-50/10 bg-praxis-900/60 px-4 py-3 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIdx(Math.max(0, idx - 1))}
              disabled={idx === 0}
              className="rounded-full border border-warm-50/30 py-2 text-sm font-semibold text-warm-50 active:scale-95 disabled:opacity-30"
            >
              ← Anterior
            </button>
            <button
              onClick={() => {
                if (idx + 1 >= preguntas.length) terminarYRegistrar();
                else setIdx(idx + 1);
              }}
              className="rounded-full bg-praxis-500 py-2 text-sm font-semibold text-warm-50 active:scale-95"
            >
              {idx + 1 >= preguntas.length ? 'Finalizar' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (estado === 'resultado' && resultados) {
    const pct = Math.round((resultados.correctas / resultados.total) * 100);
    return (
      <div className="safe-top safe-bottom h-full overflow-y-auto bg-gradient-to-b from-praxis-900 to-praxis-800">
        <div className="mx-auto max-w-md px-5 py-6">
          <h2 className="mb-2 font-display text-2xl font-bold text-warm-50">Resultados</h2>
          <p className="mb-5 text-sm text-praxis-200">
            Aquí está tu desempeño en el simulacro.
          </p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 rounded-3xl border border-warm-50/15 bg-warm-50/5 p-6 text-center"
          >
            <div className="font-display text-6xl font-bold text-warm-50">{pct}%</div>
            <div className="mt-1 text-sm text-praxis-300">
              {resultados.correctas} de {resultados.total} preguntas
            </div>
          </motion.div>

          <div className="mb-6 rounded-2xl border border-warm-50/15 bg-warm-50/5 p-4">
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-praxis-300">
              Por especialidad
            </h3>
            <div className="space-y-2">
              {Object.entries(resultados.porEsp)
                .sort(([, a], [, b]) => b.t - a.t)
                .map(([esp, s]) => {
                  const p = Math.round((s.c / s.t) * 100);
                  return (
                    <div key={esp}>
                      <div className="mb-1 flex items-baseline justify-between text-xs">
                        <span className="font-semibold capitalize text-warm-50">
                          {esp.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-praxis-300">
                          {s.c}/{s.t} · {p}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-praxis-900">
                        <div
                          className={`h-full ${
                            p >= 70
                              ? 'bg-green-400'
                              : p >= 50
                              ? 'bg-praxis-300'
                              : 'bg-urgent-500'
                          }`}
                          style={{ width: `${p}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-full bg-praxis-500 py-3 font-semibold text-warm-50 active:scale-95"
          >
            Volver al hub
          </button>
        </div>
      </div>
    );
  }

  return null;
}
