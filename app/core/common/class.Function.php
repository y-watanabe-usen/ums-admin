<?php

class Func {

    /**
     * システム日付を取得する。('Y-m-d H:i:s')
     * @return システム設定された日付
     */
    public static function nowdate() {
        return date('Y-m-d H:i:s');
    }

    /**
     * システム日付を取得する。('YmdHis')
     * @return システム設定された日付
     */
    public static function ymdhis() {
        return date('YmdHis');
    }

    /**
     * 全角/半角スペース除去
     *
     * @param $text 対象文字列
     * @return 全角/半角スペース除去後の対象文字列
     */
    public static function trim($text) {
        $text = preg_replace('/^[ 　]+/u', '', $text);
        $text = preg_replace('/[ 　]+$/u', '', $text);
        return $text;
    }

    /**
     * 指定のURLにリダイレクト
     *
     * @param $url URL
     * @return なし
     */
    public static function redirect($url) {
        header(sprintf("Location: %s", $url));
    }

    /**
     * 文字列をエスケープして返す
     *
     * @param $text 対象文字列
     * @return エスケープ後の文字列
     */
    public static function h($text, $double = true) {
        return htmlspecialchars($text, ENT_QUOTES, Configure::read('DEFAULT_CHARSET'), $double);
    }

    /**
     * ！！！デバッグ用！！！
     * 変数の中身を見やすく表示する
     * ローカル環境か開発環境でしか動かない
     *
     * @param $var 対象変数
     * @return なし
     */
    public static function pr($var) {
        if (Configure::read('ENVIROMENT') !== 'prod' && Configure::read('ENVIROMENT') !== 'sta') {
            $template = php_sapi_name() !== 'cli' ? '<pre>%s</pre>' : "\n%s\n";
            printf($template, print_r($var, true));
        }
    }

    /**
     * ランダム文字列生成
     *
     * @param  $length  文字列長 default:8 (1-256)
     * @param  $mode    モード   default:'alnum'
     * @return ランダム文字列
     */
    function getRandomString($length = 8, $mode = 'alnum') {
        if ($length < 1 || $length > 256) {
            return false;
        }
        $smallAlphabet = 'abcdefghijklmnopqrstuvwxyz';
        $largeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $numeric = '0123456789';

        switch ($mode) {

            // 小文字英字
            case 'small':
                $chars = $smallAlphabet;
                break;

            // 大文字英字
            case 'large':
                $chars = $largeAlphabet;
                break;

            // 小文字英数字
            case 'smallalnum':
                $chars = $smallAlphabet . $numeric;
                break;

            // 大文字英数字
            case 'largealnum':
                $chars = $largeAlphabet . $numeric;
                break;

            // 数字
            case 'num':
                $chars = $numeric;
                break;

            // 大小文字英字
            case 'alphabet':
                $chars = $smallAlphabet . $largeAlphabet;
                break;

            // 大小文字英数字
            case 'alnum':
            default:
                $chars = $smallAlphabet . $largeAlphabet . $numeric;
                break;
        }

        $charsLength = strlen($chars);

        $ret = '';
        for ($i = 0; $i < $length; $i++) {
            $num = mt_rand(0, $charsLength - 1);
            $ret .= $chars{$num};
        }
        return $ret;
    }

    /**
     * 初期パスワード生成（半角数字(0,1除く)、半角英小文字(i,o,l除く)で8桁ランダム生成）
     *
     * @param  $length  文字列長 default:8 (1-256)
     * @return 初期パスワード
     */
    public static function getInitPassword($length = 8) {
        if ($length < 1 || $length > 256) {
            return false;
        }
        $smallAlphabet = 'abcdefghjkmnpqrstuvwxyz';
        $largeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        $numeric = '23456789';
        $chars = $smallAlphabet . $largeAlphabet . $numeric;

        $charsLength = strlen($chars);

        $ret = '';
        for ($i = 0; $i < $length; $i++) {
            $num = mt_rand(0, $charsLength - 1);
            $ret .= $chars{$num};
        }
        return $ret;
    }

}
