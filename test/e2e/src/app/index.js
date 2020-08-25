const Dir = require('dir');
const loginTests = require(`${Dir.tests}/login_tests`);
const logoutTests = require(`${Dir.tests}/logout_tests`);
const accountSearchTests = require(`${Dir.tests}/account_search`);
const shippingManagementTests = require(`${Dir.tests}/shipping_management`);
const initedCustcdDownloadTests = require(`${Dir.tests}/inited_custcd_download`);
const trialAccountSearchTests = require(`${Dir.tests}/trial_account_search`);
const roleSearchTests = require(`${Dir.tests}/role_search`);

describe('USEN MEMBERS管理機能のSeleniumテスト', () => {
    loginTests.login();
    logoutTests.logout();
    accountSearchTests.accountSearch();
    shippingManagementTests.shippingManagement();
    initedCustcdDownloadTests.initedCustcdDownload();
    trialAccountSearchTests.trialAccountSearch();
    roleSearchTests.roleSearch();
});