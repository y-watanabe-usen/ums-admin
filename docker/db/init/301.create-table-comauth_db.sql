USE comauth_db;

-- MySQL dump 10.13  Distrib 5.6.20, for Linux (x86_64)
--
-- Host: localhost    Database: comauth_db
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
-- Table structure for table `m_account`
--

DROP TABLE IF EXISTS `m_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `m_account` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_cust_id` int(10) NOT NULL,
  `login_id` text NOT NULL,
  `hash_login_id` varchar(64) NOT NULL,
  `init_password` text,
  `password` varchar(64) NOT NULL,
  `mail_address` text,
  `hash_mail_address` varchar(64) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `pause_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `init_date` date DEFAULT NULL,
  `account_div` char(1) NOT NULL DEFAULT '0',
  `status_flag` char(1) NOT NULL DEFAULT '0',
  `admin_status_flag` char(1) NOT NULL DEFAULT '0',
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash_login_id` (`hash_login_id`,`delete_flag`),
  KEY `t_unis_cust_id` (`t_unis_cust_id`),
  KEY `hash_mail_address` (`hash_mail_address`),
  KEY `account_div` (`account_div`)
) ENGINE=InnoDB AUTO_INCREMENT=1666672023 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `m_mail_template`
--

DROP TABLE IF EXISTS `m_mail_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `m_mail_template` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `template_name` varchar(40) NOT NULL,
  `mail_type` varchar(100) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `m_market`
--

DROP TABLE IF EXISTS `m_market`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `m_market` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `account_div` char(1) NOT NULL,
  `market_cd` varchar(7) NOT NULL,
  `market_name` varchar(40) NOT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `m_service`
--

DROP TABLE IF EXISTS `m_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `m_service` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `service_cd` varchar(3) NOT NULL,
  `service_div` varchar(2) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `catch` varchar(255) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sort_order` int(10) NOT NULL DEFAULT '0',
  `determinable_send_flag` char(1) NOT NULL DEFAULT '0',
  `demo_unable_flag` char(1) NOT NULL DEFAULT '0',
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_cd` (`service_cd`,`delete_flag`),
  UNIQUE KEY `identifier` (`identifier`,`delete_flag`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `s_preference`
--

DROP TABLE IF EXISTS `s_preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `s_preference` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `value` varchar(200) NOT NULL,
  `keyname` varchar(200) NOT NULL,
  `sort` int(10) NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_account_init_imported`
--

DROP TABLE IF EXISTS `t_account_init_imported`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_account_init_imported` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `m_account_id` int(10) NOT NULL,
  `required_param` varchar(255) DEFAULT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `m_account_id` (`m_account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_batch`
--

DROP TABLE IF EXISTS `t_batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_batch` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `batch_name` varchar(40) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `log` varchar(500) DEFAULT NULL,
  `status_flag` char(1) NOT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=715 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_chain_authority_div`
--

DROP TABLE IF EXISTS `t_chain_authority_div`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_chain_authority_div` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_cust_id` int(10) NOT NULL,
  `authority_div` char(1) NOT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_unis_cust_id` (`t_unis_cust_id`,`delete_flag`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_chain_pdf_history`
--

DROP TABLE IF EXISTS `t_chain_pdf_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_chain_pdf_history` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_cust_id` int(10) NOT NULL,
  `print_user_id` int(10) NOT NULL,
  `print_date` date NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `zip_cd` varchar(8) DEFAULT NULL,
  `address1` varchar(50) DEFAULT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `address3` varchar(50) DEFAULT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_direct_pdf_history`
--

DROP TABLE IF EXISTS `t_direct_pdf_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_direct_pdf_history` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_cust_id` int(10) NOT NULL,
  `print_user_id` int(10) NOT NULL,
  `print_date` date NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `zip_cd` varchar(8) DEFAULT NULL,
  `address1` varchar(50) DEFAULT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `address3` varchar(50) DEFAULT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_issue_history`
--

DROP TABLE IF EXISTS `t_issue_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_issue_history` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_cust_id` int(10) NOT NULL,
  `issue_date` date DEFAULT NULL,
  `not_arrived_date` date DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `zip_cd` varchar(8) DEFAULT NULL,
  `address1` varchar(50) DEFAULT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `address3` varchar(50) DEFAULT NULL,
  `branch_cd` varchar(10) DEFAULT NULL,
  `can_flag` char(1) DEFAULT '0',
  `status_flag` char(1) NOT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status_flag` (`status_flag`),
  KEY `t_unis_cust_id` (`t_unis_cust_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1666671848 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_r_issue_history`
--

DROP TABLE IF EXISTS `t_r_issue_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_r_issue_history` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_service_id` int(10) NOT NULL,
  `status_flag` char(1) NOT NULL DEFAULT '0',
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_unis_service_id` (`t_unis_service_id`,`delete_flag`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_service_change_history`
--

DROP TABLE IF EXISTS `t_service_change_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_service_change_history` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_service_id` int(10) NOT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_unis_service_id` (`t_unis_service_id`,`delete_flag`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_service_stop_history`
--

DROP TABLE IF EXISTS `t_service_stop_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_service_stop_history` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_service_id` int(10) NOT NULL,
  `stop_div` char(1) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `release_datetime` datetime DEFAULT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `t_unis_service_id` (`t_unis_service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_session`
--

DROP TABLE IF EXISTS `t_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_session` (
  `session_id` varchar(255) NOT NULL,
  `session_data` text,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_trial_days`
--

DROP TABLE IF EXISTS `t_trial_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_trial_days` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `m_account_id` int(10) NOT NULL,
  `trial_days` int(4) NOT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_account_id` (`m_account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=835 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_ucart_send`
--

DROP TABLE IF EXISTS `t_ucart_send`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_ucart_send` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_cust_id` int(10) NOT NULL,
  `m_account_id` int(10) NOT NULL,
  `register_div` char(1) NOT NULL DEFAULT '0',
  `status_flag` char(1) NOT NULL DEFAULT '0',
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `t_unis_cust_id` (`t_unis_cust_id`),
  KEY `m_account_id` (`m_account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_unis_cust`
--

DROP TABLE IF EXISTS `t_unis_cust`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_unis_cust` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `cust_cd` varchar(9) NOT NULL,
  `cust_div` varchar(1) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `name_kana` varchar(40) DEFAULT NULL,
  `zip_cd` varchar(8) DEFAULT NULL,
  `state_cd` varchar(2) DEFAULT NULL,
  `state_name` varchar(10) DEFAULT NULL,
  `address1` varchar(50) DEFAULT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `address3` varchar(50) DEFAULT NULL,
  `tel` text,
  `hash_tel` varchar(64) DEFAULT NULL,
  `issue_name` varchar(40) DEFAULT NULL,
  `issue_zip_cd` varchar(8) DEFAULT NULL,
  `issue_state_cd` varchar(2) DEFAULT NULL,
  `issue_state_name` varchar(10) DEFAULT NULL,
  `issue_address1` varchar(50) DEFAULT NULL,
  `issue_address2` varchar(50) DEFAULT NULL,
  `issue_address3` varchar(50) DEFAULT NULL,
  `issue_tel` text,
  `issue_hash_tel` varchar(64) DEFAULT NULL,
  `branch_cd` varchar(10) DEFAULT NULL,
  `branch_name` varchar(40) DEFAULT NULL,
  `chain_cd` varchar(6) DEFAULT NULL,
  `chain_name` varchar(30) DEFAULT NULL,
  `industry_cd` varchar(6) DEFAULT NULL,
  `industry_name` varchar(30) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `cancel_date` date DEFAULT NULL,
  `status_flag` varchar(1) NOT NULL,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cust_cd` (`cust_cd`,`delete_flag`),
  KEY `hash_tel` (`hash_tel`),
  KEY `issue_hash_tel` (`issue_hash_tel`),
  KEY `branch_cd` (`branch_cd`),
  KEY `chain_cd` (`chain_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=1666671568 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_unis_service`
--

DROP TABLE IF EXISTS `t_unis_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_unis_service` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `t_unis_cust_id` int(10) NOT NULL,
  `m_account_id` int(10) NOT NULL,
  `service_cd` varchar(3) NOT NULL,
  `cont_no` int(10) DEFAULT NULL,
  `detail_no` int(10) DEFAULT NULL,
  `detail_status_div` char(1) DEFAULT NULL,
  `detail_start_month` varchar(6) DEFAULT NULL,
  `detail_end_month` varchar(6) DEFAULT NULL,
  `item_cd` varchar(7) DEFAULT NULL,
  `item_name` varchar(30) DEFAULT NULL,
  `market_cd` varchar(7) DEFAULT NULL,
  `decide_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `init_auth_datetime` datetime DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `token_expire` datetime DEFAULT NULL,
  `status_flag` char(1) NOT NULL DEFAULT '0',
  `admin_status_flag` char(1) NOT NULL DEFAULT '0',
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`,`delete_flag`),
  KEY `t_unis_cust_id` (`t_unis_cust_id`,`cont_no`,`detail_no`),
  KEY `m_account_id` (`m_account_id`,`service_cd`,`status_flag`),
  KEY `service_cd` (`service_cd`,`detail_status_div`,`init_auth_datetime`,`item_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=1666677330 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_url_values`
--

DROP TABLE IF EXISTS `t_url_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_url_values` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `key_id` varchar(200) NOT NULL,
  `m_account_id` int(10) NOT NULL,
  `process_div` varchar(40) NOT NULL,
  `expire` datetime NOT NULL,
  `value` text,
  `delete_flag` char(1) NOT NULL DEFAULT '0',
  `created_by` varchar(40) DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_id` (`key_id`,`delete_flag`)
) ENGINE=InnoDB AUTO_INCREMENT=377 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-02  9:28:01
