const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');
const moment = require('moment');

const HOME_DIR = process.env.CI ? '/home/runner/work/ums-admin/ums-admin/test/e2e/src/app' : '/app';
const SCREEN_DIR = HOME_DIR + '/screen';

const LoginScreen = require(SCREEN_DIR + '/login_screen');
const AccountSearchScreen = require(SCREEN_DIR + '/account_search_screen');
const InitedCustCdDownloadScreen = require(SCREEN_DIR + '/extraction/inited_cust_cd_download');

const url = 'http://ums-admin/';

let driver;

let testMain = async () => {
  describe('ログインのテスト', () => {
    it('サイトトップにアクセスしてログイン画面が表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url);

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url);
      assert.deepEqual(await loginScreen.code, '');
      assert.deepEqual(await loginScreen.password, '');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('社員番号が間違っている場合はログイン出来ないこと', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url);
      await loginScreen.inputCode('adminaaa');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'login');
      assert.deepEqual(await loginScreen.alert, 'ログインID、またはパスワードに誤りがあります。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('パスワードが間違っている場合はログイン出来ないこと', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsxa');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'login');
      assert.deepEqual(await loginScreen.alert, 'ログインID、またはパスワードに誤りがあります。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('未ログイン状態でアクセスした場合、ログイン画面にリダイレクトされること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url + 'account/search');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'login/');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('社員番号とパスワードが合っている場合はログイン出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'account/search');
      assert.deepEqual(await accountSearchScreen.title, 'アカウント検索');

      // ****************************
      // ** 後始末
      // ****************************
    });
  });

  describe('アカウント検索のテスト', () => {
    it('検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await driver.get(url);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'account/search');
      assert.deepEqual(await accountSearchScreen.firstCustCd, 'admin0001');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('顧客CDを検索し検索が出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await driver.get(url);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(url + 'account/search');

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.inputCustCd('admin0002');
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'account/search');
      assert.deepEqual(await accountSearchScreen.firstCustCd, 'admin0002');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('詳細ボタン押下後アカウント一覧画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await driver.get(url);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(url + 'account/search');
      await accountSearchScreen.inputCustCd('admin0002');
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'account/account_list');

      // ****************************
      // ** 後始末
      // ****************************
    });
  });


  describe('データ抽出・初回認証済顧客抽出のテスト', () => {
    it('データ抽出タブ押下で初回認証済顧客抽出が表示されること', async () => {
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
      //assert.deepEqual(await initedCustCdDownloadScreen.select, 'USEN CART');

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
  });
}

describe('chrome_USEN MEMBERS管理機能のSeleniumテスト', () => {
  before(() => {
    let usingServer;
    if (process.env.CI) {
      usingServer = 'http://localhost:4444/wd/hub';
    } else {
      usingServer = 'http://zalenium:4444/wd/hub';
    }
    let chromeCapabilities = Capabilities.chrome();
    let chromeOptions = new chrome.Options();
    chromeOptions.setAcceptInsecureCerts(true);
    driver = new Builder()
      .usingServer(usingServer)
      .withCapabilities(chromeCapabilities)
      .setChromeOptions(chromeOptions)
      .build();
    process.on('unhandledRejection', console.dir);
  });

  beforeEach(async () => {
    await driver.manage().deleteAllCookies();
  });

  after(() => {
    return driver.quit();
  });

  testMain();
});
