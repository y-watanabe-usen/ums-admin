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
      assert.deepEqual(await trialDetailScreen.viewingHistoryTotal, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory1st, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory2nd, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory3rd, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory4th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory5th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory6th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory7th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory8th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory9th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory10th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory11th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory12th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory13th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory14th, '10時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory15th, '11時間11分');
      assert.deepEqual(await trialDetailScreen.viewingHistory16th, '12時間22分');
      assert.deepEqual(await trialDetailScreen.viewingHistory17th, '13時間33分');
      assert.deepEqual(await trialDetailScreen.viewingHistory18th, '0時間01分');
      assert.deepEqual(await trialDetailScreen.viewingHistory19th, '0時間02分');
      assert.deepEqual(await trialDetailScreen.viewingHistory20th, '22時間44分');
      assert.deepEqual(await trialDetailScreen.viewingHistory21st, '2時間30分');
      assert.deepEqual(await trialDetailScreen.viewingHistory22nd, '1時間02分');
      assert.deepEqual(await trialDetailScreen.viewingHistory23rd, '2時間33分');
      assert.deepEqual(await trialDetailScreen.viewingHistory24th, '11時間11分');
      assert.deepEqual(await trialDetailScreen.viewingHistory25th, '9時間59分');
      assert.deepEqual(await trialDetailScreen.viewingHistory26th, '23時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory27th, '23時間59分');
      assert.deepEqual(await trialDetailScreen.viewingHistory28th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory29th, '0時間00分');
      assert.deepEqual(await trialDetailScreen.viewingHistory30th, '0時間00分');
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
    it('視聴履歴がダウンロードできること', async () => {
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
      await trialDetailScreen.clickBtnDownloadViewingHistory();
      sleep.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");
      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesDedicated}/expected_viewing_history.csv`).toString();
      // ファイル内容の比較
      await assert.deepEqual(actual, expected);
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

