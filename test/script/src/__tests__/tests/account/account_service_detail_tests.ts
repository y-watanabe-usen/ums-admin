import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import moment from "moment";

import Const from "@/lib/const";
import Utils from "@/lib/utils";
import Database from "@/lib/database";
import {
  LoginScreen,
  AccountSearchScreen,
  AccountDetailScreen,
  AccountServiceDetailScreen,
} from "@/screen/index";

let driver: WebDriver;

export const accountServiceDetailTests = () => {
  describe("サービス詳細画面のテスト", () => {
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
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("admin0001");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 検証
      // ****************************
      // UNIS情報
      expect(await accountServiceDetailScreen.firstCustCd).toEqual("admin0001");
      expect(await accountServiceDetailScreen.name).toEqual(
        "テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)"
      );
      expect(await accountServiceDetailScreen.clientStatus).toEqual("確定");
      expect(await accountServiceDetailScreen.address).toEqual(
        "〒150-0045 渋谷区神泉町９－８ビル１Ｆ"
      );
      expect(await accountServiceDetailScreen.tel).toEqual("0120-117-448");
      expect(await accountServiceDetailScreen.branch).toEqual(
        "東京統括支店青山(0204140700)"
      );
      expect(await accountServiceDetailScreen.regularStore).toEqual("");
      expect(await accountServiceDetailScreen.industry).toEqual(
        "その他　会社関連(001699)"
      );
      expect(await accountServiceDetailScreen.launch).toEqual("2014-10-01");
      expect(await accountServiceDetailScreen.close).toEqual("");
      expect(await accountServiceDetailScreen.cancel).toEqual("");
      expect(await accountServiceDetailScreen.lastUpdate).toEqual(
        "2014-11-20 15:21:24"
      );
      // サービス情報
      expect(await accountServiceDetailScreen.serviceName).toEqual("USEN CART");
      expect(await accountServiceDetailScreen.contractNo).toEqual("");
      expect(await accountServiceDetailScreen.StatementNo).toEqual("");
      expect(await accountServiceDetailScreen.contractStatus).toEqual("");
      expect(await accountServiceDetailScreen.billingStartDate).toEqual("");
      expect(await accountServiceDetailScreen.endMonth).toEqual("");
      expect(await accountServiceDetailScreen.contractItem).toEqual("");
      expect(await accountServiceDetailScreen.fixedDate).toEqual("");
      expect(await accountServiceDetailScreen.firstTimeDate).toEqual(
        "2014-10-01"
      );
      expect(await accountServiceDetailScreen.firstAuthDate).toEqual(
        "2015-06-02 11:47:59"
      );
      expect(await accountServiceDetailScreen.endDate).toEqual("");

      // ****************************
      // ** 後始末
      // ****************************
    });
    test("戻るボタンを押下すると、アカウント詳細画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("admin0001");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnReturnDetail();

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
    test("強制開錠すると、サービスが利用不可から利用可能に更新されること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("admin0009");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnForcedUnlock();
      await accountServiceDetailScreen.clickBtnForcedUnlockSave();
      await accountServiceDetailScreen.clickBtnForcedUnlockClose();

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountServiceDetailScreen.serviceEnable).toEqual(false);

      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery(
        'UPDATE t_unis_service SET status_flag="1" WHERE id = ?',
        [9]
      );
    });
    test("休店登録できること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("admin0001");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();
      await accountServiceDetailScreen.clickBtnAddClosedRegist();

      // ****************************
      // ** 実行
      // ****************************
      const thisMonthFormatted = moment().format("YYYY/MM/DD");
      await accountServiceDetailScreen.inputStopTo(thisMonthFormatted);
      await accountServiceDetailScreen.clickBtnAddClosedRegistSave();
      await accountServiceDetailScreen.clickBtnAddClosedRegistClose();

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountServiceDetailScreen.closedStore).toEqual("休店");

      // ****************************
      // ** 後始末
      // ****************************
      const sql = `
      DELETE FROM t_service_stop_history
      WHERE t_unis_service_id IN (
        SELECT id
        FROM t_unis_service
        WHERE t_unis_cust_id = (
          SELECT id
          FROM t_unis_cust
          WHERE cust_cd = ?
        )
      )
    `;
      Database.executeQuery(sql, ["admin0001"]);
    });
    test("休店解除できること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000010012");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnAddForcedUnlock();
      await accountServiceDetailScreen.clickBtnUnlockSave();

      // ****************************
      // ** 検証
      // ****************************
      await Utils.sleep(2);
      expect(
        await accountServiceDetailScreen.forceUnlockCompletedMessage
      ).toEqual("強制解除しました。");

      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery(
        "UPDATE t_service_stop_history SET release_datetime = NULL WHERE id = ?",
        [10012]
      );
    });
    test("強制施錠登録できること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("admin0001");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();
      await accountServiceDetailScreen.clickBtnAddClosedRegist();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.stopDivision();
      const thisMonthFormatted = moment().format("YYYY/MM/DD");
      await accountServiceDetailScreen.inputStopTo(thisMonthFormatted);
      await accountServiceDetailScreen.clickBtnTable();
      await accountServiceDetailScreen.clickBtnAddClosedRegistSave();
      await accountServiceDetailScreen.clickBtnAddClosedRegistClose();

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountServiceDetailScreen.closedStore).toEqual("強制施錠");

      // ****************************
      // ** 後始末
      // ****************************
    });
    // skip: 「休店解除できること」と同様の手順なためskip
    test.skip("強制施錠解除できること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("admin0003");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnAddForcedUnlock();
      await accountServiceDetailScreen.clickBtnUnlockSave();

      // ****************************
      // ** 検証
      // ****************************
      await Utils.sleep(2);
      expect(
        await accountServiceDetailScreen.forceUnlockCompletedMessage
      ).toEqual("強制解除しました。");

      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery(
        "UPDATE t_service_stop_history SET release_datetime = NULL WHERE id = ?",
        [3]
      );
    });
  });
};
