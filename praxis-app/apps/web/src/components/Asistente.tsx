import { motion, AnimatePresence } from 'framer-motion';

export type Expresion = 'idle' | 'acierto' | 'error' | 'explicando';

const BASE = import.meta.env.BASE_URL;

const SRC: Record<Expresion, string> = {
  idle: `${BASE}assets/personaje/asistente_idle.png`,
  acierto: `${BASE}assets/personaje/asistente_acierto.png`,
  error: `${BASE}assets/personaje/asistente_error.png`,
  explicando: `${BASE}assets/personaje/asistente_explicando.png`,
};

interface Props {
  expresion: Expresion;
  className?: string;
}

export function Asistente({ expresion, className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={expresion}
          src={SRC[expresion]}
          alt="Asistente médica"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full object-cover object-top drop-shadow-2xl"
        />
      </AnimatePresence>
    </div>
  );
}
