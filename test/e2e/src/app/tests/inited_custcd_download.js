const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const moment = require('moment');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');

const Dir = require('dir');
const LoginScreen = require(`${Dir.screenLogin}/login_screen`);
const ExtractionScreen = require(`${Dir.screenExtraction}/extraction`);
const InitedCustCdDownloadScreen = require(`${Dir.screenExtraction}/inited_cust_cd_download`);
const IssueHistoryDownloadScreen = require(`${Dir.screenExtraction}/issue_history_download`);
const IdPwDownloadScreen = require(`${Dir.screenExtraction}/id_pw_download`);
const MailAddressInitImportScreen = require(`${Dir.screenExtraction}/mail_address_init_import`);
const ChainStoreBulkRegistScreen = require(`${Dir.screenExtraction}/chain_store_bulk_regist`);

const url = 'http://ums-admin/';
const downloadPath = '/tmp/test_data';

let driver;

exports.initedCustcdDownload = function() {

  let testMain = async () => {
    describe('データ抽出', () => {
      describe('初回認証済顧客抽出のテスト', () => {
        it('データ抽出タブ押下で初回認証済顧客抽出画面が表示されること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
          await driver.get(url);
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
          assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/inited_cust_cd_download/');
          assert.deepEqual(await initedCustCdDownloadScreen.title, '初回認証済顧客抽出');
          assert.deepEqual(await initedCustCdDownloadScreen.from, '');
          assert.deepEqual(await initedCustCdDownloadScreen.to, '');
          assert.deepEqual(await initedCustCdDownloadScreen.service, '100'); // valueを取得（テキストの取得調査中）
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.from, lastMonthFormatted + '01');
          assert.deepEqual(await initedCustCdDownloadScreen.to, lastMonthFormatted + cntLastMonthDay);
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.from, thisMonthFormatted + '01');
          assert.deepEqual(await initedCustCdDownloadScreen.to, thisMonthFormatted + cntThisMonthDay);
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日FROMを正しく入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日FROMを正しく入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日TOを正しく入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日TOを正しく入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日はFrom <= Toで入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.service, '120');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.service, '130');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.service, '140');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.service, '150');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.service, '160');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.service, '170');
  
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
          await driver.get(url);
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
          assert.deepEqual(await initedCustCdDownloadScreen.alert, '対象データはありません。');
  
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
          await driver.get(url);
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
          const stdout = execSync(`ls ${downloadPath}`);
          const csvFilename = stdout.toString().replace("\n", "");
          // ファイル読み込み
          const actual = fs.readFileSync(`${downloadPath}/${csvFilename}`).toString();
          const expected = fs.readFileSync(`${Dir.filesExtraction}/inited_cust_cd_download_test_1_expected.csv`).toString();
  
          // ファイル内容の比較
          await assert.deepEqual(actual, expected);
  
          // ****************************
          // ** 後始末
          // ****************************
        });
      });
      describe('アカウント証発送履歴抽出のテスト', () => {
        it('データ抽出画面のメニューからアカウント証発送履歴抽出を押下しアカウント証発送履歴抽出画面が表示されること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const extractionScreen = new ExtractionScreen(driver);
          const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
          const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
          await driver.get(url);
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
          assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/issue_history_download/');
          assert.deepEqual(await issueHistoryDownloadScreen.title, 'アカウント証発送履歴抽出');
          assert.deepEqual(await issueHistoryDownloadScreen.from, '');
          assert.deepEqual(await issueHistoryDownloadScreen.to, '');
  
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
          await driver.get(url);
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
          assert.deepEqual(await issueHistoryDownloadScreen.from, lastMonthFormatted + '01');
          assert.deepEqual(await issueHistoryDownloadScreen.to, lastMonthFormatted + cntLastMonthDay);
  
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
          await driver.get(url);
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
          assert.deepEqual(await issueHistoryDownloadScreen.from, thisMonthFormatted + '01');
          assert.deepEqual(await issueHistoryDownloadScreen.to, thisMonthFormatted + cntThisMonthDay);
  
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
          await driver.get(url);
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
          assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日FROMを正しく入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日FROMを正しく入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日TOを正しく入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日TOを正しく入力してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日はFrom <= Toで入力してください。');
  
          // ****************************
          // ** 後始末
          // ****************************
        });
  
        it('抽出対象データがない場合エラーメッセージが表示されること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const extractionScreen = new ExtractionScreen(driver);
          const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
          const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
          await driver.get(url);
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
          assert.deepEqual(await issueHistoryDownloadScreen.alert, '対象データはありません。');
  
          // ****************************
          // ** 後始末
          // ****************************
        });
  
        it('アカウント証発送履歴データが抽出され、ファイルがダウンロードされていることを確認', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const extractionScreen = new ExtractionScreen(driver);
          const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
          const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
          await driver.get(url);
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
          const stdout = execSync(`ls ${downloadPath}`);
          const csvFilename = stdout.toString().replace("\n", "");
          // ファイル読み込み
          const actual = fs.readFileSync(`${downloadPath}/${csvFilename}`).toString();
          const expected = fs.readFileSync(`${Dir.filesExtraction}/issue_history_download_test_1_expected.csv`).toString();
  
          // ファイル内容の比較
          await assert.deepEqual(actual, expected);
  
          // ****************************
          // ** 後始末
          // ****************************
        });
      });
  
      describe('ID/PW抽出（顧客CD指定）のテスト', () => {
        it('データ抽出画面のメニューからID/PW抽出（顧客CD指定）を押下しID/PW抽出（顧客CD指定）画面が表示されること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const extractionScreen = new ExtractionScreen(driver);
          const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
          const idPwDownloadScreen = new IdPwDownloadScreen(driver);
          await driver.get(url);
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
          assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/id_pw_download/');
          assert.deepEqual(await idPwDownloadScreen.title, 'ID/PW抽出（顧客CD指定）');
          assert.deepEqual(await idPwDownloadScreen.serviceCd, '100'); // valueを取得（テキストの取得調査中）
          assert.deepEqual(await idPwDownloadScreen.alert, '');
  
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
          await driver.get(url);
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
          assert.deepEqual(await idPwDownloadScreen.serviceCd, '120');
  
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
          await driver.get(url);
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
          assert.deepEqual(await idPwDownloadScreen.serviceCd, '130');
  
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
          await driver.get(url);
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
          assert.deepEqual(await idPwDownloadScreen.serviceCd, '140');
  
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
          await driver.get(url);
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
          assert.deepEqual(await idPwDownloadScreen.serviceCd, '150');
  
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
          await driver.get(url);
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
          assert.deepEqual(await idPwDownloadScreen.serviceCd, '160');
  
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
          await driver.get(url);
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
          assert.deepEqual(await idPwDownloadScreen.serviceCd, '170');
  
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
          await driver.get(url);
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
          assert.deepEqual(await idPwDownloadScreen.alert, 'CSVファイルを選択してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await idPwDownloadScreen.alert, 'CSVファイルを選択してください。');
  
          // ****************************
          // ** 後始末
          // ****************************
        });
  
        //it('ID/PWデータが抽出され、ファイルがダウンロードされていることを確認', async () => {
        //  // ****************************
        //  // ** 準備
        //  // ****************************
        //  const loginScreen = new LoginScreen(driver);
        //  const extractionScreen = new ExtractionScreen(driver);
        //  const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        //  const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        //  await driver.get(url);
        //  await loginScreen.inputCode('admin');
        //  await loginScreen.inputPassword('!QAZ2wsx');
        //  await loginScreen.clickBtnLogin();
        //  await initedCustCdDownloadScreen.clickTabExtraction();
        //  await extractionScreen.clickExtractionMenuIdPwDownload();
        //
        //  // ****************************
        //  // ** 実行
        //  // ****************************
        //  await idPwDownloadScreen.clickBtnFile('/extraction/id_pw_download_test_1_upload.csv'); // todo: アップロードCSV、データ作成
        //  await idPwDownloadScreen.clickBtnDownload();
        //  sleep.sleep(1);
        //
        //  // ****************************
        //  // ** 検証
        //  // ****************************
        //  // ファイル名取得
        //  const stdout = execSync(`ls ${downloadPath}`);
        //  const csvFilename = stdout.toString().replace("\n", "");
        //  // ファイル読み込み
        //  const actual = fs.readFileSync(`${downloadPath}/${csvFilename}`).toString();
        //  const expected = fs.readFileSync(`${Dir.filesExtraction}/id_pw_download_test_1_expected.csv`).toString(); // todo: 期待結果CSV作成
  
        //  // ファイル内容の比較
        //  await assert.deepEqual(actual, expected);
  
        //  // ****************************
        //  // ** 後始末
        //  // ****************************
        //});
      });
  
      describe('メールアドレス初回登録・仮ID/PW抽出画面のテスト', () => {
        it('データ抽出画面のメニューからメールアドレス初回登録・仮ID/PW抽出を押下しメールアドレス初回登録・仮ID/PW抽出画面が表示されること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const extractionScreen = new ExtractionScreen(driver);
          const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
          const mailAddressInitImportScreen = new MailAddressInitImportScreen(driver);
          await driver.get(url);
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
          assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/mail_address_init_import/');
          assert.deepEqual(await mailAddressInitImportScreen.title, 'メールアドレス初回登録・仮ID/PW抽出画面');
          assert.deepEqual(await mailAddressInitImportScreen.enableBtnDownload, false);
  
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
          await driver.get(url);
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
          assert.deepEqual(await mailAddressInitImportScreen.alert, 'CSVファイルを選択してください。');
  
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
          await driver.get(url);
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
          assert.deepEqual(await mailAddressInitImportScreen.alert, 'CSVファイルを選択してください。');
  
          // ****************************
          // ** 後始末
          // ****************************
        });
  
        // TODO: ダウンロードが上手くいかないためスキップ
        //    it('アカウント証発送履歴抽出され、ファイルがダウンロードされていることを確認', async () => {
        //      // ****************************
        //      // ** 準備
        //      // ****************************
        //
        //      // ****************************
        //      // ** 実行
        //      // ****************************
        //
        //      // ****************************
        //      // ** 検証
        //      // ****************************
  
        //      // ****************************
        //      // ** 後始末
        //      // ****************************
        //    });
      });
  
      describe('USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面のテスト', () => {
        it('データ抽出画面のメニューからメールアドレス初回登録・仮ID/PW抽出を押下しUSEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面が表示されること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const extractionScreen = new ExtractionScreen(driver);
          const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
          const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
          await driver.get(url);
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
          assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/chain_store_bulk_regist/');
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
          await driver.get(url);
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
          await driver.get(url);
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
          await driver.get(url);
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
        //    it('アカウント証発送履歴抽出され、ファイルがダウンロードされていることを確認', async () => {
        //      // ****************************
        //      // ** 準備
        //      // ****************************
        //
        //      // ****************************
        //      // ** 実行
        //      // ****************************
        //
        //      // ****************************
        //      // ** 検証
        //      // ****************************
  
        //      // ****************************
        //      // ** 後始末
        //      // ****************************
        //    });
      });
    });
  }

  describe('USEN MEMBERS管理機能のSeleniumテスト', () => {
    before(async () => {
      let usingServer = await buildUsingServer();
      let capabilities = await buildCapabilities();
      driver = await new Builder()
        .usingServer(usingServer)
        .withCapabilities(capabilities)
        .build();
  
      driver.setFileDetector(new remote.FileDetector()); // ファイル検知モジュール
  
      process.on('unhandledRejection', console.dir);
    });
  
    beforeEach(async () => {
      await driver.manage().deleteAllCookies();
      execSync(`rm -rf ${downloadPath}/*`);
    });
  
    after(() => {
      return driver.quit();
    });
  
    testMain();
  });
  
  let buildUsingServer = () => `http://${process.env.CI ? 'localhost' : 'selenium-hub'}:4444/wd/hub`;
  
  let buildCapabilities = () => {
    switch (process.env.BROWSER) {
      // case "ie": {
      //   process.env.PATH = `${process.env.PATH};${__dirname}/Selenium.WebDriver.IEDriver.3.150.0/driver/;`;
      //   const capabilities = webdriver.Capabilities.ie();
      //   capabilities.set("ignoreProtectedModeSettings", true);
      //   capabilities.set("ignoreZoomSetting", true);
      //   return capabilities;
      // }
      case "firefox": {
        console.log("start testing in firefox");
        const capabilities = Capabilities.firefox();
        capabilities.set('firefoxOptions', {
          args: [
            '-headless',
          ]
        });
        return capabilities;
      }
      case "chrome":
      default: {
        console.log("start testing in chrome");
        const capabilities = Capabilities.chrome();
        capabilities.set('chromeOptions', {
          args: [],
          prefs: {
            'download': {
              'default_directory': downloadPath,
              'prompt_for_download': false,
              'directory_upgrade': true
            }
          }
        });
        return capabilities;
      }
      // case "safari": {
      //     return webdriver.Capabilities.safari();
      // }
    }
  }
}