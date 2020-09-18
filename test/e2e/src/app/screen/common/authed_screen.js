const { Builder, By, Key, Capabilitiesi, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const Screen = require(`${Dir.screenCommon}/screen`);

module.exports = class AuthedScreen extends Screen {
  async clickTabAccount() {
    await this.driver.findElement(By.linkText("アカウント管理")).click();
  }
  async clickTabIssue() {
    await this.driver.findElement(By.linkText("発送管理")).click();
  }
  async clickTabExtraction() {
    await this.driver.findElement(By.linkText("データ抽出")).click();
  }
  async clickTabDedicated() {
    await this.driver.findElement(By.linkText("お試し/デモ管理")).click();
  }
  async clickTabBranch() {
    await this.driver.findElement(By.linkText("支店別顧客管理")).click();
  }
  async clickTabBulk() {
    await this.driver.findElement(By.linkText("一括処理")).click();
  }
  async clickTabRole() {
    await this.driver.findElement(By.linkText("権限管理")).click();
  }
}