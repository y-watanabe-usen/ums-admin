import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

// データ抽出・初回認証済顧客抽出画面
export default class InitedCustCdDownloadScreen extends AuthedScreen {
  get title() {
    return this.driver.findElement(By.className("main-title")).getText();
  }

  get from() {
    return this.driver.findElement(By.name("from")).getAttribute("value");
  }

  get to() {
    return this.driver.findElement(By.name("to")).getAttribute("value");
  }

  get service() {
    return this.driver.findElement(By.name("service")).getAttribute("value"); // valueを取得（テキストの取得調査中）
  }

  get alert() {
    return this.driver.findElement(By.xpath('//*[@id="dl_message"]')).getText();
  }

  async selectService(value: string) {
    await this.driver
      .findElement(
        By.xpath(
          '//*[@id="fr_dl"]/table/tbody/tr[3]/td[2]/select/option[@value="' +
            value +
            '"]'
        )
      )
      .click();
  }

  async inputFrom(from: string) {
    await this.driver.findElement(By.name("from")).sendKeys(from);
  }

  async inputTo(to: string) {
    await this.driver.findElement(By.name("to")).sendKeys(to);
  }

  async clickBtnLastMonth() {
    await this.driver.findElement(By.id("bt_last_month")).click();
  }

  async clickBtnThisMonth() {
    await this.driver.findElement(By.id("bt_this_month")).click();
  }

  async clickBtnDownload() {
    await this.driver.findElement(By.id("bt_download")).click();
  }
}
