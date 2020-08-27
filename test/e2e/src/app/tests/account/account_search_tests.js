const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, AccountSearchScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('アカウント検索画面のテスト', () => {
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

    it('検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/search');
      assert.deepEqual(await accountSearchScreen.firstCustCd, 'admin0001');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('顧客CDを検索し検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/search');
      assert.deepEqual(await accountSearchScreen.firstCustCd, '000000002');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('詳細ボタン押下後アカウント一覧画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/account_list');

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

