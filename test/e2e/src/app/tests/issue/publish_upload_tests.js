const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, PublishDownloadScreen, PublishUploadScreen } = require('screen');
var config = require(`${Dir.config}/${process.env.CI ? 'ciConfig' : 'localConfig'}`);

let driver;

exports.testMain = () => {
  describe('発送データアップロード画面のテスト', () => {
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

    it('発送データCSVのアップロードができること（一括出力、次回の発送データダウンロードに含める）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      const publishUploadScreen = new PublishUploadScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();
      await publishUploadScreen.clickPublishUpload();
      await publishUploadScreen.clickBtnFile('/issue/publish_upload_test.csv');
      await publishUploadScreen.clickIssueDivDownload();
      await publishUploadScreen.clickBtnUpload();
      sleep.sleep(1);

      // ****************************
      // ** 実行
      // ****************************
      await publishUploadScreen.clickBtnUpdate();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await publishUploadScreen.firstCustCd, '000000012');
      assert.deepEqual(await publishUploadScreen.UploadMessage, 'アップロードしました。');

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

      // インサートしたレコードを削除
      connection.query('DELETE FROM t_issue_history WHERE id="4"', function (err, result) {
        if (err) {
          // UPDATEに失敗したら戻す
          connection.rollback(function () {
            throw err;
          });
        }
      });

      connection.end();
    });
    it('発送データCSVのアップロードができること（支店CD毎に出力、次回の発送データダウンロードに含める）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      const publishUploadScreen = new PublishUploadScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();
      await publishUploadScreen.clickPublishUpload();
      await publishUploadScreen.clickBtnFile('/issue/publish_upload_test.csv');
      await publishUploadScreen.clickIssueBranchCd();
      await publishUploadScreen.clickIssueDivDownload();
      await publishUploadScreen.clickBtnUpload();

      // ****************************
      // ** 実行
      // ****************************
      await publishUploadScreen.clickBtnUpdate();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await publishUploadScreen.firstCustCd, '000000012');
      assert.deepEqual(await publishUploadScreen.UploadMessage, 'アップロードしました。');

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

      // インサートしたレコードを削除
      connection.query('DELETE FROM t_issue_history WHERE t_unis_cust_id="12"', function (err, result) {
        if (err) {
          // UPDATEに失敗したら戻す
          connection.rollback(function () {
            throw err;
          });
        }
      });

      connection.end();
    }); 
    it('発送データCSVのアップロードができること（顧客CD毎に出力、次回の発送データダウンロードに含める）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      const publishUploadScreen = new PublishUploadScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();
      await publishUploadScreen.clickPublishUpload();
      await publishUploadScreen.clickBtnFile('/issue/publish_upload_test.csv');
      await publishUploadScreen.clickIssueCustCd();
      await publishUploadScreen.clickIssueDivDownload();
      await publishUploadScreen.clickBtnUpload();

      // ****************************
      // ** 実行
      // ****************************
      await publishUploadScreen.clickBtnUpdate();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await publishUploadScreen.firstCustCd, '000000012');
      assert.deepEqual(await publishUploadScreen.UploadMessage, 'アップロードしました。');

      // ****************************
      // ** 後始末
      // ****************************

    });
    it('発送データCSVのアップロードができること（一括出力、今すぐPDF出力する、初回登録済み顧客を除く）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      const publishUploadScreen = new PublishUploadScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();
      await publishUploadScreen.clickPublishUpload();
      await publishUploadScreen.clickBtnFile('/issue/publish_upload_option_test.csv');
      await publishUploadScreen.clickExceptInitCust();
      await publishUploadScreen.clickBtnUpload();

      // ****************************
      // ** 実行
      // ****************************
      await publishUploadScreen.clickBtnOutput();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await publishUploadScreen.firstCustCd, '000000013');
      assert.deepEqual(await publishUploadScreen.UploadMessage, '発送データを出力しました。');

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

      // インサートしたレコードを削除
      connection.query('DELETE FROM t_issue_history WHERE t_unis_cust_id="13"', function (err, result) {
        if (err) {
          // UPDATEに失敗したら戻す
          connection.rollback(function () {
            throw err;
          });
        }
      });

      connection.end();
    });
  });
}