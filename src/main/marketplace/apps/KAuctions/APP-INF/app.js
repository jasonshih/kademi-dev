function initAuctionsApp(orgRoot, webRoot, enabled) {
    var auctionsApp = applications.auctionApp;

    log.info("initAuctionsApp: orgRoot={} app={}", orgRoot, auctionsApp);
    var alertsApp = applications.alerts;
    if (webRoot) {
        var website = webRoot.website;
        var webName = webRoot.websiteName;

        // check and create the participants group
        var groupName = "participants";
        var group = orgRoot.find("groups").child(groupName);
        if (group == null) {
            group = orgRoot.createGroup("participants");
            orgRoot.addGroupToWebsite(group, website);
            log.info("Created participants group '" + groupName + "'");
        } else {
            group = group.group;
        }

        orgRoot.addRoles(group, "AuctionViewer");

        var curUser = securityManager.currentUser;
        securityManager.addToGroup(curUser, group);

        var bucketName = webName + "-points";
        var auctionName = webName + "-auction";
        var auctionTitle = webName + " - Sample Auction";

        var startDate = formatter.now;
        var endDate = formatter.addDays(startDate, 30);

        if (auctionsApp.checkCreateAuction(auctionName, auctionTitle, "HBA", startDate, endDate, website, bucketName, true)) {
            if (alertsApp) {
                alertsApp.createAdminAlert("Auction", "We've created an auction called " + auctionTitle + ". You can <a href='/auctions/" + auctionName + "/'>manage it here</a>");
            }
        }
    } else {
        log.info("I'm in an organisation");
    }
}