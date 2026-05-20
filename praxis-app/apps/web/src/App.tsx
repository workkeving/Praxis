import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { todasLasPreguntas, preguntasPorSala, type Pregunta } from '@praxis/data';
import { Hub } from './components/Hub';
import { PreguntaScreen } from './components/PreguntaScreen';
import { Expediente } from './components/Expediente';
import { Simulacro } from './components/Simulacro';
import { useGameStore } from './stores/gameStore';

type Vista = 'hub' | 'jugando' | 'simulacro';
type Modo = 'urgencias' | 'consulta' | 'repaso' | 'simulacro';

function eligePool(modo: Modo, casosPendientes: number[]): Pregunta[] {
  if (modo === 'urgencias') return preguntasPorSala('urgencias');
  if (modo === 'repaso') {
    return todasLasPreguntas.filter((p) => casosPendientes.includes(p.id));
  }
  if (modo === 'simulacro') return [...todasLasPreguntas];
  // consulta libre = todas (excluyendo solo urgencias para mantener flavor)
  return todasLasPreguntas;
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
    setCola(shuffle(pool));
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
