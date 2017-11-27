$(function () {
    if (!$('.content-editor-page').length){
        $('.cktemplate-btn-toggle-panel').find('i').addClass('fa-chevron-down').removeClass('fa-chevron-up ');
        $(document).on('click', '.cktemplate-btn-toggle-panel', function (e) {
            e.preventDefault();
            var panel = $(this).closest('.panel');
            panel.find('.panel-body').slideToggle();
            setTimeout(function () {
                $(this).find('i').toggleClass('fa-chevron-up fa-chevron-down');
            },700);
        });
    }
});