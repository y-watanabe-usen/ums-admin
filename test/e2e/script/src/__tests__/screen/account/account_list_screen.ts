import { By } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class AccountListScreen extends AuthedScreen {
  get firstCustCd(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[1]/td[2]'
        )
      )
      .getText();
  }
  get name(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[2]/td[2]'
        )
      )
      .getText();
  }
  get clientStatus(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[3]/td[2]'
        )
      )
      .getText();
  }
  get address(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[4]/td[2]'
        )
      )
      .getText();
  }
  get tel(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[5]/td[2]'
        )
      )
      .getText();
  }
  get branch(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[6]/td[2]'
        )
      )
      .getText();
  }
  get regularStore(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[1]/td[2]'
        )
      )
      .getText();
  }
  get industry(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[2]/td[2]'
        )
      )
      .getText();
  }
  get launch(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[3]/td[2]'
        )
      )
      .getText();
  }
  get close(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[4]/td[2]'
        )
      )
      .getText();
  }
  get cancell(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[5]/td[2]'
        )
      )
      .getText();
  }
  get lastUpdate(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[6]/td[2]'
        )
      )
      .getText();
  }
  get accountId(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[1]'))
      .getText();
  }
  get accountStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[2]'))
      .getText();
  }
  get loginId(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[3]'))
      .getText();
  }
  get mailAddress(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[4]'))
      .getText();
  }
  get umsidStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[5]'))
      .getText();
  }
  get umsidRegistDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[6]'))
      .getText();
  }
  get umsidLostDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[7]'))
      .getText();
  }
  get availability(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[9]'))
      .getText();
  }
  get shippingDate(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[1]')
      )
      .getText();
  }
  get missedDate(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[2]')
      )
      .getText();
  }
  get shippingName(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[3]')
      )
      .getText();
  }
  get shippingAddress(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[4]')
      )
      .getText();
  }
  get destination(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[5]')
      )
      .getText();
  }
  get shippingStatus(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[6]')
      )
      .getText();
  }
  get outputDate(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr/td[1]'
        )
      )
      .getText();
  }
  get outputName(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr/td[2]'
        )
      )
      .getText();
  }
  get outputAddress(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr/td[3]'
        )
      )
      .getText();
  }
  get outputPerson(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr/td[4]'
        )
      )
      .getText();
  }
  get deleteTableShippingDate(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath('//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[1]')
      )
      .getText();
  }
  get addTableDirectOutputDate(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr[1]/td[1]'
        )
      )
      .getText();
  }
  get addTableDirectOutputName(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr[1]/td[2]'
        )
      )
      .getText();
  }
  get addTableDirectOutputAddress(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr[1]/td[3]'
        )
      )
      .getText();
  }
  get addTableDirectOutputPerson(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_direct_pdf"]/tbody/tr/td/div/table/tbody/tr[1]/td[4]'
        )
      )
      .getText();
  }
  async clickBtnReturnList(): Promise<void> {
    await this.driver.findElement(By.id("bt_back")).click();
  }
  async clickBtnDetail(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[10]'))
      .click();
  }
  async clickBtnReRegist(): Promise<void> {
    await this.driver.findElement(By.id("bt_issue")).click();
  }
  async clickBtnReRegistSave(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="pop_issue"]/div[2]/div[10]/button[1]'))
      .click();
  }
  async clickBtnReRegistClose(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="pop_issue"]/div[2]/div[10]/button[2]'))
      .click();
  }
  async clickBtnShippingDelete(): Promise<void> {
    await this.driver
      .findElement(
        By.xpath(
          '//*[@id="grid_issue"]/tbody/tr/td/div/table/tbody/tr/td[7]/span/button'
        )
      )
      .click();
  }
  async clickBtnShippingDeleteClose(): Promise<void> {
    await this.driver
      .findElement(
        By.xpath('//*[@id="pop_status_flag"]/div[2]/div[3]/button[2]')
      )
      .click();
  }
  async clickBtnDirectOutput(): Promise<void> {
    await this.driver.findElement(By.id("bt_direct_pdf")).click();
  }
  async clickBtnDirectOutputSave(): Promise<void> {
    await this.driver
      .findElement(
        By.xpath('//*[@id="pop_direct_pdf"]/div[2]/div[3]/button[1]')
      )
      .click();
  }
  async clickBtnDirectOutputClose(): Promise<void> {
    await this.driver
      .findElement(
        By.xpath('//*[@id="pop_direct_pdf"]/div[2]/div[3]/button[2]')
      )
      .click();
  }
}
