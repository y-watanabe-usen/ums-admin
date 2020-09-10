const { Dir, Const, Utils } = require('lib');

module.exports = {
    LoginTests: require(`${Dir.tests}/login_tests`),
    LogoutTests: require(`${Dir.tests}/logout_tests`),
    AccountTests: require(`${Dir.tests}/account_tests`),
    IssueTests: require(`${Dir.tests}/issue_tests`),
    ExtractionTests: require(`${Dir.tests}/extraction_tests`),
    DedicatedTests: require(`${Dir.tests}/dedicated_tests`),
    BranchTests: require(`${Dir.tests}/branch_tests`),
    RoleTests: require(`${Dir.tests}/role_tests`),
};