--Database schema script.

CREATE DATABASE hrtool_database;


--Creating tables for the database with NOT NULL and UNIQUE conditions on specified columns.

CREATE TABLE TASKS
(
	id_task number NOT NULL UNIQUE,
	title varchar(255) NOT NULL,
	description varchar(2500),
	notes varchar(2500),
	completed boolean NOT NULL,
	date_from date,
	date_to date,
	user_id number,
	buddy number
);

CREATE TABLE DEFAULT_TASKS
(
	id_default_tasks number NOT NULL UNIQUE,
	title varchar(255) NOT NULL,
	description varchar(2500),
	team_id number,
	department_id number
);

CREATE TABLE USERS
(
	id_users number NOT NULL UNIQUE,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	email varchar(255) NOT NULL UNIQUE,
	role_id number,
	buddy_id number
);

CREATE TABLE ROLES
(
	id_roles number NOT NULL UNIQUE,
	title varchar(255) NOT NULL
);

CREATE TABLE USERS_IN_TEAMS
(
	id_users_in_teams number NOT NULL UNIQUE,
	user_id number NOT NULL,
	team_id number NOT NULL
);

CREATE TABLE TEAMS
(
	id_teams number NOT NULL UNIQUE,
	title varchar(255) NOT NULL,
	department_id number
);

CREATE TABLE DEPARTMENTS
(
	id_departments number NOT NULL UNIQUE,
	title varchar(255) NOT NULL
);

-- Creating primary key constraints on all tables, always set to ID of the particular table.

ALTER TABLE TASKS
ADD CONSTRAINT pk_ID_TASKS PRIMARY KEY (id_tasks);

ALTER TABLE DEFAULT_TASKS
ADD CONSTRAINT pk_ID_DEFAULT_TASKS PRIMARY KEY (id_default_tasks);

ALTER TABLE USERS
ADD CONSTRAINT pk_ID_USERS PRIMARY KEY (id_users);

ALTER TABLE ROLES
ADD CONSTRAINT pk_ID_ROLES PRIMARY KEY (id_roles);

ALTER TABLE USERS_IN_TEAMS
ADD CONSTRAINT pk_ID_USERS_IN_TEAMS PRIMARY KEY (id_users_in_teams);

ALTER TABLE TEAMS
ADD CONSTRAINT pk_ID_TEAMS PRIMARY KEY (id_teams);

ALTER TABLE DEPARTMENTS
ADD CONSTRAINT pk_ID_DEPARTMENTS PRIMARY KEY (id_departments);

-- Creating foreign key constraints on all tables.

-- Foreign key from USER_ID column of TASKS table to ID column from USERS table.
ALTER TABLE TASKS
ADD CONSTRAINT fk_TASKS_USER_ID
FOREIGN KEY (user_id)
REFERENCES USERS(id_users);

-- Foreign key from BUDDY_ID column of TASKS table to ID column from USERS table.
ALTER TABLE TASKS
ADD CONSTRAINT fk_TASKS_BUDDY_ID
FOREIGN KEY (buddy_id)
REFERENCES USERS(id_users);

-- Foreign key from TEAM_ID column of DEFAULT_TASKS table to ID column from TEAMS table.
ALTER TABLE DEFAULT_TASKS
ADD CONSTRAINT fk_DEFAULT_TASKS_TEAM_ID
FOREIGN KEY (team_id)
REFERENCES TEAMS(id_teams);

-- Foreign key from DEPARTMENT_ID column of DEFAULT_TASKS table to ID column from DEPARTMENTS table.
ALTER TABLE DEFAULT_TASKS
ADD CONSTRAINT fk_DEFAULT_TASKS_DEPARTMENT_ID
FOREIGN KEY (department_id)
REFERENCES DEPARTMENTS(id_departments);

-- Foreign key from ROLE_ID column of USERS table to ID column from ROLES table.
ALTER TABLE USERS
ADD CONSTRAINT fk_USERS_ROLE_ID
FOREIGN KEY (role_id)
REFERENCES ROLES(id_roles);

-- Foreign key from BUDDY_ID column of USERS table to ID column from USERS table.
ALTER TABLE USERS
ADD CONSTRAINT fk_USERS_BUDDY_ID
FOREIGN KEY (buddy_id)
REFERENCES USERS(id_users);

-- Foreign key from USER_ID column of USERS_IN_TEAMS table to ID column from USERS table.
ALTER TABLE USERS_IN_TEAMS
ADD CONSTRAINT fk_USERS_IN_TEAMS_USER_ID
FOREIGN KEY (user_id)
REFERENCES USERS(id_users);

-- Foreign key from TEAM_ID column of USERS_IN_TEAMS table to ID column from TEAMS table.
ALTER TABLE USERS_IN_TEAMS
ADD CONSTRAINT fk_USERS_IN_TEAMS_TEAM_ID
FOREIGN KEY (team_id)
REFERENCES TEAMS(id_teams);

-- Foreign key from DEPARTMENT_ID column of TEAMS table to ID column from DEPARTMENTS table.
ALTER TABLE TEAMS
ADD CONSTRAINT fk_TEAMS_DEPARTMENT_ID
FOREIGN KEY (department_id)
REFERENCES DEPARTMENTS(id_departments);