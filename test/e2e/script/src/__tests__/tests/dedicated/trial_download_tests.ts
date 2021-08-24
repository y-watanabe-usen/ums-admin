import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import fs from "fs";
import Utils from "@/lib/utils";

import {
  LoginScreen,
  TrialSearchScreen,
  TrialDownloadScreen,
} from "@/screen/index";

let driver: WebDriver;

export const trialDownloadTests = () => {
  describe("お試しアカウントダウンロード画面のテスト", () => {
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

    test("CSVファイルがダウンロードできること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      const trialDownloadScreen = new TrialDownloadScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await trialDownloadScreen.clickTrialMenuTrialAccountDownload();
      // ****************************
      // ** 実行
      // ****************************
      await trialDownloadScreen.clickBtnTrialAccountDownload();
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
