/* global controllerMappings, applications, formatter, Utils */

(function (g) {
    controllerMappings
            .adminProfileTab()
            .panel('Achievements', 'krecognition-achievements-panel', '_profileTabAchievements')
            .panelTemplate('KRecognition/adminProfilePanel.html')
            .tab('Achievements', 'krecognition-achievements', '_profileTabAchievements')
            .tabTemplate('KRecognition/adminProfileTab.html')
            .build();

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