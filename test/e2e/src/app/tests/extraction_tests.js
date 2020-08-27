const { Dir, Const, Utils } = require('lib');

const InitedCustCdDownloadTests = require(`${Dir.tests}/extraction/inited_cust_cd_download_tests`);
const IssueHistoryDownloadTests = require(`${Dir.tests}/extraction/issue_history_download_tests`);
const IdPwDownloadTests = require(`${Dir.tests}/extraction/id_pw_download_tests`);
const MailAddressInitImportTests = require(`${Dir.tests}/extraction/mail_address_init_import_tests`);
const ChainStoreBulkRegistTests = require(`${Dir.tests}/extraction/chain_store_bulk_regist_tests`);

exports.testMain = () => {
  describe('データ抽出のテスト', () => {
    InitedCustCdDownloadTests.testMain();
    IssueHistoryDownloadTests.testMain();
    IdPwDownloadTests.testMain();
    MailAddressInitImportTests.testMain();
    ChainStoreBulkRegistTests.testMain();
  });
}