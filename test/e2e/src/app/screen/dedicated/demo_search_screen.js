const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class DemoSearchScreen extends AuthedScreen {

  get firstLoginId() {
    return this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[2]')).getText();
  }

  get stoppedDate() {
    return this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[7]')).getText();
  }

  async clickTrialMenuDemoAccountSearch() {
    await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/div/div/ul/li[4]/a')).click();
  }

  async clickBtnDemoAccountSearch() {
    await this.driver.findElement(By.id('bt_search')).click();
    await this.driver.wait(until.elementLocated(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[1]')), 10000); // 検索結果が表示されるまで待機
  }

  async clickBtnDemoAccountStop() {
    await this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[9]/button')).click();
  }

  async clickBtnDemoAccountStopSave() {
    await this.driver.findElement(By.xpath('//*[@id="pop_stop"]/div[2]/div[5]/button[1]')).click();
    await this.driver.wait(until.elementLocated(By.xpath('//*[@id="search_table"]/tbody/tr[1]/td[7]')), 10000); // 日付が表示されるまで待機
  }

  async inputLoginId(accountId) {
    await this.driver.findElement(By.id('login_id')).sendKeys(accountId);
  }

}