<?php

// ライブラリ読み込み
require_once(LIB_DIR . DS . 'class.Cipher.php');

/*
 * アカウント
 */
class Role extends Controller {

    public $search_limit = 50; //検索件数

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

        if ($this->Acl->check($this->Auth->user("role_id"), "/role/user_search/")) {
            Func::redirect("/role/user_search/");
        } else {
            Logger::warning("Forbidden Exception.");
            throw new ForbiddenException();
        }
        return;
    }

    /*
     * 社員別権限検索
     */
    public function user_search() {
        $this->set('titleName', "社員別権限検索");

        //詳細画面から検索条件を受け取る
        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] == "search") {
            $search_info["type"] = "search";
            $search_info["code"] = $this->RequestPost["code"];
            $search_info["role_id"] = $this->RequestPost["role_id"];
            $this->set("search_info", $search_info);
        }

        //権限マスタを取得する
        $roleList = $this->get_m_role();
        $this->set("roleList", $roleList);

        $this->render('role' . DS . 'user_search.tpl');
    }

    /*
     * 社員別権限検索処理
     */
    public function user_get_data() {

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        $this->get_data($this->RequestPost, '1');

    }

    /*
     * 社員別権限詳細
     */
    public function user_detail() {

        $this->set('titleName', "社員別権限詳細");

        //入力チェック
        //検索条件
        $this->set("code", $this->RequestPost["code"]);
        $this->set("role_id", $this->RequestPost["role_id"]);

        //従業員マスタID
        if (empty($this->RequestPost["user_id"])) {
            Logger::warning("Request user_id post error.");
            throw new BadRequestException();
        }

        //社員情報を取得する
        $user_list = $this->get_m_user($this->RequestPost["user_id"]);
        if (!isset($user_list["id"]) || $user_list["id"] == "") {
            Logger::warning("No m_user data.");
            throw new BadRequestException();
        }

        //権限マスタ情報を取得する
        $m_role_state_list = $this->get_user_m_role_state($this->RequestPost["user_id"]);

        $this->set("user_list", $user_list);
        $this->set("m_role_state_list", $m_role_state_list);
        $this->render('role' . DS . 'user_detail.tpl');

    }

    /*
     * 社員別権限編集
     */
    public function user_edit() {

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        $this->edit_data($this->RequestPost, '1');

    }

    /*
     * 部署別権限検索
     */
    public function organization_search() {
        $this->set('titleName', "部署別権限検索");

        //詳細画面から検索条件を受け取る
        if (isset($this->RequestPost["type"]) && $this->RequestPost["type"] == "search") {
            $search_info["type"] = "search";
            $search_info["code"] = $this->RequestPost["code"];
            $search_info["organization_name"] = $this->RequestPost["organization_name"];
            $this->set("search_info", $search_info);
        }

        $this->render('role' . DS . 'organization_search.tpl');
    }

    /*
     * 部署別権限検索処理
     */
    public function organization_get_data() {

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        $this->get_data($this->RequestPost, '2');
    }

    /*
     * 部署別権限詳細
     */
    public function organization_detail() {

        $this->set('titleName', "部署別権限詳細");

        //入力チェック
        //検索条件
        $this->set("code", $this->RequestPost["code"]);
        $this->set("organization_name", $this->RequestPost["organization_name"]);

        //部署マスタID
        if (empty($this->RequestPost["organization_id"])) {
            Logger::warning("Request user_id post error.");
            throw new BadRequestException();
        }

        //部署情報を取得する
        $m_organization_list = $this->get_m_organization($this->RequestPost["organization_id"]);
        if (!isset($m_organization_list["id"]) || $m_organization_list["id"] == "") {
            Logger::warning("No m_organization_list data.");
            throw new BadRequestException();
        }

        $m_organization_info = array();
        $m_organization_info["0"]["code"] = $m_organization_list["code"];
        $m_organization_info["0"]["organization_name"] = $m_organization_list["organization_name"];

        //子部署を取得する
        $child_m_organization = $this->get_m_organization_info($this->RequestPost["organization_id"]);
        $cnt = 1;
        foreach ($child_m_organization as $child_value) {
            $m_organization_info[$cnt]["code"] = $child_value["code"];
            $m_organization_info[$cnt]["organization_name"] = $m_organization_list["organization_name"];
            $m_organization_info[$cnt]["organization_name2"] = $child_value["organization_name"];
            $cnt++;
            //孫部署を取得する
            $grandson_m_organization = $this->get_m_organization_info($child_value["id"]);
            foreach ($grandson_m_organization as $grandson_value) {
                $m_organization_info[$cnt]["code"] = $grandson_value["code"];
                $m_organization_info[$cnt]["organization_name"] = $m_organization_list["organization_name"];
                $m_organization_info[$cnt]["organization_name2"] = $child_value["organization_name"];
                $m_organization_info[$cnt]["organization_name3"] = $grandson_value["organization_name"];
                $cnt++;
            }
        }

        //親部署の部署マスタIDを取得する。
        $m_parent_organization = $this->get_parent_m_organization($this->RequestPost["organization_id"]);

        //権限情報を取得する。
        $m_role_state_list = $this->get_organization_m_role_state($this->RequestPost["organization_id"], $m_parent_organization["mo2_id"], $m_parent_organization["mo3_id"]);

        //親部署権限の表示内容を設定
        for ($i = 0; $i < count($m_role_state_list); $i++) {
            if (!empty($m_parent_organization["mo3_id"]) && !empty($m_role_state_list[$i]["t_default_role3_id"])) {
                $m_role_state_list[$i]["parent_name"] = $m_parent_organization["mo3_organization_name"];
                $m_role_state_list[$i]["parent_info"] = $m_role_state_list[$i]["t_default_role3_id"];
            } elseif (!empty($m_parent_organization["mo2_id"]) && !empty($m_role_state_list[$i]["t_default_role2_id"])) {
                $m_role_state_list[$i]["parent_name"] = $m_parent_organization["mo2_organization_name"];
                $m_role_state_list[$i]["parent_info"] = $m_role_state_list[$i]["t_default_role2_id"];
            }
        }

        $this->set("m_organization_list", $m_organization_list);
        $this->set("m_organization_info", $m_organization_info);
        $this->set("m_parent_organization", $m_parent_organization);
        $this->set("m_role_state_list", $m_role_state_list);
        $this->render('role' . DS . 'organization_detail.tpl');

    }

    /*
     * 部署別権限編集
     */
    public function organization_edit() {

        if (!$this->Request->isAjax()) {
            Logger::warning("Not ajax request.");
            throw new BadRequestException();
        }

        $this->edit_data($this->RequestPost, '2');

    }

    /*
     * DRAGONマスタ連携処理
     */
    public function subscribes() {
        $this->set('titleName', "DRAGONマスタ連携処理");

        $this->render('role' . DS . 'subscribes.tpl');
    }

    /*
     * 検索処理
     */
    private function get_data($requestPost, $process_div) {

        $res = array();

        //page
        $start = 0;
        if (isset($requestPost["page"]) && $requestPost["page"] > 0) {
            $start = ($requestPost["page"] - 1) * $this->search_limit;
        }

        //処理区分
        if (empty($process_div)) {
            Logger::warning("Request process_div post error.");
            throw new BadRequestException();
        }

        $messageList = array();
        if ($process_div === "1") {
            $code_name = "社員CD";
        } elseif ($process_div === "2") {
            $code_name = "部署CD";
        }

        //社員CD or 部署CDチェック
        if (!empty($requestPost["code"]) && !Validation::maxLength($this->RequestPost["code"], 10)) {
            $messageList['code'] = $code_name . "を正しく入力してください。";
        }

        //エラーメッセージを結合
        $errorMessage = "";
        foreach ($messageList as $message) {
            $errorMessage .= $message;
        }

        if (!empty($errorMessage)) {
            $res = array("result_cd" => 9, "error_message" => $errorMessage);
            $this->return_json($res);
        }

        $param = array();
        //システム日時
        $currentDateTime = date('Y-m-d H:i:s', time());

        if ($process_div === "1") {

        /********************/
        /* 従業員マスタ     */
        /********************/
            $mu_where = "";
            //社員CD
            if (isset($requestPost["code"]) && $requestPost["code"] != "") {
                $mu_where .= "AND mu.code = :code ";
                $param["code"] = $requestPost["code"];
            }

            /****************/
            /* 権限テーブル */
            /****************/
            $tr_join = "";
            $tr_where = "";
            if (isset($requestPost["role_id"]) && $requestPost["role_id"] != "") {
                $tr_join .= "INNER JOIN t_role tr ON (mu.id = tr.user_id) "
                          ."INNER JOIN m_role mr ON (mr.id = tr.role_id AND mr.delete_flag = '0') ";
                $tr_where .= "AND tr.role_id = :role_id ";
                $param["role_id"] = $requestPost["role_id"];
            }

            $select = "mu.id, mu.code, mu.last_name, mu.first_name, mo.organization_name ";
            $from = "FROM m_user mu "
                    . "  INNER JOIN m_organization mo ON (mo.id = mu.organization_id AND mo.start_date <= :now AND mo.end_date >= :now) "
                    . $tr_join
                    . "WHERE mu.start_date <= :now AND mu.end_date >= :now "
                    . $mu_where . $tr_where;
            $order = "mu.id ";

        } elseif ($process_div === "2") {

            /****************/
            /* 部署マスタ   */
            /****************/
            $mo_where = "";
            if (isset($requestPost["code"]) && $requestPost["code"] != "") {
                $mo_where .= "AND code = :code ";
                $param["code"] = $requestPost["code"];
            }
            if (isset($requestPost["organization_name"]) && $requestPost["organization_name"] != "") {
                $mo_where .= "AND organization_name like :organization_name ";
                $param["organization_name"] = '%' . $this->RequestPost["organization_name"] . '%';
            }

            $select = "id, code, organization_name ";
            $from = "FROM m_organization "
                    . "WHERE start_date <= :now AND end_date >= :now "
                    . $mo_where;
            $order = "sort ";

        }

        $param["now"] = $currentDateTime;
        $res["result_cd"] = 0;

        //1ページ目のみ件数を取得
        if ($start == 0) {
            $query = "SELECT COUNT(*) as cnt {$from} ORDER BY {$order} LIMIT 10001";
            $ret = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
            $res["search_cnt"] = $ret[0]["cnt"];
            if ($res["search_cnt"] >= 10001) {
                $res["search_cnt"] = 10001;
            }
        }

        $query = "SELECT {$select} {$from} ORDER BY {$order} LIMIT {$start}, {$this->search_limit}";
        $dedicated_date = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        $res["search_data"] = $dedicated_date;
        $res["length"] = count($dedicated_date);

        $this->return_json($res);
    }

    /*
     * 更新処理
     */
    private function edit_data($request_post, $process_div) {

        $res = array();

        //処理区分
        if (empty($process_div)) {
            Logger::warning("Request process_div post error.");
            throw new BadRequestException();
        }

        //権限情報取得
        $role_info = $request_post;

        //入力チェック
        if ($process_div === "1") {
            //従業員マスタIDがPOSTされていること
            if (!isset($request_post["user_id"])) {
                Logger::warning("Request user_id post error.");
                throw new BadRequestException();
            }
            unset($role_info["user_id"]);//従業員マスタIDを削除
        } elseif ($process_div === "2") {
            //部署マスタIDがPOSTされていること
            if (!isset($request_post["organization_id"])) {
                Logger::warning("Request organization_id post error.");
                throw new BadRequestException();
            }
            unset($role_info["organization_id"]);//部署マスタIDを削除
        }

        //権限有無がPOSTされていること
        if (!isset($role_info["1"])) {
            Logger::warning("Request role_info post error." . print_r($request_post, true));
            throw new BadRequestException();
        }

        //ログイン権限が無効の場合その他の権限も無効になっていること
        if ($role_info["1"] === "2") {
            foreach ($role_info as $value) {
                if ($value === "1") {
                    Logger::warning("Request role_info post error data." . print_r($request_post, true));
                    throw new BadRequestException();
                }
            }
        }

        //権限マスタ分ループ
        foreach ($role_info as $key =>$value) {
            //権限マスタを取得する。
            if ($this->get_count_m_role($key) <= 0) {
                Logger::warning("Request role_info not data." . print_r($request_post, true));
                throw new DbException();
            }

            //有効を選択した場合
            if ($value === "1") {
                if ($process_div === "1") {
                    //権限情報テーブルの存在をチェックする。
                    if ($this->get_count_t_role($request_post["user_id"], $key) <= 0) {
                        //権限情報を登録する。
                        $query = "INSERT INTO t_role ( "
                                . "user_id, role_id, created_by, created, updated_by, updated "
                                . ") VALUES ( "
                                . ":user_id, :role_id, :created_by, NOW(), :updated_by, NOW() "
                                . ") ";
                        $param = array(
                             "user_id" => $request_post["user_id"]
                            ,"role_id" => $key
                            ,"created_by" => $this->Auth->user("id")
                            ,"updated_by" => $this->Auth->user("id")
                        );
                        $result = Database::getInstance()->dbExecute(Configure::read('DB_ADMIN_MASTER'), $query, $param);
                    }
                } elseif ($process_div === "2") {
                    //デフォルト権限情報テーブルの存在をチェックする。
                    if ($this->get_count_t_default_role($request_post["organization_id"], $key) <= 0) {
                        //権限情報を登録する。
                        $query = "INSERT INTO t_default_role ( "
                                . "organization_id, role_id, created_by, created, updated_by, updated "
                                . ") VALUES ( "
                                . ":organization_id, :role_id, :created_by, NOW(), :updated_by, NOW() "
                                . ") ";
                        $param = array(
                             "organization_id" => $request_post["organization_id"]
                            ,"role_id" => $key
                            ,"created_by" => $this->Auth->user("id")
                            ,"updated_by" => $this->Auth->user("id")
                        );
                        $result = Database::getInstance()->dbExecute(Configure::read('DB_ADMIN_MASTER'), $query, $param);
                    }
                }
            //無効を選択した場合
            } elseif ($value === "2") {
                if ($process_div === "1") {
                    //権限情報を削除する。
                    $query = "DELETE FROM t_role WHERE user_id = :user_id AND role_id = :role_id ";
                    $param = array('user_id' => $request_post["user_id"], 'role_id' => $key);
                    $result = Database::getInstance()->dbExecute(Configure::read('DB_ADMIN_MASTER'), $query, $param);
                } elseif ($process_div === "2") {
                    //権限情報を削除する。
                    $query = "DELETE FROM t_default_role WHERE organization_id = :organization_id AND role_id = :role_id ";
                    $param = array('organization_id' => $request_post["organization_id"], 'role_id' => $key);
                    $result = Database::getInstance()->dbExecute(Configure::read('DB_ADMIN_MASTER'), $query, $param);
                }
            } else {
                Logger::warning("Request role_edit post error data." . print_r($role_info, true));
                throw new BadRequestException();
            }
        }

        $res["result_cd"] = 0;
        $this->return_json($res);

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
     * 権限マスタの取得
     */
    private function get_m_role() {

        $query = "SELECT id, disp_name FROM m_role WHERE delete_flag = '0' ORDER BY id";
        $param = array();
        $m_role = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $m_role;

    }

    /*
     * 権限マスタの取得(件数)
     */
    private function get_count_m_role($id) {

        $query = "SELECT count(*) AS count_role FROM m_role WHERE id = :id AND delete_flag = '0'";
        $param = array('id' => $id);
        $m_count_role = Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $m_count_role["count_role"];

    }

    /*
     * 権限マスタ情報の取得(社員)
     */
    private function get_user_m_role_state($user_id) {

        $query = "SELECT mr.id, mr.role_name, mr.disp_name, mr.explanation, tr.id AS t_role_id "
                ."FROM m_role mr "
                ."LEFT JOIN t_role tr ON (mr.id = tr.role_id AND tr.user_id = :user_id) "
                ."WHERE mr.delete_flag = '0' "
                ."ORDER BY mr.id";
        $param = array('user_id' => $user_id);
        $m_role = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $m_role;

    }

    /*
     * 権限テーブルの取得(件数)
     */
    private function get_count_t_role($user_id, $role_id) {

        $query = "SELECT count(*) AS count_role FROM t_role WHERE user_id = :user_id AND role_id = :role_id";
        $param = array('user_id' => $user_id, 'role_id' => $role_id);
        $t_count_role = Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $t_count_role["count_role"];

    }

    /*
     * 権限マスタ情報の取得(部署)
     */
    private function get_organization_m_role_state($organization_id, $mo2_id, $mo3_id) {

        $select2 = "";
        $select3 = "";
        $left_join2 = "";
        $left_join3 = "";
        $param = array();

        //システム日時
        $currentDateTime = date('Y-m-d H:i:s', time());

        //子部署が取得できた場合
        if (!empty($mo2_id)) {
            $select2 = ", tdr2.id AS t_default_role2_id ";
            $left_join2 = "LEFT JOIN t_default_role tdr2 ON (mr.id = tdr2.role_id AND tdr2.organization_id = :organization_id2) "
                        . "LEFT JOIN m_organization mo2 ON (mo2.id = tdr2.organization_id AND mo2.start_date <= :now AND mo2.end_date >= :now) ";
            $param["organization_id2"] = $mo2_id;
            $param["now"] = $currentDateTime;
        }

        //親部署が取得できた場合
        if (!empty($mo3_id)) {
            $select3 = ", tdr3.id AS t_default_role3_id ";
            $left_join3 = "LEFT JOIN t_default_role tdr3 ON (mr.id = tdr3.role_id AND tdr3.organization_id = :organization_id3) "
                        . "LEFT JOIN m_organization mo3 ON (mo3.id = tdr3.organization_id AND mo3.start_date <= :now AND mo3.end_date >= :now) ";
            $param["organization_id3"] = $mo3_id;
            $param["now"] = $currentDateTime;
        }

        $query = "SELECT mr.id, mr.role_name, mr.disp_name, mr.explanation, tdr.id AS t_default_role_id "
                .$select2 . $select3
                ."FROM m_role mr "
                ."LEFT JOIN t_default_role tdr ON (mr.id = tdr.role_id AND tdr.organization_id = :organization_id) "
                .$left_join2 . $left_join3
                ."WHERE mr.delete_flag = '0' "
                ."ORDER BY mr.id";
        $param["organization_id"] = $organization_id;
        $m_role = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $m_role;

    }

    /*
     * 従業員マスタ情報の取得
     */
    private function get_m_user($user_id) {

        //システム日時
        $currentDateTime = date('Y-m-d H:i:s', time());

        $query = "SELECT mu.id, mu.code, mu.last_name, mu.first_name, mo.organization_name "
                ."FROM m_user mu "
                ."INNER JOIN m_organization mo ON (mo.id = mu.organization_id AND mo.start_date <= :now AND mo.end_date >= :now) "
                ."WHERE mu.id = :user_id "
                ."AND mu.start_date <= :now AND mu.end_date >= :now ";
        $param = array('now' => $currentDateTime, 'user_id' => $user_id);
        $m_user = Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $m_user;

    }

    /*
     * 部署マスタ情報の取得
     */
    private function get_m_organization($organization_id) {

        //システム日時
        $currentDateTime = date('Y-m-d H:i:s', time());

        $query = "SELECT id, code, organization_name "
                ."FROM m_organization "
                ."WHERE id = :organization_id "
                ."AND start_date <= :now AND end_date >= :now ";
        $param = array('organization_id' => $organization_id, 'now' => $currentDateTime);
        $m_organization = Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $m_organization;

    }

    /*
     * 更新対象部署の取得
     */
    private function get_m_organization_info($organization_id) {

        //システム日時
        $currentDateTime = date('Y-m-d H:i:s', time());

        $query = "SELECT id, code, organization_name "
                ."FROM m_organization "
                ."WHERE parent_id = :organization_id "
                ."AND start_date <= :now AND end_date >= :now "
                ."ORDER BY sort ";

        $param = array('organization_id' => $organization_id, 'now' => $currentDateTime);
        $m_organization_info = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $m_organization_info;

    }

    /*
     * 親部署の部署情報取得
     */
    private function get_parent_m_organization($organization_id) {

        //システム日時
        $currentDateTime = date('Y-m-d H:i:s', time());

        $query = "SELECT mo1.id AS mo1_id, mo1.organization_name AS mo1_organization_name, "
                ."mo2.id AS mo2_id, mo2.organization_name AS mo2_organization_name, "
                ."mo3.id AS mo3_id, mo3.organization_name AS mo3_organization_name "
                ."FROM m_organization mo1 "
                ."LEFT JOIN m_organization mo2 ON (mo1.parent_id = mo2.id AND mo2.start_date <= :now AND mo2.end_date >= :now) "
                ."LEFT JOIN m_organization mo3 ON (mo2.parent_id = mo3.id AND mo3.start_date <= :now AND mo3.end_date >= :now) "
                ."WHERE mo1.id = :organization_id "
                ."AND mo1.start_date <= :now AND mo1.end_date >= :now";
        $param = array('organization_id' => $organization_id, 'now' => $currentDateTime);
        $parent_m_organization_list = Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $parent_m_organization_list;

    }

    /*
     * デフォルト権限テーブルの取得(件数)
     */
    private function get_count_t_default_role($organization_id, $role_id) {

        $query = "SELECT count(*) AS count_role FROM t_default_role WHERE organization_id = :organization_id AND role_id = :role_id";
        $param = array('organization_id' => $organization_id, 'role_id' => $role_id);
        $t_count_role = Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
        return $t_count_role["count_role"];

    }

}
