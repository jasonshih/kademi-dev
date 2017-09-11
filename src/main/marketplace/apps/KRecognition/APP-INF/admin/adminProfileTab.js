/* global controllerMappings, applications, formatter, Utils */

(function (g) {
    controllerMappings
            .setUserTimelineFunction('_generateProfileTimeline')
            .adminProfileTab()
            .panel('Achievements', 'krecognition-achievements-panel', '_profileTabAchievements')
            .panelTemplate('KRecognition/adminProfilePanel.html')
            .tab('Achievements', 'krecognition-achievements', '_profileTabAchievements')
            .tabTemplate('KRecognition/adminProfileTab.html')
            .build();

    /**
     * 
     * @param {type} page
     * @param {type} userResource
     * @param {type} list
     * @returns {undefined}
     */
    g._generateProfileTimeline = function (page, userResource, list) {
        var awards = applications.userApp.recognitionService.getRecognitionAwards(userResource);

        for (var i = 0; i < awards.size(); i++) {
            var award = awards.get(i);

            var icon, desc, title;

            if (Utils.isNotNull(award.recognition.asBadge())) {
                icon = 'fa fa-shield';
                desc = 'Badge "' + (award.recognition.title || award.recognition.name) + '" was awarded';
                title = 'Badge awarded';
            } else {
                icon = 'fa fa-star-half-o';
                desc = 'Level "' + (award.recognition.title || award.recognition.name) + '" achieved';
                title = 'Level Achieved';
            }

            var bean = applications.stream.streamEventBuilder()
                    .profile(userResource)
                    .category('success')
                    .icon(icon)
                    .desc(desc)
                    .title(title)
                    .inbound(false)
                    .date(award.createdDate)
                    .build();

            list.add(bean);
        }
    };

    /**
     * 
     * @param {type} page
     * @param {type} params
     * @param {type} contextMap
     * @returns {undefined}
     */
    g._profileTabAchievements = function (page, params, contextMap) {
        var awards = applications.userApp.recognitionService.getRecognitionAwards(page.profile);

        var badges = [];
        var levels = [];

        for (var i = 0; i < awards.size(); i++) {
            var award = awards.get(i);
            if (Utils.isNotNull(award.recognition.asBadge())) {
                var badge = award.recognition.asBadge();
                badges.push({
                    id: award.id,
                    badgeid: badge.id,
                    name: badge.name,
                    title: badge.title,
                    imageHash: badge.imageHash,
                    createdDate: award.createdDate
                });
            } else if (Utils.isNotNull(award.recognition.asLevel())) {
                var level = award.recognition.asLevel();
                levels.push({
                    id: award.id,
                    levelid: level.id,
                    name: level.name,
                    title: level.title,
                    amount: level.levelAmount,
                    imageHash: level.imageHash,
                    createdDate: award.createdDate
                });
            }
        }

        contextMap.put('badges', badges);
        contextMap.put('levels', levels);
    };
})(this);