const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, BranchScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('支店別管轄顧客一覧画面のテスト', () => {
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

    it(' 支店に指定して検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const branchScreen = new BranchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await branchScreen.clickBtnSearchBranch();
      await branchScreen.clickBtnSelectBranch();
      await branchScreen.clickBtnSelectBranchinput();
      await branchScreen.clickBranch();

      // ****************************
      // ** 実行
      // ****************************
      await branchScreen.clickBtnSearch();
      sleep.sleep(1);

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await branchScreen.branchName, '東京統括支店青山');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it.skip(' 未着顧客一覧のダウンロードができること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const branchScreen = new BranchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await branchScreen.clickBtnSearchBranch();
      await branchScreen.clickBtnSelectBranch();
      await branchScreen.clickBtnSelectBranchinput();
      await branchScreen.clickBranch();
      await branchScreen.clickBtnSearch();
      sleep.sleep(1);

      // ****************************
      // ** 実行
      // ****************************
      await branchScreen.clickBtnnotArrivedDownload();
      sleep.sleep(1);

      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");

      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesBranch}/not_arrived_expected.csv`).toString();
      // ファイル内容の比較
      await assert.deepEqual(actual, expected);

      // ****************************
      // ** 後始末
      // ****************************
    });
    it(' 未着顧客一覧の詳細ボタンを押下すると、アカウント一覧画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const branchScreen = new BranchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await branchScreen.clickBtnSearchBranch();
      await branchScreen.clickBtnSelectBranch();
      await branchScreen.clickBtnSelectBranchinput();
      await branchScreen.clickBranch();
      await branchScreen.clickBtnSearch();
      sleep.sleep(1);

      // ****************************
      // ** 実行
      // ****************************
      await branchScreen.clickBtnnotArrivedDetail();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/account_list');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it.skip('UNIS 連携サービス 確定可能顧客一覧のダウンロードができること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const branchScreen = new BranchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await branchScreen.clickBtnSearchBranch();
      await branchScreen.clickBtnSelectBranch();
      await branchScreen.clickBtnSelectBranchinput();
      await branchScreen.clickBranch();
      await branchScreen.clickBtnSearch();
      sleep.sleep(1);

      // ****************************
      // ** 実行
      // ****************************
      await branchScreen.clickBtnProspectsDownload();
      sleep.sleep(1);

      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");

      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesBranch}/prospects_expected.csv`).toString();
      // ファイル内容の比較
      await assert.deepEqual(actual, expected);

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

