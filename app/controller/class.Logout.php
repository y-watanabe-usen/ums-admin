<?php

/*
 * ログアウト
 */
class Logout extends Controller {

    /*
     * ログアウト
     */
    public function index() {
        $this->Auth->logout();
        Func::redirect('/login');
    }
}
