import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Utils from "@/lib/utils";
import Database from "@/lib/database";

import {
  LoginScreen,
  PublishDownloadScreen,
  PublishUploadScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("発送データアップロード画面のテスト", () => {
  beforeAll(async () => {
    const usingServer = Utils.buildUsingServer();
    const capabilities = Utils.buildCapabilities();
    driver = await new Builder()
      .usingServer(usingServer)
      .withCapabilities(capabilities)
      .build();

    driver.setFileDetector(new remote.FileDetector()); // ファイル検知モジュール

    process.on("unhandledRejection", console.dir);
    Database.connect();
    Database.executeQuery(
      "DELETE FROM t_issue_history WHERE t_unis_cust_id = ?",
      [12]
    );
  });

  beforeEach(async () => {
    Utils.removeAllDownloadFiles();
    await driver.manage().deleteAllCookies();
  });

  afterAll(() => {
    Database.disconnect();
    return driver.quit();
  });

  test("発送データCSVのアップロードができること（一括出力、次回の発送データダウンロードに含める）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const publishDownloadScreen = new PublishDownloadScreen(driver);
    const publishUploadScreen = new PublishUploadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await publishDownloadScreen.clickBtnShippingManagement();
    await publishUploadScreen.clickPublishUpload();
    await publishUploadScreen.clickBtnFile(
      "/issue/publish_upload_all_test.csv"
    );
    await publishUploadScreen.clickIssueDivDownload();
    await publishUploadScreen.clickBtnUpload();
    await Utils.sleep(1);

    // ****************************
    // ** 実行
    // ****************************
    await publishUploadScreen.clickBtnUpdate();

    // ****************************
    // ** 検証
    // ****************************
    expect(await publishUploadScreen.firstCustCd).toEqual("000000015");
    expect(await publishUploadScreen.UploadMessage).toEqual(
      "アップロードしました。"
    );

    // ****************************
    // ** 後始末
    // ****************************
    Database.executeQuery(
      "DELETE FROM t_issue_history WHERE t_unis_cust_id = ?",
      [15]
    );
  });
  test("発送データCSVのアップロードができること（支店CD毎に出力、次回の発送データダウンロードに含める）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const publishDownloadScreen = new PublishDownloadScreen(driver);
    const publishUploadScreen = new PublishUploadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await publishDownloadScreen.clickBtnShippingManagement();
    await publishUploadScreen.clickPublishUpload();
    await publishUploadScreen.clickBtnFile(
      "/issue/publish_upload_branch_test.csv"
    );
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
    expect(await publishUploadScreen.firstCustCd).toEqual("000000014");
    expect(await publishUploadScreen.UploadMessage).toEqual(
      "アップロードしました。"
    );

    // ****************************
    // ** 後始末
    // ****************************
    Database.executeQuery(
      "DELETE FROM t_issue_history WHERE t_unis_cust_id = ?",
      [14]
    );
  });
  test("発送データCSVのアップロードができること（顧客CD毎に出力、次回の発送データダウンロードに含める）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const publishDownloadScreen = new PublishDownloadScreen(driver);
    const publishUploadScreen = new PublishUploadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await publishDownloadScreen.clickBtnShippingManagement();
    await publishUploadScreen.clickPublishUpload();
    await publishUploadScreen.clickBtnFile("/issue/publish_upload_test.csv");
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
    expect(await publishUploadScreen.firstCustCd).toEqual("000000012");
    expect(await publishUploadScreen.UploadMessage).toEqual(
      "アップロードしました。"
    );

    // ****************************
    // ** 後始末
    // ****************************
    Database.executeQuery(
      "DELETE FROM t_issue_history WHERE t_unis_cust_id = ?",
      [12]
    );
  });
  test("発送データCSVのアップロードができること（一括出力、今すぐPDF出力する、初回登録済み顧客を除く）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const publishDownloadScreen = new PublishDownloadScreen(driver);
    const publishUploadScreen = new PublishUploadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await publishDownloadScreen.clickBtnShippingManagement();
    await publishUploadScreen.clickPublishUpload();
    await publishUploadScreen.clickBtnFile(
      "/issue/publish_upload_option_test.csv"
    );
    await publishUploadScreen.clickExceptInitCust();
    await publishUploadScreen.clickBtnUpload();

    // ****************************
    // ** 実行
    // ****************************
    await publishUploadScreen.clickBtnOutput();

    // ****************************
    // ** 検証
    // ****************************
    expect(await publishUploadScreen.firstCustCd).toEqual("000000013");
    expect(await publishUploadScreen.UploadMessage).toEqual(
      "発送データを出力しました。"
    );

    // ****************************
    // ** 後始末
    // ****************************
    Database.executeQuery(
      "DELETE FROM t_issue_history WHERE t_unis_cust_id = ?",
      [13]
    );
    Database.executeQuery(
      "UPDATE t_issue_history SET issue_date = NULL, not_arrived_date = NULL, status_flag = 0 WHERE t_unis_cust_id = ?",
      [2]
    );
  });
});