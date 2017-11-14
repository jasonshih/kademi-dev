function initLearningApp(orgRoot, webRoot, enabled, repoDir) {
    var leadmanApp = applications.learning;
    log.info("initLeadManApp: orgRoot={} app={}", orgRoot, leadmanApp);
    var alertsApp = applications.alerts;

    if (webRoot) {
        var website = webRoot.website;
        var webName = webRoot.websiteName;

        var groupName = "learners";
        var group = orgRoot.find("groups").child(groupName);
        if (group == null) {
            group = orgRoot.createGroup(groupName);
            log.info("Created group '" + groupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("KLearning", "We've created a group called " + group.name + " for your learners. Please be sure to <a href='/groups/" + groupName + "'>check the settings here</a>.");
            }
        }

        // Add current user to the learner
        var curUser = securityManager.currentUser;
        securityManager.addToGroup(curUser, groupName);
        if (alertsApp) {
            alertsApp.createAdminAlert("KLearning", "Added you to the " + groupName + " group");
        }

    } else {
        log.info("I'm in an organisation");
    }
}