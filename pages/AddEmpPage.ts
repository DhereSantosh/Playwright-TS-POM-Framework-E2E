import {Page,expect} from "@playwright/test";


export class AddEmpPage {

    constructor(private readonly page: Page) { }  
    
    private readonly Locattors = {
        firstNameInput: () => this.page.getByPlaceholder('First Name'),
        middleNameInput: () => this.page.getByPlaceholder('Middle Name'), 
        lastNameInput: () => this.page.getByPlaceholder('Last Name'),
        employeeIdInput: () => this.page
                                    .locator('.oxd-input-group')
                                    .filter({ has: this.page.getByText('Employee Id', { exact: true }) })
                                    .getByRole('textbox'),
        saveButton: () => this.page.getByRole('button', { name: 'Save' }),
    };

    public async getEployeeIdValue(): Promise<string> {
        await expect(this.Locattors.employeeIdInput()).not.toBeEmpty({ timeout: 5000 }); // Wait for the input to have a value
        return await this.Locattors.employeeIdInput().inputValue();
    }

    public async fillEmployeeDetails(firstName: string, middleName: string, lastName: string): Promise<string> {
        await this.Locattors.firstNameInput().fill(firstName);
        await this.Locattors.middleNameInput().fill(middleName);
        await this.Locattors.lastNameInput().fill(lastName);

        const employeeId = await this.getEployeeIdValue();

        await this.Locattors.saveButton().click();

        // Wait until OrangeHRM actually saves and redirects to the Personal Details page
        await this.page.waitForURL(/\/pim\/viewPersonalDetails\/empNumber\//);

        return employeeId;
    }
}