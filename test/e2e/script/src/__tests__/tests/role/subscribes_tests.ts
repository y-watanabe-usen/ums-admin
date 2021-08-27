import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Utils from "@/lib/utils";
import Const from "@/lib/const";

import {
  LoginScreen,
  RoleSearchScreen,
  SubscribesScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("DRAGONマスタ連携処理画面", () => {
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

  test("DRAGONマスタ連携処理が実行できること（部署マスタ一括配信&ユーザマスタ一括配信）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const roleSearchScreen = new RoleSearchScreen(driver);
    const subscribesScreen = new SubscribesScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await driver.get(Const.ADMIN_URL + "account/search");
    await roleSearchScreen.clickBtnRole();
    await subscribesScreen.clickBtnRoleMenuSubscribes();
    // ****************************
    // ** 実行
    // ****************************
    await subscribesScreen.clickExecute();
    await subscribesScreen.clickBtnSave();
    await Utils.sleep(1);
    // ****************************
    // ** 検証
    // ****************************
    expect(await subscribesScreen.exectionCompleted).toEqual(
      "完了しました。"
    );
    // ****************************
    // ** 後始末
    // ****************************
  });
  test("DRAGONマスタ連携処理が実行できること（部署マスタ一括配信）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const roleSearchScreen = new RoleSearchScreen(driver);
    const subscribesScreen = new SubscribesScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await driver.get(Const.ADMIN_URL + "account/search");
    await roleSearchScreen.clickBtnRole();
    await subscribesScreen.clickBtnRoleMenuSubscribes();
    // ****************************
    // ** 実行
    // ****************************
    await subscribesScreen.chooseRadioBtnOrganizationMaster();
    await subscribesScreen.clickExecute();
    await subscribesScreen.clickBtnSave();
    await Utils.sleep(1);
    // ****************************
    // ** 検証
    // ****************************
    expect(await subscribesScreen.exectionCompleted).toEqual(
      "完了しました。"
    );
    // ****************************
    // ** 後始末
    // ****************************
  });
  test("DRAGONマスタ連携処理が実行できること（ユーザマスタ一括配信）", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const roleSearchScreen = new RoleSearchScreen(driver);
    const subscribesScreen = new SubscribesScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await driver.get(Const.ADMIN_URL + "account/search");
    await roleSearchScreen.clickBtnRole();
    await subscribesScreen.clickBtnRoleMenuSubscribes();
    // ****************************
    // ** 実行
    // ****************************
    await subscribesScreen.chooseRadioBtnUserMaster();
    await subscribesScreen.clickExecute();
    await subscribesScreen.clickBtnSave();
    await Utils.sleep(1);
    // ****************************
    // ** 検証
    // ****************************
    expect(await subscribesScreen.exectionCompleted).toEqual(
      "完了しました。"
    );
    // ****************************
    // ** 後始末
    // ****************************
  });
});