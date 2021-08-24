import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import fs from "fs";
import moment from "moment";

import Utils from "@/lib/utils";
import Const from "@/lib/const";
import Dir from "@/lib/dir";
import Database from "@/lib/database";

import {
  LoginScreen,
  ExtractionScreen,
  InitedCustCdDownloadScreen,
  IssueHistoryDownloadScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("アカウント証発送履歴抽出画面のテスト", () => {
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

  test("データ抽出画面のメニューからアカウント証発送履歴抽出を押下しアカウント証発送履歴抽出画面が表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();

    // ****************************
    // ** 実行
    // ****************************
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "extraction/issue_history_download/"
    );
    expect(await issueHistoryDownloadScreen.title).toEqual(
      "アカウント証発送履歴抽出"
    );
    expect(await issueHistoryDownloadScreen.from).toEqual("");
    expect(await issueHistoryDownloadScreen.to).toEqual("");

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("先月ボタン押下でテキストボックスに先月の日時が入力されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    const lastMonth = moment().subtract(1, "month");
    const lastMonthFormatted = lastMonth.format("YYYY/MM/");
    const cntLastMonthDay = moment(lastMonth.format("YYYY-MM")).daysInMonth(); // 先月の日数取得

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.clickBtnLastMonth();

    // ****************************
    // ** 検証
    // ****************************
    expect(await issueHistoryDownloadScreen.from).toEqual(
      lastMonthFormatted + "01"
    );
    expect(await issueHistoryDownloadScreen.to).toEqual(
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
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    const thisMonthFormatted = moment().format("YYYY/MM/");
    const cntThisMonthDay = moment(moment().format("YYYY-MM")).daysInMonth(); // 先月の日数取得

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.clickBtnThisMonth();

    // ****************************
    // ** 検証
    // ****************************
    expect(await issueHistoryDownloadScreen.from).toEqual(
      thisMonthFormatted + "01"
    );
    expect(await issueHistoryDownloadScreen.to).toEqual(
      thisMonthFormatted + cntThisMonthDay
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("発送日fromの入力ミス（年のみ）の場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.inputFrom("2020");
    await issueHistoryDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await issueHistoryDownloadScreen.alert).toEqual(
      "発送日FROMを正しく入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("発送日fromの入力ミス（年月のみ）の場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.inputFrom("2020/07");
    await issueHistoryDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await issueHistoryDownloadScreen.alert).toEqual(
      "発送日FROMを正しく入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("発送日to（年のみ）の入力ミスの場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.inputFrom("2020/07/01");
    await issueHistoryDownloadScreen.inputTo("2020");
    await issueHistoryDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await issueHistoryDownloadScreen.alert).toEqual(
      "発送日TOを正しく入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("発送日to（年月のみ）の入力ミスの場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.inputFrom("2020/07/01");
    await issueHistoryDownloadScreen.inputTo("2020/07");
    await issueHistoryDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await issueHistoryDownloadScreen.alert).toEqual(
      "発送日TOを正しく入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("発送日の入力ミスの場合（from, to逆）エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.inputFrom("2020/07/31");
    await issueHistoryDownloadScreen.inputTo("2020/07/01");
    await issueHistoryDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await issueHistoryDownloadScreen.alert).toEqual(
      "発送日はFrom <= Toで入力してください。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });

  test("抽出対象データがない場合エラーメッセージが表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************

    // t_issue_history.issue_date、t_issue_history.not_arrived_dateを変更
    const updateId = [2, 4];
    Database.executeQuery(
      'UPDATE t_issue_history SET issue_date="2020/07/01", not_arrived_date="2020/07/31" WHERE id IN (?,?)',
      updateId
    );

    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.clickBtnLastMonth();
    await issueHistoryDownloadScreen.clickBtnDownload();

    // ****************************
    // ** 検証
    // ****************************
    expect(await issueHistoryDownloadScreen.alert).toEqual(
      "対象データはありません。"
    );

    // ****************************
    // ** 後始末
    // ****************************

    // t_issue_history.issue_date、t_issue_history.not_arrived_dateを変更
    const returnUpdateId = [2, 4];
    Database.executeQuery(
      'UPDATE t_issue_history SET issue_date="2020-08-01 16:21:19", not_arrived_date="2020-08-01 16:21:19" WHERE id IN (?,?)',
      returnUpdateId
    );
  });

  test("アカウント証発送履歴データが抽出され、ファイルがダウンロードされていることを確認", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const extractionScreen = new ExtractionScreen(driver);
    const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
    const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await initedCustCdDownloadScreen.clickTabExtraction();
    await extractionScreen.clickExtractionMenuIssueHistoryDownload();

    // ****************************
    // ** 実行
    // ****************************
    await issueHistoryDownloadScreen.clickBtnDownload();
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
        `${Dir.filesExtraction}/issue_history_download_test_1_expected.csv`
      )
      .toString();
    // ファイル内容の比較
    expect(Utils.replaceNewLine(actual)).toEqual(Utils.replaceNewLine(expected));

    // ****************************
    // ** 後始末
    // ****************************
  });
});