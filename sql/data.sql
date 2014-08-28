-- Test data for database.

-- Delete statements for clearing all tables when needed.
DELETE FROM user_roles;
DELETE FROM departments;
DELETE FROM teams;
DELETE FROM task_templates;
DELETE FROM tasks_implicit;
DELETE FROM users;
DELETE FROM users_teams;
DELETE FROM tasks;

-- Data for USER_ROLES table.
INSERT INTO user_roles (title) VALUES ('User'), ('Team manager'), ('Administrator');

-- Data for DEPARTMENTS table.
INSERT INTO departments (title) VALUES ('Sales'), ('Development'), ('Products');

INSERT INTO department_roles (title, id_department)
 VALUES
 ('product owner',(SELECT id_department FROM departments WHERE title='Products')),
 ('scrum master', (SELECT id_department FROM departments WHERE title='Development')),
 ('frontend', (SELECT id_department FROM departments WHERE title='Development')),
 ('backend', (SELECT id_department FROM departments WHERE title='Development'));

-- Data for TEAMS table.
INSERT INTO teams (title, id_department)
VALUES 
('Sales team 1', (SELECT id_department FROM departments WHERE title='Sales')),
('Sales team 2', (SELECT id_department FROM departments WHERE title='Sales')),
('Development team 1', (SELECT id_department FROM departments WHERE title='Development')),
('Development team 2', (SELECT id_department FROM departments WHERE title='Development')),
('Products team 1', (SELECT id_department FROM departments WHERE title='Products')),
('Products team 2', (SELECT id_department FROM departments WHERE title='Products'));

-- Data for TASK_TEMPLATES table.
INSERT INTO task_templates (title, description, id_team, id_department)
VALUES 
('Zalozit si e-mail', 'akjdaskdnadnaln', null, null),
('Zalozit si Podio ucet', 'akjdaskdnadnaln', null, null),
('Pozdravit developery', 'akjdaskdnadnaln', null, (SELECT id_department FROM departments WHERE title='Development')),
('Pozdravit salesmany', 'akjdaskdnadnaln', null, (SELECT id_department FROM departments WHERE title='Sales')),
('Pozdravit developery z tymu 1', 'akjdaskdnadnaln', (SELECT id_team FROM teams WHERE title='Development team 1'), (SELECT id_department FROM departments WHERE title='Development'));

INSERT INTO tasks_implicit (id_task_template,start_day, duration, id_department_role, id_team, id_department)
VALUES 
((SELECT id_task_template FROM task_templates WHERE title='Pozdravit developery'),1,5, (SELECT id_department_role FROM department_roles WHERE title='frontend') ,null, (SELECT id_department FROM departments WHERE title='Development')),
((SELECT id_task_template FROM task_templates WHERE title='Pozdravit developery z tymu 1'),2,3, (SELECT id_department_role FROM department_roles WHERE title='backend') ,(SELECT id_team FROM teams WHERE title='Development team 1'), (SELECT id_department FROM departments WHERE title='Development')),
((SELECT id_task_template FROM task_templates WHERE title='Zalozit si e-mail'),0,1, (SELECT id_department FROM department_roles WHERE title='scrum master') ,null, null);
-- Data for USERS table.
INSERT INTO users (first_name, last_name, email,started_at, id_user_role,id_department_role)
VALUES 
('Jan', 'Koren', 'jan.koren@socialbakers.com','2012-01-02', (SELECT id_user_role FROM user_roles WHERE title='Team manager'), (SELECT id_department_role FROM department_roles WHERE title='product owner')),
('David', 'Moravek', 'david.moravek@socialbakers.com','2014-02-14', (SELECT id_user_role FROM user_roles WHERE title='Administrator'),(SELECT id_department_role FROM department_roles WHERE title='scrum master')),
('Vladimir', 'Laznicka', 'vladimir.laznicka@socialbakers.com','2014-07-14', (SELECT id_user_role FROM user_roles WHERE title='User'),(SELECT id_department_role FROM department_roles WHERE title='frontend')),
('Marek', 'Simunek', 'marek.simunek@socialbakers.com','2014-07-14', (SELECT id_user_role FROM user_roles WHERE title='User'),(SELECT id_department_role FROM department_roles WHERE title='backend')),
('Vladimir', 'Neckar', 'vladimir.neckar@socialbakers.com','2014-07-14', (SELECT id_user_role FROM user_roles WHERE title='User'),(SELECT id_department_role FROM department_roles WHERE title='frontend')),
('Frantisek', 'Kolenak', 'frantisek.kolenak@socialbakers.com','2014-07-14', (SELECT id_user_role FROM user_roles WHERE title='User'),(SELECT id_department_role FROM department_roles WHERE title='frontend'));

INSERT INTO users (first_name, last_name, email,started_at, id_user_role, id_buddy, id_department_role)
VALUES
('Karel', 'Zibar', 'karel.zibar@socialbakers.com','2014-07-14', (SELECT id_user_role FROM user_roles WHERE title='User'), (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'),(SELECT id_department_role FROM department_roles WHERE title='backend')),
('Lukas', 'Witz', 'lukas.witz@socialbakers.com','2014-07-14', (SELECT id_user_role FROM user_roles WHERE title='User'), (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'),(SELECT id_department_role FROM department_roles WHERE title='frontend'));

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
('helpers', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'), (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 1'), (SELECT id_department FROM departments WHERE title='Development')),
('Implementovat express.io', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'), (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('Nasadit Easy-Pg a vytvorit config.json', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='karel.zibar@socialbakers.com'), (SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com'), (SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('mediator', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'), (SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('base model', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'), (SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('core', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com'), (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('router', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='vladimir.neckar@socialbakers.com'), (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('base component', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='frantisek.kolenak@socialbakers.com'), (SELECT id_user FROM users WHERE email='vladimir.laznicka@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('view base', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='frantisek.kolenak@socialbakers.com'), (SELECT id_user FROM users WHERE email='lukas.witz@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Development team 1'),(SELECT id_department FROM departments WHERE title='Development')),
('observer', 'slkfjskdfsldfmsldfmkskld', 'adkjfasdjkfndkjas', '2014-08-01', '2014-08-05', (SELECT id_user FROM users WHERE email='lukas.witz@socialbakers.com'), (SELECT id_user FROM users WHERE email='marek.simunek@socialbakers.com'),(SELECT id_team FROM teams WHERE title='Products team 2'),(SELECT id_department FROM departments WHERE title='Products'));