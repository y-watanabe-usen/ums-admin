const { Dir, Const, Utils } = require('lib');

const BranchListSearchTests = require(`${Dir.tests}/branch/branch_list_search_tests`);

exports.testMain = () => {
  describe('支店別管轄顧客一覧のテスト', () => {
    BranchListSearchTests.testMain();
  });
}