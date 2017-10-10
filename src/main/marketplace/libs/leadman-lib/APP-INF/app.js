controllerMappings.addComponent("leadman/components", "leadCompanies", "html", "Show list of companies in table format", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadsGeoLocation", "html", "Display leads in a map canvas", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadStatsSummary", "html", "Display stats for a funnel", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadDashboardList", "html", "Display leads list for a funnel", "Leadman App component");

controllerMappings.addComponent("leadman/components", "leadAnalyticsNewLeadsCreated", "html", "Display new leads created", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadAnalyticsLeadsLost", "html", "Display the leads lost", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadAnalyticsLeadsClosed", "html", "Display the leads closed", "Leadman App component");

// ============================================================================
// Portlet
// ============================================================================
controllerMappings
    .websitePortletController()
    .portletSection('shoppingCart')
    .templatePath('/theme/apps/leadman/leadmanOrgSelectorPortlet.html')
    .method('getLeadmanOrgSelector')
    .enabled(true)
    .build();

function getLeadmanOrgSelector() {
    log.info('getLeadmanOrgSelector');
}
