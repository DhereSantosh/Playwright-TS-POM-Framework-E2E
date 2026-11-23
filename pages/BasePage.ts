import { Page, expect } from '@playwright/test';

export abstract class BasePage {
  
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Clicks any module in the left sidebar (e.g., 'PIM', 'Admin', 'Leave')
   */
  async navigateToModule(moduleName: string): Promise<void> {
    await this.page
      .locator('.oxd-main-menu')
      .getByRole('link', { name: moduleName, exact: true })
      .click();
  }

  protected async selectDropdownOption(labelName: string,optionText: string): Promise<boolean> {

    const dropdown = this.page
          .locator('.oxd-input-group')
          .filter({ has: this.page.getByText(labelName, { exact: true }) })
          .locator('.oxd-select-text');

          await dropdown.click();

          const listbox = this.page.getByRole('listbox');
          await listbox.waitFor({ state: 'visible' });

          // Wait for options inside the listbox to finish rendering (beyond just "-- Select --")
          await listbox.getByRole('option').nth(1).waitFor({ state: 'visible' });

          const targetOption = listbox.getByRole('option', {
            name: optionText, exact: true         
          });

          if ((await targetOption.count()) > 0) {
            await targetOption.click();
            return true;
          }

          console.warn(`Option "${optionText}" not found in "${labelName}" dropdown.`);
          await dropdown.click(); // Close dropdown cleanly
          return false;
  }
  /**
   * Validates that all visible rows in the results table match the expected value for a given column.
   * @param columnName - Exact header text (e.g., 'Job Title', 'Sub Unit')
   * @param expectedValue - Expected text in every row for that column
   */

  protected async verifyTableColumnValues(columnName: string, expectedValue: string): Promise<void> {
    // 1. Wait for either records or "No Records Found" to finish loading
    const recordsStatus = this.page.locator('.orangehrm-horizontal-padding span');
    await expect(recordsStatus).toContainText(/Records? Found/);

    const statusText = (await recordsStatus.textContent()) ?? '';
    if (statusText.includes('No Records Found')) {
      console.warn(`No records found when filtering ${columnName} by "${expectedValue}".`);
      return;
    }

    // 2. Find the dynamic column index from the table header
    const headers = await this.page.locator('.oxd-table-header').getByRole('columnheader').allInnerTexts();

    const columnIndex = headers.findIndex((header) => header.trim().includes(columnName));
    if (columnIndex === -1) {
      throw new Error(`Column "${columnName}" not found in table headers: ${headers.join(', ')}`);
    }

    // 3. Get all data rows and assert every cell in that column matches expectedValue
    const rows = this.page.locator('.oxd-table-body').getByRole('row');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const cell = rows.nth(i).getByRole('cell').nth(columnIndex);
      await expect(cell).toHaveText(expectedValue);
    }
  }
}
