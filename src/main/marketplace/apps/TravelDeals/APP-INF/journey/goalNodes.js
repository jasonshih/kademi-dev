/* global controllerMappings, Utils */

(function (g) {
    controllerMappings
            .addGoalNodeType('travelDealReceivedEnquiryGoal', 'travelDeals/jb/travelDealReceivedEnquiryGoal.js', '_receivedEnquiryGoal');

    g._receivedEnquiryGoal = function (rf, lead, funnel, eventParams, customNextNodes, customSettings, event, atts) {
        if (rf.is('website')) {
            var websiteName = Utils.safeString(customSettings.websiteName);
            var dealName = Utils.safeString(customSettings.dealName);

            if (Utils.isStringNotBlank(websiteName)) {
                log.info('Checking websiteName: {} | {}', websiteName, rf.websiteName);
                // We have a configured website, Make sure it matches :-)
                if (websiteName !== Utils.safeString(rf.websiteName)) {
                    return false;
                }
            }

            if (Utils.isStringNotBlank(dealName)) {
                log.info('Checking dealName: {} | {}', dealName, eventParams.deal.name);
                // We have a configured deal, Make sure it matches
                if (g._config.RECORD_NAMES.DEAL(dealName) !== Utils.safeString(eventParams.deal.name)) {
                    return false;
                }
            }

            atts.put('travelDealEnquiryName', eventParams.enquiry.name);

            return true;
        }

        return false;
    };
})(this);