import {expect, test_hooks as test} from '../hooks/BaseTest';
import { PIMPage } from '../pages/PIMPage';

test.describe('PIM Module', () => {

    test('Verify PIM Module Navigation', { tag: ['@smoke'] },async ({ pimPage }) => {
        //const pimPage = new PIMPage(appPage);

        //await pimPage.gotoDashboard();

        await pimPage.clickPIMSidebarMenu();

        //await pimPage.clickEmployeeListTab();
        await expect(pimPage.getheaderEmployeeList()).toBeVisible();   

        await pimPage.clickAddEmployeeTab();
        await expect(pimPage.getheaderAddEmployee()).toBeVisible();

        await pimPage.clickReportsTab();
        await expect(pimPage.getheaderReports()).toBeVisible(); 

        await pimPage.clickConfigurationTab();

        await pimPage.selectConfigurationOptions('Optional Fields');        
        await expect(pimPage.getSectionHeader('Optional Fields')).toBeVisible();

        await pimPage.selectConfigurationOptions('Custom Fields');
        await expect(pimPage.getSectionHeader('Custom Fields')).toBeVisible();

        await pimPage.selectConfigurationOptions('Data Import');
        await expect(pimPage.getSectionHeader('Data Import')).toBeVisible();

        await pimPage.selectConfigurationOptions('Reporting Methods');  
        await expect(pimPage.getSectionHeader('Reporting Methods')).toBeVisible();

        await pimPage.selectConfigurationOptions('Termination Reasons');
        await expect(pimPage.getSectionHeader('Termination Reasons')).toBeVisible();
    });
});



