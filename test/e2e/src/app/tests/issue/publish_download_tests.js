const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, PublishDownloadScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('発送データダウンロード画面のテスト', () => {
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
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 実行
      // ****************************
      await publishDownloadScreen.clickBtnShippingManagement();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'issue/publish_download/');
      assert.deepEqual(await publishDownloadScreen.firstFileName, '20190527201444_技術発送(CAN).zip');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('ファイルのダウンロードができること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();

      // ****************************
      // ** 実行
      // ****************************
      await publishDownloadScreen.clickBtnDownload();
      sleep.sleep(1);

      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const pdfFilename = stdout.toString().replace("\n", "");
      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${pdfFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesIssue}/expected.pdf`).toString();
      // ファイル内容の比較
      await assert.deepEqual(actual, expected);

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('発送データ作成ができること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();

      // ****************************
      // ** 実行
      // ****************************
      await publishDownloadScreen.clickBtnCreateShippingData();
      sleep.sleep(1);

      // 画面のファイル名を取得し、YYYYMMDDのファイル名に変更
      var str = await publishDownloadScreen.firstFileName;
      var result = str.slice(0, 8) + str.slice(14);

      // 比較用の期待値を作成
      var thisMonthFormatted = moment().format('YYYYMMDD');
      var expected = thisMonthFormatted + '_顧客発送_標準フォーマット.pdf';

      // ****************************
      // ** 検証
      // ****************************;
      assert.deepEqual(await publishDownloadScreen.shippingMessage, '発送データの作成が完了しました。');
      assert.deepEqual(result, expected);

      // ****************************
      // ** 後始末
      // ****************************
    });

  });
}