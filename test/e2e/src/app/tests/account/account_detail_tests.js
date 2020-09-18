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
      const accountDetailScreen = new AccountDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
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
      assert.deepStrictEqual(await accountDetailScreen.firstCustCd, 'admin0001');
      assert.deepStrictEqual(await accountDetailScreen.name, 'テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)');
      assert.deepStrictEqual(await accountDetailScreen.clientStatus, '確定');
      assert.deepStrictEqual(await accountDetailScreen.address, '〒150-0045 渋谷区神泉町９－８ビル１Ｆ');
      assert.deepStrictEqual(await accountDetailScreen.tel, '0120-117-448');
      assert.deepStrictEqual(await accountDetailScreen.branch, '東京統括支店青山(0204140700)');
      assert.deepStrictEqual(await accountDetailScreen.industry, 'その他　会社関連(001699)');
      assert.deepStrictEqual(await accountDetailScreen.regularStore, '');
      assert.deepStrictEqual(await accountDetailScreen.launch, '2014-10-01');
      assert.deepStrictEqual(await accountDetailScreen.close, '');
      assert.deepStrictEqual(await accountDetailScreen.cancell, '');
      assert.deepStrictEqual(await accountDetailScreen.lastUpdate, '2014-11-20 15:21:24');
      // アカウント情報
      assert.deepStrictEqual(await accountDetailScreen.accountId, '1');
      assert.deepStrictEqual(await accountDetailScreen.accountStatus, '有効');
      assert.deepStrictEqual(await accountDetailScreen.loginId, 'ir_dev@usen.co.jp');
      assert.deepStrictEqual(await accountDetailScreen.mailAddress, 'a-sakurai@usen.co.jp');
      assert.deepStrictEqual(await accountDetailScreen.umsidStartDate, '2014-10-01');
      assert.deepStrictEqual(await accountDetailScreen.umsidRegistDate, '2014-12-01');
      assert.deepStrictEqual(await accountDetailScreen.umsidLostDate, '');
      // サービス一覧
      // USEN CART
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceName, 'USEN CART');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceContractNo, '');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceStatementNo, '');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceContractStatus, '');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceContractItem, '');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceFixedDate, '');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceStartDate, '2014-10-01');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceFirstTimeDate, '2015-06-02 11:47:59');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceEndDate, '');
      assert.deepStrictEqual(await accountDetailScreen.usenCartServiceStatus, '');
      // OTORAKU
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceName, 'OTORAKU');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceContractNo, '1');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceStatementNo, '1');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceContractStatus, '確定');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceContractItem, 'OTORAKU(ICT施策2年)(施工なし)');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceFixedDate, '2020-04-08');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceStartDate, '2020-04-08');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceFirstTimeDate, '');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceEndDate, '');
      assert.deepStrictEqual(await accountDetailScreen.otorakuServiceStatus, '');
      // スタシフ
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceName, 'スタシフ');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceContractNo, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceStatementNo, '1');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceContractStatus, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceContractItem, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceFixedDate, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceStartDate, '2016-04-19');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceFirstTimeDate, '2016-04-19 12:05:18');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceEndDate, '2016-05-08');
      assert.deepStrictEqual(await accountDetailScreen.stashif1ServiceStatus, '');
      // スタシフ
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceName, 'スタシフ');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceContractNo, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceStatementNo, '2');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceContractStatus, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceContractItem, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceFixedDate, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceStartDate, '2016-05-09');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceFirstTimeDate, '2016-05-12 20:31:53');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceEndDate, '');
      assert.deepStrictEqual(await accountDetailScreen.stashif2ServiceStatus, '');
      // REACH STOCK（飲食店）
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceName, 'REACH STOCK（飲食店）');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceContractNo, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceStatementNo, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceContractStatus, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceContractItem, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceFixedDate, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceStartDate, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceFirstTimeDate, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceEndDate, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockRestaurantServiceStatus, '');
      // REACH STOCK（生産者）
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceName, 'REACH STOCK（生産者）');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceContractNo, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceStatementNo, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceContractStatus, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceContractItem, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceFixedDate, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceStartDate, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceFirstTimeDate, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceEndDate, '');
      assert.deepStrictEqual(await accountDetailScreen.reachStockProducerServiceStatus, '');
      // USPOT
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceName, 'USPOT');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceContractNo, '');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceStatementNo, '');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceContractStatus, '');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceContractItem, '');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceFixedDate, '');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceStartDate, '');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceFirstTimeDate, '');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceEndDate, '');
      assert.deepStrictEqual(await accountDetailScreen.uspotServiceStatus, '');
      // デンタル・コンシェルジュ
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceName, 'デンタル・コンシェルジュ');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceContractNo, '3');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceStatementNo, '3');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceContractStatus, '受注');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceContractItem, 'デンタル');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceFixedDate, '2018-11-15');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceStartDate, '2019-04-08');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceFirstTimeDate, '');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceEndDate, '');
      assert.deepStrictEqual(await accountDetailScreen.conciergeServiceStatus, '');

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
      const accountDetailScreen = new AccountDetailScreen(driver);
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
      await accountDetailScreen.clickBtnReturnAccountList();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/account_list');

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
      const accountDetailScreen = new AccountDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
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
      assert.deepStrictEqual(await accountDetailScreen.mailAddress, 'test@usen.co.jp');

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
      const accountDetailScreen = new AccountDetailScreen(driver);
      await loginScreen.access();
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();
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
      assert.deepStrictEqual(await driver.getCurrentUrl(), Const.ADMIN_URL + 'account/detail_account_stop');

      // ****************************
      // ** 後始末
      // ****************************
    });
  });

}

