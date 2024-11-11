import { test, expect } from '@playwright/test';
import {CounterPage} from "../../main/pages/CounterPage";

test.describe('Counter Functionality Tests', () => {
    let counterPage: CounterPage;

    test.beforeEach(async ({ page }) => {
        counterPage = new CounterPage(page);
        await counterPage.navigateTo();
    });
    test('Increment counter by one and verify', async ({page}) => {
    const firstincrement = '1'
            await counterPage.incrementCounter(firstincrement);
            const counterValue = await counterPage.getCounterValue();
            expect(counterValue).toBe(firstincrement);
    });
    test('Increment counter by multiple steps and verify', async ({page}) => {

        const incrementSteps = '5';
            await counterPage.incrementCounter(incrementSteps);
            await page.pause();
            const counterValue = await counterPage.getCounterValue();
            expect(counterValue).toBe(incrementSteps);
    });
    test('Verify counter functionality with large number increments', async ({page}) => {
        const largeIncrement = '100';

            await counterPage.incrementCounter(largeIncrement);
            await page.pause();
            const counterValue = await counterPage.getCounterValue();
            expect(counterValue).toBe(largeIncrement);

    });
    test('Verify counter does not change with no increments', async ({page}) => {
            const counterValue = await counterPage.getCounterValue();
            await page.pause();
            expect(counterValue).toBe(0);

    });
});