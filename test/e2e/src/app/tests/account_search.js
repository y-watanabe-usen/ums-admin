const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const assert = require('assert');
const moment = require('moment');
const { execSync } = require('child_process');

const Dir = require('dir');
const LoginScreen = require(`${Dir.screenLogin}/login_screen`);
const AccountSearchScreen = require(`${Dir.screenAccount}/account_search_screen`);
const AccountListScreen = require(`${Dir.screenAccount}/account_list_screen`);
const AccountDetailScreen = require(`${Dir.screenAccount}/account_detail_screen`);
const AccountServiceDetailScreen = require(`${Dir.screenAccount}/account_service_detail_screen`);

var config = require(`${Dir.config}/${process.env.CI ? 'ciConfig' : 'localConfig'}`);

const url = 'http://ums-admin/';
const downloadPath = '/tmp/test_data';

let driver;

exports.accountSearch = function() {

  let testMain = async () => {
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
          await accountSearchScreen.inputCustCd('000000002');
          await accountSearchScreen.clickBtnSearch();
  
          // ****************************
          // ** 検証
          // ****************************
          assert.deepEqual(await driver.getCurrentUrl(), url + 'account/search');
          assert.deepEqual(await accountSearchScreen.firstCustCd, '000000002');
  
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
          await accountSearchScreen.inputCustCd('000000002');
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
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          assert.deepEqual(await driver.getCurrentUrl(), url + 'account/detail_account_stop');
  
          // ****************************
          // ** 後始末
          // ****************************
        });
      });
      describe('サービス詳細画面', () => {
        it('画面に表示されている内容が正しいこと', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const accountListScreen = new AccountListScreen(driver);
          const accountDetailScreen = new AccountDetailScreen(driver);
          const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
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
          await accountServiceDetailScreen.clickBtnServiceDetail();
  
          // ****************************
          // ** 検証
          // ****************************
          // UNIS情報
          assert.deepEqual(await accountServiceDetailScreen.firstCustCd, 'admin0001');
          assert.deepEqual(await accountServiceDetailScreen.name, 'テストデータ0001(ﾃｽﾄﾃﾞｰﾀ0001)');
          assert.deepEqual(await accountServiceDetailScreen.clientStatus, '確定');
          assert.deepEqual(await accountServiceDetailScreen.address, '〒150-0045 渋谷区神泉町９－８ビル１Ｆ');
          assert.deepEqual(await accountServiceDetailScreen.tel, '0120-117-448');
          assert.deepEqual(await accountServiceDetailScreen.branch, '東京統括支店青山(0204140700)');
          assert.deepEqual(await accountServiceDetailScreen.regularStore, '');
          assert.deepEqual(await accountServiceDetailScreen.industry, 'その他　会社関連(001699)');
          assert.deepEqual(await accountServiceDetailScreen.launch, '2014-10-01');
          assert.deepEqual(await accountServiceDetailScreen.close, '');
          assert.deepEqual(await accountServiceDetailScreen.cancell, '');
          assert.deepEqual(await accountServiceDetailScreen.lastUpdate, '2014-11-20 15:21:24');
          // サービス情報
          assert.deepEqual(await accountServiceDetailScreen.serviceName, 'USEN CART');
          assert.deepEqual(await accountServiceDetailScreen.contractNo, '');
          assert.deepEqual(await accountServiceDetailScreen.StatementNo, '');
          assert.deepEqual(await accountServiceDetailScreen.contractStatus, '');
          assert.deepEqual(await accountServiceDetailScreen.billingStartDate, '');
          assert.deepEqual(await accountServiceDetailScreen.endMonth, '');
          assert.deepEqual(await accountServiceDetailScreen.contractItem, '');
          assert.deepEqual(await accountServiceDetailScreen.FixedDate, '');
          assert.deepEqual(await accountServiceDetailScreen.firstTimeDate, '2014-10-01');
          assert.deepEqual(await accountServiceDetailScreen.firstAuthDate, '2015-06-02 11:47:59');
          assert.deepEqual(await accountServiceDetailScreen.endDate, '');
  
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
          const accountListScreen = new AccountListScreen(driver);
          const accountDetailScreen = new AccountDetailScreen(driver);
          const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          assert.deepEqual(await driver.getCurrentUrl(), url + 'account/detail');
  
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
          const accountListScreen = new AccountListScreen(driver);
          const accountDetailScreen = new AccountDetailScreen(driver);
          const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          assert.deepEqual(await accountServiceDetailScreen.serviceEnable, false);
  
          // ****************************
          // ** 後始末
          // ****************************
          const mysql = require('mysql');
          const connection = mysql.createConnection(config.serverConf);
  
          connection.connect();
  
          // DB接続出来なければエラー表示
          connection.on('error', function (err) {
            console.log('DB CONNECT ERROR', err);
          });
  
          // status_flagを1に戻す
          connection.query('UPDATE t_unis_service SET status_flag="1" WHERE id="9"', function (err, result) {
            if (err) {
              // UPDATEに失敗したら戻す
              connection.rollback(function () {
                throw err;
              });
            }
          });
  
          connection.end();
        });
        it('休店登録できること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const accountListScreen = new AccountListScreen(driver);
          const accountDetailScreen = new AccountDetailScreen(driver);
          const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          assert.deepEqual(await accountServiceDetailScreen.closedStore, '休店');
  
          // ****************************
          // ** 後始末
          // ****************************
          // TODO: 「休店解除できること」のテストを復活したらこの後始末は削除
          const mysql = require('mysql');
          const connection = mysql.createConnection(config.serverConf);
  
          connection.connect();
  
          // DB接続出来なければエラー表示
          connection.on('error', function (err) {
            console.log('DB CONNECT ERROR', err);
          });
  
          // t_service_stop_historyのレコードを削除
          connection.query('DELETE FROM  t_service_stop_history LIMIT 1', function (err, result) {
            if (err) {
              // DELETEに失敗したら戻す
              connection.rollback(function () {
                throw err;
              });
            }
          });
  
          connection.end();
        });
        it.skip('休店解除できること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const accountListScreen = new AccountListScreen(driver);
          const accountDetailScreen = new AccountDetailScreen(driver);
          const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          assert.deepEqual(await accountServiceDetailScreen.forcedUnlockDisable, '');
  
          // ****************************
          // ** 後始末
          // ****************************
          const mysql = require('mysql');
          const connection = mysql.createConnection(config.serverConf);
  
          connection.connect();
  
          // DB接続出来なければエラー表示
          connection.on('error', function (err) {
            console.log('DB CONNECT ERROR', err);
          });
  
          // t_service_stop_historyのレコードを削除
          connection.query('DELETE FROM  t_service_stop_history LIMIT 1', function (err, result) {
            if (err) {
              // DELETEに失敗したら戻す
              connection.rollback(function () {
                throw err;
              });
            }
          });
  
          connection.end();
        });
        it.skip('強制施錠登録できること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const accountListScreen = new AccountListScreen(driver);
          const accountDetailScreen = new AccountDetailScreen(driver);
          const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          assert.deepEqual(await accountServiceDetailScreen.closedStore, '強制施錠');
  
          // ****************************
          // ** 後始末
          // ****************************
        });
        it.skip('強制施錠解除できること', async () => {
          // ****************************
          // ** 準備
          // ****************************
          const loginScreen = new LoginScreen(driver);
          const accountSearchScreen = new AccountSearchScreen(driver);
          const accountListScreen = new AccountListScreen(driver);
          const accountDetailScreen = new AccountDetailScreen(driver);
          const accountServiceDetailScreen = new AccountServiceDetailScreen(driver);
          await driver.get(url);
          await loginScreen.inputCode('admin');
          await loginScreen.inputPassword('!QAZ2wsx');
          await loginScreen.clickBtnLogin();
          await driver.get(url + 'account/search');
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
          assert.deepEqual(await accountServiceDetailScreen.forcedUnlockDisable, '');
  
          // ****************************
          // ** 後始末
          // ****************************
          const mysql = require('mysql');
          const connection = mysql.createConnection(config.serverConf);
  
          connection.connect();
  
          // DB接続出来なければエラー表示
          connection.on('error', function (err) {
            console.log('DB CONNECT ERROR', err);
          });
  
          // t_service_stop_historyのレコードを削除
          connection.query('DELETE FROM  t_service_stop_history LIMIT 1', function (err, result) {
            if (err) {
              // DELETEに失敗したら戻す
              connection.rollback(function () {
                throw err;
              });
            }
          });
  
          connection.end();
        });
      });
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
}