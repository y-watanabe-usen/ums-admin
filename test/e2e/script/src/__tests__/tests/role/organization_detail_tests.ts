import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Utils from "@/lib/utils";
import Const from "@/lib/const";

import {
  LoginScreen,
  RoleSearchScreen,
  OrganizationSearchScreen,
  OrganizationDetailScreen,
} from "@/screen/index";

let driver: WebDriver;

describe("部署別権限詳細画面", () => {
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
    const organizationSearchScreen = new OrganizationSearchScreen(driver);
    const organizationDetailScreen = new OrganizationDetailScreen(driver);
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
    expect(await organizationDetailScreen.infoOrganizationCd).toEqual(
      "9920830003"
    );
    expect(await organizationDetailScreen.infoOrganizationName).toEqual(
      "(株)U-NEXT（出向）"
    );
    expect(await organizationDetailScreen.updateTargetOrganizationCd).toEqual(
      "9920830003"
    );
    expect(
      await organizationDetailScreen.updateTargetOrganizationName
    ).toEqual("(株)U-NEXT（出向）");
    // ****************************
    // ** 後始末
    // ****************************
  });
  test("検索へ戻るボタンを押下すると、部署別権限検索画面に遷移すること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const roleSearchScreen = new RoleSearchScreen(driver);
    const organizationSearchScreen = new OrganizationSearchScreen(driver);
    const organizationDetailScreen = new OrganizationDetailScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await driver.get(Const.ADMIN_URL + "account/search");
    await roleSearchScreen.clickBtnRole();
    await organizationSearchScreen.clickRoleMenuOrganizationSearch();
    await organizationSearchScreen.inputOrganizationCd("9920830003");
    await organizationSearchScreen.clickBtnSearch();
    await organizationSearchScreen.clickBtnDetail();
    // ****************************
    // ** 実行
    // ****************************
    await organizationDetailScreen.clickBtnBackSearch();
    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "role/organization_search"
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
    const organizationSearchScreen = new OrganizationSearchScreen(driver);
    const organizationDetailScreen = new OrganizationDetailScreen(driver);
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();
    await driver.get(Const.ADMIN_URL + "account/search");
    await roleSearchScreen.clickBtnRole();
    await organizationSearchScreen.clickRoleMenuOrganizationSearch();
    await organizationSearchScreen.inputOrganizationCd("9920830003");
    await organizationSearchScreen.clickBtnSearch();
    await organizationSearchScreen.clickBtnDetail();
    // ****************************
    // ** 実行
    // ****************************
    await organizationDetailScreen.clickBtnEnable();
    await organizationDetailScreen.clickBtnEdit();
    await organizationDetailScreen.clickBtnSave();
    await Utils.sleep(1);
    // ****************************
    // ** 検証
    // ****************************
    expect(await organizationDetailScreen.updateCompleted).toEqual(
      "更新しました。"
    );
    // ****************************
    // ** 後始末
    // ****************************
    await Utils.sleep(1);
    await organizationDetailScreen.clickBtnClose();
    await organizationDetailScreen.clickBtnDisable();
    await organizationDetailScreen.clickBtnEdit();
    await organizationDetailScreen.clickBtnSave();
    await Utils.sleep(1);
    await organizationDetailScreen.clickBtnClose();
  });
});