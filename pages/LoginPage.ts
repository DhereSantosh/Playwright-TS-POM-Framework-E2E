import { Page, Locator } from '@playwright/test';

export class LoginPage {

  constructor(private readonly page: Page) { }

  // ==================== LOCATORS ====================
    private readonly locators = {
    usernameInput: () => this.page.getByPlaceholder('Username'),
    passwordInput: () => this.page.getByPlaceholder('Password'),
    loginButton: () => this.page.getByRole('button', { name: 'Login' }),

  };

  async goto(): Promise<void> {
      await this.page.goto('/web/index.php/auth/login');
    }

  async login(username: string, pass: string): Promise<void> {
    await this.locators.usernameInput().fill(username);
    await this.locators.passwordInput().fill(pass);
    await this.locators.loginButton().click();

  }

  public getDashboardHeader(): Locator {
    return this.page.getByRole('heading', { name:'Dashboard'});
  }
}
