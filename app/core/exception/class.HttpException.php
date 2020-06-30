<?php

class HttpException extends Exception {

    public function responseHeader() {
        header("HTTP/1.1 $this->code $this->message");
        $errors = Configure::read('error');
        if (isset($errors[$this->code])) {
            $outputFile = $errors[$this->code];
            if (!is_readable($outputFile)) {
                echo "$this->code $this->message";
            } else {
                $titleName = "$this->code $this->message";
                ob_start();
                require_once($outputFile);
                unset($outputFile);
                echo ob_get_clean();
            }
        } else {
            echo "$this->code $this->message";
        }
        exit();
    }

}
