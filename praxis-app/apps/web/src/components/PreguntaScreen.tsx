import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Pregunta, Letra } from '@praxis/data';
import { Asistente, type Expresion } from './Asistente';
import { GloboDialogo } from './GloboDialogo';
import { FichaClinica } from './FichaClinica';
import { useGameStore } from '../stores/gameStore';

type Fase = 'llegada' | 'caso' | 'feedback' | 'explicacion';

interface Props {
  pregunta: Pregunta;
  fondoSrc: string;
  onClose: () => void;
  onNext: () => void;
  cronometro?: boolean;
}

const BASE = import.meta.env.BASE_URL;

function fondoFor(sala: string): string {
  if (sala === 'urgencias') return `${BASE}assets/fondos/fondo_urgencias.png`;
  if (sala === 'hospitalizacion') return `${BASE}assets/fondos/fondo_hospitalizacion.png`;
  return `${BASE}assets/fondos/fondo_consultorio.png`;
}

export function PreguntaScreen({ pregunta, onClose, onNext }: Props) {
  const [fase, setFase] = useState<Fase>('llegada');
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<Letra | null>(null);
  const [xpGanado, setXpGanado] = useState(0);
  const registrarRespuesta = useGameStore((s) => s.registrarRespuesta);

  const fondo = fondoFor(pregunta.sala);
  const acerto = respuestaSeleccionada === pregunta.correcta;

  // Reset al cambiar de pregunta
  useEffect(() => {
    setFase('llegada');
    setRespuestaSeleccionada(null);
    setXpGanado(0);
  }, [pregunta.id]);

  function expresion(): Expresion {
    if (fase === 'feedback') return acerto ? 'acierto' : 'error';
    if (fase === 'explicacion') return 'explicando';
    return 'idle';
  }

  function handleSeleccion(letra: Letra) {
    if (respuestaSeleccionada) return;
    setRespuestaSeleccionada(letra);
    const ok = letra === pregunta.correcta;
    const res = registrarRespuesta(
      pregunta.id,
      ok,
      letra,
      pregunta.especialidad,
      pregunta.sala
    );
    setXpGanado(res.xpGanado);
    setFase('feedback');
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-praxis-900">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${fondo}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-praxis-900/30 via-transparent to-praxis-900/95" />

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="safe-top absolute right-4 top-4 z-30 rounded-full border border-warm-50/30 bg-praxis-900/70 px-3 py-1 text-xs font-semibold text-warm-50 backdrop-blur-md active:scale-95"
      >
        ✕ Salir
      </button>

      {/* Personaje: imagen alta y centrada; cara+pecho en zona media, pies recortados abajo */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <Asistente
          expresion={expresion()}
          className="absolute left-1/2 top-[10vh] h-[105vh] w-auto -translate-x-1/2"
        />
      </div>

      {/* Contenido sobre el personaje */}
      <div className="safe-top safe-bottom relative z-20 flex h-full flex-col">
        <AnimatePresence mode="wait">
          {fase === 'llegada' && (
            <motion.div
              key="llegada"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col justify-end px-4 pb-32"
            >
              <GloboDialogo>{pregunta.llegada}</GloboDialogo>
              <button
                onClick={() => setFase('caso')}
                className="mt-4 self-end rounded-full bg-praxis-500 px-6 py-3 font-semibold text-warm-50 shadow-xl active:scale-95"
              >
                Ver paciente →
              </button>
            </motion.div>
          )}

          {fase === 'caso' && (
            <motion.div
              key="caso"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col"
            >
              {/* ARRIBA: solo historia clínica */}
              <div className="px-3 pt-12">
                <FichaClinica ficha={pregunta.ficha_clinica} compact />
              </div>

              {/* MEDIO: spacer (la asistente y el fondo se ven aquí) */}
              <div className="flex-1" />

              {/* ABAJO: narración + pregunta + opciones pegadas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2 px-3 pb-4"
              >
                <div className="rounded-2xl bg-warm-50/95 px-3 py-2.5 text-praxis-900 shadow-lg">
                  <p className="text-[13px] leading-snug font-medium">{pregunta.narracion_caso}</p>
                </div>

                <div className="rounded-2xl border border-praxis-300/40 bg-praxis-900/90 p-3 backdrop-blur-md">
                  <div className="mb-2 font-display text-sm font-bold leading-snug text-warm-50">
                    {pregunta.pregunta}
                  </div>
                  <div className="space-y-1.5">
                    {pregunta.opciones.map((op) => (
                      <button
                        key={op.letra}
                        onClick={() => handleSeleccion(op.letra)}
                        disabled={!!respuestaSeleccionada}
                        className="option-card !py-2 !text-sm"
                      >
                        <span className="mr-1.5 font-bold text-praxis-300">
                          {op.letra.toUpperCase()})
                        </span>
                        {op.texto}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {fase === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col"
            >
              {/* ARRIBA: Globo de reacción */}
              <div className="px-3 pt-12">
                <GloboDialogo variant={acerto ? 'acierto' : 'error'}>
                  {acerto ? pregunta.reaccion_acierto : pregunta.reaccion_error}
                  {xpGanado > 0 && (
                    <div className="mt-1 text-sm font-bold text-praxis-700">+{xpGanado} XP</div>
                  )}
                </GloboDialogo>
              </div>

              {/* MEDIO: ver a la asistente reaccionando */}
              <div className="flex-1" />

              {/* ABAJO: opciones con feedback visual + botón seguir */}
              <div className="space-y-2 px-3 pb-4">
                <div className="rounded-2xl border border-praxis-300/40 bg-praxis-900/90 p-3 backdrop-blur-md">
                  <div className="mb-2 font-display text-sm font-bold leading-snug text-warm-50">
                    {pregunta.pregunta}
                  </div>
                  <div className="space-y-1.5">
                    {pregunta.opciones.map((op) => {
                      const esCorrecta = op.letra === pregunta.correcta;
                      const esSeleccionada = op.letra === respuestaSeleccionada;
                      const className = esCorrecta
                        ? 'option-card correct !py-2 !text-sm'
                        : esSeleccionada
                        ? 'option-card wrong !py-2 !text-sm'
                        : 'option-card opacity-50 !py-2 !text-sm';
                      return (
                        <div key={op.letra} className={className}>
                          <span className="mr-1.5 font-bold">{op.letra.toUpperCase()})</span>
                          {op.texto}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setFase('explicacion')}
                  className="w-full rounded-full bg-praxis-500 py-3 font-semibold text-warm-50 shadow-xl active:scale-95"
                >
                  Ver explicación →
                </button>
              </div>
            </motion.div>
          )}

          {fase === 'explicacion' && (
            <motion.div
              key="explicacion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col gap-3 overflow-y-auto px-4 pb-6 pt-12"
            >
              <div className="rounded-2xl bg-warm-50/95 p-4 text-praxis-900 shadow-lg">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-praxis-500">
                  TL;DR
                </div>
                <p className="mb-3 text-sm font-medium leading-relaxed">
                  {pregunta.explicacion.tldr}
                </p>

                {pregunta.explicacion.tratamiento && (
                  <>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-praxis-500">
                      Tratamiento
                    </div>
                    <p className="mb-3 text-sm leading-relaxed">
                      {pregunta.explicacion.tratamiento}
                    </p>
                  </>
                )}

                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-praxis-500">
                  ¿Por qué las otras no?
                </div>
                <ul className="space-y-1 text-sm">
                  {Object.entries(pregunta.explicacion.por_que_otras_no).map(([letra, razon]) => (
                    <li key={letra}>
                      <strong className="text-urgent-500">{letra.toUpperCase()})</strong> {razon}
                    </li>
                  ))}
                </ul>

                {pregunta.palabras_clave.length > 0 && (
                  <div className="mt-4 border-t border-praxis-100 pt-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-praxis-500">
                      Saber más
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pregunta.palabras_clave.map((kw) => (
                        <a
                          key={kw.termino}
                          href={`https://www.google.com/search?q=${encodeURIComponent(kw.termino)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-praxis-100 px-3 py-1 text-xs font-semibold text-praxis-700 hover:bg-praxis-200"
                        >
                          {kw.termino} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <GloboDialogo>
                {acerto ? pregunta.cierre_acierto : pregunta.cierre_error}
              </GloboDialogo>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="rounded-full border-2 border-warm-50/30 px-5 py-3 font-semibold text-warm-50 active:scale-95"
                >
                  Volver al hub
                </button>
                <button
                  onClick={onNext}
                  className="rounded-full bg-praxis-500 px-5 py-3 font-semibold text-warm-50 shadow-xl active:scale-95"
                >
                  Siguiente caso →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
