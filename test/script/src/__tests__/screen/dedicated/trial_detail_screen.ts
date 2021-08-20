import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class TrialDetailScreen extends AuthedScreen {
  get accountId() {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[1]'))
      .getText();
  }

  get loginId() {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[2]'))
      .getText();
  }

  get password() {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[3]'))
      .getText();
  }

  get salesChannel() {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[4]'))
      .getText();
  }

  get issueDate() {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[5]'))
      .getText();
  }

  get firstAuthenticationDatetimes() {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[6]'))
      .getText();
  }

  get expireDate() {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[7]'))
      .getText();
  }

  get viewingHistoryTotal() {
    return this.driver
      .findElement(By.xpath('//*[@id="grid3"]/tbody/tr[1]/td'))
      .getText();
  }

  async viewingHistoryNth(n: number) {
    return await this.driver
      .findElement(By.xpath(`//*[@id="grid3"]/tbody/tr[${n + 2}]/td`))
      .getText();
  }

  async clickBtnReturnSearchList() {
    await this.driver.findElement(By.id("bt_back")).click();
  }

  async clickBtnDownloadViewingHistory() {
    await this.driver.findElement(By.id("bt_download")).click();
  }
}
