import { motion } from 'framer-motion';
import type { FichaClinica as Ficha } from '@praxis/data';

interface Props {
  ficha: Ficha;
  /** URL opcional del avatar del paciente (futuro). */
  pacienteFotoSrc?: string;
  /** Layout compacto (para versión arriba en pantalla). */
  compact?: boolean;
}

const LABELS: Record<string, string> = {
  paciente: 'Paciente',
  tiempo_evolucion: 'Evolución',
  sintomas: 'Síntomas',
  examen: 'Examen',
  antecedente: 'Antecedente',
  antecedentes: 'Antecedentes',
  laboratorio: 'Laboratorio',
  ingesta: 'Ingesta',
  exposicion: 'Exposición',
  contexto: 'Contexto',
  diagnostico: 'Diagnóstico',
  ubicacion: 'Ubicación',
  evolucion: 'Evolución',
  funcional: 'Funcional',
  sindrome: 'Síndrome',
  toxicos: 'Tóxicos',
  funcion_renal: 'Función renal',
  uroanalisis: 'Uroanálisis',
  edad_tardia: 'Edad',
  tanner: 'Tanner',
  antropometria: 'Antropometría',
};

function labelFor(key: string): string {
  return LABELS[key] ?? key.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

export function FichaClinica({ ficha, pacienteFotoSrc, compact = false }: Props) {
  const entries = Object.entries(ficha).filter(([, v]) => v != null);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border border-praxis-300/40 bg-praxis-900/85 backdrop-blur-md text-warm-50 shadow-lg ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        {/* Slot opcional para foto del paciente (placeholder cuando no hay) */}
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-warm-50/20 bg-praxis-700/50">
          {pacienteFotoSrc ? (
            <img
              src={pacienteFotoSrc}
              alt="Paciente"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-praxis-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 12c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6Z" />
              </svg>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-praxis-300">
            Historia Clínica
          </div>
          {ficha.paciente && (
            <div className="truncate text-sm font-semibold text-warm-50">{ficha.paciente}</div>
          )}
        </div>
      </div>
      <dl className={`grid gap-x-2 gap-y-1 ${compact ? 'text-xs' : 'text-sm'}`}>
        {entries
          .filter(([k]) => k !== 'paciente')
          .map(([key, value]) => (
            <div key={key} className="grid grid-cols-[auto_1fr] gap-2">
              <dt className="font-semibold text-praxis-200">{labelFor(key)}:</dt>
              <dd className="text-warm-100">{value}</dd>
            </div>
          ))}
      </dl>
    </motion.div>
  );
}
