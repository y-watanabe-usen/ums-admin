const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const moment = require('moment');
const { execSync } = require('child_process');
const fs = require('fs');
var sleep = require('sleep');

const SCREEN_DIR = `${__dirname}/screen`;
const FILES_DIR = `${__dirname}/files`;
const LoginScreen = require(`${SCREEN_DIR}/login_screen`);
const AccountSearchScreen = require(`${SCREEN_DIR}/account_search_screen`);
const AccountListScreen = require(`${SCREEN_DIR}/account_list_screen`);
const AccountDetailScreen = require(`${SCREEN_DIR}/account_detail_screen`);
const TrialAccountSearchScreen = require(`${SCREEN_DIR}/trial_account_search_screen`);
const TrialAccountDetailScreen = require(`${SCREEN_DIR}/trial_account_detail_screen`);
const ExtractionScreen = require(`${SCREEN_DIR}/extraction/extraction`);
const InitedCustCdDownloadScreen = require(`${SCREEN_DIR}/extraction/inited_cust_cd_download`);
const IssueHistoryDownloadScreen = require(`${SCREEN_DIR}/extraction/issue_history_download`);
const IdPwDownloadScreen = require(`${SCREEN_DIR}/extraction/id_pw_download`);
const MailAddressInitImportScreen = require(`${SCREEN_DIR}/extraction/mail_address_init_import`);
const ChainStoreBulkRegistScreen = require(`${SCREEN_DIR}/extraction/chain_store_bulk_regist`);

const url = 'http://ums-admin/';
const downloadPath = '/tmp/test_data';

let driver;

let testMain = async () => {
  describe('ログインのテスト', () => {
    it('サイトトップにアクセスしてログイン画面が表示されること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url);

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url);
      assert.deepEqual(await loginScreen.code, '');
      assert.deepEqual(await loginScreen.password, '');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('社員番号が間違っている場合はログイン出来ないこと', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url);
      await loginScreen.inputCode('adminaaa');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'login');
      assert.deepEqual(await loginScreen.alert, 'ログインID、またはパスワードに誤りがあります。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('パスワードが間違っている場合はログイン出来ないこと', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsxa');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'login');
      assert.deepEqual(await loginScreen.alert, 'ログインID、またはパスワードに誤りがあります。');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('未ログイン状態でアクセスした場合、ログイン画面にリダイレクトされること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url + 'account/search');

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'login/');

      // ****************************
      // ** 後始末
      // ****************************
    });

    it('社員番号とパスワードが合っている場合はログイン出来ること', async () => {
      // ****************************
      // ** 準備
      // ****************************
      const loginScreen = new LoginScreen(driver);
      const accountSearchScreen = new AccountSearchScreen(driver);

      // ****************************
      // ** 実行
      // ****************************
      await driver.get(url);
      await loginScreen.inputCode('admin');
      await loginScreen.inputPassword('!QAZ2wsx');
      await loginScreen.clickBtnLogin();

      // ****************************
      // ** 検証
      // ****************************
      assert.deepEqual(await driver.getCurrentUrl(), url + 'account/search');
      assert.deepEqual(await accountSearchScreen.title, 'アカウント検索');

      // ****************************
      // ** 後始末
      // ****************************
    });
  });
  describe('アカウント管理', () => {
    describe('アカウント検索のテスト', () => {
      it('検索が出来ること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();

        // ****************************
        // ** 実行
        // ****************************
        await accountSearchScreen.clickBtnSearch();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'account/search');
        assert.deepEqual(await accountSearchScreen.firstCustCd, 'admin0001');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('顧客CDを検索し検索が出来ること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');

        // ****************************
        // ** 実行
        // ****************************
        await accountSearchScreen.inputCustCd('admin0002');
        await accountSearchScreen.clickBtnSearch();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'account/search');
        assert.deepEqual(await accountSearchScreen.firstCustCd, 'admin0002');

        // ****************************
        // ** 後始末
        // ****************************
      });
      it('詳細ボタン押下後アカウント一覧画面に遷移すること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
        await accountSearchScreen.inputCustCd('admin0002');
        await accountSearchScreen.clickBtnSearch();

        // ****************************
        // ** 実行
        // ****************************
        await accountSearchScreen.clickBtnDetail();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'account/account_list');

        // ****************************
        // ** 後始末
        // ****************************
      });
    });
    describe('アカウント一覧画面のテスト', () => {
      it(' 画面に表示されている内容が正しいこと', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        const accountListScreen = new AccountListScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
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
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
        await accountSearchScreen.inputCustCd('admin0002');
        await accountSearchScreen.clickBtnSearch();
        await accountSearchScreen.clickBtnDetail();
  
        // ****************************
        // ** 実行
        // ****************************
        await accountListScreen.clickBtnReturnList();
  
        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'account/search');
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
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
        await accountSearchScreen.inputCustCd('admin0002');
        await accountSearchScreen.clickBtnSearch();
        await accountSearchScreen.clickBtnDetail();
  
        // ****************************
        // ** 実行
        // ****************************
        await accountListScreen.clickBtnDetail();
  
        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'account/detail');
  
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
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
        await accountSearchScreen.inputCustCd('admin0002');
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
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
        await accountSearchScreen.inputCustCd('admin0002');
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
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
        await accountSearchScreen.inputCustCd('admin0002');
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
  
    describe('アカウント詳細画面', () => {
      it('画面に表示されている内容が正しいこと', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        const accountListScreen = new AccountListScreen(driver);
        const accountDetailScreen = new AccountDetailScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
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
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
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
        assert.deepEqual(await driver.getCurrentUrl(), url + 'account/account_list');
  
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
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
        await accountSearchScreen.inputCustCd('admin0002');
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
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await driver.get(url + 'account/search');
        await accountSearchScreen.inputCustCd('admin0002');
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
        assert.deepEqual(await driver.getCurrentUrl(), url + 'account/detail_account_stop');
  
        // ****************************
        // ** 後始末
        // ****************************
      });
    });
  });

  describe('発送管理', () => {
  });

  describe('データ抽出', () => {
    describe('初回認証済顧客抽出のテスト', () => {
      it('データ抽出タブ押下で初回認証済顧客抽出画面が表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/inited_cust_cd_download/');
        assert.deepEqual(await initedCustCdDownloadScreen.title, '初回認証済顧客抽出');
        assert.deepEqual(await initedCustCdDownloadScreen.from, '');
        assert.deepEqual(await initedCustCdDownloadScreen.to, '');
        assert.deepEqual(await initedCustCdDownloadScreen.service, '100'); // valueを取得（テキストの取得調査中）

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('先月ボタン押下でテキストボックスに先月の日時が入力されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        var lastMonth = moment().subtract(1, 'month');
        var lastMonthFormatted = lastMonth.format('YYYY/MM/');
        var cntLastMonthDay = moment(lastMonth.format('YYYY-MM')).daysInMonth(); // 先月の日数取得

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.clickBtnLastMonth();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.from, lastMonthFormatted + '01');
        assert.deepEqual(await initedCustCdDownloadScreen.to, lastMonthFormatted + cntLastMonthDay);

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('今月ボタン押下でテキストボックスに今月の日時が入力されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        var thisMonthFormatted = moment().format('YYYY/MM/');
        var cntThisMonthDay = moment(moment().format('YYYY-MM')).daysInMonth(); // 先月の日数取得

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.clickBtnThisMonth();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.from, thisMonthFormatted + '01');
        assert.deepEqual(await initedCustCdDownloadScreen.to, thisMonthFormatted + cntThisMonthDay);

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('初回認証日fromの入力ミス（年のみ）の場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.inputFrom('2020');
        await initedCustCdDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日FROMを正しく入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('初回認証日fromの入力ミス（年月のみ）の場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.inputFrom('2020/07');
        await initedCustCdDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日FROMを正しく入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('初回認証日to（年のみ）の入力ミスの場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.inputFrom('2020/07/01');
        await initedCustCdDownloadScreen.inputTo('2020');
        await initedCustCdDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日TOを正しく入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('初回認証日to（年月のみ）の入力ミスの場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.inputFrom('2020/07/01');
        await initedCustCdDownloadScreen.inputTo('2020/07');
        await initedCustCdDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日TOを正しく入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('初回認証日の入力ミスの場合（from, to逆）エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.inputFrom('2020/07/31');
        await initedCustCdDownloadScreen.inputTo('2020/07/01');
        await initedCustCdDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.alert, '初回認証日はFrom <= Toで入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「OTORAKU」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.selectService('120');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.service, '120');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「スタシフ」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.selectService('130');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.service, '130');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「REACH STOCK（飲食店）」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.selectService('140');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.service, '140');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「REACH STOCK（生産者）」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.selectService('150');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.service, '150');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「USPOT」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.selectService('160');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.service, '160');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「デンタル・コンシェルジュ」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.selectService('170');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.service, '170');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('抽出対象データがない場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.clickBtnLastMonth();
        await initedCustCdDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await initedCustCdDownloadScreen.alert, '対象データはありません。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('初回認証済顧客抽出され、ファイルがダウンロードされていることを確認', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await initedCustCdDownloadScreen.clickBtnDownload();
        sleep.sleep(1);

        // ****************************
        // ** 検証
        // ****************************
        // ファイル名取得
        const stdout = execSync(`ls ${downloadPath}`);
        const csvFilename = stdout.toString().replace("\n", "");
        // ファイル読み込み
        const actual = fs.readFileSync(`${downloadPath}/${csvFilename}`).toString();
        const expected = fs.readFileSync(`${FILES_DIR}/extraction/inited_cust_cd_download_test_1_expected.csv`).toString();

        // ファイル内容の比較
        await assert.deepEqual(actual, expected);

        // ****************************
        // ** 後始末
        // ****************************
      });
    });
    describe('アカウント証発送履歴抽出のテスト', () => {
      it('データ抽出画面のメニューからアカウント証発送履歴抽出を押下しアカウント証発送履歴抽出画面が表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/issue_history_download/');
        assert.deepEqual(await issueHistoryDownloadScreen.title, 'アカウント証発送履歴抽出');
        assert.deepEqual(await issueHistoryDownloadScreen.from, '');
        assert.deepEqual(await issueHistoryDownloadScreen.to, '');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('先月ボタン押下でテキストボックスに先月の日時が入力されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        var lastMonth = moment().subtract(1, 'month');
        var lastMonthFormatted = lastMonth.format('YYYY/MM/');
        var cntLastMonthDay = moment(lastMonth.format('YYYY-MM')).daysInMonth(); // 先月の日数取得

        // ****************************
        // ** 実行
        // ****************************
        await issueHistoryDownloadScreen.clickBtnLastMonth();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await issueHistoryDownloadScreen.from, lastMonthFormatted + '01');
        assert.deepEqual(await issueHistoryDownloadScreen.to, lastMonthFormatted + cntLastMonthDay);

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('今月ボタン押下でテキストボックスに今月の日時が入力されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        var thisMonthFormatted = moment().format('YYYY/MM/');
        var cntThisMonthDay = moment(moment().format('YYYY-MM')).daysInMonth(); // 先月の日数取得

        // ****************************
        // ** 実行
        // ****************************
        await issueHistoryDownloadScreen.clickBtnThisMonth();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await issueHistoryDownloadScreen.from, thisMonthFormatted + '01');
        assert.deepEqual(await issueHistoryDownloadScreen.to, thisMonthFormatted + cntThisMonthDay);

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('発送日fromの入力ミス（年のみ）の場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        // ****************************
        // ** 実行
        // ****************************
        await issueHistoryDownloadScreen.inputFrom('2020');
        await issueHistoryDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日FROMを正しく入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('発送日fromの入力ミス（年月のみ）の場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        // ****************************
        // ** 実行
        // ****************************
        await issueHistoryDownloadScreen.inputFrom('2020/07');
        await issueHistoryDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日FROMを正しく入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('発送日to（年のみ）の入力ミスの場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        // ****************************
        // ** 実行
        // ****************************
        await issueHistoryDownloadScreen.inputFrom('2020/07/01');
        await issueHistoryDownloadScreen.inputTo('2020');
        await issueHistoryDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日TOを正しく入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('発送日to（年月のみ）の入力ミスの場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        // ****************************
        // ** 実行
        // ****************************
        await issueHistoryDownloadScreen.inputFrom('2020/07/01');
        await issueHistoryDownloadScreen.inputTo('2020/07');
        await issueHistoryDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日TOを正しく入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('発送日の入力ミスの場合（from, to逆）エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        // ****************************
        // ** 実行
        // ****************************
        await issueHistoryDownloadScreen.inputFrom('2020/07/31');
        await issueHistoryDownloadScreen.inputTo('2020/07/01');
        await issueHistoryDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await issueHistoryDownloadScreen.alert, '発送日はFrom <= Toで入力してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('抽出対象データがない場合エラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();

        // ****************************
        // ** 実行
        // ****************************
        await issueHistoryDownloadScreen.clickBtnLastMonth();
        await issueHistoryDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await issueHistoryDownloadScreen.alert, '対象データはありません。');

        // ****************************
        // ** 後始末
        // ****************************
      });

     it('アカウント証発送履歴抽出され、ファイルがダウンロードされていることを確認', async () => {
       // ****************************
       // ** 準備
       // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const issueHistoryDownloadScreen = new IssueHistoryDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIssueHistoryDownload();
     
       // ****************************
       // ** 実行
       // ****************************
       await issueHistoryDownloadScreen.clickBtnDownload();
       sleep.sleep(1);
 
       // ****************************
       // ** 検証
       // ****************************
        // ファイル名取得
        const stdout = execSync(`ls ${downloadPath}`);
        const csvFilename = stdout.toString().replace("\n", "");
        // ファイル読み込み
        const actual = fs.readFileSync(`${downloadPath}/${csvFilename}`).toString();
        const expected = fs.readFileSync(`${FILES_DIR}/extraction/issue_history_download_test_1_expected.csv`).toString();

        // ファイル内容の比較
        await assert.deepEqual(actual, expected);

       // ****************************
       // ** 後始末
       // ****************************
     });
    });

    describe('ID/PW抽出（顧客CD指定）のテスト', () => {
      it('データ抽出画面のメニューからID/PW抽出（顧客CD指定）を押下しID/PW抽出（顧客CD指定）画面が表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/id_pw_download/');
        assert.deepEqual(await idPwDownloadScreen.title, 'ID/PW抽出（顧客CD指定）');
        assert.deepEqual(await idPwDownloadScreen.serviceCd, '100'); // valueを取得（テキストの取得調査中）
        assert.deepEqual(await idPwDownloadScreen.alert, '');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「OTORAKU」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 実行
        // ****************************
        await idPwDownloadScreen.selectServiceCd('120');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await idPwDownloadScreen.serviceCd, '120');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「スタシフ」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 実行
        // ****************************
        await idPwDownloadScreen.selectServiceCd('130');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await idPwDownloadScreen.serviceCd, '130');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「REACH STOCK（飲食店）」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 実行
        // ****************************
        await idPwDownloadScreen.selectServiceCd('140');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await idPwDownloadScreen.serviceCd, '140');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「REACH STOCK（生産者）」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 実行
        // ****************************
        await idPwDownloadScreen.selectServiceCd('150');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await idPwDownloadScreen.serviceCd, '150');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「USPOT」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 実行
        // ****************************
        await idPwDownloadScreen.selectServiceCd('160');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await idPwDownloadScreen.serviceCd, '160');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('サービスのプルダウンで「デンタル・コンシェルジュ」が選択されていること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 実行
        // ****************************
        await idPwDownloadScreen.selectServiceCd('170');

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await idPwDownloadScreen.serviceCd, '170');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('CSVファイル未選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 実行
        // ****************************
        await idPwDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await idPwDownloadScreen.alert, 'CSVファイルを選択してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('TXTファイル選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const idPwDownloadScreen = new IdPwDownloadScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuIdPwDownload();

        // ****************************
        // ** 実行
        // ****************************
        await idPwDownloadScreen.clickBtnFile('/extraction/id_pw_download_test_1.txt');
        await idPwDownloadScreen.clickBtnDownload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await idPwDownloadScreen.alert, 'CSVファイルを選択してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      // TODO: ダウンロードが上手くいかないためスキップ
      //    it('ファイルがダウンロードされていることを確認', async () => {
      //      // ****************************
      //      // ** 準備
      //      // ****************************
      //
      //      // ****************************
      //      // ** 実行
      //      // ****************************
      //
      //      // ****************************
      //      // ** 検証
      //      // ****************************

      //      // ****************************
      //      // ** 後始末
      //      // ****************************
      //    });
    });

    describe('メールアドレス初回登録・仮ID/PW抽出画面のテスト', () => {
      it('データ抽出画面のメニューからメールアドレス初回登録・仮ID/PW抽出を押下しメールアドレス初回登録・仮ID/PW抽出画面が表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const mailAddressInitImportScreen = new MailAddressInitImportScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await extractionScreen.clickExtractionMenuMailAddressInitImport();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/mail_address_init_import/');
        assert.deepEqual(await mailAddressInitImportScreen.title, 'メールアドレス初回登録・仮ID/PW抽出画面');
        assert.deepEqual(await mailAddressInitImportScreen.enableBtnDownload, false);

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('CSVファイル未選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const mailAddressInitImportScreen = new MailAddressInitImportScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuMailAddressInitImport();

        // ****************************
        // ** 実行
        // ****************************
        await mailAddressInitImportScreen.clickBtnUpload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await mailAddressInitImportScreen.alert, 'CSVファイルを選択してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('TXTファイル選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const mailAddressInitImportScreen = new MailAddressInitImportScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuMailAddressInitImport();

        // ****************************
        // ** 実行
        // ****************************
        await mailAddressInitImportScreen.clickBtnFile('/extraction/mail_address_init_import_test_1.txt');
        await mailAddressInitImportScreen.clickBtnUpload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await mailAddressInitImportScreen.alert, 'CSVファイルを選択してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      // TODO: ダウンロードが上手くいかないためスキップ
      //    it('アカウント証発送履歴抽出され、ファイルがダウンロードされていることを確認', async () => {
      //      // ****************************
      //      // ** 準備
      //      // ****************************
      //
      //      // ****************************
      //      // ** 実行
      //      // ****************************
      //
      //      // ****************************
      //      // ** 検証
      //      // ****************************

      //      // ****************************
      //      // ** 後始末
      //      // ****************************
      //    });
    });

    describe('USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面画面のテスト', () => {
      it('データ抽出画面のメニューからメールアドレス初回登録・仮ID/PW抽出を押下しUSEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面が表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();

        // ****************************
        // ** 実行
        // ****************************
        await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'extraction/chain_store_bulk_regist/');
        assert.deepEqual(await chainStoreBulkRegistScreen.title, 'USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面');
        assert.deepEqual(await chainStoreBulkRegistScreen.radioBranch, true);
        assert.deepEqual(await chainStoreBulkRegistScreen.radioClient, false);

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('顧客CD毎に出力が選択されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuChainStoreBulkRegist();

        // ****************************
        // ** 実行
        // ****************************
        await chainStoreBulkRegistScreen.clickRadioClient();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await chainStoreBulkRegistScreen.radioBranch, false);
        assert.deepEqual(await chainStoreBulkRegistScreen.radioClient, true);

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('CSVファイル未選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuMailAddressInitImport();

        // ****************************
        // ** 実行
        // ****************************
        await chainStoreBulkRegistScreen.clickBtnUpload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await chainStoreBulkRegistScreen.alert, 'CSVファイルを選択してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      it('TXTファイル選択の状態でダウンロードボタンを押下したらエラーメッセージが表示されること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const extractionScreen = new ExtractionScreen(driver);
        const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
        const chainStoreBulkRegistScreen = new ChainStoreBulkRegistScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await initedCustCdDownloadScreen.clickTabExtraction();
        await extractionScreen.clickExtractionMenuMailAddressInitImport();

        // ****************************
        // ** 実行
        // ****************************
        await chainStoreBulkRegistScreen.clickBtnFile('/extraction/chain_store_bulk_regist_test_1.txt');
        await chainStoreBulkRegistScreen.clickBtnUpload();

        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await chainStoreBulkRegistScreen.alert, 'CSVファイルを選択してください。');

        // ****************************
        // ** 後始末
        // ****************************
      });

      // TODO: ダウンロードが上手くいかないためスキップ
      //    it('アカウント証発送履歴抽出され、ファイルがダウンロードされていることを確認', async () => {
      //      // ****************************
      //      // ** 準備
      //      // ****************************
      //
      //      // ****************************
      //      // ** 実行
      //      // ****************************
      //
      //      // ****************************
      //      // ** 検証
      //      // ****************************

      //      // ****************************
      //      // ** 後始末
      //      // ****************************
      //    });
    });
  });

  describe('お試し/デモ管理', () => {
    describe('お試しアカウント検索画面のテスト', () => {
      it('検索条件無しで検索が出来ること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await trialAccountSearchScreen.clickBtnTrial();
        // ****************************
        // ** 実行
        // ****************************
        await trialAccountSearchScreen.clickBtnTrialAccountSearch();
        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_search/');
        assert.deepEqual(await trialAccountSearchScreen.firstAccountId, '11');
        // ****************************
        // ** 後始末
        // ****************************
      });
      it('ログインIDを検索条件に指定して検索が出来ること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await trialAccountSearchScreen.clickBtnTrial();
        // ****************************
        // ** 実行
        // ****************************
        await trialAccountSearchScreen.inputAccountId('12');
        await trialAccountSearchScreen.clickBtnTrialAccountSearch();
        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_search/');
        assert.deepEqual(await trialAccountSearchScreen.firstAccountId, '12');
        // ****************************
        // ** 後始末
        // ****************************
      });
      it('検索結果の詳細ボタンを押下すると、お試しアカウント詳細画面に遷移すること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await trialAccountSearchScreen.clickBtnTrial();
        await trialAccountSearchScreen.clickBtnTrialAccountSearch();
        // ****************************
        // ** 実行
        // ****************************
        await trialAccountSearchScreen.clickBtnDetail();
        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_detail');
        // ****************************
        // ** 後始末
        // ****************************
      });
    });
    describe('お試しアカウント詳細画面のテスト', () => {
      it('画面に表示されている内容が正しいこと', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
        const trialAccountDetailScreen = new TrialAccountDetailScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await trialAccountSearchScreen.clickBtnTrial();
        await trialAccountSearchScreen.clickBtnTrialAccountSearch();
        // ****************************
        // ** 実行
        // ****************************
        await trialAccountSearchScreen.clickBtnDetail();
        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_detail');
        assert.deepEqual(await trialAccountDetailScreen.accountId, '11');
        assert.deepEqual(await trialAccountDetailScreen.loginId, 'W7Pr56');
        assert.deepEqual(await trialAccountDetailScreen.password, 'CPhKCagj');
        assert.deepEqual(await trialAccountDetailScreen.salesChannel, 'USEN');
        assert.deepEqual(await trialAccountDetailScreen.issueDate, '2020-08-05');
        assert.deepEqual(await trialAccountDetailScreen.firstAuthenticationDatetimes, '');
        assert.deepEqual(await trialAccountDetailScreen.expireDate, '');
        // ****************************
        // ** 後始末
        // ****************************
      });
      it('一覧へ戻るボタンを押下すると、お試しアカウント検索画面に遷移すること', async () => {
        // ****************************
        // ** 準備
        // ****************************
        const loginScreen = new LoginScreen(driver);
        const accountSearchScreen = new AccountSearchScreen(driver);
        const trialAccountSearchScreen = new TrialAccountSearchScreen(driver);
        const trialAccountDetailScreen = new TrialAccountDetailScreen(driver);
        await driver.get(url);
        await loginScreen.inputCode('admin');
        await loginScreen.inputPassword('!QAZ2wsx');
        await loginScreen.clickBtnLogin();
        await trialAccountSearchScreen.clickBtnTrial();
        await trialAccountSearchScreen.clickBtnTrialAccountSearch();
        await trialAccountSearchScreen.clickBtnDetail();
        // ****************************
        // ** 実行
        // ****************************
        await trialAccountDetailScreen.clickBtnReturnSearchList();
        // ****************************
        // ** 検証
        // ****************************
        assert.deepEqual(await driver.getCurrentUrl(), url + 'dedicated/trial_search');
        // ****************************
        // ** 後始末
        // ****************************
      });
    });
  });

  describe('支店別顧客管理', () => {
  });
  describe('一括処理', () => {
  });
  describe('権限管理', () => {
  });
}

describe('USEN MEMBERS管理機能のSeleniumテスト', () => {
  before(async () => {
    let usingServer = await buildUsingServer();
    let capabilities = await buildCapabilities();
    driver = await new Builder()
      .usingServer(usingServer)
      .withCapabilities(capabilities)
      .build();

    driver.setFileDetector(new remote.FileDetector()); // ファイル検知モジュール

    process.on('unhandledRejection', console.dir);
  });

  beforeEach(async () => {
    await driver.manage().deleteAllCookies();
    execSync(`rm -rf ${downloadPath}/*`);
  });

  after(() => {
    return driver.quit();
  });

  testMain();
});

let buildUsingServer = () => `http://${process.env.CI ? 'localhost' : 'selenium-hub'}:4444/wd/hub`;

let buildCapabilities = () => {
  switch (process.env.BROWSER) {
    // case "ie": {
    //   process.env.PATH = `${process.env.PATH};${__dirname}/Selenium.WebDriver.IEDriver.3.150.0/driver/;`;
    //   const capabilities = webdriver.Capabilities.ie();
    //   capabilities.set("ignoreProtectedModeSettings", true);
    //   capabilities.set("ignoreZoomSetting", true);
    //   return capabilities;
    // }
    case "firefox": {
      console.log("start testing in firefox");
      const capabilities = Capabilities.firefox();
      capabilities.set('firefoxOptions', {
        args: [
          '-headless',
        ]
      });
      return capabilities;
    }
    case "chrome":
    default: {
      console.log("start testing in chrome");
      const capabilities = Capabilities.chrome();
      capabilities.set('chromeOptions', {
        args: [],
        prefs: {
          'download': {
            'default_directory': downloadPath,
            'prompt_for_download': false,
            'directory_upgrade': true
          }
        }
      });
      return capabilities;
    }
    // case "safari": {
    //     return webdriver.Capabilities.safari();
    // }
  }
}
