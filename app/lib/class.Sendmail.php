<?php
// Pear::Mailライブラリの読み込み
require_once("/usr/share/pear/Mail.php");


/**
 * メール送信クラス
 *
 * @created    2014-08-04
 * @author     s-suzuki
 * @version    v1.0
 * @copyright  Copyright (c) 2014 USEN
 *
 *
 * [ USAGE ]
 *   Sendmail::text(array("to宛先"), array("cc宛先"), array("bcc宛先"), "件名", "本文");
 *   Sendmail::mult(array("to宛先"), array("cc宛先"), array("bcc宛先"), "件名", "テキスト本文", "html本文");
 *
 */
class SendMail {

    private static $instance = null;
    private $_smtp = null;

    const MAIL_TYPE_TEXT = 0;
    const MAIL_TYPE_MULT = 1;

    /**
     * コンストラクタ
     *
     * @param  なし
     * @return なし
     */
     function __construct() {
        $params = array(
            "host" => Configure::read("MAIL_HOST"),
            "port" => 25,
            "auth" => false
        );
        mb_language("Japanese");
        mb_internal_encoding("UTF-8");

        $this->_smtp = Mail::factory("smtp", $params);
    }

    /**
     * インスタンスを取得する(初期化されていなければ初期化処理を行う)
     *
     * @param  なし
     * @return $instance: このクラスのインスタンス
     */
    public static function getInstance() {
        if (empty(self::$instance)) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    /**
     * メールを送信する
     *
     * @param  $mail メールアドレスの配列
     * @param  $headers メールのヘッダー
     * @param  $contents メールの本文
     * @return bool
     */
    private function _send($mail, $headers, $contents) {
        $ret = $this->_smtp->send($mail, $headers, $contents);
        if ($ret !== true) {
            Logger::info($ret);
            Logger::err("sendmail error.");
            return false;
        }
        return true;
    }

    /**
     * テキストメール送信用のヘッダーを生成し、メールを送信する
     *
     * @param  $to TO宛先の配列
     * @param  $cc CC宛先の配列
     * @param  $bcc BCC宛先の配列
     * @param  $subject 件名
     * @param  $body 本文
     * @return bool
     */
    public static function text($to, $cc = array(), $bcc = array(), $subject = '', $body = '') {
        $instance = self::getInstance();

        $headers = array(
            "From" => "\"" . mb_encode_mimeheader(Configure::read("MAIL_FROM_NAME"), "ISO-2022-JP-MS")."\"<".Configure::read("MAIL_FROM").">",
            "To" => implode(",", $to),
            "Cc" => implode(",", $cc),
            "Bcc" => implode(",", $bcc),
            "Subject" => mb_encode_mimeheader($subject, "ISO-2022-JP-MS"),
            "MIME-Version" => "1.0",
            "Content-type" => "text/plain; charset=ISO-2022-JP",
            "Content-transfer-encoding" => "base64"
        );

        $contents = chunk_split(base64_encode(mb_convert_encoding($body, "ISO-2022-JP-MS")), 76, "\n");

        return $instance->_send(array_merge($to, $cc, $bcc), $headers, $contents);
    }

    /**
     * マルチパートメール送信用のヘッダーを生成し、メールを送信する
     *
     * @param  $to TO宛先の配列
     * @param  $cc CC宛先の配列
     * @param  $bcc BCC宛先の配列
     * @param  $subject 件名
     * @param  $text_body テキスト用の本文
     * @param  $html_body html用の本文
     * @return bool
     */
    public static function mult($to, $cc = array(), $bcc = array(), $subject = '', $text_body = '', $html_body = '') {
        $instance = self::getInstance();

        $boundary = Func::getRandomString(32);
        $headers = array(
            "From" => "\"" . mb_encode_mimeheader(Configure::read("MAIL_FROM_NAME"), "ISO-2022-JP-MS")."\"<".Configure::read("MAIL_FROM").">",
            "To" => implode(",", $to),
            "Cc" => implode(",", $cc),
            "Bcc" => implode(",", $bcc),
            "Subject" => mb_encode_mimeheader($subject, 'ISO-2022-JP-MS'),
            "MIME-Version" => "1.0",
            "Content-type" => "multipart/alternative; boundary=\"${boundary}\"",
            "Content-transfer-encoding" => "7bit"
        );

        $contents = "--${boundary}\n"
                  . "Content-type: text/plain; charset=ISO-2022-JP\n"
                  . "Content-transfer-encoding: base64\n"
                  . "\n"
                  . chunk_split(base64_encode(mb_convert_encoding($text_body, 'ISO-2022-JP-MS')), 76, "\n")
                  . "--${boundary}\n"
                  . "Content-type: text/html; charset=ISO-2022-JP\n"
                  . "Content-transfer-encoding: base64\n"
                  . "\n"
                  . chunk_split(base64_encode(mb_convert_encoding($html_body, 'ISO-2022-JP-MS')), 76, "\n")
                  . "--${boundary}--\n";

        return $instance->_send(array_merge($to, $cc, $bcc), $headers, $contents);
    }
}
