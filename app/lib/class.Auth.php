<?php
/**
 * Authクラス
 *
 * @created    2014-07-02
 * @author     y-dobashi
 * @version	v1.0
 * @copyright  Copyright (c) 2014 USEN
 */
class Auth {

    const LOGIN_OK = '0';
    const LOGIN_NG = '1';
    const TIMEOUT = '2';
    
    protected static $_user = array();

    /**
     * コンストラクタ
     */
    function __construct() {
        
    }

    /**
     * ログイン処理（セッションの作成）
     *
     * @param $accountId アカウントID
     * @param $loginId ログインID
     * @return なし
     */
    private function _login($mAccount = null) {
        if (is_null($mAccount)) {
            return;
        }
        Session::regenerate();
        Session::set(Configure::read('SESSION_IS_LOGIN'), true);
        Session::set(Configure::read('SESSION_ACCOUNT'), $mAccount);
        Session::set(Configure::read('SESSION_EXPIRED'), time() + Configure::read('MAX_LOGIN_TIME'));
        
        self::$_user = $mAccount;
    }

    public static function user($key = null) {
        if (empty(self::$_user)) {
            self::$_user = Session::get(Configure::read('SESSION_ACCOUNT'));
        }
        if ($key === null) {
            return self::$_user;
        }
        return self::$_user[$key];
    }

    /**
     * ログイン処理（ログインID、パスワードによる認証）
     *
     * @param $loginId   ログインID
     * @param $password パスワード
     * @return ログイン成功、失敗
     */
    public function login($loginId, $password) {

        $result = $this->getDataByLoginId($loginId, $password);
        if (!empty($result) && isset($result["id"]) && $result["id"] != "") {
            //セッションにログイン情報を格納
            $this->_login($result);
            return self::LOGIN_OK;
        } else {
            return self::LOGIN_NG;
        }
    }

    /*
     * ログアウト処理
     */
    public function logout() {
        Session::destroy();
        session_start();
//        Session::regenerate();
    }

    /**
     * Session情報を元に認証チェックする
     *
     * @return ログインOK、NG、タイムアウト
     */
    public function check() {
        if (is_null(Session::get(Configure::read('SESSION_IS_LOGIN'))) || is_null(Session::get(Configure::read('SESSION_ACCOUNT'))) || is_null(Session::get(Configure::read('SESSION_EXPIRED')))) {
            return self::LOGIN_NG;
        }

        // セッションからログイン情報を取得
        $isLogin = Session::get(Configure::read('SESSION_IS_LOGIN'));
        $mAccount = Session::get(Configure::read('SESSION_ACCOUNT'));
        $expired = Session::get(Configure::read('SESSION_EXPIRED'));

        // ログイン情報をチェックする
        if (!isset($isLogin) || $isLogin !== true || !isset($mAccount) || !isset($mAccount['id'])) {
            return self::LOGIN_NG;
        }

        // ログイン時に設定した期限を過ぎていないか確認
        if ($expired < time()) {
            return self::TIMEOUT;
        }

        // セッション保持のアカウント更新
        $result = $this->getDataByAccountId($mAccount['id']);
        if (empty($result)) {
            return self::LOGIN_NG;
        }
        Session::set(Configure::read('SESSION_ACCOUNT'), $result);

        // セッション有効期限の更新
        Session::set(Configure::read('SESSION_EXPIRED'), time() + Configure::read('MAX_LOGIN_TIME'));

        return self::LOGIN_OK;
    }

    private function getDataByLoginId($loginId = null, $password = null) {

        $query = "SELECT "
               . "  mu.id "
               . ", mu.code AS u_code "
               . ", mu.last_name "
               . ", mu.first_name "
               . ", GROUP_CONCAT(tr.role_id order by tr.role_id) AS role_id "
               . ", mo.code AS o_code "
               . ", mo.organization_name "
               . "FROM m_user mu "
               . "  INNER JOIN t_role tr ON (mu.id = tr.user_id) "
               . "  LEFT JOIN m_organization mo ON (mu.organization_id = mo.id AND mo.start_date < NOW() AND mo.end_date > NOW()) "
               . "WHERE mu.code = :login_id AND mu.password = :password "
               . "  AND mu.start_date < NOW() AND mu.end_date > NOW() ";

        $password = hash('sha256', $password);
        $param = array('login_id' => $loginId, 'password' => $password);
        return Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
    }

    private function getDataByAccountId($accountId = null) {

        $query = "SELECT "
               . "  mu.id "
               . ", mu.code AS u_code "
               . ", mu.last_name "
               . ", mu.first_name "
               . ", GROUP_CONCAT(tr.role_id order by tr.role_id) AS role_id "
               . ", mo.code AS o_code "
               . ", mo.organization_name "
               . "FROM m_user mu "
               . "  INNER JOIN t_role tr ON (mu.id = tr.user_id) "
               . "  LEFT JOIN m_organization mo ON (mu.organization_id = mo.id AND mo.start_date < NOW() AND mo.end_date > NOW()) "
               . "WHERE mu.id = :accountId "
               . "  AND mu.start_date < NOW() AND mu.end_date > NOW() ";

        $param = array('accountId' => $accountId);
        return Database::getInstance()->dbExecFetch(Configure::read('DB_ADMIN_SLAVE'), $query, $param);
    }

}
