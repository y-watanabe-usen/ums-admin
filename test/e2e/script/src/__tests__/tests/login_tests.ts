import { Builder, WebDriver } from "selenium-webdriver";
import remote from "selenium-webdriver/remote";

import Const from "@/lib/const";
import Utils from "@/lib/utils";
import { LoginScreen, AccountSearchScreen } from "@/screen/index";

let driver: WebDriver;

describe("ログインのテスト", () => {
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

  test("サイトトップにアクセスしてログイン画面が表示されること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);

    // ****************************
    // ** 実行
    // ****************************
    await loginScreen.access();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(Const.ADMIN_URL);
    expect(await loginScreen.code).toEqual("");
    expect(await loginScreen.password).toEqual("");

    // ****************************
    // ** 後始末
    // ****************************
  });
  test("社員番号が間違っている場合はログイン出来ないこと", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);

    // ****************************
    // ** 実行
    // ****************************
    await loginScreen.access();
    await loginScreen.inputCode("adminaaa");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(Const.ADMIN_URL + "login");
    expect(await loginScreen.alert).toEqual(
      "ログインID、またはパスワードに誤りがあります。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });
  test("パスワードが間違っている場合はログイン出来ないこと", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);

    // ****************************
    // ** 実行
    // ****************************
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsxa");
    await loginScreen.clickBtnLogin();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(Const.ADMIN_URL + "login");
    expect(await loginScreen.alert).toEqual(
      "ログインID、またはパスワードに誤りがあります。"
    );

    // ****************************
    // ** 後始末
    // ****************************
  });
  test("未ログイン状態でアクセスした場合、ログイン画面にリダイレクトされること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    // const loginScreen = new LoginScreen(driver);

    // ****************************
    // ** 実行
    // ****************************
    await driver.get(Const.ADMIN_URL + "account/search");

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(Const.ADMIN_URL + "login/");

    // ****************************
    // ** 後始末
    // ****************************
  });
  test("社員番号とパスワードが合っている場合はログイン出来ること", async () => {
    // ****************************
    // ** 準備
    // ****************************
    const loginScreen = new LoginScreen(driver);
    const accountSearchScreen = new AccountSearchScreen(driver);

    // ****************************
    // ** 実行
    // ****************************
    await loginScreen.access();
    await loginScreen.inputCode("admin");
    await loginScreen.inputPassword("!QAZ2wsx");
    await loginScreen.clickBtnLogin();

    // ****************************
    // ** 検証
    // ****************************
    expect(await driver.getCurrentUrl()).toEqual(
      Const.ADMIN_URL + "account/search"
    );
    expect(await accountSearchScreen.title).toEqual("アカウント検索");

    // ****************************
    // ** 後始末
    // ****************************
  });
});
