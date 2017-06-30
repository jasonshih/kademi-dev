;(function ($) {
    $(function () {
        initContentSearch();
    });
    
    function doContentSearch() {
        var searchResults = $('#omni-search-suggestions');
        
        var txtKeyword = $('input[name=omni]');
        var query = (txtKeyword.val() || '').trim();
        if (query === '') {
            flog('Query is empty. Clear search result panel!', searchResults);
            searchResults.html('').hide();
        } else {
            // Load fragment
            try {
                var href = 'contentSearch';
                $.ajax({
                    url: href,
                    type: 'GET',
                    data: {
                        omni: query
                    },
                    dataType: 'html',
                    success: function (data) {
                        flog('complete');
                        searchResults.html(data).show();
                    }
                });
            } catch (e) {
                flog('ERROR: ' + e);
            }
        }
    }
    
    function initContentSearch() {
        flog('initContentSearch');
        
        var KEYMAP = {
            ENTER: 13,
            ESC: 27,
            UP: 38,
            DOWN: 40
        };
        
        var txtKeyword = $('input[name=omni]');
        var searchResults = $('#omni-search-suggestions');
        
        txtKeyword.on({
            keydown: function (e) {
                switch (e.keyCode) {
                    case KEYMAP.ESC:
                        searchResults.hide();
                        break;
                    
                    case KEYMAP.UP:
                    case KEYMAP.DOWN:
                        e.preventDefault();
                        
                        var suggestions = searchResults.find('.search-suggestion');
                        var suggestionsLength = suggestions.length;
                        var actived = suggestions.filter('.active');
                        var index;
                        
                        if (actived.length === 0) {
                            index = e.keyCode === KEYMAP.UP ? suggestionsLength - 1 : 0;
                        } else {
                            var activeIndex = actived.index();
                            if (e.keyCode === KEYMAP.UP) {
                                index = activeIndex === 0 ? suggestionsLength - 1 : activeIndex - 1;
                            } else {
                                index = activeIndex === suggestionsLength - 1 ? 0 : activeIndex + 1;
                            }
                        }
                        actived.removeClass('active');
                        suggestions.eq(index).addClass('active');
                        
                        break;
                    
                    case KEYMAP.ENTER:
                        e.preventDefault();
                        
                        if (searchResults.is(':visible')) {
                            searchResults.find('.search-suggestion.active a').trigger('click');
                        } else {
                            doContentSearch();
                        }
                        
                        break;
                    
                    default:
                    // Do nothing
                }
            },
            input: function () {
                typewatch(function () {
                    doContentSearch();
                }, 200);
            },
            blur: function () {
                setTimeout(function () {
                    searchResults.css('display', 'none');
                }, 250);
            },
            focus: function () {
                doContentSearch();
            }
        });
        
        searchResults.on({
            mouseenter: function () {
                searchResults.find('.search-suggestion.active').removeClass('active');
                $(this).addClass('active');
            },
            mouseleave: function () {
                $(this).removeClass('active');
            },
            click: function (e) {
                e.preventDefault();
                
                window.location.href = $(this).find('a').attr('href');
                searchResults.hide();
            }
        }, '.search-suggestion');
        
        txtKeyword.closest('form').on('submit', function (e) {
            var keyword = txtKeyword.val().trim();
            
            if (!keyword) {
                e.preventDefault();
            }
        });
    }
    
})(jQuery);