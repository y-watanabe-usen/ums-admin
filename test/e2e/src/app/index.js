const { Builder, By, Key, Capabilities, until } = require('selenium-webdriver');
const assert = require('assert');
const moment = require('moment');
//const fs = require('fs');

const SCREEN_DIR = `${__dirname}/screen`;
const LoginScreen = require(`${SCREEN_DIR}/login_screen`);
const AccountSearchScreen = require(`${SCREEN_DIR}/account_search_screen`);
const AccountListScreen = require(`${SCREEN_DIR}/account_list_screen`);
const AccountDetailScreen = require(`${SCREEN_DIR}/account_detail_screen`);
const InitedCustCdDownloadScreen = require(`${SCREEN_DIR}/extraction/inited_cust_cd_download`);

const url = 'http://ums-admin/';
//const downloadPath = '/home/seluser/Downloads';

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


  describe('データ抽出・初回認証済顧客抽出のテスト', () => {
    it('データ抽出タブ押下で初回認証済顧客抽出が表示されること', async () => {
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

// TODO: ダウンロード確認テストが上手くいかないためスキップ
//    it('初回認証済顧客抽出され、ファイルがダウンロードされていることを確認', async () => {
//      // ****************************
//      // ** 準備
//      // ****************************
//      const loginScreen = new LoginScreen(driver);
//      const initedCustCdDownloadScreen = new InitedCustCdDownloadScreen(driver);
//      await driver.get(url);
//      await loginScreen.inputCode('admin');
//      await loginScreen.inputPassword('!QAZ2wsx');
//      await loginScreen.clickBtnLogin();
//      await initedCustCdDownloadScreen.clickTabExtraction();
//
//      // ****************************
//      // ** 実行
//      // ****************************
//      await initedCustCdDownloadScreen.clickBtnDownload();
//
//      // ****************************
//      // ** 検証
//      // ****************************
//      await assert.deepEqual(fs.existsSync(downloadPath + '/100_inited_cust_cd_*.csv'), Boolean('true'));
//
//      // ****************************
//      // ** 後始末
//      // ****************************
//    });
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
}

describe('USEN MEMBERS管理機能のSeleniumテスト', () => {
  before(async () => {
    let usingServer = await buildUsingServer();
    let capabilities = await buildCapabilities();
    driver = await new Builder()
      .usingServer(usingServer)
      .withCapabilities(capabilities)
      .build();
    process.on('unhandledRejection', console.dir);
  });

  beforeEach(async () => {
    await driver.manage().deleteAllCookies();
  });

  after(() => {
    return driver.quit();
  });

  testMain();
});

let buildUsingServer = () => `http://${process.env.CI ? 'localhost' : 'zalenium'}:4444/wd/hub`;

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
        args: []
        //args: [],
        //prefs: {
        //  'download': {
        //    'default_directory': downloadPath,
        //    'prompt_for_download': false,
        //    'directory_upgrade': true
        //  }
        //}
      });
      return capabilities;
    }
    // case "safari": {
    //     return webdriver.Capabilities.safari();
    // }
  }
}
