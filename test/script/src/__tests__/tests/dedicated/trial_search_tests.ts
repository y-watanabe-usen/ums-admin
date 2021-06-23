import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import fs from "fs";
import Utils from "@/lib/utils";
import Dir from "@/lib/dir";
import Const from "@/lib/const";

import { LoginScreen, TrialSearchScreen } from "@/screen/index";

let driver: WebDriver;

export const trialSearchTests = () => {
  describe("お試しアカウント検索画面のテスト", () => {
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

    test("検索条件無しで検索が出来ること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "dedicated/trial_search/"
      );
      expect(await trialSearchScreen.firstAccountId).toEqual("11");
      // ****************************
      // ** 後始末
      // ****************************
    });
    test("ログインIDを検索条件に指定して検索が出来ること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.inputLoginId("LJnaK2");
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "dedicated/trial_search/"
      );
      expect(await trialSearchScreen.firstLoginId).toEqual("LJnaK2");
      // ****************************
      // ** 後始末
      // ****************************
    });
    test("アカウントIDを検索条件に指定して検索が出来ること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.inputAccountId("12");
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "dedicated/trial_search/"
      );
      expect(await trialSearchScreen.firstAccountId).toEqual("12");
      // ****************************
      // ** 後始末
      // ****************************
    });
    test("検索結果がダウンロードできること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await trialSearchScreen.inputAccountId("11");
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.clickBtnDownload();
      await Utils.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      // ファイル名取得
      const csvFilename = Utils.getDownloadFilename();
      // ファイル読み込み
      const actual = fs.readFileSync(csvFilename).toString();
      const expected = fs
        .readFileSync(`${Dir.filesDedicated}/expected.csv`)
        .toString();
      // ファイル内容の比較
      expect(actual).toEqual(expected);
      // ****************************
      // ** 後始末
      // ****************************
    });
    test("検索結果の詳細ボタンを押下すると、お試しアカウント詳細画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const trialSearchScreen = new TrialSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await trialSearchScreen.clickBtnTrial();
      await trialSearchScreen.clickBtnTrialAccountSearch();
      // ****************************
      // ** 実行
      // ****************************
      await trialSearchScreen.clickBtnDetail();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "dedicated/trial_detail"
      );
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
};
