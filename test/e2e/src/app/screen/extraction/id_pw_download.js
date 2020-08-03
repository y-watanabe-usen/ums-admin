const { Builder, By, Key, Capabilitiesi, until} = require('selenium-webdriver');
const AuthedScreen = require(`${__dirname}/../common/authed_screen`);

// データ抽出・ID/PW抽出（顧客CD指定）画面
module.exports = class IdPwDownloadScreen extends AuthedScreen {

    get title() {
        return this.driver.findElement(By.className('main-title')).getText();
    }

    get serviceCd() {
        return this.driver.findElement(By.name('service_cd')).getAttribute("value"); // valueを取得（テキストの取得調査中）
    }

    get alert() {
        return this.driver.findElement(By.id('err_message')).getText();
    }

    async selectServiceCd(value) {
        await this.driver.findElement(By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/select/option[@value="' + value + '"]')).click();
    }

    async clickBtnFile(file) {
        //await this.driver.findElement(By.name('file')).sendKeys('files' + file);
        //await this.driver.findElement(By.xpath('//*[@id="fr_upload"]/table/tbody/tr[2]/td[2]/input[1]')).sendKeys('files' + file);
    }

    async clickBtnDownload() {
        await this.driver.findElement(By.id('bt_download')).click();
    }
}
