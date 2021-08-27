import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import fs from "fs";
import Utils from "@/lib/utils";
import Const from "@/lib/const";
import Dir from "@/lib/dir";

import {
  LoginScreen,
  TrialSearchScreen,
  TrialDetailScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("お試しアカウント詳細画面のテスト", () => {
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

  test("画面に表示されている内容が正しいこと", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const trialSearchScreen = new TrialSearchScreen(driver);
    const trialDetailScreen = new TrialDetailScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await trialSearchScreen.clickBtnTrial();
    await trialSearchScreen.clickBtnTrialAccountSearch();
    // ****************************
    // ** 実行
    // ****************************
    await Utils.sleep(1);
    await trialSearchScreen.clickBtnDetail();
    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "dedicated/trial_detail"
    );
    expect(await trialDetailScreen.accountId).toEqual("11");
    expect(await trialDetailScreen.loginId).toEqual("W7Pr56");
    expect(await trialDetailScreen.password).toEqual("CPhKCagj");
    expect(await trialDetailScreen.salesChannel).toEqual("USEN");
    expect(await trialDetailScreen.issueDate).toEqual("2020-08-05");
    expect(await trialDetailScreen.firstAuthenticationDatetimes).toEqual(
      "2020-09-14 11:25:44"
    );
    expect(await trialDetailScreen.expireDate).toEqual("2020-09-27");
    expect(await trialDetailScreen.viewingHistoryTotal).toEqual("0時間00分");
    const arr = [
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
      "10時間00分",
      "11時間11分",
      "12時間22分",
      "13時間33分",
      "0時間01分",
      "0時間02分",
      "22時間44分",
      "2時間30分",
      "1時間02分",
      "2時間33分",
      "11時間11分",
      "9時間59分",
      "23時間00分",
      "23時間59分",
      "0時間00分",
      "0時間00分",
      "0時間00分",
    ];
    for (let n = 0; n < arr.length; n++) {
      expect(await trialDetailScreen.viewingHistoryNth(n)).toEqual(arr[n]);
    }
    // ****************************
    // ** 後始末
    // ****************************
  });
  test("一覧へ戻るボタンを押下すると、お試しアカウント検索画面に遷移すること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const trialSearchScreen = new TrialSearchScreen(driver);
    const trialDetailScreen = new TrialDetailScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await trialSearchScreen.clickBtnTrial();
    await trialSearchScreen.clickBtnTrialAccountSearch();
    await trialSearchScreen.clickBtnDetail();
    // ****************************
    // ** 実行
    // ****************************
    await trialDetailScreen.clickBtnReturnSearchList();
    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "dedicated/trial_search"
    );
    // ****************************
    // ** 後始末
    // ****************************
  });
  test("視聴履歴がダウンロードできること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const trialSearchScreen = new TrialSearchScreen(driver);
    const trialDetailScreen = new TrialDetailScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await trialSearchScreen.clickBtnTrial();
    await trialSearchScreen.clickBtnTrialAccountSearch();
    await trialSearchScreen.clickBtnDetail();
    // ****************************
    // ** 実行
    // ****************************
    await trialDetailScreen.clickBtnDownloadViewingHistory();
    await Utils.sleep(1);
    // ****************************
    // ** 検証
    // ****************************
    // ファイル名取得
    const csvFilename = Utils.getDownloadFilename();
    // ファイル読み込み
    const actual = fs.readFileSync(csvFilename).toString();
    const expected = fs
      .readFileSync(`${Dir.filesDedicated}/expected_viewing_history.csv`)
      .toString();
    // ファイル内容の比較
    expect(Utils.replaceNewLine(actual)).toEqual(Utils.replaceNewLine(expected));
    // ****************************
    // ** 後始末
    // ****************************
  });
});