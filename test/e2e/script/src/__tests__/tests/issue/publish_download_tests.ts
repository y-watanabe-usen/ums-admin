import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import fs from "fs";
import moment from "moment";

import Utils from "@/lib/utils";
import Const from "@/lib/const";
import Dir from "@/lib/dir";

import { LoginScreen, PublishDownloadScreen } from "@/screen/index";

let driver: WebDriver;

describe("発送データダウンロード画面のテスト", () => {
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
    const publishDownloadScreen = new PublishDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();

    // ****************************
    // ** 実行
    // ****************************
    await publishDownloadScreen.clickBtnShippingManagement();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "issue/publish_download/"
    );
    expect(
      await publishDownloadScreen.getfirstFileText(
        "20191029083138_チェーン店発送.zip"
      )
    ).toEqual(true);

    // ****************************
    // ** 後始末
    // ****************************
  });
  test("ファイルのダウンロードができること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const publishDownloadScreen = new PublishDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await publishDownloadScreen.clickBtnShippingManagement();

    // ****************************
    // ** 実行
    // ****************************
    await publishDownloadScreen.clickBtnDownload(
      "20190527201448_顧客発送_複数枚フォーマット.pdf",
      "ダウンロード"
    );
    await Utils.sleep(1);

    // ****************************
    // ** 検証
    // ****************************
    // ファイル名取得
    const pdfFilename = Utils.getDownloadFilename();
    // ファイル読み込み
    const actual = fs.readFileSync(pdfFilename).toString();
    const expected = fs
      .readFileSync(`${Dir.filesIssue}/expected.pdf`)
      .toString();
    // ファイル内容の比較
    expect(actual).toEqual(expected);

    // ****************************
    // ** 後始末
    // ****************************
  });
  test("発送データ作成ができること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const publishDownloadScreen = new PublishDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await publishDownloadScreen.clickBtnShippingManagement();

    // ****************************
    // ** 実行
    // ****************************
    await publishDownloadScreen.clickBtnCreateShippingData();
    await Utils.sleep(1);

    // 画面のファイル名を取得し、YYYYMMDDのファイル名に変更
    const str = await publishDownloadScreen.firstFileName;
    const result = str.slice(0, 8) + str.slice(14);

    // 比較用の期待値を作成
    const thisMonthFormatted = moment().format("YYYYMMDD");
    const expected = thisMonthFormatted + "_顧客発送_標準フォーマット.pdf";

    // ****************************
    // ** 検証
    // ****************************;
    expect(await publishDownloadScreen.shippingMessage).toEqual(
      "発送データの作成が完了しました。"
    );
    expect(result).toEqual(expected);

    // ****************************
    // ** 後始末
    // ****************************
  });
});