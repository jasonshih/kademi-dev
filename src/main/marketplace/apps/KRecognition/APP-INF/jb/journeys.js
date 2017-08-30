/* global controllerMappings, Utils, applications, eventManager, formatter */

(function (g) {

    controllerMappings
            .addActionNodeType('krecognition-awardBadgeActionNode', 'KRecognition/jb/awardBadgeActionNode.js', '_onAwardBadgeEnter')
            .addGoalNodeType(g.BADGE_AWARDED_GOAL_NAME, 'KRecognition/jb/badgeAwardedGoalNode.js', '_onBadgeAwardedGoalEnter')
            .addGoalNodeType('krecognition-levelAchievedGoal', 'KRecognition/jb/levelAchievedGoal.js', '_onLevelAchievedGoalEnter');

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
     * @param {type} funnel
     * @param {type} exitingNode
     * @param {type} customSettings
     * @param {type} event
     * @returns {undefined}
     */
    g._onBadgeAwardedGoalEnter = function (rf, lead, funnel, exitingNode, customSettings, event) {

    };

    /**
     * 
     * @param {type} rf
     * @param {type} lead
     * @param {type} funnel
     * @param {type} exitingNode
     * @param {type} customSettings
     * @param {type} event
     * @returns {undefined}
     */
    g._onLevelAchievedGoalEnter = function (rf, lead, funnel, exitingNode, customSettings, event) {

    };
})(this);