import type { Page } from '@playwright/test';

export class CadastroPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/cadastro');
  }

  /**
   * Preenche e envia o formulário e espera a API confirmar o cadastro (201).
   * O destino pós-cadastro não é assertado aqui: a API não abre sessão no
   * cadastro, então quem precisa de sessão deve fazer login em seguida.
   */
  async cadastrar(nome: string, email: string, senha: string) {
    await this.page.getByLabel('Nome').fill(nome);
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Senha', { exact: true }).fill(senha);
    await this.page.getByLabel('Confirmar Senha').fill(senha);
    const resposta = this.page.waitForResponse(
      (r) => r.url().includes('/api/v1/auth/cadastro') && r.request().method() === 'POST'
    );
    await this.page.getByRole('button', { name: 'Criar conta' }).click();
    return (await resposta).status();
  }
}
