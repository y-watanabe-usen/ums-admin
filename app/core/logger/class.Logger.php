<?php

defined('LOG_DEBUG') || define('LOG_DEBUG', 7);     //Debug-level messages
defined('LOG_INFO') || define('LOG_INFO', 6);     //Informational
defined('LOG_NOTICE') || define('LOG_NOTICE', 5);     //Normal but significant
defined('LOG_WARNING') || define('LOG_WARNING', 4);     //Warning conditions
defined('LOG_ERR') || define('LOG_ERR', 3);     //Error conditions
defined('LOG_CRIT') || define('LOG_CRIT', 2);     //Critical conditions
defined('LOG_ALERT') || define('LOG_ALERT', 1);     //Immediate action required
defined('LOG_EMERG') || define('LOG_EMERG', 0);     //System is unusable

/**
 * ログ関連の定数定義と共通処理
 *
 * @created    2012-03-15
 * @author     sakata
 * @version    v1.0
 * @copyright  Copyright (c) 2012 USEN
 *
 *
 * [ USAGE ]
 *   Logger::log("ログメッセージ");
 *   Logger::log("ログメッセージ + ログプライオリティ", LOG_INFO);
 *   Logger::log("書式指定ログ [加盟コード: %s] [店舗名: %s]", LOG_DEBUG, $kameiCd, $tenpoName);
 *   Logger::log($exeption);
 *   Logger::log($array);
 *
 *   Logger::debug("レベル別出力");
 *   Logger::info("レベル別出力");
 *   Logger::notice("レベル別出力");
 *   Logger::warning("レベル別出力");
 *   Logger::err("レベル別出力");
 *   Logger::crit("レベル別出力");
 *   Logger::alert("レベル別出力");
 *   Logger::emerg("レベル別出力");
 */
class Logger {

    const PREFIX_APP_ID = 'USEN Members';

    private static $instance = null;
    private $config = array();
    //ログレベルの定義
    private static $logLevelList = array(
        'debug' => array('name' => 'DEBUG', 'value' => 7),
        'info' => array('name' => 'INFO', 'value' => 6),
        'notice' => array('name' => 'NOTICE', 'value' => 5),
        'warning' => array('name' => 'WARNING', 'value' => 4),
        'err' => array('name' => 'ERR', 'value' => 3),
        'crit' => array('name' => 'CRIT', 'value' => 2),
        'alert' => array('name' => 'ALERT', 'value' => 1),
        'emerg' => array('name' => 'EMERG', 'value' => 0),
    );
    //ログのプレフィックスを出力するかどうかをそれぞれ定義する
    private static $logPrefixDef = array(
        'datetime' => true,
        'appId' => true,
        'pid' => true,
        'logLevel' => true,
        'remoteIp' => false,
        'funcname' => true,
    );

    /**
     * Constructer
     *
     */
    protected function __construct($logConfig = array()) {
        // 引数がなければGlobal変数の$configという配列から設定値を読み取る
//        if(!$logConfig) {
//            global $config;
//            if(!empty($config["log"])) {
//                $logConfig = $config['log'];
//            }
//        }
        $this->setConfig(Configure::$log);
    }

    /**
     * インスタンスを取得する(初期化されていなければ初期化処理を行う)
     *
     * @return $instance: このクラスのインスタンス
     */
    public static function getInstance() {
        if (empty(self::$instance)) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    /**
     * ログの設定を取得する
     * 引数にそれぞれの出力先を示す文字列を指定する事でその出力先固有の設定値を取得する。
     * 無ければ全ての設定値を取得する。
     *
     * @return array
     */
    public function getConfig($destination = null) {
        if (!empty($destination)) {
            if (array_key_exists($destination, $this->config)) {
                return $this->config[$destination];
            }
        } else {
            return $this->config;
        }
    }

    /**
     * 設定値をセットする
     *
     * @return none
     */
    public function setConfig($config) {
        $this->config = array_replace_recursive($this->config, $config);
    }

    /**
     * ログの出力をさまざまな条件設定により抑制する
     *
     * @return false:  フィルターされなかった(出力して良い)場合
     *         string: フィルターされた場合。そのフィルターの名前
     */
    protected function filter($destination, $message, $level) {
        if ($this->enabledFilter($destination, $message, $level)) {
            return 'enabled';
        }
        if ($this->levelFilter($destination, $message, $level)) {
            return 'level';
        }
        if ($this->regexFilter($destination, $message, $level)) {
            return 'regex';
        }
        return false;
    }

    /**
     * ログの設定が有効かどうかによるフィルターを行う
     *
     * @return bool true:  フィルターされた(出力しない)
     *              false: 出力する
     */
    protected function enabledFilter($destination, $message, $level) {
        $config = $this->getConfig($destination);
        if (empty($config['enabled'])) {
            return true;
        }
        return false;
    }

    /**
     * ログのプライオリティしきい値でフィルターを行う
     *
     * @return bool true:  フィルターされた(出力しない)
     *              false: 出力する
     */
    protected function levelFilter($destination, $message, $level) {
        $config = $this->getConfig($destination);
        if (array_key_exists('level', $config) && array_key_exists($config['level'], self::$logLevelList)) {
            $threshold = self::$logLevelList[$config['level']]['value'];
            if ($threshold < $level) {
                return true;
            }
        }
        return false;
    }

    /**
     * ログを正規表現マッチでフィルターする
     *
     * @return bool true:  フィルターされた(出力しない)
     *              false: 出力する
     */
    protected function regexFilter($destination, $message, $level) {
        $config = $this->getConfig($destination);
        if (!empty($config['filter_ignore'])) {
            $patterns = $config['filter_ignore'];
            if (!is_array($patterns)) {
                $patterns = explode(',', $patterns);
            }
            foreach ($patterns as $pattern) {
                if (preg_match('/^' . $pattern . '$/', $message)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * is_writable()
     *
     * @return bool
     */
    protected static function isWritable($file) {
        return (@touch($file) && is_writable($file));
    }

    /**
     * ログメッセージの左に自動的に付与されるprefix文字列を取得する
     *
     * @return str prefix文字列
     */
    protected function getPrefix($message, $level, $options) {
        if (is_string($options)) {
            $options = preg_split('/[\s]*,[\s]*/', $options);
        }
        $prefix = '';
        foreach ($options as $prefixName) {
            $p = '';
            if (($p = $this->getPrefixCache($prefixName)) == null) {
                $method = 'prefix_' . $prefixName;
                if (method_exists(__CLASS__, $method) && !empty(self::$logPrefixDef[$prefixName])) {
                    $p = $this->$method($message, $level);
                    $this->setPrefixCache($prefixName, $p);
                }
            }
            $prefix .= empty($p) ? '' : ' ' . $p;
        }
//        $prefix = substr($prefix, 1)." ";
        $prefix = substr($prefix, 1);
        return $prefix;
    }

    /**
     * プレフィックス文字列のキャッシュを作成する
     *
     */
    protected function setPrefixCache($prefixName, $data) {
        if (array_key_exists($prefixName, self::$logPrefixDef)) {
            if (!empty($data)) {
                $this->prefixCache[$prefixName] = $data;
            }
        }
    }

    /**
     * 
     * プレフィックス文字列のキャッシュを取得する
     *
     */
    protected function getPrefixCache($prefixName) {
        if (array_key_exists($prefixName, $this->prefixCache)) {
            return $this->prefixCache[$prefixName];
        }
        return null;
    }

    /**
     * プレフィックス文字列のキャッシュを削除する
     *
     */
    protected function resetPrefixCache() {
        $this->prefixCache = array();
    }

    /**
     * ログへ出力を行なう内部処理
     *
     */
    protected function write($message, $level = LOG_NOTICE) {
        $this->resetPrefixCache();
        $this->writeEcho($message, $level);
        $this->writeFile($message, $level);
        $this->writeSyslog($message, $level);
    }

    /**
     * 標準出力・エラー出力へのログの書き込みを行う
     *
     */
    protected function writeEcho($message, $level) {
        $config = $this->getConfig('echo');
        if ($this->filter('echo', $message, $level)) {
            return;
        }
        $prefix = $this->getPrefix($message, $level, $config['option']);
        $line = $prefix . $message . "\n";

        $streams = $config['echo_stream'];
        if (!is_array($streams)) {
            $streams = preg_split('/[\s,]+/', $streams);
        }
        foreach ($streams as $stream) {
            $output_file_stream = @fopen('php://' . strtolower($stream), 'w');
            if ($output_file_stream)
                fwrite($output_file_stream, $line);
        }
    }

    /**
     * syslogへのログの書き込みを行う
     *
     */
    protected function writeSyslog($message, $level) {
        if (!empty($message)) {
            $message = mb_substr($message, 0, 100);
        }
        $config = $this->getConfig('syslog');
        if ($this->filter('syslog', $message, $level)) {
            return;
        }
        if (openlog($config['syslog_ident'], $config['syslog_option'], $config['syslog_facility'])) {
            $prefix = $this->getPrefix($message, $level, $config['option']);
            $line = $prefix . $message . "\n";
            syslog($level, $line);
            closelog();
        }
    }

    /**
     * ログファイルへのログの書き込みを行う
     *
     */
    protected function writeFile($message, $level) {
        $config = $this->getConfig('file');
        if ($this->filter('file', $message, $level)) {
            return;
        }
        if (empty($config['file']) || !$this->isWritable($config['file'])) {
            return;
        }
        if (($fp = fopen($config['file'], "a")) != false) {
            if ((flock($fp, LOCK_EX)) == false) {
                return;
            }

            $prefix = $this->getPrefix($message, $level, $config['option']);
            $line = $prefix . $message . "\n";
            fwrite($fp, $line);
            if (flock($fp, LOCK_UN)) {
                fclose($fp);
            }
        }
    }

    /**
     * prefixとして出力するためのログレベル文字列を取得する
     *
     * @param int ログレベル
     */
    protected function getLevelString($level) {
        foreach (self::$logLevelList as $key => $value) {
            if ($value['value'] == $level) {
                return $value['name'];
            }
        }
        return (string) $level;
    }

    /**
     * ログを出力する
     *
     * @param str   $msg   出力する文字列
     *        int   $level ログのプライオリティーレベルを指定する
     *        [, mixed $args [, mixed $... ]] 書式指定の引数
     */
    public static function log($msg, $level = LOG_NOTICE) {
        $instance = self::getInstance();

//        if (!is_string($msg)) {
//            return self::paramlog($msg, $level);
//        }
//        $args = func_get_args();
//        if (count($args) > 2) {
//            array_splice($args, 0, 2);
//            if (($_msg = @vsprintf($msg, $args)) === false) {
//                $_msg = $msg;
//            }
//            $msg = $_msg;
//        }
//
//        $msg_array = preg_split("/[\r\n]+/", $msg, -1, PREG_SPLIT_NO_EMPTY);
//        foreach ($msg_array as $value) {
//            $instance->write($value, $level);
//        }

        if (is_array($msg) || ($msg instanceof Exception)) {
            $instance->write(print_r($msg, true), $level);
        } else {
            $instance->write($msg, $level);
        }
    }

    /**
     * 指定された配列, 例外をログに記述する
     *
     * @param mixed $params 例外か配列
     */
    public static function paramlog($params, $level = LOG_NOTICE) {
        $instance = self::getInstance();

        //配列の中身を出力する
        if (!empty($params) && is_array($params)) {
            foreach ($params as $key => $value) {
                $instance->write($key . ' : ' . $value, $level);
            }
        }
        //Exceptionの情報を出力する
        if ($params instanceof Exception) {
            $instance->write('*** [ EXCEPTION - START - ] *** *** *** ***', $level);
            $instance->write('MESSAGE: ' . $params->getMessage(), $level);
            $instance->write('FILE   : ' . $params->getFile() . ' [LINE ' . $params->getLine() . ']', $level);
            if ($trace = $params->getTrace()) {
                $i = 1;
                foreach ($trace as $key => $value) {
                    $instance->write('trace ' . $i . ': ' . $value['file'] . '(' . $value['line'] . ')' . ' : ' . $value['function'], $level);
                    $i++;
                }
            }
            $instance->write('*** [EXCEPTION - END - ] *** ***', $level);
        }
        return true;
    }

    //各レベルをメソッド名として呼び出し、そのレベルのログとして出力するための定義
    public static function notice($msg) {
        self::log($msg, LOG_NOTICE);
    }

    public static function alert($msg) {
        self::log($msg, LOG_ALERT);
    }

    public static function crit($msg) {
        self::log($msg, LOG_CRIT);
    }

    public static function info($msg) {
        self::log($msg, LOG_INFO);
    }

    public static function emerg($msg) {
        self::log($msg, LOG_EMERG);
    }

    public static function warning($msg) {
        self::log($msg, LOG_WARNING);
    }

    public static function err($msg) {
        self::log($msg, LOG_ERR);
    }

    public static function debug($msg) {
        self::log($msg, LOG_DEBUG);
    }

    //後方互換用のメソッド
    public static function debugLog($msg) {
        self::debug($msg, LOG_DEBUG);
    }

    public static function errorLog($msg) {
        self::err($msg);
    }

    public static function printlog($msg) {
        self::log($msg);
    }

    /**
     * datetime prefix
     */
    private function prefix_datetime() {
        return strftime('%Y/%m/%d %H:%M:%S');
    }

    /**
     * appId prefix
     */
    private function prefix_appId() {
        return self::PREFIX_APP_ID;
    }

    /**
     * process id prefix
     */
    private function prefix_pid() {
        if (($pid = getmypid()) != false) {
            return "[${pid}]";
        }
        return '';
    }

    /**
     * log level prefix
     */
    private function prefix_logLevel($message, $level) {
        return '(' . $this->getLevelString($level) . '):';
    }

    /**
     * backtrace prefix
     */
    private function prefix_funcname() {
        $class = "";
        $method = "";
        $file_line = "";
        $file = "";
        $line = "";
        $type = "";

        $bt = debug_backtrace();
        foreach ($bt as $key => $value) {
            if (isset($value["file"]) && ($value["file"] != __FILE__)) {
//                $class  = !empty($value['class'])? $value['class'] : '';
//                $method = !empty($value['function'])? $value['function'] : '';
//                $type   = !empty($value['type'])? $value['type'] : ' ';
//                if(!empty($value['file']) && $value['line']){
//                    $file = str_replace(PROJECT_BASE_PATH.'/','',$value['file']);
                $file = $value['file'];
                $line = $value['line'];
                return "[$file, line:$line] ";
//                    $file_line = "(${file}:${line})";
//                }
//                return  "${class}${type}{$method}${file_line}: ";
            }
        }

        return '';
//        $bt = debug_backtrace();
//        foreach($bt as $key => $value){
//            if( isset($value["class"]) && ($value["class"] != __CLASS__) ){
//                return  self::_prefix_funcname($value);
//            }
//        }
//
//        if(!empty($bt)){
//            $lastTrace = array_pop($bt);
//            return  self::_prefix_funcname($lastTrace);
//        }
//        return '';
    }

//    private static function _prefix_funcname($trace) {
//        $file_line = "";
//        $file = "";
//        $line = "";
//
//        $class = !empty($trace['class']) ? $trace['class'] : '';
//        $method = !empty($trace['function']) ? $trace['function'] : '';
//        $type = !empty($trace['type']) ? $trace['type'] : ' ';
//        if (!empty($trace['file']) && $trace['line']) {
//            $file = str_replace(PROJECT_BASE_PATH . '/', '', $trace['file']);
//            $line = $trace['line'];
//            $file_line = "(${file}:${line})";
//        }
//        return "${class}${type}{$method}${file_line}:";
//    }

    /**
     * ip address prefix
     */
    private function prefix_remoteIp() {
        if (!empty($_SERVER['REMOTE_ADDR'])) {
            return '(' . $_SERVER['REMOTE_ADDR'] . ')';
        }
        return '';
    }

    /**
     * shortcut for set syslog ident.
     *
     */
    public static function setSyslogIdent($sysName) {
        self::getInstance()->setConfig(array(
            'syslog' => array('syslog_ident' => $sysName)
        ));
    }

}

//defined('LOG_DEBUG') || define('LOG_DEBUG', 7);     //Debug-level messages
//defined('LOG_INFO') || define('LOG_INFO', 6);     //Informational
//defined('LOG_NOTICE') || define('LOG_NOTICE', 5);     //Normal but significant
//defined('LOG_WARNING') || define('LOG_WARNING', 4);     //Warning conditions
//defined('LOG_ERR') || define('LOG_ERR', 3);     //Error conditions
//defined('LOG_CRIT') || define('LOG_CRIT', 2);     //Critical conditions
//defined('LOG_ALERT') || define('LOG_ALERT', 1);     //Immediate action required
//defined('LOG_EMERG') || define('LOG_EMERG', 0);     //System is unusable
//
//class Logger {
//
//    const logName = 'debug.log';
//
//    //ログを書き込むパス
//    protected static $logfilePath = '';
//    //ログの出力を行なう閾値
//    protected static $level;
//    //書き込むログレベルの文字列
//    private static $levelPrefix = '';
//    //ログレベルの定義
//    private static $logLevelList = array(
//        'debug' => array('name' => 'DEBUG', 'value' => 7),
//        'info' => array('name' => 'INFO', 'value' => 6),
//        'notice' => array('name' => 'NOTICE', 'value' => 5),
//        'warning' => array('name' => 'WARNING', 'value' => 4),
//        'err' => array('name' => 'ERR', 'value' => 3),
//        'crit' => array('name' => 'CRIT', 'value' => 2),
//        'alert' => array('name' => 'ALERT', 'value' => 1),
//        'emerg' => array('name' => 'EMERG', 'value' => 0),
//    );
//    //ログのプレフィックスを出力するかどうかをそれぞれ定義する
//    private static $logPrefixDef = array(
//        'datetime' => true,
//#            'appId'       => true,
//        'pid' => true,
//        'logLevel' => true,
//        'remoteIp' => false,
//        'funcname' => true,
//    );
//
//    public function __construct() {
//        
//    }
//
//    /**
//     * 設定ファイルに記載しているような(debug, noticeなどの)プライオリティ指定から、
//     * ログに出力するレベルの閾値を決める
//     *
//     * @return none
//     */
//    public static function setLogLevel($levelStr) {
//        if (array_key_exists($levelStr, self::$logLevelList)) {
//            self::$level = self::$logLevelList[$levelStr]['value'];
//        }
//    }
//
//    /**
//     * ログレベル、ログファイルパスの初期設定を行なう
//     *
//     * @return none
//     */
//    public static function initConfig() {
//        if ((self::$level !== null) && (self::$logfilePath !== '')) {
//            return;
//        }
//        $logLevelDefault = "notice";
//        $logConfig = self::getConfig();
//        //ログレベルの設定を設定ファイルから、無ければデフォルト値を設定する
//        if (!empty($logConfig['file']['level'])) {
//            self::setLogLevel($logConfig['file']['level']);
//        } elseif (!empty($logConfig['level'])) {
//            self::setLogLevel($logConfig['level']);
//        } else {
//            self::setLogLevel($logLevelDefault);
//        }
//        //ログファイルのパスを設定する
//        if (!empty($logConfig['file']['file']) && self::isWritable($logConfig['file']['file'])) {
//            self::$logfilePath = $logConfig['file']['file'];
//        } else {
//            self::setLogfileDefault();
//        }
//    }
//
//    /**
//     * ログに出力してよいレベルかどうかを返す
//     *
//     * @return bool true:  出力する
//     *              false: 出力しない
//     */
//    protected static function levelFilter($level) {
//        if (self::$level >= $level) {
//            return true;
//        }
//        return false;
//    }
//
//    /**
//     * ログに関する設定値配列を取得する。
//     *
//     * @return array
//     */
//    protected static function getConfig() {
//        $config = Configure::$log;
//        return !empty($config) ? $config : array();
//    }
//
//    /**
//     * ログファイルパスをデフォルト値からセットする
//     * デフォルト値は PROJECT_BASE_PATH + "/log/gg.log"
//     *
//     * @return none
//     */
//    protected static function setLogfileDefault() {
//        $fname = self::logName;
//        $logfilePath = './' . $fname;
//        if (self::isWritable($logfilePath)) {
//            self::$logfilePath = $logfilePath;
//            return true;
//        } else {
//            return false;
//        }
//    }
//
//    /**
//     * is_writable()
//     *
//     * @return bool
//     */
//    protected static function isWritable($file) {
////        return is_writable($file);
//        return true;
//    }
//
//    /**
//     * ログファイルのパスを取得する
//     * まだ設定されていなければ、設定ファイル・デフォルト値から取得する
//     *
//     * @return str ファイルパス
//     */
//    public static function getLogfilePath() {
//        if (empty(self::$logfilePath)) {
//            self::initConfig();
//        }
//        return self::$logfilePath;
//    }
//
//    /**
//     * ログメッセージの左に自動的に付与されるprefix文字列を取得する
//     *
//     * @return str prefix文字列
//     */
//    protected static function getPrefix() {
//        $prefix = '';
//        foreach (self::$logPrefixDef as $key => $enabled) {
//            $method = 'prefix_' . $key;
//            if (method_exists(__CLASS__, $method) && $enabled) {
//                $prefix .= self::$method();
//            }
//        }
//        return $prefix;
//    }
//
//    /**
//     * ログへ出力を行なう内部処理
//     *
//     */
//    protected static function write($str, $level = LOG_NOTICE) {
//        if (($logfile = self::getLogfilePath()) == false) {
//            return false;
//        }
//        if (($fp = fopen($logfile, "a")) == false) {
//            return false;
//        }
//        if ((flock($fp, LOCK_EX)) == false) {
//            return false;
//        }
//        $prefix = self::getPrefix();
//        $line = $prefix . $str . "\n";
//        fwrite($fp, $line);
//        if (flock($fp, LOCK_UN)) {
//            fclose($fp);
//        }
//    }
//
//    /**
//     * prefixとして出力するためのログレベル文字列保存する
//     *
//     * @param int ログレベル
//     */
//    protected static function setLevelPrefix($level) {
//        self::$levelPrefix = $level;
//        foreach (self::$logLevelList as $key => $value) {
//            if ($value['value'] == $level) {
//                self::$levelPrefix = $value['name'];
//                break;
//            }
//        }
//    }
//
//    /**
//     * ログを出力する
//     *
//     * @param str   $msg   出力する文字列
//     *        int   $level ログのプライオリティーレベルを指定する
//     *        [, mixed $args [, mixed $... ]] 書式指定の引数
//     */
//    public static function log($msg, $level = LOG_NOTICE) {
//        self::initConfig();
//        if (!self::levelFilter($level)) {
//            return true;
//        }
//        self::setLevelPrefix($level);
////        if(is_array($msg) || ($msg instanceof Exception)){
////            return self::paramlog($msg, $level);
////        }
////        $args = func_get_args();
////        if (count($args) > 2) {
////            array_splice($args, 0, 2);
////            if( ($_msg = @vsprintf($msg, $args)) === false ){
////                $_msg = $msg;
////            }
////            $msg = $_msg;
////        }
////        $msg_array = preg_split("/[\r\n]+/", $msg, -1, PREG_SPLIT_NO_EMPTY);
////        foreach($msg_array as $value){
////            self::write($value);
////        }
//
//        if (is_array($msg) || ($msg instanceof Exception)) {
//            self::write(print_r($msg, true));
//        } else {
//            self::write($msg);
//        }
//    }
//
//    /**
//     * 指定された配列, 例外をログに記述する
//     *
//     * @param mixed $params 例外か配列
//     */
//    public static function paramlog($params, $level = LOG_NOTICE) {
//        self::initConfig();
//        if (!self::levelFilter($level)) {
//            return true;
//        }
//        self::setLevelPrefix($level);
//        //配列の中身を出力する
//        if (!empty($params) && is_array($params)) {
//            foreach ($params as $key => $value) {
//                self::write($key . ' : ' . $value);
//            }
//        }
//        //Exceptionの情報を出力する
//        if ($params instanceof Exception) {
//            self::write('*** [ EXCEPTION - START - ] *** *** *** ***');
//            self::write('MESSAGE: ' . $params->getMessage());
//            self::write('FILE   : ' . $params->getFile() . ' [LINE ' . $params->getLine() . ']');
//            if ($trace = $params->getTrace()) {
//                $i = 1;
//                foreach ($trace as $key => $value) {
//                    self::write('trace ' . $i . ': ' . $value['file'] . '(' . $value['line'] . ')' . ' : ' . $value['function']);
//                    $i++;
//                }
//            }
//            self::write('*** [EXCEPTION - END - ] *** ***');
//        }
//        return true;
//    }
//
//    //各レベルをメソッド名として呼び出し、そのレベルのログとして出力するための定義
//    public static function notice($msg) {
//        self::log($msg, LOG_NOTICE);
//    }
//
//    public static function alert($msg) {
//        self::log($msg, LOG_ALERT);
//    }
//
//    public static function crit($msg) {
//        self::log($msg, LOG_CRIT);
//    }
//
//    public static function info($msg) {
//        self::log($msg, LOG_INFO);
//    }
//
//    public static function emerg($msg) {
//        self::log($msg, LOG_EMERG);
//    }
//
//    public static function warning($msg) {
//        self::log($msg, LOG_WARNING);
//    }
//
//    public static function err($msg) {
//        self::log($msg, LOG_ERR);
//    }
//
//    public static function debug($msg) {
//        self::log($msg, LOG_DEBUG);
//    }
//
//    /**
//     * datetime prefix
//     */
//    private static function prefix_datetime() {
//        return strftime('%Y/%m/%d %H:%M:%S') . " ";
//    }
//
//    /**
//     * process id prefix
//     */
//    private static function prefix_pid() {
//        if (($pid = getmypid()) != false) {
//            return "[${pid}] ";
//        }
//        return '';
//    }
//
//    /**
//     * log level prefix
//     */
//    private static function prefix_logLevel() {
//        return '(' . self::$levelPrefix . ') ';
//    }
//
//    /**
//     * backtrace prefix
//     */
//    private static function prefix_funcname() {
//        $class = "";
//        $method = "";
//        $file_line = "";
//        $file = "";
//        $line = "";
//        $type = "";
//
//        $bt = debug_backtrace();
//        foreach ($bt as $key => $value) {
//            if (isset($value["file"]) && ($value["file"] != __FILE__)) {
////                $class  = !empty($value['class'])? $value['class'] : '';
////                $method = !empty($value['function'])? $value['function'] : '';
////                $type   = !empty($value['type'])? $value['type'] : ' ';
////                if(!empty($value['file']) && $value['line']){
////                    $file = str_replace(PROJECT_BASE_PATH.'/','',$value['file']);
//                $file = $value['file'];
//                $line = $value['line'];
//                return "[$file, line:$line] ";
////                    $file_line = "(${file}:${line})";
////                }
////                return  "${class}${type}{$method}${file_line}: ";
//            }
//        }
//
//        return '';
//    }
//
//    /**
//     * ip address prefix
//     */
//    private static function prefix_remoteIp() {
//        if (!empty($_SERVER['REMOTE_ADDR'])) {
//            return '(' . $_SERVER['REMOTE_ADDR'] . ') ';
//        }
//        return '';
//    }
//
//}
