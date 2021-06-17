const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class AccountServiceDetailScreen extends AuthedScreen {

  get firstCustCd() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[1]/td[2]')).getText();
  }
  get name() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[2]/td[2]')).getText();
  }
  get clientStatus() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[3]/td[2]')).getText();
  }
  get address() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[4]/td[2]')).getText();
  }
  get tel() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[5]/td[2]')).getText();
  }
  get branch() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis1"]/tbody/tr/td/div/table/tbody/tr[6]/td[2]')).getText();
  }
  get regularStore() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[1]/td[2]')).getText();
  }
  get industry() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[2]/td[2]')).getText();
  }
  get launch() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[3]/td[2]')).getText();
  }
  get close() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[4]/td[2]')).getText();
  }
  get cancell() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[5]/td[2]')).getText();
  }
  get lastUpdate() {
    return this.driver.findElement(By.xpath('//*[@id="grid_unis2"]/tbody/tr/td/div/table/tbody/tr[6]/td[2]')).getText();
  }

  get serviceName() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[1]')).getText();
  }
  get contractNo() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[2]')).getText();
  }
  get StatementNo() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[3]')).getText();
  }
  get contractStatus() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[4]')).getText();
  }
  get billingStartDate() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[5]')).getText();
  }
  get endMonth() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[6]')).getText();
  }
  get contractItem() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[7]')).getText();
  }
  get FixedDate() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[8]')).getText();
  }
  get firstTimeDate() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[9]')).getText();
  }
  get firstAuthDate() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[10]')).getText();
  }
  get endDate() {
    return this.driver.findElement(By.xpath('//*[@id="grid"]/tbody/tr/td[11]')).getText();
  }
  get serviceEnable() {
    let elemBtn = this.driver.findElement(By.id('bt_unlock'));
    return elemBtn.isEnabled();
  }
  get closedStore() {
    this.driver.sleep(500);
    return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr/td[1]')).getText();
  }
  get forcedUnlockDisable() {
    this.driver.sleep(500);
    return this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr/td[4]')).getText();
  }
  get forceUnlockCompletedMessage() {
    return this.driver.findElement(By.xpath('//*[@id="pop_release"]/div[2]/div[2]')).getText();
  }

  async clickBtnServiceDetail() {
    await this.driver.findElement(By.className('bt_detail_account_stop')).click();
  }
  async clickBtnReturnDetail() {
    await this.driver.findElement(By.id('bt_back')).click();
  }
  async clickBtnForcedUnlock() {
    await this.driver.findElement(By.xpath('//*[@id="bt_unlock"]')).click();
  }
  async clickBtnForcedUnlockSave() {
    await this.driver.findElement(By.xpath('//*[@id="pop_unlock"]/div[2]/div[3]/button[1]')).click();
  }
  async clickBtnForcedUnlockClose() {
    await this.driver.findElement(By.xpath('//*[@id="pop_unlock"]/div[2]/div[3]/button[2]')).click();
  }
  async clickBtnAddClosedRegist() {
    await this.driver.findElement(By.id('bt_add_stop')).click();
  }
  async inputStopTo(date) {
    await this.driver.findElement(By.id('stop_to')).sendKeys(date);
  }
  async clickBtnAddClosedRegistSave() {
    await this.driver.findElement(By.xpath('//*[@id="pop_service_stop_add"]/div[2]/div[5]/button[1]')).click();
  }
  async clickBtnAddClosedRegistClose() {
    await this.driver.findElement(By.xpath('//*[@id="pop_service_stop_add"]/div[2]/div[5]/button[2]')).click();
  }
  async clickBtnAddForcedUnlock() {
    await this.driver.wait(until.elementLocated(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[4]/button[2]')), 10000);
    await this.driver.findElement(By.xpath('//*[@id="grid2"]/tbody/tr[1]/td[4]/button[2]')).click();
  }
  async clickBtnUnlockSave() {
    await this.driver.findElement(By.xpath('//*[@id="pop_release"]/div[2]/div[3]/button[1]')).click();
    await this.driver.wait(until.elementLocated(By.xpath('//*[@id="pop_release"]/div[2]/div[3]/button[2]')), 10000); // 検索結果が表示されるまで待機
  }
  async clickBtnUnlockClose() {
    await this.driver.sleep(500);
    await this.driver.findElement(By.xpath('//*[@id="pop_release"]/div[2]/div[3]/button[2]')).click();
  }
  async stopDivision() {
    await this.driver.sleep(500);
    this.driver.findElement(By.xpath('//*[@id="stop_div"]/option[2][@value="2"]')).click();
  }
  async clickBtnTable() {
    await this.driver.findElement(By.xpath('//*[@id="pop_service_stop_add"]/div[2]/table/tbody/tr[2]/td[1]')).click();
  }
}