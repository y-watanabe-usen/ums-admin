import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

// データ抽出・アカウント証発送履歴抽出
export default class IssueHistoryDownloadScreen extends AuthedScreen {
  get title() {
    return this.driver.findElement(By.className("main-title")).getText();
  }

  get from() {
    return this.driver.findElement(By.name("from")).getAttribute("value");
  }

  get to() {
    return this.driver.findElement(By.name("to")).getAttribute("value");
  }

  get alert() {
    return this.driver.findElement(By.xpath('//*[@id="dl_message"]')).getText();
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
