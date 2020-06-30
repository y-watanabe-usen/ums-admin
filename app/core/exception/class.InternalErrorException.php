<?php

class InternalErrorException extends HttpException {

    function __construct($message = NULL, $code = 500) {
        if (empty($message)) {
            $message = 'Internal Server Error';
        }
        parent::__construct($message, $code);
    }

}
