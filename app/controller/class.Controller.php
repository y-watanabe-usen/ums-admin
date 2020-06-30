<?php

require_once(LIB_DIR . DS . 'class.Auth.php');
require_once(LIB_DIR . DS . 'class.Acl.php');

/*
 * コントローラー基底クラス
 */
abstract class Controller {

    public $controller = null;
    public $action = null;
    private $viewVars = array();
    protected $Request = array();
    protected $RequestPost = array();
    protected $RequestGet = array();
    protected $Auth = array();
    protected $Acl = array();
    protected $Validation = array();
    protected $_preference = array();

    public function __construct() {
        $this->Request = new Request();
        $this->RequestPost = $this->Request->getPost();
        $this->RequestGet = $this->Request->getQuery();
        $this->Auth = new Auth();
        $this->Acl = new Acl();
        $this->Validation = new Validation();
    }

    public function beforeFilter() {}

    protected function set($one, $two = null) {
        if (is_array($one)) {
            if (is_array($two)) {
                $data = array_combine($one, $two);
            } else {
                $data = $one;
            }
        } else {
            $data = array($one => $two);
        }
        $this->viewVars = $data + $this->viewVars;
    }

    protected function checkLogin() {
        $check = $this->Auth->check();
        if ($check === Auth::LOGIN_NG || $check === Auth::TIMEOUT) {
            if ($this->Request->isAjax()) {
                throw new ForbiddenException();
            }
            if ($this->Request->isGet()) {
                Session::delete(Configure::read("SESSION_RETURN_URL"));
                Session::set(Configure::read("SESSION_RETURN_URL"), $_SERVER["REQUEST_URI"]);
            }
            Func::redirect('/login/');
            exit;
        }
    }

    protected function checkAcl() {
        if (!$this->Acl->check($this->Auth->user("role_id"), $this->controller . "/" .$this->action)) {
            Logger::warning("Forbidden Exception.");
            throw new ForbiddenException();
        }
    }

    protected function render($viewFile = null) {
        if (is_null($viewFile)) {
            Logger::warning("Not Found View :" . $viewFile);
            throw new NotFoundException();
        }
        $viewFile = TPL_DIR . DS . $viewFile;

        if (!is_readable($viewFile)) {
            Logger::warning("Not Found View :" . $viewFile);
            throw new NotFoundException();
        }

        extract($this->viewVars);
        ob_start();
        require_once($viewFile);
        unset($viewFile);
        echo ob_get_clean();
    }

    /*
     * プリファレンスの取得
     */
    protected function get_preference() {
        if (empty($this->_preference)) {
            $query = "SELECT category, value, keyname FROM s_preference WHERE delete_flag = '0' AND start_date < NOW() AND end_date > NOW() ";
            $preference = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, array());
            foreach ($preference as $line) {
                $this->_preference[$line["category"]][$line["value"]] = $line["keyname"];
            }
        }
        return $this->_preference;
    }

    /*
     * サービスステータスの取得
     */
    protected function get_service_status($statusFlag, $adminStatusFlag) {
        $this->get_preference();
        if ($adminStatusFlag === "1") {
            return $this->_preference["service_admin_status_flag"][$adminStatusFlag];
        }
        return $this->_preference["service_status_flag"][$statusFlag];
    }

    /*
     * アカウントステータスの取得
     */
    protected function get_account_status($statusFlag, $adminStatusFlag) {
        $this->get_preference();
        if ($adminStatusFlag === "1") {
            return $this->_preference["account_admin_status_flag"][$adminStatusFlag];
        }
        return $this->_preference["account_status_flag"][$statusFlag];
    }

    /*
     * ロックが使用可能かチェックする
     *
     * @param $name ロック名
     * @return true:使用可能／false:使用不可
     */
    protected function is_free_lock($name) {
        $query = "SELECT IS_FREE_LOCK('{$name}') AS a";
        $lock = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, array());
        $ret = false;
        if ($lock["a"] === "1") {
            $ret = true;
        }
        return $ret;
    }

    /*
     * ロックをかける
     *
     * @param $name ロック名
     * @param $timeout タイムアウト秒数
     * @return true:ロックできた／false:ロックできなかった
     */
    protected function get_lock($name, $timeout = 30) {
        $query = "SELECT GET_LOCK('{$name}', {$timeout}) AS a";
        $lock = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, array());
        $ret = false;
        if ($lock["a"] === "1") {
            $ret = true;
        }
        return $ret;
    }

    /*
     * ロックを解放する
     *
     * @param $name ロック名
     * @return true:ロック解放できた／false:ロック解放できなかった
     */
    protected function release_lock($name) {
        $query = "SELECT RELEASE_LOCK('{$name}') AS a";
        $lock = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $query, array());
        $ret = false;
        if ($lock["a"] === "1") {
            $ret = true;
        }
        return $ret;
    }

    /* 
     * 確定可能を連携するサービスを取得する
     *
     * @return array(0 => array('service_cd' => ***), 1 => .....)
     */
    protected function get_determinable_pass_service() {
        $sql = "SELECT service_cd FROM m_service WHERE determinable_send_flag = '1' AND delete_flag = '0'";
        return Database::getInstance()->dbExecFetchAll(Configure::read('DB_SLAVE'), $sql);
    }

    /*
     * OTORAKU 試聴時間取得
     */
    protected function get_listened_time($account_id, $from_month, $to_month) {
        $post_param = array(
            'account_id' => $account_id,
            'from'       => $from_month,
            'to'         => $to_month,
        );
        $listened_data = array();
        try {
            $api_res = $this->doSettlementApi($post_param, Configure::read('OTORAKU_LISTENED_TIME_API'));
            $preference = $this->get_preference();
            foreach($api_res['listened_time'] as $row) {
                $row_data = array();
                $row_data['total_view'] = '-';
                $row_data['plan_view'] = '定額プラン';
                $tmp_date = explode('-',$row['date_y_m']);
                $row_data['date_view'] = "{$tmp_date[0]}年{$tmp_date[1]}月";
                if (!empty($row['total_monthly'])) {
                    $row_data['total_view'] = preg_replace('/\A0/', '', preg_replace('/:/','時間',$row['total_monthly']) . '分');
                } else {
                    $row_data['total_view'] = '0時間00分';
                }
                foreach($row['days'] as $day) {
                    $day_data = array();
                    $tmp_day = explode('-', $day['date_m_d']);
                    $day_data['day_view'] = "{$tmp_day[0]}月{$tmp_day[1]}日";
                    if (!empty($day['total_daily'])) {
                        $day_data['total_view'] = preg_replace('/\A0/', '' ,date('H時間i分', strtotime($day['total_daily'])));
                        //$day_data['total_view'] = preg_replace('/:/','時間',$day['total_daily']) . '分';
                    } else {
                        $day_data['total_view'] = '0時間00分';
                    }
                    $row_data['days'][] = $day_data;
                }
                $listened_data[] = $row_data;
            }
        } catch (Exception $e) {
            $listened_data['error'] = "現在サーバーメンテナンス中です。時間を置いて、再度お試しください。";
        }
        return $listened_data;
    }

    /*
     * CURLで指定されたパラメータをAPIに渡す
     * @param  array  $params: APIに渡すパラメータの連想配列
     * @param  String $apiUrl: コールするAPIのURL文字列
     * @return array  $responce: 結果JSONをデコードした配列
     */
    protected function doSettlementApi($params, $apiUrl) {
        $ci = curl_init();
        $options = array(
            CURLOPT_URL            => $apiUrl,
            CURLOPT_HEADER         => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($params),
            CURLOPT_FAILONERROR    => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_SSL_VERIFYPEER => false
        );
        curl_setopt_array($ci, $options);
        $response = curl_exec($ci);

        //エラー判定
        if (curl_errno($ci) || $response === false) {
            Logger::err("API接続に失敗しました。URL:{$apiUrl}");
            curl_close($ci);
            throw new Exception();
        }
        curl_close($ci);

        //デコード
        $decResponse = json_decode($response, true);
        $error = json_last_error();
        if ($error !== JSON_ERROR_NONE) {
            Logger::err("JSONデコードに失敗しました。{$error}");
            throw new InternalErrorException();
        }

        return $decResponse;
    }

    /**
     * サービス付替え処理の履歴存在チェック
     * @param int serviceId : サービスID
     * @return boolean true:サービス付替え済み false:サービス付替えでない
     **/
    protected function isServiceChanged($serviceId) {
        $sql = "SELECT count(id) AS count FROM t_service_change_history WHERE t_unis_service_id = :service_id";
        $param = array();
        $param['service_id'] = $serviceId;
        Database::getInstance()->dbConnect(Configure::read('DB_MASTER'));
        $result = array();
        $result = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $sql, $param);
        if (empty($result) || $result['count'] < 1) {
            return false;
        }
        return true;
    }
}
