<?php

/**
 * DB例外クラス
 *
 * @created	2012-07-01
 * @author	 Imaeda
 * @version	v1.0
 * @copyright  Copyright (c) 2012 USEN
 */
class DbException extends Exception {

    /**
     * コンストラクタ
     */
    function __construct($message = NULL, $code = 0) {
        parent::__construct($message, $code);
        $arr["class_vars"] = get_class_vars("Exception");
        $arr["class_methods"] = get_class_methods("Exception");
        $arr["object_vars"] = get_object_vars($this);
    }

}
