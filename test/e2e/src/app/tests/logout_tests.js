const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, LogoutScreen } = require('screen');

let driver;

exports.testMain = () => {

  describe('ログアウトのテスト', () => {
    before(async () => {
      let usingServer = await Utils.buildUsingServer(process.env.CI);
      let capabilities = await Utils.buildCapabilities(process.env.BROWSER);
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

    it('ログアウトできること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const logoutScreen = new LogoutScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      // ****************************
      // ** 実行
      // ****************************
      await logoutScreen.clickBtnLogout();
      await logoutScreen.logoutClick();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'login');
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}