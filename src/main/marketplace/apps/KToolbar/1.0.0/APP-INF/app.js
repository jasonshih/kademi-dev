// ============================================================================
// Portlet
// ============================================================================
controllerMappings
    .websitePortletController()
    .portletSection('endOfPage')
    .templatePath('/theme/apps/KToolbar/ktoolbar.html')
    .method('getKToolbar')
    .enabled(true)
    .build();

function getKToolbar() {
    log.info('getKToolbar');
}