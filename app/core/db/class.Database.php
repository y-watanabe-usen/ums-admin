<?php

class Database {

    //ログ出力用
    public $logAll;
    public $logSql;
    public $logBind;
    public $logRow;
    public $logTransaction;
    // 各DBのコネクション保持用
    private $_dbLnk;
    private $_dbInf;
    // SQL実行時のエンコード指定
    private $execFinalToEncoding = '';  //最終的なエンコード先
    private $execFromToEncoding = '';       //エンコード元
    private static $_singleton;

    /**
     * インスタンス取得
     *
     * @since  2011-11-07
     * @author Imaeda
     */
    public static function getInstance() {
        if (!is_object(self::$_singleton)) {
            self::$_singleton = new self;
        }
        return self::$_singleton;
    }

    /**
     * コンストラクタ
     *
     * @since  2011-11-07
     * @author Imaeda
     */
    private function __construct() {
        $config = Configure::$database;

        $this->_dbLnk = array();
        $this->logAll = false;
        $this->logSql = false;
        $this->logBind = false;
        $this->logRow = false;
        $this->logTransaction = false;

        $this->_dbInf = array();
        if (!empty($config)) {
            $this->logAll = isset($config['logAll']) ? $config['logAll'] : false;
            $this->logSql = isset($config['logSql']) ? $config['logSql'] : false;
            $this->logBind = isset($config['logBind']) ? $config['logBind'] : false;
            $this->logRow = isset($config['logRow']) ? $config['logRow'] : false;
            $this->logTransaction = isset($config['logTransaction']) ? $config['logTransaction'] : false;
            foreach ($config['connect'] as $key => $value) {
                $this->_dbInf[$key] = $value;
            }
        }
    }

    /**
     * データベースに接続する
     *
     * @param  $db 接続先DB
     * @return なし
     */
    public function dbConnect($db) {

        if (isset($this->_dbLnk[$db])) {
            return;
        }

        $dbinfo = $this->_dbInf[$db];

        if (!array_key_exists(0, $dbinfo)) {
            $dbinfo = array($dbinfo);
        }

        foreach ($dbinfo as $key => $value) {
            try {
                if (empty($value['host'])) {
                    Logger::log("[WARN]データベース設定が不正です。[db:" . $db . "]");
                    continue;
                }
                if ($value['driver'] == 'oci') {
                    $host = $value['host'];
                    $sid = $value['database'];
                    $user = $value['user'];
                    $pass = $value['password'];
                    $dsn = "oci:dbname=//${host}/${sid}";

                    putenv("NLS_LANG=Japanese_Japan.AL32UTF8");
                    $this->_dbLnk[$db] = new PDO($dsn, $user, $pass, array(PDO::ATTR_PERSISTENT => false));
                    break;
                } else {
                    $host = $value['host'];
                    $dbName = $value['database'];
                    $user = $value['user'];
                    $pass = $value['password'];
                    $dsn = "mysql:host=$host;dbname=$dbName";

                    $this->_dbLnk[$db] = new PDO($dsn, $user, $pass, array(PDO::ATTR_PERSISTENT => false));
                    $this->_dbLnk[$db]->exec("SET NAMES " . $value["charaset"]);
                    break;
                }
            } catch (PDOException $e) {
                $message = "[ERROR]データベースの接続に失敗しました。[" . $dsn . "]" . " (" . $e->getMessage() . ")";
                Logger::err($message);
                // Try Next
            }
        }

        // 全てのDB接続が失敗した場合
        if (!isset($this->_dbLnk[$db])) {
            throw new DbException("DB CONNECT");
        }

        // PDOException発行のためオプション設定
        $this->_dbLnk[$db]->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return;
    }

    /**
     * dbLinkを取得する
     *
     * @param  $db 接続先DB
     * @return dbLink
     */
    public function getDBLink($db) {
        $this->dbConnect($db);
        return $this->_dbLnk[$db];
    }

    /**
     * データベースを切断する
     *
     * @param  $db 接続先DB
     * @return なし
     */
    public function dbClose($db) {
        $this->_dbLnk[$db] = null;
        return;
    }

    /**
     * トランザクション開始
     *
     * @param  $db 接続先DB
     * @return なし
     */
    public function dbBeginTransaction($db) {
        if ($this->_dbLnk[$db]->inTransaction()) {
            return;
        }
        if ($this->logTransaction || $this->logAll) {
            Logger::debug("BEGIN TRANSACTION {$db}");
        }
        $this->_dbLnk[$db]->beginTransaction();
    }

    /**
     * コミット
     *
     * @param  $db 接続先DB
     * @return なし
     */
    public function dbCommit($db) {
        if (!$this->_dbLnk[$db]->inTransaction()) {
            return;
        }
        if ($this->logTransaction || $this->logAll) {
            Logger::debug("COMMIT {$db}");
        }
        $this->_dbLnk[$db]->commit();
    }

    /**
     * ロールバック
     *
     * @param  $db 接続先DB
     * @return なし
     */
    public function dbRollback($db) {
        if (!$this->_dbLnk[$db]->inTransaction()) {
            return;
        }
        if ($this->logTransaction || $this->logAll) {
            Logger::debug("ROLLBACK {$db}");
        }
        $this->_dbLnk[$db]->rollBack();
    }

    /**
     * クエリの実行
     *
     * @param  $db 接続先DB
     * @param  $sql 実行SQL
     * @return dbLink
     */
    public function dbExec($db, $sql) {

        if ($this->logSql || $this->logAll) {
            Logger::debug("QUERRY [ " . $sql . " ]");
        }

        try {
            $this->_dbLnk[$db]->exec($sql);
        } catch (PDOException $err) {
            $message = "[ERROR]クエリー実行に失敗しました。[" . $sql . "]";
            Logger::log($message);
            throw new DbException("DB EXEC ERR");
        }

        return;
    }

    /**
     * クエリの実行
     *
     * @param  $db 接続先DB
     * @param  $sql 実行SQL
     * @param  $bindParam バインドパラメータ
     * @return dbLink
     */
    public function dbExecute($db, $sql, $bindParam = array()) {
        $this->dbConnect($db);

        if ($this->logSql || $this->logAll) {
            Logger::debug("DB [{$db}]");
            Logger::debug($this->_dbLnk[$db]->getAttribute(PDO::ATTR_CONNECTION_STATUS));
            Logger::debug("QUERRY [ " . $sql . " ]");
        }

        try {
            $stmt = $this->_dbLnk[$db]->prepare($sql);
        } catch (Exception $err) {
            Logger::log("ERR: " . $err->getCode() . " : " . $err->getMessage());
            throw new DbException("DB BIND ERR");
        } catch (PDOException $err) {
            Logger::log("ERRPDO: " . $err->getCode() . " : " . $err->getMessage());
            throw new DbException("DB BIND ERR");
        }

        if ($bindParam && count($bindParam) > 0) {
            if ($this->logBind || $this->logAll) {
                Logger::debug("BIND PARAM");
                Logger::debug($bindParam);
            }
        }

        $i = 0;
        foreach ($bindParam as $k => $v) {
            $key[$i] = $k;
            $val[$i] = $v;
            $i++;
        }

        for ($j = 0; $j < $i; $j++) {
            try {
                $stmt->bindParam($key[$j], $val[$j]);
            } catch (PDOException $err) {
                $message = "[ERROR]バインドに失敗しました。[" . $key[$j] . " / " . $val[$j] . "]";
                Logger::log($message);
                throw new DbException("DB BIND ERR");
            }
        }

        try {
            $stmt->execute();
        } catch (PDOException $err) {
            $message = "[ERROR]クエリー実行に失敗しました。[" . $sql . "]";
            Logger::log($message);
            Logger::log($err->getMessage());
            throw new DbException("DB EXECUTE ERR");
        }

        return $stmt;
    }

    /**
     * フェッチALL
     *
     * @param  $result クエリ実行結果
     * @return $row
     */
    public function dbFetchAll($result) {

        $row = array();

        try {
            $row = $result->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $err) {
            $message = "[ERROR]フェッチに失敗しました。";
            Logger::log($message);
            throw new DbException("DB FETCH ERR");
        }

        if ($this->logRow || $this->logAll) {
            Logger::debug("ROW");
            Logger::debug($row);
            Logger::debug("CURSOR CLOSE");
        }
        $result->closeCursor();

        return $row;
    }

    /**
     * フェッチ
     *
     * @param  $result クエリ実行結果
     * @return $row
     */
    public function dbFetch($result) {

        $row = array();

        try {
            $row = $result->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $err) {
            $message = "[ERROR]フェッチに失敗しました。";
            Logger::log($message);
            throw new DbException("DB FETCH ERR");
        }

        if ($row != "") {
            if ($this->logRow || $this->logAll) {
                Logger::debug("ROW");
                Logger::debug($row);
            }
        } else {
            if ($this->logRow || $this->logAll) {
                Logger::debug("CURSOR CLOSE");
            }
            $result->closeCursor();
        }

        return $row;
    }

    /**
     * dbExecute+フェッチALL
     *
     * @param  $result クエリ実行結果
     * @return $row
     */
    public function dbExecFetchAll($db, $sql, $bindParam = array()) {

        $fetchResult = array();
        try {
            $exResult = $this->dbExecute($db, $sql, $bindParam);
            $fetchResult = $this->dbFetchAll($exResult);
        } catch (Exception $e) {
            throw $e;
        }
        return $fetchResult;
    }

    /**
     * dbExecute+フェッチ
     *
     * @param  $result クエリ実行結果
     * @return $row
     */
    public function dbExecFetch($db, $sql, $bindParam = array()) {

        $fetchResult = array();
        try {
            $exResult = $this->dbExecute($db, $sql, $bindParam);
            $fetchResult = $this->dbFetch($exResult);
        } catch (Exception $e) {
            throw $e;
        }
        return $fetchResult;
    }

}
