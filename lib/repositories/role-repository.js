
module.exports = function(dbClient) {

    return{
        /**
         * Retrieves all records from table user_roles
         * @param next - callback function
         */
        getUserRoles : function(next){
            dbClient.queryAll('SELECT * FROM user_roles', next);
        },
        /**
         * Retrieves all records from table department_roles
         * @param next - callback function
         */
        getDepartmentRoles : function(next){
            dbClient.queryAll('SELECT * FROM department_roles', next);
        }
    };
};