const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, AccountSearchScreen, AccountListScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('アカウント一覧画面のテスト', () => {
    before(async () => {
      let usingServer = await Utils.buildUsingServer();
      let capabilities = await Utils.buildCapabilities();
      driver = await new Builder()
        .usingServer(usingServer)
        .withCapabilities(capabilities)
        .build();

      driver.setFileDetector(new remote.FileDetector()); // ファイル検知モジュール

      process.on('unhandledRejection', console.dir);
    });

    beforeEach(async () => {
      await driver.manage().deleteAllCookies();
      execSync(`rm -rf ${Const.DOWNLOAD_PATH}/*`);
    });

    after(() => {
      return driver.quit();
    });

    it(' 画面に表示されている内容が正しいこと', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();

      // ****************************
      // ** 実行
      // ****************************
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 検証
      // ****************************
      // UNIS情報
      assert.deepEqual(await accountListScreen.firstCustCd, 'admin0001');
      assert.deepEqual(await accountListScreen.name, 'テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)');
      assert.deepEqual(await accountListScreen.clientStatus, '確定');
      assert.deepEqual(await accountListScreen.address, '〒150-0045 渋谷区神泉町９－８ビル１Ｆ');
      assert.deepEqual(await accountListScreen.tel, '0120-117-448');
      assert.deepEqual(await accountListScreen.branch, '東京統括支店青山(0204140700)');
      assert.deepEqual(await accountListScreen.regularStore, '');
      assert.deepEqual(await accountListScreen.industry, 'その他　会社関連(001699)');
      assert.deepEqual(await accountListScreen.launch, '2014-10-01');
      assert.deepEqual(await accountListScreen.close, '');
      assert.deepEqual(await accountListScreen.cancell, '');
      assert.deepEqual(await accountListScreen.lastUpdate, '2014-11-20 15:21:24');
      // アカウント一覧
      assert.deepEqual(await accountListScreen.accountId, '1');
      assert.deepEqual(await accountListScreen.accountStatus, '有効');
      assert.deepEqual(await accountListScreen.loginId, 'ir_dev@usen.co.jp');
      assert.deepEqual(await accountListScreen.mailAddress, 'a-sakurai@usen.co.jp');
      assert.deepEqual(await accountListScreen.umsidStartDate, '2014-10-01');
      assert.deepEqual(await accountListScreen.umsidRegistDate, '2014-12-01');
      assert.deepEqual(await accountListScreen.umsidLostDate, '');
      assert.deepEqual(await accountListScreen.availability, '✔');
      // アカウント証発送情報
      assert.deepEqual(await accountListScreen.shippingDate, '');
      assert.deepEqual(await accountListScreen.missedDate, '');
      assert.deepEqual(await accountListScreen.shippingName, '');
      assert.deepEqual(await accountListScreen.shippingAddress, '');
      assert.deepEqual(await accountListScreen.destination, '');
      assert.deepEqual(await accountListScreen.shippingStatus, '');
      // アカウント証ダイレクト出力履歴
      assert.deepEqual(await accountListScreen.outputDate, '');
      assert.deepEqual(await accountListScreen.outputName, '');
      assert.deepEqual(await accountListScreen.outputAddress, '');
      assert.deepEqual(await accountListScreen.outputPerson, '');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('一覧へ戻るボタンを押下すると、アカウント検索画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnReturnList();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/search');
      assert.deepEqual(await accountSearchScreen.title, 'アカウント検索');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('詳細ボタンを押下すると、アカウント詳細画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnDetail();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/detail');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('未発送のID通知書データが削除されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnShippingDelete();
      await accountListScreen.clickBtnShippingDeleteClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountListScreen.deleteTableShippingDate, '');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('再送登録をすると、未発送のID通知書データが作られること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountListScreen.clickBtnReRegist();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnReRegistSave();
      await accountListScreen.clickBtnReRegistClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountListScreen.shippingDate, '');
      assert.deepEqual(await accountListScreen.missedDate, '');
      assert.deepEqual(await accountListScreen.shippingName, 'テストデータ0002');
      assert.deepEqual(await accountListScreen.shippingAddress, '〒150-0045 渋谷区神泉町９－８ビル２Ｆ');
      assert.deepEqual(await accountListScreen.destination, '顧客直送');
      assert.deepEqual(await accountListScreen.shippingStatus, '未発送');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('ダイレクト出力すると、PDFがダウンロードできてダイレクト出力履歴データが作られること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountListScreen.clickBtnDirectOutput();

      // ****************************
      // ** 実行
      // ****************************
      await accountListScreen.clickBtnDirectOutputSave();
      await accountListScreen.clickBtnDirectOutputClose();
      await driver.navigate().refresh();

      var thisMonthFormatted = moment().format('YYYY-MM-DD');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountListScreen.addTableDirectOutputDate, thisMonthFormatted);
      assert.deepEqual(await accountListScreen.addTableDirectOutputName, 'テストデータ0002');
      assert.deepEqual(await accountListScreen.addTableDirectOutputAddress, '〒150-0045 渋谷区神泉町９－８ビル２Ｆ');
      assert.deepEqual(await accountListScreen.addTableDirectOutputPerson, 'システム 管理者(admin)');

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
}

