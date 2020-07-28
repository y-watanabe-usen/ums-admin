const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const AuthedScreen = require(`${__dirname}/common/authed_screen`);

module.exports = class AccountSearchScreen extends AuthedScreen {
    get title() {
        return this.driver.findElement(By.className('main-title')).getText();
    }
    get searchCount() {
        return this.driver.findElement(By.id('search_cnt')).getText();
    }
    get firstCustCd() {
        return this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]')).getText();
    }

    async inputCustCd(custCd) {
        await this.driver.findElement(By.id('cust_cd')).sendKeys(custCd);
    }

    async clickBtnSearch() {
        await this.driver.findElement(By.id('bt_search')).click();
        await this.driver.wait(until.elementLocated(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]')), 10000); // 検索結果が表示されるまで待機
    }
    async clickBtnDetail() {
        await this.driver.findElement(By.className('bt_mini bt_detail')).click();
    }
}