const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const moment = require('moment');
var sleep = require('sleep');

const Dir = require('dir');
const LoginScreen = require(`${Dir.screenLogin}/login_screen`);
const AccountSearchScreen = require(`${Dir.screenAccount}/account_search_screen`);
const RoleSearchScreen = require(`${Dir.screenRole}/role_search_screen`);
const RoleUserDetailScreen = require(`${Dir.screenRole}/role_user_detail_screen`);

var config = require(`${Dir.config}/${process.env.CI ? 'ciConfig' : 'localConfig'}`);

const url = 'http://ums-admin/';
const downloadPath = '/tmp/test_data';

let driver;

exports.roleSearch = function() {

  let testMain = async () => {
    describe('権限管理', () => {
      describe('社員別権限検索画面', () => {
        it('社員CDを検索条件に指定して検索が出来ること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const roleSearchScreen = new RoleSearchScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
          await roleSearchScreen.clickBtnRole();
          // ****************************
          // ** 実行
          // ****************************
          await roleSearchScreen.inputEmployeeCd('iko');
          await roleSearchScreen.clickBtnSearch();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'role/user_search/');
          assert.deepEqual(await roleSearchScreen.firstEmployeeCd, 'iko');
          // ****************************
          // ** 後始末
          // ****************************
        });
        it('検索結果の詳細ボタンを押下すると、社員別権限詳細画面に遷移すること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const roleSearchScreen = new RoleSearchScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await roleSearchScreen.clickBtnRole();
          await roleSearchScreen.inputEmployeeCd('iko');
          await roleSearchScreen.clickBtnSearch();
          // ****************************
          // ** 実行
          // ****************************
          await roleSearchScreen.clickBtnDetail();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'role/user_detail');
          // ****************************
          // ** 後始末
          // ****************************
        });
      });
      describe('社員別権限詳細画面', () => {
        it('画面に表示されている内容が正しいこと', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const roleSearchScreen = new RoleSearchScreen(driver);
          const roleUserDetailScreen = new RoleUserDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await roleSearchScreen.clickBtnRole();
          await roleSearchScreen.inputEmployeeCd('iko');
          await roleSearchScreen.clickBtnSearch();
          // ****************************
          // ** 実行
          // ****************************
          await roleSearchScreen.clickBtnDetail();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await roleUserDetailScreen.employeeCd, 'iko');
          assert.deepEqual(await roleUserDetailScreen.department, '不明');
          assert.deepEqual(await roleUserDetailScreen.employeeName, 'システム 移行ユーザ');
          // ****************************
          // ** 後始末
          // ****************************
        });
        it('検索へ戻るボタンを押下すると、社員別権限検索画面に遷移すること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const roleSearchScreen = new RoleSearchScreen(driver);
          const roleUserDetailScreen = new RoleUserDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await roleSearchScreen.clickBtnRole();
          await roleSearchScreen.inputEmployeeCd('iko');
          await roleSearchScreen.clickBtnSearch();
          await roleSearchScreen.clickBtnDetail();
          // ****************************
          // ** 実行
          // ****************************
          await roleUserDetailScreen.clickBtnBackSearch();
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'role/user_search');
          // ****************************
          // ** 後始末
          // ****************************
        });
        it('保存ボタンを押下すると、権限が更新されること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const roleSearchScreen = new RoleSearchScreen(driver);
          const roleUserDetailScreen = new RoleUserDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await roleSearchScreen.clickBtnRole();
          await roleSearchScreen.inputEmployeeCd('iko');
          await roleSearchScreen.clickBtnSearch();
          await roleSearchScreen.clickBtnDetail();
          // ****************************
          // ** 実行
          // ****************************
          await roleUserDetailScreen.clickBtnEnable();
          await roleUserDetailScreen.clickBtnEdit();
          await roleUserDetailScreen.clickBtnSave();
          sleep.sleep(1);
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await roleUserDetailScreen.updateCompleted, '更新しました。');
          // ****************************
          // ** 後始末
          // ****************************
          sleep.sleep(1);
          await roleUserDetailScreen.clickBtnClose();
          await roleUserDetailScreen.clickBtnDisable();
          await roleUserDetailScreen.clickBtnEdit();
          await roleUserDetailScreen.clickBtnSave();
          sleep.sleep(1);
          await roleUserDetailScreen.clickBtnClose();
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