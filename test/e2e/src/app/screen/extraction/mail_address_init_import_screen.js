const { Builder, By, Key, Capabilitiesi, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

// データ抽出・メールアドレス初回登録・仮ID/PW抽出画面
module.exports = class MailAddressInitImportScreen extends AuthedScreen {

  get title() {
    return this.driver.findElement(By.className('main-title')).getText();
  }

  get alert() {
    return this.driver.findElement(By.id('err_message')).getText();
  }

  get enableBtnDownload() {
    return this.driver.findElement(By.id('bt_download')).isEnabled();
  }

  async clickBtnFile(file) {
    await this.driver.findElement(By.name('file')).sendKeys(`${__dirname}/../../files` + file);
  }

  async clickBtnUpload() {
    await this.driver.findElement(By.id('bt_upload')).click();
  }

  async clickBtnDownload() {
    await this.driver.findElement(By.id('bt_download')).click();
  }

  async downloadClick() {
    await this.driver.wait(until.alertIsPresent());
    let alert = await this.driver.switchTo().alert();
    await alert.accept();
  }
}
