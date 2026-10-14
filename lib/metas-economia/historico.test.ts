import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ehCompetenciaPassada, variacaoVsMesAnterior } from './historico.ts';

const item = (competencia: string, percentual: number) => ({
  competencia,
  valorMeta: 1000,
  valorEconomizado: percentual * 10,
  percentual,
  atingida: percentual >= 100,
});

test('variação em pontos percentuais vs mês civil anterior', () => {
  const v = variacaoVsMesAnterior([item('2026-08', 120), item('2026-09', 40)]);
  assert.deepEqual(v, [null, -80]);
});

test('mês anterior sem meta resulta em null', () => {
  assert.deepEqual(variacaoVsMesAnterior([item('2026-06', 50), item('2026-08', 70)]), [null, null]);
});

test('vira o ano corretamente', () => {
  assert.deepEqual(variacaoVsMesAnterior([item('2025-12', 90), item('2026-01', 100)]), [null, 10]);
});

test('ehCompetenciaPassada compara yyyy-MM', () => {
  assert.equal(ehCompetenciaPassada('2026-09', '2026-10'), true);
  assert.equal(ehCompetenciaPassada('2026-10', '2026-10'), false);
  assert.equal(ehCompetenciaPassada('2027-01', '2026-10'), false);
});
