<?php

require_once(PLUGIN_DIR . DS . 'tcpdf' . DS . 'tcpdf.php');
require_once(PLUGIN_DIR . DS . 'fpdi' . DS . 'fpdi.php');
require_once(LIB_DIR . DS . 'class.Cipher.php');

/**
 * ID通知書PDF出力クラス
 *
 * @created    2015-06-29
 * @author     y-dobashi
 * @version    v1.0
 * @copyright  Copyright (c) 2015 USEN
 */
class IdPdf extends FPDI {

    private $_custs;
    private $_file;
    private $_y = 0;
    private $_maxY = 0;
    private $_template;
    private $_isInitSkiped = false;

    const LOGIN_ID_MAX_LENGTH = 65; // 1行に印字するログインIDの最大長
    const START_Y_1PAGE = 90; // 1ページ目にアカウント情報を印刷する時の初期高さ
    const START_Y_2PAGE = 60; // 2ページ目以降にアカウント情報を印刷する時の初期高さ
    const BRANK_TABLE_HEIGHT = 36; // 空白表の高さ

    public function __construct($orientation = 'P', $unit = 'mm', $format = 'A4', $unicode = true, $encoding = 'UTF-8', $diskcache = false, $pdfa = false) {
        parent::__construct($orientation, $unit, $format, $unicode, $encoding, $diskcache, $pdfa);
        $this->SetAutoPageBreak(true, 0);
        $this->SetTitle("ID通知書");
        $this->SetMargins(0, 0, 0);
        $this->setPrintHeader(false);
        $this->setPrintFooter(true);
        $this->setHeaderMargin(0);
        $this->setFooterMargin(0);
        $this->_template = TPL_DIR . DS . "issue" . DS . "id.pdf";
        $this->setSourceFile($this->_template);
        $this->_maxY = $this->getPageHeight() - 40;
        $this->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
    }

    /**
     * 顧客のセット
     * @param type $custs
     */
    public function setCusts($custs) {
        $this->_custs = $custs;
    }

    /**
     * テンプレートのセット
     * @param type $custs
     */
    public function setTemplate($template) {
        $this->_template = $template;
        $this->setSourceFile($this->_template);
    }

    /**
     * ファイルのセット
     * @param type $file 絶対パスで指定
     */
    public function setFile($file) {
        $this->_file = $file;
    }

    /**
     * 初回登録Skipフラグのセット
     * @param type $flag booleanで指定
     */
    public function setIsInitSkiped($flag) {
        $this->_isInitSkiped = $flag;
    }

    /**
     * PDFで印刷可能な最大高さを取得する
     * @return Integer 高さ
     */
    public function getMaxY() {
        return $this->_maxY;
    }

    /**
     * 引数の顧客をPDF印刷した場合の想定高さを取得する
     * @param type $cust
     * @return Integer 高さ
     */
    public function getCustHeight($cust) {
        $y = self::START_Y_1PAGE;
        foreach ($cust->accounts as $account) {
            $y += $this->_getAccountHeight($account);
        }
        return $y;
    }

    /**
     * ページの印刷
     */
    public function Footer() {
        $this->SetFont('ipaexg', '', 10);
        $this->SetXY(0, $this->getPageHeight() - 10);
        $this->Cell($this->getPageWidth(), 5, "- {$this->getGroupPageNo()} / {$this->getPageGroupAlias()} -", 0, 0, "C");
    }

    /**
     * PDFの印刷
     * 事前にsetCusts、setFileを実行し顧客とファイルをセットすること
     * @throws InternalErrorException
     */
    public function printPdf($isDirectOut = false) {
        foreach ($this->_custs as $cust) {
            $this->startPageGroup();
            $tplIdx = $this->importPage(1);
            $this->addPage();
            $this->useTemplate($tplIdx, null, null, 0, 0, true);

            // 日付
            $this->_printIssueDate();
            // 住所
            $this->_printAddress($cust->zip_cd, $cust->address1, $cust->address2, $cust->address3);
            // 送付先名称
            $this->_printIssueName($cust->issue_name);
            // 顧客CD
            $this->_printCustCd($cust->cust_cd);
            // 設置先名称
            $this->_printName($cust->name);

            $account_count = 0;
            $this->_y = self::START_Y_1PAGE;

            foreach ($cust->accounts as $account) {
                if (empty($account->services)) {
                    continue;
                }
                $account_count++;
                if ($this->_y + $this->_getAccountHeight($account) >= $this->_maxY) {
                    // 改ページ
                    $this->_y = self::START_Y_2PAGE;
                    $tplIdx = $this->importPage(2);
                    $this->addPage();
                    $this->useTemplate($tplIdx, null, null, 0, 0, true);
                    // 日付
                    $this->_printIssueDate();
                    // 顧客CD
                    $this->_printCustCd($cust->cust_cd);
                    // 設置先名称
                    $this->_printName($cust->name);
                }
                $this->_printAccountService($account_count, $account);
            }
            $branckTableCount = 0;
            while ($this->_y + self::BRANK_TABLE_HEIGHT <= $this->_maxY) {
                $branckTableCount++;
                if ($branckTableCount == 1) {
                    $this->SetFont('ipaexg', '', 10);
                    $this->SetXY(0, $this->_y - 7);
                    $this->Cell($this->getPageWidth(), 5, "～　以下、記載なし　～", 0, 0, "C");
                }
                $this->_printBlankTable();
            }
        }

        // PDF出力
        try {
            if ($isDirectOut) {
                $this->setSourceFile(TPL_DIR . DS . 'account' . DS . 'direct_out_pdf_page2.pdf');
                $addTplIdx = $this->importPage(1);
                $this->addPage();
                $this->useTemplate($addTplIdx, null, null, 0, 0, true);
            }
            $this->Output($this->_file, "F");
        } catch (Exception $e) {
            Logger::info($e->getMessage());
            Logger::warning("pdf output error.");
            if (!empty($this->_file)) {
                @unlink($this->_file);
            }
            throw new InternalErrorException();
        }
    }

    /**
     * 発行日の印刷
     */
    private function _printIssueDate() {
        $this->SetFont('ipaexg', '', 10);
        $this->Text(154.3, 11.5, date("Y 年 n 月 j 日"));
    }

    /**
     * 住所の印刷
     * @param type $zipCd
     * @param type $address1
     * @param type $address2
     * @param type $address3
     */
    private function _printAddress($zipCd, $address1, $address2, $address3) {
        // 郵便番号
        $this->SetFont('ipaexg', '', 10);
        $this->Text(18, 4, "〒" . $zipCd);

        // 住所
        $address = "{$address1}　{$address2}　{$address3}";
        $this->SetXY(18, 9);
        $this->MultiCell(82, 50, $address, 0, 'L');
    }

    /**
     * 送付先名称の印刷
     * @param type $issueName
     */
    private function _printIssueName($issueName) {
        $this->SetFont('ipaexg', '', 10);
        $this->SetXY(18, 22.5);
        $this->MultiCell(82, 50, "{$issueName} 御中", 0, 'L');
    }

    /**
     * 顧客CDの印刷
     * @param type $custCd
     */
    private function _printCustCd($custCd) {
        $this->SetFont('ipaexg', '', 10);
        if ($this->getGroupPageNo() == 1) {
            $x = 127;
            $y = 25.2;
        } else {
            $x = 31;
            $y = 7;
        }
        $this->Text($x, $y, $custCd);
    }

    /**
     * 設置場所名称の印刷
     * @param type $name
     */
    private function _printName($name) {
        $this->SetFont('ipaexg', '', 10);
        if ($this->getGroupPageNo() == 1) {
            $x = 103;
            $y = 40;
        } else {
            $x = 41;
            $y = 12;
        }
        $this->SetXY($x, $y);
        $this->MultiCell(78, 9, $name, 0, 'L', false, 1, '', '', true, 0, false, true, 9, 'B');
    }

    /**
     * アカウントとサービスの印刷
     * @param type $accountCount
     * @param type $account
     */
    private function _printAccountService($accountCount, $account) {
        $this->SetFillColor(192, 192, 192);
        if (mb_strlen($account->login_id) >= self::LOGIN_ID_MAX_LENGTH) {
            $this->SetFont('ipaexg', '', 10);
            $this->SetXY(19.5, $this->_y);
            $this->Cell(6, 15, $accountCount, 0, 0, "C", true);
            $login_id1 = mb_substr($account->login_id, 0, self::LOGIN_ID_MAX_LENGTH - 1);
            $login_id2 = mb_substr($account->login_id, self::LOGIN_ID_MAX_LENGTH - 1);
            $this->SetXY(26, $this->_y);
            $this->Cell(141, 5, "ログインID：{$login_id1}", 0, 0, "", true, "", 1);
            $this->SetFont('ipaexg', '', 8.5);
            $this->_y += 5;
            $this->SetXY(26, $this->_y);
            $this->Cell(141, 5, $login_id2, 0, 0, "", true, "", 1);
        } else {
            $this->SetFont('ipaexg', '', 10);
            $this->SetXY(19.5, $this->_y);
            $this->Cell(6, 10, $accountCount, 0, 0, "C", true);
            $this->SetXY(26, $this->_y);
            $this->Cell(141, 5, "ログインID：{$account->login_id}", 0, 0, "", true, "", 1);
        }

        $this->SetFont('ipaexg', '', 10);
        $this->_y += 5;
        $this->SetXY(26, $this->_y);
        if (!empty($account->is_trial) && $account->is_trial === true) {
            $message = "OTORAKUで14日間無料トライアルでご利用頂いたログインID、パスワードです。";
            $password = $account->init_password;
        } else if (empty($account->init_date) && $this->_isInitSkiped === false) {
            $message = "ご利用には初回登録が必要です。";
            $password = $account->init_password;
        } else if (empty($account->init_date) && $this->_isInitSkiped === true) {
            $message = "";
            $password = $account->init_password;
        } else {
            $message = "既に初回登録済みです。";
            // 初期パスワードとパスワードが同じの場合はパスワード印字
            $passwordHashForInitPassword = Cipher::getPasswordHash($account->init_password);
            if (!empty($account->password_hash) && $passwordHashForInitPassword == $account->password_hash) {
                $password = $account->init_password;
            } else {
                $password = "(お客様にて設定されたパスワード)";
            }
        }
        $this->Cell(141, 5, "パスワード：{$password}", 0, 0, "", true);
        $this->_y += 5.5;
        $this->SetFont('ipaexg', '', 10);
        $this->Text(26, $this->_y, $message);
        $this->_y += 5.5;
        $service_count = 0;
        $border = array('LTRB' => array('width' => 0.3, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(128, 128, 128)));
        foreach ($account->services as $service) {
            $service_count++;
            if ($service_count === 1) {
                $this->SetFillColor(216, 216, 216);
                $this->SetXY(47, $this->_y);
                $this->Cell(50, 5, "サービス名称", $border, 0, "", true);
                $this->SetXY(97, $this->_y);
                $this->Cell(35, 5, "ご利用開始可能日", $border, 0, "", true);
                $this->SetXY(132, $this->_y);
                $this->Cell(35, 5, "備考", $border, 0, "", true);
                $this->_y += 5;
            }
            $start_date = new DateTime($service->start_date);

            $biko = "";
            if ($service->admin_status_flag === "1") {
                $biko = "停止中";
            } elseif ($service->stop_count > 0) {
                $biko = "休店中";
            } elseif ($service->lock_count > 0) {
                $biko = "停止中";
            }
            $this->SetXY(47, $this->_y);
            $this->Cell(50, 5, $service->service_name, $border, 0, "", false);
            $this->SetXY(97, $this->_y);
            $this->Cell(35, 5, $start_date->format("Y/n/j"), $border, 0, "", false);
            $this->SetXY(132, $this->_y);
            $this->Cell(35, 5, $biko, $border, 0, "", false);
            $this->_y += 5;
        }
        $this->_y += 10;
    }

    /**
     * 空白表の印刷
     */
    private function _printBlankTable() {
        $this->SetFillColor(192, 192, 192);
        $this->SetXY(19.5, $this->_y);
        $this->Cell(6, 10, " ", 0, 0, "C", true);
        $this->SetXY(26, $this->_y);
        $this->Cell(141, 10, " ", 0, 0, "", true);
        $this->_y += 10.5;
        $this->SetFont('ipaexg', '', 10);
        $this->Text(26, $this->_y, " ");
        $this->_y += 5.5;
        $border = array('LTRB' => array('width' => 0.3, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(128, 128, 128)));
        $this->SetFillColor(216, 216, 216);
        $this->SetXY(47, $this->_y);
        $this->Cell(50, 5, " ", $border, 0, "", true);
        $this->SetXY(97, $this->_y);
        $this->Cell(30, 5, " ", $border, 0, "", true);
        $this->SetXY(127, $this->_y);
        $this->Cell(40, 5, " ", $border, 0, "", true);
        $this->_y += 5;

        $this->SetXY(47, $this->_y);
        $this->Cell(50, 5, " ", $border, 0, "", false);
        $this->SetXY(97, $this->_y);
        $this->Cell(30, 5, " ", $border, 0, "", false);
        $this->SetXY(127, $this->_y);
        $this->Cell(40, 5, " ", $border, 0, "", false);
        $this->_y += 15;
    }

    /**
     * 引数のアカウントをPDF印刷した場合の想定高さを取得する
     * @param type $account
     * @return Integer 高さ
     */
    private function _getAccountHeight($account) {
        $y = 0;
        if (empty($account->services)) {
            return $y;
        }
        if (mb_strlen($account->login_id) >= self::LOGIN_ID_MAX_LENGTH) {
            $y += 15;
        } else {
            $y += 10;
        }
        $y += 11;
        $service_count = 0;
        foreach ($account->services as $service) {
            $service_count++;
            if ($service_count === 1) {
                $y += 5;
            }
            $y += 5;
        }
        $y += 5;
        return $y;
    }

}
