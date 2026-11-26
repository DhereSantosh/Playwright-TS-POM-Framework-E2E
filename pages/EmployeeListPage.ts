import {Page,Locator,expect} from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeListPage extends BasePage {

    //private readonly searchButton = this.page.getByRole('button', { name: 'Search' });

    constructor( page: Page) {
        super(page);
    }

    private readonly Locattors = {

        //jobTitleDropdownIcon: () => this.page.getByRole('button', { name: 'Job Title' }),
        empListSearchButton: ()=> this.page.getByRole('button', { name: 'Search' }),
        empListResetButton: ()=> this.page.getByRole('button', { name: 'Reset' }),

        employeeNameInput: () => this.page
            .locator('.oxd-input-group')
            .filter({ has: this.page.getByText('Employee Name', { exact: true }) })
            .getByPlaceholder('Type for hints...'),

        employeeIdInput: () => this.page
            .locator('.oxd-input-group')
            .filter({ has: this.page.getByText('Employee Id', { exact: true }) })
            .getByRole('textbox'),

        tableRow: () => this.page.locator('.oxd-table-body .oxd-table-row'),

        deleteConfirmationDialog: () => this.page.getByRole('dialog'),  
        
        successfullyDeletedToast: () => this.page.getByText('Successfully Deleted'),

    }

    public async deleteConfirmationMessage(): Promise<string> {
        const dialog = this.Locattors.deleteConfirmationDialog();
        await expect(dialog).toBeVisible({ timeout: 5000 });
        return await dialog.textContent() || '';
    }

    public async confirmDeleteButton(): Promise<void> {
        const dialog = this.Locattors.deleteConfirmationDialog();
        await expect(dialog).toBeVisible({ timeout: 5000 });
        const confirmButton = dialog.getByRole('button', { name: 'Yes, Delete' });
        await confirmButton.click();
    }

    public async deleteEmployeeById(employeeId: string): Promise<void> {

        // 1. Find the specific table row matching the dynamic employeeId
        const matchingRow = await this.Locattors.tableRow().filter({ hasText: employeeId });
        await expect(matchingRow).toBeVisible({ timeout: 10000 }); // Wait for the row to be visible 
        
        // 2. Click the 2nd button inside that row (nth(0) = Edit, nth(1) = Delete)
        await matchingRow.getByRole('button').nth(1).click();

        // 3. Assert the confirmation popup appears and verify its description text
        const confirmationMessage = await this.deleteConfirmationMessage();
        console.log(`Delete Confirmation Message: ${confirmationMessage}`);
        await expect(confirmationMessage).toContain('The selected record will be permanently deleted. Are you sure you want to continue?');
        await this.confirmDeleteButton();
    }

    public async verifyEmployeeDeleted(): Promise<void> {
        const toast = this.Locattors.successfullyDeletedToast();
        await expect(toast).toBeVisible({ timeout: 5000 });
    }

    public async searchEmployeeById(employeeName: string, employeeId: string): Promise<void> {
        //await this.Locattors.employeeNameInput().fill(employeeName);
        await this.Locattors.employeeIdInput().fill(employeeId);
        await this.clickSearchButton();
    }

    public async verifyEmployeeInResults(firstName: string, lastName: string, employeeId: string): Promise<void> {
        const matchingRow = await this.Locattors.tableRow().filter({ hasText: employeeId   });

        await expect(matchingRow).toBeVisible({ timeout: 10000 }); // Wait for the row to be visible
        await expect(matchingRow).toContainText(firstName);
        await expect(matchingRow).toContainText(lastName);
    }
    async openPIM(): Promise<void> {
            await this.navigateToModule('PIM'); // Employee List opens by default when clicking PIM
    }

    async filterByJobTitle(jobTitle: string, fallbackJobTitle?: string): Promise<boolean> {
        const isSelected = await this.selectDropdownOption('Job Title', jobTitle);
              
       if (isSelected) {
            await this.clickSearchButton();
        }
        return isSelected;
    }

    async clickSearchButton(): Promise<void> {
        await this.Locattors.empListSearchButton().click();
    }

    async clickResetButton(): Promise<void> {
        await this.Locattors.empListResetButton().click();
    }

    async filterBySubUnit(subUnit: string): Promise<void> {
    await this.selectDropdownOption('Sub Unit', subUnit);    
    }

    async verifyFilteredByJobTitle(expectedJobTitle: string): Promise<void> {   
        await this.verifyTableColumnValues('Job Title', expectedJobTitle);
    }

    async verifyFIlteredBySubUnit(expectedSubUnit: string): Promise<void> {
        await this.verifyTableColumnValues('Sub Unit', expectedSubUnit);
    }

}