<?php

class Maintenance {

    /**
     * メンテナンス時間帯かチェックする 
     *
     * @return array is_maintenance    0:メンテナンスなし 1:メンテナンス 2:強制メンテナンス
     *               maintenance_start メンテナンス開始時間
     *               maintenance_end   メンテナンス終了時間
     */
    public static function isMaintenanceTime() {
        $config = Configure::read('MAINTENANCE');
        $result = array();
        $result['is_maintenance'] = 0; // メンテナンスではない
        $result['maintenance_start'] = null;
        $result['maintenance_end'] = null;

        // メンテナンス状態が1の場合は、強制的にメンテナンスとする
        if ($config['status'] == 1) {
            $result['is_maintenance'] = 2; // 強制メンテナンス中
        }

        // 設定ファイルからメンテナンスリストを取得
        $checkList = $config['list'];
        if (!is_array($checkList) && count($checkList) < 0) {
            return $result;
        }

        // 現在日付
        $nowTime = time();
        $nowYear = date('Y', $nowTime);
        $nowMonth = date('n', $nowTime);
        $nowDay = date('j', $nowTime);

        // メンテナンスチェック
        foreach ($checkList as $id => $row) {
            $maintenanceStart = null;
            $maintenanceEnd = null;

            // 月末メンテナンスチェック
            if ($row['day'] == 'END') {
                // 月末
                $endOfDay = date('j', mktime(0, 0, 0, $nowMonth + 1, 0, $nowYear));
                $endOfDate = date('Y/m/d', mktime(0, 0, 0, $nowMonth + 1, 0, $nowYear));
                // 月初
                $startOfDate = date('Y/m/d', mktime(0, 0, 0, $nowMonth, 1, $nowYear));

                // 現在が月末以外かつ現在が1日以外 または 1日で月末オープンが翌日ではない場合は、メンテナンス時間外
                if (($nowDay != $endOfDay && $nowDay != 1) || ($nowDay == 1 && $row['open_next'] == 0)) {
                    continue;
                }
                // 月末のメンテナンス開始・終了時間
                if ($nowDay == $endOfDay) {
                    $maintenanceStart = sprintf("%s %s", date("Y/m/d", $nowTime), $row['start_time']);
                    if ($row['open_next'] == 1) {
                        $maintenanceEnd = sprintf("%s %s", date("Y/m/d ",strtotime("1 day", $nowTime)), $row['end_time']);
                    } else {
                        $maintenanceEnd = sprintf("%s %s", date("Y/m/d", $nowTime), $row['end_time']);
                    }
                } else if ($nowDay == 1 && $row['open_next'] == 1) {
                    // 月初のメンテナンス開始・終了時間
                    $maintenanceStart = sprintf("%s %s", date("Y/m/d",strtotime("-1 day", $nowTime)), $row['start_time']);
                    $maintenanceEnd = sprintf("%s %s", $startOfDate, $row['end_time']);
                } else {
                    continue;
                }
            } else {
                if ($nowDay != $row['day']) {
                    continue;
                }
                $maintenanceStart = sprintf("%s %s", date("Y/m/d", $nowTime), $row['start_time']);
                if ($row['open_next'] == 0) {
                    $maintenanceEnd = sprintf("%s %s", date("Y/m/d", $nowTime), $row['end_time']);
                } else {
                    $maintenanceEnd = sprintf("%s %s", date("Y/m/d",strtotime("1 day", $nowTime)), $row['end_time']);
                }
            }
            // メンテナンス時間帯チェック
            if ($nowTime >= strtotime($maintenanceStart) && $nowTime <= strtotime($maintenanceEnd)) {
                $result['is_maintenance'] = 1; // メンテナンス中
                $result['maintenance_start'] = $row['start_time'];
                $result['maintenance_end'] = $row['end_time'];
                return $result;
            }
        }
        return $result;
    }
}
