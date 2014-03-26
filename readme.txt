Hostsfile for testing.

Server running on port 80...


127.0.0.1       samak.foo.com






CREATE DATABASE `samak`;


CREATE TABLE `routes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `distance` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `end` varchar(128) DEFAULT NULL,
  `endlat` float DEFAULT NULL,
  `endlng` float DEFAULT NULL,
  `start` varchar(128) DEFAULT NULL,
  `startlat` float DEFAULT NULL,
  `startlng` float DEFAULT NULL,
  `starttime` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;




CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Key` varchar(128) DEFAULT NULL,
  `Name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

