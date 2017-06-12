function initRewardStoreApp(orgRoot, webRoot, enabled){
    log.info("initRewardStoreApp: orgRoot={}", orgRoot);
    var alertsApp = applications.alerts;
    if( webRoot ){
        var webName = webRoot.websiteName;
        // check and create the participants group
        var groupName = "participants";
        var group = orgRoot.find("groups").child(groupName);
        if( group == null ) {
            group = orgRoot.createGroup("participants");
            log.info("Created participants group '" + groupName + "'");
            if( alertsApp ) {
                alertsApp.createAdminAlert("Reward Store", "We've created a group called " + group.name + " for your new reward store. You can <a href='/groups/" + groupName + "'>manage it here</a>");
            }
        }
        
        // check and create the points bucket
        var manageBuckets = orgRoot.find("points-buckets");
        var bucketName = webName + "-points";
        var defaultBucket = manageBuckets.child(bucketName);
        if( defaultBucket == null ) {
            manageBuckets.createPointsBucket(bucketName, group.name, webName);
            log.info("Created points bucket {}", bucketName);
            if( alertsApp ) {
                alertsApp.createAdminAlert("Reward Store", "We've created a points bucket called " + bucketName + " for your new reward store. You can <a href='/points-buckets/" + bucketName + "/'>manage it here</a>");
            }            
        }
        
        // check and create the reward store
        var rewardStoreName = webName + "-store";
        var manageStores = orgRoot.find("reward-store");
        var defaultRewardStore = manageStores.child(rewardStoreName);
        if( defaultRewardStore == null ) {
            manageStores.createRewardStore(rewardStoreName, bucketName, webName);
            log.info("Created reward store");
            if( alertsApp ) {
                alertsApp.createAdminAlert("Reward Store", "We've created a reward store called " + rewardStoreName + ". You can <a href='/reward-store/" + rewardStoreName + "/'>manage it here</a>");
            }                        
        }
        
    } else {
        log.info("I'm in an organisation");
    }
}