<?php
$acl = array(
    'allow' => array(
        //ALL
        '*' => array('Login/*'),
        //ログイン権限
        '1'  => array('Account/search', 'Account/get_data', 'Account/account_list', 'Account/detail', 'Account/detail_account_stop'),
        //アカウント情報変更権限
        '2'  => array('Account/search', 'Account/get_data', 'Account/account_list', 'Account/detail', 'Account/save_account'),
        //サービス強制停止権限
        '3'  => array('Account/search', 'Account/get_data', 'Account/account_list', 'Account/detail', 'Account/detail_account_stop', 'Account/get_service_stop_history', 'Account/ins_up_service_stop_history', 'Account/forced_release', 'Account/del_service_stop_history'),
        //発送ダウンロード権限
        '4'  => array('Issue/index', 'Issue/publish_download'),
        //発送アップロード権限
        '5'  => array('Issue/index', 'Issue/publish_upload'),
        //未着アップロード権限
        '6'  => array('Issue/index', 'Issue/not_arrived_upload'),
        //初回登録顧客抽出権限
        '7'  => array('Extraction/index', 'Extraction/inited_cust_cd_download'),
        //発送アップロード+発送データ出力権限
        '8'  => array('Issue/index', 'Issue/publish_upload', 'Issue/publish_output'),
        //アカウント証再送登録/再送不要/削除権限
        '9'  => array('Account/search', 'Account/get_data', 'Account/account_list', 'Account/ins_issue_history', 'Account/up_issue_history'),
        //お試しアカウント検索権限
        '10'  => array('Dedicated/index', 'Dedicated/trial_search', 'Dedicated/trial_get_data', 'Dedicated/trial_detail', 'Dedicated/trial_list_download', 'Dedicated/trial_listened_time_download'),
        //お試しアカウント発行/ダウンロード権限
        '11'  => array('Dedicated/index', 'Dedicated/trial_create', 'Dedicated/trial_download'),
        //デモアカウント検索権限
        '12'  => array('Dedicated/index', 'Dedicated/demo_search', 'Dedicated/demo_get_data'),
        //デモアカウント検索/停止/発行/ダウンロード権限
        '13'  => array('Dedicated/index', 'Dedicated/demo_stop_data', 'Dedicated/demo_create', 'Dedicated/demo_download'),
        //支店別顧客管理検索権限
        '14'  => array('Branch/index', 'Branch/search', 'Branch/get_not_arrived_data', 'Branch/get_conf_prospects_data'),
        //支店別顧客管理検索/ダウンロード権限
        '15'  => array('Branch/index', 'Branch/search', 'Branch/get_not_arrived_data', 'Branch/get_conf_prospects_data', 'Branch/download_not_arrived_data', 'Branch/download_conf_prospects_data'),
        //権限管理権限
        '16'  => array('Role/index', 'Role/user_search', 'Role/user_get_data', 'Role/user_detail', 'Role/user_edit', 'Role/organization_search', 'Role/organization_get_data', 'Role/organization_detail', 'Role/organization_edit', 'Role/subscribes', 'Subscribes/jWHBErnSNG93JFHdkpuYucrrt3VGMsnB'),
        //ID/PW抽出（顧客CD指定）権限
        '17'  => array('Extraction/index', 'Extraction/id_pw_download'),
        //アカウント証発送履歴抽出権限
        '18'  => array('Extraction/index', 'Extraction/issue_history_download'),
        //アカウント証発送履歴抽出権限
        '19'  => array('Account/search', 'Account/get_data', 'Account/account_list', 'Account/direct_pdf', 'Account/get_direct_pdf_history'),
        //メールアドレスインポート・仮ID/PW抽出権限
        '20'  => array('Extraction/index', 'Extraction/mail_address_init_import'),
        //書面契約済顧客用メールアドレス登録・ID/PW抽出
        '21'  => array('Extraction/index', 'Extraction/chain_store_bulk_regist'),
        //一括施錠/開錠
        '22'  => array('Bulk/index', 'Bulk/services'),
        //Ucart・OTORAKUの強制開錠権限
        '23'  => array('Account/forced_unlock'),
        //初期パスワードの表示権限
        '24'  => array('Account/init_password_display'),
     'deny' => array(),
    ),
);
