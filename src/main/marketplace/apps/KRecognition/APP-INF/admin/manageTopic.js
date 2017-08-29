/* global controllerMappings, views, transactionManager, applications, formatter, Utils, fileManager */

(function (g) {
    controllerMappings
            .adminController()
            .enabled(true)
            .path('/recognition/(?<topicId>[^/]*)')
            .addMethod('GET', 'checkRedirect')
            .build();

    controllerMappings
            .adminController()
            .enabled(true)
            .path('/recognition/(?<topicId>[^/]*)/')
            .addPathResolver('topicId', 'resolveTopicId')
            .defaultView(views.templateView('/theme/apps/KRecognition/manageTopic.html'))
            .addMethod('POST', '_updateTopic', 'saveDetails')
            .addMethod('DELETE', '_deleteTopic')
            /* Images */
            .addMethod('POST', '_applyImage', 'applyImage')
            /* Badges */
            .addMethod('POST', '_createBadge', 'createBadge')
            .addMethod('POST', '_deleteBadge', 'deleteBadge')
            .addMethod('POST', '_uploadBadgeImage', 'uploadBadgeImage')
            .addMethod('POST', '_removeBadgeImage', 'removeBadgeImage')
            /* Levels */
            .addMethod('POST', '_createLevel', 'createLevel')
            .addMethod('POST', '_deleteLevel', 'deleteLevel')
            .addMethod('POST', '_uploadLevelImage', 'uploadLevelImage')
            .addMethod('POST', '_removeLevelImage', 'removeLevelImage')
            /* Build the controller */
            .build();

    /**
     * API for updating a topic
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._updateTopic = function (page, params) {
        var topic = page.attributes.topicId;
        var newParams = formatter.newMap();
        newParams.putAll(params);

        // Check for dataSeries
        if (Utils.isStringNotBlank(newParams.dataSeries)) {
            var dataSeriesName = newParams.dataSeries;
            newParams.remove('dataSeries');
            newParams.remove('pointsBucket');

            var sds = applications.salesData.getSalesDataSeries(dataSeriesName);
            newParams.put('dataSeries', sds);
        }
        // Check for pointsBucket
        else if (Utils.isStringNotBlank(newParams.pointsBucket)) {
            var pointsBucketName = newParams.pointsBucket;
            newParams.remove('dataSeries');
            newParams.remove('pointsBucket');

            var allPointsBuckets = applications.rewards.allPointsBuckets;
            for (var i = 0; i < allPointsBuckets.size(); i++) {
                var pb = allPointsBuckets.get(i);
                if (pb.name == pointsBucketName) {
                    newParams.put('pointsBucket', pb);
                    break;
                }
            }
        } else {
            newParams.remove('dataSeries');
            newParams.remove('pointsBucket');
        }

        transactionManager.runInTransaction(function () {
            page.dataBind(topic, newParams);
        });

        return views.jsonResult(true, 'Saved ' + topic.title);
    };

    /**
     * API to create a new badge
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._createBadge = function (page, params) {
        var topic = page.attributes.topicId;

        var badgeName = Utils.safeString(params.newName);
        var badgeTitle = Utils.safeString(params.title);

        // Check for an existing badge
        var existingBadge = topic.getBadge(badgeName);
        if (Utils.isNotNull(existingBadge)) {
            return views.jsonResult(false, 'A badge with the name ' + badgeName + ' already exists');
        }

        var newBadge;

        transactionManager.runInTransaction(function () {
            newBadge = applications.userApp.recognitionService.createBadge(topic, badgeName, badgeTitle);
        });

        return page.jsonResult(true, 'Created ' + newBadge.title);
    };

    /**
     * API to delete a badge
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._deleteBadge = function (page, params) {
        var topic = page.attributes.topicId;
        var badge = topic.getBadge(Utils.safeInt(params.badgeid));

        if (Utils.isNull(badge)) {
            return page.jsonResult(false, 'Could not find badge with ID: ' + params.badgeid);
        }

        applications.userApp.recognitionService.deleteBadge(topic, badge);

        return page.jsonResult(true, 'Success');
    };

    /**
     * API for deleting a topic
     * 
     * @param {type} page
     * @returns {undefined}
     */
    g._deleteTopic = function (page) {
        var topic = page.attributes.topicId;

        transactionManager.runInTransaction(function () {
            applications.userApp.recognitionService.deleteTopic(topic.id);
        });

        return page.jsonResult(true, 'Deleted ' + topic.title);
    };

    /**
     * API for uploading badge images
     * 
     * @param {type} page
     * @param {type} params
     * @param {type} files
     * @returns {undefined}
     */
    g._uploadBadgeImage = function (page, params, files) {
        var topic = page.attributes.topicId;
        var badge = topic.getBadge(Utils.safeInt(params.badgeid));

        if (Utils.isNull(badge)) {
            return page.jsonResult(false, 'Could not find badge with ID: ' + params.badgeid);
        }

        if (params.containsKey('overwrite')) {
            var file = files.get('badgeImg');
            var hash;

            transactionManager.runInTransaction(function () {
                hash = fileManager.uploadFile(file);
                var m = {
                    imageHash: hash
                };

                page.dataBind(badge, m);
            });

            return page.jsonResult(true, 'Uploaded', '/_hashes/files/' + hash);
        } else if (params.containsKey('crop')) {
            var newHash = g.cropImage(null, params);

            transactionManager.runInTransaction(function () {
                var m = {
                    imageHash: newHash
                };

                page.dataBind(badge, m);
            });

            return page.jsonResult(true, 'cropped', '/_hashes/files/' + newHash);
        }
    };

    /**
     * API for removing an image fron a badge
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._removeBadgeImage = function (page, params) {
        var topic = page.attributes.topicId;
        var badge = topic.getBadge(Utils.safeInt(params.removeBadgeImage));

        if (Utils.isNull(badge)) {
            return page.jsonResult(false, 'Could not find badge with ID: ' + params.removeBadgeImage);
        }

        transactionManager.runInTransaction(function () {
            var m = {
                imageHash: null
            };

            page.dataBind(badge, m);
        });

        return page.jsonResult(true, 'Success');
    };

    /**
     * Used with the image cropper
     * 
     * @param {type} page
     * @returns {unresolved}
     */
    g._applyImage = function (page) {
        return page.jsonResult(true);
    };
})(this);