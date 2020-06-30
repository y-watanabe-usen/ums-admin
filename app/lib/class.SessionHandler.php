<?php

/**
 * セッション管理関数の置き換え
 *
 * @created    2014-07-02
 * @author     y-dobashi
 * @version    v1.0
 * @copyright  Copyright (c) 2014 USEN
 */

class SessionHandler {

    private $sessionCacheData = "";

    /**
     * コンストラクタ
     */
    function __construct() {
    }

    function open($path, $name) {
        return true;
    }

    function close() {
        return true;
    }

    function read($id) {

        $result = '';
        $query = "SELECT session_data FROM t_session WHERE session_id = :session_id AND delete_flag = '0'";

        $param = array('session_id' => $id);

        $resource = Database::getInstance()->dbExecFetchAll(Configure::read('DB_MASTER'), $query, $param);
        if (!empty($resource[0])) {
            $result = $resource[0]['session_data'];
        }

        $this->sessionCacheData = $result;
        return $result;
    }

    function write($id, $data) {
        $result = false;

        if ($this->sessionCacheData == $data) {
            // session情報がそのままのときは時間だけ更新
            $query = "UPDATE t_session SET updated = NOW() WHERE session_id = :session_id AND delete_flag = '0'";

            $param = array('session_id' => $id);
            Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);

            $result = true;
        } else {
            // sessionデータ作成
            $query = "INSERT INTO t_session(session_id, session_data, created_by, created, updated_by, updated) "
                   . "VALUES (:session_id, :session_data, 'USER', NOW(), 'USER', NOW()) "
                   . "ON DUPLICATE KEY UPDATE session_data = :session_data, updated = NOW() ";

            $param = array('session_id' => $id, 'session_data' => $data);
            Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);

            $this->sessionCacheData = $data;
            $result = true;
        }
        return $result;
    }

    function destroy($id) {

        $query = "DELETE LOW_PRIORITY FROM t_session WHERE session_id = :session_id";
        
        $param = array('session_id' => $id);
        Database::getInstance()->dbExecute(Configure::read('DB_MASTER'), $query, $param);

        $this->sessionCacheData = "";

        return true;
    }

    function gc($maxlife) {
        return true;
    }

}
