import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Utils from "@/lib/utils";
import Const from "@/lib/const";

import { LoginScreen, RoleSearchScreen } from "@/screen/index";

let driver: WebDriver;

export const userSearchTests = () => {
  describe("社員別権限検索画面", () => {
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

    test("社員CDを検索条件に指定して検索が出来ること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + "account/search");
      await roleSearchScreen.clickBtnRole();
      // ****************************
      // ** 実行
      // ****************************
      await roleSearchScreen.inputEmployeeCd("iko");
      await roleSearchScreen.clickBtnSearch();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "role/user_search/"
      );
      expect(await roleSearchScreen.firstEmployeeCd).toEqual("iko");
      // ****************************
      // ** 後始末
      // ****************************
    });
    test("検索結果の詳細ボタンを押下すると、社員別権限詳細画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await roleSearchScreen.clickBtnRole();
      await roleSearchScreen.inputEmployeeCd("iko");
      await roleSearchScreen.clickBtnSearch();
      // ****************************
      // ** 実行
      // ****************************
      await roleSearchScreen.clickBtnDetail();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "role/user_detail"
      );
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
};
