import { By, until } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class AccountSearchScreen extends AuthedScreen {
  get title(): Promise<string> {
    return this.driver.findElement(By.className("main-title")).getText();
  }
  get searchCount(): Promise<string> {
    return this.driver.findElement(By.id("search_cnt")).getText();
  }
  get firstCustCd(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]'))
      .getText();
  }

  async inputCustCd(custCd: string): Promise<void> {
    await this.driver.findElement(By.id("cust_cd")).sendKeys(custCd);
  }

  async clickBtnSearch(): Promise<void> {
    await this.driver.findElement(By.id("bt_search")).click();
    await this.driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]')
      ),
      10000
    ); // 検索結果が表示されるまで待機
  }
  async clickBtnDetail(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="search_table"]/tbody/tr/td[8]/button'))
      .click();
  }
}
