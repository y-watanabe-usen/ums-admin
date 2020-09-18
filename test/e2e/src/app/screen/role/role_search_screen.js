const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class RoleSearchScreen extends AuthedScreen {
  get firstEmployeeCd() {
    return this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr/td[1]')).getText();
  }

  async inputEmployeeCd(employeeCd) {
    await this.driver.findElement(By.id('code')).sendKeys(employeeCd);
  }

  async clickBtnRole() {
    await this.driver.findElement(By.xpath('/html/body/div[1]/div[3]/ul/li[7]/a')).click();
  }

  async clickBtnSearch() {
    await this.driver.findElement(By.id('bt_search')).click();
    await this.driver.wait(until.elementLocated(By.xpath('//*[@id="search_table"]/tbody/tr/td[1]')), 10000); // 検索結果が表示されるまで待機
  }

  async clickBtnDetail() {
    await this.driver.findElement(By.xpath('//*[@id="search_table"]/tbody/tr/td[4]/button')).click();
  }
}