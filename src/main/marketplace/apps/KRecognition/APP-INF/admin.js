controllerMappings
    .adminController()
    .path('/recognition')
    .addMethod('GET', 'checkRedirect')
    .enabled(true)
    .build();



controllerMappings
    .adminController()
    .path('/recognition/')
    .defaultView(views.templateView('/theme/apps/KRecognition/viewTopics.html'))
    .addMethod('POST', 'createTopic', 'newName')
    .postPriviledge('WRITE_CONTENT')
    .enabled(true)
    .build();

controllerMappings
    .adminController()
    .path('/recognition/(?<topicId>[^/]*)')
    .addMethod('GET', 'checkRedirect')
    .enabled(true)
    .build();

controllerMappings
    .adminController()
    .path('/recognition/(?<topicId>[^/]*)/')
    .defaultView(views.templateView('/theme/apps/KRecognition/viewTopic.html'))
    .addMethod('POST', 'updateTopic', 'name')
    .enabled(true)
    .build();

function createTopic(page, params) {
    var name = params.newName;
    var title = params.title;

    transactionManager.begin();
    var newTopic = applications.userApp.recognitionService.createTopic(name, title);
    transactionManager.commit();

    return views.jsonResult(true, "Created " + newTopic.name, name);

}

function updateTopic(page, params) {

    var id = formatter.toLong( page.attributes.topicId );
    var topic = applications.userApp.recognitionService.getTopic(id);

    transactionManager.begin();

    page.dataBind(topic, params);

    transactionManager.commit();

    return views.jsonResult(true, "Saved " + topic.id);

}