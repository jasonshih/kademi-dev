function initBlogsApp(orgRoot, webRoot, enabled) {
    var blogsApp = applications.blogs;
    log.info("initBlogsApp: orgRoot={} app={}", orgRoot, blogsApp);
    var alertsApp = applications.alerts;
    if (webRoot) {
        var website = webRoot.website;
        var webName = webRoot.websiteName;
        // check and create the participants group
        var groupName = "blog-users";
        var groupBlogAuthorsName = "blog-authors";
        var group = orgRoot.find("groups").child(groupName);
        if (group == null) {
            group = orgRoot.createGroup(groupName);
            orgRoot.addRoles(group, "BlogReader");
            orgRoot.addRoles(group, website, "Content Viewer");
            orgRoot.addGroupToWebsite(group, website);
            log.info("Created group '" + groupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("Blogs", "We've created a group called " + group.name + " which allows members to view blog articles. Please be sure to <a href='/groups/" + groupName + "'>check the settings here</a>. You might want to allow public registration to this group.");
            }
        }

        var groupBlogAuthors = orgRoot.find("groups").child(groupBlogAuthorsName);
        if (groupBlogAuthors == null) {
            groupBlogAuthors = orgRoot.createGroup(groupBlogAuthorsName);
            orgRoot.addRoles(groupBlogAuthors, "Blogger");
            orgRoot.addGroupToWebsite(groupBlogAuthors, website);
            log.info("Created group '" + groupBlogAuthorsName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("Blogs", "We've created a group called " + groupBlogAuthors.name + " for creating blog articles. Please be sure to <a href='/groups/\" + groupName + \"'>check the settings here</a>");
            }
        }

        var curUser = securityManager.currentUser;
        securityManager.addToGroup(curUser, group);
        securityManager.addToGroup(curUser, groupBlogAuthors);


        // Todo Needs API for creating blog, article within blogsApp instance

    } else {
        log.info("I'm in an organisation");
    }
}