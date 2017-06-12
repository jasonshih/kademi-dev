function initRewardStoreApp(orgRoot, webRoot, enabled){
    log.info("initRewardStoreApp: orgRoot={}", orgRoot);
    if( webRoot ){
        var webName = webRoot.websiteName;
        // check and create the participants group
        var group = orgRoot.find("groups").child("participants");
        if( group == null ) {
            group = orgRoot.createGroup("participants");
            log.info("Created participants group");
        }
        
        // check and create the points bucket
        var manageBuckets = orgRoot.find("points-buckets");
        var bucketName = webName + "-points";
        var defaultBucket = manageBuckets.child(bucketName);
        if( defaultBucket == null ) {
            manageBuckets.createPointsBucket(bucketName, group);
            log.info("Created points bucket");
        }
        
        // check and create the reward store
        var rewardStoreName = webName + "-store";
        var manageStores = orgRoot.find("reward-store");
        var defaultRewardStore = manageStores.child(rewardStoreName);
        if( defaultRewardStore == null ) {
            manageStores.createRewardStore(rewardStoreName, bucketName, webName);
            log.info("Created reward store");
        }
        
    } else {
        log.info("I'm in an organisation");
    }
}