const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, InitedCustCdDownloadScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('初回認証済顧客抽出画面のテスト', () => {
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

    it('データ抽出タブ押下で初回認証済顧客抽出画面が表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'extraction/inited_cust_cd_download/');
      assert.deepStrictEqual(await initedCustCdDownloadScreen.title, '初回認証済顧客抽出');
      assert.deepStrictEqual(await initedCustCdDownloadScreen.from, '');
      assert.deepStrictEqual(await initedCustCdDownloadScreen.to, '');
      assert.deepStrictEqual(await initedCustCdDownloadScreen.service, '100'); // valueを取得（テキストの取得調査中）

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('先月ボタン押下でテキストボックスに先月の日時が入力されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      var lastMonth = moment().subtract(1, 'month');
      var lastMonthFormatted = lastMonth.format('YYYY/MM/');
      var cntLastMonthDay = moment(lastMonth.format('YYYY-MM')).daysInMonth(); // 先月の日数取得

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.clickBtnLastMonth();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.from, lastMonthFormatted + '01');
      assert.deepStrictEqual(await initedCustCdDownloadScreen.to, lastMonthFormatted + cntLastMonthDay);

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('今月ボタン押下でテキストボックスに今月の日時が入力されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      var thisMonthFormatted = moment().format('YYYY/MM/');
      var cntThisMonthDay = moment(moment().format('YYYY-MM')).daysInMonth(); // 先月の日数取得

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.clickBtnThisMonth();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.from, thisMonthFormatted + '01');
      assert.deepStrictEqual(await initedCustCdDownloadScreen.to, thisMonthFormatted + cntThisMonthDay);

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('初回認証日fromの入力ミス（年のみ）の場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.inputFrom('2020');
      await initedCustCdDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.alert, '初回認証日FROMを正しく入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('初回認証日fromの入力ミス（年月のみ）の場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.inputFrom('2020/07');
      await initedCustCdDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.alert, '初回認証日FROMを正しく入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('初回認証日to（年のみ）の入力ミスの場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.inputFrom('2020/07/01');
      await initedCustCdDownloadScreen.inputTo('2020');
      await initedCustCdDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.alert, '初回認証日TOを正しく入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('初回認証日to（年月のみ）の入力ミスの場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.inputFrom('2020/07/01');
      await initedCustCdDownloadScreen.inputTo('2020/07');
      await initedCustCdDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.alert, '初回認証日TOを正しく入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('初回認証日の入力ミスの場合（from, to逆）エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.inputFrom('2020/07/31');
      await initedCustCdDownloadScreen.inputTo('2020/07/01');
      await initedCustCdDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.alert, '初回認証日はFrom <= Toで入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「OTORAKU」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.selectService('120');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.service, '120');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「スタシフ」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.selectService('130');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.service, '130');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「REACH STOCK（飲食店）」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.selectService('140');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.service, '140');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「REACH STOCK（生産者）」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.selectService('150');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.service, '150');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「USPOT」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.selectService('160');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.service, '160');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービスのプルダウンで「デンタル・コンシェルジュ」が選択されていること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.selectService('170');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.service, '170');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('抽出対象データがない場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.clickBtnLastMonth();
      await initedCustCdDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await initedCustCdDownloadScreen.alert, '対象データはありません。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('初回認証済顧客データが抽出され、ファイルがダウンロードされていることを確認', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await initedCustCdDownloadScreen.clickBtnDownload();
      sleep.sleep(1);

      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");
      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesExtraction}/inited_cust_cd_download_test_1_expected.csv`).toString();

      // ファイル内容の比較
      await assert.deepStrictEqual(actual, expected);

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

