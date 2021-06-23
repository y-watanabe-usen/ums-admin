import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Utils from "@/lib/utils";
import Const from "@/lib/const";

import {
  LoginScreen,
  RoleSearchScreen,
  OrganizationSearchScreen,
} from "@/screen/index";

let driver: WebDriver;

export const organizationSearchTests = () => {
  describe("部署別権限検索画面", () => {
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

    test("部署CDを検索条件に指定して検索が出来ること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const organizationSearchScreen = new OrganizationSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + "account/search");
      await roleSearchScreen.clickBtnRole();
      await organizationSearchScreen.clickRoleMenuOrganizationSearch();
      // ****************************
      // ** 実行
      // ****************************
      await organizationSearchScreen.inputOrganizationCd("9920830003");
      await organizationSearchScreen.clickBtnSearch();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "role/organization_search/"
      );
      expect(await organizationSearchScreen.firstOrganizationCd).toEqual(
        "9920830003"
      );
      // ****************************
      // ** 後始末
      // ****************************
    });
    test("検索結果の詳細ボタンを押下すると、部署別権限詳細画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const organizationSearchScreen = new OrganizationSearchScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + "account/search");
      await roleSearchScreen.clickBtnRole();
      await organizationSearchScreen.clickRoleMenuOrganizationSearch();
      await organizationSearchScreen.inputOrganizationCd("9920830003");
      await organizationSearchScreen.clickBtnSearch();
      // ****************************
      // ** 実行
      // ****************************
      await organizationSearchScreen.clickBtnDetail();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "role/organization_detail"
      );
      // ****************************
      // ** 後始末
      // ****************************
    });
  });
};
