create database carewise2;
use carewise;

CREATE TABLE User(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_number VARCHAR(13) NOT NULL Unique, 
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    contact_number VARCHAR(13) NOT NULL unique,
    email VARCHAR(255) NOT NULL Unique,
    password VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    expoDeviceToken VARCHAR(255),
    userType VARCHAR(50) NOT NULL,
    active int not null default 1
);

CREATE TABLE Admin(
    admin_id INT NOT NULL PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES User(id)
);

CREATE TABLE Caregiver(
    caregiver_id INT NOT NULL PRIMARY KEY,
    available_status INT NOT NULL,
    FOREIGN KEY (caregiver_id) REFERENCES User(id)
);

CREATE TABLE Cottage(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    caregiver_id INT NOT NULL,
    FOREIGN KEY (caregiver_id) REFERENCES Caregiver(caregiver_id)
);

CREATE TABLE Resident(
    resident_id INT NOT NULL PRIMARY KEY,
    sassa_number VARCHAR(100) NOT NULL,
    room_number INT NOT NULL,
    cottage_id INT NOT NULL,
    FOREIGN KEY (resident_id) REFERENCES User(id),
    FOREIGN KEY (cottage_id) REFERENCES Cottage(id)
);

CREATE TABLE Family_member(
    family_member_id INT NOT NULL PRIMARY KEY,
    FOREIGN KEY (family_member_id) REFERENCES User(id)
);

CREATE TABLE Resident_Family(
    resident_id INT NOT NULL,
    family_member_id INT NOT NULL,
    PRIMARY KEY (resident_id, family_member_id),
    FOREIGN KEY (resident_id) REFERENCES Resident(resident_id),
    FOREIGN KEY (family_member_id) REFERENCES Family_member(family_member_id)
);

Create table Alert(
    id int NOT NULL auto_increment primary key,
    Time DATETIME NOT NULL,
    alert_Type VARCHAR(50) NOT NULL,
    resident_id int not null,
    caregiver_id int not null,
    foreign key(resident_id) references Resident(resident_id),
    foreign key(caregiver_id) references caregiver(caregiver_id)
);

CREATE TABLE Review (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    time DATETIME NOT NULL,
    description VARCHAR(255) NOT NULL,
    alert_id INT NOT NULL,
    caregiver_id INT NOT NULL,
    FOREIGN KEY (alert_id) REFERENCES Alert(id),
	FOREIGN KEY (caregiver_id) REFERENCES Caregiver(caregiver_id),
    UNIQUE (caregiver_id, alert_id)
);

CREATE TABLE Passout(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,
    request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    destination VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    emergency_contact VARCHAR(255),
    medical_clearance VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
   status_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   decline_reason VARCHAR(255),
    FOREIGN KEY (resident_id) REFERENCES Resident(resident_id)
);

Create Table Visit(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
resident_id INT NOT NULL,
family_id INT NOT NULL,
reason TEXT NOT NULL,
visit_date DATETIME NOT NULL,
Duration VARCHAR(50),
status VARCHAR(50) NOT NULL DEFAULT 'Pending',
SubmittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
decline_reason VARCHAR(255),
FOREIGN KEY (resident_id) REFERENCES Resident(resident_id),
FOREIGN KEY (family_id) REFERENCES Family_member(family_member_id)
 );
 
create table Activity(
     id varchar(255) not null primary key,
     name varchar(255) not null,
     time Time not null,
     description varchar(255),
     type varchar(255) not null
 );
 
 create Table Day(
     id int not null auto_increment primary key,
     name varchar(255) not null
 );
 
Create Table DayActivity(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    day_id int not null,
    act_id varchar(255) not null,
    foreign key(day_id) references Day(id),
    foreign key(act_id) references Activity(id),
    unique(day_id,act_id)
 );
 
Create table Attendance (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 date Date not null,
 time Time not null,
 care_id int not null,
 act_id VARCHAR(255) not null,
 res_id int not null,
 foreign key(care_id) references Caregiver(caregiver_id),
 foreign key(act_id) references activity(id),
 foreign key(res_id) references Resident(resident_id)
 );
 
Create table Event (
     id varchar(255) not null primary key,
     name varchar(255) not null,
     date Date not null,
     description varchar(255),
	stime Time not null,
     etime Time not null
 );

insert into Day (name) values('Sunday');
insert into Day (name) values('Monday');
insert into Day (name) values('Tuesday');
insert into Day (name) values('Wednesday');
insert into Day (name) values('Thursday'); 
insert into Day (name) values('Friday');
insert into Day (name) values('Saturday');
 
 CREATE TABLE `checkin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resident_id` int NOT NULL,
  `caregiver_id` int NOT NULL,
  `datecreated` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `resident_id` (`resident_id`),
  KEY `caregiver_id` (`caregiver_id`),
  CONSTRAINT `checkin_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `resident` (`resident_id`),
  CONSTRAINT `checkin_ibfk_2` FOREIGN KEY (`caregiver_id`) REFERENCES `caregiver` (`caregiver_id`)
);

CREATE TABLE `checkinreview` (
  `id` int NOT NULL AUTO_INCREMENT Primary key,
  `checkin_id` int DEFAULT NULL Unique,
  `review` text,
  `datecreated` date DEFAULT (curdate()),
  CONSTRAINT `checkinreview_ibfk_1` FOREIGN KEY (`checkin_id`) REFERENCES `checkin` (`id`)
);

use carewise;

CREATE TABLE questions (
  id int NOT NULL AUTO_INCREMENT Primary key,
  mood_type varchar(50) NOT NULL,
  question text NOT NULL,
  options text NOT NULL,
  question_type enum('choice','yes_no','scale') NOT NULL
);

CREATE TABLE `responses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int DEFAULT NULL,
  `selected_option` varchar(50) DEFAULT NULL,
  `checkin_id` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `checkin_id` (`checkin_id`),
  CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `responses_ibfk_2` FOREIGN KEY (`checkin_id`) REFERENCES `checkin` (`id`)
);





