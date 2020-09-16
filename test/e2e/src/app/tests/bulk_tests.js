const { Dir, Const, Utils } = require('lib');

const BulkTests = require(`${Dir.tests}/bulk/bulk_service_tests`);

exports.testMain = () => {
  describe('サービス一括強制施錠／開錠のテスト', () => {
    BulkTests.testMain();
  });
}