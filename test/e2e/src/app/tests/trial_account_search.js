const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');

const Dir = require('dir');
const LoginScreen = require(`${Dir.screenLogin}/login_screen`);
const AccountSearchScreen = require(`${Dir.screenAccount}/account_search_screen`);
const TrialAccountSearchScreen = require(`${Dir.screenDedicated}/trial_account_search_screen`);
const TrialAccountDetailScreen = require(`${Dir.screenDedicated}/trial_account_detail_screen`);
const TrialAccountCreateScreen = require(`${Dir.screenDedicated}/trial_account_create_screen`);
const TrialAccountDownloadScreen = require(`${Dir.screenDedicated}/trial_account_download_screen`);

const url = 'http://ums-admin/';
const downloadPath = '/tmp/test_data';

let driver;

exports.trialAccountSearch = function() {

  let testMain = async () => {
    describe('お試し/デモ管理', () => {
      describe('お試しアカウント検索画面のテスト', () => {
        it('検索条件無しで検索が出来ること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await trialAccountSearchScreen.clickBtnTrial();
          // ****************************
          // ** 実行
          // ****************************
          await trialAccountSearchScreen.clickBtnTrialAccountSearch();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_search/');
          assert.deepEqual(await trialAccountSearchScreen.firstAccountId, '11');
          // ****************************
          // ** 後始末
          // ****************************
        });
        it('ログインIDを検索条件に指定して検索が出来ること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await trialAccountSearchScreen.clickBtnTrial();
          // ****************************
          // ** 実行
          // ****************************
          await trialAccountSearchScreen.inputAccountId('12');
          await trialAccountSearchScreen.clickBtnTrialAccountSearch();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_search/');
          assert.deepEqual(await trialAccountSearchScreen.firstAccountId, '12');
          // ****************************
          // ** 後始末
          // ****************************
        });
        it('検索結果がダウンロードできること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await trialAccountSearchScreen.clickBtnTrial();
          await trialAccountSearchScreen.inputAccountId('11');
          await trialAccountSearchScreen.clickBtnTrialAccountSearch();
          // ****************************
          // ** 実行
          // ****************************
          await trialAccountSearchScreen.clickBtnDownload();
          sleep.sleep(1);
          // ****************************
          // ** 検証
          // ****************************
          // ファイル名取得
          const stdout = execSync(`ls ${downloadPath}`);
          const csvFilename = stdout.toString().replace("\n", "");
          // ファイル読み込み
          const actual = fs.readFileSync(`${downloadPath}/${csvFilename}`).toString();
          const expected = fs.readFileSync(`${Dir.filesDedicated}/expected.csv`).toString();
          // ファイル内容の比較
          await assert.deepEqual(actual, expected);
          // ****************************
          // ** 後始末
          // ****************************
        });
        it('検索結果の詳細ボタンを押下すると、お試しアカウント詳細画面に遷移すること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await trialAccountSearchScreen.clickBtnTrial();
          await trialAccountSearchScreen.clickBtnTrialAccountSearch();
          // ****************************
          // ** 実行
          // ****************************
          await trialAccountSearchScreen.clickBtnDetail();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_detail');
          // ****************************
          // ** 後始末
          // ****************************
        });
      });
      describe('お試しアカウント詳細画面のテスト', () => {
        it('画面に表示されている内容が正しいこと', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
          const trialAccountDetailScreen = new TrialAccountDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await trialAccountSearchScreen.clickBtnTrial();
          await trialAccountSearchScreen.clickBtnTrialAccountSearch();
          // ****************************
          // ** 実行
          // ****************************
          await trialAccountSearchScreen.clickBtnDetail();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_detail');
          assert.deepEqual(await trialAccountDetailScreen.accountId, '11');
          assert.deepEqual(await trialAccountDetailScreen.loginId, 'W7Pr56');
          assert.deepEqual(await trialAccountDetailScreen.password, 'CPhKCagj');
          assert.deepEqual(await trialAccountDetailScreen.salesChannel, 'USEN');
          assert.deepEqual(await trialAccountDetailScreen.issueDate, '2020-08-05');
          assert.deepEqual(await trialAccountDetailScreen.firstAuthenticationDatetimes, '');
          assert.deepEqual(await trialAccountDetailScreen.expireDate, '');
          // ****************************
          // ** 後始末
          // ****************************
        });
        it('一覧へ戻るボタンを押下すると、お試しアカウント検索画面に遷移すること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
          const trialAccountDetailScreen = new TrialAccountDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await trialAccountSearchScreen.clickBtnTrial();
          await trialAccountSearchScreen.clickBtnTrialAccountSearch();
          await trialAccountSearchScreen.clickBtnDetail();
          // ****************************
          // ** 実行
          // ****************************
          await trialAccountDetailScreen.clickBtnReturnSearchList();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_search');
          // ****************************
          // ** 後始末
          // ****************************
        });
      });
      describe('お試しアカウント発行画面のテスト', () => {
        it(' お試しアカウントが発行できること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
          const trialAccountCreateScreen = new TrialAccountCreateScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await trialAccountSearchScreen.clickBtnTrial();
          await trialAccountCreateScreen.clickTrialMenuTrialAccountCreate();
          // ****************************
          // ** 実行
          // ****************************
          await trialAccountCreateScreen.inputCount('1');
          await trialAccountCreateScreen.clickBtnTrialAccountCreate();
          sleep.sleep(1);
          // ****************************
          // ** 検証
          // ****************************
          // ファイル名取得
          const stdout = execSync(`ls ${downloadPath}`);
          const csvFilename = stdout.toString().replace("\n", "");
          // ファイル読み込み
          const actual = fs.readFileSync(`${downloadPath}/${csvFilename}`).toString();
          // ファイル内容の比較
          await assert.match(actual, /(.*),(.*),(.*),(.*),(.*)\r\n[A-z0-9]{6},[A-z0-9]{8},USEN,[0-9]+,[0-9]+/);
          // ****************************
          // ** 後始末
          // ****************************
        });
      });
      describe('お試しアカウントダウンロード画面のテスト', () => {
        it('CSVファイルがダウンロードできること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
          const trialAccountDownloadScreen = new TrialAccountDownloadScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await trialAccountSearchScreen.clickBtnTrial();
          await trialAccountDownloadScreen.clickTrialMenuTrialAccountDownload();
          // ****************************
          // ** 実行
          // ****************************
          await trialAccountDownloadScreen.clickBtnTrialAccountDownload();
          sleep.sleep(1);
          // ****************************
          // ** 検証
          // ****************************
          // ファイル名取得
          const stdout = execSync(`ls ${downloadPath}`);
          const csvFilename = stdout.toString().replace("\n", "");
          // ファイル読み込み
          const actual = fs.readFileSync(`${downloadPath}/${csvFilename}`).toString();
          // ファイル内容の比較
          await assert.match(actual, /(.*),(.*),(.*),(.*),(.*)\r\n[A-z0-9]{6},[A-z0-9]{8},USEN,[0-9]+,[0-9]+/);
          // ****************************
          // ** 後始末
          // ****************************
        });
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