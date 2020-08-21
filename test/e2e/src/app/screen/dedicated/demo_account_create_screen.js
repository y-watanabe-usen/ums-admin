const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Dir = require('dir');
const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class DemoAccountCreateScreen extends AuthedScreen {

    async clickTrialMenuDemoAccountCreate() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/div/div/ul/li[5]/a')).click();
    }

    async clickDemoAccountSearch() {
        await this.driver.findElement(By.id('bt_search')).click();
        await this.driver.wait(until.elementLocated(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]')), 10000); // 検索結果が表示されるまで待機
    }

    async clickBtnDemoAccountCreate() {
        await this.driver.findElement(By.id('bt_download')).click();
    }

    async inputLoginId(accountId) {
        await this.driver.findElement(By.id('login_id')).sendKeys(accountId);
    }

    async inputCount(count) {
        await this.driver.findElement(By.name('count')).sendKeys(count);
    }

}