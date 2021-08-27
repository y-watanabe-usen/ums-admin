import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Const from "@/lib/const";
import Utils from "@/lib/utils";
import { LoginScreen, LogoutScreen } from "@/screen/index";

let driver: WebDriver;

describe("ログアウトのテスト", () => {
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

  test("ログアウトできること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const logoutScreen = new LogoutScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    // ****************************
    // ** 実行
    // ****************************
    await logoutScreen.clickBtnLogout();
    await logoutScreen.logoutClick();
    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(Const.ADMIN_URL + "login");
    // ****************************
    // ** 後始末
    // ****************************
  });
});
