controllerMappings.addComponent("email/components", "viewEmailInBrowserEDM", "edm", "Display a link to view the email in the users web browser", "Email");
controllerMappings.addComponent("email/components", "unsubscribeLinkEDM", "edm", "Display a link in emails that will allow users to unsubscribe", "Email");
controllerMappings.addComponent("email/components", "passwordResetLinkEDM")
        .addType("edm")
        .desc("Display a link in emails that will allow users to create or reset their password")
        .categories("Email")
        .addDefaultAtt("paddingTop", "10px")
        .addDefaultAtt("paddingBottom", "10px")
        .addDefaultAtt("paddingLeft", "10px")
        .addDefaultAtt("paddingRight", "10px")
        .addDefaultAtt("message", "Reset your password")
        .build();
;
