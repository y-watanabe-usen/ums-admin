<?php

class NotFoundException extends HttpException {

    function __construct($message = NULL, $code = 404) {
        if (empty($message)) {
            $message = 'Not Found';
        }
        parent::__construct($message, $code);
    }

}
