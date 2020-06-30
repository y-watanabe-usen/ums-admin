<?php

/**
 * リクエスト取得クラス
 *
 * @created    2014-07-02
 * @author     y-dobashi
 * @version    v1.0
 * @copyright  Copyright (c) 2014 USEN
 */
class Request {

    // POST
    private $_postParam;
    // GET
    private $_queryParam;

    /**
     * コンストラクタ
     *
     * @since  2011-11-07
     * @author Imaeda
     */
    public function __construct() {
        $this->_setPost();
        $this->_setQuery();
    }

    /**
     * POST値をセットする
     *
     * @param  なし
     * @return なし
     */
    private function _setPost() {
        $data = array();
        foreach ($_POST as $key => $value) {
            if (!is_array($value)) {
                $data[$key] = rtrim($value);
            } else {
                $data[$key] = $value;
            }
        }
        $this->_postParam = $data;
    }

    /**
     * POSTを取得する
     *
     * @param  なし
     * @return array POST
     */
    public function getPost() {
        return $this->_postParam;
    }

    /**
     * GET値をセットする
     *
     * @param  なし
     * @return なし
     */
    private function _setQuery() {
        $data = array();
        foreach ($_GET as $key => $value) {
            if (!is_array($value)) {
                $data[$key] = rtrim($value);
            } else {
                $data[$key] = $value;
            }
        }
        $this->_queryParam = $data;
    }

    /**
     * GETを取得する
     *
     * @param  なし
     * @return array GET
     */
    public function getQuery() {
        return $this->_queryParam;
    }

    /**
     * Ajaxによるリクエストかを返す
     *
     * @param  なし
     * @return bool
     */
    public function isAjax() {
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            return true;
        }
        return false;
    }

    /**
     * GETリクエストかを返す
     *
     * @param  なし
     * @return bool
     */
    public function isGet() {
        return $_SERVER["REQUEST_METHOD"] == "GET" ? true :false;
    }

    /**
     * POSTによるリクエストかを返す
     *
     * @param  なし
     * @return bool
     */
    public function isPost() {
        return $_SERVER["REQUEST_METHOD"] == "POST" ? true :false;
    }

}
