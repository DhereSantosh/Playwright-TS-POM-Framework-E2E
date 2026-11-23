import {Page, Locator} from '@playwright/test';


export class PIMPage {

    constructor(private readonly page: Page) { }    

    // ==================== LOCATORS ====================
    private readonly Locattors = {
        navigationMenuPIM: () => this.page.getByRole('link', { name: 'PIM' }),
        navigationTabEmployeeList: () => this.page.getByRole('link', { name: 'Employee List' }),
        navigationTabAddEmployee: () => this.page.getByRole('link', { name: 'Add Employee' }),
        navigationTabReports: () => this.page.getByRole('link', { name: 'Reports' }),    

        navigationTabConfiguration: () => this.page.getByRole('navigation', { name: 'Topbar Menu' }).getByText('Configuration'), 
        navigationTabConfiguration_OptionalFields: () => this.page.getByRole('link', { name: 'Optional Fields' }),      

        navigationTabConfiguration_CustomFields: () => this.page.getByRole('link', { name: 'Custom Fields' }),        

        navigationTabConfiguration_DataImport: () => this.page.getByRole('link', { name: 'Data Import' }),       

        navigationTabConfiguration_ReportingMethods: () => this.page.getByRole('link', { name: 'Reporting Methods' }),       

        navigationTabConfiguration_terminationReasons: () => this.page.getByRole('link', { name: 'Termination Reasons' }),       
        
    }
  
    public getheaderEmployeeList(): Locator {
        return this.page.getByRole('heading', { name: 'Employee Information' });
    }

    public getheaderAddEmployee(): Locator {
        return this.page.getByRole('heading', { name: 'Add Employee' });
    }

    public getheaderReports(): Locator {
        return this.page.getByRole('heading', { name: 'Employee Reports' });
    }

    public getSectionHeader(sectionName: string): Locator {
        return this.page.locator('.orangehrm-main-title', { hasText: sectionName });
    }
// ==================== ACTIONS ====================
    async gotoDashboard(): Promise<void> {
        await this.page.goto('/web/index.php/dashboard/index');
    }

    async clickPIMSidebarMenu(): Promise<void> {
        await this.Locattors.navigationMenuPIM().click();
    }

    async clickEmployeeListTab(): Promise<void> {
        await this.Locattors.navigationTabEmployeeList().click();
    }

    async clickAddEmployeeTab(): Promise<void> {
        await this.Locattors.navigationTabAddEmployee().click();
    }

    async clickReportsTab(): Promise<void> {
        await this.Locattors.navigationTabReports().click();
    }
    async clickConfigurationTab(): Promise<void> {
        await this.Locattors.navigationTabConfiguration().click();
    }

    async selectConfigurationOptions(optionname: string): Promise<void> {
        await this.clickConfigurationTab();

        await this.page.getByRole('menuitem', { name: optionname }).click();
    }
}