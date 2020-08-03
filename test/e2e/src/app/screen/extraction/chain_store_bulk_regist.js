const { Builder, By, Key, Capabilitiesi, until} = require('selenium-webdriver');
const AuthedScreen = require(`${__dirname}/../common/authed_screen`);

// データ抽出・USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面
module.exports = class ChainStoreBulkRegistScreen extends AuthedScreen {

    get title() {
        return this.driver.findElement(By.className('main-title')).getText();
    }

    get radioBranch() {
        return this.driver.findElement(By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[1]')).isSelected();
    }

    get radioClient() {
        return this.driver.findElement(By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[2]')).isSelected();
    }

    get alert() {
        return this.driver.findElement(By.id('err_message')).getText();
    }

    get enableBtnDownload() {
        return this.driver.findElement(By.id('bt_download')).isEnabled();
    }

    async clickRadioBranch() {
        await this.driver.findElement(By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[1]')).click();
    }

    async clickRadioClient() {
        await this.driver.findElement(By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[2]')).click();
    }

    async clickBtnFile() {
        //await this.driver.findElement(By.name('file')).sendKeys('files' + file);
        //await this.driver.findElement(By.xpath('//*[@id="fr_upload"]/table/tbody/tr[2]/td[2]/input[1]')).sendKeys('files' + file);
    }

    async clickBtnUpload() {
        await this.driver.findElement(By.id('bt_upload')).click();
    }

    async clickBtnDownload() {
        await this.driver.findElement(By.id('bt_download')).click();
    }
}
