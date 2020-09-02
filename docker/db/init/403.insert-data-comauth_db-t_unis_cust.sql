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
-- Dumping data for table `t_unis_cust`
--
-- WHERE:  cust_cd LIKE 'admin%'

LOCK TABLES `t_unis_cust` WRITE;
/*!40000 ALTER TABLE `t_unis_cust` DISABLE KEYS */;

INSERT INTO `t_unis_cust` VALUES (1,'admin0001','1','テストデータ0001','ﾃｽﾄﾃﾞｰﾀ0001','150-0045','13','東京都','渋谷区神泉町','９－８','ビル１Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:24','SYSTEM','2014-11-20 15:21:24'),(2,'000000002','1','テストデータ0002','ﾃｽﾄﾃﾞｰﾀ0002','150-0045','13','東京都','渋谷区神泉町','９－８','ビル２Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:24','SYSTEM','2014-11-20 15:21:24'),(3,'admin0003','1','テストデータ0003','ﾃｽﾄﾃﾞｰﾀ0003','150-0045','13','東京都','渋谷区神泉町','９－８','ビル３Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:24','SYSTEM','2014-11-20 15:21:24'),(4,'admin0004','1','テストデータ0004','ﾃｽﾄﾃﾞｰﾀ0004','150-0045','13','東京都','渋谷区神泉町','９－８','ビル４Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:39','SYSTEM','2014-11-20 15:21:39'),(5,'admin0005','1','テストデータ0005','ﾃｽﾄﾃﾞｰﾀ0005','150-0045','13','東京都','渋谷区神泉町','９－８','ビル５Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:39','SYSTEM','2014-11-20 15:21:39'),(6,'admin0006','1','テストデータ0006','ﾃｽﾄﾃﾞｰﾀ0006','150-0045','13','東京都','渋谷区神泉町','９－８','ビル６Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:39','SYSTEM','2014-11-20 15:21:39'),(7,'admin0007','1','USEN Cafe','ﾕｰｾﾝ ｶﾌｪ','150-0045','13','東京都','渋谷区神泉町','９－８','ビル７Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:44','SYSTEM','2014-11-20 15:21:44'),(8,'admin0008','1','テストデータ0008','ﾃｽﾄﾃﾞｰﾀ0008','150-0045','13','東京都','渋谷区神泉町','９－８','ビル８Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:44','SYSTEM','2014-11-20 15:21:44'),(9,'admin0009','1','テストデータ0009','ﾃｽﾄﾃﾞｰﾀ0009','150-0045','13','東京都','渋谷区神泉町','９－８','ビル９Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:44','SYSTEM','2014-11-20 15:21:44'),(10,'admin0010','1','テストデータ0010','ﾃｽﾄﾃﾞｰﾀ0010','150-0045','13','東京都','渋谷区神泉町','９－８','ビル１０Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:48','SYSTEM','2014-11-20 15:21:48'),(12,'000000012','1','テストデータ0012','ﾃｽﾄﾃﾞｰﾀ0012','150-0045','13','東京都','渋谷区神泉町','９－８','ビル２Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:24','SYSTEM','2014-11-20 15:21:24'),(13,'000000013','1','テストデータ0013','ﾃｽﾄﾃﾞｰﾀ0013','150-0045','13','東京都','渋谷区神泉町','９－８','ビル２Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:24','SYSTEM','2014-11-20 15:21:24');
INSERT INTO t_unis_cust VALUES (650130, 'trial001', '1', 'お試しアカウント用顧客', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2', '0', 'SYSTEM', '2015/06/02 11:13:23', 'SYSTEM', '2015/06/02 11:13:23');
INSERT INTO t_unis_cust VALUES (650131, 'demo001', '1', 'デモアカウント用顧客', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2', '0', 'SYSTEM', '2015/06/02 11:13:23', 'SYSTEM', '2015/06/02 11:13:23');
INSERT INTO `t_unis_cust` VALUES (11,'admin0011','1','テストデータ0011','ﾃｽﾄﾃﾞｰﾀ0011','150-0045','13','東京都','渋谷区神泉町','９－８','ビル１Ｆ','PtqYo5opaLyF3M3pgiTl8LcGgb70tQy3BYtXOKohcS51BRRvhy+iP0hfCQAcFPXAQ9dNRHWxKb8pNs/MmjR/YNgvEH50bSiIJ+Ux8C8oua3qji8CL8IobAcjxcZb34o79ZLFxsaesqFdgoK8lb9fd7j3UVd3q+FwWJmclKpMIY8xKYe4zno0/cPo15QbJEwZoxXyi8lnXyDRf5H2yonKSQuTti3vL4eOG7XCodx7oU4Wl4PxYnzXVj5BbmgRPose3j5anVhKLIHHBpsw6a0yvvLsgl1SZhNdKLxQ9wcy2eQTEfD7gujgVqBaJtNQ7ta4Zjqi/dhQHBvjg0z/IXcHuQ==','8d2b0ee9aa0e4ef539f87eba207df8f4b45fa823295c96a04b01e5b2c442344f',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0204140700','東京統括支店青山',NULL,NULL,'001699','その他　会社関連','2014-10-01',NULL,NULL,'2','0','SYSTEM','2014-11-20 15:21:24','SYSTEM','2014-11-20 15:21:24');

/*!40000 ALTER TABLE `t_unis_cust` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-02 11:03:54
