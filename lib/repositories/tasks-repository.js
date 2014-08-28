var debug = require('debug')('hrtool:tasks-repository');
var _ = require('lodash-node');




module.exports = function(dbClient){

	return{
        /**
         * Retrieve all tasks (+ name and email of user and budy) from table tasks if logged user is Administrator
         * @param userId - id of user
         * @param {function} next - callback function
         * @returns {undefined}
         */
         getAllTasks : function(userId, next){
            dbClient.queryAll("SELECT 	t.*,\
              u2.first_name AS user_first_name, u2.last_name AS user_last_name, u2.email AS user_email,\
              u3.first_name AS buddy_first_name, u3.last_name AS buddy_last_name, u3.email AS buddy_email\
              FROM tasks t\
              JOIN user_roles ur ON ur.title='Administrator'\
              JOIN users u ON u.id_user=$1 AND u.id_user_role = ur.id_user_role\
              INNER JOIN users u2 ON u2.id_user=t.id_user\
              LEFT JOIN users u3 ON u3.id_user=t.id_buddy", [userId], next);
         },

         getUserTasks : function(userId, next){
         	dbClient.queryAll('SELECT t.*, u.email as buddy_email, u.last_name as buddy_last_name, u.first_name as buddy_first_name \
              FROM tasks t \
              LEFT JOIN users u ON u.id_user= t.id_buddy  \
              WHERE t.id_user=$1', [userId], next);
         },

         getBuddyTasks : function(userId, next){			
         	dbClient.queryAll('SELECT t.*, u.* \
         		FROM tasks t \
         		JOIN users u ON u.id_user = t.id_user \
         		WHERE t.id_buddy = $1',[userId], next);
         },
         getTeamTasks : function(userId, next){			
         	dbClient.queryAll('SELECT t.* , u.* \
         		FROM tasks as t \
         		JOIN users_teams ut ON ut.id_team = t.id_team \
         		LEFT JOIN users u ON u.id_user = t.id_user \
         		WHERE ut.id_user=$1 AND ut.is_admin ',[userId], next);
         },
        /**
         * Change value completed to true in task record with id_task = id
         * @param id - id of task
         * @param next - callback function
         */
         finishTask : function(id, next){
         	dbClient.update('tasks', {completed: true}, 'id_task=$1', [id], next);
         },
        /**
         * Function will update task's record in database according to data from client
         * @param taskData - new task data
         * @param next - callback function
         */
         updateTask : function(taskData, next){
         	var obj = _.pick(taskData, ['title', 'description', 'notes']);
         	dbClient.updateOne('tasks', obj, 'id_task=$1', [taskData.id_task], next);
         }





      };
   };
