import { By, until } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class AccountServiceDetailScreen extends AuthedScreen {
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
  get cancel(): Promise<string> {
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

  get serviceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[1]'))
      .getText();
  }
  get contractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[2]'))
      .getText();
  }
  get StatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[3]'))
      .getText();
  }
  get contractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[4]'))
      .getText();
  }
  get billingStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[5]'))
      .getText();
  }
  get endMonth(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[6]'))
      .getText();
  }
  get contractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[7]'))
      .getText();
  }
  get fixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[8]'))
      .getText();
  }
  get firstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[9]'))
      .getText();
  }
  get firstAuthDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[10]'))
      .getText();
  }
  get endDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[11]'))
      .getText();
  }
  get serviceEnable(): Promise<boolean> {
    const elemBtn = this.driver.findElement(By.id("bt_unlock"));
    return elemBtn.isEnabled();
  }
  get closedStore(): Promise<string> {
    this.driver.sleep(500);
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr/td[1]'))
      .getText();
  }
  get forcedUnlockDisable(): Promise<string> {
    this.driver.sleep(500);
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr/td[4]'))
      .getText();
  }

  get forceUnlockCompletedMessage(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="pop_release"]/div[2]/div[2]'))
      .getText();
  }

  async clickBtnServiceDetail(): Promise<void> {
    await this.driver
      .findElement(By.className("bt_detail_account_stop"))
      .click();
  }
  async clickBtnReturnDetail(): Promise<void> {
    await this.driver.findElement(By.id("bt_back")).click();
  }
  async clickBtnForcedUnlock(): Promise<void> {
    await this.driver.findElement(By.xpath('//*[@id="bt_unlock"]')).click();
  }
  async clickBtnForcedUnlockSave(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="pop_unlock"]/div[2]/div[3]/button[1]'))
      .click();
  }
  async clickBtnForcedUnlockClose(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="pop_unlock"]/div[2]/div[3]/button[2]'))
      .click();
  }
  async clickBtnAddClosedRegist(): Promise<void> {
    await this.driver.findElement(By.id("bt_add_stop")).click();
  }
  async inputStopTo(date: string): Promise<void> {
    await this.driver.findElement(By.id("stop_to")).sendKeys(date);
  }
  async clickBtnAddClosedRegistSave(): Promise<void> {
    await this.driver
      .findElement(
        By.xpath('//*[@id="pop_service_stop_add"]/div[2]/div[5]/button[1]')
      )
      .click();
  }
  async clickBtnAddClosedRegistClose(): Promise<void> {
    await this.driver
      .findElement(
        By.xpath('//*[@id="pop_service_stop_add"]/div[2]/div[5]/button[2]')
      )
      .click();
  }
  async clickBtnAddForcedUnlock(): Promise<void> {
    await this.driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[4]/button[2]')
      ),
      10000
    );
    await this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[4]/button[2]'))
      .click();
  }
  async clickBtnUnlockSave(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="pop_release"]/div[2]/div[3]/button[1]'))
      .click();
    await this.driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="pop_release"]/div[2]/div[3]/button[2]')
      ),
      10000
    ); // 検索結果が表示されるまで待機
  }
  async clickBtnUnlockClose(): Promise<void> {
    await this.driver.sleep(500);
    await this.driver
      .findElement(By.xpath('//*[@id="pop_release"]/div[2]/div[3]/button[2]'))
      .click();
  }
  async stopDivision(): Promise<void> {
    await this.driver.sleep(500);
    this.driver
      .findElement(By.xpath('//*[@id="stop_div"]/option[2][@value="2"]'))
      .click();
  }
  async clickBtnTable(): Promise<void> {
    await this.driver
      .findElement(
        By.xpath(
          '//*[@id="pop_service_stop_add"]/div[2]/table/tbody/tr[2]/td[1]'
        )
      )
      .click();
  }
}
