import {Page} from "@playwright/test";
import * as path from "node:path";

export class ProductPage {
    constructor(private page: Page) {}
    async navigatto() {
        await this.page.goto('https://e-commerce-kib.netlify.app/')
    }
    private addButton = this.page.locator('//*[@class=\'cursor-pointer h-7 w-7\']');
    private titleField = this.page.locator('[name="title"]');
    private descriptionField = this.page.locator('//*[@id="root"]/div/main/div/form/div[2]/div[2]/input');
    private priceField = this.page.locator('[name="price"]');
    private saveButton = this.page.locator('[type="submit"]');
    private searchField = this.page.locator('//*[@placeholder="Search for products ..."]');
    private editButton = this.page.locator('//*[@id="root"]/div/main/div/div/div/div[2]/div[1]/div[4]/div[2]/button[1]');
    private deleteButton = this.page.locator('//*[@id="root"]/div/main/div/div/div/div[2]/div[1]/div[4]/div[2]/button[2]');


    async addProduct(title:string, description: string, price:string) {
        await this.addButton.click();
        await this.titleField.fill(title);
        await this.descriptionField.fill(description);
        await this.priceField.fill(price)
        await this.saveButton.click();
    }
    async editProduct(oldTitle: string, newTitle: string,newDescription: string , newPrice: string  ) {
        await this.searchField.fill(oldTitle);
        await this.editButton.click();
        await this.titleField.fill(newTitle);
        await this.descriptionField.fill(newDescription);
        await this.priceField.fill(newPrice);
        await this.saveButton.click();
    }
    async deleteProduct(title: string) {
        await this.searchField.fill(title);
        await this.deleteButton.click();
    }
    async searchProduct(title: string) {
        await this.searchField.fill(title);
    }
    async verifyMultipleProductsExists(title: string){
        return await this.page.locator(`text=${title}`).isVisible();
    }
}