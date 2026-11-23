import {test_hooks as test} from '../hooks/BaseTest';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { PIMPage } from '../pages/PIMPage';

test.describe('Employee List Page', { tag: '@regression' }, () => {
    test('Filter employees by Job Title and verify table results', async ({ employeeListPage }) => {      
        
        //const employeeListPage = new EmployeeListPage(appPage);
        const targetJobTitle = 'QA Engineer';

        await employeeListPage.openPIM();
        const isFiltered = await employeeListPage.filterByJobTitle(targetJobTitle, 'QA Lead');        
        if (isFiltered) {
            await employeeListPage.verifyFilteredByJobTitle(targetJobTitle);
        }        
    });  
    
    test('Filter employees by Sub Unit and verify table results', async ({ employeeListPage }) => {
        //const employeeListPage = new EmployeeListPage(appPage);
        const targetSubUnit = 'Quality Assurance';

        await employeeListPage.openPIM();
        await employeeListPage.filterBySubUnit(targetSubUnit);
        await employeeListPage.clickSearchButton();
        await employeeListPage.verifyFIlteredBySubUnit(targetSubUnit);
    });

    test('Verify the Reset button functionality on the Employee List page', { tag: ['@smoke'] }, async ({ employeeListPage }) => {
        //const employeeListPage = new EmployeeListPage(appPage);
        const targetJobTitle = 'QA Engineer';
        const targetSubUnit = 'Quality Assurance';

        await employeeListPage.openPIM();
        await employeeListPage.filterByJobTitle(targetJobTitle, 'QA Lead');
        await employeeListPage.filterBySubUnit(targetSubUnit);
        await employeeListPage.clickResetButton();
    });
});

