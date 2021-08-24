import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Const from "@/lib/const";
import Utils from "@/lib/utils";
import { LoginScreen, AccountSearchScreen } from "@/screen/index";

let driver: WebDriver;

export const accountSearchTests = () => {
  describe("アカウント検索画面のテスト", () => {
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

    test("検索が出来ること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "account/search"
      );
      expect(await accountSearchScreen.firstCustCd).toEqual("admin0001");

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("顧客CDを検索し検索が出来ること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "account/search"
      );
      expect(await accountSearchScreen.firstCustCd).toEqual("000000002");

      // ****************************
      // ** 後始末
      // ****************************
    });
    test("詳細ボタン押下後アカウント一覧画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.clickBtnDetail();

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
  });
};
