import { By, until } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class DemoCreateScreen extends AuthedScreen {
  async clickTrialMenuDemoAccountCreate() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[5]/a"))
      .click();
  }

  async clickDemoAccountSearch() {
    await this.driver.findElement(By.id("bt_search")).click();
    await this.driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]')
      ),
      10000
    ); // 検索結果が表示されるまで待機
  }

  async clickBtnDemoAccountCreate() {
    await this.driver.findElement(By.id("bt_download")).click();
  }

  async inputLoginId(accountId: string) {
    await this.driver.findElement(By.id("login_id")).sendKeys(accountId);
  }

  async inputCount(count: string) {
    await this.driver.findElement(By.name("count")).sendKeys(count);
  }
}
