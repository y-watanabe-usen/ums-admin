USE admin_db;
-- MySQL dump 10.13  Distrib 5.6.20, for Linux (x86_64)
--
-- Host: localhost    Database: admin_db
-- ------------------------------------------------------
-- Server version	5.6.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `m_role`
--

LOCK TABLES `m_role` WRITE;
/*!40000 ALTER TABLE `m_role` DISABLE KEYS */;
INSERT INTO `m_role` VALUES (1,'ROLE_LOGIN','ログイン権限','ログインが行える権限（他の権限は必ず本権限を持つ）','0','SYSTEM','2014-09-02 16:28:26','SYSTEM','2014-09-02 16:28:26'),(2,'ROLE_SAVE_ACCOUNT','アカウント情報変更権限','アカウント情報の変更ができる権限','0','SYSTEM','2014-09-02 16:28:26','SYSTEM','2014-09-02 16:28:26'),(3,'ROLE_SAVE_SERVICE','サービス強制停止権限','アカウントのサービス強制停止が行える権限','0','SYSTEM','2014-09-02 16:28:26','SYSTEM','2014-09-02 16:28:26'),(4,'ROLE_PUBLISH_DOWNLOAD','発送ダウンロード権限','発送データCSVのダウンロードが行える権限','0','SYSTEM','2014-09-02 16:28:26','SYSTEM','2014-09-02 16:28:26'),(5,'ROLE_PUBLISH_UPLOAD','発送アップロード権限','発送データCSVのアップロードが行える権限','0','SYSTEM','2014-09-02 16:28:26','SYSTEM','2014-09-02 16:28:26'),(6,'ROLE_NOT_ARRIVED_UPLOAD','未着アップロード権限','未着データCSVのアップロードが行える権限','0','SYSTEM','2014-09-02 16:28:26','SYSTEM','2014-09-02 16:28:26'),(7,'ROLE_INITED_CUST_CD_DOWNLOAD','初回登録顧客抽出権限','初回登録顧客抽出が行える権限','0','SYSTEM','2015-02-27 13:58:16','SYSTEM','2015-02-27 13:58:16'),(8,'ROLE_PUBLISH_OUTPUT','発送アップロード+発送データ出力権限','未着データCSVのアップロードと発送データ出力が行える権限','0','SYSTEM','2015-02-27 13:58:19','SYSTEM','2015-02-27 13:58:19'),(9,'ROLE_INS_ISSUE_HISTORY','アカウント証再送登録権限','アカウント証再送登録、再送不要が行える権限','0','SYSTEM','2015-05-18 15:06:39','SYSTEM','2015-05-18 15:06:39'),(10,'ROLE_TRIAL_SEARCH','お試しアカウント検索権限','お試しアカウントの検索が行える権限','0','SYSTEM','2015-05-18 15:06:41','SYSTEM','2015-05-18 15:06:41'),(11,'ROLE_TRIAL_CREATE','お試しアカウント発行権限','お試しアカウントの発行、CSVダウンロードが行える権限','0','SYSTEM','2015-05-18 15:06:44','SYSTEM','2015-05-18 15:06:44'),(12,'ROLE_DEMO_SEARCH','デモアカウント検索権限','デモアカウントの検索が行える権限','0','SYSTEM','2015-05-18 15:06:46','SYSTEM','2015-05-18 15:06:46'),(13,'ROLE_DEMO_CREATE','デモアカウント発行権限','デモアカウントの発行、CSVダウンロードが行える権限','0','SYSTEM','2015-05-18 15:06:48','SYSTEM','2015-05-18 15:06:48'),(14,'ROLE_BRANCH_SEARCH','支店別顧客管理検索権限','支店別顧客管理の検索が行える権限','0','SYSTEM','2015-05-18 15:06:50','SYSTEM','2015-05-18 15:06:50'),(15,'ROLE_BRANCH_DOWNLOAD','支店別顧客管理ダウンロード権限','支店別顧客管理のCSVダウンロードが行える権限','0','SYSTEM','2015-05-18 15:06:52','SYSTEM','2015-05-18 15:06:52'),(16,'ROLE_ROLE_MANAGEMENT','権限管理権限','権限管理の操作が行える権限','0','SYSTEM','2015-06-23 12:18:42','SYSTEM','2015-06-23 12:18:42'),(17,'ROLE_ID_PW_DOWNLOAD','ID/PW抽出権限','ID/PW抽出（顧客CD指定）が行える権限','0','SYSTEM','2015-08-26 17:15:45','SYSTEM','2015-08-26 17:15:45'),(18,'ROLE_ISSUE_HISTORY_DOWNLOAD','アカウント証発送履歴抽出権限','アカウント証発送履歴抽出が行える権限','0','SYSTEM','2015-08-26 17:15:47','SYSTEM','2015-08-26 17:15:47'),(19,'ROLE_DIRECT_PDF','アカウント証PDFダイレクト出力権限','アカウント一覧画面でアカウント証PDF発行が行える権限','0','SYSTEM','2016-01-21 11:35:54','SYSTEM','2016-01-21 11:35:54'),(20,'ROLE_MAIL_ADDRESS_IMPORT','メールアドレス初回登録・仮ID/PW抽出権限','メールアドレス初回登録・仮ID/PW抽出が行える権限','0','SYSTEM','2016-05-24 11:25:41','SYSTEM','2016-05-24 11:25:41'),(21,'ROLE_CHAIN_STORE_IMPORT','書面契約済顧客用 メールアドレス初回登録・初期ID/PW抽出','チェーン店のメールアドレス・チェーン店権限区分・初回登録が実施できる権限','0','SYSTEM','2016-08-23 11:00:10','SYSTEM','2016-08-23 11:00:10'),(22,'ROLE_BULK_SERVICE','サービス一括強制施錠／開錠','複数顧客に対して一括でサービスの強制施錠／開錠処理を実施できる権限','0','SYSTEM','2016-08-23 11:00:10','SYSTEM','2016-08-23 11:00:10');
INSERT INTO `m_role` VALUES (23,'ROLE_UNLOCK','開錠権限','U-cart・OTORAKUのみ行える開錠権限','0','SYSTEM','2020-04-03 11:28:26','SYSTEM','2020-04-03 11:28:26');
/*!40000 ALTER TABLE `m_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-02 11:06:52
