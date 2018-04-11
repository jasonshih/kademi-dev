controllerMappings
    .adminController()
    .path("/contentEditor-lib/getAllGroups")
    .enabled(true)
    .defaultView(views.jsonView("allGroupsRes"))
    .addMethod("GET", "getAllGroups")
    .build();

controllerMappings
    .websiteController()
    .path("/contentEditor-lib/getAllGroups")
    .enabled(true)
    .isPublic(true)
    .defaultView(views.jsonView("allGroupsRes"))
    .addMethod("GET", "getAllGroups")
    .build();

function getAllGroups(page, params) {
    log.info('getAllGroups > page={}, params={}', page, params);
    
    var data = {};
    var allGroups = page.find('/').allGroups;
    
    for (var i = 0; i < allGroups.length; i++) {
        var group = allGroups[i];
        data[group.name] = group.title || group.name;
    }

    page.attributes.allGroupsRes = {data: data, status: true};
}