/* global controllerMappings */

(function (g) {

    controllerMappings
            .addActionNodeType('krecognition-awardBadgeActionNode', 'KRecognition/jb/awardBadgeActionNode.js', '_onAwardBadgeEnter')
            .addGoalNodeType('krecognition-badgeAwardedGoal', 'KRecognition/jb/badgeAwardedGoalNode.js', '_onBadgeAwardedGoalEnter')
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

    };

    /**
     * 
     * @param {type} rf
     * @param {type} lead
     * @param {type} funnel
     * @param {type} exitingNode
     * @param {type} customSettings
     * @returns {undefined}
     */
    g._onBadgeAwardedGoalEnter = function (rf, lead, funnel, exitingNode, customSettings) {

    };

    g._onLevelAchievedGoalEnter = function (rf, lead, funnel, exitingNode, customSettings) {

    };
})(this);