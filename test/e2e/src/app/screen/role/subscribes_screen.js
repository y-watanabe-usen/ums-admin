const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class SubscribesScreen extends AuthedScreen {
  get exectionCompleted() {
    return this.driver.findElement(By.xpath('//*[@id="pop_subscribes"]/div[2]/div[2]')).getText();
  }

  async clickBtnRoleMenuSubscribes() {
    await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[1]/div/div/ul/li[3]/a')).click();
  }

  async clickExecute() {
    await this.driver.findElement(By.id('bt_execute')).click();
  }

  async clickBtnSave() {
    await this.driver.findElement(By.xpath('//*[@id="pop_subscribes"]/div[2]/div[3]/button[1]')).click();
  }

  async chooseRadioBtnOrganizationMaster() {
    await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div[2]/div/div/table/tbody/tr[2]/td/p[2]/input')).click();
  }

  async chooseRadioBtnUserMaster() {
    await this.driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div[2]/div/div/table/tbody/tr[2]/td/p[3]/input')).click();
  }
}