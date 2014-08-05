--Creating tables for the database with NOT NULL and UNIQUE conditions on specified columns.

CREATE TABLE tasks
(
	id_task SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	notes TEXT,
	completed BOOLEAN DEFAULT FALSE,
	date_from DATE NOT NULL,
	date_to DATE NOT NULL,
	id_user INTEGER NOT NULL,
	id_buddy INTEGER
);

CREATE TABLE default_tasks
(
	id_default_task SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	id_team INTEGER,
	id_department INTEGER
);

CREATE TABLE users
(
	id_user SERIAL PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	id_role INTEGER,
	id_buddy INTEGER,
);

CREATE TABLE user_roles
(
	id_user_role SERIAL PRIMARY KEY,
	title TEXT NOT NULL
);

CREATE TABLE users_teams
(
	id_user INTEGER NOT NULL,
	id_team INTEGER NOT NULL,
	team_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE teams
(
	id_team SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	id_department INTEGER NOT NULL
);

CREATE TABLE departments
(
	id_department SERIAL PRIMARY KEY,
	title TEXT NOT NULL
);

CREATE TABLE department_roles
(
	id_department_role SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	id_department INTEGER NOT NULL
);

-- Creating primary key constraint on user_teams table.

ALTER TABLE users_teams
ADD CONSTRAINT pk_user_team PRIMARY KEY (id_user, id_team);

-- Creating foreign key constraints on all tables.

-- Foreign key from ID_USER column of TASKS table to ID column from USERS table.
ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_id_user
FOREIGN KEY (id_users)
REFERENCES users(id_users);

-- Foreign key from ID_BUDDY column of TASKS table to ID column from USERS table.
ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_id_buddy
FOREIGN KEY (id_buddy)
REFERENCES users(id_users);

-- Foreign key from ID_TEAM column of DEFAULT_TASKS table to ID column from TEAMS table.
ALTER TABLE default_tasks
ADD CONSTRAINT fk_default_tasks_id_team
FOREIGN KEY (id_team)
REFERENCES teams(id_team);

-- Foreign key from ID_DEPARTMENT column of DEFAULT_TASKS table to ID column from DEPARTMENTS table.
ALTER TABLE default_tasks
ADD CONSTRAINT fk_default_tasks_id_department
FOREIGN KEY (id_department)
REFERENCES departments(id_department);

-- Foreign key from ID_ROLE column of USERS table to ID column from ROLES table.
ALTER TABLE users
ADD CONSTRAINT fk_users_id_role
FOREIGN KEY (id_role)
REFERENCES role(id_role);

-- Foreign key from ID_BUDDY column of USERS table to ID column from USERS table.
ALTER TABLE users
ADD CONSTRAINT fk_users_id_buddy
FOREIGN KEY (id_buddy)
REFERENCES users(id_user);

-- Foreign key from ID_USER column of USERS_IN_TEAMS table to ID column from USERS table.
ALTER TABLE users_teams
ADD CONSTRAINT fk_users_teams_id_user
FOREIGN KEY (id_user)
REFERENCES users(id_user);

-- Foreign key from ID_TEAM column of USERS_IN_TEAMS table to ID column from TEAMS table.
ALTER TABLE users_teams
ADD CONSTRAINT fk_users_teams_id_team
FOREIGN KEY (id_team)
REFERENCES team(id_team);

-- Foreign key from ID_DEPARTMENT column of TEAMS table to ID column from DEPARTMENTS table.
ALTER TABLE teams
ADD CONSTRAINT fk_teams_id_department
FOREIGN KEY (id_department)
REFERENCES departments(id_department);

-- Foreign key from ID_DEPARTMENT column of DEPARTMENT_ROLES table to ID column from DEPARTMENTS table.
ALTER TABLE department_roles
ADD CONSTRAINT fk_department_roles_id_department
FOREIGN KEY (id_department)
REFERENCES departments(id_department)