import {expect, test_hooks as test} from '../hooks/BaseTest';

test.describe('Add Employee Page', () => {

    test('Add a new employee and verify the employee ID', { tag: ['@regression'] }, async ({ addEmployeePage, employeeListPage, pimPage}, testInfo) => {
        // Triples the timeout for THIS test only (e.g., 30s -> 90s)
        testInfo.slow();

        await employeeListPage.openPIM();

        await pimPage.clickAddEmployeeTab();
        
        const createdEmployeeId1 = await addEmployeePage.fillEmployeeDetails('John', 'A.', 'Doe');
            console.log(`Created Employee ID1: ${createdEmployeeId1}`);
            expect(createdEmployeeId1).toBeTruthy();
    });

    test('Add a new employee and verify the employee appears in the Employee List', { tag: ['@regression'] }, async ({ addEmployeePage, employeeListPage, pimPage }) => {
        const firstName = 'Jane2';
        const middleName = 'B2.';
        const lastName = 'Smith2';

        await employeeListPage.openPIM();

        await pimPage.clickAddEmployeeTab();

         // 1. Create employee and capture the dynamic ID
        const createdEmployeeId2 = await addEmployeePage.fillEmployeeDetails(firstName, middleName, lastName);
                console.log(`Created Employee ID2: ${createdEmployeeId2}`);
        // 2. Navigate to Employee List and search using the captured ID and name
        //await employeeListPage.openPIM();
        await pimPage.clickEmployeeListTab();
        await employeeListPage.searchEmployeeById(`${firstName} ${middleName} ${lastName}`, createdEmployeeId2);

        // 3. Assert the employee appears in the search results table
        await employeeListPage.verifyEmployeeInResults(firstName, lastName, createdEmployeeId2);
    });

});