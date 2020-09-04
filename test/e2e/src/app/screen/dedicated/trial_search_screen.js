const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class TrialSearchScreen extends AuthedScreen {
    get code() {
        return this.driver.findElement(By.name('code')).getText();
    }

    get password() {
        return this.driver.findElement(By.name('password')).getText();
    }

    get alert() {
        return this.driver.findElement(By.xpath('//*[@id="p1"]/table/tbody/tr[6]/td')).getText();
    }

    get firstLoginId() {
        return this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr/td[2]')).getText();
    }

    get firstAccountId() {
        return this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]')).getText();
    }

    async clickBtnTrial() {
        await this.driver.findElement(By.xpath('/html/body/div[1]/div[3]/ul/li[4]/a')).click();
    }

    async inputPassword(password) {
        await this.driver.findElement(By.name('password')).sendKeys(password);
    }

    async clickBtnLogin() {
        await this.driver.findElement(By.id('bt_login')).click();
    }

    async clickBtnTrialAccountSearch() {
        await this.driver.findElement(By.xpath('//*[@id="bt_search"]')).click();
        await this.driver.wait(until.elementLocated(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]')), 10000); // 検索結果が表示されるまで待機
    }

    async clickBtnDetail() {
        await this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[9]/button')).click();
    }

    async clickBtnDownload() {
        await this.driver.findElement(By.id('bt_download')).click();
    }

    async inputLoginId(loginId) {
        await this.driver.findElement(By.id('login_id')).sendKeys(loginId);
    }

    async inputAccountId(accountId) {
        await this.driver.findElement(By.id('account_id')).sendKeys(accountId);
    }
}