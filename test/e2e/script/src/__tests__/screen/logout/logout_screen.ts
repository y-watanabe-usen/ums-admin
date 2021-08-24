import { By, until } from "selenium-webdriver";

import NotAuthedScreen from "@/screen/common/not_authed_screen";

export default class LogoutScreen extends NotAuthedScreen {
  get alert() {
    return this.driver
      .findElement(By.xpath('//*[@id="p1"]/table/tbody/tr[6]/td'))
      .getText();
  }

  async clickBtnLogout() {
    await this.driver
      .findElement(By.xpath('//*[@id="header_icon_logout"]/button'))
      .click();
  }

  async logoutClick() {
    await this.driver.wait(until.alertIsPresent());
    const alert = await this.driver.switchTo().alert();
    await alert.accept();
  }
}
