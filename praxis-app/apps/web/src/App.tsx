import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { todasLasPreguntas, preguntasPorSala, type Pregunta, type Sala } from '@praxis/data';
import { Hub } from './components/Hub';
import { PreguntaScreen } from './components/PreguntaScreen';
import { Expediente } from './components/Expediente';
import { Simulacro } from './components/Simulacro';
import { useGameStore } from './stores/gameStore';

type Vista = 'hub' | 'jugando' | 'simulacro';
type Modo = Sala | 'repaso' | 'simulacro';

// === DEBUG ===
// Forzar caso inicial específico al entrar a Urgencias (para testear layout).
// Poner en null para volver a comportamiento aleatorio normal.
const CASO_DEBUG_URGENCIAS: number | null = null; // Hombre 25 años, LAST por lidocaína

function eligePool(modo: Modo, casosPendientes: number[]): Pregunta[] {
  if (modo === 'repaso') {
    return todasLasPreguntas.filter((p) => casosPendientes.includes(p.id));
  }
  if (modo === 'simulacro') return [...todasLasPreguntas];
  return preguntasPorSala(modo);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function App() {
  const [vista, setVista] = useState<Vista>('hub');
  const [modo, setModo] = useState<Modo>('urgencias');
  const [cola, setCola] = useState<Pregunta[]>([]);
  const [idx, setIdx] = useState(0);
  const [mostrarExpediente, setMostrarExpediente] = useState(false);

  const marcarLogin = useGameStore((s) => s.marcarLogin);
  const casosPendientes = useGameStore((s) => s.casosPendientes);

  useEffect(() => {
    marcarLogin();
  }, [marcarLogin]);

  function iniciarModo(m: Modo) {
    if (m === 'simulacro') {
      setVista('simulacro');
      return;
    }
    const pool = eligePool(m, casosPendientes);
    if (pool.length === 0) {
      alert(
        m === 'repaso'
          ? 'No tienes casos pendientes para repasar. ¡Bien hecho!'
          : 'No hay casos disponibles en este modo.'
      );
      return;
    }
    setModo(m);

    // === DEBUG: forzar caso inicial fijo cuando se entra a Urgencias ===
    if (m === 'urgencias' && CASO_DEBUG_URGENCIAS !== null) {
      const fijo = pool.find((p) => p.id === CASO_DEBUG_URGENCIAS);
      const resto = shuffle(pool.filter((p) => p.id !== CASO_DEBUG_URGENCIAS));
      setCola(fijo ? [fijo, ...resto] : resto);
    } else {
      setCola(shuffle(pool));
    }

    setIdx(0);
    setVista('jugando');
  }

  function siguienteCaso() {
    if (idx + 1 < cola.length) {
      setIdx(idx + 1);
    } else {
      // Acabó la cola: vuelve a barajar
      setCola(shuffle(cola));
      setIdx(0);
    }
  }

  function salir() {
    setVista('hub');
  }

  const preguntaActual = cola[idx];

  return (
    <div className="relative h-full w-full">
      {vista === 'hub' && (
        <Hub onSelectModo={iniciarModo} onOpenExpediente={() => setMostrarExpediente(true)} />
      )}

      {vista === 'jugando' && preguntaActual && (
        <PreguntaScreen
          pregunta={preguntaActual}
          fondoSrc=""
          onClose={salir}
          onNext={siguienteCaso}
        />
      )}

      {vista === 'simulacro' && <Simulacro onClose={salir} />}

      <AnimatePresence>
        {mostrarExpediente && <Expediente onClose={() => setMostrarExpediente(false)} />}
      </AnimatePresence>
    </div>
  );
}
