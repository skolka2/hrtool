-- Test data for database.

-- Delete statements for clearing all tables when needed.
DELETE FROM user_roles;
DELETE FROM departments;
DELETE FROM teams;
DELETE FROM default_tasks;
DELETE FROM users;
DELETE FROM users_teams;
DELETE FROM tasks;

-- Data for USER_ROLES table.
INSERT INTO user_roles (title) VALUES ('User'), ('Team manager'), ('Administrator');

-- Data for DEPARTMENTS table.
INSERT INTO departments (title) VALUES ('Sales'), ('Development'), ('Products');

-- Data for TEAMS table.
INSERT INTO teams (title, id_department)
VALUES 
('Sales team 1', (SELECT id_department FROM departments WHERE title='Sales')),
('Sales team 2', (SELECT id_department FROM departments WHERE title='Sales')),
('Development team 1', (SELECT id_department FROM departments WHERE title='Development')),
('Development team 2', (SELECT id_department FROM departments WHERE title='Development')),
('Products team 1', (SELECT id_department FROM departments WHERE title='Products')),
('Products team 2', (SELECT id_department FROM departments WHERE title='Products'));

-- Data for DEFAULT_TASKS table.
INSERT INTO default_tasks (title, description, id_team, id_department)
VALUES 
('Zalozit si e-mail', 'akjdaskdnadnaln', null, null),
('Zalozit si Podio ucet', 'akjdaskdnadnaln', null, null),
('Pozdravit developery', 'akjdaskdnadnaln', null, (SELECT id_department FROM departments WHERE title='Development')),
('Pozdravit salesmany', 'akjdaskdnadnaln', null, (SELECT id_department FROM departments WHERE title='Sales')),
('Pozdravit developery z tymu 1', 'akjdaskdnadnaln', (SELECT id_team FROM teams WHERE title='Development team 1'), (SELECT id_department FROM departments WHERE title='Development'));

-- Data for USERS table.
INSERT INTO users (first_name, last_name, email, id_user_role)
VALUES 
('Jan', 'Koren', 'jan.koren@socialbakers.com', (SELECT id_user_role FROM user_roles WHERE title='Team manager')),
('David', 'Moravek', 'david.moravek@socialbakers.com', (SELECT id_user_role FROM user_roles WHERE title='Administrator')),
('Vladimir', 'Laznicka', 'vladimir.laznicka@socialbakers.com', (SELECT id_user_role FROM user_roles WHERE title='User')),
('Marek', 'Simunek', 'marek.simunek@socialbakers.com', (SELECT id_user_role FROM user_roles WHERE title='User')),
('Vladimir', 'Neckar', 'vladimir.neckar@socialbakers.com', (SELECT id_user_role FROM user_roles WHERE title='User')),
('Frantisek', 'Kolenak', 'frantisek.kolenak@socialbakers.com', (SELECT id_user_role FROM user_roles WHERE title='User'));

INSERT INTO users (first_name, last_name, email, id_user_role, id_buddy)
VALUES
('Karel', 'Zibar', 'karel.zibar@socialbakers.com', (SELECT id_user_role FROM user_roles WHERE title='User'), (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com')),
('Lukas', 'Witz', 'lukas.witz@socialbakers.com', (SELECT id_user_role FROM user_roles WHERE title='User'), (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'));

-- Data for USERS_TEAMS table.
INSERT INTO users_teams (id_user, id_team, is_admin)
VALUES 
((SELECT id_user FROM users WHERE email='jan.koren@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 1'), TRUE),
((SELECT id_user FROM users WHERE email='jan.koren@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 2'), TRUE),
((SELECT id_user FROM users WHERE email='david.moravek@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 1'), FALSE),
((SELECT id_user FROM users WHERE email='david.moravek@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 2'), TRUE);

INSERT INTO users_teams (id_user, id_team)
VALUES 
((SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 2')),
((SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 1')),
((SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 2')),
((SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 1')),
((SELECT id_user FROM users WHERE email='frantisek.kolenak@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 2')),
((SELECT id_user FROM users WHERE email='lukas.witz@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 1'));

-- Data for TASKS table.
INSERT INTO tasks (title, description, notes, date_from, date_to, id_user, id_buddy,	id_team, id_department)
VALUES 
('Create DB schema', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'), (SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 2'), (SELECT id_department FROM departments WHERE title='Development')),
('Create test data', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'), (SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Development team 2'), (SELECT id_department FROM departments WHERE title='Development')),
('helpers', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'), null, (SELECT id_team FROM teams WHERE title='Development team 1'), (SELECT id_department FROM departments WHERE title='Development')),
('Implementovat express.io', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'), null, (SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('Nasadit Easy-Pg a vytvorit config.json', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'), null, (SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('mediator', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'), null,(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('base model', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'), null,(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('core', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com'), null,(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('router', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com'), null,(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('base component', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='frantisek.kolenak@socialbakers.com'), (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('view base', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='frantisek.kolenak@socialbakers.com'), null,(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('observer', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='lukas.witz@socialbakers.com'), null,(SELECT id_team FROM teams WHERE title='Products team 2'),(SELECT id_department FROM departments WHERE title='Products'));