'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { lerCelebrados, marcosNovos, registrarCelebrados } from '@/lib/metas-economia/marcos';
import { mensagemMarco } from '@/lib/metas-economia/mensagens';

interface MarcoCelebracaoProps {
  competencia: string;
  marcosAtingidos: number[];
}

/** Não renderiza nada: dispara um toast por marco novo e registra para não repetir. */
export function MarcoCelebracao({ competencia, marcosAtingidos }: MarcoCelebracaoProps) {
  // Guarda em memória para o caso de o localStorage estar indisponível (e para o StrictMode).
  const jaDisparados = useRef(new Set<string>());

  useEffect(() => {
    const novos = marcosNovos(marcosAtingidos, lerCelebrados(competencia)).filter(
      (m) => !jaDisparados.current.has(`${competencia}:${m}`)
    );
    if (novos.length === 0) return;

    novos.forEach((m) => jaDisparados.current.add(`${competencia}:${m}`));
    registrarCelebrados(competencia, novos);
    novos.forEach((m) => toast.success(`🎉 ${mensagemMarco(m)}`));
  }, [competencia, marcosAtingidos]);

  return null;
}
