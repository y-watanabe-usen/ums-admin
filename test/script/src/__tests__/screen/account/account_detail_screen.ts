import { By, until, WebElement } from "selenium-webdriver";

import AuthedScreen from "@/screen/common/authed_screen";

export default class AccountDetailScreen extends AuthedScreen {
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
  get initPassword(): Promise<string> {
    return this.driver
      .findElement(
        By.xpath('//*[@id="pop_password_change"]/div[2]/table/tbody/tr/td')
      )
      .getText();
  }
  get initPasswordMessage(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="pop_password_change"]/div[2]/div[1]'))
      .getText();
  }

  get initPasswordDisplay(): Promise<WebElement[]> {
    // id指定だと要素が取得できないためエラーになる
    // return this.driver.findElement(By.id("bt_password_change"));
    return this.driver.findElements(
      By.xpath(
        "/html/body/div[2]/div/div[3]/div/div[2]/table[1]/tbody/tr/td[2]"
      )
    );
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
  get usenCartServiceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[1]'))
      .getText();
  }
  get usenCartServiceContractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[2]'))
      .getText();
  }
  get usenCartServiceStatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[3]'))
      .getText();
  }
  get usenCartServiceContractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[4]'))
      .getText();
  }
  get usenCartServiceContractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[5]'))
      .getText();
  }
  get usenCartServiceFixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[6]'))
      .getText();
  }
  get usenCartServiceStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[7]'))
      .getText();
  }
  get usenCartServiceFirstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[8]'))
      .getText();
  }
  get usenCartServiceEndDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[9]'))
      .getText();
  }
  get usenCartServiceStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[10]'))
      .getText();
  }
  get otorakuServiceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[1]'))
      .getText();
  }
  get otorakuServiceContractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[2]'))
      .getText();
  }
  get otorakuServiceStatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[3]'))
      .getText();
  }
  get otorakuServiceContractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[4]'))
      .getText();
  }
  get otorakuServiceContractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[5]'))
      .getText();
  }
  get otorakuServiceFixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[6]'))
      .getText();
  }
  get otorakuServiceStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[7]'))
      .getText();
  }
  get otorakuServiceFirstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[8]'))
      .getText();
  }
  get otorakuServiceEndDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[9]'))
      .getText();
  }
  get otorakuServiceStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[2]/td[10]'))
      .getText();
  }
  get stashif1ServiceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[1]'))
      .getText();
  }
  get stashif1ServiceContractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[2]'))
      .getText();
  }
  get stashif1ServiceStatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[3]'))
      .getText();
  }
  get stashif1ServiceContractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[4]'))
      .getText();
  }
  get stashif1ServiceContractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[5]'))
      .getText();
  }
  get stashif1ServiceFixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[6]'))
      .getText();
  }
  get stashif1ServiceStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[7]'))
      .getText();
  }
  get stashif1ServiceFirstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[8]'))
      .getText();
  }
  get stashif1ServiceEndDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[9]'))
      .getText();
  }
  get stashif1ServiceStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[3]/td[10]'))
      .getText();
  }
  get stashif2ServiceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[1]'))
      .getText();
  }
  get stashif2ServiceContractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[2]'))
      .getText();
  }
  get stashif2ServiceStatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[3]'))
      .getText();
  }
  get stashif2ServiceContractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[4]'))
      .getText();
  }
  get stashif2ServiceContractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[5]'))
      .getText();
  }
  get stashif2ServiceFixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[6]'))
      .getText();
  }
  get stashif2ServiceStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[7]'))
      .getText();
  }
  get stashif2ServiceFirstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[8]'))
      .getText();
  }
  get stashif2ServiceEndDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[9]'))
      .getText();
  }
  get stashif2ServiceStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[4]/td[10]'))
      .getText();
  }
  get reachStockRestaurantServiceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[1]'))
      .getText();
  }
  get reachStockRestaurantServiceContractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[2]'))
      .getText();
  }
  get reachStockRestaurantServiceStatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[3]'))
      .getText();
  }
  get reachStockRestaurantServiceContractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[4]'))
      .getText();
  }
  get reachStockRestaurantServiceContractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[5]'))
      .getText();
  }
  get reachStockRestaurantServiceFixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[6]'))
      .getText();
  }
  get reachStockRestaurantServiceStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[7]'))
      .getText();
  }
  get reachStockRestaurantServiceFirstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[8]'))
      .getText();
  }
  get reachStockRestaurantServiceEndDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[9]'))
      .getText();
  }
  get reachStockRestaurantServiceStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[5]/td[10]'))
      .getText();
  }
  get reachStockProducerServiceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[1]'))
      .getText();
  }
  get reachStockProducerServiceContractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[2]'))
      .getText();
  }
  get reachStockProducerServiceStatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[3]'))
      .getText();
  }
  get reachStockProducerServiceContractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[4]'))
      .getText();
  }
  get reachStockProducerServiceContractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[5]'))
      .getText();
  }
  get reachStockProducerServiceFixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[6]'))
      .getText();
  }
  get reachStockProducerServiceStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[7]'))
      .getText();
  }
  get reachStockProducerServiceFirstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[8]'))
      .getText();
  }
  get reachStockProducerServiceEndDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[9]'))
      .getText();
  }
  get reachStockProducerServiceStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[6]/td[10]'))
      .getText();
  }
  get uspotServiceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[1]'))
      .getText();
  }
  get uspotServiceContractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[2]'))
      .getText();
  }
  get uspotServiceStatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[3]'))
      .getText();
  }
  get uspotServiceContractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[4]'))
      .getText();
  }
  get uspotServiceContractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[5]'))
      .getText();
  }
  get uspotServiceFixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[6]'))
      .getText();
  }
  get uspotServiceStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[7]'))
      .getText();
  }
  get uspotServiceFirstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[8]'))
      .getText();
  }
  get uspotServiceEndDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[9]'))
      .getText();
  }
  get uspotServiceStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[7]/td[10]'))
      .getText();
  }

  get conciergeServiceName(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[1]'))
      .getText();
  }
  get conciergeServiceContractNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[2]'))
      .getText();
  }
  get conciergeServiceStatementNo(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[3]'))
      .getText();
  }
  get conciergeServiceContractStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[4]'))
      .getText();
  }
  get conciergeServiceContractItem(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[5]'))
      .getText();
  }
  get conciergeServiceFixedDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[6]'))
      .getText();
  }
  get conciergeServiceStartDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[7]'))
      .getText();
  }
  get conciergeServiceFirstTimeDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[8]'))
      .getText();
  }
  get conciergeServiceEndDate(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[9]'))
      .getText();
  }
  get conciergeServiceStatus(): Promise<string> {
    return this.driver
      .findElement(By.xpath('//*[@id="grid2"]/tbody/tr[8]/td[10]'))
      .getText();
  }
  get title(): Promise<string> {
    return this.driver.findElement(By.className("main-title")).getText();
  }

  async clickBtnAccountDetail(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="account_table"]/tbody/tr[2]/td[10]'))
      .click();
  }
  async clickBtnReturnAccountList(): Promise<void> {
    await this.driver.findElement(By.xpath('//*[@id="bt_back"]')).click();
  }
  async clickBtnMailAddressChange(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="bt_account_modify"]'))
      .click();
  }
  async clickBtnInitPassword(): Promise<void> {
    await this.driver
      .findElement(By.xpath('//*[@id="bt_password_change"]'))
      .click();
  }
  async clearMailAddress(): Promise<void> {
    await this.driver.findElement(By.id("new_mail_address")).clear();
  }
  async inputMailAddress(mailAddress: string): Promise<void> {
    await this.driver
      .findElement(By.id("new_mail_address"))
      .sendKeys(mailAddress);
  }
  async clickBtnMailAddressChangeSave(): Promise<void> {
    await this.driver
      .findElement(
        By.xpath('//*[@id="pop_account_modify"]/div[2]/div[2]/button[1]')
      )
      .click();
  }
  async clickBtnMailAddressAlertAccept(): Promise<void> {
    await this.driver.wait(until.alertIsPresent());
    const alert = await this.driver.switchTo().alert();
    await alert.accept();
  }
  async clickBtnServiceDetail(): Promise<void> {
    await this.driver
      .findElement(By.className("bt_detail_account_stop"))
      .click();
  }
}
