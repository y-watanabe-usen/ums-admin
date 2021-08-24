import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import Utils from "@/lib/utils";
import Const from "@/lib/const";

import {
  LoginScreen,
  ExtractionScreen,
  InitedCustCdDownloadScreen,
  ChainStoreBulkRegistScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面のテスト", () => {
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

  test("データ抽出画面のメニューからメールアドレス初回登録・仮ID/PW抽出を押下しUSEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面が表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "extraction/chain_store_bulk_regist/"
    );
    expect(await chainStoreBulkRegistScreen.title).toEqual(
      "USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面"
    );
    expect(await chainStoreBulkRegistScreen.radioBranch).toEqual(true);
    expect(await chainStoreBulkRegistScreen.radioClient).toEqual(false);

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("顧客CD毎に出力が選択されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

    // ****************************
    // ** 実行
    // ****************************
    await chainStoreBulkRegistScreen.clickRadioClient();

    // ****************************
    // ** 検証
    // ****************************
    expect(await chainStoreBulkRegistScreen.radioBranch).toEqual(false);
    expect(await chainStoreBulkRegistScreen.radioClient).toEqual(true);

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
    const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

    // ****************************
    // ** 実行
    // ****************************
    await chainStoreBulkRegistScreen.clickBtnUpload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await chainStoreBulkRegistScreen.alert).toEqual(
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
    const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

    // ****************************
    // ** 実行
    // ****************************
    await chainStoreBulkRegistScreen.clickBtnFile(
      "/extraction/chain_store_bulk_regist_test_1.txt"
    );
    await chainStoreBulkRegistScreen.clickBtnUpload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await chainStoreBulkRegistScreen.alert).toEqual(
      "CSVファイルを選択してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("CSVファイルがアップロードできること（支店CD毎に出力）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

    // ****************************
    // ** 実行
    // ****************************
    await chainStoreBulkRegistScreen.clickBtnFile(
      "/extraction/chain_store_bulk_regist_test_1_upload.csv"
    );
    await chainStoreBulkRegistScreen.clickBtnUpload();
    await chainStoreBulkRegistScreen.clickBtnDownload();
    await chainStoreBulkRegistScreen.downloadClick();
    await Utils.sleep(2);

    // ****************************
    // ** 検証
    // ****************************
    // ファイル名取得
    const zipFilename = Utils.getDownloadFilename(false);
    // ファイル内容の比較
    expect(zipFilename).toMatch(/^[0-9]{14}_.*.zip$/);

    // ****************************
    // ** 後始末
    // ****************************
  });
  test("CSVファイルがアップロードできること（顧客CD毎に出力）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

    // ****************************
    // ** 実行
    // ****************************
    await chainStoreBulkRegistScreen.chooseRadioBtnCustCd();
    await chainStoreBulkRegistScreen.clickBtnFile(
      "/extraction/chain_store_bulk_regist_test_1_upload.csv"
    );
    await chainStoreBulkRegistScreen.clickBtnUpload();
    await chainStoreBulkRegistScreen.clickBtnDownload();
    await chainStoreBulkRegistScreen.downloadClick();
    await Utils.sleep(2);

    // ****************************
    // ** 検証
    // ****************************
    // ファイル名取得
    const zipFilename = Utils.getDownloadFilename(false);
    // ファイル内容の比較
    expect(zipFilename).toMatch(/^[0-9]{14}_.*.zip$/);

    // ****************************
    // ** 後始末
    // ****************************
  });
});