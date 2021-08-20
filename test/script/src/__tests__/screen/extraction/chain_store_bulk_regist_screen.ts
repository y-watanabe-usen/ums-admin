import { By, until } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

// データ抽出・USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面
export default class ChainStoreBulkRegistScreen extends AuthedScreen {
  get title() {
    return this.driver.findElement(By.className("main-title")).getText();
  }

  get radioBranch() {
    return this.driver
      .findElement(
        By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[1]')
      )
      .isSelected();
  }

  get radioClient() {
    return this.driver
      .findElement(
        By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[2]')
      )
      .isSelected();
  }

  get alert() {
    return this.driver.findElement(By.id("err_message")).getText();
  }

  get enableBtnDownload() {
    return this.driver.findElement(By.id("bt_download")).isEnabled();
  }

  async clickRadioBranch() {
    await this.driver
      .findElement(
        By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[1]')
      )
      .click();
  }

  async clickRadioClient() {
    await this.driver
      .findElement(
        By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[2]')
      )
      .click();
  }

  async clickBtnFile(file: string) {
    await this.driver
      .findElement(By.name("file"))
      .sendKeys(`${__dirname}/../../files` + file);
  }

  async clickBtnUpload() {
    await this.driver.findElement(By.id("bt_upload")).click();
  }

  async clickBtnDownload() {
    await this.driver.findElement(By.id("bt_download")).click();
  }

  async downloadClick() {
    await this.driver.wait(until.alertIsPresent());
    const alert = await this.driver.switchTo().alert();
    await alert.accept();
  }

  async chooseRadioBtnCustCd() {
    await this.driver
      .findElement(
        By.xpath('//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/input[2]')
      )
      .click();
  }
}
