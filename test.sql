-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2017 at 08:16 AM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `country` varchar(40) NOT NULL,
  `age` int(40) NOT NULL,
  `salary` int(40) NOT NULL,
  `purchase` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`country`, `age`, `salary`, `purchase`) VALUES
('France', 44, 72000, 'No'),
('Spain', 27, 48000, 'Yes'),
('Germany', 30, 54000, 'No'),
('Spain', 38, 61000, 'No'),
('Germany', 40, 0, 'Yes'),
('France', 35, 58000, 'Yes'),
('Spain', 0, 52000, 'No'),
('France', 48, 79000, 'Yes'),
('Germany', 50, 83000, 'No'),
('France', 37, 67000, 'Yes'),
('France', 44, 72000, 'No'),
('Spain', 27, 48000, 'Yes'),
('Germany', 30, 54000, 'No'),
('Spain', 38, 61000, 'No'),
('Germany', 40, 0, 'Yes'),
('France', 35, 58000, 'Yes'),
('Spain', 0, 52000, 'No'),
('France', 48, 79000, 'Yes'),
('Germany', 50, 83000, 'No'),
('France', 37, 67000, 'Yes'),
('France', 44, 72000, 'No'),
('Spain', 27, 48000, 'Yes'),
('Germany', 30, 54000, 'No'),
('Spain', 38, 61000, 'No'),
('Germany', 40, 0, 'Yes'),
('France', 35, 58000, 'Yes'),
('Spain', 0, 52000, 'No'),
('France', 48, 79000, 'Yes'),
('Germany', 50, 83000, 'No'),
('France', 37, 67000, 'Yes'),
('France', 44, 72000, 'No'),
('Spain', 27, 48000, 'Yes'),
('Germany', 30, 54000, 'No'),
('Spain', 38, 61000, 'No'),
('Germany', 40, 0, 'Yes'),
('France', 35, 58000, 'Yes'),
('Spain', 0, 52000, 'No'),
('France', 48, 79000, 'Yes'),
('Germany', 50, 83000, 'No'),
('France', 37, 67000, 'Yes'),
('France', 44, 72000, 'No'),
('Spain', 27, 48000, 'Yes'),
('Germany', 30, 54000, 'No'),
('Spain', 38, 61000, 'No'),
('Germany', 40, 0, 'Yes'),
('France', 35, 58000, 'Yes'),
('Spain', 0, 52000, 'No'),
('France', 48, 79000, 'Yes'),
('Germany', 50, 83000, 'No'),
('France', 37, 67000, 'Yes'),
('France', 44, 72000, 'No'),
('Spain', 27, 48000, 'Yes'),
('Germany', 30, 54000, 'No'),
('Spain', 38, 61000, 'No'),
('Germany', 40, 0, 'Yes'),
('France', 35, 58000, 'Yes'),
('Spain', 0, 52000, 'No'),
('France', 48, 79000, 'Yes'),
('Germany', 50, 83000, 'No'),
('France', 37, 67000, 'Yes');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
