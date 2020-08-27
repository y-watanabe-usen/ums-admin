const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');
const moment = require('moment');

const { Dir, Const, Utils } = require('lib');
const { LoginScreen, AccountSearchScreen, AccountListScreen, AccountDetailScreen } = require('screen');

let driver;

exports.testMain = () => {
  describe('アカウント詳細画面のテスト', () => {
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
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 検証
      // ****************************
      // UNIS情報
      assert.deepEqual(await accountDetailScreen.firstCustCd, 'admin0001');
      assert.deepEqual(await accountDetailScreen.name, 'テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)');
      assert.deepEqual(await accountDetailScreen.clientStatus, '確定');
      assert.deepEqual(await accountDetailScreen.address, '〒150-0045 渋谷区神泉町９－８ビル１Ｆ');
      assert.deepEqual(await accountDetailScreen.tel, '0120-117-448');
      assert.deepEqual(await accountDetailScreen.branch, '東京統括支店青山(0204140700)');
      assert.deepEqual(await accountDetailScreen.industry, 'その他　会社関連(001699)');
      assert.deepEqual(await accountDetailScreen.regularStore, '');
      assert.deepEqual(await accountDetailScreen.launch, '2014-10-01');
      assert.deepEqual(await accountDetailScreen.close, '');
      assert.deepEqual(await accountDetailScreen.cancell, '');
      assert.deepEqual(await accountDetailScreen.lastUpdate, '2014-11-20 15:21:24');
      // アカウント情報
      assert.deepEqual(await accountDetailScreen.accountId, '1');
      assert.deepEqual(await accountDetailScreen.accountStatus, '有効');
      assert.deepEqual(await accountDetailScreen.loginId, 'ir_dev@usen.co.jp');
      assert.deepEqual(await accountDetailScreen.mailAddress, 'a-sakurai@usen.co.jp');
      assert.deepEqual(await accountDetailScreen.umsidStartDate, '2014-10-01');
      assert.deepEqual(await accountDetailScreen.umsidRegistDate, '2014-12-01');
      assert.deepEqual(await accountDetailScreen.umsidLostDate, '');
      // サービス一覧
      // USEN CART
      assert.deepEqual(await accountDetailScreen.usenCartServiceName, 'USEN CART');
      assert.deepEqual(await accountDetailScreen.usenCartServiceContractNo, '');
      assert.deepEqual(await accountDetailScreen.usenCartServiceStatementNo, '');
      assert.deepEqual(await accountDetailScreen.usenCartServiceContractStatus, '');
      assert.deepEqual(await accountDetailScreen.usenCartServiceContractItem, '');
      assert.deepEqual(await accountDetailScreen.usenCartServiceFixedDate, '');
      assert.deepEqual(await accountDetailScreen.usenCartServiceStartDate, '2014-10-01');
      assert.deepEqual(await accountDetailScreen.usenCartServiceFirstTimeDate, '2015-06-02 11:47:59');
      assert.deepEqual(await accountDetailScreen.usenCartServiceEndDate, '');
      assert.deepEqual(await accountDetailScreen.usenCartServiceStatus, '');
      // OTORAKU
      assert.deepEqual(await accountDetailScreen.otorakuServiceName, 'OTORAKU');
      assert.deepEqual(await accountDetailScreen.otorakuServiceContractNo, '1');
      assert.deepEqual(await accountDetailScreen.otorakuServiceStatementNo, '1');
      assert.deepEqual(await accountDetailScreen.otorakuServiceContractStatus, '確定');
      assert.deepEqual(await accountDetailScreen.otorakuServiceContractItem, 'OTORAKU(ICT施策2年)(施工なし)');
      assert.deepEqual(await accountDetailScreen.otorakuServiceFixedDate, '2020-04-08');
      assert.deepEqual(await accountDetailScreen.otorakuServiceStartDate, '2020-04-08');
      assert.deepEqual(await accountDetailScreen.otorakuServiceFirstTimeDate, '');
      assert.deepEqual(await accountDetailScreen.otorakuServiceEndDate, '');
      assert.deepEqual(await accountDetailScreen.otorakuServiceStatus, '');
      // スタシフ
      assert.deepEqual(await accountDetailScreen.stashif1ServiceName, 'スタシフ');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceContractNo, '');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceStatementNo, '1');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceContractStatus, '');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceContractItem, '');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceFixedDate, '');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceStartDate, '2016-04-19');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceFirstTimeDate, '2016-04-19 12:05:18');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceEndDate, '2016-05-08');
      assert.deepEqual(await accountDetailScreen.stashif1ServiceStatus, '');
      // スタシフ
      assert.deepEqual(await accountDetailScreen.stashif2ServiceName, 'スタシフ');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceContractNo, '');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceStatementNo, '2');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceContractStatus, '');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceContractItem, '');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceFixedDate, '');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceStartDate, '2016-05-09');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceFirstTimeDate, '2016-05-12 20:31:53');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceEndDate, '');
      assert.deepEqual(await accountDetailScreen.stashif2ServiceStatus, '');
      // REACH STOCK（飲食店）
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceName, 'REACH STOCK（飲食店）');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceContractNo, '');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceStatementNo, '');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceContractStatus, '');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceContractItem, '');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceFixedDate, '');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceStartDate, '');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceFirstTimeDate, '');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceEndDate, '');
      assert.deepEqual(await accountDetailScreen.reachStockRestaurantServiceStatus, '');
      // REACH STOCK（生産者）
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceName, 'REACH STOCK（生産者）');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceContractNo, '');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceStatementNo, '');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceContractStatus, '');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceContractItem, '');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceFixedDate, '');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceStartDate, '');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceFirstTimeDate, '');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceEndDate, '');
      assert.deepEqual(await accountDetailScreen.reachStockProducerServiceStatus, '');
      // USPOT
      assert.deepEqual(await accountDetailScreen.uspotServiceName, 'USPOT');
      assert.deepEqual(await accountDetailScreen.uspotServiceContractNo, '');
      assert.deepEqual(await accountDetailScreen.uspotServiceStatementNo, '');
      assert.deepEqual(await accountDetailScreen.uspotServiceContractStatus, '');
      assert.deepEqual(await accountDetailScreen.uspotServiceContractItem, '');
      assert.deepEqual(await accountDetailScreen.uspotServiceFixedDate, '');
      assert.deepEqual(await accountDetailScreen.uspotServiceStartDate, '');
      assert.deepEqual(await accountDetailScreen.uspotServiceFirstTimeDate, '');
      assert.deepEqual(await accountDetailScreen.uspotServiceEndDate, '');
      assert.deepEqual(await accountDetailScreen.uspotServiceStatus, '');
      // デンタル・コンシェルジュ
      assert.deepEqual(await accountDetailScreen.conciergeServiceName, 'デンタル・コンシェルジュ');
      assert.deepEqual(await accountDetailScreen.conciergeServiceContractNo, '3');
      assert.deepEqual(await accountDetailScreen.conciergeServiceStatementNo, '3');
      assert.deepEqual(await accountDetailScreen.conciergeServiceContractStatus, '受注');
      assert.deepEqual(await accountDetailScreen.conciergeServiceContractItem, 'デンタル');
      assert.deepEqual(await accountDetailScreen.conciergeServiceFixedDate, '2018-11-15');
      assert.deepEqual(await accountDetailScreen.conciergeServiceStartDate, '2019-04-08');
      assert.deepEqual(await accountDetailScreen.conciergeServiceFirstTimeDate, '');
      assert.deepEqual(await accountDetailScreen.conciergeServiceEndDate, '');
      assert.deepEqual(await accountDetailScreen.conciergeServiceStatus, '');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('戻るボタンを押下すると、アカウント一覧画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('admin0001');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountDetailScreen.clickBtnReturnAccountList();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/account_list');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('メールアドレス変更すると、メールアドレスが更新されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountDetailScreen.clickBtnMailAddressChange();
      await accountDetailScreen.clearMailAddress();
      await accountDetailScreen.inputMailAddress('test@usen.co.jp');
      await accountDetailScreen.clickBtnMailAddressChangeSave();
      await accountDetailScreen.clickBtnMailAddressAlertAccept();
      await driver.navigate().refresh();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await accountDetailScreen.mailAddress, 'test@usen.co.jp');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('サービス詳細ボタンを押下すると、サービス詳細画面に遷移すること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);
      const accountListScreen = new AccountListScreen(driver);
      const accountDetailScreen = new AccountDetailScreen(driver);
      await driver.get(Const.ADMIN_URL);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
      await driver.get(Const.ADMIN_URL + 'account/search');
      await accountSearchScreen.inputCustCd('000000002');
      await accountSearchScreen.clickBtnSearch();
      await accountSearchScreen.clickBtnDetail();
      await accountDetailScreen.clickBtnAccountDetail();

      // ****************************
      // ** 実行
      // ****************************
      await accountDetailScreen.clickBtnServiceDetail();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/detail_account_stop');

      // ****************************
      // ** 後始末
      // ****************************
    });
  });

}

