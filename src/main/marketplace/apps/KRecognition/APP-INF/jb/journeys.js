/* global controllerMappings, Utils, applications, eventManager, formatter */

(function (g) {

    controllerMappings
            .addActionNodeType(g.AWARD_BADGE_ACTION_NAME, 'KRecognition/jb/awardBadgeActionNode.js', '_onAwardBadgeEnter')
            .addGoalNodeType(g.BADGE_AWARDED_GOAL_NAME, 'KRecognition/jb/badgeAwardedGoalNode.js', '_onBadgeAwardedGoalEnter')
            .addGoalNodeType(g.LEVEL_ACHIEVED_GOAL_NAME, 'KRecognition/jb/levelAchievedGoal.js', '_onLevelAchievedGoalEnter');

    /**
     * 
     * @param {type} rf
     * @param {type} lead
     * @param {type} funnel
     * @param {type} exitingNode
     * @param {type} customSettings
     */
    g._onAwardBadgeEnter = function (rf, lead, funnel, exitingNode, customSettings) {
        // Check if we have a profile to assigne the badge to
        if (Utils.isNotNull(lead) && Utils.isNotNull(lead.profile)) {
            var topicId = Utils.safeInt(customSettings.topic);
            var badgeId = Utils.safeInt(customSettings.badge);

            var topic = applications.userApp.recognitionService.getTopic(topicId);
            var badge = topic.getBadge(badgeId);

            var award = applications.userApp.recognitionService.createAward(badge, lead.profile);

            var m = {
                'awardid': Utils.safeString(award.id),
                'createdDate': formatter.formatDateISO8601(award.createdDate),
                'badgeid': Utils.safeString(badge.id),
                'badgename': Utils.safeString(badge.name),
                'badgetitle': Utils.safeString(badge.title)
            };

            eventManager.goalAchieved(g.BADGE_AWARDED_GOAL_NAME, lead.profile, m);
        }
    };

    /**
     * 
     * @param {type} rf
     * @param {type} lead
     * @param {type} f
     * @param {type} eventParams
     * @param {type} customNextNodes
     * @param {type} customSettings
     * @param {type} event
     * @returns {undefined|Boolean}
     */
    g._onBadgeAwardedGoalEnter = function (rf, lead, f, eventParams, customNextNodes, customSettings, event) {
        var topicId = Utils.safeInt(customSettings.topic);
        var badgeId = Utils.safeInt(customSettings.badge);

        var topic = applications.userApp.recognitionService.getTopic(topicId);
        var badge = null;

        if (Utils.isNotNull(topic)) {
            // We found a configured topic, so it MUST match
            var topicMatches = Utils.safeInt(eventParams.topicId) === topicId;
            var badgeMatches = false;

            badge = topic.getBadge(badgeId);

            if (Utils.isNotNull(badge)) {
                // We found a configured badge, so it MUST match
                badgeMatches = Utils.safeInt(eventParams.badgeid) === badgeId;
            } else {
                badgeMatches = true;
            }

            return topicMatches && badgeMatches;
        } else {
            return true;
        }

        return false;
    };

    /**
     * 
     * @param {type} rf
     * @param {type} lead
     * @param {type} f
     * @param {type} eventParams
     * @param {type} customNextNodes
     * @param {type} customSettings
     * @param {type} event
     * @returns {undefined}
     */
    g._onLevelAchievedGoalEnter = function (rf, lead, f, eventParams, customNextNodes, customSettings, event) {
        var topicId = Utils.safeInt(customSettings.topic);
        var levelId = Utils.safeInt(customSettings.level);

        var topic = applications.userApp.recognitionService.getTopic(topicId);
        var level = null;

        if (Utils.isNotNull(topic)) {
            // We found a configured topic, so it MUST match
            var topicMatches = Utils.safeInt(eventParams.topicId) === topicId;
            var levelMatches = false;

            level = topic.getLevel(levelId);

            if (Utils.isNotNull(level)) {
                // We found a configured badge, so it MUST match
                levelMatches = Utils.safeInt(eventParams.levelid) === levelId;
            } else {
                levelMatches = true;
            }

            return topicMatches && levelMatches;
        } else {
            return true;
        }

        return false;
    };
})(this);