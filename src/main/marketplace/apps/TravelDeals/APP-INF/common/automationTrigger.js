(function (g) {
    controllerMappings
            .automationTrigger()
            .triggerId('receivedEnquiry')
            .description('Fired when a enquiry is received on a deal.')
            .build();
})(this);