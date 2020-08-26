const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const Dir = require('dir');
const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class PublishDownloadScreen extends AuthedScreen {
    get firstCustCd() {
        return this.driver.findElement(By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr/td[1]/span')).getText();
    }
    get UploadMessage() {
        return this.driver.findElement(By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr/td[7]')).getText();
    }

    async clickPublishUpload() {
        await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/div/div/ul/li[3]/a')).click();
    }
    async clickBtnFile(file) {
        await this.driver.findElement(By.name('file')).sendKeys(`${__dirname}/../../files` + file);
    }
    async clickIssueDivDownload() {
        await this.driver.findElement(By.xpath('//*[@id="fr_upload"]/table/tbody/tr[3]/td[2]/input[1]')).click();
    }
    async clickBtnUpload() {
        await this.driver.findElement(By.id('bt_upload')).click();
    }
    async clickBtnUpdate() {
        await this.driver.findElement(By.id('bt_save')).click();
    }
}