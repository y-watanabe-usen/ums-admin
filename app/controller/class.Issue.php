<?php

// ライブラリ読み込み
require_once(LIB_DIR . DS . 'class.Cipher.php');

/*
 * 発行管理
 */
class Issue extends Controller {

    const update_no_publish_lock_name = "update_no_publish";
    const order_received_div = '1';
    const memory_limit_when_print = '512M';

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
        if ($this->Acl->check($this->Auth->user("role_id"), "/issue/publish_download/")) {
            Func::redirect("/issue/publish_download/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/issue/not_arrived_upload/")) {
            Func::redirect("/issue/not_arrived_upload/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/issue/publish_upload/")) {
            Func::redirect("/issue/publish_upload/");
        } else if ($this->Acl->check($this->Auth->user("role_id"), "/issue/publish_output/")) {
            Func::redirect("/issue/publish_output/");
        } else {
            Logger::warning("Forbidden Exception.");
            throw new ForbiddenException();
        }
        return;
    }

    /*
     * 発送データダウンロード画面
     */
    public function publish_download() {

        $err_message = "";
        $this->set('titleName', "発送データダウンロード");

        // UNIS最終連携日時の取得
        $query = "SELECT end_datetime "
               . "FROM t_batch "
               . "WHERE batch_name = 'unis_service_lock' " // UNIS連携バッチの最後がunis_service_lock.phpのため、その終了日時を取得したい
               . "AND delete_flag = '0' "
               . "ORDER BY id DESC "
               . "LIMIT 1";
        $unis_batch_result = Database::getInstance()->dbExecFetch(Configure::read('DB_SLAVE'), $query, array());
        $this->set('unis_batch_result', $unis_batch_result);

        //ファイル出力
        if (isset($this->RequestPost["type"])) {
            //発送データ出力
            if ($this->RequestPost["type"] == "publish" && isset($this->RequestPost["id"]) && $this->RequestPost["id"] != "") {
                $tmp_file_list = Session::get($this->controller . $this->action);
                $fname = $tmp_file_list[$this->RequestPost["id"]]["name"];
                $fpath = Configure::read('PUBLISH_DIR') . $fname;

                if (is_file($fpath) && is_readable($fpath)) {
                    header('Content-Type: application/force-download');
                    //header('Content-Type: application/octet-stream');
                    header('Content-Length: ' . filesize($fpath));
                    header('Content-disposition: attachment; filename="' . mb_convert_encoding($fname, 'SJIS-win', 'UTF-8') . '"');

                    readfile($fpath);
                    return;
                } else {
                    $err_message = "ファイルが存在しません。";
                }

                //未発送データ出力
            } else if ($this->RequestPost["type"] == "no_publish") {

//                Logger::info("start: " . date("Y-m-d H:i:s"));
                // 未発送データの件数取得
                $query = "SELECT COUNT(*) AS count "
                        . "FROM t_issue_history ih "
                        . "  INNER JOIN t_unis_cust uc "
                        . "    ON (ih.t_unis_cust_id = uc.id AND uc.delete_flag = '0') "
                        . "WHERE ih.status_flag = '0' "
                        . "  AND ih.delete_flag = '0' "
                        . "  AND EXISTS (SELECT 1 "
                        . "              FROM m_account ma "
                        . "                INNER JOIN t_unis_service us "
                        . "                  ON ma.id = us.m_account_id AND us.delete_flag = '0' "
                        . "              WHERE uc.id = ma.t_unis_cust_id "
                        . "              AND ma.status_flag = '0' "
                        . "              AND ma.admin_status_flag = '0' "
                        . "              AND ma.delete_flag = '0' "
                        . "              AND us.status_flag = '0' "
                        . "             ) ";
                $custCount = Database::getInstance()->dbExecFetch(Configure::read('DB_SLAVE'), $query, array());

                if ($custCount["count"] > 0) {
                    // ロックの取得
                    $lockFlag = false;
                    $lockName = self::update_no_publish_lock_name;
                    if ($this->is_free_lock($lockName)) {
                        if ($this->get_lock($lockName, 300)) {
                            $lockFlag = true;
                        }
                    }
                    if ($lockFlag) {
                        // トランザクション
                        Database::getInstance()->dbConnect(Configure::read('DB_MASTER'));
                        Database::getInstance()->dbBeginTransaction(Configure::read('DB_MASTER'));
                        try {
                            $this->update_no_publish();
                            Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));
                            $this->release_lock($lockName);
                            $err_message = "発送データの作成が完了しました。";
                        } catch (DBException $e) {
                            Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                            $this->release_lock($lockName);
                            Logger::info($e->getMessage());
                            Logger::warning("no_publish error.");
                            throw new InternalErrorException();
                        } catch (Exception $e) {
                            Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                            $this->release_lock($lockName);
                            Logger::info($e->getMessage());
                            Logger::warning("no_publish error.");
                            throw new InternalErrorException();
                        }
                    } else {
                        $err_message = "他の社員が同じ処理を実行中です。しばらくお待ちください。";
                    }
                } else {
                    $err_message = "未発送データはありません。";
                }
            }
        }

        //ファイルのリストを取得
        $file_list = $this->get_file_list(Configure::read('PUBLISH_DIR'));
        //file_listをSESSIONに保持
        Session::set($this->controller . $this->action, $file_list);

        $this->set("file_list", $file_list);
        $this->set("err_message", $err_message);
        $this->render('issue' . DS . 'publish_download.tpl');
    }

    /*
     * 未着データアップロード画面
     */
    public function not_arrived_upload() {
        $this->set('titleName', "未着データアップロード");
        $err_message = "";

        if (isset($this->RequestPost["type"])) {
            //アップロード
            if ($this->RequestPost["type"] == "upload") {
                $back_file = Configure::read('ISSUE_DIR') . "not_arrived_" . date("YmdHis") . ".csv";

                $err_message = $this->check_file($back_file);
                if ($err_message == "") {
                    $handle = fopen($back_file, "r");
                    if ($handle === false) {
                        Logger::warning("file open error.($back_file)");
                        throw new InternalErrorException();
                    }

                    $upload_data = array("data" => array(), "all_cnt" => 0, "err_cnt" => 0);
                    while (($buffer = fgets($handle)) !== false) {
                        $upload_data["all_cnt"] ++;
                        list($cust_cd) = str_getcsv($buffer, ',', '"', '"');

                        if ($this->check_not_arrived($cust_cd, $res)) {
                            $res["result"] = 0;
                            $upload_data["data"][] = $res;
                        } else {
                            $res["result"] = 1;
                            $upload_data["data"][] = $res;
                            $upload_data["err_cnt"] ++;
                        }
                    }

                    //エラーが無い場合
                    if ($upload_data["all_cnt"] > 0 && $upload_data["err_cnt"] == 0) {
                        //back_fileのpathをSESSIONに保持
                        Session::set($this->controller . $this->action, $back_file);
                        //内容を反映するボタンを活性化
                        $this->set("save_button", true);
                        //20件残して、それより古いファイルは削除
                        $file_list = $this->get_file_list(Configure::read('ISSUE_DIR'));
                        $fcnt = 0;
                        foreach ($file_list as $file) {
                            if (preg_match('/\Anot_arrived_[0-9]{14}\.csv\z/u', $file["name"])) {
                                $fcnt++;
                                if ($fcnt > 20)
                                    unlink(Configure::read('ISSUE_DIR') . $file["name"]);
                            }
                        }
                        //エラーがある場合、back_fileを削除
                    } else {
                        unlink($back_file);
                    }

                    $this->set("upload_data", $upload_data);
                }

                //DBへ反映
            } else if ($this->RequestPost["type"] == "save") {
                $file = Session::get($this->controller . $this->action);
                $handle = fopen($file, "r");
                if ($handle === false) {
                    Logger::warning("file open error.($file)");
                    throw new InternalErrorException();
                }

                // トランザクション開始
                Database::getInstance()->dbConnect(Configure::read('DB_MASTER'));
                Database::getInstance()->dbBeginTransaction(Configure::read('DB_MASTER'));
                try {

                    $upload_data = array("data" => array(), "all_cnt" => 0, "err_cnt" => 0);
                    $branch_cds = array();
                    while (($buffer = fgets($handle)) !== false) {
                        $upload_data["all_cnt"] ++;
                        list($cust_cd) = str_getcsv($buffer, ',', '"', '"');

                        if ($this->check_not_arrived($cust_cd, $res)) {
                            $query = "UPDATE t_issue_history SET "
                                    . "  not_arrived_date = NOW() "
                                    . ", status_flag = '2' "
                                    . ", updated_by = :updated_by "
                                    . ", updated = NOW() "
                                    . "WHERE id = :id ";

                            $param = array("updated_by" => $this->Auth->user("id"), "id" => $res["issue_id"]);
                            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                            $branch_cds[] = $res["branch_cd"];
                            $res["message"] = "アップロードしました。";
                            $res["result"] = 0;
                            $upload_data["data"][] = $res;
                        } else {
                            $res["result"] = 1;
                            $upload_data["data"][] = $res;
                            $upload_data["err_cnt"] ++;
                        }
                    }

                    // 支店宛にメール送信
                    if (Configure::read('NOT_ARRIVED_MAIL_SWITCH') === true) {
                        $mail = new SendmailHandler();
                        if (!empty($branch_cds)) {
                            $branch_cds = array_unique($branch_cds, SORT_STRING);
                            $place_holders = "";
                            $param = array();
                            foreach ($branch_cds as $key => $value) {
                                $place_holders .= ",:branch_cd{$key}";
                                $param["branch_cd{$key}"] = $value;
                            }
                            $place_holders = substr($place_holders, 1);
                            $query = "SELECT code, organization_name, mail_address "
                                    . " FROM m_organization "
                                    . " WHERE code IN ({$place_holders}) "
                                    . " AND start_date <= NOW() "
                                    . " AND end_date >= NOW() ";
                            $mOrganizations = Database::getInstance()->dbExecFetchAll(Configure::read('DB_ADMIN_MASTER'), $query, $param);
                            foreach ($mOrganizations as $mOrganization) {
                                if (empty($mOrganization["mail_address"])) {
                                    Logger::warning("mail_address invalid. branch_cd: {$mOrganization["code"]}, branch_name: {$mOrganization["organization_name"]}");
                                    continue;
                                }
                                // メール送信
                                $mail->reset();
                                $mail->setTo(array($mOrganization["mail_address"]));
                                $mail->setTemplate('not_arrived');
                                $mail->setParameter('branchName', $mOrganization["organization_name"]);
                                $mail->setParameter('url', Configure::read('ADMIN_URL'));
                                if (!$mail->send()) {
                                    Logger::warning("mail send error. branch_cd: {$mOrganization["code"]}, branch_name: {$mOrganization["organization_name"]}");
                                    throw new InternalErrorException();
                                }
                            }
                        }
                    }
                    Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));
                } catch (Exception $e) {
                    Logger::warning("not arrived update error.");
                    Logger::info($e->getMessage());
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    throw new InternalErrorException();
                }
                Session::delete($this->controller . $this->action);
                $this->set("upload_data", $upload_data);
            }
        }

        $this->set('err_message', $err_message);
        $this->render('issue' . DS . 'not_arrived_upload.tpl');
    }

    /*
     * 発送データアップロード画面
     */
    public function publish_upload() {
        $this->set('titleName', "発送データアップロード");
        $err_message = "";

        if (isset($this->RequestPost["type"])) {
            setlocale(LC_ALL, 'ja_JP.UTF-8');

            $except_init_cust = "0";
            if (!empty($this->RequestPost["except_init_cust"]) && $this->RequestPost["except_init_cust"] != "1") {
                $err_message .= "オプションを正しく選択してください。";
            } else if (!empty($this->RequestPost["except_init_cust"])) {
                $except_init_cust = $this->RequestPost["except_init_cust"];
            }
            $this->set("except_init_cust", $except_init_cust);

            //アップロード
            if ($this->RequestPost["type"] == "upload") {
                $back_file = Configure::read('ISSUE_DIR') . "publish_" . date("YmdHis") . ".csv";
                $err_message = $this->check_file($back_file);

                if (!isset($this->RequestPost["issue_type"]) || !preg_match("/\A[1-3]{1}\z/u", $this->RequestPost["issue_type"])) {
                    $err_message .= "発送先を正しく選択してください。";
                }
                if (!isset($this->RequestPost["issue_div"]) || !preg_match("/\A[1-2]{1}\z/u", $this->RequestPost["issue_div"])) {
                    $err_message .= "発送区分を正しく選択してください。";
                }
                // 発送区分が「次回の発送データダウンロードに含める」なのに、発送先「顧客CD毎に出力」が選択されていないか
                if ($this->RequestPost["issue_type"] === "3" && $this->RequestPost["issue_div"] === "1") {
                    $err_message .= "発送先を正しく選択してください。";
                }
                // 権限がないのに今すぐPDF出力しようとしていないか
                if (!$this->Acl->check($this->Auth->user("role_id"), "Issue/publish_output") && $this->RequestPost["issue_div"] === "2") {
                    $err_message .= "発送区分を正しく選択してください。";
                }

                if ($err_message == "") {
                    $handle = fopen($back_file, "r");
                    if ($handle === false) {
                        Logger::warning("file open error.($back_file)");
                        throw new InternalErrorException();
                    }

                    $upload_data = array("data" => array(), "all_cnt" => 0, "err_cnt" => 0);
                    while (($buffer = fgets($handle)) !== false) {
                        mb_convert_variables('UTF-8', 'SJIS-win', $buffer);
                        list($cust_cd, $name, $zip_code, $address1, $address2, $address3) = str_getcsv($buffer, ',', '"', '"') + array("", "", "", "", "", "");
                        //ファイル内容をチェック
                        if ($this->check_no_publish($cust_cd, $name, $zip_code, $address1, $address2, $address3, $this->RequestPost["issue_type"], $res, $except_init_cust)) {
                            if (empty($res)) {
                                continue;
                            }
                            $upload_data["all_cnt"] ++;
                            $res["result"] = 0;
                            $upload_data["data"][] = $res;
                        } else {
                            $upload_data["all_cnt"] ++;
                            $res["result"] = 1;
                            $upload_data["data"][] = $res;
                            $upload_data["err_cnt"] ++;
                        }
                    }

                    if ($upload_data["all_cnt"] > 0 && $upload_data["err_cnt"] == 0) {
                        //エラーが無い場合
                        //back_fileのpathをSESSIONに保持
                        Session::set($this->controller . $this->action, $back_file);
                        //20件残して、それより古いファイルは削除
                        $file_list = $this->get_file_list(Configure::read('ISSUE_DIR'));
                        $fcnt = 0;
                        foreach ($file_list as $file) {
                            if (preg_match('/\Apublish_[0-9]{14}\.csv\z/u', $file["name"])) {
                                $fcnt++;
                                if ($fcnt > 20)
                                    unlink(Configure::read('ISSUE_DIR') . $file["name"]);
                            }
                        }
                        $button_id = "";
                        $button_name = "";
                        if ($this->RequestPost["issue_type"] === "1" && $this->RequestPost["issue_div"] === "1") {
                            $button_id = "bt_save";
                            $button_name = "一括出力 + 次回の発送データダウンロードに含める";
                        } else if ($this->RequestPost["issue_type"] === "1" && $this->RequestPost["issue_div"] === "2") {
                            $button_id = "bt_output";
                            $button_name = "一括出力 + 今すぐPDF出力する";
                        } else if ($this->RequestPost["issue_type"] === "2" && $this->RequestPost["issue_div"] === "1") {
                            $button_id = "bt_save";
                            $button_name = "支店CD毎に出力 + 次回の発送データダウンロードに含める";
                        } else if ($this->RequestPost["issue_type"] === "2" && $this->RequestPost["issue_div"] === "2") {
                            $button_id = "bt_output";
                            $button_name = "支店CD毎に出力 + 今すぐPDF出力する";
                        } else if ($this->RequestPost["issue_type"] === "3" && $this->RequestPost["issue_div"] === "2") {
                            $button_id = "bt_output";
                            $button_name = "顧客CD毎に出力 + 今すぐPDF出力する";
                        }
                        $this->set("button_id", $button_id);
                        $this->set("button_name", $button_name);
                    } else {
                        //エラーがある場合、back_fileを削除
                        unlink($back_file);
                    }
                    $this->set("upload_data", $upload_data);
                }

                //DBへ反映
            } else if ($this->RequestPost["type"] == "save") {
                if (!isset($this->RequestPost["issue_type"]) || !preg_match("/\A[1-3]{1}\z/u", $this->RequestPost["issue_type"])) {
                    Func::redirect("issue/publish_upload/");
                    return;
                }
                $file = Session::get($this->controller . $this->action);
                $handle = fopen($file, "r");
                if ($handle === false) {
                    Logger::warning("file open error.($file)");
                    throw new InternalErrorException();
                }

                $upload_data = array("data" => array(), "all_cnt" => 0, "err_cnt" => 0);
                while (($buffer = fgets($handle)) !== false) {
                    mb_convert_variables('UTF-8', 'SJIS-win', $buffer);
                    list($cust_cd, $name, $zip_code, $address1, $address2, $address3) = str_getcsv($buffer, ',', '"', '"') + array("", "", "", "", "", "");
                    //ファイル内容をチェック
                    if ($this->check_no_publish($cust_cd, $name, $zip_code, $address1, $address2, $address3, $this->RequestPost["issue_type"], $res, $except_init_cust)) {
                        if (empty($res)) {
                            continue;
                        }
                        $upload_data["all_cnt"] ++;
                        $param = array(
                            "t_unis_cust_id" => $res["t_unis_cust_id"],
                            "name" => $res["name"],
                            "zip_cd" => $res["zip_cd"],
                            "address1" => $res["address1"],
                            "address2" => $res["address2"],
                            "address3" => $res["address3"],
                            "branch_cd" => $res["branch_cd"],
                            "status_flag" => '0',
                            "created_by" => $this->Auth->user("id"),
                            "updated_by" => $this->Auth->user("id"),
                        );

                        $result = $this->insert_t_issue_history($param);
                        $res["message"] = "アップロードしました。";
                        $res["result"] = 0;
                        $upload_data["data"][] = $res;
                    } else {
                        $upload_data["all_cnt"] ++;
                        $res["result"] = 1;
                        $upload_data["data"][] = $res;
                        $upload_data["err_cnt"] ++;
                    }
                }

                Session::delete($this->controller . $this->action);
                $this->set("upload_data", $upload_data);
            }
        }

        $this->set('err_message', $err_message);
        $this->render('issue' . DS . 'publish_upload.tpl');
    }

    /*
     * 発送データアップロード画面
     * 更新+発送データ出力ボタン押下時
     */
    public function publish_output() {
        $this->set('titleName', "発送データアップロード");
        $err_message = "";

        if (empty($this->RequestPost["type"])) {
            Func::redirect("/issue/publish_upload");
            return;
        }
        if ($this->RequestPost["type"] !== "output") {
            Func::redirect("/issue/publish_upload");
            return;
        }

        if (!isset($this->RequestPost["issue_type"]) || !preg_match("/\A[1-3]{1}\z/u", $this->RequestPost["issue_type"])) {
            Func::redirect("issue/publish_upload/");
            return;
        }

        setlocale(LC_ALL, 'ja_JP.UTF-8');

        $file = Session::get($this->controller . "publish_upload");
        $handle = fopen($file, "r");
        if ($handle === false) {
            Logger::warning("file open error.($file)");
            throw new InternalErrorException();
        }

        $except_init_cust = "0";
        if (!empty($this->RequestPost["except_init_cust"]) && $this->RequestPost["except_init_cust"] != "1") {
            $err_message .= "オプションを正しく選択してください。";
        } else if (!empty($this->RequestPost["except_init_cust"])) {
            $except_init_cust = $this->RequestPost["except_init_cust"];
        }
        $this->set("except_init_cust", $except_init_cust);

        // ロックの取得
        $lockFlag = false;
        $lockName = self::update_no_publish_lock_name;
        if ($this->is_free_lock($lockName)) {
            if ($this->get_lock($lockName, 300)) {
                $lockFlag = true;
            }
        }
        if ($lockFlag) {
            $upload_data = array("data" => array(), "all_cnt" => 0, "err_cnt" => 0);
            // トランザクション開始
            Database::getInstance()->dbConnect(Configure::read('DB_MASTER'));
            Database::getInstance()->dbBeginTransaction(Configure::read('DB_MASTER'));
            try {
                $t_unis_cust_id_list = array();
                while (($buffer = fgets($handle)) !== false) {
                    mb_convert_variables('UTF-8', 'SJIS-win', $buffer);
                    list($cust_cd, $name, $zip_code, $address1, $address2, $address3) = str_getcsv($buffer, ',', '"', '"') + array("", "", "", "", "", "");
                    //ファイル内容をチェック
                    if ($this->check_no_publish($cust_cd, $name, $zip_code, $address1, $address2, $address3, $this->RequestPost["issue_type"], $res, $except_init_cust)) {
                        if (empty($res)) {
                            continue;
                        }
                        $upload_data["all_cnt"] ++;
                        $param = array(
                            "t_unis_cust_id" => $res["t_unis_cust_id"],
                            "name" => $res["name"],
                            "zip_cd" => $res["zip_cd"],
                            "address1" => $res["address1"],
                            "address2" => $res["address2"],
                            "address3" => $res["address3"],
                            "branch_cd" => $res["branch_cd"],
                            "status_flag" => '0',
                            "created_by" => $this->Auth->user("id"),
                            "updated_by" => $this->Auth->user("id"),
                        );

                        $result = $this->insert_t_issue_history($param);
                        $res["message"] = "発送データを出力しました。";
                        $res["result"] = 0;
                        $upload_data["data"][] = $res;
                        $t_unis_cust_id_list[] = $res["t_unis_cust_id"];
                    } else {
                        $upload_data["all_cnt"] ++;
                        $res["result"] = 1;
                        $upload_data["data"][] = $res;
                        $upload_data["err_cnt"] ++;
                    }
                }

                if (!empty($t_unis_cust_id_list)) {
                    if ($this->RequestPost["issue_type"] == "3") {
                        $printDivFlag = "1";
                    } else {
                        $printDivFlag = "0";
                    }
                    $this->update_no_publish($t_unis_cust_id_list, $printDivFlag);
                }
                Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));
                $this->release_lock($lockName);
                Session::delete($this->controller . "publish_upload");
            } catch (Exception $e) {
                Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                $this->release_lock($lockName);
                Logger::info($e->getMessage());
                Logger::warning("publish_output error.");
                throw new InternalErrorException();
            }
        } else {
            $err_message = "他の社員が同じ処理を実行中です。しばらくお待ちください。";
        }

        $this->set("upload_data", $upload_data);

        $this->set('err_message', $err_message);
        $this->render('issue' . DS . 'publish_upload.tpl');
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
     * csvチェック＆バックアップコピー
     */
    private function check_file($backup) {
        //アップロードファイルチェック
        if (empty($_FILES) || strcasecmp(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION), "csv") != 0) {
            Logger::warning("upload file error." . print_r($_FILES, true));
            return "CSVファイルを選択してください。";
            //バックアップ取得
        } else if (!move_uploaded_file($_FILES["file"]["tmp_name"], $backup)) {
            Logger::warning("move_uploaded_file error.($backup)");
            return "予期せぬエラーが発生しました。";
        }
        return "";
    }

    /*
     * 未着アップロードデータチェック
     */
    private function check_not_arrived($cust_cd, &$res) {
        $message = "";
        $issue_id = "";
        $branch_cd = "";
        $branch_name = "";

        if (!Validation::numeric($cust_cd) || !Validation::maxLength($cust_cd, 9)) {
            $message = "顧客CDが不正です。";
        } else {
            //顧客CD,発送済履歴の存在確認
            $query = "SELECT uc.cust_cd, uc.branch_cd, uc.branch_name, ih.id "
                    . "FROM t_unis_cust uc "
                    . "  LEFT JOIN t_issue_history ih ON (uc.id = ih.t_unis_cust_id AND ih.status_flag = '1' AND ih.delete_flag = '0') "
                    . "WHERE uc.cust_cd = :cust_cd AND uc.delete_flag = '0' "
                    . "ORDER BY ih.id DESC ";

            $param = array("cust_cd" => $cust_cd);
            $issue_info = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);

            if (empty($issue_info)) {
                $message = "存在しない顧客CDです。";
            } else if (empty($issue_info["id"])) {
                $message = "発送済の発送履歴が有りません。";
            } else {
                $issue_id = $issue_info["id"];
                $branch_cd = $issue_info["branch_cd"];
                $branch_name = $issue_info["branch_name"];
            }
        }
        $res = array(
            "cust_cd" => $cust_cd,
            "branch_cd" => $branch_cd,
            "branch_name" => $branch_name,
            "issue_id" => $issue_id,
            "message" => $message
        );

        return ($message == "") ? true : false;
    }

    /*
     * 再発送アップロードデータチェック
     */
    private function check_no_publish($cust_cd, $name = "", $zip_cd = "", $address1 = "", $address2 = "", $address3 = "", $issue_type, &$res, $except_init_cust = "0") {
        $message = "";
        $t_unis_cust_id = "";
        $type = 0; //名称以降の項目の取得元(0:ファイル,1:UNISデータ)

        if (!Validation::numeric($cust_cd) || !Validation::maxLength($cust_cd, 9)) {
            $message = "顧客CDが不正です。";
        } else {
            //顧客CD,未発送履歴の存在確認
            $query = "SELECT uc.id AS t_unis_cust_id, uc.name, uc.zip_cd , uc.address1, IFNULL(uc.address2, '') as 'address2', IFNULL(uc.address3, '') as 'address3', uc.branch_cd, "
                    . "  ih.id AS 'issue_id', "
                    . "  (SELECT COUNT(*) FROM m_account ma WHERE ma.t_unis_cust_id = uc.id AND ma.status_flag = '0' AND ma.admin_status_flag = '0' AND ma.delete_flag = '0') AS account_count, "
                    . "  (SELECT COUNT(*) FROM m_account ma WHERE ma.t_unis_cust_id = uc.id AND ma.init_date IS NOT NULL AND ma.status_flag = '0' AND ma.admin_status_flag = '0' AND ma.delete_flag = '0') AS init_count, "
                    . "  (SELECT COUNT(*) FROM t_unis_service us WHERE us.t_unis_cust_id = uc.id AND us.status_flag = '0' AND us.delete_flag = '0') AS service_count "
                    . "FROM t_unis_cust uc "
                    . "  LEFT JOIN t_issue_history ih ON (uc.id = ih.t_unis_cust_id AND ih.status_flag = '0' AND ih.delete_flag = '0') "
                    . "WHERE uc.cust_cd = :cust_cd AND uc.delete_flag = '0' "
                    . "ORDER BY issue_id DESC ";
            $param = array("cust_cd" => $cust_cd);
            $no_publish_info = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
            if (empty($no_publish_info)) {
                $message = "存在しない顧客CDです。";
            } else if ($no_publish_info["account_count"] == 0) {
                $message = "有効なアカウントが存在しません。";
            } else if ($no_publish_info["service_count"] == 0) {
                $message = "有効なサービスが存在しません。";
            } else if ($no_publish_info["issue_id"] != null) {
                $message = "未発送の発送履歴が有ります。";
            } else if ($except_init_cust == "1" && $no_publish_info["account_count"] == $no_publish_info["init_count"]) {
                // 初回登録済み顧客を除くがチェックされているとき、初回登録済顧客は無視する
                $res = array();
                return true;
//            } else if ($except_init_cust == "0" && $no_publish_info["account_count"] == $no_publish_info["init_count"]) {
//                $message = "初回登録済です。";
            } else if ($issue_type === "2" && empty($no_publish_info["branch_cd"])) {
                $message = "管轄支店が有りません。";
            } else {
                $t_unis_cust_id = $no_publish_info["t_unis_cust_id"];
                //
                if ($name != "") {
                    if (!Validation::maxLength($name, 40)) {
                        $message = "送付先名称は40文字以内で入力してください。";
                    } else if (!preg_match('/\A[0-9]{3}-[0-9]{4}\z/u', $zip_cd)) {
                        $message = "送付先郵便番号は999-9999形式で入力してください。";
                    } else if ($address1 == "" || !Validation::maxLength($address1, 50)) {
                        $message = "送付先住所1は50文字以内で入力してください。";
                    } else if ($address2 != "" && !Validation::maxLength($address2, 50)) {
                        $message = "送付先住所2は50文字以内で入力してください。";
                    } else if ($address3 != "" && !Validation::maxLength($address3, 50)) {
                        $message = "送付先住所3は50文字以内で入力してください。";
                    }
                } else {
                    $name = $no_publish_info["name"];
                    $zip_cd = $no_publish_info["zip_cd"];
                    $address1 = $no_publish_info["address1"];
                    $address2 = $no_publish_info["address2"];
                    $address3 = $no_publish_info["address3"];
                    $branch_cd = $issue_type === "2" ? $no_publish_info["branch_cd"] : "";
                    $type = 1;
                }
            }
        }
        $res = array(
            "cust_cd" => $cust_cd,
            "name" => $name,
            "zip_cd" => $zip_cd,
            "address1" => $address1,
            "address2" => $address2,
            "address3" => $address3,
            "branch_cd" => $branch_cd,
            "message" => $message,
            "t_unis_cust_id" => $t_unis_cust_id,
            "type" => $type,
        );

        return ($message == "") ? true : false;
    }

    /*
     * 未発送データを発送済みに更新
     *
     * @param $t_unis_cust_id_list
     * @param $printDivFlag 1: 顧客CD単位で出力, 1以外: 既存の処理(一括出力or支店毎出力)
     */
    private function update_no_publish($t_unis_cust_id_list = null, $printDivFlag = "0") {
        set_time_limit(0);
        $query = "set wait_timeout = 300";
        Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, array());

        $param = array();
        $where = "";
        if (!is_null($t_unis_cust_id_list)) {
            $place_holders = "";
            foreach ($t_unis_cust_id_list as $key => $value) {
                $place_holders .= ",:t_unis_cust_id{$key}";
                $param["t_unis_cust_id{$key}"] = $value;
            }
            $place_holders = substr($place_holders, 1);
            $where = "  AND uc.id IN ({$place_holders}) ";
        }

        // 未発送データの取得
        $query = "SELECT ih.id AS t_issue_history_id "
                . "  , uc.id AS t_unis_cust_id "
                . "  , uc.cust_cd "
                . "  , uc.name "
                . "  , ih.zip_cd "
                . "  , ih.name AS issue_name "
                . "  , ih.address1 "
                . "  , ih.address2 "
                . "  , ih.address3 "
                . "  , ih.branch_cd "
                . "  , IFNULL(ih.can_flag, 0) AS can_flag "
                . "FROM t_issue_history ih "
                . "  INNER JOIN t_unis_cust uc "
                . "    ON (ih.t_unis_cust_id = uc.id AND uc.delete_flag = '0') "
                . "WHERE ih.status_flag = '0' "
                . "  AND ih.delete_flag = '0' "
                . $where
                . "  AND EXISTS (SELECT 1 "
                . "              FROM m_account ma "
                . "                INNER JOIN t_unis_service us "
                . "                  ON ma.id = us.m_account_id AND us.delete_flag = '0' "
                . "              WHERE uc.id = ma.t_unis_cust_id "
                . "              AND ma.status_flag = '0' "
                . "              AND ma.admin_status_flag = '0' "
                . "              AND ma.delete_flag = '0' "
                . "              AND us.status_flag = '0' "
                . "             ) "
                . "ORDER BY uc.cust_cd ";
        $custFetchResult = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);

        $search = array('”', '“'); // 全角ダブルクォーテーションを半角に置換する
        $replace = '"';
        $custRowCount = 0;
        $custs = array(); // PDF出力用の構造体
        $custsNoPrintInfo = array(); // PDFに印刷しないけど顧客ごとの処理分岐に必要な情報を格納
        $mService = $this->get_determinable_pass_service();
        $passableService = array();
        foreach($mService as $row) {
            $passableService[] = $row['service_cd'];
        }
        // 発送対象の顧客数分ループ
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
            $custsNoPrintInfo[$custRowCount]["can_flag"] = $custRow["can_flag"];
            // 発送対象顧客のアカウント取得
            $query = "SELECT ma.id AS m_account_id "
                    . "             , ma.login_id "
                    . "             , ma.init_password "
                    . "             , ma.password "
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
                $account->password_hash = $accountRow["password"];
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
                        . "     , us.detail_status_div "
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
                    // R・スタシフの場合はRサービス発送履歴テーブルにデータが有るか取得する（テストデータの場合は処理を行わない）
                    if (in_array($serviceRow['service_cd'], $passableService) && $isIgnore === false) {
                        $query = "SELECT COUNT(*) AS count "
                                . "FROM t_r_issue_history "
                                . "WHERE t_unis_service_id = :t_unis_service_id "
                                . "  AND delete_flag = '0' ";
                        $param = array("t_unis_service_id" => $serviceRow["t_unis_service_id"]);
                        $rIssueHistoryCount = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
                        if ($rIssueHistoryCount["count"] === "0" && $serviceRow['detail_status_div'] == self::order_received_div) {
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

            // 未発送を発送済に更新
            $query = "UPDATE t_issue_history "
                    . "SET issue_date = NOW(), status_flag = '1', updated_by = :updated_by, updated = NOW() "
                    . "WHERE id = :t_issue_history_id ";
            $param = array(
                "t_issue_history_id" => $custRow["t_issue_history_id"],
                "updated_by" => $this->Auth->user("id"),
            );
            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
            $custRowCount++;
        } // end of while

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

        $idPdf = new IdPdf("P", "mm", "A4", true, "UTF-8");
        $maxY = $idPdf->getMaxY();
        if ($printDivFlag != "1") {
            $custDefault = array();        // 顧客発送 標準フォーマット
            $custDefaultCAN = array();     // 顧客発送 標準フォーマット CAN
            $custManyAccount = array();    // 顧客発送 別出しフォーマット
            $custManyAccountCAN = array(); // 顧客発送 別出しフォーマット CAN
            $branchDefault = array();      // 技術発送 標準フォーマット
            $branchDefaultCAN = array();   // 技術発送 標準フォーマット CAN
            $branchManyAccount = array();  // 技術発送 別出しフォーマット
            $branchManyAccountCAN = array(); // 技術発送 別出しフォーマット CAN
            foreach ($custs as $idxCust => $cust) {
                $canFlag = isset($custsNoPrintInfo[$idxCust]["can_flag"]) ? (int)$custsNoPrintInfo[$idxCust]["can_flag"] : 0;
                if (empty($cust->branch_cd)) {
                    if ($maxY > $idPdf->getCustHeight($cust)) {
                        if ($canFlag === 1) {
                            $custDefaultCAN[] = $cust;
                        } else {
                            $custDefault[] = $cust;
                        }
                        
                    } else {
                        if ($canFlag === 1) {
                            $custManyAccountCAN[] = $cust;
                        } else {
                            $custManyAccount[] = $cust;
                        }
                    }
                } else {
                    if ($maxY > $idPdf->getCustHeight($cust)) {
                        if ($canFlag === 1) {
                            $branchDefaultCAN[] = $cust; // CAN発送の場合、支店ではなく顧客単位で印刷
                        } else {
                            $branchDefault[$cust->branch_cd][] = $cust;
                        }
                    } else {
                        if ($canFlag === 1) {
                            $branchManyAccountCAN[] = $cust; // CAN発送の場合、支店ではなく顧客単位で印刷
                        } else {
                            $branchManyAccount[$cust->branch_cd][] = $cust;
                        }
                    }
                }
            }

            // zip圧縮単位「技術」ここから
            $zipFileList = array();
            //*******************************************
            //** 技術発送 標準フォーマット
            //*******************************************
            if (!empty($branchDefault)) {
                foreach ($branchDefault as $branchCd => $custs) {
                    // PDF初期化
                    if (!empty($organization[$branchCd])) {
                        $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_技術発送_{$organization[$branchCd]}_標準フォーマット.pdf";
                    } else {
                        $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_技術発送_{$branchCd}_標準フォーマット.pdf";
                    }
                    $zipFileList[] = $this->putPdf($file, $custs, 0);
                }
            }

            //*******************************************
            //** 技術発送 別出しフォーマット
            //*******************************************
            if (!empty($branchManyAccount)) {
                foreach ($branchManyAccount as $branchCd => $custs) {
                    // PDF初期化
                    if (!empty($organization[$branchCd])) {
                        $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_技術発送_{$organization[$branchCd]}_複数枚フォーマット.pdf";
                    } else {
                        $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . "_技術発送_{$branchCd}_複数枚フォーマット.pdf";
                    }
                    $zipFileList[] = $this->putPdf($file, $custs, 0);
                }
            }

            if (!empty($zipFileList)) {
                // zipで圧縮する
                $zipPath = Configure::read("PUBLISH_DIR") . Func::ymdhis() . "_技術発送.zip";
                $this->zipIn($zipPath, $zipFileList, 1);
                unset($zipPath, $zipFileList);
            }
            // zip圧縮単位「技術」ここまで

            // zip圧縮単位「技術発送でかつCAN」ここから
            $zipFileList = array();
            //*******************************************
            //** 技術発送 標準フォーマット CAN
            //*******************************************
            if (!empty($branchDefaultCAN)) {
                foreach ($branchDefaultCAN as $cust) {
                    $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . '_技術発送(CAN)_' . $cust->cust_cd . '_標準フォーマット.pdf';
                    $zipFileList[] = $this->putPdf($file, array($cust), 0);
                }
            }

            //*******************************************
            //** 技術発送 別出しフォーマット CAN
            //*******************************************
            if (!empty($branchManyAccountCAN)) {
                foreach ($branchManyAccountCAN as $cust) {
                    $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . '_技術発送(CAN)_' . $cust->cust_cd . '_複数枚フォーマット.pdf';
                    $zipFileList[] = $this->putPdf($file, array($cust), 0);
                }
            }

            if (!empty($zipFileList)) {
                // zipで圧縮する
                $zipPath = Configure::read("PUBLISH_DIR") . Func::ymdhis() . "_技術発送(CAN).zip";
                $this->zipIn($zipPath, $zipFileList, 1);
                unset($zipPath, $zipFileList);
            }
            // zip圧縮単位「技術発送でかつCAN」ここまで

            // zip圧縮単位「顧客発送でかつCAN」ここから
            $zipFileList = array();
            //*******************************************
            //** 顧客発送 別出しフォーマット CAN
            //*******************************************
            if (!empty($custManyAccountCAN)) {
                foreach ($custManyAccountCAN as $cust) {
                    $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . '_顧客発送(CAN)_' . $cust->cust_cd . '_複数枚フォーマット.pdf';
                    $zipFileList[] = $this->putPdf($file, array($cust), 1);
                }
            }

            //*******************************************
            //** 顧客発送 標準フォーマット CAN
            //*******************************************
            if (!empty($custDefaultCAN)) {
                foreach ($custDefaultCAN as $cust) {
                    $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . '_顧客発送(CAN)_' . $cust->cust_cd . '_標準フォーマット.pdf';
                    $zipFileList[] = $this->putPdf($file, array($cust), 0);
                }
            }

            if (!empty($zipFileList)) {
                // zipで圧縮する
                $zipPath = Configure::read("PUBLISH_DIR") . Func::ymdhis() . "_顧客発送(CAN).zip";
                $this->zipIn($zipPath, $zipFileList, 1);
                unset($zipPath, $zipFileList);
            }
            // zip圧縮単位「顧客発送でかつCAN」ここまで

            // zip圧縮しない
            //*******************************************
            //** 顧客発送 別出しフォーマット
            //*******************************************
            if (!empty($custManyAccount)) {
                $file = Configure::read("PUBLISH_DIR") . Func::ymdhis() . '_顧客発送_複数枚フォーマット.pdf';
                $this->putPdf($file, $custManyAccount, 1);
            }

            //*******************************************
            //** 顧客発送 標準フォーマット
            //*******************************************
            if (!empty($custDefault)) {
                $file = Configure::read("PUBLISH_DIR") . Func::ymdhis() . '_顧客発送_標準フォーマット.pdf';
                $this->putPdf($file, $custDefault, 0);
            }

        } else { // $printDivFlag = "1"
            // 顧客CD単位で出力
            $zipFileList = array();
            foreach ($custs as $cust) {
                $file = "";
                if ($maxY > $idPdf->getCustHeight($cust)) {
                    $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . '_顧客CD単位_' . $cust->cust_cd . '_標準フォーマット.pdf';
                } else {
                    $file = Configure::read("PUBLISH_BRANCH_DIR") . Func::ymdhis() . '_顧客CD単位_' . $cust->cust_cd . '_複数枚フォーマット.pdf';
                }
                $zipFileList[] = $this->putPdf($file, array($cust), 0);
            }

            if (!empty($zipFileList)) {
                // zipで圧縮する
                $zipPath = Configure::read("PUBLISH_DIR") . Func::ymdhis() . "_顧客CD単位.zip";
                $this->zipIn($zipPath, $zipFileList, 1);
                unset($zipPath, $zipFileList);
            }
        }
    }

    /**
     * @param string $filePath PDFを出力する絶対パス
     * @param object $content PDFに書き込む内容
     * @param integer $secSleep sleepさせる秒数
     * @return string $filePath
     */
    private function putPdf($filePath, $content, $secSleep = 1) {
        // 設定
        require_once(LIB_DIR . DS . 'class.IdPdf.php');
        if (ini_get('memory_limit') !== self::memory_limit_when_print) {
            ini_set('memory_limit', self::memory_limit_when_print);
        }
        $objIdPdf = new IdPdf("P", "mm", "A4", true, "UTF-8");

        // PDF出力
        $objIdPdf->setFile($filePath);
        $objIdPdf->setCusts($content);
        $objIdPdf->printPdf();

        unset($objIdPdf);
        if (is_int($secSleep) && $secSleep > 0) sleep($secSleep);
        return $filePath;
    }

    /**
     * @param string $zipPath zipを出力する絶対パス
     * @param array $zipFileList zipに格納するファイル群のフルパス
     * @param integer $secSleep sleepさせる秒数
     * @return string $zipPath
     */
    private function zipIn($zipPath, $zipFileList, $secSleep = 1) {
        // 設定
        $objZip = new ZipArchive();
        $charCdTo = 'SJIS-win';
        $charCdFrom = 'UTF-8';
        
        // zip出力
        $resOpen = $objZip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        if ($resOpen !== true) {
            throw new Exception("zip archive error, {$resOpen}, " . $zipPath);
        }
        foreach ($zipFileList as $zipFile) {
            $objZip->addFile($zipFile, basename(mb_convert_encoding($zipFile, $charCdTo, $charCdFrom)));
        }
        $objZip->close();

        unset($objZip);
        if (is_int($secSleep) && $secSleep > 0) sleep($secSleep);
        return $zipPath;
    }
    
    /*
     * アカウント証発送履歴テーブル登録
     */
    private function insert_t_issue_history($param) {
        $query = "INSERT INTO t_issue_history ( "
                . "t_unis_cust_id,name,zip_cd,address1,address2,address3,branch_cd,status_flag,created_by,created,updated_by,updated "
                . ") VALUES ( "
                . ":t_unis_cust_id,:name,:zip_cd,:address1,:address2,:address3,NULLIF(:branch_cd, ''),:status_flag,:created_by,NOW(),:updated_by,NOW() "
                . ") ";

        return Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
    }

}
