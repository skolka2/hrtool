--Creating tables for the database with NOT NULL and UNIQUE conditions on specified columns.

DROP TABLE IF EXISTS tasks CASCADE;
CREATE TABLE tasks
(
	id_task SERIAL PRIMARY KEY,
	title CHARACTER VARYING (255) NOT NULL,
	description TEXT,
	notes TEXT,
	completed BOOLEAN DEFAULT FALSE,
	date_from DATE NOT NULL,
	date_to DATE NOT NULL,
	id_user INTEGER NOT NULL,
	id_buddy INTEGER,
  id_team INTEGER,
	id_department INTEGER
);

DROP TABLE IF EXISTS default_tasks CASCADE;
CREATE TABLE default_tasks
(
	id_default_task SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	id_team INTEGER,
	id_department INTEGER
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users
(
	id_user SERIAL PRIMARY KEY,
	first_name CHARACTER VARYING (128) NOT NULL,
	last_name CHARACTER VARYING (128) NOT NULL,
	email TEXT NOT NULL UNIQUE,
	id_user_role INTEGER,
	id_buddy INTEGER NOT NULL
);

DROP TABLE IF EXISTS user_roles CASCADE;
CREATE TABLE user_roles
(
	id_user_role SERIAL PRIMARY KEY,
	title CHARACTER VARYING (128) NOT NULL
);

DROP TABLE IF EXISTS users_teams CASCADE;
CREATE TABLE users_teams
(
	id_user INTEGER NOT NULL,
	id_team INTEGER NOT NULL,
	is_admin BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS teams CASCADE;
CREATE TABLE teams
(
	id_team SERIAL PRIMARY KEY,
	title CHARACTER VARYING (128) NOT NULL,
	id_department INTEGER NOT NULL
);

DROP TABLE IF EXISTS departments CASCADE;
CREATE TABLE departments
(
	id_department SERIAL PRIMARY KEY,
	title CHARACTER VARYING (128) NOT NULL
);

DROP TABLE IF EXISTS department_roles CASCADE;
CREATE TABLE department_roles
(
	id_department_role SERIAL PRIMARY KEY,
	title CHARACTER VARYING (128) NOT NULL,
	id_department INTEGER NOT NULL
);

-- Creating primary key constraint on user_teams table.
ALTER TABLE users_teams
DROP CONSTRAINT IF EXISTS pk_user_team;

ALTER TABLE users_teams
ADD CONSTRAINT pk_user_team PRIMARY KEY (id_user, id_team);

-- Creating foreign key constraints on all tables.

-- Foreign key from ID_USER column of TASKS table to ID column from USERS table.
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS fk_tasks_id_user;

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_id_user
FOREIGN KEY (id_user)
REFERENCES users(id_user);

-- Foreign key from ID_BUDDY column of TASKS table to ID column from USERS table.
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS fk_tasks_id_buddy;

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_id_buddy
FOREIGN KEY (id_buddy)
REFERENCES users(id_user);

-- Foreign key from ID_TEAM column of DEFAULT_TASKS table to ID column from TEAMS table.
ALTER TABLE default_tasks
DROP CONSTRAINT IF EXISTS fk_default_tasks_id_team;

ALTER TABLE default_tasks
ADD CONSTRAINT fk_default_tasks_id_team
FOREIGN KEY (id_team)
REFERENCES teams(id_team);

ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS fk_tasks_id_team;

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_id_team
FOREIGN KEY (id_team)
REFERENCES teams(id_team) ON DELETE SET NULL;

-- Foreign key from ID_DEPARTMENT column of DEFAULT_TASKS table to ID column from DEPARTMENTS table.
ALTER TABLE default_tasks
DROP CONSTRAINT IF EXISTS fk_default_tasks_id_department;

ALTER TABLE default_tasks
ADD CONSTRAINT fk_default_tasks_id_department
FOREIGN KEY (id_department)
REFERENCES departments(id_department);

ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS fk_tasks_id_department;
ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_id_department
FOREIGN KEY (id_department)
REFERENCES departments(id_department) ON DELETE SET NULL;

-- Foreign key from ID_USER_ROLE column of USERS table to ID column from USER_ROLES table.
ALTER TABLE users
DROP CONSTRAINT IF EXISTS fk_users_id_role;

ALTER TABLE users
ADD CONSTRAINT fk_users_id_role
FOREIGN KEY (id_user_role)
REFERENCES user_roles(id_user_role);

-- Foreign key from ID_BUDDY column of USERS table to ID column from USERS table.
ALTER TABLE users
DROP CONSTRAINT IF EXISTS fk_users_id_buddy;

ALTER TABLE users
ADD CONSTRAINT fk_users_id_buddy
FOREIGN KEY (id_buddy)
REFERENCES users(id_user);

-- Foreign key from ID_USER column of USERS_IN_TEAMS table to ID column from USERS table.
ALTER TABLE users_teams
DROP CONSTRAINT IF EXISTS fk_users_teams_id_user;

ALTER TABLE users_teams
ADD CONSTRAINT fk_users_teams_id_user
FOREIGN KEY (id_user)
REFERENCES users(id_user);

-- Foreign key from ID_TEAM column of USERS_IN_TEAMS table to ID column from TEAMS table.
ALTER TABLE users_teams
DROP CONSTRAINT IF EXISTS fk_users_teams_id_team;

ALTER TABLE users_teams
ADD CONSTRAINT fk_users_teams_id_team
FOREIGN KEY (id_team)
REFERENCES teams(id_team);

-- Foreign key from ID_DEPARTMENT column of TEAMS table to ID column from DEPARTMENTS table.
ALTER TABLE teams
DROP CONSTRAINT IF EXISTS fk_teams_id_department;

ALTER TABLE teams
ADD CONSTRAINT fk_teams_id_department
FOREIGN KEY (id_department)
REFERENCES departments(id_department);

-- Foreign key from ID_DEPARTMENT column of DEPARTMENT_ROLES table to ID column from DEPARTMENTS table.
ALTER TABLE department_roles
DROP CONSTRAINT IF EXISTS fk_department_roles_id_department;

ALTER TABLE department_roles
ADD CONSTRAINT fk_department_roles_id_department
FOREIGN KEY (id_department)
REFERENCES departments(id_department);
