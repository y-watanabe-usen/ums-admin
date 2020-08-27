const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, AccountSearchScreen, AccountListScreen, AccountDetailScreen, AccountServiceDetailScreen } = require('screen');

var config = require(`${Dir.config}/${process.env.CI ? 'ciConfig' : 'localConfig'}`);

let driver;

exports.testMain = () => {
  describe('サービス詳細画面のテスト', () => {
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

    it('画面に表示されている内容が正しいこと', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 検証
      // ****************************
      // UNIS情報
      assert.deepEqual(await accountServiceDetailScreen.firstCustCd, 'admin0001');
      assert.deepEqual(await accountServiceDetailScreen.name, 'テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)');
      assert.deepEqual(await accountServiceDetailScreen.clientStatus, '確定');
      assert.deepEqual(await accountServiceDetailScreen.address, '〒150-0045 渋谷区神泉町９－８ビル１Ｆ');
      assert.deepEqual(await accountServiceDetailScreen.tel, '0120-117-448');
      assert.deepEqual(await accountServiceDetailScreen.branch, '東京統括支店青山(0204140700)');
      assert.deepEqual(await accountServiceDetailScreen.regularStore, '');
      assert.deepEqual(await accountServiceDetailScreen.industry, 'その他　会社関連(001699)');
      assert.deepEqual(await accountServiceDetailScreen.launch, '2014-10-01');
      assert.deepEqual(await accountServiceDetailScreen.close, '');
      assert.deepEqual(await accountServiceDetailScreen.cancell, '');
      assert.deepEqual(await accountServiceDetailScreen.lastUpdate, '2014-11-20 15:21:24');
      // サービス情報
      assert.deepEqual(await accountServiceDetailScreen.serviceName, 'USEN CART');
      assert.deepEqual(await accountServiceDetailScreen.contractNo, '');
      assert.deepEqual(await accountServiceDetailScreen.StatementNo, '');
      assert.deepEqual(await accountServiceDetailScreen.contractStatus, '');
      assert.deepEqual(await accountServiceDetailScreen.billingStartDate, '');
      assert.deepEqual(await accountServiceDetailScreen.endMonth, '');
      assert.deepEqual(await accountServiceDetailScreen.contractItem, '');
      assert.deepEqual(await accountServiceDetailScreen.FixedDate, '');
      assert.deepEqual(await accountServiceDetailScreen.firstTimeDate, '2014-10-01');
      assert.deepEqual(await accountServiceDetailScreen.firstAuthDate, '2015-06-02 11:47:59');
      assert.deepEqual(await accountServiceDetailScreen.endDate, '');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('戻るボタンを押下すると、アカウント詳細画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnReturnDetail();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/detail');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('強制開錠すると、サービスが利用不可から利用可能に更新されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0009');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnForcedUnlock();
      await accountServiceDetailScreen.clickBtnForcedUnlockSave();
      await accountServiceDetailScreen.clickBtnForcedUnlockClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountServiceDetailScreen.serviceEnable, false);

      // ****************************
      // ** 後始末
      // ****************************
      const mysql = require('mysql');
      const connection = mysql.createConnection(config.serverConf);

      connection.connect();

      // DB接続出来なければエラー表示
      connection.on('error', function (err) {
        console.log('DB CONNECT ERROR', err);
      });

      // status_flagを1に戻す
      connection.query('UPDATE t_unis_service SET status_flag="1" WHERE id="9"', function (err, result) {
        if (err) {
          // UPDATEに失敗したら戻す
          connection.rollback(function () {
            throw err;
          });
        }
      });

      connection.end();
    });
    it('休店登録できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();
      await accountServiceDetailScreen.clickBtnAddClosedRegist();

      // ****************************
      // ** 実行
      // ****************************
      var thisMonthFormatted = moment().format("YYYY/MM/DD");
      await accountServiceDetailScreen.inputStopTo(thisMonthFormatted);
      await accountServiceDetailScreen.clickBtnAddClosedRegistSave();
      await accountServiceDetailScreen.clickBtnAddClosedRegistClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountServiceDetailScreen.closedStore, '休店');

      // ****************************
      // ** 後始末
      // ****************************
      // TODO: 「休店解除できること」のテストを復活したらこの後始末は削除
      const mysql = require('mysql');
      const connection = mysql.createConnection(config.serverConf);

      connection.connect();

      // DB接続出来なければエラー表示
      connection.on('error', function (err) {
        console.log('DB CONNECT ERROR', err);
      });

      // t_service_stop_historyのレコードを削除
      connection.query('DELETE FROM  t_service_stop_history LIMIT 1', function (err, result) {
        if (err) {
          // DELETEに失敗したら戻す
          connection.rollback(function () {
            throw err;
          });
        }
      });

      connection.end();
    });
    it.skip('休店解除できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnAddForcedUnlock();
      await accountServiceDetailScreen.clickBtnUnlockSave();
      await accountServiceDetailScreen.clickBtnUnlockClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountServiceDetailScreen.forcedUnlockDisable, '');

      // ****************************
      // ** 後始末
      // ****************************
      const mysql = require('mysql');
      const connection = mysql.createConnection(config.serverConf);

      connection.connect();

      // DB接続出来なければエラー表示
      connection.on('error', function (err) {
        console.log('DB CONNECT ERROR', err);
      });

      // t_service_stop_historyのレコードを削除
      connection.query('DELETE FROM  t_service_stop_history LIMIT 1', function (err, result) {
        if (err) {
          // DELETEに失敗したら戻す
          connection.rollback(function () {
            throw err;
          });
        }
      });

      connection.end();
    });
    it.skip('強制施錠登録できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();
      await accountServiceDetailScreen.clickBtnAddClosedRegist();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.stopDivision();
      var thisMonthFormatted = moment().format("YYYY/MM/DD");
      await accountServiceDetailScreen.inputStopTo(thisMonthFormatted);
      await accountServiceDetailScreen.clickBtnTable();
      await accountServiceDetailScreen.clickBtnAddClosedRegistSave();
      await accountServiceDetailScreen.clickBtnAddClosedRegistClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountServiceDetailScreen.closedStore, '強制施錠');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it.skip('強制施錠解除できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnAddForcedUnlock();
      await accountServiceDetailScreen.clickBtnUnlockSave();
      await accountServiceDetailScreen.clickBtnUnlockClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountServiceDetailScreen.forcedUnlockDisable, '');

      // ****************************
      // ** 後始末
      // ****************************
      const mysql = require('mysql');
      const connection = mysql.createConnection(config.serverConf);

      connection.connect();

      // DB接続出来なければエラー表示
      connection.on('error', function (err) {
        console.log('DB CONNECT ERROR', err);
      });

      // t_service_stop_historyのレコードを削除
      connection.query('DELETE FROM  t_service_stop_history LIMIT 1', function (err, result) {
        if (err) {
          // DELETEに失敗したら戻す
          connection.rollback(function () {
            throw err;
          });
        }
      });

      connection.end();
    });
  });

}

