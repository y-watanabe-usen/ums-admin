const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
var sleep = require('sleep');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, RoleSearchScreen, SubscribesScreen } = require('screen');

let driver;

exports.testMain = () => {

  describe('DRAGONマスタ連携処理画面', () => {
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

    it('DRAGONマスタ連携処理が実行できること（部署マスタ一括配信&ユーザマスタ一括配信）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const subscribesScreen = new SubscribesScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await roleSearchScreen.clickBtnRole();
      await subscribesScreen.clickBtnRoleMenuSubscribes();
      // ****************************
      // ** 実行
      // ****************************
      await subscribesScreen.clickExecute();
      await subscribesScreen.clickBtnSave();
      sleep.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await subscribesScreen.exectionCompleted, '完了しました。');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('DRAGONマスタ連携処理が実行できること（部署マスタ一括配信）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const subscribesScreen = new SubscribesScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await roleSearchScreen.clickBtnRole();
      await subscribesScreen.clickBtnRoleMenuSubscribes();
      // ****************************
      // ** 実行
      // ****************************
      await subscribesScreen.chooseRadioBtnOrganizationMaster();
      await subscribesScreen.clickExecute();
      await subscribesScreen.clickBtnSave();
      sleep.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await subscribesScreen.exectionCompleted, '完了しました。');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('DRAGONマスタ連携処理が実行できること（ユーザマスタ一括配信）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const subscribesScreen = new SubscribesScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await roleSearchScreen.clickBtnRole();
      await subscribesScreen.clickBtnRoleMenuSubscribes();
      // ****************************
      // ** 実行
      // ****************************
      await subscribesScreen.chooseRadioBtnUserMaster();
      await subscribesScreen.clickExecute();
      await subscribesScreen.clickBtnSave();
      sleep.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await subscribesScreen.exectionCompleted, '完了しました。');
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}