import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";
import Utils from "@/lib/utils";

import { LoginScreen, BulkScreen } from "@/screen/index";

let driver: WebDriver;

export const bulkServiceTests = () => {
  describe("サービス一括強制施錠／開錠画面のテスト", () => {
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

    test(" CSVファイルがアップロードできること", async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const bulkScreen = new BulkScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode("admin");
      await loginScreen.inputPassword("!QAZ2wsx");
      await loginScreen.clickBtnLogin();
      await bulkScreen.clickBtnBulk();
      await bulkScreen.clickBtnFile("/bulk/bulk_service_upload_test.csv");
      await bulkScreen.clickBtnBulkServiceUpload();

      // ****************************
      // ** 実行
      // ****************************
      await bulkScreen.clickBtnBulkServiceUploadSave();
      await bulkScreen.clickBtnBulkUploadAlertAccept();
      await Utils.sleep(1);
      await bulkScreen.clickBtnBulkUploadAlertClose();

      // ****************************
      // ** 検証
      // ****************************
      expect(await bulkScreen.valkCustCd).toEqual("000000004");
      expect(await bulkScreen.valkUpdateStatus).toEqual("開錠");

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
};
