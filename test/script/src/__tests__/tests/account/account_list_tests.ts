import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import moment from "moment";

import Const from "@/lib/const";
import Utils from "@/lib/utils";
import {
  LoginScreen,
  AccountSearchScreen,
  AccountListScreen,
} from "@/screen/index";

let driver: WebDriver;

export const accountListTests = () => {
  describe("アカウント一覧画面のテスト", () => {
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

    test(" 画面に表示されている内容が正しいこと", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("admin0001");
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 検証
      // ****************************
      // UNIS情報
      expect(await accountListScreen.firstCustCd).toEqual("admin0001");
      expect(await accountListScreen.name).toEqual(
        "テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)"
      );
      expect(await accountListScreen.clientStatus).toEqual("確定");
      expect(await accountListScreen.address).toEqual(
        "〒150-0045 渋谷区神泉町９－８ビル１Ｆ"
      );
      expect(await accountListScreen.tel).toEqual("0120-117-448");
      expect(await accountListScreen.branch).toEqual(
        "東京統括支店青山(0204140700)"
      );
      expect(await accountListScreen.regularStore).toEqual("");
      expect(await accountListScreen.industry).toEqual(
        "その他　会社関連(001699)"
      );
      expect(await accountListScreen.launch).toEqual("2014-10-01");
      expect(await accountListScreen.close).toEqual("");
      expect(await accountListScreen.cancell).toEqual("");
      expect(await accountListScreen.lastUpdate).toEqual("2014-11-20 15:21:24");
      // アカウント一覧
      expect(await accountListScreen.accountId).toEqual("1");
      expect(await accountListScreen.accountStatus).toEqual("有効");
      expect(await accountListScreen.loginId).toEqual("ir_dev@usen.co.jp");
      expect(await accountListScreen.mailAddress).toEqual(
        "a-sakurai@usen.co.jp"
      );
      expect(await accountListScreen.umsidStartDate).toEqual("2014-10-01");
      expect(await accountListScreen.umsidRegistDate).toEqual("2014-12-01");
      expect(await accountListScreen.umsidLostDate).toEqual("");
      expect(await accountListScreen.availability).toEqual("✔");
      // アカウント証発送情報
      expect(await accountListScreen.shippingDate).toEqual("");
      expect(await accountListScreen.missedDate).toEqual("");
      expect(await accountListScreen.shippingName).toEqual("");
      expect(await accountListScreen.shippingAddress).toEqual("");
      expect(await accountListScreen.destination).toEqual("");
      expect(await accountListScreen.shippingStatus).toEqual("");
      // アカウント証ダイレクト出力履歴
      expect(await accountListScreen.outputDate).toEqual("");
      expect(await accountListScreen.outputName).toEqual("");
      expect(await accountListScreen.outputAddress).toEqual("");
      expect(await accountListScreen.outputPerson).toEqual("");

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("一覧へ戻るボタンを押下すると、アカウント検索画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnReturnList();

      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "account/search"
      );
      expect(await accountSearchScreen.title).toEqual("アカウント検索");

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("詳細ボタンを押下すると、アカウント詳細画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnDetail();

      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "account/detail"
      );

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("未発送のID通知書データが削除されること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnShippingDelete();
      await accountListScreen.clickBtnShippingDeleteClose();

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountListScreen.deleteTableShippingDate).toEqual("");

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("再送登録をすると、未発送のID通知書データが作られること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountListScreen.clickBtnReRegist();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnReRegistSave();
      await accountListScreen.clickBtnReRegistClose();

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountListScreen.shippingDate).toEqual("");
      expect(await accountListScreen.missedDate).toEqual("");
      expect(await accountListScreen.shippingName).toEqual("テストデータ0002");
      expect(await accountListScreen.shippingAddress).toEqual(
        "〒150-0045 渋谷区神泉町９－８ビル２Ｆ"
      );
      expect(await accountListScreen.destination).toEqual("顧客直送");
      expect(await accountListScreen.shippingStatus).toEqual("未発送");

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("ダイレクト出力すると、PDFがダウンロードできてダイレクト出力履歴データが作られること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountListScreen.clickBtnDirectOutput();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnDirectOutputSave();
      await accountListScreen.clickBtnDirectOutputClose();
      await driver.navigate().refresh();

      const thisMonthFormatted = moment().format("YYYY-MM-DD");

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountListScreen.addTableDirectOutputDate).toEqual(
        thisMonthFormatted
      );
      expect(await accountListScreen.addTableDirectOutputName).toEqual(
        "テストデータ0002"
      );
      expect(await accountListScreen.addTableDirectOutputAddress).toEqual(
        "〒150-0045 渋谷区神泉町９－８ビル２Ｆ"
      );
      expect(await accountListScreen.addTableDirectOutputPerson).toEqual(
        "システム 管理者(admin)"
      );

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
};
