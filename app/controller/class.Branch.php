<?php

// ライブラリ読み込み
require_once(LIB_DIR . DS . 'class.Cipher.php');

/*
 * 支店専用
 */
class Branch extends Controller {

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

    public function index() {

        if ($this->Acl->check($this->Auth->user("role_id"), "/branch/search/")) {
            Func::redirect("/branch/search/");
        } else {
            Logger::warning("Forbidden Exception.");
            throw new ForbiddenException();
        }

        return;
    }

    /*
     * 検索画面
     */
    public function search() {
        $this->set('titleName', "支店別管轄顧客一覧");

        //詳細画面から検索条件を受け取る
        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] == "branch") {
            $o_code_list = explode(",", $this->RequestPost["organization_code"]);
        } else {
            $o_code_list[] = $this->Auth->user("o_code");
        }

        //支店情報を取得する
        $organization_list = $this->get_organization();

        $this->set("o_code_list", $o_code_list);
        $this->set("organization_list", $organization_list);
        $this->render('branch' . DS . 'search.tpl');
    }

    /*
     * 未着顧客一覧データ取得処理
     */
    public function get_not_arrived_data() {

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

        if (empty($this->RequestPost["organization_code"])) {
            Logger::warning("Request organization_code post error.");
            throw new BadRequestException();
        }

        $return_data = $this->get_select_info($this->RequestPost["organization_code"], "01");

        $select = $return_data["select"];
        $from = $return_data["from"];

        //1ページ目のみ件数を取得
        if ($start == 0) {
            $query = "SELECT COUNT(*) as cnt {$from}";
            $ret = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, $return_data["param"]);
            $res["search_cnt"] = $ret[0]["cnt"];
            if ($res["search_cnt"] >= 10001) {
                $res["search_cnt"] = 10001;
            }
        }

        $query = "{$select} {$from} ORDER BY tuc.branch_cd, tih.not_arrived_date, tuc.id LIMIT {$start}, {$this->search_limit}";
        $not_arrived_data = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $return_data["param"]);

        $search_data = array();
        for ($i = 0; $i < count($not_arrived_data); $i++) {
            $search_data[$i]["t_unis_cust_id"] = $not_arrived_data[$i]["id"];
            $search_data[$i]["branch_name"] = $not_arrived_data[$i]["branch_name"];
            $search_data[$i]["cust_cd"] = $not_arrived_data[$i]["cust_cd"];
            $search_data[$i]["issue_date"] = $not_arrived_data[$i]["issue_date"];
            $search_data[$i]["not_arrived_date"] = $not_arrived_data[$i]["not_arrived_date"];
            $search_data[$i]["name"] = $not_arrived_data[$i]["name"];
            $search_data[$i]["street"] = "〒" . $not_arrived_data[$i]["zip_cd"] . " " . $not_arrived_data[$i]["address1"] . " " . $not_arrived_data[$i]["address2"] . " " . $not_arrived_data[$i]["address3"];
        }
        $res["search_data"] = $search_data;
        $res["length"] = count($not_arrived_data);

        $this->return_json($res);

    }

    /*
     * UNIS確定見込顧客一覧データ取得処理
     */
    public function get_conf_prospects_data() {
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

        $organization_code = "";
        if (empty($this->RequestPost["organization_code"])) {
            Logger::warning("Request organization_code post error.");
            throw new BadRequestException();
        }

        $return_data = $this->get_select_info($this->RequestPost["organization_code"], "02");

        $select = $return_data["select"];
        $from = $return_data["from"];

        //1ページ目のみ件数を取得
        if ($start == 0) {
            $query = "SELECT COUNT(*) as cnt {$from}";
            $ret = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, $return_data["param"]);
            $res["search_cnt"] = $ret[0]["cnt"];
            if ($res["search_cnt"] >= 10001) {
                $res["search_cnt"] = 10001;
            }
        }

        $query = "{$select} {$from} ORDER BY tuc.branch_cd, tus.init_auth_datetime, tuc.cust_cd LIMIT {$start}, {$this->search_limit}";
        $conf_prospects_data = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $return_data["param"]);

        $res["search_data"] = $conf_prospects_data;
        $res["length"] = count($conf_prospects_data);

        $this->return_json($res);

    }

    /*
     * 未着顧客一覧データCSV出力処理
     */
    public function download_not_arrived_data() {

        $this->set('titleName', "支店別管轄顧客一覧");

        $msg = "";

        if (empty($this->RequestPost["organization_code"])) {
            Logger::warning("Request organization_code post error.");
            throw new BadRequestException();
        }

        $organization_code = explode(",", $this->RequestPost["organization_code"]);

        $return_data = $this->get_select_info($organization_code, "01");

        $select = $return_data["select"];
        $from = $return_data["from"];

        $query = "SELECT COUNT(*) as cnt {$from}";
        $csv_cnt = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $return_data["param"]);

        if ($csv_cnt["cnt"] > 0) {
            $query = "{$select} {$from} ORDER BY tuc.branch_cd, tih.not_arrived_date, tuc.id";
            $not_arrived_data = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $return_data["param"]);
            $header = array('支店名', '顧客CD', '発送日', '未着日', '送付先名称', '送付先郵便番号', '送付先住所1', '送付先住所2', '送付先住所3');
            $csvFile = "not_arrived_data_" . date("YmdHis") . ".csv";
            $this->csv_download($header, $csvFile, $not_arrived_data, "01");
            exit;
        } else {
            $msg = "ダウンロードできるデータがありません。";
        }

        //支店情報を取得する
        $organization_list = $this->get_organization();
        $this->set("o_code_list", $organization_code);
        $this->set("msg", $msg);
        $this->set("organization_list", $organization_list);
        $this->render('branch' . DS . 'search.tpl');

    }

    /*
     * UNIS確定見込顧客一覧データCSV出力処理
     */
    public function download_conf_prospects_data() {

        $this->set('titleName', "支店別管轄顧客一覧");

        $msg = "";

        if (empty($this->RequestPost["organization_code"])) {
            Logger::warning("Request organization_code post error.");
            throw new BadRequestException();
        }

        $organization_code = explode(",", $this->RequestPost["organization_code"]);

        $return_data = $this->get_select_info($organization_code, "02");

        $select = $return_data["select"];
        $from = $return_data["from"];

        $query = "SELECT COUNT(*) as cnt {$from}";
        $csv_cnt = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $return_data["param"]);

        if ($csv_cnt["cnt"] > 0) {
            $query = "{$select} {$from} ORDER BY tuc.branch_cd, tus.init_auth_datetime, tuc.cust_cd";
            $conf_prospects_data = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $return_data["param"]);
            $header = array('支店名', '顧客CD', '設置先名称', '契約No', '契約明細No', '契約品目CD', '契約品目名称', 'R初回認証日時');
            $csvFile = "unis_check_data_" . date("YmdHis") . ".csv";
            $this->csv_download($header, $csvFile, $conf_prospects_data, "02");
            exit;
        } else {
            $msg = "ダウンロードできるデータがありません。";
        }

        //支店情報を取得する
        $organization_list = $this->get_organization();
        $this->set("o_code_list", $organization_code);
        $this->set("msg", $msg);
        $this->set("organization_list", $organization_list);
        $this->render('branch' . DS . 'search.tpl');

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
     * 検索条件設定
     */
    private function get_select_info($organization_code, $process_div) {

        $return_data = array();
        $param = array();
        //SQL格納用
        $unis_where = "";
        $select = "";
        $from = "";
        //分割取得用
        $search_limit = "";

        //部署マスタ取得
        foreach ($organization_code as $i => $val) {
            $codeArr[] = ":code" . $i;
            $param["code" . $i] = $val;
        }
        $unis_where .= "AND tuc.branch_cd in (" . implode(",", $codeArr) . ") ";

        // 未着顧客一覧データ
        if ($process_div === "01") {
            $select = "SELECT tuc.id, tuc.branch_name, tuc.cust_cd, tih.issue_date, tih.not_arrived_date, "
                    . "tih.name, tih.zip_cd, tih.address1, tih.address2, tih.address3 ";
            $from = "FROM t_unis_cust tuc "
                    . "  INNER JOIN t_issue_history tih ON (tuc.id = tih.t_unis_cust_id AND tih.status_flag = '2' AND tih.delete_flag = '0') "
                    . "WHERE tuc.status_flag in ('1', '2') AND tuc.delete_flag = '0' "
                    . $unis_where
                    . "AND NOT EXISTS (SELECT 1 FROM t_issue_history tih2 "
                       . "    WHERE tih.t_unis_cust_id = tih2.t_unis_cust_id "
                       . "    AND tih2.delete_flag = '0' "
                       . "    AND tih.id < tih2.id) ";
        // UNIS確定見込顧客一覧データ
        } elseif ($process_div === "02") {
            $mService = $this->get_determinable_pass_service();
            // @TODO: REACH STOCKトライアル完了時に取り除く
            foreach ($mService as $key => $row) {
                if($row['service_cd'] == '140' || $row['service_cd'] == '150') {
                    unset($mService[$key]);
                }
            }
            $preference = $this->get_preference();
            $no_construction = array();
            $codeArr = array();
            //施工なし設定
            if (!empty($preference["no_send_to_branch_item_cd"])) {
                $no_construction = $preference["no_send_to_branch_item_cd"];
            }

            foreach ($no_construction as $i => $val) {
                $codeArr[] = ":itemCd" . $i;
                $param["itemCd" . $i] = $val;
            }

            $select = "SELECT tuc.branch_name, tuc.cust_cd, tuc.name, "
            // 確定可能連携サービスの数だけ、サービステーブルをJOINする
                    . "tus.cont_no, tus.detail_no, tus.item_cd, tus.item_name, tus.init_auth_datetime ";
            $from = "FROM t_unis_cust tuc "
                    . "  INNER JOIN m_account ma ON (tuc.id = ma.t_unis_cust_id "
                    . "      AND ma.account_div = '0' AND ma.status_flag = '0' AND ma.admin_status_flag = '0' AND ma.delete_flag = '0') "
                    . "  INNER JOIN t_unis_service tus ON (ma.id = tus.m_account_id "
                    . "      AND tus.service_cd IN (";
            $isFirst = true;
            foreach ($mService as $key => $service) {
                if ($isFirst === true) {
                    $isFirst = false;
                } else {
                    $from .= ", ";
                }
                $from .= ":serviceCd{$key}";
                $param["serviceCd" . $key] = $service['service_cd'];
            }
            $from .= ") AND tus.detail_status_div = '1' AND tus.init_auth_datetime IS NOT NULL AND tus.market_cd != '999965' ";

            if (empty($codeArr)) {
                $from .= "AND tus.item_cd in ('') ";
            } else {
                $from .= "AND tus.item_cd in (" . implode(",", $codeArr) . ") ";
            }
            $from .= " AND tus.delete_flag = '0') "
                   . " WHERE tuc.delete_flag = '0' "
                   . $unis_where;
        }

        $return_data["select"] = $select;
        $return_data["from"] = $from;
        foreach ($param as $key => $value) {
            $return_data["param"][$key] = $value;
        }

        return $return_data;

    }

    /*
     * 部署マスタの取得
     */
    private function get_organization() {
        //システム日時
        $dateTime = new DateTime();
        $nowDate = $dateTime->format('Y-m-d H:i:s');
        $query = "SELECT id, code, organization_name FROM m_organization WHERE organization_div & 4 AND start_date < :now AND end_date > :now ORDER BY sort, id ";
        $param = array("now" => $nowDate);
        $organization_info = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $organization_info;
    }

    /*
     * csvダウンロード
     */
    private function csv_download($header, $csvFile, $search_data, $process_div) {

        ini_set('memory_limit', '256M');
        header('Content-Type: application/force-download');
        header('Content-disposition: attachment; filename="' . $csvFile . '"');
        ob_start();
        $stream = fopen('php://output', 'w');
        fputcsv($stream, $header);

        $firstRow = $search_data->fetch(PDO::FETCH_ASSOC);

        if ($process_div === "01") {
            fputcsv($stream, $this->get_not_arrived_row($firstRow));
            while ($row = $search_data->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($stream, $this->get_not_arrived_row($row));
            }
        } elseif ($process_div === "02") {
            fputcsv($stream, $this->get_conf_prospects_row($firstRow));
            while ($row = $search_data->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($stream, $this->get_conf_prospects_row($row));
            }
        }

        $output = ob_get_contents();
        ob_end_clean();
        $output = str_replace("\n", "\r\n", $output);
        echo mb_convert_encoding($output, "SJIS-win", "UTF-8");
        return;
    }

    private function get_not_arrived_row($row) {
//      '支店名', '顧客CD', '発送日', '未着日', '送付先名称', '送付先郵便番号', '送付先住所1', '送付先住所2', '送付先住所3'
        $ret = array();
        $ret[] = $row["branch_name"];
        $ret[] = $row["cust_cd"];
        $ret[] = $row["issue_date"];
        $ret[] = $row["not_arrived_date"];
        $ret[] = $row["name"];
        $ret[] = $row["zip_cd"];
        $ret[] = $row["address1"];
        $ret[] = $row["address2"];
        $ret[] = $row["address3"];

        return $ret;
    }

    private function get_conf_prospects_row($row) {
//      '支店名', '顧客CD', '設置先名称', '契約No', '契約明細No', '契約品目CD', '契約品目名称', 'R初回認証日時'
        $ret = array();
        $ret[] = $row["branch_name"];
        $ret[] = $row["cust_cd"];
        $ret[] = $row["name"];
        $ret[] = $row["cont_no"];
        $ret[] = $row["detail_no"];
        $ret[] = $row["item_cd"];
        $ret[] = $row["item_name"];
        $ret[] = $row["init_auth_datetime"];
        return $ret;
    }

}
