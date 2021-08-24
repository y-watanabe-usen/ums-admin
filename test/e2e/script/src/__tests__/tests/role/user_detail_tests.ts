import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Utils from "@/lib/utils";
import Const from "@/lib/const";

import {
  LoginScreen,
  RoleSearchScreen,
  RoleUserDetailScreen,
} from "@/screen/index";

let driver: WebDriver;

export const userDetailTests = () => {
  describe("社員別権限詳細画面", () => {
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
      const roleSearchScreen = new RoleSearchScreen(driver);
      const roleUserDetailScreen = new RoleUserDetailScreen(driver);
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
      expect(await roleUserDetailScreen.employeeCd).toEqual("iko");
      expect(await roleUserDetailScreen.department).toEqual("不明");
      expect(await roleUserDetailScreen.employeeName).toEqual(
        "システム 移行ユーザ"
      );
      // ****************************
      // ** 後始末
      // ****************************
    });
    test("検索へ戻るボタンを押下すると、社員別権限検索画面に遷移すること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const roleUserDetailScreen = new RoleUserDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await roleSearchScreen.clickBtnRole();
      await roleSearchScreen.inputEmployeeCd("iko");
      await roleSearchScreen.clickBtnSearch();
      await roleSearchScreen.clickBtnDetail();
      // ****************************
      // ** 実行
      // ****************************
      await roleUserDetailScreen.clickBtnBackSearch();
      // ****************************
      // ** 検証
      // ****************************
      expect(await driver.getCurrentUrl()).toEqual(
        Const.ADMIN_URL + "role/user_search"
      );
      // ****************************
      // ** 後始末
      // ****************************
    });
    test("保存ボタンを押下すると、権限が更新されること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const roleSearchScreen = new RoleSearchScreen(driver);
      const roleUserDetailScreen = new RoleUserDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await roleSearchScreen.clickBtnRole();
      await roleSearchScreen.inputEmployeeCd("iko");
      await roleSearchScreen.clickBtnSearch();
      await roleSearchScreen.clickBtnDetail();
      // ****************************
      // ** 実行
      // ****************************
      await roleUserDetailScreen.clickBtnEnable();
      await roleUserDetailScreen.clickBtnEdit();
      await roleUserDetailScreen.clickBtnSave();
      await Utils.sleep(1);
      // ****************************
      // ** 検証
      // ****************************
      expect(await roleUserDetailScreen.updateCompleted).toEqual(
        "更新しました。"
      );
      // ****************************
      // ** 後始末
      // ****************************
      await Utils.sleep(1);
      await roleUserDetailScreen.clickBtnClose();
      await roleUserDetailScreen.clickBtnDisable();
      await roleUserDetailScreen.clickBtnEdit();
      await roleUserDetailScreen.clickBtnSave();
      await Utils.sleep(1);
      await roleUserDetailScreen.clickBtnClose();
    });
  });
};
