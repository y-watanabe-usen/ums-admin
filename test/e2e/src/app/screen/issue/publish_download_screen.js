const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Dir = require('dir');
const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class PublishDownloadScreen extends AuthedScreen {
    get shippingMessage() {
        return this.driver.findElement(By.xpath('//*[@id="dl_message"]')).getText();
    }
    get firstFileName() {
        return this.driver.findElement(By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[1]/td[1]/span')).getText();
    }

    async clickBtnShippingManagement() {
        await this.driver.findElement(By.xpath('/html/body/div[1]/div[3]/ul/li[2]/a')).click();
    }
    async clickBtnDownload() {
        await this.driver.findElement(By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[3]/td[4]/span/button')).click();
    }
    async clickBtnCreateShippingData() {
        await this.driver.findElement(By.xpath('//*[@id="bt_no_publish"]')).click();
    }
}