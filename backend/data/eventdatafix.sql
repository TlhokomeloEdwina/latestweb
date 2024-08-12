drop table attendance;
drop table activity;
drop table event;

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
     description varchar(255)
 );

insert into Day (name) values('Sunday');
insert into Day (name) values('Monday');
insert into Day (name) values('Tuesday');
insert into Day (name) values('Wednesday');
insert into Day (name) values('Thursday'); 
insert into Day (name) values('Friday');
insert into Day (name) values('Saturday');