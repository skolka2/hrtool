

module.exports = function(router, templateRepository){

    //Insert new record to table templates
    router.register('template/insert', function(req, next){
        templateRepository.insertTemplate(req.data, next);
    });

    //Delete record from table templates
    router.register('template/delete', function(req, next){
        if(!req.data.id_task_template)
            return next('missing key: id_task_template');
        templateRepository.deleteTemplate(req.data, next);
    });

    //All saved templates will be sent to client if logged user has rights
    router.register('template/get-all', function(req, next){
        templateRepository.getAllTemplates(req.session.passport.user.id_user_role, next);
    });

    //Template record in table task_templates will be updated
    router.register('template/update', function(req, next){
        if(!req.data.id_task_template)
            return next('missing key: id_task_template');
        templateRepository.updateTemplate(req.data, next);
    });
};
