import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import fs from "fs";
import Utils from "@/lib/utils";

import {
  LoginScreen,
  TrialSearchScreen,
  TrialCreateScreen,
} from "@/screen/index";

let driver: WebDriver;

export const trialCreateTests = () => {
  describe("お試しアカウント発行画面のテスト", () => {
    beforeAll(async () => {
      const usingServer = Utils.buildUsingServer();
      const capabilities = Utils.buildCapabilities();
      driver = await new Builder()
        .usingServer(usingServer)
        .withCapabilities(capabilities)
        .build();

      driver.setFileDetector(new remote.FileDetector()); // ファイル検知モジュール

      process.on("unhandledRejection", console.dir);
    });

    beforeEach(async () => {
      Utils.removeAllDownloadFiles();
      await driver.manage().deleteAllCookies();
    });

    afterAll(() => {
      return driver.quit();
    });

    test(" お試しアカウントが発行できること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      const trialCreateScreen = new TrialCreateScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await trialCreateScreen.clickTrialMenuTrialAccountCreate();
      // ****************************
      // ** 実行
      // ****************************
      await trialCreateScreen.inputCount("1");
      await trialCreateScreen.clickBtnTrialAccountCreate();
      await Utils.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const csvFilename = Utils.getDownloadFilename();
      // ファイル読み込み
      const actual = fs.readFileSync(csvFilename).toString();
      // ファイル内容の比較
      expect(actual).toMatch(
        /(.*),(.*),(.*),(.*),(.*)\r\n[A-z0-9]{6},[A-z0-9]{8},USEN,[0-9]+,[0-9]+/
      );
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
};
