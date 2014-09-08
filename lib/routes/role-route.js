module.exports = function(router, roleRepository) {

    //retrieves all user roles from database
    router.register('role/user', function (req, next) {
        roleRepository.getUserRoles(next);
    });

    //retrieves all user roles from database
    router.register('role/departments', function (req, next) {
        roleRepository.getDepartmentRoles(next);
    });

};