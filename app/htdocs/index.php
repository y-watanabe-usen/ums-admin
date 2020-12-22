<?php

// 定数定義
define('DS', DIRECTORY_SEPARATOR);
define('HOME_DIR', dirname(dirname(__FILE__)));
define('CORE_DIR', HOME_DIR . DS . 'core');
define('COMMON_DIR', CORE_DIR . DS . 'common');
define('LIB_DIR', HOME_DIR . DS . 'lib');
define('ETC_DIR', HOME_DIR . DS . 'etc');
define('CONFIG_DIR', HOME_DIR . DS . 'config');
define('CTL_DIR', HOME_DIR . DS . 'controller');
define('TPL_DIR', HOME_DIR . DS . 'template');
define('LOG_DIR', HOME_DIR . DS . 'log');
define('TMP_DIR', HOME_DIR . DS . 'tmp');
define('RSA_DIR', ETC_DIR . DS . 'rsa');
define('PLUGIN_DIR', ETC_DIR . DS . 'plugin');

// core class 読み込み
require_once(CORE_DIR . DS . 'exception' . DS . 'class.DbException.php');
require_once(CORE_DIR . DS . 'exception' . DS . 'class.HttpException.php');
require_once(CORE_DIR . DS . 'exception' . DS . 'class.NotFoundException.php');
require_once(CORE_DIR . DS . 'exception' . DS . 'class.BadRequestException.php');
require_once(CORE_DIR . DS . 'exception' . DS . 'class.ForbiddenException.php');
require_once(CORE_DIR . DS . 'exception' . DS . 'class.InternalErrorException.php');
require_once(CORE_DIR . DS . 'logger' . DS . 'class.Logger.php');
require_once(CORE_DIR . DS . 'db' . DS . 'class.Database.php');
require_once(COMMON_DIR . DS . 'class.Configure.php');
require_once(COMMON_DIR . DS . 'class.Function.php');
require_once(COMMON_DIR . DS . 'class.Validation.php');

// config file 読み込み
require_once(CONFIG_DIR . DS . 'config.php');

// admin lib class 読み込み
//require_once(LIB_DIR . DS . 'class.SessionHandler.php');
require_once(LIB_DIR . DS . 'class.Session.php');
require_once(LIB_DIR . DS . 'class.Cookie.php');
require_once(LIB_DIR . DS . 'class.Request.php');
//require_once(LIB_DIR . DS . 'class.SecurimageHandler.php');
require_once(LIB_DIR . DS . 'class.SendmailHandler.php');

// contoroller class 読み込み
require_once(CTL_DIR . DS . 'class.Controller.php');


// セッションスタート
//$sessionHandler = new SessionHandler();
//session_set_save_handler(
//        array($sessionHandler, 'open'), array($sessionHandler, 'close'), array($sessionHandler, 'read'), array($sessionHandler, 'write'), array($sessionHandler, 'destroy'), array($sessionHandler, 'gc')
//);
//register_shutdown_function('session_write_close');
session_start();

$uri = "";
if (!empty($_SERVER['PATH_INFO'])) {
    $uri = $_SERVER['PATH_INFO'];
} elseif (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '://') === false) {
    $uri = $_SERVER['REQUEST_URI'];
} elseif (isset($_SERVER['REQUEST_URI'])) {
    $qPosition = strpos($_SERVER['REQUEST_URI'], '?');
    if ($qPosition !== false && strpos($_SERVER['REQUEST_URI'], '://') > $qPosition) {
        $uri = $_SERVER['REQUEST_URI'];
    } else {
        $uri = substr($_SERVER['REQUEST_URI'], strlen(FULL_BASE_URL));
    }
} elseif (isset($_SERVER['PHP_SELF']) && isset($_SERVER['SCRIPT_NAME'])) {
    $uri = str_replace($_SERVER['SCRIPT_NAME'], '', $_SERVER['PHP_SELF']);
} elseif (isset($_SERVER['HTTP_X_REWRITE_URL'])) {
    $uri = $_SERVER['HTTP_X_REWRITE_URL'];
} elseif ($var = env('argv')) {
    $uri = $var[0];
}

if (strpos($uri, '?') !== false) {
    list($uri) = explode('?', $uri, 2);
}
if (empty($uri) || $uri === '/' || $uri === '//' || $uri === '/index.php') {
    $uri = '/login/';
}
$u = preg_split('/[\/]/', $uri, -1, PREG_SPLIT_NO_EMPTY);
$className = 'class.' . ucfirst(strtolower($u[0])) . '.php';

try {
    //クラス存在チェック
    $className = "";
    if (file_exists(CTL_DIR . DS . 'class.' . $u[0] . '.php')) {
        $className = DS . 'class.' . $u[0] . '.php';
    } elseif (file_exists(CTL_DIR . DS . 'class.' . ucfirst(strtolower($u[0])) . '.php')) {
        $className = DS . 'class.' . ucfirst(strtolower($u[0])) . '.php';
    } else {
        Logger::warning("URL is invalid :" . $uri);
        throw new NotFoundException();
    }

    //クラス読み込み
    require_once(CTL_DIR . DS . $className);
    if (empty($u[1])) {
        $u[1] = 'index';
    }

    $reflection = new ReflectionClass($u[0]);
    if ($reflection->isAbstract()) {
        Logger::warning("URL is invalid :" . $uri);
        throw new NotFoundException();
    }
    $controller = new $u[0];
    $action = $u[1];
    $getParams = array();
    if (count($u) >= 3) {
        for ($i = 2; $i < count($u); $i++) {
            $getParams[] = $u[$i];
        }
    }

    if (method_exists($controller, $u[1])) {
        $reflection = new ReflectionMethod($controller, $u[1]);
        if (!$reflection->isPublic()) {
            Logger::warning("URL is invalid :" . $uri);
            throw new NotFoundException();
        }
        $controller->controller = ucfirst(strtolower($u[0]));
        $controller->action = strtolower($u[1]);
        call_user_func_array(array($controller, 'beforeFilter'), $getParams);
        call_user_func_array(array($controller, $action), $getParams);
    } else {
        Logger::warning("URL is invalid :" . $uri);
        throw new NotFoundException();
    }
} catch (HttpException $e) {
    $e->responseHeader();
} catch (Exception $e) {
    $httpe = new InternalErrorException();
    $httpe->responseHeader();
}
