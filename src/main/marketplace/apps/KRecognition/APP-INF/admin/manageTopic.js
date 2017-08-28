/* global controllerMappings, views, transactionManager, applications, formatter, Utils */

(function (g) {
    controllerMappings
            .adminController()
            .path('/recognition/(?<topicId>[^/]*)')
            .addMethod('GET', 'checkRedirect')
            .enabled(true)
            .build();

    controllerMappings
            .adminController()
            .path('/recognition/(?<topicId>[^/]*)/')
            .defaultView(views.templateView('/theme/apps/KRecognition/manageTopic.html'))
            .addMethod('POST', '_updateTopic', 'saveDetails')
            .addMethod('POST', '_createBadge', 'createBadge')
            .addMethod('DELETE', '_deleteTopic')
            .addPathResolver('topicId', 'resolveTopicId')
            .enabled(true)
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

            var allDataseries = applications.salesData.allSalesDataSeries;
            for (var i = 0; i < allDataseries.size(); i++) {
                var dataSeries = allDataseries.get(i);
                if (dataSeries.name == dataSeriesName) {
                    newParams.put('dataSeries', dataSeries);
                    break;
                }
            }
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

        return views.jsonResult(true, 'Created ' + newBadge.title);
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

        return views.jsonResult(true, 'Deleted ' + topic.title);
    };
})(this);