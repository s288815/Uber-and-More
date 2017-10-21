-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.14 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for uber
CREATE DATABASE IF NOT EXISTS `uber` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `uber`;

-- Dumping structure for table uber.bet
CREATE TABLE IF NOT EXISTS `bet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `winner_user_id` int(11) NOT NULL DEFAULT '-1',
  `driver_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=latin1;

-- Dumping data for table uber.bet: 0 rows
/*!40000 ALTER TABLE `bet` DISABLE KEYS */;
/*!40000 ALTER TABLE `bet` ENABLE KEYS */;

-- Dumping structure for table uber.bet_detail
CREATE TABLE IF NOT EXISTS `bet_detail` (
  `bet_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `bet_amount` decimal(14,5) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bet_id`,`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=latin1;

-- Dumping data for table uber.bet_detail: 0 rows
/*!40000 ALTER TABLE `bet_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `bet_detail` ENABLE KEYS */;

-- Dumping structure for table uber.driver_detail
CREATE TABLE IF NOT EXISTS `driver_detail` (
  `driver_id` int(11) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `rating` decimal(5,2) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `car_brand` varchar(255) DEFAULT NULL,
  `car_model` varchar(255) DEFAULT NULL,
  `car_plate` varchar(50) DEFAULT NULL,
  `car_color` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table uber.driver_detail: 2 rows
/*!40000 ALTER TABLE `driver_detail` DISABLE KEYS */;
INSERT INTO `driver_detail` (`driver_id`, `phone`, `rating`, `email`, `car_brand`, `car_model`, `car_plate`, `car_color`) VALUES
	(2, '017-4073971', 4.50, 'keanhooilim@gmail.com', 'perodua', 'bezza', 'PKL 2453', 'red'),
	(4, '04-6263708', 4.50, 'test@gmail.com', 'honda', 'city', 'PLK 3456', 'black');
/*!40000 ALTER TABLE `driver_detail` ENABLE KEYS */;

-- Dumping structure for table uber.fare
CREATE TABLE IF NOT EXISTS `fare` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `bet_id` int(11) DEFAULT NULL,
  `start_longitute` float DEFAULT NULL,
  `start_latitude` float DEFAULT NULL,
  `end_longitute` float DEFAULT NULL,
  `end_latitude` float DEFAULT NULL,
  `distance` decimal(13,5) DEFAULT NULL,
  `fare_rate` double(13,5) DEFAULT NULL,
  `price` decimal(13,5) DEFAULT NULL,
  `user_rating` tinyint(4) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table uber.fare: ~0 rows (approximately)
/*!40000 ALTER TABLE `fare` DISABLE KEYS */;
/*!40000 ALTER TABLE `fare` ENABLE KEYS */;

-- Dumping structure for table uber.request
CREATE TABLE IF NOT EXISTS `request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rider_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `driver_reject` text,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table uber.request: 2 rows
/*!40000 ALTER TABLE `request` DISABLE KEYS */;
INSERT INTO `request` (`id`, `rider_id`, `driver_id`, `driver_reject`, `status`) VALUES
	(1, 2, NULL, NULL, 1),
	(2, 2, NULL, NULL, 1);
/*!40000 ALTER TABLE `request` ENABLE KEYS */;

-- Dumping structure for table uber.ride
CREATE TABLE IF NOT EXISTS `ride` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table uber.ride: 2 rows
/*!40000 ALTER TABLE `ride` DISABLE KEYS */;
INSERT INTO `ride` (`id`, `driver_id`, `user_id`, `status`, `created_at`, `updated_at`) VALUES
	(6, 2, 5, 5, '2017-10-14 02:23:42', '2017-10-14 03:31:44'),
	(5, 2, 3, 5, '2017-10-14 01:08:01', '2017-10-14 03:38:11');
/*!40000 ALTER TABLE `ride` ENABLE KEYS */;

-- Dumping structure for table uber.rider_detail
CREATE TABLE IF NOT EXISTS `rider_detail` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table uber.rider_detail: 1 rows
/*!40000 ALTER TABLE `rider_detail` DISABLE KEYS */;
INSERT INTO `rider_detail` (`user_id`, `email`, `phone`) VALUES
	(3, 'asd@asd.asd', '123123123'),
	(5, 'asdasdasdsad', '12312321');
/*!40000 ALTER TABLE `rider_detail` ENABLE KEYS */;

-- Dumping structure for table uber.transaction
CREATE TABLE IF NOT EXISTS `transaction` (
  `fare_id` int(11) NOT NULL,
  `bank` smallint(6) DEFAULT NULL,
  `log_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pay_method` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`fare_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table uber.transaction: ~0 rows (approximately)
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;

-- Dumping structure for table uber.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `last_longitute` float DEFAULT NULL,
  `last_latitude` float DEFAULT NULL,
  `credit` decimal(13,5) DEFAULT NULL,
  `online_status` tinyint(4) DEFAULT NULL,
  `occupied` tinyint(4) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table uber.user: ~4 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `username`, `type`, `status`, `name`, `password`, `last_longitute`, `last_latitude`, `credit`, `online_status`, `occupied`, `created_at`, `last_update`) VALUES
	(2, 'driver', 1, 1, 'driver', '56fc85269b99270b7874e812fb9ecddb9050e42f937f57e9145be0b055b02eee', 1.23416, 2.13123, 1000.00000, 0, 1, '2017-09-24 15:46:42', '2017-10-14 04:27:47'),
	(3, 'fooi', 2, 1, 'fooi', '56fc85269b99270b7874e812fb9ecddb9050e42f937f57e9145be0b055b02eee', 1.23455, 2.14444, 100.00000, NULL, 0, '2017-10-11 17:56:56', '2017-10-14 04:09:19'),
	(4, 'ooi', 1, 1, 'ooi', '56fc85269b99270b7874e812fb9ecddb9050e42f937f57e9145be0b055b02eee', 1.23466, 2.15434, 10.00000, 1, 0, '2017-10-14 00:00:55', '2017-10-14 04:09:19'),
	(5, 'rider', 2, 1, 'rider', '56fc85269b99270b7874e812fb9ecddb9050e42f937f57e9145be0b055b02eee', 1.25666, 2.12999, 100.00000, NULL, 0, '2017-10-14 02:22:56', '2017-10-14 04:09:20');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Dumping structure for table uber.user_bet
CREATE TABLE IF NOT EXISTS `user_bet` (
  `bet_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `amount` decimal(14,5) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(4) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table uber.user_bet: 0 rows
/*!40000 ALTER TABLE `user_bet` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_bet` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
