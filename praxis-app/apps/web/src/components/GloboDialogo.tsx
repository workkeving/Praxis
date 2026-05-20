import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'normal' | 'acierto' | 'error';
}

export function GloboDialogo({ children, variant = 'normal' }: Props) {
  const colors = {
    normal: 'bg-warm-50/95 text-praxis-900 border-warm-50',
    acierto: 'bg-green-100/95 text-green-900 border-green-300',
    error: 'bg-orange-50/95 text-orange-900 border-orange-300',
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-3xl border-2 px-5 py-4 shadow-2xl ${colors}`}
    >
      <div className="text-base leading-snug font-medium">{children}</div>
      {/* cola del globo apuntando hacia abajo-derecha */}
      <div
        className={`absolute -bottom-3 right-8 h-0 w-0 border-l-[12px] border-r-[12px] border-t-[14px] border-l-transparent border-r-transparent ${
          variant === 'normal'
            ? 'border-t-warm-50'
            : variant === 'acierto'
            ? 'border-t-green-100'
            : 'border-t-orange-50'
        }`}
      />
    </motion.div>
  );
}
