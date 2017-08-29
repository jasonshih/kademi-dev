/* global controllerMappings, views, transactionManager, applications */

(function (g) {
    controllerMappings
            .adminController()
            .path('/recognition')
            .addMethod('GET', 'checkRedirect')
            .enabled(true)
            .build();

    controllerMappings
            .adminController()
            .path('/recognition/')
            .defaultView(views.templateView('/theme/apps/KRecognition/manageTopics.html'))
            .addMethod('POST', '_createTopic', 'newName')
            .postPriviledge('WRITE_CONTENT')
            .enabled(true)
            .build();

    /**
     * API for creating a new topic
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._createTopic = function (page, params) {
        var name = params.newName;
        var title = params.title;

        var newTopic;

        transactionManager.runInTransaction(function () {
            newTopic = applications.userApp.recognitionService.createTopic(name, title);
        });

        return views.jsonResult(true, "Created " + newTopic.title, newTopic.id);
    };
})(this);