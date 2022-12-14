import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class TrialDownloadScreen extends AuthedScreen {
  async clickTrialMenuTrialAccountDownload() {
    await this.driver
      .findElement(By.xpath("/html/body/div[2]/div/div[1]/div/div/ul/li[3]/a"))
      .click();
  }

  async clickBtnTrialAccountDownload() {
    await this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid1"]/tbody/tr/td/div/table/tbody/tr[1]/td[4]/span/button'
        )
      )
      .click();
  }
}
