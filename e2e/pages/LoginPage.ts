import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, senha: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Senha').fill(senha);
    await this.page.getByRole('button', { name: 'Entrar' }).click();
  }
}
