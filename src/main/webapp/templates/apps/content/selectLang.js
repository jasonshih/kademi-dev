$(function () {
    if ($('.navbar-lang-selector').length > 0) {
        $('.select-lang').on('click', function (e) {
            e.preventDefault();
        
            var langCode = $(this).attr('href');
            flog('Selected lang: ' + langCode);
        
            $.cookie('selectedLangCode', langCode, {
                expires: 360, path: '/'
            });
            window.location.reload();
        });
    }
});