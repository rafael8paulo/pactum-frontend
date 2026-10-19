import assert from 'node:assert/strict';
import { test } from 'node:test';
import { saldoDisponivelAposMeta } from './disponivel.ts';

const calc = (valorEconomizado: number, valorMeta: number) =>
  saldoDisponivelAposMeta({ valorEconomizado, valorMeta });

test('saldo acima da meta é positivo', () => {
  assert.deepEqual(calc(3000, 1000), { valor: 2000, situacao: 'positivo' });
});

test('saldo igual à meta é zero, sem -0', () => {
  const r = calc(1000, 1000);
  assert.deepEqual(r, { valor: 0, situacao: 'zero' });
  assert.equal(Object.is(r.valor, -0), false);
});

test('saldo abaixo da meta é negativo', () => {
  assert.deepEqual(calc(600, 1000), { valor: -400, situacao: 'negativo' });
});

test('saldo negativo soma ao déficit', () => {
  assert.deepEqual(calc(-200, 1000), { valor: -1200, situacao: 'negativo' });
});

test('ruído de ponto flutuante não vira diferença', () => {
  assert.deepEqual(calc(0.3, 0.1 + 0.2), { valor: 0, situacao: 'zero' });
});
