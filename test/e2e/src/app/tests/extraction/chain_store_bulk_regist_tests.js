const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, ExtractionScreen, InitedCustCdDownloadScreen, ChainStoreBulkRegistScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面のテスト', () => {
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

    it('データ抽出画面のメニューからメールアドレス初回登録・仮ID/PW抽出を押下しUSEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面が表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'extraction/chain_store_bulk_regist/');
      assert.deepEqual(await chainStoreBulkRegistScreen.title, 'USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面');
      assert.deepEqual(await chainStoreBulkRegistScreen.radioBranch, true);
      assert.deepEqual(await chainStoreBulkRegistScreen.radioClient, false);

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('顧客CD毎に出力が選択されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

      // ****************************
      // ** 実行
      // ****************************
      await chainStoreBulkRegistScreen.clickRadioClient();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await chainStoreBulkRegistScreen.radioBranch, false);
      assert.deepEqual(await chainStoreBulkRegistScreen.radioClient, true);

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('CSVファイル未選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuMailAddressInitImport();

      // ****************************
      // ** 実行
      // ****************************
      await chainStoreBulkRegistScreen.clickBtnUpload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await chainStoreBulkRegistScreen.alert, 'CSVファイルを選択してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('TXTファイル選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuMailAddressInitImport();

      // ****************************
      // ** 実行
      // ****************************
      await chainStoreBulkRegistScreen.clickBtnFile('/extraction/chain_store_bulk_regist_test_1.txt');
      await chainStoreBulkRegistScreen.clickBtnUpload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await chainStoreBulkRegistScreen.alert, 'CSVファイルを選択してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    // TODO: ダウンロードが上手くいかないためスキップ
    it.skip('アカウント証発送履歴抽出され、ファイルがダウンロードされていることを確認', async () => {
      // ****************************
      // ** 準備
      // ****************************

      // ****************************
      // ** 実行
      // ****************************

      // ****************************
      // ** 検証
      // ****************************

      // ****************************
      // ** 後始末
      // ****************************
    });

  });
}
