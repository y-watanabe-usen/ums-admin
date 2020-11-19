<?php

// ライブラリ読み込み
require_once(LIB_DIR . DS . 'class.Cipher.php');

/*
 * アカウント
 */
class Account extends Controller {

    public $search_limit = 50;

    /*
     * 前処理
     */
    public function beforeFilter() {
        // ログインチェック
        $this->checkLogin();
        // 権限チェック
        $this->checkAcl();
    }

    /*
     * 検索画面
     */
    public function search() {
        $this->set('titleName', "アカウント検索");

        //詳細画面から検索条件を受け取る
        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] == "search") {
            $search_info["type"] = "search";
            $search_info["cust_cd"] = $this->RequestPost["cust_cd"];
            $search_info["name"] = $this->RequestPost["name"];
            $search_info["tel"] = $this->RequestPost["tel"];
            $search_info["login_id"] = $this->RequestPost["login_id"];
            $search_info["mail_address"] = $this->RequestPost["mail_address"];
            $search_info["service"] = $this->RequestPost["service"];

            $this->set("search_info", $search_info);
        }

        //サービスマスタを取得する
        $service_list = $this->get_service();

        $this->set("service_list", $service_list);
        $this->render('account' . DS . 'search.tpl');
    }

    /*
     * 検索処理
     */
    public function get_data() {

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        $res = array();

        //page
        $start = 0;
        if (isset($this->RequestPost["page"]) && $this->RequestPost["page"] > 0) {
            $start = ($this->RequestPost["page"] - 1) * $this->search_limit;
        }

        $param = array();

        $uc_where = "ma.t_unis_cust_id = uc.id AND uc.delete_flag = '0' ";
        //顧客CD
        if (isset($this->RequestPost["cust_cd"]) && $this->RequestPost["cust_cd"] != "") {
            $uc_where .= "AND uc.cust_cd = :cust_cd ";
            $param["cust_cd"] = $this->RequestPost["cust_cd"];
        }
        //設置先名称
        if (isset($this->RequestPost["name"]) && $this->RequestPost["name"] != "") {
            $uc_where .= "AND uc.name like :name ";
            $param["name"] = '%' . $this->RequestPost["name"] . '%';
        }
        //電話番号
        if (isset($this->RequestPost["tel"]) && $this->RequestPost["tel"] != "") {
            $uc_where .= "AND uc.hash_tel = :tel ";
            $param["tel"] = Cipher::getPersonalHash($this->RequestPost["tel"]);
        }

        $ma_where = "";
        //ログインid
        if (isset($this->RequestPost["login_id"]) && $this->RequestPost["login_id"] != "") {
            $ma_where .= "AND ma.hash_login_id = :login_id ";
            $param["login_id"] = Cipher::getPersonalHash($this->RequestPost["login_id"]);
        }
        //メールアドレス
        if (isset($this->RequestPost["mail_address"]) && $this->RequestPost["mail_address"] != "") {
            $ma_where .= "AND ma.hash_mail_address = :mail_address ";
            $param["mail_address"] = Cipher::getPersonalHash(mb_strtolower($this->RequestPost["mail_address"]));
        }

        //UMs開始日(from)
        if (isset($this->RequestPost["from_date"]) && $this->RequestPost["from_date"] != "") {
            $ma_where .= "AND ma.start_date >= :from_date ";
            $param["from_date"] = $this->RequestPost["from_date"];
        }

        //UMs開始日(to)
        if (isset($this->RequestPost["to_date"]) && $this->RequestPost["to_date"] != "") {
            $ma_where .= "AND ma.start_date <= :to_date ";
            $param["to_date"] = $this->RequestPost["to_date"];
        }

        //チェーン店cd
        if (isset($this->RequestPost["chain_cd"]) && $this->RequestPost["chain_cd"] != "") {
            $uc_where .= "AND uc.chain_cd = :chain_cd ";
            $param["chain_cd"] = $this->RequestPost["chain_cd"];
        }

        //システム日時
        $currentDateTime = date('Y-m-d H:i:s', time());

        $us_join = "";
        $ssh_where = "";
        //サービス
        if (isset($this->RequestPost["service"]) && is_array($this->RequestPost["service"])) {
            $bindArr = array();
            foreach ($this->RequestPost["service"] as $i => $val) {
                $bindArr[] = ":service_cd" . $i;
                $param["service_cd" . $i] = $val;
            }
            $us_join .= "INNER JOIN (select distinct m_account_id FROM t_unis_service WHERE service_cd in (" . implode(",", $bindArr) . ") "
                    . "AND status_flag = '0' AND admin_status_flag = '0' AND delete_flag = '0') us "
                    . "  ON (us.m_account_id = ma.id) "
                    . "INNER JOIN t_unis_service us2 ON (uc.id = us2.t_unis_cust_id AND us2.delete_flag = '0') "
                    . "LEFT JOIN t_service_stop_history ssh ON (us2.id = ssh.t_unis_service_id AND ssh.delete_flag = '0' "
                   . "   AND ssh.start_datetime <= '" . $currentDateTime . "' "
                   . "   AND (ssh.release_datetime >= '" . $currentDateTime . "' OR ssh.release_datetime IS NULL)) ";
            $ssh_where .= "AND ssh.id IS NULL ";
        }

        $from = "FROM m_account ma "
                . "  INNER JOIN t_unis_cust uc ON (" . $uc_where . ") "
                . $us_join
                . "WHERE ma.delete_flag = '0' "
                . "AND ma.account_div = '0' "
                . $ma_where . $ssh_where;

        //1ページ目のみ件数を取得
        if ($start == 0) {
            $query = "SELECT COUNT(*) as cnt FROM ( SELECT DISTINCT cust_cd {$from} limit 10001 ) as tbl ";
            $ret = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, $param);
            $res["search_cnt"] = $ret[0]["cnt"];
            if ($res["search_cnt"] === "10001") {
                $res["search_cnt"] = 10001;
            }
        }

        $query = "SELECT DISTINCT uc.id {$from} ORDER BY uc.id LIMIT {$start}, {$this->search_limit}";
        $fetchResult = Database::getInstance()->dbExecute(Configure::read('DB_SLAVE'), $query, $param);
        $t_unis_cust_id = array();
        while ($row = $fetchResult->fetch(PDO::FETCH_ASSOC)) {
            $t_unis_cust_id[] = $row["id"];
        }

        $res["result_cd"] = 0;
        $res["length"] = count($t_unis_cust_id);
        if (!empty($t_unis_cust_id)) {
            $query = "SELECT * "
                    . " FROM (SELECT uc.id AS t_unis_cust_id, uc.cust_cd, uc.name, uc.tel, ma.login_id, ma.mail_address, ma.start_date, ma.end_date, ma.id AS m_account_id "
                    . "           FROM m_account ma "
                    . "             INNER JOIN t_unis_cust uc ON (ma.t_unis_cust_id = uc.id AND uc.delete_flag = '0') "
                    . "           WHERE uc.id IN (" . implode(",", $t_unis_cust_id) . ")"
                    . "           ORDER BY uc.id, ma.id) a "
                    . " ORDER BY t_unis_cust_id DESC, m_account_id DESC ";
            $fetchResult = Database::getInstance()->dbExecute(Configure::read('DB_SLAVE'), $query, $param);

            $i = 0;
            $rowspan = 1;
            $before_t_unis_cust_cd_id = "";
            while ($row = $fetchResult->fetch(PDO::FETCH_ASSOC)) {
                if ($row["t_unis_cust_id"] === $before_t_unis_cust_cd_id) {
                    $rowspan++;
                } else {
                    $rowspan = 1;
                }
                $before_t_unis_cust_cd_id = $row["t_unis_cust_id"];
                $res["search_data"][$i]["rowspan"] = $rowspan;
                $res["search_data"][$i]["t_unis_cust_id"] = $row["t_unis_cust_id"];
                $res["search_data"][$i]["cust_cd"] = $row["cust_cd"];
                $res["search_data"][$i]["name"] = Func::h($row["name"]);
                $res["search_data"][$i]["tel"] = Cipher::rsaDecrypt($row["tel"]);
                $res["search_data"][$i]["login_id"] = Cipher::rsaDecrypt($row["login_id"]);
                $res["search_data"][$i]["mail_address"] = Cipher::rsaDecrypt($row["mail_address"]);
                $res["search_data"][$i]["start_date"] = $row["start_date"];
                $res["search_data"][$i]["end_date"] = (isset($row["end_date"])) ? $row["end_date"] : "";
                $res["search_data"][$i]["m_account_id"] = $row["m_account_id"];
                $i++;
            }
            $res["search_data"] = array_reverse($res["search_data"]);
        }

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($res);
        exit;
    }

    /*
     * 一覧画面
     */
    public function account_list() {

        $this->set('titleName', "アカウント一覧");

        //入力チェック
        //検索条件
        $this->set("cust_cd", $this->RequestPost["cust_cd"]);
        $this->set("name", Func::h($this->RequestPost["name"]));
        $this->set("tel", $this->RequestPost["tel"]);
        $this->set("login_id", $this->RequestPost["login_id"]);
        $this->set("mail_address", $this->RequestPost["mail_address"]);
        $this->set("service", $this->RequestPost["service"]);
        $transition = "";
        $organization_code = "";
        if (!empty($this->RequestPost["transition"])) {
            $transition = $this->RequestPost["transition"];
        }
        if (!empty($this->RequestPost["organization_code"])) {
            $organization_code = $this->RequestPost["organization_code"];
        }
        $this->set("transition", $transition);
        $this->set("organization_code", $organization_code);

        //サービスマスタを取得する
        $service_list = $this->get_service();

        //UNIS情報
        $t_unis_info_id = $this->RequestPost["t_unis_cust_id"];
        $unis_info = $this->get_unis_info($t_unis_info_id);
        if (!isset($unis_info["cust_cd"]) || $unis_info["cust_cd"] == "") {
            Logger::warning("No UNIS cust data.");
            throw new BadRequestException();
        }

        //アカウント情報
        $account_info = $this->get_account_info_by_t_unis_cust_id($unis_info["id"]);
        if (!isset($account_info[0]["id"]) || $account_info[0]["id"] == "") {
            Logger::warning("No account data.");
            throw new BadRequestException();
        }

        $service_info = array();
        foreach ($account_info as $account) {
            //サービス情報
            $tmp = $this->get_service_info($account["id"], "account_list");
            foreach ($tmp as $key => $line) {
                $checkMark = "";
                //サービス契約なし
                if (!isset($line["stop_div"]) && $line["status_flag"] === '0' && $line["admin_status_flag"] === '0') {
                    $checkMark = "✔";
                }
                $service_info[$account["id"]][$line["service_cd"]]["check_mark"] = $checkMark;
            }
        }

        //発行情報
        $issue_info = $this->get_issue_info($t_unis_info_id);

        //最新発行情報
        if (!empty($issue_info)) {
            $new_issue_info = $issue_info["0"];
            //郵便番号は前後で分割
            $new_issue_info = $this->zip_substr($new_issue_info);
        } else {
            $new_issue_info['t_unis_cust_id'] =  $t_unis_info_id;
            $new_issue_info['t_unis_cust_status_flag'] =  $unis_info['status_flag'];
        }

        //再送登録ポップアップ表示設定
        //UNIS用
        $unis_issue = array();
        $issue_name = "";
        $issue_zip_cd1 = "";
        $issue_zip_cd2 = "";
        $issue_address1 = "";
        $issue_address2 = "";
        $issue_address3 = "";
        //送付先名称の有無で住所もセット
        if (!empty($unis_info["name"])) {
            $issue_name = $unis_info["name"];
            $zip_cd = explode("-", $unis_info["zip_cd"]);
            $issue_address1 = $unis_info["address1"];
            $issue_address2 = $unis_info["address2"];
            $issue_address3 = $unis_info["address3"];
        }

        //送付先郵便番号
        if (!empty($zip_cd['0'])) {
            $issue_zip_cd1 = $zip_cd['0'];
            $issue_zip_cd2 = $zip_cd['1'];
        }
        $unis_issue["issue_name"] = $issue_name;
        $unis_issue["issue_zip_cd1"] = $issue_zip_cd1;
        $unis_issue["issue_zip_cd2"] = $issue_zip_cd2;
        $unis_issue["issue_address1"] = $issue_address1;
        $unis_issue["issue_address2"] = $issue_address2;
        $unis_issue["issue_address3"] = $issue_address3;

        //アカウント証発送履歴用
        $issue = array();
        //送付先名称の有無で住所もセット
        $name = !empty($new_issue_info["name"]) ? $new_issue_info["name"] : $unis_issue["issue_name"];
        //送付先郵便番号
        $zip_cd1 = !empty($new_issue_info["name"]) ? $new_issue_info["zip_cd1"] : $unis_issue["issue_zip_cd1"];
        $zip_cd2 = !empty($new_issue_info["name"]) ? $new_issue_info["zip_cd2"] : $unis_issue["issue_zip_cd2"];
        //送付先住所1
        $address1 = !empty($new_issue_info["name"]) ? $new_issue_info["address1"] : $unis_issue["issue_address1"];
        //送付先住所2
        $address2 = !empty($new_issue_info["name"]) ? $new_issue_info["address2"] : $unis_issue["issue_address2"];
        //送付先住所3
        $address3 = !empty($new_issue_info["name"]) ? $new_issue_info["address3"] : $unis_issue["issue_address3"];
        $issue["name"] = $name;
        $issue["zip_cd1"] = $zip_cd1;
        $issue["zip_cd2"] = $zip_cd2;
        $issue["address1"] = $address1;
        $issue["address2"] = $address2;
        $issue["address3"] = $address3;

        //アカウント証ダイレクト出力履歴取得
        $direct_pdf_info = $this->get_direct_pdf_info($t_unis_info_id);
        //有効なサービス数取得
        $valid_service_count = $this->get_valid_service_count($t_unis_info_id);

        $this->set("service_list", $service_list);
        $this->set("unis_info", $unis_info);
        $this->set("account_info", $account_info);
        $this->set("service_info", $service_info);
        $this->set("issue_info", $issue_info);
        $this->set("new_issue_info", $new_issue_info);
        $this->set("unis_issue", $unis_issue);
        $this->set("issue", $issue);
        $this->set("direct_pdf_info", $direct_pdf_info);
        $this->set("valid_service_count", $valid_service_count);
        $this->render('account' . DS . 'account_list.tpl');
    }

    /*
     * 詳細画面
     */
    public function detail() {

        $this->set('titleName', "アカウント詳細");

        //入力チェック
        if (!isset($this->RequestPost["account_id"]) || $this->RequestPost["account_id"] == "") {
            Logger::warning("Request id post error.");
            throw new BadRequestException();
        }

        //検索条件
        $this->set("cust_cd", $this->RequestPost["cust_cd"]);
        $this->set("name", $this->RequestPost["name"]);
        $this->set("tel", $this->RequestPost["tel"]);
        $this->set("login_id", $this->RequestPost["login_id"]);
        $this->set("mail_address", $this->RequestPost["mail_address"]);
        $this->set("service", $this->RequestPost["service"]);
        $transition = "";
        $organization_code = "";
        if (!empty($this->RequestPost["transition"])) {
            $transition = $this->RequestPost["transition"];
        }
        if (!empty($this->RequestPost["organization_code"])) {
            $organization_code = $this->RequestPost["organization_code"];
        }
        $this->set("transition", $transition);
        $this->set("organization_code", $organization_code);

        //アカウント情報
        $account_info = $this->get_account_info($this->RequestPost["account_id"]);
        if (!isset($account_info["id"]) || $account_info["id"] == "") {
            Logger::warning("No account data.");
            throw new BadRequestException();
        }

        // 初期パスワード
        $init_password = Cipher::rsaDecrypt($account_info["init_password"]);
        // 初期パスワードをハッシュ化
        $hash_init_password = Cipher::getPasswordHash($init_password);
        // ハッシュ化してある現在のパスワード
        $password = $account_info["password"];        
        // パスワードが変更されているかのフラグ(true:変更済 false:未変更)
        $init_password_change = false;
        if (hash_init_password !== password) {
            $init_password_change = true;
        }

        //UNIS情報
        $unis_info = $this->get_unis_info($account_info["t_unis_cust_id"]);
        if (!isset($unis_info["cust_cd"]) || $unis_info["cust_cd"] == "") {
            Logger::warning("No UNIS cust data.");
            throw new BadRequestException();
        }

        //サービス情報
        $preference = $this->get_preference();
        $service_info = $this->get_service_info($account_info["id"], "detail");
        for ($i = 0; $i < count($service_info); $i++) {
            $service_info[$i]["detail_status_div_name"] = "";
            if (!empty($service_info[$i]["detail_status_div"])) {
                $service_info[$i]["detail_status_div_name"] = $preference["unis_status_flag"][$service_info[$i]["detail_status_div"]];
            }
            if (!empty($service_info[$i]["t_unis_service_id"]) && empty($service_info[$i]["stop_div"])) {
                $old_service_stop_history = $this->get_old_service_stop_history($service_info[$i]["t_unis_service_id"]);
                if (!empty($old_service_stop_history['stop_div'])) {
                    $service_info[$i]["stop_div"] = $old_service_stop_history['stop_div'];
                    $service_info[$i]["start_datetime"] = $old_service_stop_history['start_datetime'];
                    $service_info[$i]["release_datetime"] = $old_service_stop_history['release_datetime'];
                }
            }
        }

        //発行情報
        $issue_info = $this->get_issue_info($account_info["t_unis_cust_id"]);

        $this->set("unis_info", $unis_info);
        $this->set("account_info", $account_info);
        $this->set("service_info", $service_info);
        $this->set("issue_info", $issue_info);
        $this->set("init_password", $init_password);
        $this->set("init_password_change", $init_password_change);
        $this->render('account' . DS . 'detail.tpl');
    }

    /*
     * サービス詳細画面
     */
    public function detail_account_stop() {
        $this->set('titleName', "サービス詳細");

        //連携チェック
        if (!isset($this->RequestPost["t_unis_service_id"]) || $this->RequestPost["t_unis_service_id"] == "") {
            Logger::warning("Request t_unis_service_id post error.");
            throw new BadRequestException();
        }
        if (!isset($this->RequestPost["account_id"]) || $this->RequestPost["account_id"] == "") {
            Logger::warning("Request account_id post error.");
            throw new BadRequestException();
        }

        //検索条件
        $this->set("cust_cd", $this->RequestPost["cust_cd"]);
        $this->set("name", $this->RequestPost["name"]);
        $this->set("tel", $this->RequestPost["tel"]);
        $this->set("login_id", $this->RequestPost["login_id"]);
        $this->set("mail_address", $this->RequestPost["mail_address"]);
        $this->set("service", $this->RequestPost["service"]);
        $transition = "";
        $organization_code = "";
        if (!empty($this->RequestPost["transition"])) {
            $transition = $this->RequestPost["transition"];
        }
        if (!empty($this->RequestPost["organization_code"])) {
            $organization_code = $this->RequestPost["organization_code"];
        }
        $this->set("transition", $transition);
        $this->set("organization_code", $organization_code);

        //アカウント情報
        $account_info = $this->get_account_info($this->RequestPost["account_id"]);
        if (!isset($account_info["id"]) || $account_info["id"] == "") {
            Logger::warning("No account data.");
            throw new BadRequestException();
        }

        //UNIS情報
        $unis_info = $this->get_unis_info($account_info["t_unis_cust_id"]);
        if (!isset($unis_info["cust_cd"]) || $unis_info["cust_cd"] == "") {
            Logger::warning("No UNIS cust data.");
            throw new BadRequestException();
        }

        //サービス情報
        $preference = $this->get_preference();
        $service_info = $this->get_service_info($account_info["id"], "detail_account_stop", $this->RequestPost["t_unis_service_id"]);
        $service_cd = "";
        for ($i = 0; $i < count($service_info); $i++) {
            $service_info[$i]["detail_status_div_name"] = "";
            if (!empty($service_info[$i]["detail_status_div"])) {
                $service_info[$i]["detail_status_div_name"] = $preference["unis_status_flag"][$service_info[$i]["detail_status_div"]];
            }
            $service_cd = $service_info[$i]["service_cd"];
        }

        //OTORAKU時のみ、視聴時間を取得
        if ($service_cd == "120") {
            if(!empty($this->RequestPost["disp_month"]) && Validation::checkYmd($this->RequestPost["disp_month"] . "-01", "-")) {
                $today = new DateTime();
                $disp_month = $this->RequestPost["disp_month"];
                $date_next = new DateTime($disp_month);
                $next_month = $date_next->add(DateInterval::createFromDateString('+6 months'))->format('Y-m');
                if($date_next <= $today) {
                    $this->set("next_month", $next_month);
                }
                $date_before = new DateTime($disp_month);
            } else {
                $date_before = new DateTime();
                $disp_month = $date_before->format('Y-m');
            }
            $before_month = $date_before->add(DateInterval::createFromDateString('-6 months'))->format('Y-m');

            // データが存在しない年月日以前は取得させない様制御
            if(strtotime($before_month) > strtotime('2015-07')) {
                $this->set("before_month", $before_month);
            }
            $dateTime = new DateTime($disp_month);
            $from_month = $dateTime->add(DateInterval::createFromDateString('-5 months'))->format('Y-m');
            $listened_time = $this->get_listened_time($account_info["id"], $from_month, $disp_month);
            $this->set("listened_time", $listened_time);
            if(!empty($this->RequestPost['disp_month'])) {
                unset($this->RequestPost['disp_month']);
            }
            $this->set("request", $this->RequestPost);
        }

        // 強制開錠出力フラグ
        $unlock_flg = false;
        if ($service_cd == "100" || $service_cd == "120" && !is_null($service_info[0]["cont_no"]) && !is_null($service_info[0]["detail_no"])){
            $unlock_flg = true;
        }

        //休止履歴情報を取得
        $result_data = $this->get_t_service_stop_history($this->RequestPost["t_unis_service_id"]);

        $this->set("unis_info", $unis_info);
        $this->set("account_info", $account_info);
        $this->set("service_info", $service_info);
        $this->set("unlock_flg", $unlock_flg);
        $this->set("result_data", $result_data['result_data']);
        $this->render('account' . DS . 'detail_account_stop.tpl');
    }

    /*
     * アカウント証発送履歴テーブル登録処理
     */
    public function ins_issue_history() {

        $res = array();

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //POSTチェック
        if (!isset($this->RequestPost["t_unis_cust_id"])) {
            Logger::warning("Request t_unis_cust_id post error.");
            throw new BadRequestException();
        }

        //ステータス区分チェック
        if (isset($this->RequestPost["status_flag"]) && $this->RequestPost["status_flag"] === "0") {
            $res = array("result_cd" => 9, "error_count" => 1, "error_message" => "未発送のデータがあるため登録できません。");
            $this->return_json($res);
        }
        $messageList = array();
        //送付先名称
        if (empty($this->RequestPost["name"]) || !Validation::maxLength($this->RequestPost["name"], 40)) {
            $messageList['name'] = "送付先名称は1文字以上40文字以下で入力してください。";
        }
        //送付先郵便番号
        if (empty($this->RequestPost["zip_cd1"]) || !Validation::between($this->RequestPost["zip_cd1"], 3, 3) || !Validation::numeric($this->RequestPost["zip_cd1"])) {
            $messageList['zip_cd1'] = "送付先郵便番号を正しく入力してください。";
        }
        //送付先郵便番号
        if (empty($this->RequestPost["zip_cd2"]) || !Validation::between($this->RequestPost["zip_cd2"], 4, 4) || !Validation::numeric($this->RequestPost["zip_cd2"])) {
            $messageList['zip_cd2'] = "送付先郵便番号を正しく入力してください。";
        }
        //送付先住所1
        if (empty($this->RequestPost["address1"]) || !Validation::maxLength($this->RequestPost["address1"], 50)) {
            $messageList['address1'] = "送付先住所1は1文字以上50文字以下で入力してください。";
        }
        //送付先住所2
        if (empty($this->RequestPost["address2"]) || !Validation::maxLength($this->RequestPost["address2"], 50)) {
            $messageList['address2'] = "送付先住所2は1文字以上50文字以下で入力してください。";
        }
        //送付先住所3
        if (!empty($this->RequestPost["address3"]) && !Validation::maxLength($this->RequestPost["address3"], 50)) {
            $messageList['address3'] = "送付先住所3は50文字以下で入力してください。";
        }
        //発送先
        if (empty($this->RequestPost["issue_type"]) || ($this->RequestPost["issue_type"] !== "1" && $this->RequestPost["issue_type"] !== "2")) {
            $messageList['issue_type'] = "発送先を選択してください。";
        }
        //郵便番号チェックで前後共にエラーの場合後4桁の配列を削除
        if (array_key_exists('zip_cd1', $messageList) && array_key_exists('zip_cd2', $messageList)) {
            unset($messageList['zip_cd2']);
        }

        //エラーメッセージを結合
        $errorMessage = "";
        foreach ($messageList as $message) {
            if (!empty($errorMessage)) {
                $errorMessage .= "<br/>";
            }
            $errorMessage .= $message;
        }

        if (!empty($errorMessage)) {
            $res = array("result_cd" => 9, "error_count" => count($messageList), "error_message" => $errorMessage);
            $this->return_json($res);
        }

        // ロックの取得
        $lockFlag = false;
        $lockName = "ins_issue_history" . $this->RequestPost["t_unis_cust_id"];
        if ($this->is_free_lock($lockName)) {
            if ($this->get_lock($lockName)) {
                $lockFlag = true;
            }
        }
        if ($lockFlag) {
            //UNIS顧客テーブル情報チェック
            $query = "SELECT branch_cd, status_flag "
                    . "FROM t_unis_cust "
                    . "WHERE delete_flag = '0' AND id = :t_unis_cust_id";
            $param = array("t_unis_cust_id" => $this->RequestPost["t_unis_cust_id"]);
            $t_unis_cust = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
            if (empty($t_unis_cust) || ($t_unis_cust['status_flag'] !== "1" && $t_unis_cust['status_flag'] !== "2")) {
                Logger::warning("t_unis_cust status_flag value error. status_flag[" . $t_unis_cust['status_flag'] . "]");
                $this->release_lock($lockName);
                throw new BadRequestException();
                $this->return_json($res);
            }

            //送付先「技術発送」選択時、管轄支店CDの登録がなければエラー
            if (empty($t_unis_cust['branch_cd']) && $this->RequestPost["issue_type"] === "2") {
                $this->release_lock($lockName);
                $res = array("result_cd" => 9, "error_count" => 1, "error_message" => "管轄支店が登録されていません。");
                $this->return_json($res);
            }

            if (($this->RequestPost["t_issue_history_id"] !== "") && ($this->RequestPost["status_flag"] !== "")) {
                //アカウント証発送履歴情報取得
                $query = "SELECT id, status_flag "
                        . "FROM t_issue_history "
                        . "WHERE delete_flag = '0' AND id = :id AND status_flag = :status_flag";
                $param = array("id" => $this->RequestPost["t_issue_history_id"], "status_flag" => $this->RequestPost["status_flag"]);
                $issue_history_info = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
                if (!isset($issue_history_info["id"]) || $issue_history_info["id"] == "") {
                    Logger::warning("No t_issue_history data.");
                    $this->release_lock($lockName);
                    throw new BadRequestException();
                }
            }

            //未発送データ存在チェック
            $query = "SELECT COUNT(*) AS count "
                    . "FROM t_issue_history "
                    . "WHERE delete_flag = '0' AND t_unis_cust_id = :t_unis_cust_id AND status_flag = '0'";
            $param = array("t_unis_cust_id" => $this->RequestPost["t_unis_cust_id"]);
            $count = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
            if ($count["count"] > 0) {
                $this->release_lock($lockName);
                $res = array("result_cd" => 9, "error_count" => 1, "error_message" => "未発送のデータがあるため登録できません。");
                $this->return_json($res);
            }

            //アカウント証発送履歴テーブルの登録
            $param = array(
                 "t_unis_cust_id" => $this->RequestPost["t_unis_cust_id"]
                ,"name" => $this->RequestPost["name"]
                ,"zip_cd" => $this->RequestPost["zip_cd1"] . "-" . $this->RequestPost["zip_cd2"]
                ,"address1" => $this->RequestPost["address1"]
                ,"address2" => $this->RequestPost["address2"]
                ,"address3" => $this->RequestPost["address3"]
                ,"status_flag" => '0'
                ,"created_by" => $this->Auth->user("id")
                ,"updated_by" => $this->Auth->user("id")
            );
            //管轄支店CDの設定
            $branch_cd_column = "";
            $branch_cd_value = "";
            if ($this->RequestPost["issue_type"] === "2") {
                $branch_cd_column = "branch_cd,";
                $branch_cd_value = ":branch_cd,";
                $param["branch_cd"] = $t_unis_cust['branch_cd'];
            }
            $query = "INSERT INTO t_issue_history ( "
                    . "t_unis_cust_id, name, zip_cd, address1, address2, address3, " . $branch_cd_column . " status_flag, created_by, created, updated_by, updated "
                    . ") VALUES ( "
                    . ":t_unis_cust_id, :name, :zip_cd, :address1, :address2, :address3, " . $branch_cd_value . " :status_flag, :created_by, NOW(), :updated_by, NOW() "
                    . ") ";
            try {
                $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
            } catch (DBException $e) {
                Logger::warning("t_issue_history insert error.");
                $this->release_lock($lockName);
                throw new BadRequestException();
            }
        } else {
            Logger::warning("table lock failure.");
            throw new BadRequestException();
        }
        $this->release_lock($lockName);

        //発行情報
        $issue_info = $this->get_issue_info($this->RequestPost["t_unis_cust_id"]);
        $count = null;
        if (!empty($issue_info)) {
            $count = 0;
            $issue_info[$count] = $this->zip_substr($issue_info[$count]);
        }
        $res = array("result_cd" => 0, "count" => $count, "result_data" => $issue_info);

        $this->return_json($res);
    }

    /*
     * アカウント証ダイレクト出力取得処理
     */
    public function get_direct_pdf_history() {

        $res = array();

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //POSTチェック
        if (!isset($this->RequestPost["t_unis_cust_id"])) {
            Logger::warning("Request t_unis_cust_id post error.");
            throw new BadRequestException();
        }

        //アカウント証ダイレクト出力履歴取得
        $direct_pdf_info = $this->get_direct_pdf_info($this->RequestPost["t_unis_cust_id"]);

        $res = array("result_cd" => 0, "count" => 0, "result_data" => $direct_pdf_info);

        $this->return_json($res);
    }

    /*
     * アカウント証発送履歴テーブル更新処理
     */
    public function up_issue_history() {

        $res = array();

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //入力チェック
        if (!isset($this->RequestPost["id"]) || !Validation::numeric($this->RequestPost["id"])) {
            Logger::warning("Request id post error.");
            throw new BadRequestException();
        }
        if (!isset($this->RequestPost["status_flag"])) {
            Logger::warning("Request status_flag post error.");
            throw new BadRequestException();
        }
        if (!isset($this->RequestPost["t_unis_cust_id"])) {
            Logger::warning("Request t_unis_cust_id post error.");
            throw new BadRequestException();
        }

        // ロックの取得
        $lockFlag = false;
        $lockName = "ins_issue_history" . $this->RequestPost["t_unis_cust_id"];
        if ($this->is_free_lock($lockName)) {
            if ($this->get_lock($lockName)) {
                $lockFlag = true;
            }
        }
        if ($lockFlag) {
            $query = "SELECT id, status_flag "
                    . "FROM t_issue_history "
                    . "WHERE delete_flag = '0' AND id = :id AND status_flag = :status_flag";
            $param = array("id" => $this->RequestPost["id"], "status_flag" => $this->RequestPost["status_flag"]);
            $issue_history_info = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
            if (!isset($issue_history_info["id"]) || $issue_history_info["id"] == "") {
                Logger::warning("No t_issue_history data.");
                $this->release_lock($lockName);
                throw new BadRequestException();
            }

            //更新項目の設定
            if ($this->RequestPost["status_flag"] === "0") {
                $up_date = "delete_flag = '1' ";
            } elseif ($this->RequestPost["status_flag"] === "2") {
                $up_date = "status_flag = '3' ";
            }
            //アカウント証発送履歴テーブルの更新
            $query = "UPDATE t_issue_history set "
                    . $up_date
                    . ", updated_by = :updated_by "
                    . ", updated = now() "
                    . "WHERE id = :id AND delete_flag = '0' ";
            $param = array(
                "id" => $issue_history_info["id"],
                "updated_by" => $this->Auth->user("id")
            );
            try {
                Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
            } catch (DBException $e) {
                Logger::warning("t_issue_history update error.");
                $this->release_lock($lockName);
                throw new BadRequestException();
            }
        } else {
            Logger::warning("table lock failure.");
            throw new BadRequestException();
        }
        $this->release_lock($lockName);

        //発行情報
        $issue_info = $this->get_issue_info($this->RequestPost["t_unis_cust_id"]);
        $count = null;
        if (!empty($issue_info)) {
            $count = 0;
            $issue_info[$count] = $this->zip_substr($issue_info[$count]);
        }
        $res = array("result_cd" => 0, "count" => $count, "result_data" => $issue_info);

        $this->return_json($res);

    }

    /*
     * アカウント情報の変更処理
     */
    public function save_account() {

        $res = array();

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //入力チェック
        if (!isset($this->RequestPost["account_id"]) || !Validation::numeric($this->RequestPost["account_id"])) {
            Logger::warning("Request account_id post error.");
            throw new BadRequestException();
        }
        if (!isset($this->RequestPost["new_mail_address"]) || $this->RequestPost["new_mail_address"] == "") {
            Logger::warning("Request new_mail_address post error.");
            throw new BadRequestException();
        }

        // メールアドレスのtrim
        $mail_address = Func::trim($this->RequestPost["new_mail_address"]);

        if (!$this->Validation->mail($mail_address)) {
            $res = array("result_cd" => 9, "error_message" => "メールアドレスを正しく入力してください。");
        } else {

            $query = "SELECT mail_address FROM m_account WHERE id = :id AND delete_flag = '0' ";
            $param = array("id" => $this->RequestPost["account_id"]);
            $account_info = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
            if (!isset($account_info["mail_address"]) || $account_info["mail_address"] == "") {
                Logger::warning("No mail_address data.");
                throw new BadRequestException();
            }

            $query = "UPDATE m_account set "
                    . "  mail_address = :mail_address "
                    . ", hash_mail_address = :hash_mail_address "
                    . ", updated_by = :updated_by "
                    . ", updated = now() "
                    . "WHERE id = :id AND delete_flag = '0' ";
            $param = array(
                "id" => $this->RequestPost["account_id"],
                "mail_address" => Cipher::rsaEncrypt($mail_address),
                "hash_mail_address" => Cipher::getPersonalHash(strtolower($mail_address)),
                "updated_by" => $this->Auth->user("id")
            );
            Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);

            $account_info = $this->get_account_info($this->RequestPost["account_id"]);
            if (!isset($account_info["id"]) || $account_info["id"] == "") {
                Logger::warning("No account data.");
                throw new BadRequestException();
            }

            $res = array("result_cd" => 0, "result_data" => $account_info);
        }

        $this->return_json($res);
    }

    /*
     * 強制解除処理
     */
    public function forced_release() {

        //システム日時
        $dateTime = new DateTime();
        $nowDate = $dateTime->format('Y-m-d H:i:s');

        $res = array();

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //入力チェック
        if (!isset($this->RequestPost["t_unis_service_id"])) {
            Logger::warning("Request t_unis_service_id post error.");
            throw new BadRequestException();
        }

        if (!isset($this->RequestPost["t_service_stop_history_id"])) {
            Logger::warning("Request t_service_stop_history_id post error.");
            throw new BadRequestException();
        }

        // ロックの取得
        $lockFlag = false;
        $lockName = "detail_account_stop" . $this->RequestPost["t_unis_service_id"];
        if ($this->is_free_lock($lockName)) {
            if ($this->get_lock($lockName)) {
                $lockFlag = true;
            }
        }

        if ($lockFlag) {

            //サービス停止履歴テーブルの取得
            $query = "SELECT id, stop_div "
                    . "FROM t_service_stop_history "
                    . "WHERE delete_flag = '0' AND id = :t_service_stop_history_id "
                    . "AND start_datetime <= :now AND (release_datetime >= :now OR release_datetime IS NULL) ";
            $param = array("t_service_stop_history_id" => $this->RequestPost["t_service_stop_history_id"], "now" => $nowDate);
            $t_service_stop_history = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
            //サービス停止履歴テーブルの更新
            if (!empty($t_service_stop_history)) {
                $beforeDate = date('Y-m-d H:i:s',strtotime($nowDate . ' -1 second'));//1秒前取得
                $query = "UPDATE t_service_stop_history set "
                       . "  release_datetime = :release_datetime "
                       . ", updated_by = :updated_by "
                       . ", updated = now() "
                       . "WHERE id = :id AND delete_flag = '0' ";
                $param = array(
                   "id" => $t_service_stop_history["id"],
                   "release_datetime" => $beforeDate,
                   "updated_by" => $this->Auth->user("id")
                );
                try {
                   Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                } catch (DBException $e) {
                    Logger::warning("t_service_stop_history update error.");
                    $this->release_lock($lockName);
                    throw new BadRequestException();
                }
            }

        } else {
            Logger::warning("table lock failure.");
            throw new BadRequestException();
        }
        $this->release_lock($lockName);

        //休止履歴情報を取得
        $result_data = $this->get_t_service_stop_history($this->RequestPost["t_unis_service_id"]);

        $res = array("result_data" => $result_data['result_data']);

        $this->return_json($res);
    }

    /*
     * 休止履歴情報の取得処理
     */
    public function get_service_stop_history() {

        $res = array();

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //入力チェック
        if (!isset($this->RequestPost["t_unis_service_id"]) || !Validation::numeric($this->RequestPost["t_unis_service_id"])) {
            Logger::warning("Request t_unis_service_id post error.");
            throw new BadRequestException();
        }

        //休止履歴情報を取得
        $result_data = $this->get_t_service_stop_history($this->RequestPost["t_unis_service_id"]);

        $res = array("result_cd" => 0, "result_data" => $result_data['result_data']);

        $this->return_json($res);
    }

    /*
     * 休止・強制施錠情報登録・更新処理
     */
    public function ins_up_service_stop_history() {

        $res = array();

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //POSTチェック
        if (!isset($this->RequestPost["t_unis_service_id"])) {
            Logger::warning("Request t_unis_service_id post error.");
            throw new BadRequestException();
        }

        if (!isset($this->RequestPost["from_change_flag"])) {
            Logger::warning("Request from_change_flag post error.");
            throw new BadRequestException();
        }

        $messageList = array();
        //停止区分
        if (empty($this->RequestPost["stop_div"])) {
            $res = array("result_cd" => 9, "error_count" => 1, "error_message" => "停止区分を選択してください。");
            $this->return_json($res);
        }

        //期間
        if (empty($this->RequestPost["from_div"])) {
            $res = array("result_cd" => 9, "error_count" => 1, "error_message" => "期間を選択してください。");
            $this->return_json($res);
        }

        if ($this->RequestPost["from_div"] === "2") {
            //休店期間開始日
            if (empty($this->RequestPost["stop_from"])) {
                $messageList['stop_from'] = "開始日を入力してください。";
            } elseif (!Validation::checkYmd($this->RequestPost["stop_from"])) {
                $messageList['stop_from'] = "開始日を正しく入力してください。";
            }
        }

        if ($this->RequestPost["stop_div"] === "1") {
            //休店期間終了日
            if (empty($this->RequestPost["stop_to"])) {
                $messageList['stop_to'] = "解除日を入力してください。";
            }
        }

        if (!empty($this->RequestPost["stop_to"]) && empty($messageList['stop_to'])) {
            if (!Validation::checkYmd($this->RequestPost["stop_to"])) {
                $messageList['stop_to'] = "解除日を正しく入力してください。";
            }
        }

        //エラーメッセージを結合
        $errorMessage = "";
        foreach ($messageList as $message) {
            if (!empty($errorMessage)) {
                $errorMessage .= "<br/>";
            }
            $errorMessage .= $message;
        }

        if (!empty($errorMessage)) {
            $res = array("result_cd" => 9, "error_count" => count($messageList), "error_message" => $errorMessage);
            $this->return_json($res);
        }

        //開始日をセット
        $input_stop_from = "";
        if ($this->RequestPost["from_div"] === "1") {
            $input_stop_from = date("Y-m-d");
        } elseif ($this->RequestPost["from_div"] === "2") {
            $input_stop_from = date("Y-m-d", strtotime($this->RequestPost["stop_from"]));
        }

        //終了日をセット
        $input_stop_to = "";
        if (!empty($this->RequestPost["stop_to"])) {
            $input_stop_to = date("Y-m-d", strtotime($this->RequestPost["stop_to"]));
        }

        //休店期間妥当性チェック
        if ($this->RequestPost["from_change_flag"] === "1" && !empty($this->RequestPost["stop_from"]) && $this->RequestPost["from_div"] === "2") {
            $ck_stop_from = date('YmdHis', strtotime($this->RequestPost["stop_from"] . " 00:00:00"));
            if (strtotime($ck_stop_from) < strtotime(date('YmdHis'))) {
                $res = array("result_cd" => 9, "error_count" => count($messageList), "error_message" => "過去の休店または強制施錠は登録できません。");
                $this->return_json($res);
            }
        }

        if (!empty($input_stop_to)) {
            $from_first_day = date("Y-m-01",strtotime($input_stop_from));
            $from_day = date("d",strtotime($input_stop_from));
            $six_month = date("Y-m",strtotime($from_first_day . "+6 month"));
            $validity_date = $six_month . "-" . $from_day;
            if (strtotime($input_stop_to) < strtotime($input_stop_from)) {
                $messageList['stop_to'] = "FromよりToを大きくしてください。";
            } elseif ($this->RequestPost["stop_div"] === "1" && (strtotime($validity_date) <= strtotime($input_stop_to))) {
                $messageList['stop_to'] = "休店期間は6ヶ月以内で入力してください。";
            } elseif (strtotime($input_stop_to) < strtotime(date('Y-m-d'))) {
                $messageList['stop_to'] = "過去の休店または強制施錠は登録できません。";
            }
        }
        //エラーメッセージを結合
        $errorMessage = "";
        foreach ($messageList as $message) {
            if (!empty($errorMessage)) {
                $errorMessage .= "<br/>";
            }
            $errorMessage .= $message;
        }

        if (!empty($errorMessage)) {
            $res = array("result_cd" => 9, "error_count" => count($messageList), "error_message" => $errorMessage);
            $this->return_json($res);
        }

        // ロックの取得
        $lockFlag = false;
        $lockName = "detail_account_stop" . $this->RequestPost["t_unis_service_id"];
        if ($this->is_free_lock($lockName)) {
            if ($this->get_lock($lockName)) {
                $lockFlag = true;
            }
        }
        if ($lockFlag) {
            //開始日・終了日
            $stop_from_date = date("Ymd",strtotime($input_stop_from));
            if ($stop_from_date === date("Ymd")){
                $stop_from = $input_stop_from . " " . date("H:i:s");
            } else {
                $stop_from = $input_stop_from . " 00:00:00";
            }
            $stop_to = "";
            $range_sql = "";
            if (!empty($input_stop_to)) {
                $stop_to = $input_stop_to . " 23:59:59";
                $range_sql = "AND ssh1.start_datetime <= :stop_to AND (ssh1.release_datetime >= :stop_from OR ssh1.release_datetime IS NULL) ";
                $param["stop_to"] = $stop_to;
            } else {
                $range_sql = "AND (ssh1.release_datetime >= :stop_from OR ssh1.release_datetime IS NULL) ";
            }

            // 休店期間重複チェック
            $query = "SELECT id, stop_div, start_datetime, release_datetime "
                    . "FROM t_service_stop_history ssh1 "
                    . "WHERE ssh1.delete_flag = '0' AND ssh1.t_unis_service_id = :t_unis_service_id "
                    . $range_sql;
            $param["t_unis_service_id"] = $this->RequestPost["t_unis_service_id"];
            $param["stop_from"] = $stop_from;

            if ($this->RequestPost["t_service_stop_history_id"] !== "") {
                $query .= "AND NOT EXISTS (SELECT 1 FROM t_service_stop_history ssh2 "
                       .  "WHERE ssh1.id = ssh2.id "
                       .  "AND ssh2.id = :t_service_stop_history_id) ";
                $param['t_service_stop_history_id'] = $this->RequestPost["t_service_stop_history_id"];
            }
            $stop_history_count = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
            if (!empty($stop_history_count)) {
                $this->release_lock($lockName);
                $res = array("result_cd" => 9, "error_count" => 1, "error_message" => "重複している休店または強制施錠があります。");
                $this->return_json($res);
            }

            // 更新処理
            if ($this->RequestPost["t_service_stop_history_id"] !== "") {
                // 更新対象レコード存在チェック
                $query = "SELECT id "
                        . "FROM t_service_stop_history "
                        . "WHERE delete_flag = '0' AND id = :t_service_stop_history_id AND stop_div = :stop_div ";
                $param = array("t_service_stop_history_id" => $this->RequestPost["t_service_stop_history_id"], "stop_div" => $this->RequestPost["stop_div"]);
                $exist_date = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
                if (!isset($exist_date["id"]) || $exist_date["id"] == "") {
                    Logger::warning("No t_service_stop_history data.");
                    $this->release_lock($lockName);
                    throw new BadRequestException();
                }

                $param = array(
                    "id" => $exist_date["id"]
                    ,"updated_by" => $this->Auth->user("id")
                    ,"stop_div" => $this->RequestPost["stop_div"]
                );
                // 更新対象値設定
                $start_datetime = "";
                if ($stop_from_date > date("Ymd")){
                    $start_datetime = " start_datetime = :start_datetime, ";
                    $param['start_datetime'] = $stop_from;
                }
                $release_datetime = "";
                if (empty($stop_to)) {
                    $release_datetime = " release_datetime = NULL, ";
                } else {
                    $release_datetime = " release_datetime = :release_datetime, ";
                    $param['release_datetime'] = $stop_to;
                }

                $query = "UPDATE t_service_stop_history set "
                        . $start_datetime
                        . $release_datetime
                        . " updated_by = :updated_by, "
                        . " updated = now() "
                        . "WHERE id = :id AND delete_flag = '0' AND stop_div = :stop_div ";
                try {
                    Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                } catch (DBException $e) {
                    Logger::warning("t_service_stop_history update error.");
                    $this->release_lock($lockName);
                    throw new BadRequestException();
                }
            //登録
            } else {
                $param = array(
                     "t_unis_service_id" => $this->RequestPost["t_unis_service_id"]
                    ,"stop_div" => $this->RequestPost["stop_div"]
                    ,"start_datetime" => $stop_from
                    ,"created_by" => $this->Auth->user("id")
                    ,"updated_by" => $this->Auth->user("id")
                );
                // 解除日が空文字の場合NULLをセット
                $release_datetime = "";
                if (empty($stop_to)) {
                    $release_datetime = "NULL, ";
                } else {
                    $release_datetime = ":release_datetime, ";
                    $param['release_datetime'] = $stop_to;
                }
                $query = "INSERT INTO t_service_stop_history ( "
                        . "t_unis_service_id, stop_div, start_datetime, release_datetime, created_by, created, updated_by, updated "
                        . ") VALUES ( "
                        . ":t_unis_service_id, :stop_div, :start_datetime, ". $release_datetime . " :created_by, NOW(), :updated_by, NOW() "
                        . ") ";
                try {
                    $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                } catch (DBException $e) {
                    Logger::warning("t_service_stop_history insert error.");
                    $this->release_lock($lockName);
                    throw new BadRequestException();
                }
            }
        } else {
            Logger::warning("table lock failure.");
            throw new BadRequestException();
        }
        $this->release_lock($lockName);

        //休止履歴情報を取得
        $result_data = $this->get_t_service_stop_history($this->RequestPost["t_unis_service_id"]);

        $res = array("result_cd" => 0, "result_data" => $result_data['result_data']);

        $this->return_json($res);
    }

    /*
     * 休止履歴情報削除
     */
    public function del_service_stop_history() {

        $res = array();

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        //POSTチェック
        if (!isset($this->RequestPost["t_unis_service_id"])) {
            Logger::warning("Request t_unis_service_id post error.");
            throw new BadRequestException();
        }
        if (!isset($this->RequestPost["t_service_stop_history_id"])) {
            Logger::warning("Request t_service_stop_history_id post error.");
            throw new BadRequestException();
        }

        // ロックの取得
        $lockFlag = false;
        $lockName = "detail_account_stop" . $this->RequestPost["t_unis_service_id"];
        if ($this->is_free_lock($lockName)) {
            if ($this->get_lock($lockName)) {
                $lockFlag = true;
            }
        }
        if ($lockFlag) {

            // 更新対象レコード存在チェック
            $query = "SELECT id "
                    . "FROM t_service_stop_history "
                    . "WHERE delete_flag = '0' AND id = :t_service_stop_history_id ";
            $param = array("t_service_stop_history_id" => $this->RequestPost["t_service_stop_history_id"]);
            $exist_date = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
            if (!isset($exist_date["id"]) || $exist_date["id"] == "") {
                Logger::warning("No t_service_stop_history data.");
                $this->release_lock($lockName);
                throw new BadRequestException();
            }

            // 休止履歴情報削除
            $query = "UPDATE t_service_stop_history set "
                    . "  delete_flag = '1' "
                    . ", updated_by = :updated_by "
                    . ", updated = now() "
                    . "WHERE id = :id AND delete_flag = '0' ";
            $param = array(
                "id" => $exist_date["id"],
                "updated_by" => $this->Auth->user("id")
            );
            try {
                $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
            } catch (DBException $e) {
                Logger::warning("t_service_stop_history insert error.");
                $this->release_lock($lockName);
                throw new BadRequestException();
            }
        } else {
            Logger::warning("table lock failure.");
            throw new BadRequestException();
        }
        $this->release_lock($lockName);

        //休止履歴情報を取得
        $result_data = $this->get_t_service_stop_history($this->RequestPost["t_unis_service_id"]);

        $res = array("result_data" => $result_data['result_data']);

        $this->return_json($res);
    }

    /*
     * アカウント証PDFのダイレクト出力
     */
    public function direct_pdf() {
        //POSTチェック
        if (!isset($this->RequestPost["t_unis_cust_id"])) {
            Logger::warning("Request t_unis_cust_id post error.");
            throw new BadRequestException();
        }

        $query = "SELECT id AS t_unis_cust_id "
               . "    , cust_cd "
               . "    , name "
               . "    , zip_cd "
               . "    , address1 "
               . "    , address2 "
               . "    , address3 "
               . "FROM t_unis_cust "
               . "WHERE id = :id "
               . "AND delete_flag = '0' ";
        $unisCust = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, array("id" => $this->RequestPost["t_unis_cust_id"]));
        if (empty($unisCust)) {
            throw new BadRequestException();
        }

        Database::getInstance()->dbBeginTransaction(Configure::read('DB_MASTER'));
        try {
            $search = array('”', '“'); // 全角ダブルクォーテーションを半角に置換する
            $replace = '"';
            $custs = null; // pdf出力用の構造体
            // 発送対象の顧客数分ループ
            $custs = new stdClass();
            $custs->id = $this->RequestPost["t_unis_cust_id"];
            $custs->cust_cd = $unisCust["cust_cd"];
            $custs->name = str_replace($search, $replace, $unisCust["name"]);
            $custs->zip_cd = $unisCust["zip_cd"];
            $custs->issue_name = str_replace($search, $replace, $unisCust["name"]);
            $custs->address1 = str_replace($search, $replace, $unisCust["address1"]);
            $custs->address2 = str_replace($search, $replace, $unisCust["address2"]);
            $custs->address3 = str_replace($search, $replace, $unisCust["address3"]);
            $custs->branch_cd = "1";
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
            $param = array("t_unis_cust_id" => $custs->id);
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
                $custs->accounts[$accountRowCount] = $account;

                // テスト用データはRサービス発送履歴テーブルにデータが入らないようにする
                $isIgnore = false;
                if (in_array($custs->cust_cd, Configure::read('OTORAKU_IGNORE_UNIS_CD'))) {
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
                    $custs->accounts[$accountRowCount]->services[$serviceRowCount] = $service;
                    // Rの場合はRサービス発送履歴テーブルにデータが有るか取得する（テストデータの場合は処理を行わない）
                    if ($serviceRow["service_cd"] === "120" && $isIgnore === false) {
                        $query = "SELECT COUNT(*) AS count "
                                . "FROM t_r_issue_history "
                                . "WHERE t_unis_service_id = :t_unis_service_id "
                                . "  AND delete_flag = '0' ";
                        $param = array("t_unis_service_id" => $serviceRow["t_unis_service_id"]);
                        $rIssueHistoryCount = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
                        if ($rIssueHistoryCount["count"] === "0" && !$this->isServiceChanged($serviceRow["t_unis_service_id"])) {
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
                $accountRowCount++;
            }

            $query = "INSERT INTO t_direct_pdf_history (t_unis_cust_id, print_user_id, print_date, name, zip_cd, address1, address2, address3, delete_flag, created_by, created, updated_by, updated) VALUES "
                    . "(:t_unis_cust_id, :print_user_id, CURRENT_DATE(), :name, :zip_cd, :address1, :address2, :address3, '0', :created_by, NOW(), :updated_by, NOW()) ";
            $param = array(
                "t_unis_cust_id" => $this->RequestPost["t_unis_cust_id"],
                "print_user_id" => $this->Auth->user("id"),
                "name" => $custs->name,
                "zip_cd" => $custs->zip_cd,
                "address1" => $custs->address1,
                "address2" => $custs->address2,
                "address3" => $custs->address3,
                "created_by" => $this->Auth->user("id"),
                "updated_by" => $this->Auth->user("id"),
            );
            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
            $custRowCount++;

            //*******************************************
            //** PDF出力
            //*******************************************
            ini_set('memory_limit', '512M');
            require_once(LIB_DIR . DS . 'class.IdPdf.php');

            $d[0] = $custs;
            $fileName = Func::ymdhis() . "_{$custs->cust_cd}_members.pdf";
            $filePath = tempnam(sys_get_temp_dir(), $fileName);
            $idPdf = new IdPdf("P", "mm", "A4", true, "UTF-8");
            $idPdf->setFile($filePath);
            $idPdf->setCusts($d);
            $idPdf->printPdf(true);

            header('Content-Type: application/force-download');
            header('Content-Length: ' . filesize($filePath));
            header('Content-disposition: attachment; filename="' . mb_convert_encoding($fileName, 'SJIS-win', 'UTF-8') . '"');
            readfile($filePath);
            Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));
            @unlink($filePath);
        } catch (DBException $e) {
            Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
            Logger::info($e->getMessage());
            Logger::warning("direct_pdf db error.");
            throw new InternalErrorException();
        } catch (Exception $e) {
            Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
            Logger::info($e->getMessage());
            Logger::warning("direct_pdf error.");
            throw new InternalErrorException();
        }
    }

    /*
     * JSON形式返却
     */
    public function return_json($res) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($res);
        exit;
    }

    /*
     * アカウント情報の取得
     */
    private function get_account_info($m_account_id) {
        $query = "SELECT id, t_unis_cust_id, login_id, init_password, password, mail_address, start_date, end_date, init_date, status_flag, admin_status_flag FROM m_account WHERE id = :id AND delete_flag = '0'";
        $param = array("id" => $m_account_id);
        $account_info = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
        $account_info["login_id"] = Cipher::rsaDecrypt($account_info["login_id"]);
        $account_info["mail_address"] = Cipher::rsaDecrypt($account_info["mail_address"]);
        $account_info["status_flag"] = $this->get_account_status($account_info["status_flag"], $account_info["admin_status_flag"]);
        return $account_info;
    }

    /*
     * アカウント情報の取得（UNIS顧客テーブルIDがキー）
     */
    private function get_account_info_by_t_unis_cust_id($t_unis_cust_id) {
        $preference = $this->get_preference();
        $query = "SELECT id, t_unis_cust_id, login_id, mail_address, start_date, end_date, init_date, status_flag FROM m_account WHERE t_unis_cust_id = :t_unis_cust_id AND delete_flag = '0'";
        $param = array("t_unis_cust_id" => $t_unis_cust_id);
        $account_info = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);
        for ($i = 0; $i < count($account_info); $i++) {
            $account_info[$i]["login_id"] = Cipher::rsaDecrypt($account_info[$i]["login_id"]);
            $account_info[$i]["mail_address"] = Cipher::rsaDecrypt($account_info[$i]["mail_address"]);
            $account_info[$i]["status_flag"] = $preference["account_status_flag"][$account_info[$i]["status_flag"]];
        }

        return $account_info;
    }

    /*
     * UNIS情報の取得
     */
    private function get_unis_info($t_unis_cust_id) {
        $preference = $this->get_preference();
        $query = "SELECT id, cust_cd, cust_div, name, name_kana, zip_cd, address1, address2, address3, tel, branch_cd, branch_name, "
                . "issue_name, issue_zip_cd, issue_address1, issue_address2, issue_address3, issue_tel,  "
                . "chain_cd, chain_name, industry_cd, industry_name, start_date, end_date, cancel_date, status_flag, updated "
                . "FROM t_unis_cust "
                . "WHERE id = :id AND delete_flag = '0'";
        $param = array("id" => $t_unis_cust_id);
        $unis_info = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
        $unis_info["tel"] = Cipher::rsaDecrypt($unis_info["tel"]);
        $unis_info["issue_tel"] = Cipher::rsaDecrypt($unis_info["issue_tel"]);
        $unis_info["cust_div"] = $preference["cust_div"][$unis_info["cust_div"]];
        $unis_info["status_flag_name"] = $preference["unis_status_flag"][$unis_info["status_flag"]];

        return $unis_info;
    }

    /*
     * サービスマスタの取得
     */
    private function get_service() {
        $query = "SELECT id, service_cd, service_name FROM m_service WHERE delete_flag = '0' ORDER BY service_cd ";
        $service_info = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query);
        return $service_info;
    }

    /*
     * サービス情報の取得
     */
    private function get_service_info($m_account_id, $service_name, $t_unis_service_id = "") {
        $service_info = array();
        $order = "";
        //システム日時
        $dateTime = new DateTime();
        $nowDate = $dateTime->format('Y-m-d H:i:s');
        $query = "SELECT ms.service_cd, ms.service_name, us.id AS t_unis_service_id, us.m_account_id, us.cont_no, us.detail_no, us.detail_status_div, us.item_cd, us.item_name "
                . ", us.detail_start_month, us.detail_end_month, us.decide_date, us.start_date, us.init_auth_datetime, us.end_date, us.status_flag, us.admin_status_flag "
                . ", ssh.id AS t_service_stop_history_id, ssh.stop_div, ssh.start_datetime, ssh.release_datetime "
                . "FROM m_service ms "
                   . "   LEFT JOIN t_unis_service us ON ( "
                   . "     ms.service_cd = us.service_cd "
                   . "     AND us.m_account_id = :m_account_id "
                   . "     AND us.delete_flag = '0' "
                   . "   ) "
                   . "   LEFT JOIN t_service_stop_history ssh ON( "
                   . "     ssh.t_unis_service_id = us.id "
                   . "     AND ssh.start_datetime <= :now "
                   . "     AND (ssh.release_datetime >= :now OR ssh.release_datetime IS NULL) "
                   . "     AND ssh.delete_flag = '0' "
                   . "   ) "
                   . " WHERE ms.delete_flag = '0' ";
        if ($service_name === "account_list") {
           $query .= "AND us.status_flag = '0' " 
                   . "AND NOT EXISTS (SELECT 1 FROM t_unis_service us2 "
                   . "    WHERE us.m_account_id = us2.m_account_id "
                   . "    AND us.service_cd = us2.service_cd "
                   . "    AND us2.m_account_id = :m_account_id "
                   . "    AND us2.delete_flag = '0' "
                   . "    AND (us.status_flag > us2.status_flag OR us.status_flag = us2.status_flag) "
                   . "    AND us.updated < us2.updated) ";
        } elseif ($service_name === "detail") {
            $order = ", us.id";
        } elseif ($service_name === "detail_account_stop") {
           $query .=  " AND us.id = :id ";
        }
           $query .=  " AND NOT EXISTS (SELECT 1 FROM t_service_stop_history ssh2 "
                   . "    WHERE ssh.t_unis_service_id = ssh2.t_unis_service_id "
                   . "    AND ssh2.start_datetime <= :now "
                   . "    AND (ssh2.release_datetime >= :now OR ssh2.release_datetime IS NULL) "
                   . "    AND ssh2.delete_flag = '0' "
                   . "    AND ssh.id > ssh2.id) "
                   . " ORDER BY ms.service_cd " . $order;
        $param = array("m_account_id" => $m_account_id, 'now' => $nowDate);
        if ($service_name === "detail_account_stop") {
            $param["id"] = $t_unis_service_id;
        }
        $service_info = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);
        return $service_info;
    }

    /*
     * 旧サービス停止履歴情報の取得
     */
    private function get_old_service_stop_history($t_unis_service_id) {
        $old_service_stop_history = array();
        $query = "SELECT stop_div, start_datetime, release_datetime "
               . "FROM t_service_stop_history "
               . "WHERE t_unis_service_id = :t_unis_service_id "
               . "AND delete_flag = '0' "
               . "ORDER BY id DESC LIMIT 1 ";
        $param = array("t_unis_service_id" => $t_unis_service_id);
        $old_service_stop_history = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
        return $old_service_stop_history;
    }

    /*
     * 発送情報の取得
     */
    private function get_issue_info($t_unis_cust_id) {

        //システム日時
        $dateTime = new DateTime();
        $nowDate = $dateTime->format('Y-m-d H:i:s');

        //管理DB取得
        $database_name = Configure::$database['connect'][Configure::read('DB_ADMIN_MASTER')][0]['database'];

        $preference = $this->get_preference();
        $query = "SELECT tih.id, tih.t_unis_cust_id, IFNULL(tih.issue_date, '') as issue_date, IFNULL(tih.not_arrived_date, '') as not_arrived_date, tih.name, "
                . "tih.zip_cd, tih.address1, tih.address2, tih.address3, tih.branch_cd, "
                . "CONCAT('〒' ,IFNULL(tih.zip_cd, ''), ' ', IFNULL(tih.address1, ''), IFNULL(tih.address2, ''), IFNULL(tih.address3, '')) as address, tih.status_flag, "
                . "tuc.status_flag as t_unis_cust_status_flag, "
                . "mo.organization_name, tih.can_flag "
                . "FROM t_issue_history tih "
                . "INNER JOIN t_unis_cust tuc ON (tuc.id = tih.t_unis_cust_id AND tuc.delete_flag = '0') "
                . "LEFT JOIN " . $database_name . ".m_organization mo ON (tih.branch_cd = mo.code AND mo.start_date <= :now AND mo.end_date >= :now) "
                . "WHERE tih.t_unis_cust_id = :t_unis_cust_id AND tih.delete_flag = '0' "
                . "ORDER BY tih.issue_date IS NULL DESC , tih.issue_date DESC , tih.id DESC ";
        $param = array("t_unis_cust_id" => $t_unis_cust_id, "now" => $nowDate);
        $issue_info = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);
        $issue_count = count($issue_info);
        foreach ($issue_info as $key => $line) {
            $issue_info[$key]["status_flag_name"] = $preference["issue_status_flag"][$line["status_flag"]];
            $issue_info[$key]["count"] = $issue_count;
            $issue_info[$key]['name'] = Func::h($issue_info[$key]['name']);
            $issue_info[$key]["to_name"] = $line["organization_name"];
            if (empty($line["organization_name"])) {
                $issue_info[$key]["to_name"] = "顧客直送";
            }
            if ($line["can_flag"] == "1") {
                $issue_info[$key]["to_name"] .= "(CAN)";
            }
        }

        return $issue_info;
    }

    /*
     * アカウント証ダイレクト出力履歴情報の取得
     */
    private function get_direct_pdf_info($t_unis_cust_id) {
        //管理DB取得
        $database_name = Configure::$database['connect'][Configure::read('DB_ADMIN_MASTER')][0]['database'];

        $query = "SELECT tdph.id, tdph.t_unis_cust_id, tdph.print_user_id, tdph.print_date, tdph.name, tdph.zip_cd, tdph.address1, tdph.address2, tdph.address3, mu.code, mu.last_name, mu.first_name, "
               . "  CONCAT('〒' ,IFNULL(tdph.zip_cd, ''), ' ', IFNULL(tdph.address1, ''), IFNULL(tdph.address2, ''), IFNULL(tdph.address3, '')) as address, "
               . "  CONCAT(mu.last_name, ' ', mu.first_name, '(',  mu.code, ')') as print_user "
               . "FROM t_direct_pdf_history tdph "
               . "  LEFT JOIN {$database_name}.m_user mu "
               . "    ON tdph.print_user_id = mu.id "
               . "WHERE tdph.t_unis_cust_id = :t_unis_cust_id AND tdph.delete_flag = '0'"
               . "ORDER BY id DESC";
        $param = array("t_unis_cust_id" => $t_unis_cust_id);
        return Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);
    }

    /*
     * 有効なサービス数を取得
     */
    private function get_valid_service_count($t_unis_cust_id) {
        $query = "SELECT COUNT(*) AS count "
               . "FROM t_unis_cust tuc "
               . "  INNER JOIN m_account ma ON tuc.id = ma.t_unis_cust_id "
               . "  INNER JOIN t_unis_service tus ON ma.id = tus.m_account_id "
               . "WHERE tuc.id = :t_unis_cust_id "
               . "AND tus.status_flag = '0' "
               . "AND tuc.delete_flag = '0' "
               . "AND ma.delete_flag = '0' "
               . "AND tus.delete_flag = '0' ";
        $param = array("t_unis_cust_id" => $t_unis_cust_id);
        $result = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
        return $result["count"];
    }

    /*
     * 休止履歴情報の取得
     */
    private function get_t_service_stop_history($t_unis_service_id) {

        $return_date = array();
        //システム日時
        $dateTime = new DateTime();
        $nowDate = $dateTime->format('Y-m-d H:i:s');

        $preference = $this->get_preference();

        if ($t_unis_service_id == "") {
            Logger::warning("Request t_unis_service_id post error.");
            throw new BadRequestException();
        }

        //休止履歴情報を取得
        $query = "SELECT id, t_unis_service_id, stop_div, start_datetime, release_datetime "
                . "FROM t_service_stop_history "
                . "WHERE delete_flag = '0' AND t_unis_service_id = :t_unis_service_id "
                . "ORDER BY start_datetime DESC ";
        $param = array("t_unis_service_id" => $t_unis_service_id);
        $t_service_stop_history = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);

        //有効な休止履歴情報チェック
        foreach ($t_service_stop_history as $key => $value) {
            $t_service_stop_history[$key]["stop_div_name"] = $preference["stop_div"][$value["stop_div"]];
            $t_service_stop_history[$key]["start_date"] = date('Y/m/d', strtotime($value["start_datetime"]));
            if (!empty($value["release_datetime"])) {
                $t_service_stop_history[$key]["release_date"] = date('Y/m/d', strtotime($value["release_datetime"]));
            } else {
                $t_service_stop_history[$key]["release_date"] = "";
            }
        }
        $return_date['result_data'] = $t_service_stop_history;
        return $return_date;
    }

    /*
     * アカウント証発送履歴テーブルの更新
     */
    private function up_t_issue_history($ary_date, $id) {

        $up_date = "";
        foreach ($ary_date as $key => $value) {
            if (!empty($up_date)) {
                $up_date .= ",";
            }
            $up_date .= $key . " = '" . $value . "'";
        }
        $query = "UPDATE t_issue_history set "
                . $up_date
                . ", updated_by = :updated_by "
                . ", updated = now() "
                . "WHERE id = :id AND delete_flag = '0' ";
        $param = array(
            "id" => $id,
            "updated_by" => $this->Auth->user("id")
        );
        Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
    }

    /*
     * 郵便番号分割
     */
    private function zip_substr($ary_date) {
        $ary_date['zip_cd1'] = "";
        $ary_date['zip_cd2'] = "";
        if (!empty($ary_date)) {
            $zip_cd = explode("-", $ary_date['zip_cd']);
            $ary_date['zip_cd1'] = $zip_cd['0'];
            $ary_date['zip_cd2'] = $zip_cd['1'];
        }
       return $ary_date;
    }

    /*
     * 強制開錠処理
     */
    public function forced_unlock() {

        // Ajaxチェック
        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        // t_unis_service_idチェック
        if (!isset($this->RequestPost["t_unis_service_id"]) || $this->RequestPost["t_unis_service_id"] == "") {
            Logger::warning("Request t_unis_service_id post error.");
            throw new BadRequestException();
        }

        // t_unis_service_idを取得
        $t_unis_service_id = $this->RequestPost["t_unis_service_id"];

        // 契約サービス取得
        $agreement_service = $this->get_agreement_service($t_unis_service_id);

        // UCART, OTORAKU以外はエラーとする
        if (!in_array($agreement_service["service_cd"], array("100", "120"))) {
            Logger::warning("Error except for UCART,OTORAKU.");
            throw new BadRequestException();
        }

        if ($t_unis_service_id !== "") {
            // status_flag利用不可チェック
            if ($agreement_service["status_flag"] == "0") {
                Logger::warning("status_flag is enabled.");
                throw new BadRequestException();
            }
            
            // 同アカウントに他に利用可能な同サービスがないかチェック
            $query = "SELECT m_account_id, status_flag, service_cd  "
                    . "FROM t_unis_service "
                    . "WHERE m_account_id = (SELECT m_account_id FROM t_unis_service WHERE id = :id) "
                    . "AND status_flag = '0' "
                    . "AND service_cd = :service_cd ";
            $param = array("id" => $t_unis_service_id, "service_cd" => $agreement_service["service_cd"]);
            $t_unis_service_enabled_data = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);

            // 契約サービス取得
            $agreement_service = $this->get_agreement_service($t_unis_service_id);

            if (!empty($t_unis_service_enabled_data) || $t_unis_service_enabled_data != "") {
                Logger::warning("There is the same service available.");
                throw new BadRequestException();
            }

            // ID存在チェック
            if (!isset($agreement_service["id"]) || $agreement_service["id"] == "") {
                Logger::warning("No t_unis_service data.");
                throw new BadRequestException();
            }
        }

        // ロックの取得
        $lockFlag = false;
        $lockName = "forced_unlock" . $t_unis_service_id;
        if ($this->is_free_lock($lockName)) {
            if ($this->get_lock($lockName)) {
                $lockFlag = true;
            }
        }

        // UNIS契約サービステーブルの更新
        if ($lockFlag) {
            // UCARTの場合
            if ($agreement_service['service_cd'] == '100') {
                $query = "UPDATE t_unis_service set "
                       . "  end_date = NULL "
                       . ", status_flag = '0' "
                       . ", updated_by = 'SYSTEM' "
                       . ", updated = now() "
                       . "WHERE id = :id ";
            } else {
                $query = "UPDATE t_unis_service set "
                       . "  detail_status_div = '2' "
                       . ",  detail_end_month = NULL "
                       . ", end_date = NULL "
                       . ", status_flag = '0' "
                       . ", updated_by = 'SYSTEM' "
                       . ", updated = now() "
                       . "WHERE id = :id ";
            }
            $param = array(
               "id" => $t_unis_service_id
            );
            try {
               Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
            } catch (DBException $e) {
                Logger::warning("t_unis_service update error.");
                $this->release_lock($lockName);
                throw new BadRequestException();
            }
        } else {
            Logger::warning("table lock failure.");
            throw new BadRequestException();
        }
        $this->release_lock($lockName);

        // 更新後の契約サービス取得
        $agreement_service = $this->get_agreement_service($t_unis_service_id);
        
        $this->return_json($agreement_service);
    }

    /*
     * 契約サービス番号を取得
     */
    private function get_agreement_service($t_unis_service_id) {
        $query = "SELECT * "
               . "FROM t_unis_service "
               . "WHERE id = :id ";
        $param = array("id" => $t_unis_service_id);
        $result = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
        return $result;
    }
}
