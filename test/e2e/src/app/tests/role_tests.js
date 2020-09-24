const { Dir, Const, Utils } = require('lib');

const RoleUserSearchTests = require(`${Dir.tests}/role/user_search_tests`);
const RoleUserDetailTests = require(`${Dir.tests}/role/user_detail_tests`);
const OrganizationSearchTests = require(`${Dir.tests}/role/organization_search_tests`);
const OrganizationDetailTests = require(`${Dir.tests}/role/organization_detail_tests`);
const SubscribesTests = require(`${Dir.tests}/role/subscribes_tests`);

exports.testMain = () => {
  describe('権限管理のテスト', () => {
    RoleUserSearchTests.testMain();
    RoleUserDetailTests.testMain();
    OrganizationSearchTests.testMain();
    OrganizationDetailTests.testMain();
    SubscribesTests.testMain();
  });
}