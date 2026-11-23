import { test as base, expect, Page, TestInfo } from '@playwright/test';
import { PlaywrightFactory } from '../factory/PlaywrightFactory';
import { PIMPage } from '@pages/PIMPage';
import { EmployeeListPage } from '@pages/EmployeeListPage';

export class BaseTest
{
  public static readonly AUTH_FILE = '.auth/user.json';

  // Private constructor initializes properties immediately (No '!' needed)
  private constructor(
    private readonly factory: PlaywrightFactory,
    public readonly page: Page
  ) {}

  public static async openBrowser(testInfo?: TestInfo, useAuth: boolean = true): Promise<BaseTest>
  {
    // Priority: 1. Jenkins/CLI env variable
    const envBrowser = process.env.BROWSER?.toLowerCase();
    // 2. Playwright --project flag
    const projectName = testInfo?.project.name.toLowerCase();
    // 3. Default 'chromium'
    const validBrowsers = ['chromium', 'firefox', 'webkit'];

    const browserName =
        envBrowser && validBrowsers.includes(envBrowser)? envBrowser
        : projectName && validBrowsers.includes(projectName)? projectName
        : 'chromium';

    const statePath = useAuth ? BaseTest.AUTH_FILE : undefined;
    const factory = await PlaywrightFactory.create(browserName, statePath);
    return new BaseTest(factory, factory.page);
  }

  public async saveAuthState(): Promise<void> {
    await this.factory.saveStorageState(BaseTest.AUTH_FILE);
  }

  public async closeBrowser(): Promise<void> {
    await this.factory.closeBrowser();
  }
}
// Define custom fixtures that act as automatic beforeEach / afterEach hooks
type MyFixtures = {
  baseTest: BaseTest;
  appPage: Page;
  employeeListPage: EmployeeListPage;
  pimPage: PIMPage;
};

export const test_hooks = base.extend<MyFixtures>({
    // Runs BEFORE each test, yields `baseTest`, and runs `closeBrowser()` AFTER each test

    baseTest: async ({}, use, testInfo) => {
        const isSetup  = testInfo.project.name === 'setup';
        const baseTest =  await BaseTest.openBrowser(testInfo, !isSetup);

        await use(baseTest);
        // Capture and attach screenshot with Test Name + Timestamp on failure
        if (testInfo.status !== testInfo.expectedStatus) {
            // Replace spaces and special characters in test title so it is safe for filenames
      const safeTestName = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_');
          // Format local date & time as YYYY-MM-DD_HH-MM-SS
      const timestamp = new Date()
        .toLocaleString('sv-SE')
        .replace(' ', '_')
        .replace(/:/g, '-');

        const attachmentName = `${safeTestName}_${timestamp}`;

      const screenshot = await baseTest.page.screenshot({ fullPage: true });
      await testInfo.attach(attachmentName, {
        body: screenshot,
        contentType: 'image/png',
      });
    }

        // Automatic afterEach cleanup (runs even if the test fails)
        await baseTest.closeBrowser();
        },

        // Exposes `appPage` directly so tests don't even have to type `baseTest.page`
    appPage: async ({ baseTest }, use, testInfo) => {
          // Automatically navigate to Dashboard for all authenticated tests
          if (testInfo.project.name !== 'setup') {
            await baseTest.page.goto('/web/index.php/dashboard/index');
          }
            await use(baseTest.page);
        },

      
    employeeListPage: async ({ appPage }, use) => {
        await use(new EmployeeListPage(appPage));  
    },

    pimPage: async ({ appPage }, use) => {
        await use(new PIMPage(appPage));
    },
          
    });

export { expect };
