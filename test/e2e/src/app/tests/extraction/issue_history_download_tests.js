const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils, Database } = require('lib');
const { LoginScreen, ExtractionScreen, InitedCustCdDownloadScreen, IssueHistoryDownloadScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('アカウント証発送履歴抽出画面のテスト', () => {
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
    it('データ抽出画面のメニューからアカウント証発送履歴抽出を押下しアカウント証発送履歴抽出画面が表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();

      // ****************************
      // ** 実行
      // ****************************
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'extraction/issue_history_download/');
      assert.deepStrictEqual(await issueHistoryDownloadScreen.title, 'アカウント証発送履歴抽出');
      assert.deepStrictEqual(await issueHistoryDownloadScreen.from, '');
      assert.deepStrictEqual(await issueHistoryDownloadScreen.to, '');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('先月ボタン押下でテキストボックスに先月の日時が入力されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      var lastMonth = moment().subtract(1, 'month');
      var lastMonthFormatted = lastMonth.format('YYYY/MM/');
      var cntLastMonthDay = moment(lastMonth.format('YYYY-MM')).daysInMonth(); // 先月の日数取得

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.clickBtnLastMonth();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await issueHistoryDownloadScreen.from, lastMonthFormatted + '01');
      assert.deepStrictEqual(await issueHistoryDownloadScreen.to, lastMonthFormatted + cntLastMonthDay);

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('今月ボタン押下でテキストボックスに今月の日時が入力されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      var thisMonthFormatted = moment().format('YYYY/MM/');
      var cntThisMonthDay = moment(moment().format('YYYY-MM')).daysInMonth(); // 先月の日数取得

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.clickBtnThisMonth();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await issueHistoryDownloadScreen.from, thisMonthFormatted + '01');
      assert.deepStrictEqual(await issueHistoryDownloadScreen.to, thisMonthFormatted + cntThisMonthDay);

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('発送日fromの入力ミス（年のみ）の場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.inputFrom('2020');
      await issueHistoryDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await issueHistoryDownloadScreen.alert, '発送日FROMを正しく入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('発送日fromの入力ミス（年月のみ）の場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.inputFrom('2020/07');
      await issueHistoryDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await issueHistoryDownloadScreen.alert, '発送日FROMを正しく入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('発送日to（年のみ）の入力ミスの場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.inputFrom('2020/07/01');
      await issueHistoryDownloadScreen.inputTo('2020');
      await issueHistoryDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await issueHistoryDownloadScreen.alert, '発送日TOを正しく入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('発送日to（年月のみ）の入力ミスの場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.inputFrom('2020/07/01');
      await issueHistoryDownloadScreen.inputTo('2020/07');
      await issueHistoryDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await issueHistoryDownloadScreen.alert, '発送日TOを正しく入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('発送日の入力ミスの場合（from, to逆）エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.inputFrom('2020/07/31');
      await issueHistoryDownloadScreen.inputTo('2020/07/01');
      await issueHistoryDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await issueHistoryDownloadScreen.alert, '発送日はFrom <= Toで入力してください。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('抽出対象データがない場合エラーメッセージが表示されること', async () => {
      // ****************************
      // ** 準備
      // **************************** 
      
      // t_issue_history.issue_date、t_issue_history.not_arrived_dateを変更
      let updateId = [2,4]
      Database.executeQuery('UPDATE t_issue_history SET issue_date="2020/07/01", not_arrived_date="2020/07/31" WHERE id IN (?,?)', updateId);

      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.clickBtnLastMonth();
      await issueHistoryDownloadScreen.clickBtnDownload();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await issueHistoryDownloadScreen.alert, '対象データはありません。');

      // ****************************
      // ** 後始末
      // ****************************

      // t_issue_history.issue_date、t_issue_history.not_arrived_dateを変更
      let returnUpdateId = [2,4]
      Database.executeQuery('UPDATE t_issue_history SET issue_date="2020-08-01 16:21:19", not_arrived_date="2020-08-01 16:21:19" WHERE id IN (?,?)', returnUpdateId);
    });

    it('アカウント証発送履歴データが抽出され、ファイルがダウンロードされていることを確認', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const extractionScreen = new ExtractionScreen(driver);
      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
      const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await initedCustCdDownloadScreen.clickTabExtraction();
      await extractionScreen.clickExtractionMenuIssueHistoryDownload();

      // ****************************
      // ** 実行
      // ****************************
      await issueHistoryDownloadScreen.clickBtnDownload();
      sleep.sleep(1);

      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");
      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      const expected = fs.readFileSync(`${Dir.filesExtraction}/issue_history_download_test_1_expected.csv`).toString();

      // ファイル内容の比較
      await assert.deepStrictEqual(actual, expected);

      // ****************************
      // ** 後始末
      // ****************************
    });


  });
}

