import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lerCelebrados, marcosNovos, registrarCelebrados } from './marcos.ts';

function storageFake(inicial: Record<string, string> = {}) {
  const dados = { ...inicial };
  return {
    dados,
    getItem: (k: string) => dados[k] ?? null,
    setItem: (k: string, v: string) => {
      dados[k] = v;
    },
  };
}

const storageQuebrado = {
  getItem: () => {
    throw new Error('indisponível');
  },
  setItem: () => {
    throw new Error('indisponível');
  },
};

test('marcosNovos retorna só os ainda não celebrados, em ordem', () => {
  assert.deepEqual(marcosNovos([50, 25, 75], [25]), [50, 75]);
});

test('marcosNovos vazio quando tudo já foi celebrado', () => {
  assert.deepEqual(marcosNovos([25, 50], [25, 50]), []);
});

test('registrar e ler celebrados por competência', () => {
  const s = storageFake();
  registrarCelebrados('2026-10', [25, 50], s);
  registrarCelebrados('2026-10', [50, 75], s);
  assert.deepEqual(lerCelebrados('2026-10', s), [25, 50, 75]);
  assert.deepEqual(lerCelebrados('2026-11', s), []);
});

test('storage corrompido é tratado como vazio', () => {
  assert.deepEqual(lerCelebrados('2026-10', storageFake({ 'pactum:marcos:2026-10': '{nope' })), []);
  assert.deepEqual(lerCelebrados('2026-10', storageFake({ 'pactum:marcos:2026-10': '"x"' })), []);
});

test('storage que lança não propaga exceção', () => {
  assert.deepEqual(lerCelebrados('2026-10', storageQuebrado), []);
  assert.doesNotThrow(() => registrarCelebrados('2026-10', [25], storageQuebrado));
});

test('sem storage (null) funciona como vazio', () => {
  assert.deepEqual(lerCelebrados('2026-10', null), []);
  assert.doesNotThrow(() => registrarCelebrados('2026-10', [25], null));
});
