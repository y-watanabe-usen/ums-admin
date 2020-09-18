const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const { Dir, Const, Utils } = require('lib');

const AuthedScreen = require(`${Dir.screenCommon}/authed_screen`);

module.exports = class BranchListSearchScreen extends AuthedScreen {

  get branchName() {
    return this.driver.findElement(By.xpath('//*[@id="not_arrived_search_table"]/tbody/tr/td[1]')).getText();
  }

  // 支店顧客管理タブ押下
  async clickBtnSearchBranch() {
    await this.driver.findElement(By.xpath('/html/body/div[1]/div[3]/ul/li[5]/a')).click();
  }
  // 支店検索のプルダウンを押下
  async clickBtnSelectBranch() {
    await this.driver.findElement(By.xpath('//*[@id="p1"]/table/tbody/tr[1]/td[2]/button/span[1]')).click();
  }
  // 支店検索に青山を入力
  async clickBtnSelectBranchinput() {
    await this.driver.findElement(By.xpath('/html/body/div[3]/div/div/input')).sendKeys("青山");
  }
  // 支店のチェックボックスをクリック
  async clickBranch() {
    await this.driver.findElement(By.id('ui-multiselect-multiSelect-option-78')).click();
  }
  // 検索ボタンをクリック
  async clickBtnSearch() {
    await this.driver.findElement(By.id('bt_search')).click();
  }
  // 未着顧客一覧ダウンロードボタンをクリック
  async clickBtnnotArrivedDownload() {
    await this.driver.findElement(By.id('bt_not_arrived_download')).click();
  }
  // 未着顧客一覧詳細ボタンをクリック
  async clickBtnnotArrivedDetail() {
    await this.driver.findElement(By.xpath('//*[@id="not_arrived_search_table"]/tbody/tr/td[7]/button')).click();
  }
  // 未着顧客一覧ダウンロードボタンをクリック
  async clickBtnProspectsDownload() {
    await this.driver.findElement(By.id('bt_prospects_download')).click();
  }
}