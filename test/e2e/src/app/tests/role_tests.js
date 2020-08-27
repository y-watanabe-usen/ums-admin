const { Dir, Const, Utils } = require('lib');

const RoleUserSearchTests = require(`${Dir.tests}/role/user_search_tests`);
const RoleUserDetailTests = require(`${Dir.tests}/role/user_detail_tests`);

exports.testMain = () => {
  describe('権限管理のテスト', () => {
    RoleUserSearchTests.testMain();
    RoleUserDetailTests.testMain();
  });
}