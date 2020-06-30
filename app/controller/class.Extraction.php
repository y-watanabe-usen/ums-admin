<?php 
// ライブラリ読み込み
require_once(LIB_DIR . DS . 'class.Cipher.php');

/*
 * データ抽出
 */
class Extraction extends Controller {

    const ORDER_RECEIVED_DIV = '1'; // 契約区分：受注
    const OUTPUT_BRANCH_DIV = '1';  // チェーン店登録の出力区分 : 支店CD毎
    const OUTPUT_CUST_DIV = '2';    // チェーン店登録の出力区分 : 顧客CD毎

    public $output_type_div = array(
        self::OUTPUT_BRANCH_DIV => "支店CD毎に出力", 
        self::OUTPUT_CUST_DIV   => "顧客CD毎に出力"
    );

    /*
     * コンストラクタ
     */
    public function beforeFilter() {
        // ログインチェック
        $this->checkLogin();
        // 権限チェック
        $this->checkAcl();
    }

    public function index() {
        if ($this->Acl->check($this->Auth->user("role_id"), "/extraction/inited_cust_cd_download/")) {
            Func::redirect("/extraction/inited_cust_cd_download/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/extraction/id_pw_download/")) {
            Func::redirect("/extraction/id_pw_download/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/extraction/issue_history_download/")) {
            Func::redirect("/extraction/issue_history_download/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/extraction/mail_address_init_import/")) {
            Func::redirect("/extraction/mail_address_init_import/");
        } else {
            Logger::warning("Forbidden Exception.");
            throw new ForbiddenException();
        }
        return;
    }

    /*
     * 初回登録顧客抽出画面
     */
    public function inited_cust_cd_download() {
        $this->set('titleName', "初回登録済顧客抽出");
        $err_message = "";

        //サービスマスタを取得する
        $query = "SELECT service_cd, service_name FROM m_service WHERE delete_flag = '0' ORDER BY id";
        $param = array();
        $serviceList = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, $param);
        $this->set("serviceList", $serviceList);

        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] === "download") {
            // ダウンロードボタン押下
            // 入力チェック
            // from,toのチェック
            if (!empty($this->RequestPost["from"])) {
                if (!Validation::checkYmd($this->RequestPost["from"])) {
                    $err_message .= "初回認証日FROMを正しく入力してください。\n";
                }
            }
            if (!empty($this->RequestPost["to"])) {
                if (!Validation::checkYmd($this->RequestPost["to"])) {
                    $err_message .= "初回認証日TOを正しく入力してください。\n";
                }
            }
            if ($err_message === "" && !empty($this->RequestPost["from"]) && !empty($this->RequestPost["to"])) {
                $from = new DateTime($this->RequestPost["from"]);
                $to = new DateTime($this->RequestPost["to"]);
                if ($from > $to) {
                    $err_message .= "初回認証日はFrom <= Toで入力してください。\n";
                }
            }
            // サービスのチェック
            if (empty($this->RequestPost["service"]) && !Validation::numeric($this->RequestPost["service"]) || !Validation::maxLength($this->RequestPost["service"], 9)) {
                $err_message .= "サービスが不正です。\n";
            } else {
                // サービス取得
                $query = "SELECT service_cd, service_name FROM m_service WHERE service_cd = :service_cd AND delete_flag = '0'";
                $service = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, array("service_cd" => $this->RequestPost["service"]));
                if (empty($service)) {
                    $err_message .= "サービスが不正です。\n";
                }
            }
            if ($err_message !== "") {
                $this->set("err_message", $err_message);
                $this->render('extraction' . DS . 'inited_cust_cd_download.tpl');
                return;
            }

            $where = "";
            $param = array();
            if (!empty($this->RequestPost["from"])) {
                $where .= "AND tus.init_auth_datetime >= :from ";
                $param["from"] = $this->RequestPost["from"] . " 00:00:00";
            }
            if (!empty($this->RequestPost["to"])) {
                $where .= "AND tus.init_auth_datetime <= :to ";
                $param["to"] = $this->RequestPost["to"] . " 23:59:59";
            }
            if ($where === "") {
                $where .= "AND tus.init_auth_datetime IS NOT NULL ";
            }

            $serviceCd = $service[0]["service_cd"];
            $serviceName = $service[0]["service_name"];
            $param["service_cd"] = $serviceCd;

            // 件数取得
            $query = "SELECT COUNT(*) AS count "
                    . "FROM m_account ma "
                    . "  INNER JOIN t_unis_cust tuc ON (ma.t_unis_cust_id = tuc.id AND tuc.delete_flag = '0') "
                    . "  INNER JOIN t_unis_service tus ON (tuc.id = tus.t_unis_cust_id AND tus.delete_flag = '0') "
                    . "WHERE 1 = 1 "
                    . $where
                    . "AND ma.account_div = '0' "
                    . "AND tus.service_cd = :service_cd "
                    . "AND ma.delete_flag = '0' ";
            $count = Database::getInstance()->dbExecFetch(Configure::read('DB_SLAVE'), $query, $param);

            // 1万件を超える場合はエラー
            if ($count["count"] > 10000) {
                $err_message .= "件数が1万件を超えています。検索条件を再設定し再度ダウンロードしてください。\n";
                $this->set("err_message", $err_message);
                $this->render('extraction' . DS . 'inited_cust_cd_download.tpl');
                return;
            }

            // データ取得
            $query = "SELECT tuc.cust_cd "
                    . "             , tuc.status_flag AS cust_status_flag "
                    . "             , tuc.name "
                    . "             , tuc.tel "
                    . "             , tuc.zip_cd "
                    . "             , tuc.address1 "
                    . "             , tuc.address2 "
                    . "             , tuc.address3 "
                    . "             , (SELECT issue_date FROM t_issue_history WHERE t_unis_cust_id = tuc.id AND delete_flag = '0' ORDER BY id DESC LIMIT 1) AS issue_date "
                    . "             , ma.id AS m_account_id "
                    . "             , ma.mail_address "
                    . "             , ma.init_date "
                    . "             , ma.status_flag AS account_status_flag "
                    . "             , ma.admin_status_flag AS account_admin_status_flag "
                    . "             , tus.id AS t_unis_service_id "
                    . "             , tus.init_auth_datetime "
                    . "             , tus.status_flag AS service_status_flag "
                    . "             , tus.admin_status_flag AS service_admin_status_flag "
                    . "             , tuc.branch_cd "
                    . "             , tuc.branch_name "
                    . "             , tuc.chain_cd "
                    . "             , tuc.chain_name "
                    . "             , tuc.industry_cd "
                    . "             , tuc.industry_name "
                    . "FROM m_account ma "
                    . "  INNER JOIN t_unis_cust tuc ON (ma.t_unis_cust_id = tuc.id AND tuc.delete_flag = '0') "
                    . "  INNER JOIN t_unis_service tus ON (ma.id = tus.m_account_id AND tus.delete_flag = '0') "
                    . "WHERE 1 = 1 "
                    . $where
                    . "AND ma.account_div = '0' "
                    . "AND tus.service_cd = :service_cd "
                    . "AND ma.delete_flag = '0' "
                    . "ORDER BY tuc.cust_cd, ma.id, tus.id ";
            $fetchResult = Database::getInstance()->dbExecute(Configure::read('DB_SLAVE'), $query, $param);

            //1件でも取得できれば、ファイル出力する
            $firstRow = $fetchResult->fetch(PDO::FETCH_ASSOC);
            if (isset($firstRow["cust_cd"]) && $firstRow["cust_cd"] != "") {
                $header = array(
                    '顧客CD', '顧客ステータス', '設置先名称', '設置先電話番号', '設置先郵便番号',
                    '設置先住所1', '設置先住所2', '設置先住所3', '発送日（最新）', 'アカウントID', '初回登録日', '初回認証日時', 'アカウントステータス',
                    $serviceName . '利用可否', '管轄支店コード', '管轄支店名', 'メールアドレス', 'チェーン店CD', 'チェーン店名', '業種CD', '業種名'
                );
                $csvFile = $serviceCd . "_inited_cust_cd_" . date("YmdHis") . ".csv";

                // CSV出力
                header('Content-Type: application/force-download');
                header('Content-disposition: attachment; filename="' . $csvFile . '"');
                ob_start();
                $stream = fopen('php://output', 'w');
                fputcsv($stream, $header);

                $this->get_preference();
                fputcsv($stream, $this->get_inited_cust_cd_row($firstRow));

                while ($row = $fetchResult->fetch(PDO::FETCH_ASSOC)) {
                    fputcsv($stream, $this->get_inited_cust_cd_row($row));
                }

                $output = ob_get_contents();
                ob_end_clean();
                $output = str_replace("\n", "\r\n", $output);
                echo mb_convert_encoding($output, "SJIS-win", "UTF-8");
                return;
            } else {
                $err_message = "対象データはありません。";
            }
        }

        $this->set("err_message", $err_message);
        $this->render('extraction' . DS . 'inited_cust_cd_download.tpl');
    }

    /*
     * ID/PW抽出（顧客CD指定）画面
     */
    public function id_pw_download() {
        // 処理に時間がかかるためタイムアウトを長めに設定する
        set_time_limit(300);

        $this->set('titleName', "ID/PW抽出（顧客CD指定）");
        $err_message = "";
        // サービス取得
        $service = $this->get_service_master();
        $chkService = array();
        foreach($service as $row) {
            $chkService[] = $row['service_cd'];
        }
        $this->set("service", $service);

        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] === "download") {
            // ダウンロードボタン押下
            // 入力チェック
            if (empty($_FILES) || strcasecmp(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION), "csv") != 0) {
                $err_message .= "CSVファイルを選択してください。\n";
            }
            if (empty($this->RequestPost["service_cd"]) || !in_array($this->RequestPost["service_cd"], $chkService)) {
                $err_message .= "サービスを正しく選択してください。\n";
            }

            if ($err_message == "") {
                // ID/PW抽出
                setlocale(LC_ALL, 'ja_JP.UTF-8');
                $handle = fopen($_FILES['file']['tmp_name'], "r");
                if ($handle === false) {
                    Logger::warning("file open error.({$_FILES['file']['tmp_name']})");
                    throw new InternalErrorException();
                }

                $put_data[] = array("顧客CD", "設置先名称", "チェーン店CD", "チェーン店名称", "ログインID", "パスワード", "メールアドレス", "備考");
                while (($buffer = fgets($handle)) !== false) {
                    mb_convert_variables('UTF-8', 'SJIS-win', $buffer);
                    list($cust_cd) = str_getcsv($buffer, ',', '"', '"');

                    // 顧客CDの入力チェック
                    if (!Validation::numeric($cust_cd) || !Validation::maxLength($cust_cd, 9)) {
                        $put_data[] = array($cust_cd);
                        continue;
                    }

                    // アカウントの検索
                    $query = " SELECT tuc.id AS t_unis_cust_id, tuc.cust_cd, tuc.name, tuc.chain_cd, tuc.chain_name, tuc.status_flag AS t_unis_cust_status_flag "
                           . "   , ma.id AS m_account_id, ma.login_id, ma.init_password, ma.mail_address, ma.init_date, ma.status_flag AS m_account_status_flag "
                           . "   , tus.id AS t_unis_service_id, tus.admin_status_flag AS t_unis_service_admin_status_flag "
                           . "   , (SELECT COUNT(*) "
                           . "      FROM t_service_stop_history tssh "
                           . "      WHERE tssh.t_unis_service_id = tus.id "
                           . "      AND stop_div = '1' "
                           . "      AND ((tssh.start_datetime <= NOW() AND tssh.release_datetime >= NOW()) "
                           . "        OR (tssh.start_datetime <= NOW() AND tssh.release_datetime IS NULL)) "
                           . "      AND tssh.delete_flag = '0') AS stop_count "
                           . "   , (SELECT COUNT(*) "
                           . "      FROM t_service_stop_history tssh "
                           . "      WHERE tssh.t_unis_service_id = tus.id "
                           . "      AND stop_div = '2' "
                           . "      AND ((tssh.start_datetime <= NOW() AND tssh.release_datetime >= NOW()) "
                           . "        OR (tssh.start_datetime <= NOW() AND tssh.release_datetime IS NULL)) "
                           . "      AND tssh.delete_flag = '0') AS lock_count "
                           . " FROM t_unis_cust tuc "
                           . "   INNER JOIN m_account ma "
                           . "     ON tuc.id = ma.t_unis_cust_id AND ma.delete_flag = '0' "
                           . "   INNER JOIN t_unis_service tus "
                           . "     ON ma.id = tus.m_account_id AND tus.service_cd = :service_cd AND tus.status_flag = '0' AND tus.delete_flag = '0' "
                           . " WHERE tuc.cust_cd = :cust_cd "
                           . " AND tuc.delete_flag = '0' "
                           . " AND ma.account_div = '0' "
                           . " ORDER BY ma.id ";
                    $param = array("cust_cd" => $cust_cd, "service_cd" => $this->RequestPost["service_cd"]);
                    $result = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, $param);

                    if (empty($result)) {
                        // 存在しない顧客CD
                        $put_data[] = array($cust_cd);
                        continue;
                    }
                    foreach ($result as $row) {
                        if ($row["t_unis_cust_status_flag"] !== "1" && $row["t_unis_cust_status_flag"] !== "2") {
                            // 顧客キャンセルもしくは顧客解約
                            $put_data[] = array($cust_cd);
                            continue;
                        } else if (empty($row["t_unis_service_id"])) {
                            // OTORAKU利用不可
                            $put_data[] = array($cust_cd);
                            continue;
                        }
                        $login_id = Cipher::rsaDecrypt($row["login_id"]);
                        if (empty($row["init_date"])) {
                            $password = Cipher::rsaDecrypt($row["init_password"]);
                        } else {
                            $password = "お客様にて設定されたパスワード";
                        }
                        $mail_address = "";
                        if (!empty($row["mail_address"])) {
                            $mail_address = Cipher::rsaDecrypt($row["mail_address"]);
                        }
                        $biko = "";
                        if ($row["t_unis_service_admin_status_flag"] === "1") {
                            $biko = "停止中";
                        } elseif ($row["stop_count"] > 0) {
                            $biko = "休店中";
                        } elseif ($row["lock_count"] > 0) {
                            $biko = "停止中";
                        }
                        $put_data[] = array(
                            $cust_cd,
                            $row["name"],
                            $row["chain_cd"],
                            $row["chain_name"],
                            $login_id,
                            $password,
                            $mail_address,
                            $biko,
                        );
                    }
                }

                // CSV出力
                $csvFile = date("YmdHis") . "_ID_PWリスト.csv";

                header('Content-Type: application/force-download');
                header('Content-disposition: attachment; filename="' . mb_convert_encoding($csvFile, 'SJIS-win', 'UTF-8') . '"');
                ob_start();
                $stream = fopen('php://output', 'w');

                foreach ($put_data as $value) {
                    fputcsv($stream, $value);
                }

                $output = ob_get_contents();
                ob_end_clean();
                $output = str_replace("\n", "\r\n", $output);
                echo mb_convert_encoding($output, "SJIS-win", "UTF-8");
                return;
            }
        }
        $selected_service = "100";
        if(!empty($this->RequestPost['service_cd'])) {
            $selected_service = $this->RequestPost['service_cd'];
        }
        $this->set("selected_service", $selected_service);
        $this->set("err_message", $err_message);
        $this->render('extraction' . DS . 'id_pw_download.tpl');
    }

    /*
     * アカウント証発送履歴抽出画面
     */
    public function issue_history_download() {
        $this->set('titleName', "アカウント証発送履歴抽出");
        $err_message = "";

        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] === "download") {
            // ダウンロードボタン押下
            // 入力チェック
            // from,toのチェック
            if (!empty($this->RequestPost["from"])) {
                if (!Validation::checkYmd($this->RequestPost["from"])) {
                    $err_message .= "発送日FROMを正しく入力してください。\n";
                }
            }
            if (!empty($this->RequestPost["to"])) {
                if (!Validation::checkYmd($this->RequestPost["to"])) {
                    $err_message .= "発送日TOを正しく入力してください。\n";
                }
            }
            if ($err_message === "" && !empty($this->RequestPost["from"]) && !empty($this->RequestPost["to"])) {
                $from = new DateTime($this->RequestPost["from"]);
                $to = new DateTime($this->RequestPost["to"]);
                if ($from > $to) {
                    $err_message .= "発送日はFrom <= Toで入力してください。\n";
                }
            }

            if ($err_message !== "") {
                $this->set("err_message", $err_message);
                $this->render('extraction' . DS . 'issue_history_download.tpl');
                return;
            }

            $where = "";
            $param = array();
            if (!empty($this->RequestPost["from"])) {
                $where .= "AND tih.issue_date >= :from ";
                $param["from"] = $this->RequestPost["from"] . " 00:00:00";
            }
            if (!empty($this->RequestPost["to"])) {
                $where .= "AND tih.issue_date <= :to ";
                $param["to"] = $this->RequestPost["to"] . " 23:59:59";
            }

            // 件数取得
            $query = "SELECT COUNT(*) AS count "
                   . "FROM t_unis_cust tuc "
                   . "  INNER JOIN t_issue_history tih ON tuc.id = tih.t_unis_cust_id AND tih.delete_flag = '0' "
                   . "WHERE 1 = 1 "
                   . $where
                   . "AND tih.status_flag <> '0' "
                   . "AND tuc.delete_flag = '0' ";
            $count = Database::getInstance()->dbExecFetch(Configure::read('DB_SLAVE'), $query, $param);

            // 1万件を超える場合はエラー
            if ($count["count"] > 10000) {
                $err_message .= "件数が1万件を超えています。検索条件を再設定し再度ダウンロードしてください。\n";
                $this->set("err_message", $err_message);
                $this->render('extraction' . DS . 'issue_history_download.tpl');
                return;
            }

            // データ取得
            $query = "SELECT tuc.cust_cd "
                   . "    , tuc.status_flag AS cust_status_flag "
                   . "    , tuc.name "
                   . "    , tih.issue_date "
                   . "    , tih.not_arrived_date "
                   . "    , tih.status_flag AS issue_history_status_flag "
                   . "FROM t_unis_cust tuc "
                   . "  INNER JOIN t_issue_history tih ON tuc.id = tih.t_unis_cust_id AND tih.delete_flag = '0' "
                   . "WHERE 1 = 1 "
                   . $where
                   . "AND tih.status_flag <> '0' "
                   . "AND tuc.delete_flag = '0' "
                   . "ORDER BY tuc.cust_cd, tih.id ";
            $fetchResult = Database::getInstance()->dbExecute(Configure::read('DB_SLAVE'), $query, $param);

            //1件でも取得できれば、ファイル出力する
            $firstRow = $fetchResult->fetch(PDO::FETCH_ASSOC);
            if (isset($firstRow["cust_cd"]) && $firstRow["cust_cd"] != "") {
                $header = array('顧客CD', '顧客ステータス', '設置先名称', '発送日', '未着日', '発送ステータス');
                $csvFile = date("YmdHis") . "_アカウント証発送履歴リスト.csv";

                // CSV出力
                header('Content-Type: application/force-download');
                header('Content-disposition: attachment; filename="' . mb_convert_encoding($csvFile, 'SJIS-win', 'UTF-8') . '"');
                ob_start();
                $stream = fopen('php://output', 'w');
                fputcsv($stream, $header);

                $this->get_preference();
                fputcsv($stream, $this->get_issue_history_row($firstRow));

                while ($row = $fetchResult->fetch(PDO::FETCH_ASSOC)) {
                    fputcsv($stream, $this->get_issue_history_row($row));
                }

                $output = ob_get_contents();
                ob_end_clean();
                $output = str_replace("\n", "\r\n", $output);
                echo mb_convert_encoding($output, "SJIS-win", "UTF-8");
                return;
            } else {
                $err_message = "対象データはありません。";
            }
        }

        $this->set("err_message", $err_message);
        $this->render('extraction' . DS . 'issue_history_download.tpl');
    }

    /*
     * チェーン店初回登録・ID/PW抽出画面
     */
    public function chain_store_bulk_regist() {
        $this->get_preference();
        $data = array();
        $put_data = array();
        $err_message = "";
        if (isset($this->RequestPost["type"])) {
            setlocale(LC_ALL, 'ja_JP.UTF-8');
            if ($this->RequestPost["type"] === "upload") {
                // 入力チェック
                $backup_file = Configure::read('EXTRACTION_DIR') . "chain_store_bulk_regist_" .date("YmdHis") . ".csv";
                if (empty($_FILES) || strcasecmp(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION), "csv") != 0) {
                    $err_message .= "CSVファイルを選択してください。\n";
                    //バックアップ取得
                } else if (!move_uploaded_file($_FILES["file"]["tmp_name"], $backup_file)) {
                    Logger::warning("move_uploaded_file error.($backup_file)");
                    $err_message .= "予期せぬエラーが発生しました。\n";
                }

                if (empty($this->RequestPost['output_type']) || !array_key_exists($this->RequestPost['output_type'], $this->output_type_div)) {
                    $err_message .= "出力形式を正しく選択してください。\n";
                }

                if ($err_message == "") {
                    // 仮ID/PW抽出(確認・完了共通処理）
                    $file_chk_result = $this->chainStoreFileTransact($backup_file);
                    if ($file_chk_result['line_cnt'] > 5000) {
                        $err_message .= "一度に登録できる件数は5000件までです。";
                        $file_chk_result['put_data'] = array();
                        $file_chk_result['line_cnt'] = 0;
                        $file_chk_result['err_cnt'] = 0;
                    }
                    if ($file_chk_result['line_cnt'] > 0 && $file_chk_result['err_cnt'] == 0) {
                        //backup_fileのpathをSESSIONに保持
                        Session::set($this->controller . $this->action, $backup_file);
                        //内容を反映するボタンを活性化
                        $this->set("save_button", true);
                        //20件残して、それより古いファイルは削除
                        $file_list = $this->get_file_list(Configure::read('EXTRACTION_DIR'));
                        $fcnt = 0;
                        foreach ($file_list as $file) {
                            if (preg_match('/\Achain_store_bulk_regist_[0-9]{14}\.csv\z/u', $file["name"])) {
                                $fcnt++;
                                if ($fcnt > 20) {
                                    unlink(Configure::read('EXTRACTION_DIR') . $file["name"]);
                                }
                            }
                        }
                    }
                //エラーがある場合、backup_fileを削除
                } else {
                    if (file_exists($backup_file)) {
                        unlink($backup_file);
                    }
                }
            //DBへ反映、DLファイルを作成
            } else if ($this->RequestPost["type"] === "save") {
                $err_message = "";
                $file = Session::get($this->controller . $this->action);
                if(!file_exists($file)) {
                    Logger::warning("file exists error.({$file})");
                    throw new InternalErrorException();
                }
                if (empty($this->RequestPost['output_type']) || !array_key_exists($this->RequestPost['output_type'], $this->output_type_div)) {
                    $err_message .= "出力形式を正しく選択してください。\n";
                }
                // トランザクション開始
                Database::getInstance()->dbConnect(Configure::read('DB_MASTER'));
                Database::getInstance()->dbBeginTransaction(Configure::read('DB_MASTER'));
                try {
                    $file_chk_result = $this->chainStoreFileTransact($file);
                    if(empty($err_message) && $file_chk_result['err_cnt'] == 0 && $file_chk_result['line_cnt'] > 0) {
                        set_time_limit(180);
                        // CSV出力
                        $csvFile = Configure::read("CHAIN_PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_書面契約済顧客_ID_PWリスト.csv";
                        if (touch($csvFile) === false) {
                            throw new Exception("File touch error!! Filename:" . $file);
                        }
                        $fp = fopen($csvFile, "w");
                        if ($fp) {
                            foreach ($file_chk_result['put_data'] as $data) {
                                mb_convert_variables("SJIS-win", "UTF-8", $data);
                                fputcsv($fp, $data);
                            }
                        } else {
                            throw new Exception("File open error!! Filename:" . $file);
                        }
                        fclose($fp);

                        // 発送先UNISデータの取得
                        $param = array();
                        $query = "SELECT id AS t_unis_cust_id, "
                            . " cust_cd, "
                            . " name, "
                            . " zip_cd, "
                            . " name as issue_name, "
                            . " address1, "
                            . " address2, "
                            . " address3, "
                            . " branch_cd "
                            . "FROM t_unis_cust "
                            . "WHERE cust_cd IN (";
                        $dataEndKey = count($file_chk_result['put_data']) - 1;
                        foreach ($file_chk_result['put_data'] as $key => $row) {
                            if ($key != 0) {
                                $query .= ":cust_cd{$key}";
                                if($key != $dataEndKey) {
                                    $query .= ", ";
                                }
                                $param["cust_cd{$key}"] = $row['cust_cd'];
                            }
                        }
                        $query .= ") AND"
                               .  " delete_flag = '0' ";
                        $custFetchResult = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);

                        $search = array('”', '“'); // 全角ダブルクォーテーションを半角に置換する
                        $replace = '"';
                        $custRowCount = 0;
                        $mService = $this->get_determinable_pass_service();
                        $passableService = array();
                        foreach($mService as $row) {
                            $passableService[] = $row['service_cd'];
                        }
                        $custs = array(); // pdf出力用の構造体
                        while ($custRow = $custFetchResult->fetch(PDO::FETCH_ASSOC)) {
                            $custs[$custRowCount] = new stdClass();
                            $custs[$custRowCount]->id = $custRow["t_unis_cust_id"];
                            $custs[$custRowCount]->cust_cd = $custRow["cust_cd"];
                            $custs[$custRowCount]->name = str_replace($search, $replace, $custRow["name"]);
                            $custs[$custRowCount]->zip_cd = $custRow["zip_cd"];
                            $custs[$custRowCount]->issue_name = str_replace($search, $replace, $custRow["issue_name"]);
                            $custs[$custRowCount]->address1 = str_replace($search, $replace, $custRow["address1"]);
                            $custs[$custRowCount]->address2 = str_replace($search, $replace, $custRow["address2"]);
                            $custs[$custRowCount]->address3 = str_replace($search, $replace, $custRow["address3"]);
                            $custs[$custRowCount]->branch_cd = $custRow["branch_cd"];

                            // チェーン店発送履歴テーブルに登録
                            $query = "INSERT INTO t_chain_pdf_history (t_unis_cust_id, print_user_id, print_date, name, zip_cd, address1, address2, address3, delete_flag, created_by, created, updated_by, updated) VALUES "
                                . "(:t_unis_cust_id, :print_user_id, CURRENT_DATE(), :name, :zip_cd, :address1, :address2, :address3, '0', :created_by, NOW(), :updated_by, NOW()) ";
                            $param = array(
                                    "t_unis_cust_id" => $custRow["t_unis_cust_id"],
                                    "print_user_id" => $this->Auth->user("id"),
                                    "name" =>       $custs[$custRowCount]->name,
                                    "zip_cd" =>     $custs[$custRowCount]->zip_cd,
                                    "address1" =>   $custs[$custRowCount]->address1,
                                    "address2" =>   $custs[$custRowCount]->address2,
                                    "address3" =>   $custs[$custRowCount]->address3,
                                    "created_by" => $this->Auth->user("id"),
                                    "updated_by" => $this->Auth->user("id"),
                                    );
                            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);

                            // 発送対象顧客のアカウント取得
                            $query = "SELECT ma.id AS m_account_id "
                                . "             , ma.login_id "
                                . "             , ma.init_password "
                                . "             , ma.init_date "
                                . "FROM m_account ma "
                                . "WHERE ma.t_unis_cust_id = :t_unis_cust_id "
                                . "  AND ma.status_flag = '0' "
                                . "  AND ma.admin_status_flag = '0' "
                                . "  AND ma.delete_flag = '0' "
                                . "ORDER BY ma.id ";
                            $param = array("t_unis_cust_id" => $custRow["t_unis_cust_id"]);
                            $accountFetchResult = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);

                            // アカウント数分ループ
                            $accountRowCount = 0;
                            while ($accountRow = $accountFetchResult->fetch(PDO::FETCH_ASSOC)) {
                                $account = new stdClass();
                                $account->id = $accountRow["m_account_id"];
                                $account->login_id = Cipher::rsaDecrypt($accountRow["login_id"]);
                                $account->init_password = Cipher::rsaDecrypt($accountRow["init_password"]);
                                $account->init_date = $accountRow["init_date"];

                                // OTORAKUトライアル移行はデータ連携時点で、アカウントの初回登録日を設定してしまうので、
                                // アカウント証発行でパスワードが表示されないため下記の処理を実施
                                // トライアル移行されたアカウントか取得(トライアル時の明細があるかを取得)
                                $query = "SELECT ma.id AS m_account_id "
                                        . "     , ma.init_password "
                                        . "     , ma.password "
                                        . "FROM t_unis_service tus "
                                        . "  INNER JOIN m_account ma "
                                        . "    ON ma.id = tus.m_account_id "
                                        . "WHERE ma.id = :m_account_id "
                                        . "  AND tus.service_cd = '120' "
                                        . "  AND tus.cont_no IS NULL "
                                        . "  AND tus.detail_no IS NULL "
                                        . "  AND tus.status_flag = '1' ";
                                $param = array("m_account_id" => $accountRow["m_account_id"]);
                                $trialResult = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
                                if (!empty($trialResult) && !empty($trialResult['m_account_id'])) {
                                    // init_passwordを複合化してhash化(passwordとの比較のため)
                                    $trialInitPasswordHash = Cipher::getPasswordHash(Cipher::rsaDecrypt($trialResult["init_password"]));
                                    if ($trialInitPasswordHash == $trialResult['password']) {
                                        // init_passwordとpasswordが同じ場合、ユーザー側で操作していない状態と判断
                                        $account->is_trial = true;
                                    }
                                }
                                $custs[$custRowCount]->accounts[$accountRowCount] = $account;

                                // テスト用データはRサービス発送履歴テーブルにデータが入らないようにする
                                $isIgnore = false;
                                if (in_array($custs[$custRowCount]->cust_cd, Configure::read('OTORAKU_IGNORE_UNIS_CD'))) {
                                    $isIgnore = true;
                                }

                                // アカウントのサービス取得
                                $query = "SELECT us.id AS t_unis_service_id "
                                    . "     , us.start_date "
                                    . "     , us.end_date "
                                    . "     , us.admin_status_flag "
                                    . "     , ms.id AS m_service_id "
                                    . "     , ms.service_cd "
                                    . "     , ms.service_name "
                                    . "     , (SELECT COUNT(*) "
                                    . "        FROM t_service_stop_history ssh "
                                    . "        WHERE ssh.t_unis_service_id = us.id "
                                    . "        AND stop_div = '1' "
                                    . "        AND ((ssh.start_datetime <= NOW() AND ssh.release_datetime >= NOW()) "
                                    . "          OR (ssh.start_datetime <= NOW() AND ssh.release_datetime IS NULL)) "
                                    . "        AND ssh.delete_flag = '0') AS stop_count "
                                    . "     , (SELECT COUNT(*) "
                                    . "        FROM t_service_stop_history ssh "
                                    . "        WHERE ssh.t_unis_service_id = us.id "
                                    . "        AND stop_div = '2' "
                                    . "        AND ((ssh.start_datetime <= NOW() AND ssh.release_datetime >= NOW()) "
                                    . "          OR (ssh.start_datetime <= NOW() AND ssh.release_datetime IS NULL)) "
                                    . "        AND ssh.delete_flag = '0') AS lock_count "
                                    . "FROM t_unis_service us "
                                    . "  INNER JOIN m_service ms "
                                    . "    ON (us.service_cd = ms.service_cd AND ms.delete_flag = '0') "
                                    . "WHERE us.m_account_id = :m_account_id "
                                    . "  AND us.status_flag = '0' "
                                    . "  AND us.delete_flag = '0' "
                                    . "ORDER BY ms.id, us.id ";
                                $param = array("m_account_id" => $accountRow["m_account_id"]);
                                $serviceFetchResult = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                                // サービス数分ループ
                                $serviceRowCount = 0;
                                while ($serviceRow = $serviceFetchResult->fetch(PDO::FETCH_ASSOC)) {
                                    $service = new stdClass();
                                    $service->id = $serviceRow["t_unis_service_id"];
                                    $service->service_name = $serviceRow["service_name"];
                                    $service->start_date = $serviceRow["start_date"];
                                    $service->end_date = $serviceRow["end_date"];
                                    $service->admin_status_flag = $serviceRow["admin_status_flag"];
                                    $service->stop_count = $serviceRow["stop_count"];
                                    $service->lock_count = $serviceRow["lock_count"];
                                    $custs[$custRowCount]->accounts[$accountRowCount]->services[$serviceRowCount] = $service;
                                    // UNIS連携対象サービスの場合はRサービス発送履歴テーブルにデータが有るか取得する（テストデータの場合は処理を行わない）
                                    if (in_array($serviceRow['service_cd'], $passableService) && $isIgnore === false) {
                                        $query = "SELECT COUNT(*) AS count "
                                            . "FROM t_r_issue_history "
                                            . "WHERE t_unis_service_id = :t_unis_service_id "
                                            . "  AND delete_flag = '0' ";
                                        $param = array("t_unis_service_id" => $serviceRow["t_unis_service_id"]);
                                        $rIssueHistoryCount = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
                                        if ($rIssueHistoryCount["count"] === "0" && !$this->isServiceChanged($serviceRow['t_unis_service_id'])) {
                                            // データが無ければRサービス発送履歴テーブル登録
                                            $query = "INSERT INTO t_r_issue_history ( "
                                                . "t_unis_service_id, created_by, created, updated_by, updated "
                                                . ") VALUES ( "
                                                . ":t_unis_service_id, :created_by, NOW(), :updated_by, NOW() "
                                                . ") ";
                                            $param = array(
                                                    "t_unis_service_id" => $serviceRow["t_unis_service_id"],
                                                    "created_by" => $this->Auth->user("id"),
                                                    "updated_by" => $this->Auth->user("id"),
                                                    );
                                            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                                        }
                                    }
                                    $serviceRowCount++;
                                }
                                // Uカート有効の場合、API連携送信対象テーブルに登録をする
                                $ucartChkSql = "SELECT t_unis_cust_id,  m_account_id "
                                             . "FROM t_unis_service "
                                             . "WHERE m_account_id = :m_account_id "
                                             . "AND service_cd = '100' " // u-cart
                                             . "AND (end_date IS NULL OR end_date > CURRENT_DATE()) "
                                             . "AND delete_flag = '0' ";
                                $chkParam = array();
                                $chkParam['m_account_id'] = $accountRow['m_account_id'];
                                $chkResult = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $ucartChkSql, $chkParam);
                                if (!empty($chkResult)) {
                                    $insSendSql = "INSERT INTO t_ucart_send VALUES "
                                               . "(NULL, :t_unis_cust_id, :m_account_id, '1', '0', '0', :created_by, NOW(), :updated_by, NOW())";
                                    $insParams = array(
                                        't_unis_cust_id' => $chkResult['t_unis_cust_id'],
                                        'm_account_id'   => $chkResult['m_account_id'],
                                        'created_by'     => $this->Auth->user('id'),
                                        'updated_by'     => $this->Auth->user('id'),
                                    );
                                    Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $insSendSql, $insParams);
                                }
                                $accountRowCount++;
                            }
                            $custRowCount++;
                        }

                        if (empty($custs[0])) {
                            return;
                        }

                        // 管轄支店名の取得
                        $query = "SELECT id, code, organization_name FROM m_organization "
                            . " WHERE organization_div & 4 AND start_date < NOW() AND end_date > NOW() ORDER BY sort, id ";
                        $param = array();
                        $tmp = Database::getInstance()->dbExecute(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
                        $organization = array();
                        while ($row = $tmp->fetch(PDO::FETCH_ASSOC)) {
                            $organization[$row["code"]] = $row["organization_name"];
                        }

                        //*******************************************
                        //** PDF出力
                        //*******************************************
                        ini_set('memory_limit', '512M');
                        require_once(LIB_DIR . DS . 'class.IdPdf.php');
                        $template = TPL_DIR . DS . 'extraction' . DS . 'id_skip_init.pdf';
                        $idPdf = new IdPdf("P", "mm", "A4", true, "UTF-8", false, false);
                        $idPdf->setTemplate($template);
                        $maxY = $idPdf->getMaxY();
                        $custDefault = array();     // 顧客発送 標準フォーマット
                        $custManyAccount = array(); // 顧客発送 別出しフォーマット
                        $branchDefault = array();   // 技術発送 標準フォーマット
                        $branchManyAccount = array(); // 技術発送 別出しフォーマット
                        foreach ($custs as $cust) {
                            // チェーン店発送において支店コードがない場合がないので、顧客発送フォーマットは作成されない
                            if (empty($cust->branch_cd)) {
                                if ($maxY > $idPdf->getCustHeight($cust)) {
                                    $custDefault[] = $cust;
                                } else {
                                    $custManyAccount[] = $cust;
                                }
                            } else {
                                if ($maxY > $idPdf->getCustHeight($cust)) {
                                    if ($this->RequestPost['output_type'] == self::OUTPUT_BRANCH_DIV) {
                                        $branchDefault[$cust->branch_cd][] = $cust;
                                    } else {
                                        $branchDefault[$cust->cust_cd][] = $cust;
                                    }
                                } else {
                                    if ($this->RequestPost['output_type'] == self::OUTPUT_BRANCH_DIV) {
                                        $branchManyAccount[$cust->branch_cd][] = $cust;
                                    } else {
                                        $branchManyAccount[$cust->cust_cd][] = $cust;
                                    }
                                }
                            }
                        }
                        unset($idPdf);

                        $zipFileList = array();
                        $zipFileList[] = $csvFile;
                        //*******************************************
                        //** 技術発送 標準フォーマット
                        //*******************************************
                        if (!empty($branchDefault)) {
                            foreach ($branchDefault as $key => $custsRes) {
                                // PDF初期化
                                if (!empty($organization[$key])) {
                                    $zipFileList[] = $file = Configure::read("CHAIN_PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_技術発送_{$organization[$key]}_標準フォーマット.pdf";
                                } else {
                                    $zipFileList[] = $file = Configure::read("CHAIN_PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_技術発送_{$key}_標準フォーマット.pdf";
                                }
                                $idPdf = new IdPdf("P", "mm", "A4", true, "UTF-8", false, false);
                                $idPdf->setTemplate($template);
                                $idPdf->setFile($file);
                                $idPdf->setCusts($custsRes);
                                $idPdf->setIsInitSkiped(true);
                                $idPdf->printPdf();
                                unset($idPdf);
                            }
                        }

                        //*******************************************
                        //** 技術発送 別出しフォーマット
                        //*******************************************
                        if (!empty($branchManyAccount)) {
                            foreach ($branchManyAccount as $key => $custsRes) {
                                // PDF初期化
                                if (!empty($organization[$key])) {
                                    $zipFileList[] = $file = Configure::read("CHAIN_PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_技術発送_{$organization[$key]}_複数枚フォーマット.pdf";
                                } else {
                                    $zipFileList[] = $file = Configure::read("CHAIN_PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_技術発送_{$key}_複数枚フォーマット.pdf";
                                }
                                $idPdf = new IdPdf("P", "mm", "A4", true, "UTF-8", false, false);
                                $idPdf->setTemplate($template);
                                $idPdf->setFile($file);
                                $idPdf->setCusts($custsRes);
                                $idPdf->setIsInitSkiped(true);
                                $idPdf->printPdf();
                                unset($idPdf);
                            }
                        }

                        if (!empty($zipFileList)) {
                            // zipで圧縮する
                            $zip = new ZipArchive();
                            $fileName = Func::ymdhis() . "_チェーン店発送.zip";
                            $file = Configure::read("PUBLISH_DIR") . $fileName ;
                            $res = $zip->open($file, ZipArchive::CREATE | ZipArchive::OVERWRITE);
                            if ($res !== true) {
                                throw new Exception("zip archive error, {$res}, " . $file);
                            }
                            foreach ($zipFileList as $zipFile) {
                                $zip->addFile($zipFile, basename(mb_convert_encoding($zipFile, 'SJIS-win', 'UTF-8')));
                            }
                            $zip->close();
                            sleep(1);
                        }

                        // すべての処理が完了したタイミングで、m_account(init_date)を更新
                        $updateQuery = "UPDATE m_account SET "
                                     . " init_date = NOW(), "
                                     . " updated_by = :updated_by,"
                                     . " updated = NOW()"
                                     . " WHERE id = :account_id";

                        foreach($custs as $cust) {
                            foreach($cust->accounts as $account) {
                                $chkQuery = "SELECT * FROM m_account WHERE id = :account_id AND init_date IS NULL";
                                $param = array('account_id' => $account->id);
                                $res = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $chkQuery, $param);
                                if (!empty($res)) {
                                    $param = array('updated_by' => $this->Auth->user('id'), 'account_id' => $account->id);
                                    $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $updateQuery, $param);
                                }
                            }
                        }
                        Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));

                        // ストリームに出力
                        $fileName = mb_convert_encoding($fileName, 'SJIS-win', 'UTF-8');
                        header('Content-Type: application/zip; name="' . $fileName . '"');
                        header('Content-Disposition: attachment; filename="' . $fileName . '"');
                        header('Content-Length: '.filesize($file));
                        echo file_get_contents($file);

                        Session::delete($this->controller . $this->action);
                        return;
                    } else {
                        array_shift($file_chk_result['put_data']);
                    }
                } catch (DBException $e) {
                    Logger::warning("chain_store_regist db update error.");
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    Logger::info($e->getMessage());
                    throw new InternalErrorException();
                } catch (Exception $e) {
                    Logger::warning("chain_store_regist file control error.");
                    Logger::info($e->getMessage());
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    throw new InternalErrorException();
                }
            }
        }
        if (!empty($file_chk_result)) {
            $upload_data = array('data' => $file_chk_result['put_data'], 'all_cnt' => $file_chk_result['line_cnt'], 'err_cnt' => $file_chk_result['err_cnt']);
            $this->set('upload_data', $upload_data);
        }

        $this->set('err_message', $err_message);
        $this->set('titleName', "USEN CART利用申込済顧客用メールアドレス登録・ID/PW抽出画面");
        $this->render('extraction' . DS . 'chain_store_bulk_regist.tpl');
    }

    /*
     * メールアドレス初回登録・仮ID/PW抽出画面
     */
    public function mail_address_init_import() {
        $data = array();
        $put_data = array();
        $err_message = "";
        if (isset($this->RequestPost["type"])) {
            setlocale(LC_ALL, 'ja_JP.UTF-8');
            if ($this->RequestPost["type"] === "upload") {
                // 入力チェック
                $backup_file = Configure::read('EXTRACTION_DIR') . "mail_address_import_" .date("YmdHis") . ".csv";
                if (empty($_FILES) || strcasecmp(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION), "csv") != 0) {
                    $err_message .= "CSVファイルを選択してください。\n";
                    //バックアップ取得
                } else if (!move_uploaded_file($_FILES["file"]["tmp_name"], $backup_file)) {
                    Logger::warning("move_uploaded_file error.($backup_file)");
                    $err_message .= "予期せぬエラーが発生しました。\n";
                }

                if ($err_message == "") {
                    // 仮ID/PW抽出(確認・完了共通処理）
                    $file_chk_result = $this->mailImportFileTransact($backup_file);
                }
                if ($file_chk_result['line_cnt'] > 5000) {
                    $err_message .= "一度に登録できる件数は5000件までです。";
                    $file_chk_result['put_data'] = array();
                    $file_chk_result['line_cnt'] = 0;
                    $file_chk_result['err_cnt'] = 0;
                }
                if ($file_chk_result['line_cnt'] > 0 && $file_chk_result['err_cnt'] == 0) {
                    //backup_fileのpathをSESSIONに保持
                    Session::set($this->controller . $this->action, $backup_file);
                    //内容を反映するボタンを活性化
                    $this->set("save_button", true);
                    //20件残して、それより古いファイルは削除
                    $file_list = $this->get_file_list(Configure::read('EXTRACTION_DIR'));
                    $fcnt = 0;
                    foreach ($file_list as $file) {
                        if (preg_match('/\Amail_address_import_[0-9]{14}\.csv\z/u', $file["name"])) {
                            $fcnt++;
                            if ($fcnt > 20) {
                                unlink(Configure::read('EXTRACTION_DIR') . $file["name"]);
                            }
                        }
                    }
                //エラーがある場合、backup_fileを削除
                } else {
                    unlink($backup_file);
                }
            //DBへ反映、DLファイルを作成
            } else if ($this->RequestPost["type"] === "save") {
                $file = Session::get($this->controller . $this->action);
                if(!file_exists($file)) {
                    Logger::warning("file exists error.({$file})");
                    throw new InternalErrorException();
                }
                // トランザクション開始
                Database::getInstance()->dbConnect(Configure::read('DB_MASTER'));
                Database::getInstance()->dbBeginTransaction(Configure::read('DB_MASTER'));
                try {
                    $file_chk_result = $this->mailImportFileTransact($file);
                    Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));
                } catch (Exception $e) {
                    Logger::warning("mail_init_import update error.");
                    Logger::info($e->getMessage());
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    throw new InternalErrorException();
                }
                if($file_chk_result['err_cnt'] == 0 && $file_chk_result['line_cnt'] > 0) {
                    // CSV出力
                    $csvFile = date("YmdHis") . "_メール初回登録済みアカウント_仮ID_PWリスト.csv";

                    header('Content-Type: application/force-download');
                    header('Content-disposition: attachment; filename="' . mb_convert_encoding($csvFile, 'SJIS-win', 'UTF-8') . '"');
                    ob_start();
                    $stream = fopen('php://output', 'w');

                    foreach ($file_chk_result['put_data'] as $value) {
                        fputcsv($stream, $value);
                    }

                    $output = ob_get_contents();
                    ob_end_clean();
                    $output = str_replace("\n", "\r\n", $output);
                    echo mb_convert_encoding($output, "SJIS-win", "UTF-8");
                    Session::delete($this->controller . $this->action);
                    return;
                } else if($file_chk_result['err_cnt'] != 0) {
                    unset($file_chk_result['put_data'][0]);
                } 
            }
        }
        if (!empty($file_chk_result)) {
            $upload_data = array('data' => $file_chk_result['put_data'], 'all_cnt' => $file_chk_result['line_cnt'], 'err_cnt' => $file_chk_result['err_cnt']);
            $this->set('upload_data', $upload_data);
        }
        $this->set('err_message', $err_message);
        $this->set('titleName', "メールアドレス初回登録・仮ID/PW抽出画面");
        $this->render('extraction' . DS . 'mail_address_init_import.tpl');
    }

    
    private function get_inited_cust_cd_row($row) {
        $ret = array();
        $ret[] = $row["cust_cd"];
        $ret[] = $this->_preference["unis_status_flag"][$row["cust_status_flag"]];
        $ret[] = $row["name"];
        $ret[] = Cipher::rsaDecrypt($row["tel"]);
        $ret[] = $row["zip_cd"];
        $ret[] = $row["address1"];
        $ret[] = $row["address2"];
        $ret[] = $row["address3"];
        $ret[] = $row["issue_date"];
        $ret[] = $row["m_account_id"];
        $ret[] = $row["init_date"];
        $ret[] = $row["init_auth_datetime"];
        $ret[] = $this->get_account_status($row["account_status_flag"], $row["account_admin_status_flag"]);
        $ret[] = $this->get_service_status($row["service_status_flag"], $row["service_admin_status_flag"]);
        $ret[] = $row["branch_cd"];
        $ret[] = $row["branch_name"];
        $ret[] = Cipher::rsaDecrypt($row["mail_address"]);
        $ret[] = $row["chain_cd"];
        $ret[] = $row["chain_name"];
        $ret[] = $row["industry_cd"];
        $ret[] = $row["industry_name"];
        return $ret;
    }

    private function get_issue_history_row($row) {
        $ret = array();
        $ret[] = $row["cust_cd"];
        $ret[] = $this->_preference["unis_status_flag"][$row["cust_status_flag"]];
        $ret[] = $row["name"];
        $ret[] = $row["issue_date"];
        $ret[] = $row["not_arrived_date"];
        $ret[] = $this->_preference["issue_status_flag"][$row["issue_history_status_flag"]];
        return $ret;
    }

    private function get_service_master() {
        $query = "SELECT service_cd, service_name FROM m_service WHERE delete_flag = '0'";
        return Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query);
    }

    /*
     * ファイルのリストを、更新日の降順で返す
     */
    private function get_file_list($dir) {
        $file_list = array();
        $time_list = array();
        $dh = opendir($dir);
        while ($fname = readdir($dh)) {
            $fpath = $dir . $fname;
            if (is_file($fpath) && is_readable($fpath)) {
                $time = date("Y-m-d H:i:s", filemtime($fpath));
                $size = number_format((filesize($fpath) / 1024), 2, '.', ',') . " KB";
                $file_list[] = array("name" => $fname, "time" => $time, "size" => $size);
                $time_list[] = $time;
            }
        }
        closedir($dh);
        //更新日でソート
        array_multisort($time_list, SORT_DESC, $file_list);
        return $file_list;
    }

    /*
     * 顧客CDに紐づくアカウントの契約状況を全て取得
     * @param String cust_cd    : 顧客CD
     * @param String service_cd : サービスCD
     * @return array : 取得結果
     */
    private function getCustAccountsInfo($cust_cd, $service_cd) {
        $query = " SELECT tuc.id AS t_unis_cust_id, tuc.cust_cd, tuc.name, tuc.status_flag AS t_unis_cust_status_flag "
            . "   , ma.id AS m_account_id, ma.login_id, ma.init_password, ma.init_date, ma.status_flag AS m_account_status_flag "
            . "   , tus.id AS t_unis_service_id, tus.admin_status_flag AS t_unis_service_admin_status_flag"
            . "   , tuc.chain_cd, tuc.chain_name"
            . "   , (SELECT COUNT(*) "
            . "      FROM t_service_stop_history tssh "
            . "      WHERE tssh.t_unis_service_id = tus.id "
            . "      AND stop_div = '1' "
            . "      AND ((tssh.start_datetime <= NOW() AND tssh.release_datetime >= NOW()) "
            . "        OR (tssh.start_datetime <= NOW() AND tssh.release_datetime IS NULL)) "
            . "      AND tssh.delete_flag = '0') AS stop_count "
            . "   , (SELECT COUNT(*) "
            . "      FROM t_service_stop_history tssh "
            . "      WHERE tssh.t_unis_service_id = tus.id "
            . "      AND stop_div = '2' "
            . "      AND ((tssh.start_datetime <= NOW() AND tssh.release_datetime >= NOW()) "
            . "        OR (tssh.start_datetime <= NOW() AND tssh.release_datetime IS NULL)) "
            . "      AND tssh.delete_flag = '0') AS lock_count "
            . " FROM t_unis_cust tuc "
            . "   INNER JOIN m_account ma "
            . "     ON tuc.id = ma.t_unis_cust_id AND ma.delete_flag = '0' "
            . "   INNER JOIN t_unis_service tus "
            . "     ON ma.id = tus.m_account_id AND tus.service_cd = :service_cd AND tus.status_flag = '0' AND tus.delete_flag = '0' "
            . " WHERE tuc.cust_cd = :cust_cd "
            . " AND tuc.delete_flag = '0' "
            . " AND ma.account_div = '0' "
            . " ORDER BY ma.id ";
        $param = array("cust_cd" => $cust_cd, "service_cd" => $service_cd);
        return Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, $param);
    }

    private function mailImportFileTransact($file) {
        // サービス取得
        $service_cd = '100';
        $service = $this->get_service_master();
        foreach($service as $row) {
            if($row['service_cd'] === $service_cd) {
                $service_name = $row['service_name'];
            }
        }

        $handle = fopen($file, "r");
        if ($handle === false) {
            Logger::warning("file open error.({$file})");
            throw new InternalErrorException();
        }
        $put_data = array();
        if($this->RequestPost["type"] === "save") {
            $put_data[] = array("顧客CD", "設置先名称", "アカウントID", "メールアドレス", "ログインID", "パスワード", "備考");
        }
        $cust_cd_check = array();
        $line_cnt = 0;
        $error_cnt = 0;
        while (($buffer = fgets($handle)) !== false && $line_cnt <= 5000) {
            $data = array();
            $line_error = false;
            mb_convert_variables('UTF-8', 'SJIS-win', $buffer);
            $csv_data = str_getcsv($buffer, ',', '"', '"');
            $data['cust_cd'] = $csv_data[0];
            $data['name'] = '';
            $data['m_account_id'] = '';
            $data['mail_address'] = $csv_data[1];
            $data['login_id'] = '';
            $data['password'] = '';
            $data['message'] = '';
            $data['result'] = '';

            if($this->RequestPost["type"] === "upload") {
                // 顧客CDの入力チェック
                if (empty($csv_data[0])) {
                    $data['message'] .= "顧客CDが空です。";
                    $line_error = true;
                } else if (!Validation::numeric($csv_data[0]) || !Validation::maxLength($csv_data[0], 9)) {
                    $data['message'] .= "顧客CDの形式が不正です。";
                    $line_error = true;
                } else if (array_key_exists($csv_data[0], $cust_cd_check)) {
                    $data['message'] .= "顧客CDが重複しています。";
                    $line_error = true;
                }

                // メールアドレスの入力チェック
                if (empty($csv_data[1])) {
                    $data['message'] .= "メールアドレスの入力が空です。";
                    $line_error = true;
                } else if (!Validation::mail($csv_data[1])) {
                    $data['message'] .= "メールアドレスの形式が不正です。";
                    $line_error = true;
                }
            }

            // エラーが無ければ、アカウントID・ログインID・PWを取得
            if (!$line_error) {
                // アカウント情報の検索
                $result = $this->getCustAccountsInfo($data["cust_cd"], $service_cd);
                if (empty($result)) {
                    $data['message'] .= "顧客CDが有効ではありません。";
                    $data['result'] = '1';
                    $put_data[] = $data;
                    $line_cnt++;
                    $error_cnt++;
                    continue;
                }
                foreach ($result as $row) {
                    if ($row["t_unis_cust_status_flag"] !== "1" && $row["t_unis_cust_status_flag"] !== "2") {
                        $data['message'] .= "顧客CDが有効ではありません。";
                    } else if (empty($row["t_unis_service_id"])) {
                        // サービス利用不可
                        $data['message'] .= "{$service_name}が有効ではありません。";
                    }

                    if ($row["t_unis_service_admin_status_flag"] === "1") {
                        $data['message'] .= "停止中のサービスです。";
                    } elseif ($row["stop_count"] > 0) {
                        $data['message'] .= "休店中のサービスです。";
                    } elseif ($row["lock_count"] > 0) {
                        $data['message'] .= "停止中のサービスです。";
                    }

                    if (!empty($data['message'])) {
                        $data['result'] = 1;
                        $put_data[] = $data;
                        $error_cnt++;
                        continue;
                    }
                    $data['name'] = $row['name'];
                    $data['m_account_id'] = $row['m_account_id'];
                    $data['login_id'] = Cipher::rsaDecrypt($row["login_id"]);
                    if (empty($row["init_date"])) {
                        // 確認画面
                        if($this->RequestPost["type"] === "upload") {
                            $data['password'] = "********";
                        // 完了処理
                        } else {
                            $data['password'] = Cipher::rsaDecrypt($row["init_password"]);
                            $selectQuery = "SELECT * FROM t_account_init_imported WHERE m_account_id = :m_account_id";
                            $param = array("m_account_id" => $row['m_account_id']);
                            $selectResult = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $selectQuery, $param);
                            if(empty($selectResult)) {
                                $insertQuery = "INSERT INTO t_account_init_imported VALUES "
                                             . "(NULL, :m_account_id, NULL, '0', :created_by, NOW(), :updated_by, NOW() ) ";
                                $param = array(
                                    "m_account_id" => $row['m_account_id'],
                                    "created_by" => $this->Auth->user("id"),
                                    "updated_by" => $this->Auth->user("id")
                                );
                                $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $insertQuery, $param);
                            }
                            $updateQuery = "UPDATE m_account SET "
                                         . "mail_address = :mail_address, "
                                         . "hash_mail_address = :hash_mail_address, "
                                         . "updated_by = :updated_by, "
                                         . "updated = NOW() "
                                         . "WHERE id = :account_id ";
                            $param = array(
                                "mail_address" => Cipher::rsaEncrypt($csv_data[1]),
                                "hash_mail_address" => Cipher::getPersonalHash(mb_strtolower($csv_data[1])), 
                                "updated_by" => $this->Auth->user("id"),
                                "account_id" => $row['m_account_id'],
                            );
                            Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $updateQuery, $param);
                        }
                    } else {
                        $data['password'] = "お客様にて設定されたパスワード";
                    }
                    $put_data[] = $data;
                }
                $line_cnt++;
            } else {
                $data['result'] = 1;
                $put_data[] = $data;
                $line_cnt++;
                $error_cnt++;
                continue;
            }
        }
        $result = array('put_data' => $put_data, 'line_cnt' => $line_cnt, 'err_cnt' => $error_cnt);
        return $result;
    }

    private function chainStoreFileTransact($file) {
        // サービス取得
        $service_cd = '100';
        $service = $this->get_service_master();
        foreach($service as $row) {
            if($row['service_cd'] === $service_cd) {
                $service_name = $row['service_name'];
            }
        }

        $handle = fopen($file, "r");
        if ($handle === false) {
            Logger::warning("file open error.({$file})");
            throw new InternalErrorException();
        }
        $put_data = array();
        if($this->RequestPost["type"] === "save") {
            $put_data[] = array("チェーン店CD", "チェーン店名称", "顧客CD", "設置先名称", "アカウントID", "メールアドレス", "ログインID", "パスワード", "権限区分", "備考");
        }
        $cust_cd_check = array();
        $line_cnt = 0;
        $error_cnt = 0;
        while (($buffer = fgets($handle)) !== false && $line_cnt <= 5000) {
            $data = array();
            $line_error = false;
            mb_convert_variables('UTF-8', 'SJIS-win', $buffer);
            $csv_data = str_getcsv($buffer, ',', '"', '"');
            $data['chain_cd'] = '';
            $data['chain_name'] = '';
            $data['cust_cd'] = $csv_data[0];
            $data['name'] = '';
            $data['m_account_id'] = '';
            $data['mail_address'] = $csv_data[1];
            $data['login_id'] = '';
            $data['password'] = '';
            $data['authority_div'] = '';
            $data['message'] = '';
            $data['result'] = '';

            if($this->RequestPost["type"] === "upload") {
                // 顧客CDの入力チェック
                if (empty($csv_data[0])) {
                    $data['message'] .= "顧客CDが空です。";
                    $line_error = true;
                } else if (!Validation::numeric($csv_data[0]) || !Validation::maxLength($csv_data[0], 9)) {
                    $data['message'] .= "顧客CDの形式が不正です。";
                    $line_error = true;
                } else if (array_key_exists($csv_data[0], $cust_cd_check)) {
                    $data['message'] .= "顧客CDが重複しています。";
                    $line_error = true;
                }

                // メールアドレスの入力チェック
                if (empty($csv_data[1])) {
                    $data['message'] .= "メールアドレスの入力が空です。";
                    $line_error = true;
                } else if (!Validation::mail($csv_data[1])) {
                    $data['message'] .= "メールアドレスの形式が不正です。";
                    $line_error = true;
                }

                // 権限区分の入力チェック
                if (!isset($csv_data[2])) {
                    $data['message'] .= "権限区分の値が空です。";
                    $line_error = true;
                } else if (!array_key_exists($csv_data[2], $this->_preference['authority_div'])) {
                    $data['message'] .= "権限区分の形式が不正です。";
                    $line_error = true;
                }

            }

            // エラーが無ければ、アカウントID・ログインID・PWを取得
            if (!$line_error) {
                // アカウント情報の検索
                $result = $this->getCustAccountsInfo($data["cust_cd"], $service_cd);
                if (empty($result)) {
                    $data['message'] .= "顧客CDが有効ではありません。";
                    $data['result'] = '1';
                    $put_data[] = $data;
                    $line_cnt++;
                    $error_cnt++;
                    continue;
                }
                foreach ($result as $row) {
                    if ($row["t_unis_cust_status_flag"] !== "1" && $row["t_unis_cust_status_flag"] !== "2") {
                        $data['message'] .= "顧客CDが有効ではありません。";
                    } else if (empty($row["t_unis_service_id"])) {
                        // サービス利用不可
                        $data['message'] .= "{$service_name}が有効ではありません。";
                    }

                    if ($row["t_unis_service_admin_status_flag"] === "1") {
                        $data['message'] .= "停止中のサービスです。";
                    } elseif ($row["stop_count"] > 0) {
                        $data['message'] .= "休店中のサービスです。";
                    } elseif ($row["lock_count"] > 0) {
                        $data['message'] .= "停止中のサービスです。";
                    }

                    if (!empty($data['message'])) {
                        $data['result'] = 1;
                        $put_data[] = $data;
                        $error_cnt++;
                        continue;
                    }
                    if (!empty($row['chain_cd'])) {
                        $data['chain_cd'] = $row['chain_cd'];
                    }
                    if (!empty($row['chain_name'])) {
                        $data['chain_name'] = $row['chain_name'];
                    }
                    $data['name'] = $row['name'];
                    $data['m_account_id'] = $row['m_account_id'];
                    $data['login_id'] = Cipher::rsaDecrypt($row["login_id"]);
                    if (empty($row["init_date"])) {
                        // 確認画面
                        if($this->RequestPost["type"] === "upload") {
                            $data['password'] = "********";
                        }
                    } else {
                        $data['password'] = "お客様にて設定されたパスワード";
                    }

                    if($this->RequestPost["type"] === "save") {
                        if (empty($row["init_date"])) {
                            $data['password'] = Cipher::rsaDecrypt($row["init_password"]);
                        }
                        $selectQuery = "SELECT * FROM t_chain_authority_div WHERE t_unis_cust_id = :t_unis_cust_id";
                        $param = array("t_unis_cust_id" => $row['t_unis_cust_id']);
                        $selectResult = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $selectQuery, $param);
                        /*** チェーン店区分テーブルの登録 ***/
                        // 事前に登録が無ければ登録処理
                        if(empty($selectResult)) {
                            $insertQuery = "INSERT INTO t_chain_authority_div VALUES "
                                         . "(NULL, :t_unis_cust_id, :authority_div, '0', :created_by, NOW(), :updated_by, NOW() ) ";
                            $param = array(
                                "t_unis_cust_id" => $row['t_unis_cust_id'],
                                "authority_div" => $csv_data[2],
                                "created_by" => $this->Auth->user("id"),
                                "updated_by" => $this->Auth->user("id")
                            );
                            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $insertQuery, $param);
                        // 事前に登録が有れば更新処理
                        } else {
                            $updateQuery = "UPDATE t_chain_authority_div SET "
                                         . "authority_div = :authority_div, "
                                         . "updated_by = :updated_by, "
                                         . "updated = NOW() "
                                         . "WHERE t_unis_cust_id = :t_unis_cust_id ";
                            $param = array(
                                "t_unis_cust_id" => $row['t_unis_cust_id'],
                                "authority_div" => $csv_data[2],
                                "updated_by" => $this->Auth->user("id"),
                            );
                            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $updateQuery, $param);
                        }
                        /***-----------------------------***/

                        /*** メールアドレスインポート済みアカウントテーブルの登録 ***/
                        $selectQuery = "SELECT * FROM t_account_init_imported WHERE m_account_id = :m_account_id";
                        $param = array("m_account_id" => $row['m_account_id']);
                        $selectResult = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $selectQuery, $param);
                        if(empty($selectResult)) {
                            $insertQuery = "INSERT INTO t_account_init_imported VALUES "
                                . "(NULL, :m_account_id, NULL, '0', :created_by, NOW(), :updated_by, NOW() ) ";
                            $param = array(
                                    "m_account_id" => $row['m_account_id'],
                                    "created_by" => $this->Auth->user("id"),
                                    "updated_by" => $this->Auth->user("id")
                                    );
                            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $insertQuery, $param);
                        }
                        /***-------------------------------**/

                        $updateQuery = "UPDATE m_account SET "
                            . "mail_address = :mail_address, "
                            . "hash_mail_address = :hash_mail_address, "
                            . "updated_by = :updated_by, "
                            . "updated = NOW() "
                            . "WHERE id = :account_id ";
                        $param = array(
                                "mail_address" => Cipher::rsaEncrypt($csv_data[1]),
                                "hash_mail_address" => Cipher::getPersonalHash(mb_strtolower($csv_data[1])), 
                                "updated_by" => $this->Auth->user("id"),
                                "account_id" => $row['m_account_id'],
                                );
                        Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $updateQuery, $param);
                    }
                    $data['authority_div'] = $csv_data[2];
                    $put_data[] = $data;
                }
                $line_cnt++;
                $cust_cd_check[$csv_data[0]] = true;
            } else {
                $data['result'] = 1;
                $put_data[] = $data;
                $line_cnt++;
                $error_cnt++;
                continue;
            }
        }
        $result = array('put_data' => $put_data, 'line_cnt' => $line_cnt, 'err_cnt' => $error_cnt);
        return $result;
    }
}
