controllerMappings.addComponent("alerts/components", "alerts", "html", "Alerts displayed on dashboard", "Alerts App component");
controllerMappings.addActionNodeType("createAlertAction", "vayaExtra/jb/createAlertActionNode.js", 'createAlertActionNodeEntered');

function createAlertActionNodeEntered(rootFolder, lead, funnel, exitingNode, settings) {
    log.info('createAlertActionNodeEntered {} {}', lead, funnel);
    log.info('nodeEnteredFired {}', lead.id );
    
    return null;
}