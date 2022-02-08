USE comauth_db;
-- MySQL dump 10.13  Distrib 5.6.19, for Linux (x86_64)
--
-- Host: localhost    Database: comauth_db
-- ------------------------------------------------------
-- Server version	5.6.19

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
-- Dumping data for table `t_unis_service`
--
-- WHERE:  t_unis_cust_id <= 10

LOCK TABLES `t_unis_service` WRITE;
/*!40000 ALTER TABLE `t_unis_service` DISABLE KEYS */;
INSERT INTO `t_unis_service` VALUES (1,1,1,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,'2015-06-02 11:47:59',NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2019-04-18 16:16:22'),(710705,1,1,'130',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-04-19','2016-05-08','2016-04-19 12:05:18',NULL,NULL,'1','0','0',NULL,NULL,'USER','2019-04-18 16:16:22'),(710706,1,1,'130',NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-05-09',NULL,'2016-05-12 20:31:53',NULL,NULL,'0','0','0','SYSTEM','2016-05-09 11:56:54','USER','2019-04-18 16:16:22'),(727715,1,1,'170',3,3,'1','201908',NULL,'Z100999','デンタル','123456','2018-11-15','2019-04-08',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2019-04-08 11:26:43','SYSTEM','2019-04-08 11:26:43'),(2,2,2,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2016-04-01 06:05:15'),(3,3,3,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,'2015-06-03 13:29:15','p7s4e7l850hI3RuH4Pf0cx5ToDBvf0Pd1LFCYHa5KYR7','2015-12-01 12:53:47','0','0','0','SYSTEM','2014-11-20 15:22:10','LoginAuth','2015-12-01 11:53:47'),(4,4,4,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','1','0','SYSTEM','2014-11-20 15:22:10','USER','2019-07-26 12:02:20'),(5,5,5,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,'2015-06-04 10:27:07','tGq66RipnKfnR2242LO48QpaGegyhNOefim7nm4hPuQCaurRFSxE','2015-11-30 03:48:11','0','0','0','SYSTEM','2014-11-20 15:22:10','LoginAuth','2015-11-30 02:48:11'),(6,6,6,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2016-11-08 10:41:39'),(727387,6,6,'140',1,1,'1','201610',NULL,NULL,'REACH STOCK(アプリ)',NULL,NULL,'2016-10-31',NULL,'2016-11-04 16:26:26','VHMmvEGefcket7QSEPRrlEHuL3w4y5eLNdwOSQNIyOYhfIL09','2019-01-23 14:11:22','0','0','0','SYSTEM','2016-10-31 14:44:48','LoginAuth','2019-01-23 13:11:22'),(727399,6,6,'150',1,1,'1','201610',NULL,NULL,'REACH STOCK(生産者WEB)',NULL,NULL,'2016-10-31',NULL,'2016-11-17 15:38:53','HpuYM2prwqBvmLUjuE2NWER8mMmgCTkhqZh7ZKggfxWHDY8fJxjqgaDZ','2019-03-29 11:19:55','0','0','0','SYSTEM','2016-10-31 14:45:10','LoginAuth','2019-03-29 10:19:55'),(7,7,7,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','SYSTEM','2014-11-20 15:22:10'),(727297,7,7,'130',1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-06-17',NULL,'2016-06-17 17:52:35','vWadv0bXfARPmfvuNMvex1NpU9SwYXOCQJwPYm05Blz','2017-05-22 12:38:19','0','0','0','SYSTEM','2016-06-17 17:41:20','LoginAuth','2017-05-22 11:38:19'),(8,8,8,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','SYSTEM','2014-11-20 15:22:10'),(727310,8,8,'130',1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-07-26',NULL,'2016-07-26 10:15:16','n15bS4wAYjDzc6bBnWvskWalgBFHrl6F7ZOgOwmH30yxYn8WwxBYH','2016-08-16 11:42:38','0','0','0',NULL,NULL,'LoginAuth','2016-08-16 10:42:38'),(9,9,9,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'1','0','0','SYSTEM','2014-11-20 15:22:10','USER','2015-12-24 14:52:27'),(710701,9,9,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2015-12-24','2015-12-25',NULL,NULL,NULL,'1','0','0','SYSTEM','2015-12-24 14:28:18','USER','2015-12-24 14:52:27'),(10,10,10,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,'2015-06-02 12:07:33','biLl1EnosVXikh8nHqHzbTHUgfFkaXUabmVe11BN6ixKNoFOm8Trj','2015-12-01 12:38:46','0','0','0','SYSTEM','2014-11-20 15:22:10','LoginAuth','2015-12-01 11:38:46'),(12,12,12,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2016-04-01 06:05:15'),(13,13,13,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2016-04-01 06:05:15'),(14,14,14,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2016-04-01 06:05:15'),(15,15,15,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2016-04-01 06:05:15'),(16,16,35,'120','1','2','1','202006',NULL,'Z100781','OTORAKU(ICT施策2年)(施工なし)','111111','2020/03/10','2020/03/12',NULL,'2020/03/12 15:02:57','UGkWoz1sFByvVCPT14oLPEFzvwUAfwV0nnFWyc7O1RUg9LJ','2020/03/12 16:02:57','0','0','0','unis_service','2020/03/12 14:54:55','LoginAuth','2020/03/12 15:02:57');
INSERT INTO `t_unis_service` VALUES (NULL,9,9,'120',NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,'2015-12-24',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2015-12-24 14:28:18','USER','2015-12-24 14:52:27');
INSERT INTO `t_unis_service` VALUES (NULL,1,1,'120',1,1,2,'202004',NULL,'Z100781','OTORAKU(ICT施策2年)(施工なし)','1234567','2020-04-08','2020-04-08',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2015-12-24 14:28:18','USER','2015-12-24 14:52:27');
INSERT INTO `t_unis_service` VALUES (NULL,2,2,'120',1,1,4,'202003','202004','Z100781','OTORAKU(ICT施策2年)(施工なし)','1234567','2020-04-08','2020-04-08','2020-04-08',NULL,NULL,NULL,'1','0','0','SYSTEM','2015-12-24 14:28:18','USER','2015-12-24 14:52:27');
INSERT INTO `t_unis_service` VALUES (1666677333,650130,11,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,'2020-09-14','2020-09-27','2020-09-14 11:25:44',NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677334,650130,12,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677335,650130,13,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677336,650130,14,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677337,650130,15,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677338,650130,16,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677339,650130,17,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677340,650130,18,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677341,650130,19,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677342,650130,20,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1000001',NULL,NULL,NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:43','1','2020-08-05 09:00:43'),(1666677343,650131,21,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677344,650131,21,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677345,650131,21,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677346,650131,22,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677347,650131,22,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677348,650131,22,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677349,650131,23,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677350,650131,23,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677351,650131,23,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677352,650131,24,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677353,650131,24,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677354,650131,24,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677355,650131,25,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677356,650131,25,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677357,650131,25,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677358,650131,26,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677359,650131,26,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677360,650131,26,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677361,650131,27,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677362,650131,27,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677363,650131,27,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677364,650131,28,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677365,650131,28,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677366,650131,28,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677367,650131,29,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677368,650131,29,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677369,650131,29,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677370,650131,30,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677371,650131,30,'120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55'),(1666677372,650131,30,'130',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2000001',NULL,'2020-08-05',NULL,NULL,NULL,NULL,'0','0','0','1','2020-08-05 09:00:55','1','2020-08-05 09:00:55');
INSERT INTO `t_unis_service` VALUES (NULL,17,36,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2019-04-18 16:16:22');
INSERT INTO `t_unis_service` VALUES (NULL,17,36,'120',1,1,1,'202003',NULL,'Z100781','OTORAKU(ICT施策2年)(施工なし)','1234567',NULL,'2020-04-08',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2015-12-24 14:28:18','USER','2015-12-24 14:52:27');
INSERT INTO `t_unis_service` VALUES (10012,10012,10012,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2014-10-01',NULL,'2015-06-02 11:47:59',NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2019-04-18 16:16:22');
INSERT INTO `t_unis_service` VALUES (NULL,18,37,'100',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-02-08',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2014-11-20 15:22:10','USER','2019-04-18 16:16:22');
INSERT INTO `t_unis_service` VALUES (NULL,18,37,'180',1,1,1,'202203',NULL,'Z101144','WEDDING　MUSIC　BOX利用料','999999',NULL,'2022-02-08',NULL,NULL,NULL,NULL,'0','0','0','SYSTEM','2015-12-24 14:28:18','USER','2015-12-24 14:52:27');

/*!40000 ALTER TABLE `t_unis_service` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-02 11:05:38
