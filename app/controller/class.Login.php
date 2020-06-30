<?php

/*
 * ログイン
 */
class login extends Controller {

    /*
     * 前処理
     */
    public function beforeFilter() {
        // ログイン済みならマイページへ
        if ($this->Auth->check() === Auth::LOGIN_OK) {
            Func::redirect('/account/search');
            exit;
        } elseif ($this->Auth->check() === Auth::TIMEOUT) {
            Session::delete(Configure::read('SESSION_IS_LOGIN'));
            Session::delete(Configure::read('SESSION_ACCOUNT'));
            Session::delete(Configure::read('SESSION_EXPIRED'));
        }
    }

    /*
     * ログイン画面
     */
    public function index() {

        // 戻り先URLの退避
        if (!is_null(Session::get(Configure::read("SESSION_RETURN_URL")))) {
            $tmp = Session::get(Configure::read("SESSION_RETURN_URL"));
        }

        $this->Auth->logout();

        // 戻り先URLの再設定
        if (isset($tmp)) {
            Session::set(Configure::read("SESSION_RETURN_URL"), $tmp);
        }

        // タイトル設定
        $this->set('titleName', "ログイン");

        $errorMessage = '';
        if (!empty($this->RequestPost)) {
            // ログインボタンが押された時の処理
            $errorMessage = '';
            if ($this->Auth->login($this->RequestPost['code'], $this->RequestPost['password']) === Auth::LOGIN_OK) {
                // ログイン成功
                if (!is_null(Session::get(Configure::read("SESSION_RETURN_URL")))) {
                    $returnUrl = Session::get(Configure::read("SESSION_RETURN_URL"));
                    Session::delete(Configure::read("SESSION_RETURN_URL"));
                    Func::redirect($returnUrl);
                } else {
                    Func::redirect('/account/search');
                }
                exit;
            } else {
                $errorMessage = 'ログインID、またはパスワードに誤りがあります。';
            }
        }
        $this->set('errorMessage', $errorMessage);
        $this->render(DS . 'login' . DS . 'index.tpl');
    }

}
