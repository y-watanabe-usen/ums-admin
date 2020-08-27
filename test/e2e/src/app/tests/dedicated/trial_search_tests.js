const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, TrialSearchScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('お試しアカウント検索画面のテスト', () => {
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
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/trial_search/');
      assert.deepEqual(await trialSearchScreen.firstAccountId, '11');
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
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.inputLoginId('LJnaK2');
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/trial_search/');
      assert.deepEqual(await trialSearchScreen.firstLoginId, 'LJnaK2');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('アカウントIDを検索条件に指定して検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.inputAccountId('12');
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/trial_search/');
      assert.deepEqual(await trialSearchScreen.firstAccountId, '12');
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('検索結果がダウンロードできること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await trialSearchScreen.inputAccountId('11');
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.clickBtnDownload();
      sleep.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");
      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesDedicated}/expected.csv`).toString();
      // ファイル内容の比較
      await assert.deepEqual(actual, expected);
      // ****************************
      // ** 後始末
      // ****************************
    });
    it('検索結果の詳細ボタンを押下すると、お試しアカウント詳細画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      await driver.get(Const.ADMIN_URL);
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
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

