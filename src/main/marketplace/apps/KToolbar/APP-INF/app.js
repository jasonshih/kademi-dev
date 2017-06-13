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

function getKToolbar(page, params, context) {
    log.info('getKToolbar');
    
    var fontFamilyList = {
        'arial,helvetica,sans-serif': 'Arial',
        'comic sans ms,cursive': 'Comic Sans MS',
        'courier new,courier,monospace': 'Courier New',
        'lucida sans unicode,lucida grande,sans-serif': 'Lucida Sans Unicode',
        'tahoma,geneva,sans-serif': 'Tahoma',
        'times new roman,times,serif': 'Times New Roman',
        'trebuchet ms,helvetica,sans-serif': 'Trebuchet MS',
        'verdana,geneva,sans-serif': 'Verdana'
    };
    
    context.put('fontFamilyList', fontFamilyList);
}