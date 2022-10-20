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
  MailAddressInitImportScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("メールアドレス初回登録・仮ID/PW抽出画面のテスト", () => {
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

  test("データ抽出画面のメニューからメールアドレス初回登録・仮ID/PW抽出を押下しメールアドレス初回登録・仮ID/PW抽出画面が表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const mailAddressInitImportScreen = new MailAddressInitImportScreen(
      driver
    );
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await extractionScreen.clickExtractionMenuMailAddressInitImport();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "extraction/mail_address_init_import/"
    );
    expect(await mailAddressInitImportScreen.title).toEqual(
      "メールアドレス初回登録・仮ID/PW抽出画面"
    );
    expect(await mailAddressInitImportScreen.enableBtnDownload).toEqual(
      false
    );

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
    const mailAddressInitImportScreen = new MailAddressInitImportScreen(
      driver
    );
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuMailAddressInitImport();

    // ****************************
    // ** 実行
    // ****************************
    await mailAddressInitImportScreen.clickBtnUpload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await mailAddressInitImportScreen.alert).toEqual(
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
    const mailAddressInitImportScreen = new MailAddressInitImportScreen(
      driver
    );
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuMailAddressInitImport();

    // ****************************
    // ** 実行
    // ****************************
    await mailAddressInitImportScreen.clickBtnFile(
      "/extraction/mail_address_init_import_test_1.txt"
    );
    await mailAddressInitImportScreen.clickBtnUpload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await mailAddressInitImportScreen.alert).toEqual(
      "CSVファイルを選択してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  // TODO: ダウンロードが上手くいかないためスキップ
  test.skip("アカウント証発送履歴抽出され、ファイルがダウンロードされていることを確認", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const mailAddressInitImportScreen = new MailAddressInitImportScreen(
      driver
    );
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuMailAddressInitImport();

    // ****************************
    // ** 実行
    // ****************************
    await mailAddressInitImportScreen.clickBtnFile(
      "/extraction/mail_address_init_import_test_1_upload.csv"
    );
    await mailAddressInitImportScreen.clickBtnUpload();
    await mailAddressInitImportScreen.clickBtnDownload();
    await mailAddressInitImportScreen.downloadClick();
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
        `${Dir.filesExtraction}/mail_address_init_import_test_1_expected.csv`
      )
      .toString();

    // ファイル内容の比較
    expect(Utils.replaceNewLine(actual)).toEqual(Utils.replaceNewLine(expected));

    // ****************************
    // ** 後始末
    // ****************************
  });
});