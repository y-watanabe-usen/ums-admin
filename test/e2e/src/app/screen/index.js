const { Dir, Const, Utils } = require('lib');

module.exports = {
    LoginScreen: require(`${Dir.screenLogin}/login_screen`),
    LogoutScreen: require(`${Dir.screenLogout}/logout_screen`),

    AccountSearchScreen: require(`${Dir.screenAccount}/account_search_screen`),
    AccountListScreen: require(`${Dir.screenAccount}/account_list_screen`),
    AccountDetailScreen: require(`${Dir.screenAccount}/account_detail_screen`),
    AccountServiceDetailScreen: require(`${Dir.screenAccount}/account_service_detail_screen`),

    PublishDownloadScreen: require(`${Dir.screenIssue}/publish_download_screen`),
    NotArrivedUploadScreen: require(`${Dir.screenIssue}/not_arrived_upload_screen`),
    PublishUploadScreen: require(`${Dir.screenIssue}/publish_upload_screen`),

    ExtractionScreen: require(`${Dir.screenExtraction}/extraction_screen`),
    InitedCustCdDownloadScreen: require(`${Dir.screenExtraction}/inited_cust_cd_download_screen`),
    IssueHistoryDownloadScreen: require(`${Dir.screenExtraction}/issue_history_download_screen`),
    IdPwDownloadScreen: require(`${Dir.screenExtraction}/id_pw_download_screen`),
    MailAddressInitImportScreen: require(`${Dir.screenExtraction}/mail_address_init_import_screen`),
    ChainStoreBulkRegistScreen: require(`${Dir.screenExtraction}/chain_store_bulk_regist_screen`),

    TrialSearchScreen: require(`${Dir.screenDedicated}/trial_search_screen`),
    TrialDetailScreen: require(`${Dir.screenDedicated}/trial_detail_screen`),
    TrialCreateScreen: require(`${Dir.screenDedicated}/trial_create_screen`),
    TrialDownloadScreen: require(`${Dir.screenDedicated}/trial_download_screen`),
    DemoSearchScreen: require(`${Dir.screenDedicated}/demo_search_screen`),
    DemoCreateScreen: require(`${Dir.screenDedicated}/demo_create_screen`),
    DemoDownloadScreen: require(`${Dir.screenDedicated}/demo_download_screen`),

    BranchScreen: require(`${Dir.screenBranch}/branch_list_search_screen`),

    RoleSearchScreen: require(`${Dir.screenRole}/role_search_screen`),
    RoleUserDetailScreen: require(`${Dir.screenRole}/role_user_detail_screen`),
    OrganizationSearchScreen: require(`${Dir.screenRole}/organization_search_screen`),
    OrganizationDetailScreen: require(`${Dir.screenRole}/organization_detail_screen`),
};