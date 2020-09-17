const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, BulkScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('サービス一括強制施錠／開錠画面のテスト', () => {
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

    it(' CSVファイルがアップロードできること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const bulkScreen = new BulkScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await bulkScreen.clickBtnBulk();
      await bulkScreen.clickBtnFile('/bulk/bulk_service_upload_test.csv');
      await bulkScreen.clickBtnBulkServiceUpload();

      // ****************************
      // ** 実行
      // ****************************
      await bulkScreen.clickBtnBulkServiceUploadSave();
      await bulkScreen.clickBtnBulkUploadAlertAccept();
      sleep.sleep(1);
      await bulkScreen.clickBtnBulkUploadAlertClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await bulkScreen.valkCustCd, '000000004');
      assert.deepStrictEqual(await bulkScreen.valkUpdateStatus, '開錠');

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

