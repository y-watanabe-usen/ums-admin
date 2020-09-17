const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
var sleep = require('sleep');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, RoleSearchScreen, RoleUserDetailScreen } = require('screen');

let driver;

exports.testMain = () => {

  describe('社員別権限詳細画面', () => {
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
      const roleUserDetailScreen = new RoleUserDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await roleSearchScreen.clickBtnRole();
      await roleSearchScreen.inputEmployeeCd('iko');
      await roleSearchScreen.clickBtnSearch();
      // ****************************
      // ** 実行
      // ****************************
      await roleSearchScreen.clickBtnDetail();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await roleUserDetailScreen.employeeCd, 'iko');
      assert.deepStrictEqual(await roleUserDetailScreen.department, '不明');
      assert.deepStrictEqual(await roleUserDetailScreen.employeeName, 'システム 移行ユーザ');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('検索へ戻るボタンを押下すると、社員別権限検索画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const roleUserDetailScreen = new RoleUserDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await roleSearchScreen.clickBtnRole();
      await roleSearchScreen.inputEmployeeCd('iko');
      await roleSearchScreen.clickBtnSearch();
      await roleSearchScreen.clickBtnDetail();
      // ****************************
      // ** 実行
      // ****************************
      await roleUserDetailScreen.clickBtnBackSearch();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'role/user_search');
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
      const roleUserDetailScreen = new RoleUserDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await roleSearchScreen.clickBtnRole();
      await roleSearchScreen.inputEmployeeCd('iko');
      await roleSearchScreen.clickBtnSearch();
      await roleSearchScreen.clickBtnDetail();
      // ****************************
      // ** 実行
      // ****************************
      await roleUserDetailScreen.clickBtnEnable();
      await roleUserDetailScreen.clickBtnEdit();
      await roleUserDetailScreen.clickBtnSave();
      sleep.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await roleUserDetailScreen.updateCompleted, '更新しました。');
      // ****************************
      // ** 後始末
      // ****************************
      sleep.sleep(1);
      await roleUserDetailScreen.clickBtnClose();
      await roleUserDetailScreen.clickBtnDisable();
      await roleUserDetailScreen.clickBtnEdit();
      await roleUserDetailScreen.clickBtnSave();
      sleep.sleep(1);
      await roleUserDetailScreen.clickBtnClose();
    });
  });
}