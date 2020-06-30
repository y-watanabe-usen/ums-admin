<?php

/**
 * Cookie操作クラス
 *
 * @created	2014-07-02
 * @author	 y-dobashi
 * @version	v1.0
 * @copyright  Copyright (c) 2014 USEN
 */
class Cookie {

    /**
     * コンストラクタ
     */
    function __construct() {
        
    }

    /**
     * Cookieに値を設定する
     *
     * @param  $name クッキーの名前
     * @param  $value クッキーの値
     * @param  $expire クッキーの有効期限(Unixタイムスタンプ)
     * @param  $path クッキーを有効としたいパス
     * @param  $domain クッキーが有効なドメイン
     * @param  $secure セキュアな HTTPS 接続の場合にのみクッキーが送信されるようにします
     * @param  $httpOnly HTTP を通してのみクッキーにアクセスできるようになります
     * @return なし
     */
    public static function set($name, $value, $expire = 0, $path = '/', $domain = '', $secure = false, $httpOnly = true) {
        setcookie($name, $value, $expire, $path, $domain, $secure, $httpOnly);
    }

    /**
     * Cookieから指定KEYの値を取得する
     *
     * @param  $name クッキーの名前
     * @return 値
     */
    public static function get($name) {
        $result = null;
        if (isset($_COOKIE[$name])) {
            $result = $_COOKIE[$name];
        }
        return $result;
    }

    /**
     * Cookieから指定KEYの値を削除する
     *
     * @param  $name クッキーの名前
     * @return なし
     */
    public static function delete($name, $path = '/', $domain = '', $secure = false, $httpOnly = true) {
        if (isset($_COOKIE[$name])) {
            setcookie($name, "", time() - 3600, $path, $domain, $secure, $httpOnly);
        }
    }

}
