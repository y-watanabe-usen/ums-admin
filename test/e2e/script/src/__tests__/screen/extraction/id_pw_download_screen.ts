import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

// データ抽出・ID/PW抽出（顧客CD指定）画面
export default class IdPwDownloadScreen extends AuthedScreen {
  get title() {
    return this.driver.findElement(By.className("main-title")).getText();
  }

  get serviceCd() {
    return this.driver.findElement(By.name("service_cd")).getAttribute("value"); // valueを取得（テキストの取得調査中）
  }

  get alert() {
    return this.driver.findElement(By.id("err_message")).getText();
  }

  async selectServiceCd(value: string) {
    await this.driver
      .findElement(
        By.xpath(
          '//*[@id="fr_upload"]/table/tbody/tr[1]/td[2]/select/option[@value="' +
            value +
            '"]'
        )
      )
      .click();
  }

  async clickBtnFile(file: string) {
    await this.driver
      .findElement(By.name("file"))
      .sendKeys(`${__dirname}/../../files` + file);
  }

  async clickBtnDownload() {
    await this.driver.findElement(By.id("bt_download")).click();
  }
}
