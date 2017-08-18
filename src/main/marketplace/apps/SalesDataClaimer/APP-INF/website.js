controllerMappings
    .websiteController()
    .path('/salesDataClaims')
    .addMethod('GET', 'checkRedirect')
    .enabled(true)
    .build();

controllerMappings
    .websiteController()
    .path('/salesDataClaims/')
    .defaultView(views.templateView('/theme/apps/salesDataClaimer/viewClaims.html'))
    .addMethod('GET', 'getClaims')
    .enabled(true)
    .build();

function getClaims(page, params) {
    log.info('getClaims > page={}, params={}', page, params);
}
