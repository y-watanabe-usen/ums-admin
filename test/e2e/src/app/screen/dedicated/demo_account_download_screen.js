const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Dir = require('dir');
const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class DemoAccountDownloadScreen extends AuthedScreen {

    async clickTrialMenuDemoAccountDownload() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/div/div/ul/li[6]/a')).click();
    }

    async clickBtnDemoAccountDownload() {
        await this.driver.findElement(By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[1]/td[4]/span/button')).click();
    }

}
