import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import moment from "moment";

import Const from "@/lib/const";
import Utils from "@/lib/utils";
import Database from "@/lib/database";

import {
  LoginScreen,
  TrialSearchScreen,
  DemoSearchScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("デモアカウント検索画面のテスト", () => {
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
    const demoAccountSearchScreen = new DemoSearchScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await trialSearchScreen.clickBtnTrial();
    await demoAccountSearchScreen.clickTrialMenuDemoAccountSearch();
    // ****************************
    // ** 実行
    // ****************************
    await demoAccountSearchScreen.clickBtnDemoAccountSearch();
    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "dedicated/demo_search/"
    );
    expect(await demoAccountSearchScreen.firstLoginId).toEqual("NGXAL5");
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
    const demoAccountSearchScreen = new DemoSearchScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await trialSearchScreen.clickBtnTrial();
    await demoAccountSearchScreen.clickTrialMenuDemoAccountSearch();
    // ****************************
    // ** 実行
    // ****************************
    await demoAccountSearchScreen.inputLoginId("kCFjZB");
    await demoAccountSearchScreen.clickBtnDemoAccountSearch();
    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "dedicated/demo_search/"
    );
    expect(await demoAccountSearchScreen.firstLoginId).toEqual("kCFjZB");
    // ****************************
    // ** 後始末
    // ****************************
  });
  test("停止ボタンを押下すると、アカウント停止が出来ること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const trialSearchScreen = new TrialSearchScreen(driver);
    const demoAccountSearchScreen = new DemoSearchScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await trialSearchScreen.clickBtnTrial();
    await demoAccountSearchScreen.clickTrialMenuDemoAccountSearch();
    await demoAccountSearchScreen.clickBtnDemoAccountSearch();
    // ****************************
    // ** 実行
    // ****************************
    await demoAccountSearchScreen.clickBtnDemoAccountStop();
    await demoAccountSearchScreen.clickBtnDemoAccountStopSave();
    await Utils.sleep(1);
    // ****************************
    // ** 検証
    // ****************************
    const thisMonthFormatted = moment().format("YYYY-MM-DD");
    expect(await demoAccountSearchScreen.stoppedDate).toEqual(
      thisMonthFormatted
    );
    // ****************************
    // ** 後始末
    // ****************************
    Database.executeQuery(
      'UPDATE m_account SET status_flag = "0", pause_date = NULL WHERE id = ?',
      [21]
    );
    Database.executeQuery(
      'UPDATE t_unis_service SET status_flag = "0", end_date = NULL WHERE m_account_id = ?',
      [21]
    );
  });
});