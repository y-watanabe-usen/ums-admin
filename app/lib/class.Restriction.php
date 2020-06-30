<?php

class Restriction {

    /**
     * IPアドレスをチェックする
     *
     * @param string IPアドレス
     * @return boolean
     */
    public static function isRestriction($ip = null) {
        $config = Configure::read('RESTRICTION');
        if ($config['status'] != 0) {
            return false;
        }
        if (empty($ip)) {
            $ip = @$_SERVER['REMOTE_ADDR'];
        }
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return true;
        }
        // 設定ファイルからIPアドレスリストを取得
        $checkList = $config['list'];
        if (!is_array($checkList) && count($checkList) < 0) {
            return true;
        }

        // IPアドレスチェック
        foreach ($checkList as $id => $row) {
            $checkIp = null;
            $checkNetmask = null;
            list($checkIp, $checkNetmask) = explode('/', $row);
            if (!isset($checkIp)) {
                break;
            }
            if (!isset($checkNetmask)) {
                $checkNetmask = '32';
            }
            $checkIpNetMask =  self::getNetmask($checkNetmask);
            $checkNetaddr = ip2long(self::getNetaddr($checkIp, $checkIpNetMask));
            $checkBroadcast = ip2long(self::getBroadcast($checkIp, $checkIpNetMask));

            $targetIp = ip2long($ip);
            if ($targetIp >= $checkNetaddr && $targetIp <= $checkBroadcast) {
                return false;
            }
        }
        return true;
    }

    /**
     * マスク長(数値)からネットマスク(IP型)を取得する
     *
     * @param  $mask    0～32
     * @return $netmask netmask(ip string)
     */
     public static function getNetmask($mask) {
         $binary  = array(128, 64, 32, 16, 8, 4, 2, 1);
         $netmask = array(0, 0, 0, 0);
         $i = 0; $j = 0; $c = 0;
         // マスク長分総当り処理
         for ($i=0; $i<32; $i++, $j++) {
             if ($j == 8) {
                 $j = 0;
                 $c++;
             }
             if ($i < $mask) {
                 $netmask[$c] += $binary[$j];
             } else {
                 $netmask[$c] += 0;
             }
         }
         // 処理結果を文字列として返す
         return sprintf("%s.%s.%s.%s", $netmask[0], $netmask[1], $netmask[2], $netmask[3]);
     }

    /**
     * IP/ネットマスクからネットアドレスを取得する
     *
     * @param  $ip      IP
     * @param  $netmask netmask(ip string)
     * @return ネットアドレス(ip string)
     */
    public static function getNetaddr($ip, $netmask) {
        return long2ip(ip2long($ip) & ip2long($netmask));
    }

    /**
     * IP/ネットマスクからブロードキャストアドレスを取得する
     *
     * @param  $ip      IP
     * @param  $netmask netmask(ip string)
     * @return ブロードキャストアドレス(ip string)
     */
    public static function getBroadcast($ip, $netmask) {
        $netaddr = self::getNetaddr($ip, $netmask);
        return long2ip(ip2long($netaddr) | (~(ip2long($netmask))));
    }
}
