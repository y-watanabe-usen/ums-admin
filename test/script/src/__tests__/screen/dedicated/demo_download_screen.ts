import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class DemoDownloadScreen extends AuthedScreen {
  async clickTrialMenuDemoAccountDownload() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[6]/a"))
      .click();
  }

  async clickBtnDemoAccountDownload() {
    await this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[1]/td[4]/span/button'
        )
      )
      .click();
  }
}
