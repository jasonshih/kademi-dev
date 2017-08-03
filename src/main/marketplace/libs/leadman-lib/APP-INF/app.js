controllerMappings.addComponent("leadman/components", "leadCompanies", "html", "Show list of companies in table format", "Leadman App component");
controllerMappings.addComponent("leadman", "taskList", "html", "Display a list of task for the current user", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadsPageFilter", "html", "Display top filter on leads page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadsPageTable", "html", "Display leads table on leads page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadCover", "lead", "Display lead cover section in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadDetailForm", "lead", "Display lead form in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadCompany", "lead", "Display lead company form in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadCompanyMembers", "leadCompany", "Display the people in a customer company", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadCompanyDeals", "company", "Display the deals (ie leads) relating to a customer company", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadContact", "lead", "Display lead contact form in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadFiles", "lead", "Display lead files table in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadNotes", "lead", "Display lead notes in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadQuotes", "lead", "Display lead quotes in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadTasks", "html", "Display lead tasks list in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadTimeline", "lead", "Display lead timeline in lead page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadTaskModalContent", "lead", "Display lead task modal content", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadAnalyticsStats", "html", "Display stats graph in lead analytics page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadAnalyticsFunnel", "html", "Display funnel graph in lead analytics page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadAnalyticsTable", "html", "Display leads table in lead analytics page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadProfilesWizard", "leadProfiles", "Display contact uploader wizard on lead profiles page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadProfilesNav", "leadProfiles", "Display nav buttons on lead profiles page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadProfilesTable", "leadProfiles", "Display profiles table on lead profiles page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadProfileLeads", "html", "Display leads on contact page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadProfileCompanies", "html", "Display companies on contact page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadProfileCover", "html", "Display cover on contact page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadTasksNav", "html", "Display nav buttons on lead tasks page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadTasksTable", "html", "Display tasks list on lead tasks page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadTeam", "html", "Display team list on lead team page", "Leadman App component");
controllerMappings.addComponent("leadman/components", "cancelLead", "html", "Display cancel form of a lead", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadsGeoLocation", "html", "Display leads in a map canvas", "Leadman App component");
controllerMappings.addComponent("leadman/components", "leadsStatsSummary", "html", "Display stats for a funnel", "Leadman App component");

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
