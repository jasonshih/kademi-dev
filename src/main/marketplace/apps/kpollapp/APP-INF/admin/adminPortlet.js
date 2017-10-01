// ============================================================================
// Admin portlet
// ============================================================================
controllerMappings
    .adminPortletController()
    .portletSection('adminDashboardQuickLinks')
    .templatePath('/theme/apps/kpollapp/kpollAdminPortlet.html')
    .method('kpollAdminPortlet')
    .enabled(true)
    .build();

function kpollAdminPortlet(page, params) {
    log.info('kpollAdminPortlet > {} {}', page, params);
    
    managePolls(page, params);
}
