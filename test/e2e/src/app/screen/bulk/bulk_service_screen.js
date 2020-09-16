const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class BulkSearchScreen extends AuthedScreen {

    get valkCustCd() {
        return this.driver.findElement(By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr/td[1]/span')).getText();
    }
    get valkUpdateStatus() {
        return this.driver.findElement(By.xpath('//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr/td[4]/span')).getText();
    }

    // 一括処理タブ押下
    async clickBtnBulk() {
        await this.driver.findElement(By.xpath('/html/body/div[1]/div[3]/ul/li[6]/a')).click();
    }
    // ファイルを選択ボタン押下
    async clickBtnFile(file) {
        await this.driver.findElement(By.name('file')).sendKeys(`${__dirname}/../../files` + file);
    }
    // 一括強制施錠／開錠登録ファイルをアップロードするボタンを押下
    async clickBtnBulkServiceUpload() {
        await this.driver.findElement(By.id('bt_upload')).click();
    }
    // 登録実行ボタンを押下
    async clickBtnBulkServiceUploadSave() {
        await this.driver.findElement(By.id('bt_download')).click();
    }
    // 登録時のダイアログでOKボタンを押下
    async clickBtnBulkUploadAlertAccept() {
        await this.driver.wait(until.alertIsPresent());
        let alert = await this.driver.switchTo().alert();
        await alert.accept();
    }
    // ダイアログをクローズ
    async clickBtnBulkUploadAlertClose() {
        await this.driver.findElement(By.id('bt_close_pop')).click();
    }
}