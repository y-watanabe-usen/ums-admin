<?php

define('SUBSCRIBES_DIR', TMP_DIR . DS . 'subscribes');

/*
 * 社員マスタ連携API
 */
class subscribes extends Controller {

    private $pid = '';

    const DATE_FORMAT = 'Y-m-d H:i:s';
    const SINGLE = 'account';
    const ALL_USER = 'M_USERS';
    const ALL_ORGANIZATION = 'M_ORGANIZATIONS';
    // 部署マスタCSV連携項目
    const COLUMN_ORGANIZATION_ID = 0;
    const COLUMN_ORGANIZATION_CODE = 1;
    const COLUMN_ORGANIZATION_CREATION_DATE = 2;
    const COLUMN_ORGANIZATION_END_DATE = 3;
    const COLUMN_ORGANIZATION_LAST_MODIFIED_DATE = 4;
    const COLUMN_ORGANIZATION_MAIL = 5;
    const COLUMN_ORGANIZATION_ORGANIZATION_DIV = 6;
    const COLUMN_ORGANIZATION_ORGANIZATION_NAME = 7;
    const COLUMN_ORGANIZATION_PROJECT_ID = 8;
    const COLUMN_ORGANIZATION_SORT = 9;
    const COLUMN_ORGANIZATION_START_DATE = 10;
    const COLUMN_ORGANIZATION_TECHNICALCENTER_ID = 11;
    const COLUMN_ORGANIZATION_WORKORDERABLE = 12;
    const COLUMN_ORGANIZATION_CREATEDBY_ID = 13;
    const COLUMN_ORGANIZATION_LAST_MODIFIEDBY_ID = 14;
    const COLUMN_ORGANIZATION_PARENT_ID = 15;
    const COLUMN_ORGANIZATION_ORGANIZATION_TEL = 16;
    // ユーザマスタCSV連携項目
    const COLUMN_USER_ID = 0;
    const COLUMN_USER_CODE = 1;
    const COLUMN_USER_CREATION_DATE = 2;
    const COLUMN_USER_END_DATE = 3;
    const COLUMN_USER_FIRST_NAME = 4;
    const COLUMN_USER_LAST_LOGIN_DATE = 5;
    const COLUMN_USER_LAST_MODIFIED_DATE = 6;
    const COLUMN_USER_LAST_NAME = 7;
    const COLUMN_USER_MAIL = 8;
    const COLUMN_USER_PASSWORD = 9;
    const COLUMN_USER_PASSWORD_CHANGE_REQUIRED = 10;
    const COLUMN_USER_PASSWORD_RESET_LIMIT = 11;
    const COLUMN_USER_PASSWORD_RESET_TOKEN = 12;
    const COLUMN_USER_SECURITY_TOKEN = 13;
    const COLUMN_USER_START_DATE = 14;
    const COLUMN_USER_CREATEDBY_ID = 15;
    const COLUMN_USER_LAST_MODIFIEDBY_ID = 16;
    const COLUMN_USER_PRIMARYORGANIZATION_ID = 17;
    const COLUMN_USER_ROLE_ID = 18;

    public function __construct() {
        parent::__construct();

        // プロセスIDの取得
        $this->pid = getmypid();
        // エラー画面は非表示
        Configure::write('error', array());
    }

    /*
     * 社員マスタ連携API
     */
    public function jWHBErnSNG93JFHdkpuYucrrt3VGMsnB() {

        //*******************************************
        //** DRAGON連携判定
        //*******************************************
        if (Configure::read('DRAGON_SUBSCRIBES_SWITCH') !== true) {
            return;
        }

        //*******************************************
        //** 配信種別判定
        //*******************************************
        if (!isset($this->RequestPost['processType']) || empty($this->RequestPost['processType'])) {
            // Logger::err('processType invalid');
            throw new BadRequestException();
        }

        if ($this->RequestPost['processType'] === self::SINGLE) {
            //*******************************************
            //** ユーザ個別配信
            //*******************************************
            $result = $this->validatorOrganization($this->RequestPost);
            if ($result !== '') {
                Logger::warning($result);
                Logger::info($this->RequestPost);
                throw new BadRequestException();
            }
            $result = $this->validatorUser($this->RequestPost);
            if ($result !== '') {
                Logger::warning($result);
                Logger::info($this->RequestPost);
                throw new BadRequestException();
            }
            try {
                // トランザクション開始
                Database::getInstance()->dbConnect(Configure::read('DB_ADMIN_MASTER'));
                Database::getInstance()->dbBeginTransaction(Configure::read('DB_ADMIN_MASTER'));
                $this->recreateOrganization($this->RequestPost);
                $this->recreateUser($this->RequestPost);
                Database::getInstance()->dbCommit(Configure::read('DB_ADMIN_MASTER'));
            } catch (DBException $e) {
                Database::getInstance()->dbRollBack(Configure::read('DB_ADMIN_MASTER'));
                Logger::warning('transaction error. rollbacked. ' . $e->getMessage());
                Logger::info($this->RequestPost);
                throw new InternalErrorException();
            }
        } elseif ($this->RequestPost['processType'] === self::ALL_USER || $this->RequestPost['processType'] === self::ALL_ORGANIZATION) {
            try {
                $this->import();
            } catch (Exception $e) {
                Logger::warning($e->getMessage());
                throw new InternalErrorException();
            }
        } else {
            Logger::info('different processtype, ' . $this->RequestPost['processType']);
        }
    }

    /*
     * 組織情報の入力チェック
     *
     * @param array $data 組織情報 参照渡し
     * @return string エラーの場合はエラー内容、OKの場合は空文字
     */
    private function validatorOrganization(&$data) {
        //*******************************************
        //** 組織情報の入力チェック
        //*******************************************
        // 所属組織ID
        if (!isset($data['poId']) || !Validation::numeric($data['poId'])) {
            return "poId invalid";
        }
        // 所属組織CD
        if (!isset($data['poCd']) || !Validation::halfAlphaNumericSymbol($data['poCd']) || !Validation::between($data['poCd'], 1, 10)) {
            return "poCd invalid";
        }
        // 組織区分
        if (isset($data['poDiv'])) {
            if (!($data['poDiv'] == "" || Validation::numeric($data['poDiv']))) {
                return "poDiv invalid";
            }
        } else {
            $data['poDiv'] = '';
        }
        // 所属組織名
        if (!isset($data['poName']) || !Validation::between($data['poName'], 1, 50)) {
            return "poName invalid";
        }
        // メールアドレス
        if (isset($data['poMail'])) {
            $data['poMail'] = Func::trim($data['poMail']); // メールアドレスの末尾に空白が有るデータが有るので取り除く
            if ($data['poMail'] !== '' && (!Validation::halfAlphaNumericSymbol($data['poMail'])) || !Validation::maxLength($data['poMail'], 255)) {
                return "poMail invalid";
            }
        } else {
//                return "poMail invalid";
                $data['poMail'] = '';
        }
        // 適用開始日
        if (!isset($data['poStartDate']) || !$this->checkDateTime($data['poStartDate'])) {
            return "poStartDate invalid";
        }
        // 適用終了日
        if (!isset($data['poEndDate']) || !$this->checkDateTime($data['poEndDate'])) {
            return "poEndDate invalid";
        }
        // プロジェクトID
        if (isset($data['poProId'])) {
            if (!($data['poProId'] == "" || Validation::numeric($data['poProId']))) {
                return "poProId invalid";
            }
        } else {
            $data['poProId'] = '';
        }
        // 技術センターID
        if (isset($data['poTecId'])) {
            if (!($data['poTecId'] == "" || Validation::numeric($data['poTecId']))) {
                return "poTecId invalid";
            }
        } else {
            $data['poTecId'] = '';
        }
        // 並び順
        if (!isset($data['poSort']) || !Validation::numeric($data['poSort'])) {
            return "poSort invalid";
        }
        // 親組織ID
        if (isset($data['poParentId'])) {
            if (!($data['poParentId'] == "" || Validation::numeric($data['poParentId']))) {
                return "poParentId invalid";
            }
        } else {
            $data['poParentId'] = '';
        }
        return '';
    }

    /*
     * 組織情報の差し替え
     *
     * @param array $data 入力チェック済みの組織情報
     * @return void
     */
    private function recreateOrganization($data) {

        //*******************************************
        //** 組織情報の登録/更新
        //*******************************************
        // 組織情報の存在チェックをする。
        $query = <<<__EOT__
SELECT COUNT(*) AS count
FROM m_organization
WHERE id = :id
__EOT__;

        $param = array('id' => $data['poId']);
        $mOrganization = Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_MASTER'), $query, $param);

        // 組織情報が存在しない場合、登録する。存在する場合は更新する。
        if ($mOrganization['count'] == 0) {
            // 登録
            $query = <<<__EOT__
INSERT INTO m_organization (
    id
  , code
  , organization_div
  , organization_name
  , mail_address
  , start_date
  , end_date
  , project_id
  , technicalcenter_id
  , sort
  , parent_id
  , created_by
  , created
  , updated_by
  , updated
) VALUES (
    :id
  , :code
  , NULLIF(:organization_div, '')
  , :organization_name
  , NULLIF(:mail_address, '')
  , :start_date
  , :end_date
  , NULLIF(:project_id, '')
  , NULLIF(:technicalcenter_id, '')
  , :sort
  , NULLIF(:parent_id, '')
  , 'DRAGON'
  , NOW()
  , 'DRAGON'
  , NOW()
)
__EOT__;
            $param = array(
                'id' => $data['poId'],
                'code' => $data['poCd'],
                'organization_div' => $data['poDiv'],
                'organization_name' => $data['poName'],
                'mail_address' => $data['poMail'],
                'start_date' => $data['poStartDate'],
                'end_date' => $data['poEndDate'],
                'project_id' => $data['poProId'],
                'technicalcenter_id' => $data['poTecId'],
                'sort' => $data['poSort'],
                'parent_id' => $data['poParentId']
            );
        } else {
            // 更新
            $query = <<<__EOT__
UPDATE m_organization
SET code = :code
  , organization_div = NULLIF(:organization_div, '')
  , organization_name = :organization_name
  , mail_address = NULLIF(:mail_address, '')
  , start_date = :start_date
  , end_date = :end_date
  , project_id = NULLIF(:project_id, '')
  , technicalcenter_id = NULLIF(:technicalcenter_id, '')
  , sort = :sort
  , parent_id = NULLIF(:parent_id, '')
  , updated_by = 'DRAGON'
  , updated = NOW()
WHERE id = :id
__EOT__;
            $param = array(
                'code' => $data['poCd'],
                'organization_div' => $data['poDiv'],
                'organization_name' => $data['poName'],
                'mail_address' => $data['poMail'],
                'start_date' => $data['poStartDate'],
                'end_date' => $data['poEndDate'],
                'project_id' => $data['poProId'],
                'technicalcenter_id' => $data['poTecId'],
                'sort' => $data['poSort'],
                'parent_id' => $data['poParentId'],
                'id' => $data['poId']
            );
        }
        $result = Database::getInstance()->dbExecute(Configure::read('DB_ADMIN_MASTER'), $query, $param);
    }

    /*
     * ユーザ情報の入力チェック
     *
     * @param array $data ユーザ情報 参照渡し
     * @return string エラーの場合はエラー内容、OKの場合は空文字
     */
    private function validatorUser(&$data) {
        //*******************************************
        //** ユーザ情報の入力チェック
        //*******************************************
        // ID
        if (!isset($data['uId']) || !Validation::numeric($data['uId'])) {
            return "uId invalid";
        }
        // 従業員CD
        if (!isset($data['uCd']) || !Validation::halfAlphaNumericSymbol($data['uCd']) || !Validation::between($data['uCd'], 1, 10)) {
            return "uCd invalid";
        }
        // 従業員名(姓)
        if (!isset($data['lastName']) || !Validation::between($data['lastName'], 1, 40)) {
            return "lastName invalid";
        }
        // 従業員名(名)
        if (!isset($data['firstName']) || !Validation::maxLength($data['firstName'], 40)) {
            return "firstName invalid";
        }
        // メールアドレス
        if (isset($data['uMail'])) {
            $data['uMail'] = Func::trim($data['uMail']); // メールアドレスの末尾に空白が有るデータが有るので取り除く
            if ($data['uMail'] !== '' && (!Validation::halfAlphaNumericSymbol($data['uMail'])) || !Validation::maxLength($data['uMail'], 255)) {
                return "uMail invalid";
            }
        } else {
//                return "uMail invalid";
                $data['uMail'] = '';
        }
        // パスワード
        if (!isset($data['pass']) || !Validation::halfAlphaNumericSymbol($data['pass']) || !Validation::between($data['pass'], 1, 65)) {
            return "pass invalid";
        }
        // セキュリティトークン
        if (!isset($data['token']) || !Validation::halfAlphaNumericSymbol($data['token']) || !Validation::between($data['token'], 1, 65)) {
            return "token invalid";
        }
        // 適用開始日
        if (!isset($data['uStartDate']) || !$this->checkDateTime($data['uStartDate'])) {
            return "uStartDate invalid";
        }
        // 適用終了日
        if (!isset($data['uEndDate']) || !$this->checkDateTime($data['uEndDate'])) {
            return "uEndDate invalid";
        }
        // 所属組織ID
        if (!isset($data['poId']) || !Validation::numeric($data['poId'])) {
            return "poId invalid";
        }
        return '';
    }

    /*
     * ユーザ情報の差し替え
     *
     * @param array $data 入力チェック済みのユーザ情報
     * @return void
     */
    private function recreateUser($data) {
        //*******************************************
        //** ユーザ情報の登録/更新
        //*******************************************
        // ユーザ情報の存在チェックをする。
        $query = <<<__EOT__
SELECT COUNT(*) AS count
FROM m_user
WHERE id = :id
__EOT__;

        $param = array('id' => $data['uId']);
        $mUser = Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_MASTER'), $query, $param);

        // ユーザ情報が存在しない場合、登録する。存在する場合は更新する。
        if ($mUser['count'] == 0) {
            // 登録
            $query = <<<__EOT__
INSERT INTO m_user (
    id
  , code
  , last_name
  , first_name
  , mail_address
  , password
  , token
  , organization_id
  , start_date
  , end_date
  , created_by
  , created
  , updated_by
  , updated
) VALUES (
    :id
  , :code
  , :last_name
  , NULLIF(:first_name, '')
  , NULLIF(:mail_address, '')
  , :password
  , :token
  , :organization_id
  , :start_date
  , :end_date
  , 'DRAGON'
  , NOW()
  , 'DRAGON'
  , NOW()
)
__EOT__;
            $param = array('id' => $data['uId'], 'code' => $data['uCd'], 'last_name' => $data['lastName'], 'first_name' => $data['firstName']
                , 'mail_address' => $data['uMail'], 'password' => $data['pass'], 'token' => $data['token'], 'organization_id' => $data['poId']
                , 'start_date' => $data['uStartDate'], 'end_date' => $data['uEndDate']);
        } else {
            // 更新
            $query = <<<__EOT__
UPDATE m_user
SET code = :code
  , last_name = :last_name
  , first_name = NULLIF(:first_name, '')
  , mail_address = NULLIF(:mail_address, '')
  , password = :password
  , token = :token
  , organization_id = :organization_id
  , start_date = :start_date
  , end_date = :end_date
  , updated_by = 'DRAGON'
  , updated = NOW()
WHERE id = :id
__EOT__;
            $param = array('code' => $data['uCd'], 'last_name' => $data['lastName'], 'first_name' => $data['firstName']
                , 'mail_address' => $data['uMail'], 'password' => $data['pass'], 'token' => $data['token'], 'organization_id' => $data['poId']
                , 'start_date' => $data['uStartDate'], 'end_date' => $data['uEndDate'], 'id' => $data['uId']);
        }
        $result = Database::getInstance()->dbExecute(Configure::read('DB_ADMIN_MASTER'), $query, $param);

        //*******************************************
        //** 権限情報の登録
        //*******************************************
        // ユーザの終了日が過去の場合は権限を付与しない。
        if (strtotime($data['uEndDate']) < time()) {
            return;
        }

        // ユーザが所属する部署のデフォルト権限を取得する。
        $query = <<<__EOT__
SELECT distinct def.role_id
FROM t_default_role def
  LEFT JOIN m_organization org1 ON def.organization_id = org1.parent_id
  LEFT JOIN m_organization org2 ON org1.id = org2.parent_id
WHERE def.organization_id = :organization_id
   OR org1.id = :organization_id
   OR org2.id = :organization_id
ORDER BY def.role_id
__EOT__;

        $param = array('organization_id' => $data['poId']);
        $tDefaultRole = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_MASTER'), $query, $param);

        if (!empty($tDefaultRole)) {
            // ユーザの権限を取得する。
            $query = <<<__EOT__
SELECT role_id
FROM t_role
WHERE user_id = :user_id
ORDER BY role_id
__EOT__;

            $param = array('user_id' => $data['uId']);
            $tRole = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_MASTER'), $query, $param);
            $userRole = array();
            if (!empty($tRole)) {
                foreach ($tRole as $value) {
                    $userRole[] = $value['role_id'];
                }
            }
            foreach ($tDefaultRole as $value) {
                if (in_array($value['role_id'], $userRole) === false) {
                    // 登録
                    $query = <<<__EOT__
INSERT INTO t_role (
    id
  , user_id
  , role_id
  , created_by
  , created
  , updated_by
  , updated
) VALUES (
    NULL
  , :user_id
  , :role_id
  , 'SYSTEM'
  , NOW()
  , 'SYSTEM'
  , NOW()
)
__EOT__;
                    $param = array('user_id' => $data['uId'], 'role_id' => $value['role_id']);
                    $result = Database::getInstance()->dbExecute(Configure::read('DB_ADMIN_MASTER'), $query, $param);
                }
            }
        }
    }

    /*
     * 日時の妥当性チェック
     * ユーザ個別配信の場合はUNIXタイムスタンプで連携されるので、数値及び桁数チェックと日付への変換を行う
     * ユーザマスタ一括配信、組織情報一括配信の場合は日時で連携されるので、日時の妥当性チェックを行う
     *
     * @param string &$check チェック対象文字列 参照渡し
     * @return bool
     */
    private function checkDateTime(&$check) {
        if ($this->RequestPost['processType'] === self::SINGLE) {
            if (!Validation::numericHyphen($check) || !Validation::between($check, 1, 16)) {
                return false;
            }
            $dateTime = new DateTime();
            $dateTime->setTimestamp($check / 1000);
            $check = $dateTime->format(self::DATE_FORMAT);
        } else {
            if (!Validation::between($check, 19, 19)) {
                return false;
            }
            $encoding = Configure::read('DEFAULT_CHARSET');
            $hour = mb_substr($check, 11, 2, $encoding);
            $minute = mb_substr($check, 14, 2, $encoding);
            $second = mb_substr($check, 17, 2, $encoding);
            $month = mb_substr($check, 5, 2, $encoding);
            $day = mb_substr($check, 8, 2, $encoding);
            $year = mb_substr($check, 0, 4, $encoding);
            if (!Validation::checkDateTime($hour, $minute, $second, $month, $day, $year)) {
                return false;
            }
        }
        return true;
    }

    /*
     * マスタファイルの一括取り込み
     *
     * @return void
     * @throws InternalErrorException マスタファイルの取得に失敗したとき
     */
    private function import() {
        $processType = $this->RequestPost['processType'];
        if ($processType !== self::ALL_USER && $processType !== self::ALL_ORGANIZATION) {
            return;
        }

        if ($processType === self::ALL_USER) {
            $remoteFile = Configure::read('DRAGON_DATA_DIR') . DS . self::ALL_USER . ".csv";
            $localFile = SUBSCRIBES_DIR . DS . self::ALL_USER . "_" . $this->pid . ".csv";
            $validator = "validatorUser";
            $recreate = "recreateUser";
        } else {
            $remoteFile = Configure::read('DRAGON_DATA_DIR') . DS . self::ALL_ORGANIZATION . ".csv";
            $localFile = SUBSCRIBES_DIR . DS . self::ALL_ORGANIZATION . "_" . $this->pid . ".csv";
            $validator = "validatorOrganization";
            $recreate = "recreateOrganization";
        }

        //*******************************************
        //** SCPでファイル取得
        //*******************************************
        $fp = fopen($localFile, "w");
        if ($fp === false) {
            throw new InternalErrorException("file open error, " . $localFile);
        }
        $dragonServers = Configure::read('DRAGON_SERVER');
        $iPass = Configure::read('DRAGON_LOGIN_ID') . ":" . Configure::read('DRAGON_PASSWORD');
        $fileGetFlag = false;
        $errors = array();
        foreach ($dragonServers as $dragonServer) {
            $url = "scp://" . $dragonServer . $remoteFile;
            // CURLオブジェクトの初期化
            $ch = curl_init($url);
            // 転送内容が書き込まれるファイル
            curl_setopt($ch, CURLOPT_FILE, $fp);
            // ヘッダーの内容を出力しない
            curl_setopt($ch, CURLOPT_HEADER, false);
            // タイムアウト
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            // パスワードによる認証
            curl_setopt($ch, CURLOPT_SSH_AUTH_TYPES, CURLSSH_AUTH_PASSWORD);
            // Id:Password
            curl_setopt($ch, CURLOPT_USERPWD, $iPass);

            $result = curl_exec($ch);

            if ($result === true) {
                $fileGetFlag = true;
            } else {
                $errors[] = curl_errno($ch);
                $errors[] = curl_error($ch);
                $errors[] = curl_getinfo($ch);
            }
            curl_close($ch);
            if ($fileGetFlag) {
                break;
            }
        }
        fclose($fp);
        unset($fp);
        if (!$fileGetFlag) {
            Logger::info($errors);
            throw new InternalErrorException("scp file get error");
        }

        //*******************************************
        //** マスタファイルの一括取り込み
        //*******************************************
        $fp = fopen($localFile, "r");
        if ($fp === false) {
            throw new InternalErrorException("file open error, " . $localFile);
        }
        $count = 0;
        $errorLog = '';
        while (($buffer = fgets($fp)) !== false) {
            // 1行目はヘッダ行なので読み飛ばし
            $count++;
            if ($count === 1) {
                continue;
            }

            mb_convert_variables('UTF-8', 'SJIS-win', $buffer);
            $dummy = str_getcsv($buffer, ',', '"', '"');
            // 最後の1行が空行なのでそれを読み飛ばすための処理
            if (count($dummy) === 1) {
                continue;
            }
            $data = array();
            if ($processType === self::ALL_USER) {
                $data['uId'] = $dummy[self::COLUMN_USER_ID];
                $data['uCd'] = $dummy[self::COLUMN_USER_CODE];
                $data['lastName'] = $dummy[self::COLUMN_USER_LAST_NAME];
                $data['firstName'] = $dummy[self::COLUMN_USER_FIRST_NAME];
                $data['uMail'] = $dummy[self::COLUMN_USER_MAIL];
                $data['pass'] = $dummy[self::COLUMN_USER_PASSWORD];
                $data['token'] = $dummy[self::COLUMN_USER_SECURITY_TOKEN];
                $data['uStartDate'] = $dummy[self::COLUMN_USER_START_DATE];
                $data['uEndDate'] = $dummy[self::COLUMN_USER_END_DATE];
                $data['poId'] = $dummy[self::COLUMN_USER_PRIMARYORGANIZATION_ID];
            } else {
                $data['poId'] = $dummy[self::COLUMN_ORGANIZATION_ID];
                $data['poCd'] = $dummy[self::COLUMN_ORGANIZATION_CODE];
                $data['poDiv'] = $dummy[self::COLUMN_ORGANIZATION_ORGANIZATION_DIV];
                $data['poName'] = $dummy[self::COLUMN_ORGANIZATION_ORGANIZATION_NAME];
                $data['poMail'] = $dummy[self::COLUMN_ORGANIZATION_MAIL];
                $data['poStartDate'] = $dummy[self::COLUMN_ORGANIZATION_START_DATE];
                $data['poEndDate'] = $dummy[self::COLUMN_ORGANIZATION_END_DATE];
                $data['poProId'] = $dummy[self::COLUMN_ORGANIZATION_PROJECT_ID];
                $data['poTecId'] = $dummy[self::COLUMN_ORGANIZATION_TECHNICALCENTER_ID];
                $data['poSort'] = $dummy[self::COLUMN_ORGANIZATION_SORT];
                $data['poParentId'] = $dummy[self::COLUMN_ORGANIZATION_PARENT_ID];
            }

            $result = $this->$validator($data);
            if ($result !== '') {
                $errorLog.= "{$result}\n" . print_r($data, true);
                continue;
            }
            try {
                // トランザクション開始
                Database::getInstance()->dbConnect(Configure::read('DB_ADMIN_MASTER'));
                Database::getInstance()->dbBeginTransaction(Configure::read('DB_ADMIN_MASTER'));
                $this->$recreate($data);
                Database::getInstance()->dbCommit(Configure::read('DB_ADMIN_MASTER'));
            } catch (DBException $e) {
                Database::getInstance()->dbRollBack(Configure::read('DB_ADMIN_MASTER'));
                $errorLog.= "transaction error. rollbacked. " . $e->getMessage() . "\n" . print_r($data, true);
            }
        }
        fclose($fp);
        if ($errorLog !== '') {
            Logger::err($errorLog);
        }
        @unlink($localFile);
    }

}
