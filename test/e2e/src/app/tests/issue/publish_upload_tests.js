const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils, Database } = require('lib');
const { LoginScreen, PublishDownloadScreen, PublishUploadScreen } = require('screen');

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
      execSync(`find /data/batch/account_publish/ -type f -mtime -1 | xargs rm -f`);
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
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();
      await publishUploadScreen.clickPublishUpload();
      await publishUploadScreen.clickBtnFile('/issue/publish_upload_all_test.csv');
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
      assert.deepEqual(await publishUploadScreen.firstCustCd, '000000015');
      assert.deepEqual(await publishUploadScreen.UploadMessage, 'アップロードしました。');

      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery('DELETE FROM t_issue_history WHERE t_unis_cust_id = ?', [15]);
    });
    it('発送データCSVのアップロードができること（支店CD毎に出力、次回の発送データダウンロードに含める）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      const publishUploadScreen = new PublishUploadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();
      await publishUploadScreen.clickPublishUpload();
      await publishUploadScreen.clickBtnFile('/issue/publish_upload_branch_test.csv');
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
      assert.deepEqual(await publishUploadScreen.firstCustCd, '000000014');
      assert.deepEqual(await publishUploadScreen.UploadMessage, 'アップロードしました。');

      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery('DELETE FROM t_issue_history WHERE t_unis_cust_id = ?', [14]);
    });
    it('発送データCSVのアップロードができること（顧客CD毎に出力、次回の発送データダウンロードに含める）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      const publishUploadScreen = new PublishUploadScreen(driver);
      await loginScreen.access();
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
      Database.executeQuery('DELETE FROM t_issue_history WHERE t_unis_cust_id = ?', [12]);

    });
    it('発送データCSVのアップロードができること（一括出力、今すぐPDF出力する、初回登録済み顧客を除く）', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      const publishUploadScreen = new PublishUploadScreen(driver);
      await loginScreen.access();
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
      Database.executeQuery('DELETE FROM t_issue_history WHERE t_unis_cust_id = ?', [13]);
      Database.executeQuery('UPDATE t_issue_history SET status_flag = 0 WHERE t_unis_cust_id = ?', [2]);
    });
  });
}