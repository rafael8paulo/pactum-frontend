import { test, expect } from '@playwright/test';
import { LancamentosPage } from './pages/LancamentosPage';
import { uniqueText } from './support/unique';

test('criar, editar e excluir uma despesa', async ({ page }) => {
  const lancamentos = new LancamentosPage(page);
  const descricao = uniqueText('Despesa');
  const editada = uniqueText('Despesa editada');

  await lancamentos.goto('despesa');

  await lancamentos.criar('despesa', descricao, '123,45');
  await expect(lancamentos.linha(descricao)).toBeVisible();
  await expect(lancamentos.linha(descricao)).toContainText('123,45');

  await lancamentos.editarDescricao('despesa', descricao, editada);
  await expect(lancamentos.linha(editada)).toBeVisible();
  await expect(lancamentos.linha(descricao)).toHaveCount(0);

  await lancamentos.remover(editada);
  await expect(lancamentos.linha(editada)).toHaveCount(0);
});
