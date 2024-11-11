import { Page } from '@playwright/test';
export class CounterPage {
    constructor(private page: Page) {}
    async navigateTo() {
        await this.page.goto('https://flutter-angular.web.app/');

    }
    private moreOptions = this.page.locator('//*[@class="mdc-icon-button mat-mdc-icon-button mat-unthemed mat-mdc-button-base"]');
    private counterValue = this.page.locator('flutter-view');
    private incrementButton = this.page.getByLabel('Clicks');


    async getCounterValue(): Promise<number> {
        return parseInt(await this.counterValue.getAttribute('value'));
    }
    async incrementCounter(times: string) {
        await this.page.pause();
        await this.moreOptions.click();
        await this.incrementButton.fill(times);

    }
}
