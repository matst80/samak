Hostsfile for testing.

Server running on port 80...


127.0.0.1       samak.foo.com


delimiter $$

CREATE DATABASE `samak` /*!40100 DEFAULT CHARACTER SET latin1 */$$



CREATE TABLE `routes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Start` varchar(256) DEFAULT NULL,
  `End` varchar(256) DEFAULT NULL,
  `StartTime` datetime DEFAULT NULL,
  `Title` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1$$



CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Key` varchar(128) DEFAULT NULL,
  `Name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1$$

