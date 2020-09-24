const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, ExtractionScreen, InitedCustCdDownloadScreen, IdPwDownloadScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('ID/PW抽出（顧客CD指定）画面のテスト', () => {
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

    it('データ抽出画面のメニューからID/PW抽出（顧客CD指定）を押下しID/PW抽出（顧客CD指定）画面が表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'extraction/id_pw_download/');
      assert.deepStrictEqual(await idPwDownloadScreen.title, 'ID/PW抽出（顧客CD指定）');
      assert.deepStrictEqual(await idPwDownloadScreen.serviceCd, '100'); // valueを取得（テキストの取得調査中）
      assert.deepStrictEqual(await idPwDownloadScreen.alert, '');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「OTORAKU」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.selectServiceCd('120');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await idPwDownloadScreen.serviceCd, '120');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「スタシフ」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.selectServiceCd('130');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await idPwDownloadScreen.serviceCd, '130');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「REACH STOCK（飲食店）」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.selectServiceCd('140');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await idPwDownloadScreen.serviceCd, '140');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「REACH STOCK（生産者）」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.selectServiceCd('150');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await idPwDownloadScreen.serviceCd, '150');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「USPOT」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.selectServiceCd('160');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await idPwDownloadScreen.serviceCd, '160');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「デンタル・コンシェルジュ」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.selectServiceCd('170');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await idPwDownloadScreen.serviceCd, '170');

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
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await idPwDownloadScreen.alert, 'CSVファイルを選択してください。');

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
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.clickBtnFile('/extraction/id_pw_download_test_1.txt');
      await idPwDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await idPwDownloadScreen.alert, 'CSVファイルを選択してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('ID/PWデータが抽出され、ファイルがダウンロードされていることを確認', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const idPwDownloadScreen = new IdPwDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIdPwDownload();

      // ****************************
      // ** 実行
      // ****************************
      await idPwDownloadScreen.clickBtnFile('/extraction/id_pw_download_test_1_upload.csv'); // todo: アップロードCSV、データ作成
      await idPwDownloadScreen.clickBtnDownload();
      sleep.sleep(1);

      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");
      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesExtraction}/id_pw_download_test_1_expected.csv`).toString(); // todo: 期待結果CSV作成

      // ファイル内容の比較
      await assert.deepStrictEqual(actual, expected);

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

