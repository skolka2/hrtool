var debug = require('debug')('hrtool:tasks-repository');
var _ = require('lodash-node');




module.exports = function(dbClient){

	return{
        /**
         * Retrieve all tasks from table tasks (+ some another info form other tables which is needed on frontend)
         * and send this data to client
         * @param {function} next - callback function
         * @returns {undefined}
         */
         getAllTasks : function(next){
         	dbClient.query("SELECT * FROM tasks AS t INNER JOIN departments AS d ON d.id_department = t.id_task INNER JOIN " +
         		"teams AS ts ON d.id_department = ts.id_department", next);
         },

         getUserTasks : function(userId, next){
         	dbClient.queryAll('SELECT t.*, u.*  FROM tasks t \
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
       /* Return all default tasks in database
         * @param next - callback function
         */
         getDefaultTasks : function(next){
         	dbClient.queryAll("SELECT * FROM default_tasks", next);
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
         	var obj = _.pick(taskData, ['id_task', 'title', 'description', 'notes']);
         	dbClient.updateOne('tasks', obj, 'id_task=$1', [obj.id_task], next);
         }





     }
 }