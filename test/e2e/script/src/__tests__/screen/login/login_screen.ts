import { By } from "selenium-webdriver";
import Const from "@/lib/const";
import NotAuthedScreen from "@/screen/common/not_authed_screen";

export default class LoginScreen extends NotAuthedScreen {
  get code() {
    return this.driver.findElement(By.name("code")).getText();
  }

  get password() {
    return this.driver.findElement(By.name("password")).getText();
  }

  get alert() {
    return this.driver
      .findElement(By.xpath('//*[@id="p1"]/table/tbody/tr[6]/td'))
      .getText();
  }

  async access() {
    await this.driver.get(Const.ADMIN_URL);
  }
  async inputCode(code: string) {
    await this.driver.findElement(By.name("code")).sendKeys(code);
  }

  async inputPassword(password: string) {
    await this.driver.findElement(By.name("password")).sendKeys(password);
  }

  async clickBtnLogin() {
    await this.driver.findElement(By.id("bt_login")).click();
  }
}
