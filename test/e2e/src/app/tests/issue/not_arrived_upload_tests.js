const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, PublishDownloadScreen, NotArrivedUploadScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('未着データアップロード画面のテスト', () => {
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

    it('未着データCSVのアップロードができること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const publishDownloadScreen = new PublishDownloadScreen(driver);
      const notArrivedUploadScreen = new NotArrivedUploadScreen(driver);

      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await publishDownloadScreen.clickBtnShippingManagement();
      await notArrivedUploadScreen.clickNotArrivedUpload();
      await notArrivedUploadScreen.clickBtnFile('/issue/not_arrived_upload_test.csv');
      await notArrivedUploadScreen.clickBtnUpload();

      // ****************************
      // ** 実行
      // ****************************
      await notArrivedUploadScreen.clickBtnUpdate();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await notArrivedUploadScreen.firstCustCd, '000000002');
      assert.deepEqual(await notArrivedUploadScreen.UploadMessage, 'アップロードしました。');

      // ****************************
      // ** 後始末
      // ****************************
    });

  });
}