-- Test data for database.

-- Data for ROLES table.
INSERT INTO ROLES
VALUES (0, "User");

INSERT INTO ROLES
VALUES (1, "Team manager");

INSERT INTO ROLES
VALUES (2, "Administrator");

-- Data for DEPARTMENTS table.
INSERT INTO DEPARTMENTS
VALUES (0, 'Sales');

INSERT INTO DEPARTMENTS
VALUES (1, 'Development');

INSERT INTO DEPARTMENTS
VALUES (2, 'Products');

-- Data for TEAMS table.
INSERT INTO TEAMS
VALUES (0, 'Sales team 1', 0);

INSERT INTO TEAMS
VALUES (1, 'Sales team 2', 0);

INSERT INTO TEAMS
VALUES (2, 'Development team 1', 1);

INSERT INTO TEAMS
VALUES (3, 'Development team 2', 1);

INSERT INTO TEAMS
VALUES (4, 'Products team 1', 2);

INSERT INTO TEAMS
VALUES (5, 'Products team 2', 2);

-- Data for DEFAULT_TASKS table.
INSERT INTO DEFAULT_TASKS
VALUES (0, 'Zalozit si e-mail', 'akjdaskdnadnaln', null, null);

INSERT INTO DEFAULT_TASKS
VALUES (1, 'Zalozit si Podio ucet', 'akjdaskdnadnaln', null, null);

INSERT INTO DEFAULT_TASKS
VALUES (2, 'Pozdravit developery', 'akjdaskdnadnaln', null, 1);

INSERT INTO DEFAULT_TASKS
VALUES (3, 'Pozdravit salesmany', 'akjdaskdnadnaln', null, 0);

INSERT INTO DEFAULT_TASKS
VALUES (4, 'Pozdravit developery z tymu 1', 'akjdaskdnadnaln', 2, 1);

-- Data for USERS table.
INSERT INTO USERS
VALUES (0, 'Jan', 'Koren', 'jan.koren@socialbakers.com', 1, null);

INSERT INTO USERS
VALUES (1, 'David', 'Moravek', 'david.moravek@socialbakers.com', 2, null);

INSERT INTO USERS
VALUES (2, 'Vladimir', 'Laznicka', 'vladimir.laznicka@socialbakers.com', 0, null);

INSERT INTO USERS
VALUES (3, 'Marek', 'Simunek', 'marek.simunek@socialbakers.com', 0, null);

INSERT INTO USERS
VALUES (4, 'Vladimir', 'Neckar', 'vladimir.neckar@socialbakers.com', 0, null);

INSERT INTO USERS
VALUES (5, 'Karel', 'Zibar', 'karel.zibar@socialbakers.com', 0, null);

INSERT INTO USERS
VALUES (6, 'Frantisek', 'Kolenak', 'frantisek.kolenak@socialbakers.com', 0, null);

INSERT INTO USERS
VALUES (7, 'Lukas', 'Witz', 'lukas.witz@socialbakers.com', 0, null);

-- Data for USERS_IN_TEAM table.
INSERT INTO USERS_IN_TEAMS
VALUES (0, 0, 2);

INSERT INTO USERS_IN_TEAMS
VALUES (1, 0, 3);

INSERT INTO USERS_IN_TEAMS
VALUES (2, 1, 2);

INSERT INTO USERS_IN_TEAMS
VALUES (3, 1, 3);

INSERT INTO USERS_IN_TEAMS
VALUES (4, 2, 3);

INSERT INTO USERS_IN_TEAMS
VALUES (5, 3, 3);

INSERT INTO USERS_IN_TEAMS
VALUES (6, 4, 2);

INSERT INTO USERS_IN_TEAMS
VALUES (7, 5, 3);

INSERT INTO USERS_IN_TEAMS
VALUES (8, 6, 2);

INSERT INTO USERS_IN_TEAMS
VALUES (9, 7, 2);

-- Data for TASKS table.
INSERT INTO TASKS
VALUES (0, 'Create DB schema', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 2, null);

INSERT INTO TASKS
VALUES (1, 'Create test data', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 2, null);

INSERT INTO TASKS
VALUES (2, 'helpers', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 2, null);

INSERT INTO TASKS
VALUES (3, 'Implementovat express.io', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 5, null);

INSERT INTO TASKS
VALUES (4, 'Nasadit Easy-Pg a vytvorit config.json', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 5, null);

INSERT INTO TASKS
VALUES (5, 'mediator', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 3, null);

INSERT INTO TASKS
VALUES (6, 'base model', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 3, null);

INSERT INTO TASKS
VALUES (7, 'core', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 4, null);

INSERT INTO TASKS
VALUES (8, 'router', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 4, null);

INSERT INTO TASKS
VALUES (9, 'base component', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 6, null);

INSERT INTO TASKS
VALUES (10, 'view base', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 6, null);

INSERT INTO TASKS
VALUES (11, 'observer', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', FALSE, '2014-08-01', '2014-08-05', 7, null);



/*
-- Delete statements for clearing all tables when needed.
DELETE * FROM ROLES;
DELETE * FROM DEPARTMENTS;
DELETE * FROM TEAMS;
DELETE * FROM DEFAULT_TASKS;
DELETE * FROM USERS;
DELETE * FROM USERS_IN_TEAMS;
DELETE * FROM TASKS;
*/