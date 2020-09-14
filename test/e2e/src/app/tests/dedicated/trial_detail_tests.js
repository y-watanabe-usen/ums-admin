const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, TrialSearchScreen, TrialDetailScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('お試しアカウント詳細画面のテスト', () => {
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
      const trialSearchScreen = new TrialSearchScreen(driver);
      const trialDetailScreen = new TrialDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.clickBtnDetail();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/trial_detail');
      assert.deepEqual(await trialDetailScreen.accountId, '11');
      assert.deepEqual(await trialDetailScreen.loginId, 'W7Pr56');
      assert.deepEqual(await trialDetailScreen.password, 'CPhKCagj');
      assert.deepEqual(await trialDetailScreen.salesChannel, 'USEN');
      assert.deepEqual(await trialDetailScreen.issueDate, '2020-08-05');
      assert.deepEqual(await trialDetailScreen.firstAuthenticationDatetimes, '2020-09-14 11:25:44');
      assert.deepEqual(await trialDetailScreen.expireDate, '2020-09-27');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('一覧へ戻るボタンを押下すると、お試しアカウント検索画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      const trialDetailScreen = new TrialDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await trialSearchScreen.clickBtnTrialAccountSearch();
      await trialSearchScreen.clickBtnDetail();
      // ****************************
      // ** 実行
      // ****************************
      await trialDetailScreen.clickBtnReturnSearchList();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/trial_search');
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

