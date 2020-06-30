<?php

class ForbiddenException extends HttpException {

    function __construct($message = NULL, $code = 403) {
        if (empty($message)) {
            $message = 'Forbidden';
        }
        parent::__construct($message, $code);
    }

}
