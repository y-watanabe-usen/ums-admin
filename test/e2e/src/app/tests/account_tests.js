const { Dir, Const, Utils } = require('lib');

const AccountSearchTests = require(`${Dir.tests}/account/account_search_tests`);
const AccountListTests = require(`${Dir.tests}/account/account_list_tests`);
const AccountDetailTests = require(`${Dir.tests}/account/account_detail_tests`);
const AccountServiceDetailTests = require(`${Dir.tests}/account/account_service_detail_tests`);

exports.testMain = () => {
  describe('アカウント管理のテスト', () => {
    // AccountSearchTests.testMain();
    // AccountListTests.testMain();
    // AccountDetailTests.testMain();
    AccountServiceDetailTests.testMain();
  });
}