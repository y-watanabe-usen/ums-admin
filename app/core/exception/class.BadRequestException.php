<?php

class BadRequestException extends HttpException {

    function __construct($message = NULL, $code = 400) {
        if (empty($message)) {
            $message = 'Bad Request';
        }
        parent::__construct($message, $code);
    }

}
