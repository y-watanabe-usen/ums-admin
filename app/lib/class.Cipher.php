<?php
define('RSA_DIR', ETC_DIR . DS . 'rsa');

class Cipher {

    private static $rsaPublicKey = '';
    private static $rsaPrivateKey = '';

    /*
     * パスワードハッシュの生成
     * 
     * @param $loginId ログインID
     * @param $password パスワード
     * @return パスワードハッシュ
     */

    public static function getPasswordHash($password) {
        $salt = pack('H*', Configure::read('PASSWORD_SALT'));
        $hash = '';
        for ($i = 0; $i < Configure::read('PASSWORD_STRETCH_COUNT'); $i++) {
            $hash = hash('sha256', $hash . $password . $salt); //ストレッチング
        }
        return $hash;
    }

    /*
     * 自動ログインクッキー用ハッシュの生成
     * 
     * @param $accountId アカウントID
     * @return 自動ログインクッキー用ハッシュ
     */

    public static function getCookiePassportHash($accountId = '') {
        return hash('sha256', Configure::read('PASSPORT_SALT') . $accountId . time());
    }

    /*
     * トークンの生成
     * 
     * @return トークン
     */

    public static function getToken() {
        return Func::getRandomString(mt_rand(40, 60));
    }

    /*
     * URLリダイレクトキーの生成
     *
     * @return リダイレクトキー
     */
    public static function getRedirectKey() {
        return Func::getRandomString(mt_rand(80, 100));
    }

    /*
     * 個人情報ハッシュの生成
     * 
     * @param $text ハッシュする文字列
     * @return ハッシュされた文字列
     */

    public static function getPersonalHash($text = '') {
        if (empty($text)) {
            return '';
        }
        return hash('sha256', Configure::read('PERSONAL_SALT') . $text);
    }

    /*
     * RSA暗号化
     * 
     * @param $text 暗号化する文字列
     * @return 暗号化された文字列
     */
    public static function rsaEncrypt($text = '') {
        if (empty($text)) {
            return '';
        }
        if (empty(self::$rsaPublicKey)) {
            if (!file_exists(RSA_DIR . DS . 'public.pem')) {
                return '';
            }
            self::$rsaPublicKey = openssl_pkey_get_public(file_get_contents(RSA_DIR . DS . 'public.pem'));
        }
        $encryptedText = '';
        if (!openssl_public_encrypt($text, $encryptedText, self::$rsaPublicKey)) {
            return '';
        }
        return base64_encode($encryptedText);
    }

    /*
     * RSA復号化
     * 
     * @param $encryptedText 復号化する文字列
     * @return 復号化された文字列
     */
    public static function rsaDecrypt($encryptedText = '') {
        if (empty($encryptedText)) {
            return '';
        }
        if (empty(self::$rsaPrivateKey)) {
            if (!file_exists(RSA_DIR . DS . 'private.pem')) {
                return '';
            }
            self::$rsaPrivateKey = openssl_pkey_get_private(file_get_contents(RSA_DIR . DS . 'private.pem'));
        }
        $encryptedText = base64_decode($encryptedText);
        $decryptedText = '';
        if (!openssl_private_decrypt($encryptedText, $decryptedText, self::$rsaPrivateKey)) {
            return '';
        }
        return $decryptedText;
    }

    /*
     * AES暗号化
     *
     * @param $text 暗号化する文字列
     * @param $iv 復号化するIV文字列
     * @return 暗号化された文字列
     */
    public static function aesEncrypt($text = '', $iv = '') {
        // 空文字列・IVチェック
        if (empty($text) || empty($iv)) {
            return '';
        }
        $enc = openssl_encrypt(
            $text,
            Configure::read('APP_IDENTIFIER_CRYPT_METHOD'),
            Configure::read('APP_IDENTIFIER_AES_KEY'),
            false,
            $iv
        );
        return base64_encode($enc);

    }

    /*
     * AES復号化
     *
     * @param $encryptedText 復号化する文字列
     * @param $iv 復号化するIV文字列
     * @return 復号化された文字列
     */
    public static function aesDecrypt($encryptedText = '', $iv = '') {
        // 空文字列・IVチェック
        if (empty($encryptedText) || empty($iv)) {
            return '';
        }
        $dec = openssl_decrypt(
            base64_decode($encryptedText),
            Configure::read('APP_IDENTIFIER_CRYPT_METHOD'),
            Configure::read('APP_IDENTIFIER_AES_KEY'), 
            false, 
            $iv
        );
        return $dec;
    }
}
