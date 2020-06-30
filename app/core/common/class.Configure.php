<?php

class Configure {

    protected static $_values = array();
    public static $database = array();
    public static $log = array();

    public static function write($key = null, $value = null) {
        if ($key === null) {
            return false;
        }

        self::$_values[$key] = $value;

        return true;
    }

    public static function read($key = null) {
        if ($key === null) {
            return self::$_values;
        }
        return self::$_values[$key];
    }

}
