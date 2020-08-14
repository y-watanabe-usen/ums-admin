const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Dir = require('dir');
const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class TrialAccountDetailScreen extends AuthedScreen {

    get accountId() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[1]')).getText();
    }

    get loginId() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[2]')).getText();
    }

    get password() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[3]')).getText();
    }

    get salesChannel() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[4]')).getText();
    }

    get issueDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[5]')).getText();
    }

    get firstAuthenticationDatetimes() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[6]')).getText();
    }

    get expireDate() {
        return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[7]')).getText();
    }

    async clickBtnReturnSearchList() {
        await this.driver.findElement(By.id('bt_back')).click();
    }
}