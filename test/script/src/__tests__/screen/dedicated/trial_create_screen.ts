import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class TrialDetailScreen extends AuthedScreen {
  get count() {
    return this.driver.findElement(By.xpath('//*[@id="count"]')).getText();
  }

  async clickTrialMenuTrialAccountCreate() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[2]/a"))
      .click();
  }

  async clickBtnTrialAccountCreate() {
    await this.driver.findElement(By.id("bt_download")).click();
  }

  async inputCount(count: string) {
    await this.driver.findElement(By.name("count")).sendKeys(count);
  }
}
