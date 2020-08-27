const { Dir, Const, Utils } = require('lib');

const TrialSearchTests = require(`${Dir.tests}/dedicated/trial_search_tests`);
const TrialDetailTests = require(`${Dir.tests}/dedicated/trial_detail_tests`);
const TrialCreateTests = require(`${Dir.tests}/dedicated/trial_create_tests`);
const TrialDownloadTests = require(`${Dir.tests}/dedicated/trial_download_tests`);
const DemoSearchTests = require(`${Dir.tests}/dedicated/demo_search_tests`);
const DemoCreateTests = require(`${Dir.tests}/dedicated/demo_create_tests`);
const DemoDownloadTests = require(`${Dir.tests}/dedicated/demo_download_tests`);

exports.testMain = () => {
  describe('お試し/デモ管理のテスト', () => {
    TrialSearchTests.testMain();
    TrialDetailTests.testMain();
    TrialCreateTests.testMain();
    TrialDownloadTests.testMain();
    DemoSearchTests.testMain();
    DemoCreateTests.testMain();
    DemoDownloadTests.testMain();
  });
}