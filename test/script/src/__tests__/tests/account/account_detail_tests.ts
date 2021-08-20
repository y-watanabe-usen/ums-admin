import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Const from "@/lib/const";
import Utils from "@/lib/utils";
import {
  LoginScreen,
  AccountSearchScreen,
  AccountDetailScreen,
} from "@/screen/index";

let driver: WebDriver;

export const accountDetailTests = () => {
  describe("アカウント詳細画面のテスト", () => {
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
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("admin0001");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 検証
      // ****************************
      // UNIS情報
      expect(await accountDetailScreen.firstCustCd).toEqual("admin0001");
      expect(await accountDetailScreen.name).toEqual(
        "テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)"
      );
      expect(await accountDetailScreen.clientStatus).toEqual("確定");
      expect(await accountDetailScreen.address).toEqual(
        "〒150-0045 渋谷区神泉町９－８ビル１Ｆ"
      );
      expect(await accountDetailScreen.tel).toEqual("0120-117-448");
      expect(await accountDetailScreen.branch).toEqual(
        "東京統括支店青山(0204140700)"
      );
      expect(await accountDetailScreen.industry).toEqual(
        "その他　会社関連(001699)"
      );
      expect(await accountDetailScreen.regularStore).toEqual("");
      expect(await accountDetailScreen.launch).toEqual("2014-10-01");
      expect(await accountDetailScreen.close).toEqual("");
      expect(await accountDetailScreen.cancell).toEqual("");
      expect(await accountDetailScreen.lastUpdate).toEqual(
        "2014-11-20 15:21:24"
      );
      // アカウント情報
      expect(await accountDetailScreen.accountId).toEqual("1");
      expect(await accountDetailScreen.accountStatus).toEqual("有効");
      expect(await accountDetailScreen.loginId).toEqual("ir_dev@usen.co.jp");
      expect(await accountDetailScreen.mailAddress).toEqual(
        "a-sakurai@usen.co.jp"
      );
      expect(await accountDetailScreen.umsidStartDate).toEqual("2014-10-01");
      expect(await accountDetailScreen.umsidRegistDate).toEqual("2014-12-01");
      expect(await accountDetailScreen.umsidLostDate).toEqual("");
      // サービス一覧
      // USEN CART
      expect(await accountDetailScreen.usenCartServiceName).toEqual(
        "USEN CART"
      );
      expect(await accountDetailScreen.usenCartServiceContractNo).toEqual("");
      expect(await accountDetailScreen.usenCartServiceStatementNo).toEqual("");
      expect(await accountDetailScreen.usenCartServiceContractStatus).toEqual(
        ""
      );
      expect(await accountDetailScreen.usenCartServiceContractItem).toEqual("");
      expect(await accountDetailScreen.usenCartServiceFixedDate).toEqual("");
      expect(await accountDetailScreen.usenCartServiceStartDate).toEqual(
        "2014-10-01"
      );
      expect(await accountDetailScreen.usenCartServiceFirstTimeDate).toEqual(
        "2015-06-02 11:47:59"
      );
      expect(await accountDetailScreen.usenCartServiceEndDate).toEqual("");
      expect(await accountDetailScreen.usenCartServiceStatus).toEqual("");
      // OTORAKU
      expect(await accountDetailScreen.otorakuServiceName).toEqual("OTORAKU");
      expect(await accountDetailScreen.otorakuServiceContractNo).toEqual("1");
      expect(await accountDetailScreen.otorakuServiceStatementNo).toEqual("1");
      expect(await accountDetailScreen.otorakuServiceContractStatus).toEqual(
        "確定"
      );
      expect(await accountDetailScreen.otorakuServiceContractItem).toEqual(
        "OTORAKU(ICT施策2年)(施工なし)"
      );
      expect(await accountDetailScreen.otorakuServiceFixedDate).toEqual(
        "2020-04-08"
      );
      expect(await accountDetailScreen.otorakuServiceStartDate).toEqual(
        "2020-04-08"
      );
      expect(await accountDetailScreen.otorakuServiceFirstTimeDate).toEqual("");
      expect(await accountDetailScreen.otorakuServiceEndDate).toEqual("");
      expect(await accountDetailScreen.otorakuServiceStatus).toEqual("");
      // スタシフ
      expect(await accountDetailScreen.stashif1ServiceName).toEqual("スタシフ");
      expect(await accountDetailScreen.stashif1ServiceContractNo).toEqual("");
      expect(await accountDetailScreen.stashif1ServiceStatementNo).toEqual("1");
      expect(await accountDetailScreen.stashif1ServiceContractStatus).toEqual(
        ""
      );
      expect(await accountDetailScreen.stashif1ServiceContractItem).toEqual("");
      expect(await accountDetailScreen.stashif1ServiceFixedDate).toEqual("");
      expect(await accountDetailScreen.stashif1ServiceStartDate).toEqual(
        "2016-04-19"
      );
      expect(await accountDetailScreen.stashif1ServiceFirstTimeDate).toEqual(
        "2016-04-19 12:05:18"
      );
      expect(await accountDetailScreen.stashif1ServiceEndDate).toEqual(
        "2016-05-08"
      );
      expect(await accountDetailScreen.stashif1ServiceStatus).toEqual("");
      // スタシフ
      expect(await accountDetailScreen.stashif2ServiceName).toEqual("スタシフ");
      expect(await accountDetailScreen.stashif2ServiceContractNo).toEqual("");
      expect(await accountDetailScreen.stashif2ServiceStatementNo).toEqual("2");
      expect(await accountDetailScreen.stashif2ServiceContractStatus).toEqual(
        ""
      );
      expect(await accountDetailScreen.stashif2ServiceContractItem).toEqual("");
      expect(await accountDetailScreen.stashif2ServiceFixedDate).toEqual("");
      expect(await accountDetailScreen.stashif2ServiceStartDate).toEqual(
        "2016-05-09"
      );
      expect(await accountDetailScreen.stashif2ServiceFirstTimeDate).toEqual(
        "2016-05-12 20:31:53"
      );
      expect(await accountDetailScreen.stashif2ServiceEndDate).toEqual("");
      expect(await accountDetailScreen.stashif2ServiceStatus).toEqual("");
      // REACH STOCK（飲食店）
      expect(await accountDetailScreen.reachStockRestaurantServiceName).toEqual(
        "REACH STOCK（飲食店）"
      );
      expect(
        await accountDetailScreen.reachStockRestaurantServiceContractNo
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockRestaurantServiceStatementNo
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockRestaurantServiceContractStatus
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockRestaurantServiceContractItem
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockRestaurantServiceFixedDate
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockRestaurantServiceStartDate
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockRestaurantServiceFirstTimeDate
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockRestaurantServiceEndDate
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockRestaurantServiceStatus
      ).toEqual("");
      // REACH STOCK（生産者）
      expect(await accountDetailScreen.reachStockProducerServiceName).toEqual(
        "REACH STOCK（生産者）"
      );
      expect(
        await accountDetailScreen.reachStockProducerServiceContractNo
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockProducerServiceStatementNo
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockProducerServiceContractStatus
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockProducerServiceContractItem
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockProducerServiceFixedDate
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockProducerServiceStartDate
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockProducerServiceFirstTimeDate
      ).toEqual("");
      expect(
        await accountDetailScreen.reachStockProducerServiceEndDate
      ).toEqual("");
      expect(await accountDetailScreen.reachStockProducerServiceStatus).toEqual(
        ""
      );
      // USPOT
      expect(await accountDetailScreen.uspotServiceName).toEqual("USPOT");
      expect(await accountDetailScreen.uspotServiceContractNo).toEqual("");
      expect(await accountDetailScreen.uspotServiceStatementNo).toEqual("");
      expect(await accountDetailScreen.uspotServiceContractStatus).toEqual("");
      expect(await accountDetailScreen.uspotServiceContractItem).toEqual("");
      expect(await accountDetailScreen.uspotServiceFixedDate).toEqual("");
      expect(await accountDetailScreen.uspotServiceStartDate).toEqual("");
      expect(await accountDetailScreen.uspotServiceFirstTimeDate).toEqual("");
      expect(await accountDetailScreen.uspotServiceEndDate).toEqual("");
      expect(await accountDetailScreen.uspotServiceStatus).toEqual("");
      // デンタル・コンシェルジュ
      expect(await accountDetailScreen.conciergeServiceName).toEqual(
        "デンタル・コンシェルジュ"
      );
      expect(await accountDetailScreen.conciergeServiceContractNo).toEqual("3");
      expect(await accountDetailScreen.conciergeServiceStatementNo).toEqual(
        "3"
      );
      expect(await accountDetailScreen.conciergeServiceContractStatus).toEqual(
        "受注"
      );
      expect(await accountDetailScreen.conciergeServiceContractItem).toEqual(
        "デンタル"
      );
      expect(await accountDetailScreen.conciergeServiceFixedDate).toEqual(
        "2018-11-15"
      );
      expect(await accountDetailScreen.conciergeServiceStartDate).toEqual(
        "2019-04-08"
      );
      expect(await accountDetailScreen.conciergeServiceFirstTimeDate).toEqual(
        ""
      );
      expect(await accountDetailScreen.conciergeServiceEndDate).toEqual("");
      expect(await accountDetailScreen.conciergeServiceStatus).toEqual("");

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("戻るボタンを押下すると、アカウント一覧画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
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
      await accountDetailScreen.clickBtnReturnAccountList();

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

    test("メールアドレス変更すると、メールアドレスが更新されること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountDetailScreen.clickBtnMailAddressChange();
      await accountDetailScreen.clearMailAddress();
      await accountDetailScreen.inputMailAddress("test@usen.co.jp");
      await accountDetailScreen.clickBtnMailAddressChangeSave();
      await accountDetailScreen.clickBtnMailAddressAlertAccept();
      await driver.navigate().refresh();

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountDetailScreen.mailAddress).toEqual("test@usen.co.jp");

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("初期パスワード確認ボタンを押下すると初期パスワードが表示され、変更済のメッセージが表示されること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
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
      await accountDetailScreen.clickBtnInitPassword();

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountDetailScreen.initPassword).toEqual("tmFcg5kP");
      expect(await accountDetailScreen.initPasswordMessage).toEqual(
        "初期パスワードから変更されています。"
      );

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("初期パスワード確認ボタンを押下すると初期パスワードが表示され、未変更のメッセージが表示されること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000016");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountDetailScreen.clickBtnInitPassword();

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountDetailScreen.initPassword).toEqual("GvsLPKD2");
      expect(await accountDetailScreen.initPasswordMessage).toEqual(
        "初期パスワードのまま変更されていません。"
      );

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("初期パスワード確認ボタンが表示されないこと", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("iko");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000016");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************

      // ****************************
      // ** 検証
      // ****************************
      expect(await accountDetailScreen.initPasswordDisplay).toEqual([]);

      // ****************************
      // ** 後始末
      // ****************************
    });

    test("サービス詳細ボタンを押下すると、サービス詳細画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd("000000002");
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "account/detail_account_stop"
      );

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
};
