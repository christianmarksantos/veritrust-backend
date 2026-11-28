-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2026 at 08:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `veritrust_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `order_transactions`
--

CREATE TABLE `order_transactions` (
  `orderId` int(11) NOT NULL,
  `buyerId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `orderDate` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `status` enum('Pending','Completed','Cancelled') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_transactions`
--

INSERT INTO `order_transactions` (`orderId`, `buyerId`, `productId`, `orderDate`, `status`) VALUES
(1, 1, 1, '2026-11-28 15:20:13.756882', 'Completed'),
(2, 1, 2, '2026-11-28 15:21:39.721913', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productId` int(11) NOT NULL,
  `sellerId` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `trustScore` decimal(5,2) NOT NULL DEFAULT 100.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productId`, `sellerId`, `title`, `description`, `imageUrl`, `trustScore`) VALUES
(1, 2, 'Wireless Earbuds Pro', 'Updated ANC Bluetooth 5.3 earbuds with charging case', 'https://storage.veritrust.com/earbuds.jpg', 100.00),
(2, 2, 'Smart Watch Gen 3', 'AMOLED fitness watch', 'https://storage.veritrust.com/watch.jpg', 75.00);

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `reviewId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `reviewText` text NOT NULL,
  `unboxingImageUrl` varchar(255) DEFAULT NULL,
  `isVerifiedBuyer` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_reviews`
--

INSERT INTO `product_reviews` (`reviewId`, `orderId`, `rating`, `reviewText`, `unboxingImageUrl`, `isVerifiedBuyer`, `createdAt`) VALUES
(1, 1, 5, 'Still working great after a week of daily use!', 'https://storage.veritrust.com/buyer-real.jpg', 1, '2026-11-28 15:28:22.033132'),
(2, 2, 1, 'Item looks nothing like the listing photo, cheap plastic knockoff.', 'https://storage.veritrust.com/bootleg-watch.jpg', 1, '2026-11-28 15:29:53.744142');

-- --------------------------------------------------------

--
-- Table structure for table `user_accounts`
--

CREATE TABLE `user_accounts` (
  `userId` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` enum('Buyer','Seller','Admin') NOT NULL DEFAULT 'Buyer',
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_accounts`
--

INSERT INTO `user_accounts` (`userId`, `fullName`, `email`, `passwordHash`, `role`, `createdAt`) VALUES
(1, 'Juan M. Dela Cruz', 'juan@veritrust.com', '$2b$10$OQOesZLi2PSKg170FoBckuuhLhA/JqjbcnpN5WhKddebYY0FznP9O', 'Buyer', '2026-11-28 14:23:14.273162'),
(2, 'Tech Store PH', 'seller@veritrust.com', '$2b$10$l3DlQHCocS46GvOD4mfrpeabusb.FPdizUsXeQe2/YEy97oJmrUla', 'Seller', '2026-11-28 14:27:12.081959'),
(3, 'VeriTrust Admin', 'admin@veritrust.com', '$2b$10$OeEi.9MqoZrdcjc4GsY7BujUzeNsWLRC.r375cbZnw9M8lMD9p75e', 'Admin', '2026-11-28 14:32:37.014976');

-- --------------------------------------------------------

--
-- Table structure for table `verification_logs`
--

CREATE TABLE `verification_logs` (
  `logId` int(11) NOT NULL,
  `reviewId` int(11) NOT NULL,
  `spamScore` decimal(5,2) NOT NULL,
  `imageMatchScore` decimal(5,2) DEFAULT NULL,
  `flagStatus` enum('Clean','Flagged','Under Review') NOT NULL DEFAULT 'Clean',
  `evaluationDate` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verification_logs`
--

INSERT INTO `verification_logs` (`logId`, `reviewId`, `spamScore`, `imageMatchScore`, `flagStatus`, `evaluationDate`) VALUES
(1, 1, 12.00, 94.00, 'Clean', '2026-11-28 15:28:22.164537'),
(2, 2, 12.00, 32.00, 'Flagged', '2026-11-28 15:29:54.079677');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order_transactions`
--
ALTER TABLE `order_transactions`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `FK_c832c80a7fd608a80a2c6b8f135` (`buyerId`),
  ADD KEY `FK_d594d48454c3f2c85e2e1040a52` (`productId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`),
  ADD KEY `FK_e40a1dd2909378f0da1f34f7bd6` (`sellerId`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`reviewId`),
  ADD UNIQUE KEY `IDX_f1432cc7dde8c52ac11151d439` (`orderId`),
  ADD UNIQUE KEY `REL_f1432cc7dde8c52ac11151d439` (`orderId`);

--
-- Indexes for table `user_accounts`
--
ALTER TABLE `user_accounts`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `IDX_df3802ec9c31dd9491e3589378` (`email`);

--
-- Indexes for table `verification_logs`
--
ALTER TABLE `verification_logs`
  ADD PRIMARY KEY (`logId`),
  ADD UNIQUE KEY `IDX_951ff55a33f582a5baad79eb68` (`reviewId`),
  ADD UNIQUE KEY `REL_951ff55a33f582a5baad79eb68` (`reviewId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `order_transactions`
--
ALTER TABLE `order_transactions`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `reviewId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_accounts`
--
ALTER TABLE `user_accounts`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `verification_logs`
--
ALTER TABLE `verification_logs`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_transactions`
--
ALTER TABLE `order_transactions`
  ADD CONSTRAINT `FK_c832c80a7fd608a80a2c6b8f135` FOREIGN KEY (`buyerId`) REFERENCES `user_accounts` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d594d48454c3f2c85e2e1040a52` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK_e40a1dd2909378f0da1f34f7bd6` FOREIGN KEY (`sellerId`) REFERENCES `user_accounts` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `FK_f1432cc7dde8c52ac11151d439e` FOREIGN KEY (`orderId`) REFERENCES `order_transactions` (`orderId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `verification_logs`
--
ALTER TABLE `verification_logs`
  ADD CONSTRAINT `FK_951ff55a33f582a5baad79eb68a` FOREIGN KEY (`reviewId`) REFERENCES `product_reviews` (`reviewId`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
