const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
var sleep = require('sleep');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, RoleSearchScreen, OrganizationSearchScreen } = require('screen');

let driver;

exports.testMain = () => {

  describe('部署別権限検索画面', () => {
    before(async () => {
      let usingServer = await Utils.buildUsingServer();
      let capabilities = await Utils.buildCapabilities();
      driver = await new Builder()
        .usingServer(usingServer)
        .withCapabilities(capabilities)
        .build();

      driver.setFileDetector(new remote.FileDetector()); // ファイル検知モジュール

      process.on('unhandledRejection', console.dir);
    });

    beforeEach(async () => {
      await driver.manage().deleteAllCookies();
      execSync(`rm -rf ${Const.DOWNLOAD_PATH}/*`);
    });

    after(() => {
      return driver.quit();
    });

    it('部署CDを検索条件に指定して検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const organizationSearchScreen = new OrganizationSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await roleSearchScreen.clickBtnRole();
      await organizationSearchScreen.clickRoleMenuOrganizationSearch();
      // ****************************
      // ** 実行
      // ****************************
      await organizationSearchScreen.inputOrganizationCd('9920830003');
      await organizationSearchScreen.clickBtnSearch();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'role/organization_search/');
      assert.deepEqual(await organizationSearchScreen.firstOrganizationCd, '9920830003');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('検索結果の詳細ボタンを押下すると、部署別権限詳細画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const organizationSearchScreen = new OrganizationSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await roleSearchScreen.clickBtnRole();
      await organizationSearchScreen.clickRoleMenuOrganizationSearch();
      await organizationSearchScreen.inputOrganizationCd('9920830003');
      await organizationSearchScreen.clickBtnSearch();
      // ****************************
      // ** 実行
      // ****************************
      await organizationSearchScreen.clickBtnDetail();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'role/organization_detail');
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}