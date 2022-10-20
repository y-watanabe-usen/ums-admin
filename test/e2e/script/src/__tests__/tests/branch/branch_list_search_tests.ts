import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
// import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import Const from "@/lib/const";
import Utils from "@/lib/utils";
import { LoginScreen, BranchScreen } from "@/screen/index";

let driver: WebDriver;

describe("支店別管轄顧客一覧画面のテスト", () => {
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

  test(" 支店に指定して検索が出来ること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const branchScreen = new BranchScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await branchScreen.clickBtnSearchBranch();
    await branchScreen.clickBtnSelectBranch();
    await branchScreen.clickBtnSelectBranchinput();
    await branchScreen.clickBranch();

    // ****************************
    // ** 実行
    // ****************************
    await branchScreen.clickBtnSearch();
    await Utils.sleep(1);

    // ****************************
    // ** 検証
    // ****************************
    expect(await branchScreen.branchName).toEqual("東京統括支店青山");

    // ****************************
    // ** 後始末
    // ****************************
  });
  // skip: エラー回避の為、一旦skip
  test.skip(" 未着顧客一覧のダウンロードができること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const branchScreen = new BranchScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await branchScreen.clickBtnSearchBranch();
    await branchScreen.clickBtnSelectBranch();
    await branchScreen.clickBtnSelectBranchinput();
    await branchScreen.clickBranch();
    await branchScreen.clickBtnSearch();
    await Utils.sleep(1);

    // ****************************
    // ** 実行
    // ****************************
    await branchScreen.clickBtnnotArrivedDownload();
    await Utils.sleep(1);

    // ****************************
    // ** 検証
    // ****************************
    // ファイル名取得
    const csvFilename = Utils.getDownloadFilename();

    // ファイル読み込み
    const actual = fs.readFileSync(csvFilename).toString();
    const expected = fs
      .readFileSync(
        path.join(
          path.resolve(""),
          "src/__tests__/files/branch/not_arrived_expected.csv"
        )
      )
      .toString();
    // ファイル内容の比較
    expect(Utils.replaceNewLine(actual)).toEqual(Utils.replaceNewLine(expected));

    // ****************************
    // ** 後始末
    // ****************************
  });
  test(" 未着顧客一覧の詳細ボタンを押下すると、アカウント一覧画面に遷移すること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const branchScreen = new BranchScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await branchScreen.clickBtnSearchBranch();
    await branchScreen.clickBtnSelectBranch();
    await branchScreen.clickBtnSelectBranchinput();
    await branchScreen.clickBranch();
    await branchScreen.clickBtnSearch();
    await Utils.sleep(1);

    // ****************************
    // ** 実行
    // ****************************
    await branchScreen.clickBtnnotArrivedDetail();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "account/account_list"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });
  // skip: エラー回避の為、一旦skip
  test.skip("UNIS 連携サービス 確定可能顧客一覧のダウンロードができること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const branchScreen = new BranchScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await branchScreen.clickBtnSearchBranch();
    await branchScreen.clickBtnSelectBranch();
    await branchScreen.clickBtnSelectBranchinput();
    await branchScreen.clickBranch();
    await branchScreen.clickBtnSearch();
    await Utils.sleep(1);

    // ****************************
    // ** 実行
    // ****************************
    await branchScreen.clickBtnProspectsDownload();
    await Utils.sleep(1);

    // ****************************
    // ** 検証
    // ****************************
    // ファイル名取得
    const csvFilename = Utils.getDownloadFilename();

    // ファイル読み込み
    const actual = fs.readFileSync(csvFilename).toString();
    const expected = fs
      .readFileSync(
        path.join(
          path.resolve(""),
          "src/__tests__/files/branch/prospects_expected.csv"
        )
      )
      .toString();
    // ファイル内容の比較
    expect(Utils.replaceNewLine(actual)).toEqual(Utils.replaceNewLine(expected));

    // ****************************
    // ** 後始末
    // ****************************
  });
});