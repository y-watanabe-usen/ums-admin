<?php

/**
 * Aclクラス
 *
 * @created    2014-08-22
 * @author     s-suzuki
 * @version    v1.0
 * @copyright  Copyright (c) 2014 USEN
 */
class Acl {

    private $acl = array();
    private $role = null;

    /**
     * コンストラクタ
     */
    function __construct() {
        require_once(CONFIG_DIR . DS . 'acl.ini.php');
        $this->acl = $acl;
    }

    /**
     * aclチェック
     *
     * @param $role_id 権限マスタidの配列 or 権限マスタidのカンマ区切り
     * @param $url     /controller/action
     * @return boolean
     */
    public function check($role_id, $url) {
    
        $controller = "";
        $action = "";
    
        if (!is_array($role_id)) {
            $role_id = explode(',', $role_id);
        }

        if (mb_substr($url, 0, 1) === '/') $url = mb_substr($url, 1);

        if (preg_match('/\//', $url)) {
            list($controller, $action) = explode('/', $url);
        } else {
            $controller = $url;
        }

        $controller = ucfirst(strtolower($controller));
        $action = ($action == "")? "index" : strtolower($action);

        if ($this->role == null) {
            $this->role["deny"] = array();
            $this->role["allow"] = (isset($this->acl['allow']['*']))? $this->acl['allow']['*'] : array();
            foreach ($role_id as $val) {
                if (isset($this->acl['deny'][$val])) $this->role["deny"] = array_merge($this->role["deny"], $this->acl['deny'][$val]);
                if (isset($this->acl['allow'][$val])) $this->role["allow"] = array_merge($this->role["allow"], $this->acl['allow'][$val]);
            }

            $this->role["deny"] = array_unique($this->role["deny"]);
            $this->role["allow"] = array_unique($this->role["allow"]);
        }

        //拒否
        if (!empty($this->role["deny"])) {
            //all deny
            if (in_array('*', $this->role["deny"])) return false;
            //action all deny
            if (in_array($controller . '/*', $this->role["deny"])) return false;
            //deny
            if (in_array($controller . '/' . $action, $this->role["deny"])) return false;
        }

        //許可
        if (!empty($this->role["allow"])) {
            //all allow
            if (in_array('*', $this->role["allow"])) return true;
            //action all allow
            if (in_array($controller . '/*', $this->role["allow"])) return true;
            //allow
            if (in_array($controller . '/' . $action, $this->role["allow"])) return true;
        }
        
        return false;
    }

}
