-- Test data for database.

-- Data for USER_ROLES table.
INSERT INTO user_roles (title) VALUES ('User'), VALUES ('Team manager'), VALUES('Administrator'); 

-- Data for DEPARTMENTS table.
INSERT INTO departments (title) VALUES ('Sales'), VALUES ('Development'), VALUES('Products');

-- Data for TEAMS table.
INSERT INTO teams (title, id_department) 
VALUES ('Sales team 1', SELECT id_department FROM departments WHERE title='Sales'),
VALUES ('Sales team 2', SELECT id_department FROM departments WHERE title='Sales'),
VALUES ('Development team 1', SELECT id_department FROM departments WHERE title='Development'),
VALUES ('Development team 2', SELECT id_department FROM departments WHERE title='Development'),
VALUES ('Products team 1', SELECT id_department FROM departments WHERE title='Products'),
VALUES ('Products team 2', SELECT id_department FROM departments WHERE title='Products');

-- Data for DEFAULT_TASKS table.
INSERT INTO default_tasks (title, description, id_team, id_department)
VALUES ('Zalozit si e-mail', 'akjdaskdnadnaln', null, null),
VALUES ('Zalozit si Podio ucet', 'akjdaskdnadnaln', null, null),
VALUES ('Pozdravit developery', 'akjdaskdnadnaln', null, SELECT id_department FROM departments WHERE title='Development'),
VALUES ('Pozdravit salesmany', 'akjdaskdnadnaln', null, SELECT id_department FROM departments WHERE title='Sales'),
VALUES ('Pozdravit developery z tymu 1', 'akjdaskdnadnaln', SELECT id_team FROM teams WHERE title='Development team 1', SELECT id_department FROM departments WHERE title='Development');

-- Data for USERS table.
INSERT INTO users (first_name, last_name, email, id_role, id_buddy)
VALUES ('Jan', 'Koren', 'jan.koren@socialbakers.com', SELECT id_role FROM user_roles WHERE title='Team manager', null),
VALUES ('David', 'Moravek', 'david.moravek@socialbakers.com', SELECT id_role FROM user_roles WHERE title='Administrator', null),
VALUES ('Vladimir', 'Laznicka', 'vladimir.laznicka@socialbakers.com', SELECT id_role FROM user_roles WHERE title='User', null),
VALUES ('Marek', 'Simunek', 'marek.simunek@socialbakers.com', SELECT id_role FROM user_roles WHERE title='User', null),
VALUES ('Vladimir', 'Neckar', 'vladimir.neckar@socialbakers.com', SELECT id_role FROM user_roles WHERE title='User', null),
VALUES ('Karel', 'Zibar', 'karel.zibar@socialbakers.com', SELECT id_role FROM user_roles WHERE title='User', SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'),
VALUES ('Frantisek', 'Kolenak', 'frantisek.kolenak@socialbakers.com', SELECT id_role FROM user_roles WHERE title='User', null),
VALUES ('Lukas', 'Witz', 'lukas.witz@socialbakers.com', SELECT id_role FROM user_roles WHERE title='User', SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com');

-- Data for USERS_TEAMS table.
INSERT INTO users_teams (id_user, id_team, is_admin) 
VALUES (SELECT id_user FROM users WHERE email='jan.koren@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 1', TRUE),
VALUES (SELECT id_user FROM users WHERE email='jan.koren@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 2', TRUE),
VALUES (SELECT id_user FROM users WHERE email='david.moravek@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 1', FALSE),
VALUES (SELECT id_user FROM users WHERE email='david.moravek@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 2', TRUE);

INSERT INTO users_teams (id_user, id_team)
VALUES (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 2'),
VALUES (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 1'),
VALUES (SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 2'),
VALUES (SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 1'),
VALUES (SELECT id_user FROM users WHERE email='frantisek.kolenak@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 2'),
VALUES (SELECT id_user FROM users WHERE email='lukas.witz@socialbakers.com', SELECT id_team FROM teams WHERE title='Development team 1');

-- Data for TASKS table.
INSERT INTO tasks (title, description, notes, date_from, date_to, id_user, id_buddy)
VALUES ('Create DB schema', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com', SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'),
VALUES ('Create test data', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com', SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'),
VALUES ('helpers', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com', null),
VALUES ('Implementovat express.io', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com', null),
VALUES ('Nasadit Easy-Pg a vytvorit config.json', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com', null),
VALUES ('mediator', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com', null),
VALUES ('base model', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com', null),
VALUES ('core', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com', null),
VALUES ('router', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com', null),
VALUES ('base component', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='frantisek.kolenak@socialbakers.com', SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'),
VALUES ('view base', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='frantisek.kolenak@socialbakers.com', null),
VALUES ('observer', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', SELECT id_user FROM users WHERE email='lukas.witz@socialbakers.com', null);

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