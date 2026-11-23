import {Page,Locator} from '@playwright/test';
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