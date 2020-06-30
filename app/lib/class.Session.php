<?php

/**
 * Session操作クラス
 *
 * @created	2014-07-02
 * @author	 y-dobashi
 * @version	v1.0
 * @copyright  Copyright (c) 2014 USEN
 */
class Session {

    /**
     * コンストラクタ
     */
    function __construct() {
        
    }

    /**
     * sessionに値を設定する
     *
     * @param  $name キー
     * @param  $value 値
     * @return なし
     */
    public static function set($name, $value) {
        $_SESSION[$name] = $value;
    }

    /**
     * sessionから指定KEYの値を取得する
     *
     * @param $name キー
     * @return なし
     */
    public static function get($name) {
        $result = null;
        if (isset($_SESSION[$name])) {
            $result = $_SESSION[$name];
        }
        return $result;
    }

    /**
     * sessionから指定KEYの値を削除する
     *
     * @param  $name キー
     * @return なし
     */
    public static function delete($name) {
        if (isset($_SESSION[$name])) {
            unset($_SESSION[$name]);
        }
    }

    /**
     * セッションに登録されたデータを全て破棄する
     *
     * @param  
     * @return なし
     */
    public static function destroy() {
        $_SESSION = array();
        session_unset();
        session_destroy();
    }

    /**
     * 現在のセッションIDを新しく生成したものと置き換える
     *
     * @param $deleteOldSession 古いセッションを削除するかの真偽値
     * @return なし
     */
    public static function regenerate($deleteOldSession = true) {
        session_regenerate_id($deleteOldSession);
    }

}
