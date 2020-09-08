const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class OrganizationSearchScreen extends AuthedScreen {

    get firstOrganizationCd() {
        return this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr/td[1]')).getText();
    }

    async inputOrganizationCd(organizationCd) {
        await this.driver.findElement(By.id('code')).sendKeys(organizationCd);
    }

    async clickRoleMenuOrganizationSearch() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/div/div/ul/li[2]/a')).click();
    }

    async clickBtnSearch() {
        await this.driver.findElement(By.id('bt_search')).click();
        await this.driver.wait(until.elementLocated(By.xpath('//*[@id="search_table"]/tbody/tr/td[1]')), 10000); // 検索結果が表示されるまで待機
    }

    async clickBtnDetail() {
        await this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr/td[3]/button')).click();
    }
}