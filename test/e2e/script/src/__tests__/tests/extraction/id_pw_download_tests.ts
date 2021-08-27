import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import fs from "fs";

import Utils from "@/lib/utils";
import Const from "@/lib/const";
import Dir from "@/lib/dir";

import {
  LoginScreen,
  ExtractionScreen,
  InitedCustCdDownloadScreen,
  IdPwDownloadScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("ID/PW抽出（顧客CD指定）画面のテスト", () => {
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

  test("データ抽出画面のメニューからID/PW抽出（顧客CD指定）を押下しID/PW抽出（顧客CD指定）画面が表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "extraction/id_pw_download/"
    );
    expect(await idPwDownloadScreen.title).toEqual("ID/PW抽出（顧客CD指定）");
    expect(await idPwDownloadScreen.serviceCd).toEqual("100"); // valueを取得（テキストの取得調査中）
    expect(await idPwDownloadScreen.alert).toEqual("");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「OTORAKU」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.selectServiceCd("120");

    // ****************************
    // ** 検証
    // ****************************
    expect(await idPwDownloadScreen.serviceCd).toEqual("120");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「スタシフ」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.selectServiceCd("130");

    // ****************************
    // ** 検証
    // ****************************
    expect(await idPwDownloadScreen.serviceCd).toEqual("130");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「REACH STOCK（飲食店）」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.selectServiceCd("140");

    // ****************************
    // ** 検証
    // ****************************
    expect(await idPwDownloadScreen.serviceCd).toEqual("140");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「REACH STOCK（生産者）」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.selectServiceCd("150");

    // ****************************
    // ** 検証
    // ****************************
    expect(await idPwDownloadScreen.serviceCd).toEqual("150");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「USPOT」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.selectServiceCd("160");

    // ****************************
    // ** 検証
    // ****************************
    expect(await idPwDownloadScreen.serviceCd).toEqual("160");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「デンタル・コンシェルジュ」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.selectServiceCd("170");

    // ****************************
    // ** 検証
    // ****************************
    expect(await idPwDownloadScreen.serviceCd).toEqual("170");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("CSVファイル未選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await idPwDownloadScreen.alert).toEqual(
      "CSVファイルを選択してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("TXTファイル選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.clickBtnFile(
      "/extraction/id_pw_download_test_1.txt"
    );
    await idPwDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await idPwDownloadScreen.alert).toEqual(
      "CSVファイルを選択してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("ID/PWデータが抽出され、ファイルがダウンロードされていることを確認", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const idPwDownloadScreen = new IdPwDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIdPwDownload();

    // ****************************
    // ** 実行
    // ****************************
    await idPwDownloadScreen.clickBtnFile(
      "/extraction/id_pw_download_test_1_upload.csv"
    ); // todo: アップロードCSV、データ作成
    await idPwDownloadScreen.clickBtnDownload();
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
        `${Dir.filesExtraction}/id_pw_download_test_1_expected.csv`
      )
      .toString(); // todo: 期待結果CSV作成

    // ファイル内容の比較
    expect(Utils.replaceNewLine(actual)).toEqual(Utils.replaceNewLine(expected));

    // ****************************
    // ** 後始末
    // ****************************
  });
});