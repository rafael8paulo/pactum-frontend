import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mensagemMarco, mensagemPorStatus } from './mensagens.ts';

const base = { valorDiarioNecessario: 0, diasRestantes: 10 };

test('cada status gera um título distinto', () => {
  const titulos = (['CONCLUIDA', 'ADIANTADA', 'NO_PLANEJADO', 'EM_RISCO'] as const).map(
    (status) => mensagemPorStatus({ ...base, status, valorDiarioNecessario: 85 }).titulo
  );
  assert.equal(new Set(titulos).size, 4);
});

test('EM_RISCO informa o valor diário e os dias restantes', () => {
  const m = mensagemPorStatus({ status: 'EM_RISCO', valorDiarioNecessario: 85, diasRestantes: 12 });
  assert.match(m.texto, /85,00/);
  assert.match(m.texto, /12 dias/);
});

test('EM_RISCO sem dias restantes (mês passado) não cobra ritmo diário', () => {
  const m = mensagemPorStatus({ status: 'EM_RISCO', valorDiarioNecessario: 0, diasRestantes: 0 });
  assert.doesNotMatch(m.texto, /por dia/);
});

test('CONCLUIDA parabeniza', () => {
  assert.match(mensagemPorStatus({ ...base, status: 'CONCLUIDA' }).texto, /Parabéns/);
});

test('mensagemMarco cobre os marcos conhecidos e um fallback', () => {
  assert.match(mensagemMarco(50), /Metade/);
  assert.equal(mensagemMarco(10), '10% da meta alcançados!');
});
