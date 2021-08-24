import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Utils from "@/lib/utils";

import {
  LoginScreen,
  PublishDownloadScreen,
  NotArrivedUploadScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("未着データアップロード画面のテスト", () => {
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

  test("未着データCSVのアップロードができること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const publishDownloadScreen = new PublishDownloadScreen(driver);
    const notArrivedUploadScreen = new NotArrivedUploadScreen(driver);

    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await publishDownloadScreen.clickBtnShippingManagement();
    await notArrivedUploadScreen.clickNotArrivedUpload();
    await notArrivedUploadScreen.clickBtnFile(
      "/issue/not_arrived_upload_test.csv"
    );
    await notArrivedUploadScreen.clickBtnUpload();

    // ****************************
    // ** 実行
    // ****************************
    await notArrivedUploadScreen.clickBtnUpdate();

    // ****************************
    // ** 検証
    // ****************************
    expect(await notArrivedUploadScreen.firstCustCd).toEqual("000000002");
    expect(await notArrivedUploadScreen.UploadMessage).toEqual(
      "アップロードしました。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });
});