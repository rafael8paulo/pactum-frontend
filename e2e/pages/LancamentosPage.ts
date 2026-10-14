import { expect, type Locator, type Page } from '@playwright/test';

export type TipoLancamento = 'despesa' | 'receita';

/** Tela /lancamentos na visão desktop (tabelas + diálogos). */
export class LancamentosPage {
  constructor(private readonly page: Page) {}

  async goto(tipo: TipoLancamento) {
    await this.page.goto(`/lancamentos?tipo=${tipo}`);
    await expect(this.page.getByRole('heading', { name: 'Lançamentos' })).toBeVisible();
  }

  linha(descricao: string): Locator {
    return this.page.getByRole('row').filter({ hasText: descricao });
  }

  /** `valor` em reais, ex.: '123,45' (o campo é uma máscara que só lê dígitos). */
  async criar(tipo: TipoLancamento, descricao: string, valor: string) {
    const rotulo = tipo === 'despesa' ? 'Nova Despesa' : 'Nova Receita';
    // Com a lista vazia o estado vazio repete a ação; o botão do cabeçalho vem primeiro.
    await this.page.getByRole('button', { name: rotulo }).first().click();
    const dialogo = this.page.getByRole('dialog', { name: rotulo });
    await dialogo.getByLabel('Descrição').fill(descricao);
    await dialogo.getByLabel('Valor (R$)').fill(valor);
    await dialogo.getByRole('button', { name: 'Salvar' }).click();
    await expect(dialogo).toBeHidden();
  }

  async editarDescricao(tipo: TipoLancamento, atual: string, nova: string) {
    const titulo = tipo === 'despesa' ? 'Editar Despesa' : 'Editar Receita';
    await this.linha(atual).getByRole('button', { name: 'Editar' }).click();
    const dialogo = this.page.getByRole('dialog', { name: titulo });
    await dialogo.getByLabel('Descrição').fill(nova);
    await dialogo.getByRole('button', { name: 'Salvar' }).click();
    await expect(dialogo).toBeHidden();
  }

  async remover(descricao: string) {
    await this.linha(descricao).getByRole('button', { name: 'Remover' }).click();
    const confirmacao = this.page.getByRole('alertdialog');
    await confirmacao.getByRole('button', { name: 'Remover' }).click();
    await expect(confirmacao).toBeHidden();
  }
}
