;(function ($) {
    $(function () {
        var txtKeyword = $('input[name=omni]').omniSearch({
            overrideEnterButton: false,
            searchInFocus: true
        });
        
        txtKeyword.closest('form').on('submit', function (e) {
            var keyword = txtKeyword.val().trim();
        
            if (!keyword) {
                e.preventDefault();
            }
        });
    });
    
})(jQuery);