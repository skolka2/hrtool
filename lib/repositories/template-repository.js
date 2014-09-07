var _ = require('lodash-node');

module.exports = function(dbClient){

    return{
        /**
         * Insert new record to table task_templates
         * @param data - template date
         * @param next - callback function
         */
        insertTemplate : function(data, next){
            dbClient.insertOne('task_templates', data, next);
        },
        /**
         * Delete record from table task_templates
         * @param data - id of deleted record
         * @param next - callback function
         */
        deleteTemplate : function(data, next){
            dbClient.queryOne("SELECT * FROM tasks_implicit WHERE id_task_template=$1", [data.id_task_template], function(err, row) {
                if(row != {})
                    return next('implicit task cannot be deleted');

                dbClient.delete('task_templates', 'id_task_template=$1', [data.id_task_template], next);
            });
        },
        /**
         * Record in table task_templates will be updated
         * @param data - new data
         * @param next - callback function
         */
        updateTemplate : function(data, next){
            var obj = _.pick(data, ['title', 'description', 'id_department', 'id_team']);
            dbClient.updateOne('task_templates', obj, 'id_task_template=$1', [data.id_task_template], next);
        },
        /**
         * Return all records from table task_templates if logged user has rights to get them
         * @param userRoleId - record from table users of logged user
         * @param next - callback function
         */
        getAllTemplates : function(userRoleId, next){
            dbClient.queryAll("SELECT id_user_role FROM user_roles WHERE title='Administrator' OR title='Team manager'" , function(err, data){
                if(err) return next(err);
                var temp = false;
                for(var i in data){
                    if(data[i].id_user_role === userRoleId){
                        temp = true;
                        break;
                    }
                }
                if(temp)
                    dbClient.queryAll("SELECT tt.*, ti.id_task_template AS implicit \
                    FROM task_templates tt\
                    LEFT JOIN tasks_implicit ti ON tt.id_task_template=ti.id_task_template ", next);
            });
        }





    };
};
