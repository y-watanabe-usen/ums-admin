const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Dir = require('dir');
const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class TrialAccountDownloadScreen extends AuthedScreen {

    async clickTrialMenuTrialAccountDownload() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/div/div/ul/li[3]/a')).click();
    }

    async clickBtnTrialAccountDownload() {
        await this.driver.findElement(By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[1]/td[4]/span/button')).click();
    }

}
