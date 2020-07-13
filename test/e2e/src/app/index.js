const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

const LoginScreen = require(process.env.CI ? '/home/runner/work/ums-admin/ums-admin/test/e2e/src/app/screen/login_screen.js' : '/app/screen/login_screen.js');
const AccountSearchScreen = require(process.env.CI ? '/home/runner/work/ums-admin/ums-admin/test/e2e/src/app/screen/account_search_screen.js' : '/app/screen/account_search_screen.js');

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
