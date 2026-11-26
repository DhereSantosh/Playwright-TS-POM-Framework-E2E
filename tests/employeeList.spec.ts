import {test_hooks as test} from '../hooks/BaseTest';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { PIMPage } from '../pages/PIMPage';

test.describe('Employee List Page', { tag: '@regression' }, () => {
    test('Filter employees by Job Title and verify table results', async ({ employeeListPage }) => {      
        
        // Triples the timeout for THIS test only (e.g., 30s -> 90s)
        //testInfo.slow();

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

    test('Verify Add, search, and delete a new employee in Employee List', { tag: ['@regression'] }, async ({ addEmployeePage, employeeListPage, pimPage }) => {
        // Unique suffix prevents duplicate-record collisions when multiple workers run in parallel
            const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
            const firstName = `Jane_${uniqueSuffix}`;
            const middleName = 'B.';
            const lastName = 'Smith';



        await employeeListPage.openPIM();
        await pimPage.clickAddEmployeeTab();

        // 1. Create employee and capture the dynamic ID
        const createdEmployeeId = await addEmployeePage.fillEmployeeDetails(firstName, middleName, lastName);
        console.log(`Created Employee ID (Delete Flow): ${createdEmployeeId}`);
        
        // 2. Navigate to Employee List and search using the captured ID
        await pimPage.clickEmployeeListTab();
        await employeeListPage.searchEmployeeById(`${firstName} ${middleName} ${lastName}`, createdEmployeeId);

        // 3. Assert the employee appears in the search results table
        await employeeListPage.verifyEmployeeInResults(firstName, lastName, createdEmployeeId);

        // 4. Click Delete, validate confirmation popup text, click 'Yes, Delete', and verify removal
        await employeeListPage.deleteEmployeeById(createdEmployeeId);
        await employeeListPage.verifyEmployeeDeleted();

    });
});

