import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import fs from "fs";
import moment from "moment";

import Utils from "@/lib/utils";
import Const from "@/lib/const";
import Dir from "@/lib/dir";

import { LoginScreen, InitedCustCdDownloadScreen } from "@/screen/index";

let driver: WebDriver;

describe("初回認証済顧客抽出画面のテスト", () => {
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

  test("データ抽出タブ押下で初回認証済顧客抽出画面が表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "extraction/inited_cust_cd_download/"
    );
    expect(await initedCustCdDownloadScreen.title).toEqual(
      "初回認証済顧客抽出"
    );
    expect(await initedCustCdDownloadScreen.from).toEqual("");
    expect(await initedCustCdDownloadScreen.to).toEqual("");
    expect(await initedCustCdDownloadScreen.service).toEqual("100"); // valueを取得（テキストの取得調査中）

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("先月ボタン押下でテキストボックスに先月の日時が入力されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    const lastMonth = moment().subtract(1, "month");
    const lastMonthFormatted = lastMonth.format("YYYY/MM/");
    const cntLastMonthDay = moment(lastMonth.format("YYYY-MM")).daysInMonth(); // 先月の日数取得

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.clickBtnLastMonth();

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.from).toEqual(
      lastMonthFormatted + "01"
    );
    expect(await initedCustCdDownloadScreen.to).toEqual(
      lastMonthFormatted + cntLastMonthDay
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("今月ボタン押下でテキストボックスに今月の日時が入力されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    const thisMonthFormatted = moment().format("YYYY/MM/");
    const cntThisMonthDay = moment(moment().format("YYYY-MM")).daysInMonth(); // 先月の日数取得

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.clickBtnThisMonth();

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.from).toEqual(
      thisMonthFormatted + "01"
    );
    expect(await initedCustCdDownloadScreen.to).toEqual(
      thisMonthFormatted + cntThisMonthDay
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("初回認証日fromの入力ミス（年のみ）の場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.inputFrom("2020");
    await initedCustCdDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.alert).toEqual(
      "初回認証日FROMを正しく入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("初回認証日fromの入力ミス（年月のみ）の場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.inputFrom("2020/07");
    await initedCustCdDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.alert).toEqual(
      "初回認証日FROMを正しく入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("初回認証日to（年のみ）の入力ミスの場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.inputFrom("2020/07/01");
    await initedCustCdDownloadScreen.inputTo("2020");
    await initedCustCdDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.alert).toEqual(
      "初回認証日TOを正しく入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("初回認証日to（年月のみ）の入力ミスの場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.inputFrom("2020/07/01");
    await initedCustCdDownloadScreen.inputTo("2020/07");
    await initedCustCdDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.alert).toEqual(
      "初回認証日TOを正しく入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("初回認証日の入力ミスの場合（from, to逆）エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.inputFrom("2020/07/31");
    await initedCustCdDownloadScreen.inputTo("2020/07/01");
    await initedCustCdDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.alert).toEqual(
      "初回認証日はFrom <= Toで入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「OTORAKU」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.selectService("120");

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.service).toEqual("120");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「スタシフ」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.selectService("130");

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.service).toEqual("130");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「REACH STOCK（飲食店）」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.selectService("140");

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.service).toEqual("140");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「REACH STOCK（生産者）」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.selectService("150");

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.service).toEqual("150");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「USPOT」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.selectService("160");

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.service).toEqual("160");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("サービスのプルダウンで「デンタル・コンシェルジュ」が選択されていること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.selectService("170");

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.service).toEqual("170");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("抽出対象データがない場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.clickBtnLastMonth();
    await initedCustCdDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await initedCustCdDownloadScreen.alert).toEqual(
      "対象データはありません。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  // skip: エラー回避の為、一旦skip
  test("初回認証済顧客データが抽出され、ファイルがダウンロードされていることを確認", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await initedCustCdDownloadScreen.clickBtnDownload();
    await Utils.sleep(1);

    // ****************************
    // ** 検証
    // ****************************
    // ファイル名取得
    const csvFilename = Utils.getDownloadFilename();
    console.log('test');
    console.log(csvFilename);
    // ファイル読み込み
    const actual = fs.readFileSync(csvFilename).toString();
    const expected = fs
      .readFileSync(
        `${Dir.filesExtraction}/inited_cust_cd_download_test_1_expected.csv`
      )
      .toString();

    // ファイル内容の比較
    expect(Utils.replaceNewLine(actual)).toEqual(Utils.replaceNewLine(expected));

    // ****************************
    // ** 後始末
    // ****************************
  });
});