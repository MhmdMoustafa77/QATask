import { test, expect } from '@playwright/test';
import {ProductPage} from "../../main/pages/ProductPage";



test.describe("Product Tests" , () => {
    let productPage: ProductPage;
    test.beforeEach(async({page}) => {
        productPage = new ProductPage(page);
        await productPage.navigatto();

    });
    test('Add new product and verify', async ({page}) => {
        const productTitle = 'samsung ultra 90'
        const productDescription = 'Get to know the best flagship phone from Samsung, which is the monster Samsung Galaxy S23 Ultra. It comes with the strongest specifications, as it comes with a Snapdragon 8 Gen 2 processor with excellent rear and front cameras with a 120 Hz AMOLED screen. These specifications will be sufficient and sufficient to purchase the phone, so let us get to know the exact specifications Samsung.';
        const productPrice = '900';
        await page.pause();
        await productPage.addProduct(productTitle, productDescription, productPrice);
        await page.evaluate(() => window.scrollBy(0, 1000));
        const productExists = await productPage.verifyMultipleProductsExists(productTitle);
        expect(productExists).toBeTruthy();

    });
    test('Edit existing product and verify', async ({page}) => {
        const originalProductTitle = 'Iphone 2080';
        await page.pause();
        const newProductTitle = 'Iphone 2070';
        const newDescription = 'This description is updated and the product is fully update';
        const newPrice = '270';
        await productPage.editProduct(originalProductTitle, newProductTitle , newDescription , newPrice);
        const productExists = await productPage.verifyMultipleProductsExists(newProductTitle);
        expect(productExists).toBeTruthy();


    });

    test('Delete product and verify', async ({page}) => {
        const productTitle = 'sddsaasdddd';
        await page.pause();
        await productPage.deleteProduct(productTitle);
        const productExists = await productPage.verifyMultipleProductsExists(productTitle);
        expect(productExists).toBeFalsy();
    });

    test('Search for a product and validate results', async ({page}) => {
        const productTitle = 'Apple Mac Book Pro 2024editable product test';
        await page.pause();
        await productPage.searchProduct(productTitle);
        const productExists = await productPage.verifyMultipleProductsExists(productTitle);
        expect(productExists).toBeTruthy();

    });

});


