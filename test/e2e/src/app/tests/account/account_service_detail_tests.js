const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils, Database } = require('lib');
const { LoginScreen, AccountSearchScreen, AccountListScreen, AccountDetailScreen, AccountServiceDetailScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('サービス詳細画面のテスト', () => {
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

    it('画面に表示されている内容が正しいこと', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 検証
      // ****************************
      // UNIS情報
      assert.deepStrictEqual(await accountServiceDetailScreen.firstCustCd, 'admin0001');
      assert.deepStrictEqual(await accountServiceDetailScreen.name, 'テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)');
      assert.deepStrictEqual(await accountServiceDetailScreen.clientStatus, '確定');
      assert.deepStrictEqual(await accountServiceDetailScreen.address, '〒150-0045 渋谷区神泉町９－８ビル１Ｆ');
      assert.deepStrictEqual(await accountServiceDetailScreen.tel, '0120-117-448');
      assert.deepStrictEqual(await accountServiceDetailScreen.branch, '東京統括支店青山(0204140700)');
      assert.deepStrictEqual(await accountServiceDetailScreen.regularStore, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.industry, 'その他　会社関連(001699)');
      assert.deepStrictEqual(await accountServiceDetailScreen.launch, '2014-10-01');
      assert.deepStrictEqual(await accountServiceDetailScreen.close, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.cancell, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.lastUpdate, '2014-11-20 15:21:24');
      // サービス情報
      assert.deepStrictEqual(await accountServiceDetailScreen.serviceName, 'USEN CART');
      assert.deepStrictEqual(await accountServiceDetailScreen.contractNo, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.StatementNo, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.contractStatus, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.billingStartDate, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.endMonth, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.contractItem, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.FixedDate, '');
      assert.deepStrictEqual(await accountServiceDetailScreen.firstTimeDate, '2014-10-01');
      assert.deepStrictEqual(await accountServiceDetailScreen.firstAuthDate, '2015-06-02 11:47:59');
      assert.deepStrictEqual(await accountServiceDetailScreen.endDate, '');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('戻るボタンを押下すると、アカウント詳細画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnReturnDetail();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/detail');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('強制開錠すると、サービスが利用不可から利用可能に更新されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd('admin0009');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnForcedUnlock();
      await accountServiceDetailScreen.clickBtnForcedUnlockSave();
      await accountServiceDetailScreen.clickBtnForcedUnlockClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await accountServiceDetailScreen.serviceEnable, false);

      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery('UPDATE t_unis_service SET status_flag="1" WHERE id = ?', [9]);
    });
    it('休店登録できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();
      await accountServiceDetailScreen.clickBtnAddClosedRegist();

      // ****************************
      // ** 実行
      // ****************************
      var thisMonthFormatted = moment().format("YYYY/MM/DD");
      await accountServiceDetailScreen.inputStopTo(thisMonthFormatted);
      await accountServiceDetailScreen.clickBtnAddClosedRegistSave();
      await accountServiceDetailScreen.clickBtnAddClosedRegistClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await accountServiceDetailScreen.closedStore, '休店');

      // ****************************
      // ** 後始末
      // ****************************
      const sql = `
      DELETE FROM t_service_stop_history
      WHERE t_unis_service_id IN (
        SELECT id
        FROM t_unis_service
        WHERE t_unis_cust_id = (
          SELECT id
          FROM t_unis_cust
          WHERE cust_cd = ?
        )
      )
    `;
      Database.executeQuery(sql, ['admin0001']);
    });
    it('休店解除できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd('000010012');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnAddForcedUnlock();
      await accountServiceDetailScreen.clickBtnUnlockSave();

      // ****************************
      // ** 検証
      // ****************************
      sleep.sleep(2);
      assert.deepStrictEqual(await accountServiceDetailScreen.forceUnlockCompletedMessage, '強制解除しました。');

      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery('UPDATE t_service_stop_history SET release_datetime = NULL WHERE id = ?', [10012]);
    });
    it('強制施錠登録できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();
      await accountServiceDetailScreen.clickBtnAddClosedRegist();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.stopDivision();
      var thisMonthFormatted = moment().format("YYYY/MM/DD");
      await accountServiceDetailScreen.inputStopTo(thisMonthFormatted);
      await accountServiceDetailScreen.clickBtnTable();
      await accountServiceDetailScreen.clickBtnAddClosedRegistSave();
      await accountServiceDetailScreen.clickBtnAddClosedRegistClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await accountServiceDetailScreen.closedStore, '強制施錠');

      // ****************************
      // ** 後始末
      // ****************************
    });
    it('強制施錠解除できること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();
      await accountServiceDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountServiceDetailScreen.clickBtnAddForcedUnlock();
      await accountServiceDetailScreen.clickBtnUnlockSave();
      await accountServiceDetailScreen.clickBtnUnlockClose();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await accountServiceDetailScreen.forcedUnlockDisable, '');

      // ****************************
      // ** 後始末
      // ****************************
      Database.executeQuery('DELETE FROM t_service_stop_history', []);
    });
  });

}