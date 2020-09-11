<?php

/**
 * バリデーションクラス
 *
 * @created    2014-07-02
 * @author     y-dobashi
 * @version    v1.0
 * @copyright  Copyright (c) 2014 USEN
 */
class Validation {
    /**
     * 【入力チェック】半角数字
     */
    public static function numeric($check) {
        if (is_string($check) && preg_match('/\A[0-9]+\z/u', $check)) {
            return true;
        }
        return false;
    }

    /**
     * 【入力チェック】半角数字ハイフン
     */
    public static function numericHyphen($check) {
        if (is_string($check) && preg_match('/\A[0-9\-]+\z/u', $check)) {
            return true;
        }
        return false;
    }

    /**
     * 【入力チェック】半角数字スラッシュ
     */
    public static function numericSlash($check) {
        if (is_string($check) && preg_match('/\A[0-9\/]+\z/u', $check)) {
            return true;
        }
        return false;
    }

    /**
     * 【入力チェック】半角数字とプラスアルファ
     */
    public static function numericAndMore($check, $more) {
        $p = '/\A[0-9\\' . $more . ']+\z/u';
        if (is_string($check) && preg_match($p, $check)) {
            return true;
        }
        return false;
    }

    /**
     * 【入力チェック】半角英数字
     */
    public static function halfAlphaNumeric($check) {
        if (is_string($check) && preg_match('/\A[a-z0-9]+\z/ui', $check)) {
            return true;
        }
        return false;
    }

    /**
     * 【入力チェック】半角英数字記号
     */
    public static function halfAlphaNumericSymbol($check) {
        if (is_string($check) && preg_match('/\A[a-z0-9!-~]+\z/ui', $check)) {
            return true;
        }
        return false;
    }

    /**
     * 【入力チェック】最少文字数
     */
    public static function minLength($check, $min) {
        return mb_strlen($check, Configure::read('DEFAULT_CHARSET')) >= $min;
    }

    /**
     * 【入力チェック】最大文字数
     */
    public static function maxLength($check, $max) {
        return mb_strlen($check, Configure::read('DEFAULT_CHARSET')) <= $max;
    }

    /**
     * 【入力チェック】指定文字数
     */
    public static function between($check, $min, $max) {
        $length = mb_strlen($check, Configure::read('DEFAULT_CHARSET'));
        return ($length >= $min && $length <= $max);
    }

    /**
     * 【入力チェック】POSIX（改行やタブが入ってないか）
     */
    public static function isNonePosix($check) {
        if (is_string($check) && preg_match('/\A[[:^cntrl:]]{1,30}\z/u', $check)) {
            return true;
        }
        return false;
    }

    /**
     * 【入力チェック】メールアドレスチェック（メールアドレス形式）
     */
    public static function mail($check) {
        // 128文字以内
        if (strlen($check) > 128) {
            return false;
        } elseif (!preg_match('/^(.+)@([^@]+)$/', $check, $matches)) {
            return false;
        } else {
            $local = $matches[1];
            $host = $matches[2];
            // ローカル側チェック
            // 64文字以内
            if (!preg_match('/^[a-z0-9\x20-\x7e]{1,64}$/i', $local)) {
                return false; // ドット始端終端はエラー
            } elseif (preg_match('/^(\.(.*)|(.*)\.)$/', $local)) {
                return false;
            } else {
                if (!preg_match('/^\x22(.*)\x22$/i', $local)) {
                    // dot_atm形式
                    if (!preg_match('/^[a-z0-9\x21\x23-\x27\x2a-\x2f\x3d\x3f\x5e-\x60\x7b-\x7e]+$/i', $local)) {
                        return false;
                        // ドットが連続はエラー
                    } elseif (preg_match('/(\.){2,}/', $local)) {
                        return false;
                    }
                } else {
                    // quoted-pair形式
                    if (!preg_match('/^[a-z0-9\x20\-\x7e]+$/i', $local)) {
                        return false;
                    }
                }
            }
            $hostPattern = '/^([a-z0-9_]([a-z0-9_]|\-)*\.)+[a-z]{2,}$/i';
            if (!preg_match($hostPattern, $host)) {
                return false;
                // ドメインと同じはエラー
            } elseif ($host === Configure::read('DOMAIN')) {
            //} elseif (preg_match('/^' . Configure::read('DOMAIN') . '$/i', $host)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 【入力チェック(NeOS同仕様)】メールアドレスチェック（メールアドレス形式）
     */
    public static function mailNeos($check) {
        //フォームでのチェック
        if (!preg_match('/^[\w+\-.]+@[\w+\-.]+\.\w{2,}$/', $check)) {
            return false;
        //サーバーでのチェック
        } else if (!preg_match('/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/', $check)) {
            return false;
        }
        return true;
    }

    /**
     * 【入力チェック】日時の妥当性チェック
     *
     * @param int $hour 時
     * @param int $minute 分
     * @param int $second 秒
     * @param int $month 月
     * @param int $day 日
     * @param int $year 年
     * @return bool
     */
    public static function checkDateTime($hour, $minute, $second, $month, $day, $year) {
        if (!self::numeric($hour) || !self::numeric($minute) || !self::numeric($second) || !self::numeric($month) || !self::numeric($day) || !self::numeric($year)) {
            return false;
        }
        if ($hour < 0 || $hour > 23) {
            return false;
        }
        if ($minute < 0 || $minute > 59) {
            return false;
        }
        if ($second < 0 || $second > 59) {
            return false;
        }
        if (!checkdate($month, $day, $year)) {
            return false;
        }
        return true;
    }

    /**
     * 【入力チェック】yyyy/mm/ddの妥当性チェック
     *
     * @param string $ymd
     * @param string $delimiter
     * @return bool
     */
    public static function checkYmd($ymd, $delimiter = "/") {
        if (!self::numericAndMore($ymd, $delimiter)) {
            return false;
        }
        $parse = explode($delimiter, $ymd);
        if (count($parse) !== 3) {
            return false;
        }
        if (!self::checkDateTime("0", "0" ,"0", $parse[1], $parse[2], $parse[0])) {
            return false;
        }
        return true;
    }
}
