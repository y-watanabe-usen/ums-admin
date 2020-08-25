const Dir = require('dir');

// ログインのテスト
const loginTests = require(`${Dir.tests}/login_tests`);
loginTests.login();

// ログアウトのテスト
const logoutTests = require(`${Dir.tests}/logout_tests`);
logoutTests.logout();

// アカウント管理のテスト
const accountSearchTests = require(`${Dir.tests}/account_search`);
accountSearchTests.accountSearch();

// データ抽出のテスト
const initedCustcdDownloadTests = require(`${Dir.tests}/inited_custcd_download`);
initedCustcdDownloadTests.initedCustcdDownload();

// お試し/デモ管理のテスト
const trialAccountSearchTests = require(`${Dir.tests}/trial_account_search`);
trialAccountSearchTests.trialAccountSearch();

// 発送管理のテスト
const shippingManagementTests = require(`${Dir.tests}/shipping_management`);
shippingManagementTests.shippingManagement();

//権限管理のテスト
const roleSearchTests = require(`${Dir.tests}/role_search`);
roleSearchTests.roleSearch();