<?php 
// ライブラリ読み込み
require_once(LIB_DIR . DS . 'class.Cipher.php');

/*
 * データ抽出
 */
class Bulk extends Controller {
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
        if ($this->Acl->check($this->Auth->user("role_id"), "/bulk/services/")) {
            Func::redirect("/bulk/services/");
        } else {
            Logger::warning("Forbidden Exception.");
            throw new ForbiddenException();
        }
        return;
    }

    /*
     * 初回登録顧客抽出画面
     */
    public function services() {
        $this->set('titleName', "サービス一括強制施錠／開錠");
        $err_message = "";
        //サービスマスタを取得する
        $query = "SELECT service_cd, service_name FROM m_service WHERE delete_flag = '0' AND service_cd = '100' ORDER BY id ";
        $param = array();
        $serviceList = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, $param);
        $this->set("serviceList", $serviceList);

        $put_data = array();
        $err_message = "";
        if (isset($this->RequestPost["type"])) {
            setlocale(LC_ALL, 'ja_JP.UTF-8');
            // 登録ボタン押下
            // 入力チェック
            // サービスのチェック
            if (empty($this->RequestPost["service_cd"]) && !Validation::numeric($this->RequestPost["service_cd"]) || !Validation::maxLength($this->RequestPost["service_cd"], 9)) {
                $err_message .= "サービスが不正です。\n";
            } else {
                // サービス取得
                $query = "SELECT service_cd, service_name FROM m_service WHERE service_cd = :service_cd AND delete_flag = '0'";
                $service = Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $query, array("service_cd" => $this->RequestPost["service_cd"]));
                if (empty($service)) {
                    $err_message .= "サービスが不正です。\n";
                }
            }
            if ($err_message !== "") {
                $this->set("err_message", $err_message);
                $this->render('bulk' . DS . 'services.tpl');
                return;
            }

            if ($this->RequestPost["type"] === "upload") {
                // 入力チェック
                $backup_file = Configure::read('BULK_DIR') . "services_" .date("YmdHis") . ".csv";
                if (empty($_FILES) || strcasecmp(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION), "csv") != 0) {
                    $err_message .= "CSVファイルを選択してください。\n";
                    //バックアップ取得
                } else if (!move_uploaded_file($_FILES["file"]["tmp_name"], $backup_file)) {
                    Logger::warning("move_uploaded_file error.($backup_file)");
                    $err_message .= "予期せぬエラーが発生しました。\n";
                }

                if ($err_message == "") {
                    // 仮ID/PW抽出(確認・完了共通処理）
                    $file_chk_result = $this->serviceStopFileTransact($backup_file);
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
                    $file_list = $this->get_file_list(Configure::read('BULK_DIR'));
                    $fcnt = 0;
                    foreach ($file_list as $file) {
                        if (preg_match('/\Aservices_[0-9]{14}\.csv\z/u', $file["name"])) {
                            $fcnt++;
                            if ($fcnt > 20) {
                                unlink(Configure::read('BULK_DIR') . $file["name"]);
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
                    $file_chk_result = $this->serviceStopFileTransact($file);
                    Database::getInstance()->dbCommit(Configure::read('DB_MASTER'));
                } catch (Exception $e) {
                    Logger::warning("bulk: sevice_stop_status update error.");
                    Logger::info($e->getMessage());
                    Database::getInstance()->dbRollBack(Configure::read('DB_MASTER'));
                    throw new InternalErrorException();
                }
            }
        }
        if (!empty($file_chk_result)) {
            $upload_data = array('data' => $file_chk_result['put_data'], 'all_cnt' => $file_chk_result['line_cnt'], 'err_cnt' => $file_chk_result['err_cnt']);
        }
        if ($this->RequestPost['type'] == "save" && $upload_data['err_cnt'] > 0) {
            $this->RequestPost['type'] = "upload";
        }
        $this->set('type', $this->RequestPost["type"]);
        $this->set('upload_data', $upload_data);
        $this->set("err_message", $err_message);
        $this->set("service_cd", $service[0]['service_cd']);
        $this->render('bulk' . DS . 'services.tpl');
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

    private function serviceStopFileTransact($file) {
        // サービス取得
        $service_cd = '100';
        $service = $this->get_service_master();
        foreach($service as $row) {
            if($row['service_cd'] === $service_cd) {
                $service_name = $row['service_name'];
            }
        }

        $result_status = array('1' => '開錠', '2' => '強制施錠');

        $handle = fopen($file, "r");
        if ($handle === false) {
            Logger::warning("file open error.({$file})");
            throw new InternalErrorException();
        }
        $put_data = array();
        $cust_cd_check = array();
        $line_cnt = 0;
        $error_cnt = 0;
        while (($buffer = fgets($handle)) !== false && $line_cnt <= 5000) {
            $data = array();
            $line_error = false;
            mb_convert_variables('UTF-8', 'SJIS-win', $buffer);
            $csv_data = str_getcsv($buffer, ',', '"', '"');
            $data = $this->getBulkServiceDispDataInit($csv_data[0],$service_name);

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
            // 更新ステータスのチェック
            if (empty($csv_data[1])) {
                $line_error = true;
                $data['message'] .= "更新ステータスが空です。";
            } else if (!Validation::numeric($csv_data[1]) || !array_key_exists($csv_data[1], $result_status)) {
                $data['message'] .= "更新ステータスの形式が不正です。";
                $line_error = true;
            }

            // エラーが無ければ、アカウントID・ログインID・PWを取得
            if (!$line_error) {
                // アカウント情報の検索
                $result = $this->getCustAccountsInfo($data["cust_cd"], $service_cd);
                if (empty($result)) {
                    $data['message'] = "顧客CDが有効ではありません。";
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

                    if ($row["t_unis_service_admin_status_flag"] === "1" && $csv_data[1] === "2") {
                        $data['message'] .= "既に停止中のサービスです。";
                    } elseif ($row["stop_count"] > 0 && $csv_data[1] === "2") {
                        $data['message'] .= "既に休店中のサービスです。";
                    } elseif ($row["lock_count"] > 0 && $csv_data[1] === "2") {
                        $data['message'] .= "既に停止中のサービスです。";
                    } elseif ($row["t_unis_service_admin_status_flag"] !== "1" && $row["stop_count"] == 0 && $row["lock_count"] == 0 && $csv_data[1] === "1") {
                        $data['message'] .= "既に開錠しているサービスです。";
                    }

                    if (!empty($data['message'])) {
                        $data['result'] = 1;
                        $put_data[] = $data;
                        $data = array();
                        $data = $this->getBulkServiceDispDataInit($csv_data[0], $service_name);
                        $error_cnt++;
                        continue;
                    }
                    $data['name'] = $row['name'];
                    $data['m_account_id'] = $row['m_account_id'];
                    $data['status'] = $result_status[$csv_data[1]];
                    if ($this->RequestPost["type"] === "save" && $csv_data[1] == "2") {
                        $query = "INSERT INTO t_service_stop_history ( "
                            . "t_unis_service_id, stop_div, start_datetime, created_by, created, updated_by, updated "
                            . ") VALUES ( "
                            . ":t_unis_service_id, :stop_div, :start_datetime, :created_by, NOW(), :updated_by, NOW() "
                        . ") ";
                        $param = array(
                            't_unis_service_id' => $row['t_unis_service_id'],
                            'stop_div' => '2', //強制施錠
                            'start_datetime' => date('Y-m-d H:i:s'),
                            "created_by" => $this->Auth->user("id"),
                            "updated_by" => $this->Auth->user("id"),
                        );
                        try {
                            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                        } catch (DBException $e) {
                            Logger::warning("t_service_stop_history update error.");
                            $this->release_lock($lockName);
                            throw new BadRequestException();
                        }
                    } else if ($this->RequestPost["type"] === "save" && $csv_data[1] == "1") {
                        $query = "SELECT id FROM t_service_stop_history "
                               . " WHERE t_unis_service_id = :t_unis_service_id"
                               . " ORDER BY id DESC LIMIT 1";
                        $param = array("t_unis_service_id" => $row['t_unis_service_id']);
                        $res = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, $param);
                        $query = "UPDATE t_service_stop_history SET "
                            . "release_datetime = NOW(), "
                            . " updated_by = :updated_by, "
                            . " updated = NOW() "
                            . " WHERE id = :stop_id ";
                        $param = array(
                            'stop_id' => $res['id'],
                            "updated_by" => $this->Auth->user("id"),
                        );
                        try {
                            $result = Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);
                        } catch (DBException $e) {
                            Logger::warning("t_service_stop_history update error.");
                            $this->release_lock($lockName);
                            throw new BadRequestException();
                        }
                    }
                    $cust_cd_check[$csv_data[0]] = true;
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

    private function getBulkServiceDispDataInit($cust_cd, $service_name) {
        $data['cust_cd'] = $cust_cd;
        $data['name'] = '';
        $data['m_account_id'] = '';
        $data['service_name'] = $service_name;
        $data['message'] = '';
        $data['result'] = '';
        return $data;
    }

}
