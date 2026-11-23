import { expect } from '@playwright/test';
import { test_hooks as test } from '../hooks/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test ('Authenticate user', async ({ baseTest, appPage }) => {

    const loginPage = new LoginPage(appPage);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123')

    await expect(loginPage.getDashboardHeader()).toBeVisible();

    // Save authentication state to .auth/user.json
    await baseTest.saveAuthState();

    });
