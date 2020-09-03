const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const moment = require('moment');
var sleep = require('sleep');

const { Dir, Const, Utils, Database } = require('lib');
const { LoginScreen, TrialSearchScreen, DemoSearchScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('デモアカウント検索画面のテスト', () => {
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

    it('検索条件無しで検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      const demoAccountSearchScreen = new DemoSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await demoAccountSearchScreen.clickTrialMenuDemoAccountSearch();
      // ****************************
      // ** 実行
      // ****************************
      await demoAccountSearchScreen.clickBtnDemoAccountSearch();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/demo_search/');
      assert.deepEqual(await demoAccountSearchScreen.firstLoginId, 'NGXAL5');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('ログインIDを検索条件に指定して検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      const demoAccountSearchScreen = new DemoSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await demoAccountSearchScreen.clickTrialMenuDemoAccountSearch();
      // ****************************
      // ** 実行
      // ****************************
      await demoAccountSearchScreen.inputLoginId('kCFjZB');
      await demoAccountSearchScreen.clickBtnDemoAccountSearch();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/demo_search/');
      assert.deepEqual(await demoAccountSearchScreen.firstLoginId, 'kCFjZB');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('停止ボタンを押下すると、アカウント停止が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      const demoAccountSearchScreen = new DemoSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await demoAccountSearchScreen.clickTrialMenuDemoAccountSearch();
      await demoAccountSearchScreen.clickBtnDemoAccountSearch();
      // ****************************
      // ** 実行
      // ****************************
      await demoAccountSearchScreen.clickBtnDemoAccountStop();
      await demoAccountSearchScreen.clickBtnDemoAccountStopSave();
      // ****************************
      // ** 検証
      // ****************************
      var thisMonthFormatted = moment().format('YYYY-MM-DD');
      assert.deepEqual(await demoAccountSearchScreen.stoppedDate, thisMonthFormatted);
      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery('UPDATE m_account SET status_flag = "0", pause_date = NULL WHERE id = ?', [21]);
      Database.executeQuery('UPDATE t_unis_service SET status_flag = "0", end_date = NULL WHERE m_account_id = ?', [21]);
    });
  });
}

