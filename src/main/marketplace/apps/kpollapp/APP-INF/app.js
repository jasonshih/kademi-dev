// ============================================================================
// Admin controllers
// ============================================================================
controllerMappings
    .adminController()
    .path('/kpoll/managePolls/')
    .enabled(true)
    .defaultView(views.templateView('kpollapp/managePolls.html'))
    .addMethod('GET', 'managePolls')
    .addMethod('POST', 'savePoll', 'isAdd')
    .addMethod('POST', 'savePoll', 'isEdit')
    .addMethod('POST', 'deletePolls', 'isDelete')
    .build();

controllerMappings
    .adminController()
    .path('/kpoll/managePolls/(?<pollId>[^/]*)')
    .enabled(true)
    .addPathResolver('pollId', 'checkPollId')
    .defaultView(views.templateView('kpollapp/managePoll.html'))
    .addMethod('GET', 'managePoll')
    .addMethod('POST', 'managePollGroups', 'group')
    .addMethod('POST', 'clearAnswerers', 'clearAnswerers')
    .title('genTitle')
    .build();

controllerMappings
    .adminController()
    .path('/kpoll/managePolls/(?<pollId>[^/]*)/viewResult')
    .enabled(true)
    .addPathResolver('pollId', 'checkPollId')
    .defaultView(views.templateView('kpollapp/viewResult.html'))
    .addMethod('GET', 'viewResult')
    .title('genTitle')
    .build();

// Admin portlet
controllerMappings
    .adminPortletController()
    .portletSection('adminDashboardQuickLinks')
    .templatePath('/theme/apps/kpollapp/kpollAdminPortlet.html')
    .method('kpollAdminPortlet')
    .enabled(true)
    .build();

// Update mappings
controllerMappings
    .adminController()
    .path('/kpoll/updatePollMapping')
    .enabled(true)
    .defaultView(views.templateView('kpollapp/updateDB.html'))
    .addMethod('GET', 'updatePollMapping')
    .build();

controllerMappings
    .adminController() 
    .path('/kpoll/updateAnswerMapping')
    .enabled(true)
    .defaultView(views.templateView('kpollapp/updateDB.html'))
    .addMethod('GET', 'updateAnswerMapping')
    .build();

// ============================================================================
// Website controllers
// ============================================================================
controllerMappings
    .websitePortletController()
    .enabled(true)
    .portletSection('kpollPortlet')
    .templatePath('/theme/apps/kpollapp/kpollPortlet.html')
    .method('kpollPortlet')
    .build();

controllerMappings
    .websiteController()
    .enabled(true)
    .path('/kpoll/(?<pollId>[^/]*)/answer')
    .addMethod('POST', 'answerPoll')
    .postPriviledge("READ_CONTENT")
    .build();

controllerMappings.addComponent("kpollapp/components", "kpoll", "html", "Shows polls", "KPoll App component");
controllerMappings.addComponent("kpollapp/components", "kpollsTile", "html", "Shows polls in tile format", "KPoll App component;Tile component");

controllerMappings.addGoalNodeType("kpollAnsweredGoal", "kpollapp/kpollAnsweredGoalNode.js", null);