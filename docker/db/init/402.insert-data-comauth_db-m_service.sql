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
-- Dumping data for table `m_service`
--

LOCK TABLES `m_service` WRITE;
/*!40000 ALTER TABLE `m_service` DISABLE KEYS */;
INSERT INTO `m_service` VALUES (1,'100','10','USEN CART','Ucart','http://52.193.102.73/order','《USEN会員限定》店舗用品の通販サービス','<p>USEN CARTは、USEN会員限定でご利用が可能な店舗用品の通販サービスです。\r\nレジロールやアメニティグッズ、掃除用品といった店舗で定期的に補充が必要な消耗品類を\r\nスマホやタブレットから「より簡単に」「より安く」「より便利に」発注が可能です。</p>','logo_u-cart.png',20,'0','0','0','SYSTEM','2014-09-02 16:26:31','SYSTEM','2014-09-02 16:26:31'),(2,'120','12','OTORAKU','otoraku',NULL,'BGMならお任せ！900万曲から選べる！音楽アプリ！','<p>BGM音楽放送の老舗、USENが遂に業務店BGMアプリサービスを開始！\r\nUSEN放送では実現できなかった機能を数多く実現しました！\r\nBGMの未来を変える、それがこの「OTORAKU - 音楽 -」</p>','logo_otoraku.png',10,'1','0','0','SYSTEM','2015-05-18 12:23:01','SYSTEM','2019-04-22 16:21:19'),(3,'130','13','スタシフ','gakusyu',NULL,'「使いやすさ」を 追求した進化する シフト管理システム','<p>スタシフなら、希望シフトを スマホアプリに入力、\r\nアプリが学習し 自動でシフト>作成、\r\n急な欠員も 自動でシフト変更、\r\nシフト管理の負荷を限りなく抑えることが可能です。</p>',NULL,30,'1','0','0','SYSTEM','2016-10-11 12:54:23','SYSTEM','2016-10-11 12:54:23'),(4,'140','14','REACH STOCK（飲食店）','reachstockpcs',NULL,'REACH STOCK（飲食店）','<p>飲食店オーナーさんが全国の生産者さんから直接食材を購入できるECプラットフォームサービス。\r\n生産者と飲食店が直接つながる新しい流通の選択肢です。</p>','logo_reach_stock.jpg',40,'1','1','0','SYSTEM','2016-12-07 15:18:39','SYSTEM','2016-12-09 14:29:52'),(5,'150','15','REACH STOCK（生産者）','reachstockexh','https://exhibitor.reachstock.jp','REACH STOCK（生産者）','<p>飲食店オーナーさんが全国の生産者さんから直接食材を購入できるECプラットフォームサービス。\r\n生産者と飲食店が直接つながる新しい流通の選択肢です。</p>','logo_reach_stock.jpg',50,'1','1','0','SYSTEM','2016-12-07 15:18:41','SYSTEM','2016-12-09 14:29:52'),(17,'160','16','USPOT','Uspot','https://uspot.usen.com','超光速 店舗向けWi-Fiの決定版','<p><img src=\"/img/service/detail/qr_u-spot.png\">U-SPOTはIPv6インターネット接続と業務用 Wi-FiレンタルがセットになったUSENの店舗向けサービスです。管理画面にログインすると、来店客の属性分析・来店客へのプッシュ通知設定機能・業務用SSID・PWの確認などが行えます。<a href=\"https://uspot.usen.com\">https://uspot.usen.com</a></p>','logo_u-spot.png',15,'0','1','0','SYSTEM','2019-04-22 16:21:19','SYSTEM','2019-04-22 16:21:19'),(21,'170','17','デンタル・コンシェルジュ','dental','https://owner-dental.c-concierge.jp/login/','歯科医院専門サービス『デンタル・コンシェルジュ』','<p>「あなたの生活に寄り添う歯医者さんをご紹介」をコンセプトに、歯科医院と患者さまをつなぐ歯科医院専門のポータルサイトです。管理画面にログインすると、掲載している自医院の基本情報から予約情報、価格情報などの更新が行えます（一部項目は有料契約に限る）。スマートフォンからの操作も行えますので、まずは医院の掲載情報を確認し、正確な情報を多くの患者さまへ届けましょう。</p>','logo_dental.png',18,'0','1','0','SYSTEM','2019-09-12 08:58:44','SYSTEM','2019-09-12 08:58:44');
/*!40000 ALTER TABLE `m_service` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-02 11:06:42
