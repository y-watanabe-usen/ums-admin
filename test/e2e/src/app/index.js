const { Dir, Const, Utils, Database } = require('lib');
const { LoginTests, LogoutTests, AccountTests, IssueTests, ExtractionTests, DedicatedTests, BranchTests, RoleTests } = require('tests');

describe('USEN MEMBERS管理機能のSeleniumテスト', () => {
    before(async () => {
        Database.connect();
    });

    after(() => {
        Database.disconnect();
    });

    LoginTests.testMain();
    LogoutTests.testMain();
    AccountTests.testMain();
    IssueTests.testMain();
    ExtractionTests.testMain();
    DedicatedTests.testMain();
    BranchTests.testMain();
    RoleTests.testMain();
});