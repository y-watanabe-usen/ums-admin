const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, TrialSearchScreen, TrialCreateScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('お試しアカウント発行画面のテスト', () => {
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

    it(' お試しアカウントが発行できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      const trialCreateScreen = new TrialCreateScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await trialCreateScreen.clickTrialMenuTrialAccountCreate();
      // ****************************
      // ** 実行
      // ****************************
      await trialCreateScreen.inputCount('1');
      await trialCreateScreen.clickBtnTrialAccountCreate();
      sleep.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const stdout = execSync(`ls ${Const.DOWNLOAD_PATH}`);
      const csvFilename = stdout.toString().replace("\n", "");
      // ファイル読み込み
      const actual = fs.readFileSync(`${Const.DOWNLOAD_PATH}/${csvFilename}`).toString();
      // ファイル内容の比較
      await assert.match(actual, /(.*),(.*),(.*),(.*),(.*)\r\n[A-z0-9]{6},[A-z0-9]{8},USEN,[0-9]+,[0-9]+/);
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

