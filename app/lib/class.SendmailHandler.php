<?php
require_once(LIB_DIR . DS . 'class.Sendmail.php');

/**
 * メール送信機能共通化
 *
 * @created    2014-08-12
 * @author     k-ootsuki
 * @version    v1.0
 * @copyright  Copyright (c) 2014 USEN
 */

class SendmailHandler
{

    private $to = array();
    private $cc = array();
    private $bcc = array();
    private $template;
    private $subject;
    private $body;
    private $parameter = array();

    /**
     * コンストラクタ
     */
    function __construct() {
        
    }

    /**
     * メール送信
     */
    function send()
    {

        //メール送信クラス
        $sendmail = new Sendmail();

        //メールアドレスの設定確認
        if (!is_array($this->to) || !is_array($this->cc) || !is_array($this->bcc)) {
            Logger::warning('mailaddres no array');
            return false;
        }

        //メールテンプレート取得
        if (isset($this->template)) {
            $currentDateTime = date('Y-m-d H:i:s', time());

            $sql = "SELECT "
                 . "  id, template_name, mail_type, subject, body "
                 . "FROM "
                 . "  m_mail_template "
                 . "WHERE "
                 . "  template_name = :template_name "
                 . "  AND start_date <= :now "
                 . "  AND end_date >= :now "
                 . "  AND delete_flag = 0 ";

            $param = array();
            $param['template_name'] = $this->template;
            $param['now'] = $currentDateTime;

            $mMailTemplateResult = Database::getInstance()->dbExecFetch(Configure::read('DB_MASTER'), $sql, $param);
            if (empty($mMailTemplateResult)) {
                Logger::warning('mail template error');
                return false;
            }
            // タイトルは指定なければテンプレートのものを使用する。
            if (!isset($this->subject)) {
                $this->subject = $mMailTemplateResult['subject'];
            }
            $this->body = $mMailTemplateResult['body'];
            foreach ($this->parameter as $key => $value) {
                $this->subject = str_replace("%%%".$key."%%%", $value, $this->subject);
                $this->body = str_replace("%%%".$key."%%%", $value, $this->body);
            }
            // ドメインを置換
            $this->body = str_replace("%%%domain%%%", Configure::read('DOMAIN'), $this->body);

        } else {
            Logger::warning('mail template Unknown');
            return false;
        }

        //送信処理
        $send = array();
        $send["to_address"]    = $this->to;
        $send["cc_address"]    = $this->cc;
        $send["bcc_address"]   = $this->bcc;
        $send["subject"]       = preg_replace('/%%%.+%%%/', '', $this->subject);
        if ($mMailTemplateResult['mail_type'] === 'multipart/alternative') {
            list($body_text, $body_html) = explode("%%%delimiter%%%", $this->body);
            $send["body"] = preg_replace('/%%%.+%%%/', '', $body_text);
            $send["body_html"] = preg_replace('/%%%.+%%%/', '', $body_html);

            if(!$sendmail->mult($send["to_address"], $send["cc_address"], $send["bcc_address"], $send["subject"], $send["body"], $send["body_html"])) {
                Logger::warning('multipart mail sent error');
                return false;
            }

        } else {
            $send["body"]      = preg_replace('/%%%.+%%%/', '', $this->body);

            if (!$sendmail->text($send["to_address"], $send["cc_address"], $send["bcc_address"], $send["subject"], $send["body"])) {
                Logger::warning('text mail sent error');
                return false;
            }

        }

        return true;

    }

    /**
     * TO宛先セット
     * @param array $to TO宛先
     * @return void
     */
    public function setTo($to) {
        $this->to = $to;
    }

    /**
     * CC宛先セット
     * @param array $cc CC宛先
     * @return void
     */
    public function setCc($cc) {
        $this->cc = $cc;
    }

    /**
     * BCC宛先セット
     * @param array $bcc BCC宛先
     * @return void
     */
    public function setBcc($bcc) {
        $this->bcc = $bcc;
    }

    /**
     * テンプレートセット
     * @param string $template テンプレート名
     * @return void
     */
    public function setTemplate($template) {
        $this->template = $template;
    }

    /**
     * パラメータセット
     * @param string $name パラメータ名
     * @param string $value 値
     * @return void
     */
    public function setParameter($name, $value) {
        $this->parameter[$name] = $value;
    }

    /**
     * 件名セット
     * @param string $subject 件名
     * @return void
     */
    public function setSubject($subject) {
        $this->subject = $subject;
    }

    /**
     * メール本文セット
     * @param string $body メール本文
     * @return void
     * @description メールテンプレを使わないときに使用する
     */
    public function setBody($body) {
        $this->body = $body;
    }

    /**
     * リセット
     * @param -
     * @return void
     */
    public function reset() {
        $this->to = array();
        $this->cc = array();
        $this->bcc = array();
        $this->template = null;
        $this->subject = null;
        $this->body = null;
        $this->createdBy = "USER";
        $this->parameter = array();
    }

}