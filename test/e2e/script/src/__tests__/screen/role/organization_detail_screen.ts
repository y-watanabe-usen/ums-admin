import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class OrganizationDetailScreen extends AuthedScreen {
  get infoOrganizationCd() {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[1]'))
      .getText();
  }

  get infoOrganizationName() {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[2]'))
      .getText();
  }

  get updateTargetOrganizationCd() {
    return this.driver
      .findElement(By.xpath('//*[@id="mityaku"]/table/tbody/tr/td[1]'))
      .getText();
  }

  get updateTargetOrganizationName() {
    return this.driver
      .findElement(By.xpath('//*[@id="mityaku"]/table/tbody/tr/td[2]'))
      .getText();
  }

  get btnEnable() {
    const elemBtn = this.driver.findElement(
      By.xpath('//*[@id="label_radio"]/span')
    );
    return elemBtn.isEnabled();
  }

  get updateCompleted() {
    return this.driver
      .findElement(By.xpath('//*[@id="pop_role"]/div[2]/div[2]'))
      .getText();
  }

  async clickBtnBackSearch() {
    await this.driver.findElement(By.id("bt_back")).click();
  }

  async clickBtnEnable() {
    await this.driver
      .findElement(
        By.xpath(
          "/html/body/div[2]/div/div[2]/div[4]/div/div[2]/div/table/tbody/tr[1]/td[4]/div/label[1]/span"
        )
      )
      .click();
  }

  async clickBtnEdit() {
    await this.driver
      .findElement(
        By.xpath("/html/body/div[2]/div/div[2]/div[4]/div/div[1]/div[2]/button")
      )
      .click();
  }
  async clickBtnSave() {
    await this.driver
      .findElement(By.xpath('//*[@id="pop_role"]/div[2]/div[4]/button[1]'))
      .click();
  }

  async clickBtnClose() {
    await this.driver
      .findElement(By.xpath('//*[@id="pop_role"]/div[2]/div[4]/button[2]'))
      .click();
  }

  async clickBtnDisable() {
    await this.driver
      .findElement(
        By.xpath(
          "/html/body/div[2]/div/div[2]/div[4]/div/div[2]/div/table/tbody/tr[1]/td[4]/div/label[2]/span"
        )
      )
      .click();
  }
}
