const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class TrialDetailScreen extends AuthedScreen {

    get count() {
        return this.driver.findElement(By.xpath('//*[@id="count"]')).getText();
    }

    async clickTrialMenuTrialAccountCreate() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/div/div/ul/li[2]/a')).click();
    }

    async clickBtnTrialAccountCreate() {
        await this.driver.findElement(By.id('bt_download')).click();
    }

    async inputCount(count) {
        await this.driver.findElement(By.name('count')).sendKeys(count);
    }


}
