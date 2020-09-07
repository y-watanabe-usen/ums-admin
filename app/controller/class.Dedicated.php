<?php

// ライブラリ読み込み
require_once(LIB_DIR . DS . 'class.Cipher.php');

/*
 * アカウント
 */
class Dedicated extends Controller {
    const TRIAL_ACCOUNT_DIV = '1';
    const DEFAULT_TRIAL_DAYS = 14;

    public $search_limit = 50; //検索件数
    public $create_max_count = '5000'; //発行件数
    public $cust_cd = array('1' => 'trial001', '2' => 'demo001'); //顧客CD
    public $del_fcnt = 50;//ファイル保持数

    /*
     * 前処理
     */
    public function beforeFilter() {
        // ログインチェック
        $this->checkLogin();
        // 権限チェック
        $this->checkAcl();
    }

    public function index() {

        if ($this->Acl->check($this->Auth->user("role_id"), "/dedicated/trial_search/")) {
            Func::redirect("/dedicated/trial_search/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/dedicated/trial_create/")) {
            Func::redirect("/dedicated/trial_create/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/dedicated/trial_download/")) {
            Func::redirect("/dedicated/trial_download/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/dedicated/demo_search/")) {
            Func::redirect("/dedicated/demo_search/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/dedicated/demo_create/")) {
            Func::redirect("/dedicated/demo_create/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/dedicated/demo_download/")) {
            Func::redirect("/dedicated/demo_download/");
        } else {
            Logger::warning("Forbidden Exception.");
            throw new ForbiddenException();
        }

        return;
    }

    /*
     * お試しアカウント検索
     */
    public function trial_search() {
        $this->set('titleName', "お試しアカウント検索");

        //販路マスタを取得する
        $marketList = $this->get_m_market('1');
        $this->set("marketList", $marketList);

        //詳細画面から検索条件を受け取る
        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] == "search") {
            $search_info["type"] = "search";
            $search_info["login_id"] = $this->RequestPost["login_id"];
            $search_info["market_id"] = $this->RequestPost["market_id"];
            $search_info["start_from"] = $this->RequestPost["start_from"];
            $search_info["start_to"] = $this->RequestPost["start_to"];
            $search_info["init_from"] = $this->RequestPost["init_from"];
            $search_info["init_to"] = $this->RequestPost["init_to"];
            $search_info["account_id"] = $this->RequestPost["account_id"];

            $this->set("search_info", $search_info);
        }

        $this->render('dedicated' . DS . 'trial_search.tpl');
    }

    /*
     * お試しアカウント検索処理
     */
    public function trial_get_data() {

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        $this->get_data($this->RequestPost, '1');

    }

    /*
     * お試しアカウント検索結果ダウンロード処理
     */
    public function trial_list_download() {

        $csv_mode_flg = 1;
        $res = $this->get_sql_date($this->RequestPost, '1', 0, $csv_mode_flg);

        if (!empty($res) && $res["search_cnt"] > 0) {
            $data = $res["search_data"];
            $header = array('アカウントID', 'ログインID', 'パスワード', 'トライアル日数', '販路', '発行日', '初回認証日時', '失効日');
            $csvFile = "trial_list_download_" . date("YmdHis") . ".csv";
            // CSV出力
            header('Content-Type: application/force-download');
            header('Content-disposition: attachment; filename="' . $csvFile . '"');
            ob_start();
            $stream = fopen('php://output', 'w');
            fputcsv($stream, $header);
            foreach ($data as $row) {
                fputcsv($stream, $this->get_trial_list_row($row));
            }

            $output = ob_get_contents();
            ob_end_clean();
            $output = str_replace("\n", "\r\n", $output);
            echo mb_convert_encoding($output, "SJIS-win", "UTF-8");
            return;
        }

    }

    /*
     * お試しアカウント詳細
     */
    public function trial_detail() {
        $this->set('titleName', "お試しアカウント詳細");

        // アカウント情報の取得
        $account_id = $this->RequestPost["account_id"];
        $account = $this->get_account_data_by_account_id($account_id);
        if (empty($account)) {
            Logger::warning("Account Not Found. account_id: {$account_id}");
            throw new BadRequestException();
        }
        $account["decripted_login_id"] = Cipher::rsaDecrypt($account["login_id"]);
        $account["decripted_password"] = Cipher::rsaDecrypt($account["init_password"]);
        $this->set("account", $account);

        // 視聴履歴の取得
        $listened_time = array();
        if (!empty($account["init_auth_datetime"])) {
            // 初回認証が済んでいる場合は視聴ログを取得
            $from_dt = new DateTime($account["init_auth_datetime"]);
            $from_month = $from_dt->format("Y-m");
            $to_dt = new DateTime($account["end_date"]);
            $to_month = $to_dt->format("Y-m");
            $listened_time = $this->get_listened_time($account["id"], $from_month, $to_month);
        } else {
            $listened_time["error"] = "視聴履歴はありません。";
        }
        $this->set("listened_time", $listened_time);

        $this->render('dedicated' . DS . 'trial_detail.tpl');


    }

    /*
     * お試しアカウント聴取履歴ダウンロード
     */
    public function trial_listened_time_download() {

        // アカウント情報の取得
        $account_id = $this->RequestPost["account_id"];
        $account = $this->get_account_data_by_account_id($account_id);
        if (empty($account)) {
            Logger::warning("Account Not Found. account_id: {$account_id}");
            throw new BadRequestException();
        }

        // 視聴履歴の取得
        $listened_time = array();
        if (!empty($account["init_auth_datetime"])) {
            // 初回認証が済んでいる場合は視聴ログを取得
            $from_dt = new DateTime($account["init_auth_datetime"]);
            $from_month = $from_dt->format("Y-m");
            $to_dt = new DateTime($account["end_date"]);
            $to_month = $to_dt->format("Y-m");
            $listened_time = $this->get_listened_time($account["id"], $from_month, $to_month);
        }

        if (!empty($listened_time)) {
            $header = array('年月', 'ご利用時間');
            $csvFile = "【" . $account_id . "】listened_time_download_" . date("YmdHis") . ".csv";
            // CSV出力
            header('Content-Type: application/force-download');
            header('Content-disposition: attachment; filename="' . $csvFile . '"');
            ob_start();
            $stream = fopen('php://output', 'w');
            fputcsv($stream, $header);
            foreach ($listened_time as $month) {
                $month_row = array();
                $month_row[] = $month['date_view'] . "Total";
                $month_row[] = $month['total_view'];
                fputcsv($stream, $month_row);
                foreach($month['days'] as $day) {
                    $day_row = array();
                    $day_row[] = $day['day_view'];
                    $day_row[] = $day['total_view'];
                    fputcsv($stream, $day_row);
                }
            }
            $output = ob_get_contents();
            ob_end_clean();
            $output = str_replace("\n", "\r\n", $output);
            echo mb_convert_encoding($output, "SJIS-win", "UTF-8");
            return;
        }

    }

    /*
     * お試しアカウント発行
     */
    public function trial_create() {

        $this->set('titleName', "お試しアカウント発行");
        $err_message = "";

        //販路マスタを取得する
        $marketList = $this->get_m_market('1');
        $this->set("marketList", $marketList);

        // 発行ボタン押下時
        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] === "create") {
            $request = array();
            $request = $this->ins_output_dedicated($this->RequestPost, '1');

            if (!empty($request['err_message'])) {
                $err_message = $request['err_message'];
            }

        }

        $this->set("create_max_count", $this->create_max_count);
        $this->set("err_message", $err_message);
        $this->render('dedicated' . DS . 'trial_create.tpl');

    }

    /*
     * お試しアカウントダウンロード
     */
    public function trial_download() {

        $this->set('titleName', "お試しアカウントダウンロード");
        $err_message = "";

        //ファイル出力
        if (isset($this->RequestPost["type"])) {
            //発送データ出力
            if ($this->RequestPost["type"] == "publish" && isset($this->RequestPost["id"]) && $this->RequestPost["id"] != "") {
                $tmp_file_list = Session::get($this->controller . $this->action);
                $fname = $tmp_file_list[$this->RequestPost["id"]]["name"];
                $fpath = Configure::read('TRIAL_DIR') . $fname;

                if (is_file($fpath) && is_readable($fpath)) {
                    $this->csv_download($fpath, $fname);
                } else {
                    $err_message = "ファイルが存在しません。";
                }
            }
        }

        //ファイルのリストを取得
        $file_list = $this->get_file_list(Configure::read('TRIAL_DIR'));
        //file_listをSESSIONに保持
        Session::set($this->controller . $this->action, $file_list);

        $this->set("file_list", $file_list);
        $this->set("err_message", $err_message);
        $this->render('dedicated' . DS . 'trial_download.tpl');

    }

    /*
     * デモアカウント検索
     */
    public function demo_search() {
        $this->set('titleName', "デモアカウント検索");

        //販路マスタを取得する
        $marketList = $this->get_m_market('2');
        $this->set("marketList", $marketList);

        //サービスマスタを取得する
        $this->set("serviceList", $this->get_m_service());

        $this->render('dedicated' . DS . 'demo_search.tpl');
    }

    /*
     * デモアカウント検索処理
     */
    public function demo_get_data() {

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        $this->get_data($this->RequestPost, '2');

    }

    /*
     * デモアカウント停止処理
     */
    public function demo_stop_data() {

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //アカウントID
        if (empty($this->RequestPost["account_id"])) {
            Logger::warning("Request account_id post error.");
            throw new BadRequestException();
        }

        // アカウント情報取得
        $query = "SELECT tus.id AS tus_id "
                . "FROM m_account ma "
                . "INNER JOIN t_unis_service tus ON (ma.id = tus.m_account_id AND tus.delete_flag = '0') "
                . "WHERE ma.id = :account_id AND ma.account_div = '2' AND ma.delete_flag = '0'";
        $param = array("account_id" => $this->RequestPost["account_id"]);
        $m_account = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);
        if (empty($m_account[0]["tus_id"])) {
            Logger::warning("m_account t_unis_service No Date");
            throw new DbException();
        }

        $res["result_cd"] = 0;

        // トランザクション開始
        Database::getInstance()->dbConnect(Configure::read('DB_MASTER'));
        Database::getInstance()->dbBeginTransaction(Configure::read('DB_MASTER'));

        // アカウントマスタ更新
        $sql = "UPDATE m_account SET "
                . "  pause_date = NOW() "
                . ", end_date = NOW() "
                . ", status_flag = '2' "
                . ", updated_by = :updated_by "
                . ", updated = now() "
                . "WHERE id = :account_id ";
        $param = array("account_id" => $this->RequestPost["account_id"], "updated_by" => $this->Auth->user("id"));
        try {
            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $sql, $param);
        } catch (DBException $e) {
            Logger::warning("m_account update error.");
            Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
            $res["result_cd"] = 1;
            $res["err_message"] = "通信エラーが発生しました。";
            $this->return_json($res);
        }

        // UNIS契約サービステーブル更新
        $param = array();
        foreach ($m_account as $i => $val) {
            $codeArr[] = ":t_unis_service_id{$i}";
            $param["t_unis_service_id{$i}"] = $val["tus_id"];
        }
        $where = "WHERE id IN (" . implode(",", $codeArr) . ") ";
        $sql = "UPDATE t_unis_service SET "
                . "  end_date = NOW() "
                . ", token = NULL "
                . ", token_expire = NULL "
                . ", status_flag = '1' "
                . ", updated_by = :updated_by "
                . ", updated = now() "
                . $where;
        $param["updated_by"] = $this->Auth->user("id");
        try {
            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $sql, $param);
        } catch (DBException $e) {
            Logger::warning("t_unis_service update error.");
            Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
            $res["result_cd"] = 1;
            $res["err_message"] = "通信エラーが発生しました。";
            $this->return_json($res);
        }

        //コミット
        Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));

        //システム日時
        $dateTime = new DateTime();
        $nowDate = $dateTime->format('Y-m-d');

        $res["result_date"] = $nowDate;
        $this->return_json($res);

    }

    /*
     * デモアカウント発行
     */
    public function demo_create() {

        $this->set('titleName', "デモアカウント発行");
        $err_message = "";

        //販路マスタを取得する
        $marketList = $this->get_m_market('2');
        $this->set("marketList", $marketList);

        // 発行ボタン押下時
        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] === "create") {
            $request = array();
            $request = $this->ins_output_dedicated($this->RequestPost, '2');

            if (!empty($request['err_message'])) {
                $err_message = $request['err_message'];
            }

        }

        $this->set("create_max_count", $this->create_max_count);
        $this->set("err_message", $err_message);
        $this->render('dedicated' . DS . 'demo_create.tpl');

    }

    /*
     * デモアカウントダウンロード
     */
    public function demo_download() {

        $this->set('titleName', "デモアカウントダウンロード");
        $err_message = "";

        //ファイル出力
        if (isset($this->RequestPost["type"])) {
            //発送データ出力
            if ($this->RequestPost["type"] == "publish" && isset($this->RequestPost["id"]) && $this->RequestPost["id"] != "") {
                $tmp_file_list = Session::get($this->controller . $this->action);
                $fname = $tmp_file_list[$this->RequestPost["id"]]["name"];
                $fpath = Configure::read('DEMO_DIR') . $fname;

                if (is_file($fpath) && is_readable($fpath)) {
                    $this->csv_download($fpath, $fname);
                } else {
                    $err_message = "ファイルが存在しません。";
                }
            }
        }

        //ファイルのリストを取得
        $file_list = $this->get_file_list(Configure::read('DEMO_DIR'));
        //file_listをSESSIONに保持
        Session::set($this->controller . $this->action, $file_list);

        $this->set("file_list", $file_list);
        $this->set("err_message", $err_message);
        $this->render('dedicated' . DS . 'demo_download.tpl');

    }

    /*
     * 検索処理
     */
    private function get_download_data($requestPost, $account_div) {

    }

    /*
     * 検索処理
     */
    private function get_data($requestPost, $account_div) {

        $res = array();

        //page
        $start = 0;
        if (isset($requestPost["page"]) && $requestPost["page"] > 0) {
            $start = ($requestPost["page"] - 1) * $this->search_limit;
        }

        //アカウント区分
        if (empty($account_div)) {
            Logger::warning("Request account_div post error.");
            throw new BadRequestException();
        }

        $messageList = array();
        //発行日(Form)
        if (!empty($requestPost["start_from"]) && !Validation::checkYmd($requestPost["start_from"])) {
            $messageList['start_from'] = "発行日を正しく入力してください。";
        }
        //発行日(To)
        if (!empty($requestPost["start_to"]) && !Validation::checkYmd($requestPost["start_to"])) {
            $messageList['start_to'] = "発行日を正しく入力してください。";
        }
        //発行日妥当性チェック
        if (empty($messageList['start_from']) && empty($messageList['start_to']) && !empty($requestPost["start_from"]) && !empty($requestPost["start_to"])) {
            if (strtotime($requestPost["start_from"]) > strtotime($requestPost["start_to"])) {
                $messageList['created_validity'] = "発行日を正しく入力してください。";
            }
        }

        //初回認証日(Form)
        if (!empty($requestPost["init_from"]) && !Validation::checkYmd($requestPost["init_from"])) {
            $messageList['init_from'] = "初回認証日を正しく入力してください。";
        }
        //初回認証日(To)
        if (!empty($requestPost["init_to"]) && !Validation::checkYmd($requestPost["init_to"])) {
            $messageList['init_to'] = "初回認証日を正しく入力してください。";
        }
        //初回認証日妥当性チェック
        if (empty($messageList['init_from']) && empty($messageList['init_to']) && !empty($requestPost["init_from"]) && !empty($requestPost["init_to"])) {
            if (strtotime($requestPost["init_from"]) > strtotime($requestPost["init_to"])) {
                $messageList['init_validity'] = "初回認証日を正しく入力してください。";
            }
        }

        //エラーメッセージを結合
        $errorMessage = "";
        foreach ($messageList as $message) {
            $errorMessage .= $message;
        }

        if (!empty($errorMessage)) {
            $res = array("result_cd" => 9, "error_count" => count($messageList), "error_message" => $errorMessage);
            $this->return_json($res);
        }

        $res = $this->get_sql_date($requestPost, $account_div, $start);

        $this->return_json($res);
    }

    /*
     * アカウントIDをもとにアカウント情報の取得
     */
    private function get_account_data_by_account_id($account_id, $account_div = '1') {
        $query = "SELECT ma.id, "
               . "    ma.login_id, "
               . "    ma.init_password, "
               . "    ma.account_div, "
               . "    ma.start_date, "
               . "    ma.status_flag, "
               . "    ma.admin_status_flag, "
               . "    tus.init_auth_datetime, "
               . "    tus.end_date, "
               . "    mma.market_name "
               . "FROM m_account ma "
               . "  INNER JOIN t_unis_service tus "
               . "    ON (ma.id = tus.m_account_id AND tus.delete_flag = '0') "
               . "  INNER JOIN m_market mma ON (tus.market_cd = mma.market_cd AND mma.delete_flag = '0') "
               . "WHERE ma.delete_flag = '0' "
               . "AND ma.account_div = :account_div "
               . "AND ma.id = :account_id ";
        $param = array("account_id" => $account_id, "account_div" => $account_div);
        return Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
    }

    /*
     * JSON形式返却
     */
    private function return_json($res) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($res);
        exit;
    }

    /*
     * 販路マスタ情報の取得
     */
    private function get_m_market($account_div) {

        $query = "SELECT id, account_div, market_cd, market_name FROM m_market WHERE delete_flag = '0' AND account_div = :account_div ORDER BY id";
        $param = array('account_div' => $account_div);
        $m_market = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);
        return $m_market;

    }

    /*
     * サービスマスタ情報の取得
     */
    private function get_m_service() {

        $query = "SELECT * FROM m_service WHERE delete_flag = '0' AND demo_unable_flag = '0' ORDER BY id";
        return Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query);

    }

    /*
     * 販路マスタ情報の取得
     */
    private function ins_output_dedicated($requestPost, $account_div) {

        $request = array();
        $err_message = "";

       //システム日時
       $dateTime = new DateTime();
       $nowDate = $dateTime->format('Y-m-d');

        // ダウンロードボタン押下
        // 入力チェック
        if (empty($account_div) ) {
            $request['err_message'] = "通信エラーが発生しました。";
            Logger::warning("Request account_div post error.");
            return $request;
        }

        if (empty($requestPost["count"])) {
            $err_message .= "件数を入力してください。\n";
        } elseif (!Validation::numeric($requestPost["count"])) {
            $err_message .= "件数を正しく入力してください。\n";
        } elseif ($requestPost["count"] > $this->create_max_count) {
            $err_message .= "件数は" . $this->create_max_count . "件以内で指定してください。\n";
        }

        if (empty($requestPost["market_div"])) {
            $err_message .= "販路を選択してください。\n";
        } elseif ($requestPost["market_div"] === "1" && empty($requestPost["market_select"])) {
            $err_message .= "販路を選択してください。\n";
        } elseif ($requestPost["market_div"] === "2") {
            if (empty($requestPost["market_text"]) || !Validation::maxLength($requestPost["market_text"], 40)) {
                $err_message .= "販路名を正しく入力してください。\n";
            }
        }

        if ($account_div == self::TRIAL_ACCOUNT_DIV) {
            if (empty($requestPost['trial_days'])) {
                $err_message .= "トライアル日数を正しく選択してください。\n";
            } else if (!Validation::numeric($requestPost['trial_days'])) {
                $err_message .= "トライアル日数を正しく選択してください。\n";
            } else if ($requestPost['trial_days'] < 1 || $requestPost['trial_days'] > 31) {
                $err_message .= "トライアル日数を正しく選択してください。\n";
            }
        }

        if (!empty($err_message) ) {
            $request['err_message'] = $err_message;
            return $request;
        }
        // ロックの取得
        $lockFlag = false;
        $lockName = "ins_output_dedicated";
        if ($this->is_free_lock($lockName)) {
            if ($this->get_lock($lockName)) {
                $lockFlag = true;
            }
        }

        if ($lockFlag) {
            // トランザクション開始
            Database::getInstance()->dbConnect(Configure::read('DB_MASTER'));
            Database::getInstance()->dbBeginTransaction(Configure::read('DB_MASTER'));

            //販路情報取得
            $ins_market_cd = "";//登録用販路CD
            $market_name = "";//販路名称
            if ($requestPost["market_div"] === "1") {
                $sql = "SELECT market_cd, market_name FROM m_market WHERE delete_flag = '0' AND id = :market_id AND account_div = :account_div ";
                $param = array("market_id" => $requestPost["market_select"], "account_div" => $account_div);
                $m_market = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $sql, $param);
                if (empty($m_market)) {
                    $request['err_message'] = "通信エラーが発生しました。";
                    Logger::warning("m_market No Date");
                    $this->release_lock($lockName);
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    return $request;
                }
                $ins_market_cd = $m_market["market_cd"];
                $market_name = $m_market["market_name"];
            //販路情報登録
            } elseif ($requestPost["market_div"] === "2") {

                $market_name = $requestPost["market_text"];

                //販路名称重複チェック
                $sql = "SELECT COUNT(*) as cnt FROM m_market "
                        . "WHERE account_div = :account_div "
                        . "AND market_name = :market_name "
                        . "AND delete_flag = '0' ";
                $param = array("account_div" => $account_div, "market_name" => $requestPost["market_text"]);
                $m_market_cnt = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $sql, $param);
                if ($m_market_cnt["cnt"] > 0) {
                    $request['err_message'] = "入力した販路名は既に登録されています。";
                    $this->release_lock($lockName);
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    return $request;
                }

                //販路コードの最大値を取得
                $sql = "SELECT max(market_cd) as market_cd FROM m_market "
                        . "WHERE account_div = :account_div ";
                $param = array("account_div" => $account_div);
                $max_market_cd = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $sql, $param);
                if (empty($max_market_cd["market_cd"])) {
                    $ins_market_cd = $account_div . "000001";
                } else {
                    $ins_market_cd = $max_market_cd["market_cd"] + 1;
                }

                if (substr($ins_market_cd, 1) === '000000') {
                    $request['err_message'] = "販路の最大登録数を超えているためシステム管理者にお問合せください。";
                    Logger::warning("market_cd Issuance Over");
                    $this->release_lock($lockName);
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    return $request;
                }

                /**********************/
                /* 販路マスタ新規作成 */
                /**********************/
                $sql = "INSERT INTO m_market ( "
                        . "account_div, market_cd, market_name, created_by, created, updated_by, updated "
                        . ") VALUES ( "
                        . ":account_div, :market_cd, :market_name, :created_by, NOW(), :updated_by, NOW() "
                        . ") ";
                $param = array(
                     "account_div" => $account_div
                    ,"market_cd" => $ins_market_cd
                    ,"market_name" => $requestPost["market_text"]
                    ,"created_by" => $this->Auth->user("id")
                    ,"updated_by" => $this->Auth->user("id")
                );
                try {
                    $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $sql, $param);
                } catch (DBException $e) {
                    Logger::warning("m_market insert error.");
                    $this->release_lock($lockName);
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    $request['err_message'] = "通信エラーが発生しました。";
                    return $request;
                }
            }

            //UNIS顧客情報取得
            $sql = "SELECT id FROM t_unis_cust WHERE delete_flag = '0' AND cust_cd = :cust_cd ";
            $param = array("cust_cd" => $this->cust_cd[$account_div]);
            $t_unis_cust = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $sql, $param);
            if (empty($t_unis_cust)) {
                $request['err_message'] = "通信エラーが発生しました。";
                Logger::warning("t_unis_cust no date");
                $this->release_lock($lockName);
                Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                return $request;
            }

            //入力した件数分ループ
            $csvList = array();//csv用
            $csvList['cnt'] = $requestPost["count"];
            for ($i = 0; $i < $requestPost["count"]; $i++) {

                // 発行したidをユニークになるまで取得を繰り返す
                $unique = false;
                for ($uniq_cnt = 0; $uniq_cnt < 5; $uniq_cnt++) {
                    $uniq_id = Func::getInitPassword(6); // 分かりにくい文字(半角数字0,1、半角英小文字i,o,l)を除外するためパスワードの関数をコール
                    $uniq_pass = Func::getInitPassword();
                    $sql = "SELECT COUNT(*) AS count FROM m_account WHERE hash_login_id = :login_id AND password = :password AND delete_flag = '0'";
                    $param = array("login_id" => Cipher::getPersonalHash($uniq_id), "password" => Cipher::getPasswordHash($uniq_pass));
                    $result = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $sql, $param);
                    if (empty($result) || $result['count'] < 1) {
                        $unique = true;
                        break;
                    }
                }
                if (!$unique) {
                    Logger::warning("DedicatedUser Issuance Over");
                    $this->release_lock($lockName);
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    $request['err_message'] = "通信エラーが発生しました。";
                    return $request;
                }

                $ma_init_date = null;
                $tus_start_date = null;
                if ($account_div === "2") {
                    $ma_init_date = $nowDate;
                    $tus_start_date = $nowDate;
                }
                /****************************/
                /* アカウントマスタ新規作成 */
                /****************************/
                $sql = "INSERT INTO m_account ( "
                        . "t_unis_cust_id, login_id, hash_login_id, init_password, password, init_date, account_div, start_date, created_by, created, updated_by, updated "
                        . ") VALUES ( "
                        . ":t_unis_cust_id, :login_id, :hash_login_id, :init_password, :password, :init_date, :account_div, NOW(), :created_by, NOW(), :updated_by, NOW() "
                        . ") ";
                $param = array(
                     "t_unis_cust_id" => $t_unis_cust["id"]
                    ,"login_id" => Cipher::rsaEncrypt($uniq_id)
                    ,"hash_login_id" => Cipher::getPersonalHash($uniq_id)
                    ,"init_password" => Cipher::rsaEncrypt($uniq_pass)
                    ,"password" => Cipher::getPasswordHash($uniq_pass)
                    ,"init_date" => $ma_init_date
                    ,"account_div" => $account_div
                    ,"created_by" => $this->Auth->user("id")
                    ,"updated_by" => $this->Auth->user("id")
                );

                try {
                    $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $sql, $param);
                } catch (DBException $e) {
                    Logger::warning("m_account insert error.");
                    $this->release_lock($lockName);
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    $request['err_message'] = "通信エラーが発生しました。";
                    return $request;
                }

                // 登録したアカウントのアカウントマスタidを取得
                $query = "SELECT id FROM m_account "
                        . "WHERE hash_login_id = :login_id AND password = :password AND delete_flag = '0'";
                $param = array("login_id" => Cipher::getPersonalHash($uniq_id), "password" => Cipher::getPasswordHash($uniq_pass));
                $new_m_account = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
                if (empty($new_m_account)) {
                    Logger::warning("m_account select error.");
                    $this->release_lock($lockName);
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    $request['err_message'] = "通信エラーが発生しました。";
                    return $request;
                }

                /************************************/
                /* UNIS契約サービステーブル新規作成 */
                /************************************/
                if ($account_div == self::TRIAL_ACCOUNT_DIV) {
                    $service_cd = array("120");
                } else {
                    $tmpRes = $this->get_m_service();
                    $service_cd = array();
                    foreach ($tmpRes as $row) {
                        $service_cd[] = $row['service_cd'];
                    }
                }
                foreach ($service_cd as $value) {
                    $query = "INSERT INTO t_unis_service ( "
                            . "t_unis_cust_id, m_account_id, service_cd, market_cd, start_date, created_by, created, updated_by, updated "
                            . ") VALUES ( "
                            . ":t_unis_cust_id, :m_account_id, :service_cd, :market_cd, :start_date, :created_by, NOW(), :updated_by, NOW() "
                            . ") ";
                    $param = array(
                         "t_unis_cust_id" => $t_unis_cust["id"]
                        ,"m_account_id" => $new_m_account["id"]
                        ,"service_cd" => $value
                        ,"market_cd" => $ins_market_cd
                        ,"start_date" => $tus_start_date
                        ,"created_by" => $this->Auth->user("id")
                        ,"updated_by" => $this->Auth->user("id")
                    );
                    try {
                        $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                    } catch (DBException $e) {
                        Logger::warning("t_unis_service insert error.");
                        $this->release_lock($lockName);
                        Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                        $request['err_message'] = "通信エラーが発生しました。";
                        return $request;
                    }
                }

                /***************************************/
                /* お試しアカウント区分テーブル新規登録*/
                /***************************************/
                if ($account_div == self::TRIAL_ACCOUNT_DIV) {
                    $query = "INSERT INTO t_trial_days ("
                         . " m_account_id, trial_days, created_by, created, updated_by, updated "
                         . ") VALUES ("
                         . ":m_account_id, :trial_days, :created_by, NOW(), :updated_by, NOW() "
                         . ") ";
                    $param = array(
                         "m_account_id" => $new_m_account["id"]
                        ,"trial_days" => $requestPost["trial_days"]
                        ,"created_by" => $this->Auth->user("id")
                        ,"updated_by" => $this->Auth->user("id")
                    );
                    try {
                        $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                    } catch (DBException $e) {
                        Logger::warning("t_unis_service insert error.");
                        $this->release_lock($lockName);
                        Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                        $request['err_message'] = "通信エラーが発生しました。";
                        return $request;
                    }
                }

                //csv用に設定
                $csvList['date'][$i]['login_id'] = $uniq_id;
                $csvList['date'][$i]['password'] = $uniq_pass;
                $csvList['date'][$i]['market_name'] = $market_name;
                $csvList['date'][$i]['account_id'] = $new_m_account["id"];
                if ($account_div == self::TRIAL_ACCOUNT_DIV) {
                    $csvList['date'][$i]['trial_days'] = $requestPost["trial_days"];
                }
            }

            //コミット
            Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));
        } else {
            Logger::warning("table lock failure.");
            $request['err_message'] = "通信エラーが発生しました。";
            return $request;
        }
        $this->release_lock($lockName);

        //csv作成
        $this->csv_creating($csvList, $account_div);
        return;

    }

    /*
     * csv作成
     */
    private function csv_creating($csvList, $account_div) {

        $file_name = date("YmdHis") . "_" . $this->Auth->user("u_code")  . "_" . $csvList['cnt']. ".csv";
        if ($account_div === "1") {
            $file_path = Configure::read('TRIAL_DIR');
            $file_name = "trial_" . $file_name;
            $put_csv_file = $file_path . $file_name;
        } elseif ($account_div === "2") {
            $file_path = Configure::read('DEMO_DIR');
            $file_name = "demo_" . $file_name;
            $put_csv_file = $file_path . $file_name;
        } else {
            Logger::warning("account_div error");
            throw new InternalErrorException();
        }

        $tmpfile = tmpfile();
        if ($account_div == self::TRIAL_ACCOUNT_DIV) {
            $header = array("ログインID", "パスワード", "販路", "アカウントID", "トライアル日数");
        } else {
            $header = array("ログインID", "パスワード", "販路", "アカウントID");
        }
        mb_convert_variables('SJIS-win', 'UTF-8', $header);
        fputcsv($tmpfile, $header, ',', '"');

        // CSV出力
        foreach ($csvList['date'] as $csvDate ) {
            mb_convert_variables('SJIS-win', 'UTF-8', $csvDate);
            fputcsv($tmpfile, $csvDate, ',', '"');
        }
        rewind($tmpfile);
        if (($handle = fopen($put_csv_file, 'w')) !== false) {
            while ($line = fgets($tmpfile)) {
                fputs($handle, rtrim($line) . "\r\n"); // 強制的にcrlfで
            }
            fclose($handle);
        } else {
            Logger::warning("file open error.($put_csv_file)");
            throw new InternalErrorException();
        }
        fclose($tmpfile);

        //古いファイルは削除
        $file_list = $this->get_file_list($file_path);
        $fcnt = 0;
        foreach ($file_list as $file) {
            if (preg_match('/\A(trial|demo)_[0-9]{14}_.+_[0-9]+\.csv\z/u', $file["name"])) {
                $fcnt++;
                if ($fcnt > $this->del_fcnt)
                    unlink($file_path . $file["name"]);
            }
        }

        $this->csv_download($put_csv_file, $file_name);

    }

    /*
     * csvダウンロード
     */
    private function csv_download($fpath, $file_name) {

        header('Content-Type: application/force-download');
        header('Content-Length: ' . filesize($fpath));
        header('Content-Transfer-Encoding: binary');
        header('Content-disposition: attachment; filename="' . $file_name . '"');
        readfile($fpath);
        exit;
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
     * 検索処理(SQL)
     */
    private function get_sql_date($requestPost, $account_div, $start, $csv_mode_flg = 0) {

        $param = array();
        $res = array();

        /********************/
        /* アカウントマスタ */
        /********************/
        $ma_where = "AND ma.account_div = :account_div ";
        $param["account_div"] = $account_div;
        //ログインid
        if (isset($requestPost["login_id"]) && $requestPost["login_id"] != "") {
            $ma_where .= "AND ma.hash_login_id = :login_id ";
            $param["login_id"] = Cipher::getPersonalHash($requestPost["login_id"]);
        }
        //発行日(from)
        if (isset($requestPost["start_from"]) && $requestPost["start_from"] != "") {
            $ma_where .= "AND ma.start_date >= :start_from ";
            $param["start_from"] = date("Y-m-d", strtotime($requestPost["start_from"]));
        }
        //発行日(to)
        if (isset($requestPost["start_to"]) && $requestPost["start_to"] != "") {
            $ma_where .= "AND ma.start_date <= :start_to ";
            $param["start_to"] = date("Y-m-d", strtotime($requestPost["start_to"]));
        }
        //アカウントid
        if (isset($requestPost["account_id"]) && $requestPost["account_id"] != "") {
            $ma_where .= "AND ma.id = :account_id ";
            $param["account_id"] = $requestPost["account_id"];
        }

        /****************************/
        /* UNIS契約サービステーブル */
        /****************************/
        $tus_where = "ma.id = tus.m_account_id AND tus.delete_flag = '0' ";

        //初回認証日(from)
        if (isset($requestPost["init_from"]) && $requestPost["init_from"] != "") {
            $tus_where .= "AND tus.init_auth_datetime >= :init_from ";
            $param["init_from"] = date("Y-m-d", strtotime($requestPost["init_from"])) . " 00:00:00";
        }
        //初回認証日(to)
        if (isset($requestPost["init_to"]) && $requestPost["init_to"] != "") {
            $tus_where .= "AND tus.init_auth_datetime <= :init_to ";
            $param["init_to"] = date("Y-m-d", strtotime($requestPost["init_to"])) . " 23:59:59";
        }

        /**************/
        /* 販路マスタ */
        /**************/
        $mma_where = "tus.market_cd = mma.market_cd AND mma.delete_flag = '0' ";
        //販路id
        if (isset($requestPost["market_id"]) && $requestPost["market_id"] != "") {
            $mma_where .= "AND mma.id = :market_id ";
            $param["market_id"] = $requestPost["market_id"];
        }

        //システム日時
        $currentDateTime = date('Y-m-d', time());

        $res["result_cd"] = 0;

        $ttd_from = "";
        if ($account_div == "1") {
            $ttd_from = "  LEFT JOIN t_trial_days ttd ON ma.id = ttd.m_account_id ";
        }
        $from = "FROM m_account ma "
                . "  INNER JOIN t_unis_service tus ON (" . $tus_where . ") "
                . "  INNER JOIN m_market mma ON (" . $mma_where . ") "
                . $ttd_from
                . "WHERE ma.delete_flag = '0' "
                . $ma_where;

        //1ページ目のみ件数を取得
        if ($start == 0) {
            $query = "SELECT COUNT(DISTINCT ma.id) as cnt {$from}";
            $ret = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, $param);
            $res["search_cnt"] = $ret[0]["cnt"];
            if ($res["search_cnt"] >= 10001) {
                $res["search_cnt"] = 10001;
            }
        }

        // limit指定判別。csv出力時はlimitを設定しない。
        $limit_sql = "";
        if ($csv_mode_flg === 0) {
            $limit_sql = " LIMIT {$start}, {$this->search_limit}";
        }

        if ($account_div == "1") {
            $query = "SELECT ma.id, ma.login_id, init_password, ma.account_div, ma.start_date, ma.status_flag, ma.admin_status_flag, tus.init_auth_datetime, tus.end_date, mma.market_name, IFNULL(ttd.trial_days, '" . self::DEFAULT_TRIAL_DAYS . "') as trial_days {$from} ORDER BY ma.id {$limit_sql}";
        } else {
            //m_serviceから有効なservice_cdを取得
            $tmpRes = $this->get_m_service();
            foreach($tmpRes as $key => $row) {
                $mService[] = $row['service_cd'];
                if ($account_div !== "1") {
                    $param[ "service_cd{$key}" ] = $row['service_cd'];
                }
            }

            $query = "SELECT DISTINCT ma.id, ma.login_id, ma.account_div, ma.start_date, ma.status_flag, ma.admin_status_flag, ";
            foreach($mService as $key => $serviceCd) {
                $query .= "(SELECT init_auth_datetime FROM t_unis_service WHERE m_account_id = ma.id AND service_cd = :service_cd{$key} ) AS init_auth_datetime_{$serviceCd}, ";
            }
            $query .= "tus.end_date, mma.market_name {$from} ORDER BY ma.id {$limit_sql}";
            $res['m_service_cds'] = $mService;
        }
        $dedicated_date = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);
        for ($i = 0; $i < count($dedicated_date); $i++) {
            $dedicated_date[$i]["login_id"] = Cipher::rsaDecrypt($dedicated_date[$i]["login_id"]);
            $dedicated_date[$i]["init_password"] = Cipher::rsaDecrypt($dedicated_date[$i]["init_password"]);
            $dedicated_date[$i]["valid_account"] = "1";
            if ($dedicated_date[$i]["status_flag"] !== "0" || $dedicated_date[$i]["admin_status_flag"] !== "0" || $dedicated_date[$i]["start_date"] > $currentDateTime || (!empty($dedicated_date[$i]["end_date"]) && $dedicated_date[$i]["end_date"] < $currentDateTime)) {
                $dedicated_date[$i]["valid_account"] = "0";
            }
        }
        $res["search_data"] = $dedicated_date;
        $res["length"] = count($dedicated_date);

        return $res;
    }

    private function get_trial_list_row($row) {
        $ret = array();
        $ret[] = $row["id"];
        $ret[] = $row["login_id"];
        $ret[] = $row["init_password"];
        $ret[] = $row["trial_days"];
        $ret[] = $row["market_name"];
        $ret[] = $row["start_date"];
        $ret[] = $row["init_auth_datetime"];
        $ret[] = $row["end_date"];
        return $ret;
    }
}
