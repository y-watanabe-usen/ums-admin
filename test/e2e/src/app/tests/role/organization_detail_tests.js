const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
var sleep = require('sleep');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, RoleSearchScreen, OrganizationSearchScreen, OrganizationDetailScreen } = require('screen');

let driver;

exports.testMain = () => {

  describe('部署別権限詳細画面', () => {
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

    it('画面に表示されている内容が正しいこと', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const organizationSearchScreen = new OrganizationSearchScreen(driver);
      const organizationDetailScreen = new OrganizationDetailScreen(driver);
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
      assert.deepStrictEqual(await organizationDetailScreen.infoOrganizationCd, '9920830003');
      assert.deepStrictEqual(await organizationDetailScreen.infoOrganizationName, '(株)U-NEXT（出向）');
      assert.deepStrictEqual(await organizationDetailScreen.updateTargetOrganizationCd, '9920830003');
      assert.deepStrictEqual(await organizationDetailScreen.updateTargetOrganizationName, '(株)U-NEXT（出向）');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('検索へ戻るボタンを押下すると、部署別権限検索画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const organizationSearchScreen = new OrganizationSearchScreen(driver);
      const organizationDetailScreen = new OrganizationDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await roleSearchScreen.clickBtnRole();
      await organizationSearchScreen.clickRoleMenuOrganizationSearch();
      await organizationSearchScreen.inputOrganizationCd('9920830003');
      await organizationSearchScreen.clickBtnSearch();
      await organizationSearchScreen.clickBtnDetail();
      // ****************************
      // ** 実行
      // ****************************
      await organizationDetailScreen.clickBtnBackSearch();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'role/organization_search');
      // ****************************
      // ** 後始末
      // ****************************
    });
        it('保存ボタンを押下すると、権限が更新されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const organizationSearchScreen = new OrganizationSearchScreen(driver);
      const organizationDetailScreen = new OrganizationDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await roleSearchScreen.clickBtnRole();
      await organizationSearchScreen.clickRoleMenuOrganizationSearch();
      await organizationSearchScreen.inputOrganizationCd('9920830003');
      await organizationSearchScreen.clickBtnSearch();
      await organizationSearchScreen.clickBtnDetail();
      // ****************************
      // ** 実行
      // ****************************
      await organizationDetailScreen.clickBtnEnable();
      await organizationDetailScreen.clickBtnEdit();
      await organizationDetailScreen.clickBtnSave();
      sleep.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await organizationDetailScreen.updateCompleted, '更新しました。');
      // ****************************
      // ** 後始末
      // ****************************
      sleep.sleep(1);
      await organizationDetailScreen.clickBtnClose();
      await organizationDetailScreen.clickBtnDisable();
      await organizationDetailScreen.clickBtnEdit();
      await organizationDetailScreen.clickBtnSave();
      sleep.sleep(1);
      await organizationDetailScreen.clickBtnClose();
    });
  });
}