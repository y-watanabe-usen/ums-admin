const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const moment = require('moment');
const fs = require('fs');
var sleep = require('sleep');

const Dir = require('dir');
const LoginScreen = require(`${Dir.screenLogin}/login_screen`);
const PublishDownloadScreen = require(`${Dir.screenIssue}/publish_download_screen`);

const url = 'http://ums-admin/';
const downloadPath = '/tmp/test_data';

let driver;

exports.shippingManagement = function() {

  let testMain = async () => {
    describe('発送管理', () => {
      describe('発送データダウンロードのテスト', () => {
        it('画面に表示されている内容が正しいこと', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const publishDownloadScreen = new PublishDownloadScreen(driver);
          await driver.get(url);
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
          assert.deepEqual(await driver.getCurrentUrl(), url + 'issue/publish_download/');
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
          await driver.get(url);
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
          const stdout = execSync(`ls ${downloadPath}`);
          const pdfFilename = stdout.toString().replace("\n", "");
          // ファイル読み込み
          const actual = fs.readFileSync(`${downloadPath}/${pdfFilename}`).toString();
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
          await driver.get(url);
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