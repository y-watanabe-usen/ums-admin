const { Builder, By, Key, Capabilitiesi, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

// データ抽出・アカウント証発送履歴抽出
module.exports = class IssueHistoryDownloadScreen extends AuthedScreen {

    get title() {
        return this.driver.findElement(By.className('main-title')).getText();
    }

    get from() {
        return this.driver.findElement(By.name('from')).getAttribute("value");
    }

    get to() {
        return this.driver.findElement(By.name('to')).getAttribute("value");
    }

    get alert() {
        return this.driver.findElement(By.xpath('//*[@id="dl_message"]')).getText();
    }

    async inputFrom(from) {
        await this.driver.findElement(By.name('from')).sendKeys(from);
    }

    async inputTo(to) {
        await this.driver.findElement(By.name('to')).sendKeys(to);
    }

    async clickBtnLastMonth() {
        await this.driver.findElement(By.id('bt_last_month')).click();
    }

    async clickBtnThisMonth() {
        await this.driver.findElement(By.id('bt_this_month')).click();
    }

    async clickBtnDownload() {
        await this.driver.findElement(By.id('bt_download')).click();
    }
}
