<?php

//================================
// 共通設定
//================================
// タイムゾーン
date_default_timezone_set('Asia/Tokyo');

// 文字コード
Configure::write('DEFAULT_CHARSET', 'UTF-8');

// セッション情報
Configure::write('SESSION_IS_LOGIN', 'IS_LOGIN');         //ログイン中かを格納
Configure::write('SESSION_ACCOUNT', 'ACCOUNT');         //m_account情報を格納
Configure::write('SESSION_EXPIRED', 'EXPIRED');           //セッション有効期限(マイクロ秒)を格納
Configure::write('MAX_LOGIN_TIME', 60 * 60);               //ログイン状態を保持する時間
Configure::write('AUTO_LOGIN_VALID_TIME', 60 * 60 * 24 * 7); //自動ログイン有効期間
Configure::write('SESSION_RETURN_URL', 'RETURN_URL'); //戻り先URL
// クッキー情報
Configure::write('COOKIE_PASSPORT', 'PASSPORT');

//================================
// 環境別設定
//================================
// 環境設定
Configure::write('ENVIROMENT', 'local');

// ドメイン設定
Configure::write('DOMAIN', 'local-members.usen.com');

// 管理機能URL
Configure::write('ADMIN_URL', 'http://local-admin-members.usen.com/');

// パスワードソルト
Configure::write('PASSWORD_SALT', 'd133ca2162a19c3cc60b570cc35642e8');
Configure::write('PASSWORD_STRETCH_COUNT', 2);

// 個人情報用ソルト
Configure::write('PERSONAL_SALT', 'zSpVbSzXYVzJHn9FVN47PrT75idHAZsTh52cDFtx');

// メールアクセス有効期限
Configure::write('INIT_ACCSESS_EXPIRE_HOUR', '+1 day');

// SMTPサーバ
Configure::write('MAIL_HOST', 'localhost');
// メールのFROM
Configure::write('MAIL_FROM', 'pj-app-dev@usen.co.jp');
Configure::write('MAIL_FROM_NAME', '[ローカル]pj-app-dev@usen.co.jp');

// 支店メールスイッチ（trueだと支店にメールを送る）
Configure::write('NOT_ARRIVED_MAIL_SWITCH', false);

// ログ
//Configure::$log = array(
//    'file' => array(
//        'level' => 'debug',
//        'file' => LOG_DIR . DS . 'comauth.log',
//    )
//);
Configure::$log = array(
    'echo' => array(
        'enabled' => true,
        #'level' => 'debug',
        'level' => 'warning',
        'option' => 'datetime,pid,logLevel,funcname',
        'filter_ignore' => '',
        #'echo_stream' => 'stdout',
        'echo_stream' => 'output',
    ),
    'file' => array(
        'enabled' => true,
        'level' => 'info',
        'option' => 'datetime,pid,logLevel,funcname',
        'filter_ignore' => '',
        'file' => LOG_DIR . DS . 'admin.log',
    ),
    'syslog' => array(
        'enabled' => true,
        'level' => 'warning',
        'option' => 'logLevel,funcname',
        'filter_ignore' => '',
        'syslog_option' => LOG_PID | LOG_NDELAY,
        'syslog_ident' => 'comauth_admin',
        'syslog_facility' => LOG_LOCAL6,
    ),
);

// エラー時に表示するVIEW
Configure::write('error', array(
    '400' => TPL_DIR . DS . 'error' . DS . 'error400.tpl',
    '403' => TPL_DIR . DS . 'error' . DS . 'error403.tpl',
    '404' => TPL_DIR . DS . 'error' . DS . 'error404.tpl',
    '408' => TPL_DIR . DS . 'error' . DS . 'error408.tpl',
    '500' => TPL_DIR . DS . 'error' . DS . 'error500.tpl',
        )
);

// データベース情報
Configure::write('DB_MASTER', 'master');
Configure::write('DB_SLAVE', 'slave');
Configure::write('DB_ADMIN_MASTER', 'admin_master');
Configure::write('DB_ADMIN_SLAVE', 'admin_slave');

// データベース接続先
Configure::$database = array(
    //------------------------
    // DB log設定
    //------------------------
    'logAll' => true,
    'logSql' => false,
    'logBind' => false,
    'logRow' => false,
    'logTransaction' => false,
    //------------------------
    // DB設定
    //------------------------
    'connect' => array(
        Configure::read('DB_SLAVE') => array(
            array(
                'driver' => 'mysql',
                'host' => 'ums-db',
                'user' => 'admin',
                'password' => 'adminpass',
                'database' => 'comauth_db',
                'charaset' => 'utf8',
            ),
        ),
        Configure::read('DB_MASTER') => array(
            array(
                'driver' => 'mysql',
                'host' => 'ums-db',
                'user' => 'admin',
                'password' => 'adminpass',
                'database' => 'comauth_db',
                'charaset' => 'utf8',
            ),
        ),
        Configure::read('DB_ADMIN_SLAVE') => array(
            array(
                'driver' => 'mysql',
                'host' => 'ums-db',
                'user' => 'admin',
                'password' => 'adminpass',
                'database' => 'admin_db',
                'charaset' => 'utf8',
            ),
        ),
        Configure::read('DB_ADMIN_MASTER') => array(
            array(
                'driver' => 'mysql',
                'host' => 'ums-db',
                'user' => 'admin',
                'password' => 'adminpass',
                'database' => 'admin_db',
                'charaset' => 'utf8',
            ),
        ),
    )
);

// DRAGONサーバーIP
Configure::write('DRAGON_SERVER', array('localhost','localhost'));
// DRAGON認証用鍵情報
Configure::write('DRAGON_AUTH_PRIVATE_KEY', RSA_DIR . DS . 'id_rsa_bird');
Configure::write('DRAGON_AUTH_PUBLIC_KEY', RSA_DIR . DS . 'id_rsa_bird.pub');
// DRAGONサーバーログインID
Configure::write('DRAGON_LOGIN_ID', 'crmadm30');
// DRAGONデータ授受ディレクトリ
Configure::write('DRAGON_DATA_DIR', '/igus_crm/ap/iguswork/cr30/data/csv/mst');
// DRAGON連携スイッチ
Configure::write('DRAGON_SUBSCRIBES_SWITCH', false);

//サイトタイトル
Configure::write('WEB_NAME', 'Usen Members管理 - LOCAL環境');

//発送データディレクトリ
Configure::write('PUBLISH_DIR', '/data/batch/account_publish/');
//発送データディレクトリ
Configure::write('PUBLISH_BRANCH_DIR', Configure::read('PUBLISH_DIR') . 'branch/');
//チェーン店発送データディレクトリ
Configure::write('CHAIN_PUBLISH_BRANCH_DIR', Configure::read('PUBLISH_DIR') . 'chain_branch/');
//発送管理ディレクトリ
Configure::write('ISSUE_DIR', '/data/admin/issue/upload/');
//お試しアカウント管理ディレクトリ
Configure::write('TRIAL_DIR', '/data/admin/dedicated/upload/trial/');
//デモアカウント管理ディレクトリ
Configure::write('DEMO_DIR', '/data/admin/dedicated/upload/demo/');
//メールアドレスインポート管理ディレクトリ
Configure::write('EXTRACTION_DIR', '/data/admin/extraction/upload/');
//一括処理ディレクトリ
Configure::write('BULK_DIR', '/data/admin/bulk/upload/');
// OTORAKU試聴時間取得APIのURL
Configure::write('OTORAKU_LISTENED_TIME_API', 'http://wiremock:8080/apiweb.otoraku.jp/secure_api/listened_time.php');
// OTORAKUアカウント証発行の除外UNIS顧客CD
Configure::write('OTORAKU_IGNORE_UNIS_CD', array(
));
