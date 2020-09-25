const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, ExtractionScreen, InitedCustCdDownloadScreen, MailAddressInitImportScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('メールアドレス初回登録・仮ID/PW抽出画面のテスト', () => {
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

    it('データ抽出画面のメニューからメールアドレス初回登録・仮ID/PW抽出を押下しメールアドレス初回登録・仮ID/PW抽出画面が表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const mailAddressInitImportScreen = new MailAddressInitImportScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await extractionScreen.clickExtractionMenuMailAddressInitImport();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'extraction/mail_address_init_import/');
      assert.deepStrictEqual(await mailAddressInitImportScreen.title, 'メールアドレス初回登録・仮ID/PW抽出画面');
      assert.deepStrictEqual(await mailAddressInitImportScreen.enableBtnDownload, false);

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
      const mailAddressInitImportScreen = new MailAddressInitImportScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuMailAddressInitImport();

      // ****************************
      // ** 実行
      // ****************************
      await mailAddressInitImportScreen.clickBtnUpload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await mailAddressInitImportScreen.alert, 'CSVファイルを選択してください。');

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
      const mailAddressInitImportScreen = new MailAddressInitImportScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuMailAddressInitImport();

      // ****************************
      // ** 実行
      // ****************************
      await mailAddressInitImportScreen.clickBtnFile('/extraction/mail_address_init_import_test_1.txt');
      await mailAddressInitImportScreen.clickBtnUpload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await mailAddressInitImportScreen.alert, 'CSVファイルを選択してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    // TODO: ダウンロードが上手くいかないためスキップ
    it('アカウント証発送履歴抽出され、ファイルがダウンロードされていることを確認', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const mailAddressInitImportScreen = new MailAddressInitImportScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuMailAddressInitImport();

      // ****************************
      // ** 実行
      // ****************************
      await mailAddressInitImportScreen.clickBtnFile('/extraction/mail_address_init_import_test_1_upload.csv');
      await mailAddressInitImportScreen.clickBtnUpload();
      await mailAddressInitImportScreen.clickBtnDownload();
      await mailAddressInitImportScreen.downloadClick();
      sleep.sleep(1);

      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");

      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesExtraction}/mail_address_init_import_test_1_expected.csv`).toString();

      // ファイル内容の比較
      await assert.deepStrictEqual(actual, expected);

      // ****************************
      // ** 後始末
      // ****************************
    });

  });
}

