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
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/trial_detail');
      assert.deepStrictEqual(await trialDetailScreen.accountId, '11');
      assert.deepStrictEqual(await trialDetailScreen.loginId, 'W7Pr56');
      assert.deepStrictEqual(await trialDetailScreen.password, 'CPhKCagj');
      assert.deepStrictEqual(await trialDetailScreen.salesChannel, 'USEN');
      assert.deepStrictEqual(await trialDetailScreen.issueDate, '2020-08-05');
      assert.deepStrictEqual(await trialDetailScreen.firstAuthenticationDatetimes, '2020-09-14 11:25:44');
      assert.deepStrictEqual(await trialDetailScreen.expireDate, '2020-09-27');
      assert.deepStrictEqual(await trialDetailScreen.viewingHistoryTotal, '0時間00分');
      const arr = [
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '0時間00分',
        '10時間00分',
        '11時間11分',
        '12時間22分',
        '13時間33分',
        '0時間01分',
        '0時間02分',
        '22時間44分',
        '2時間30分',
        '1時間02分',
        '2時間33分',
        '11時間11分',
        '9時間59分',
        '23時間00分',
        '23時間59分',
        '0時間00分',
        '0時間00分',
        '0時間00分'
      ];
      for (let n = 0; n < arr.length; n++) {
        assert.deepStrictEqual(await trialDetailScreen.viewingHistoryNth(n), arr[n]);
      }
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
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'dedicated/trial_search');
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
      await assert.deepStrictEqual(actual, expected);
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

