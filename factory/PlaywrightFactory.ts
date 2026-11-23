import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';

export class PlaywrightFactory {
  // 1. Private constructor guarantees an instance can't be created without initialized properties
  private constructor(
    private readonly browser: Browser,
    private readonly context: BrowserContext,
    public readonly page: Page
  ) {}

    // Added optional `storageStatePath` parameter
  // 2. Static async factory method handles all async setup before returning the instance
  public static async create(browserName: string, storageStatePath?: string): Promise<PlaywrightFactory> {
    let browser: Browser;

    switch (browserName.toLowerCase()) {
      case 'chromium':
        browser = await chromium.launch({ headless: false });
        break;
      case 'firefox':
        browser = await firefox.launch({ headless: false });
        break;
      case 'webkit':
        browser = await webkit.launch({ headless: false });
        break;
      default:
        throw new Error(`Unsupported browser: ${browserName}`);
    }

    // Pass storageState into newContext (if undefined, it starts a fresh session)
    // Pass baseURL directly into browser.newContext()
    const context = await browser.newContext({
        baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/',
      viewport: { width: 1280, height: 720 },
      storageState: storageStatePath,
    });
    const page = await context.newPage();

    return new PlaywrightFactory(browser, context, page);
  }

  // Helper method to save cookies & localStorage after logging in
    public async saveStorageState(path: string): Promise<void> {
      await this.context.storageState({ path });
    }

  public async closeBrowser(): Promise<void> {
    await this.page.close();
    await this.context.close();
    await this.browser.close();
  }
}
