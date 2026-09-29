import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupLancamentos } from './group.ts';
import type { LancamentoItem } from './item.ts';

const base = { tipo: 'despesa', categoria: 'OUTROS', competencia: '2026-09' } as const;
const item = (
  id: string,
  valor: number,
  status: 'PAGA' | 'PENDENTE' | 'AGENDADA',
  data?: string
): LancamentoItem => ({ ...base, id, descricao: id, valor, status, data });

test('agrupa despesas por status, ordenado, com subtotais que batem', () => {
  const groups = groupLancamentos(
    [item('a', 10, 'PAGA'), item('b', 20, 'PENDENTE'), item('c', 5.5, 'PENDENTE'), item('d', 1, 'AGENDADA')],
    'despesa'
  );
  assert.deepEqual(groups.map((g) => g.key), ['PENDENTE', 'AGENDADA', 'PAGA']);
  for (const g of groups) {
    assert.equal(g.total, g.items.reduce((s, i) => s + i.valor, 0));
  }
  assert.equal(groups[0].total, 25.5);
});

test('omite grupos vazios', () => {
  const groups = groupLancamentos([item('a', 10, 'PAGA')], 'despesa');
  assert.deepEqual(groups.map((g) => g.key), ['PAGA']);
});

test('receitas viram grupo único', () => {
  const groups = groupLancamentos(
    [{ ...base, tipo: 'receita', id: 'r1', descricao: 'r1', valor: 100 }],
    'receita'
  );
  assert.equal(groups.length, 1);
  assert.equal(groups[0].total, 100);
});

test('lista vazia não gera grupos', () => {
  assert.deepEqual(groupLancamentos([], 'despesa'), []);
  assert.deepEqual(groupLancamentos([], 'receita'), []);
});

test('com data em todos os itens agrupa por dia decrescente, com "Hoje"', () => {
  const hoje = new Date(2026, 8, 28);
  const groups = groupLancamentos(
    [item('a', 10, 'PAGA', '2026-09-27'), item('b', 20, 'PENDENTE', '2026-09-28'), item('c', 5, 'PAGA', '2026-09-28')],
    'despesa',
    hoje
  );
  assert.deepEqual(groups.map((g) => g.key), ['2026-09-28', '2026-09-27']);
  assert.match(groups[0].label, /^Hoje/);
  assert.match(groups[1].label, /^Ontem/);
  assert.equal(groups[0].total, 25);
});
