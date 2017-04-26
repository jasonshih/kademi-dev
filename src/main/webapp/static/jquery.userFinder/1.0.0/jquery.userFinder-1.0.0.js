(function ($) {
    var KEYMAP = {
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40
    };
    var UserFinder = function (element, options) {
        flog('[UserFinder]', element, options);
        
        this.element = $(element)
        this.options = $.extend({}, UserFinder.DEFAULTS, options);
        this.init();
    };
    
    UserFinder.version = '1.0.0';
    
    UserFinder.DEFAULTS = {
        url: '/manageUsers',
        maxResults: 5,
        renderSuggestions: function (data) {
            var suggestionsHtml = '';
            
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var userName = item.fields.userName[0];
                var email;
                if (item.fields.email) {
                    email = item.fields.email[0];
                } else {
                    email = "";
                }
                var firstName = item.fields.firstName ? item.fields.firstName[0] : '';
                var surName = item.fields.surName ? item.fields.surName[0] : '';
                
                suggestionsHtml += '<li class="search-suggestion" data-user-id="' + userName + '">';
                suggestionsHtml += '    <a href="javascript:void(0);">';
                suggestionsHtml += '        <span>' + userName + '</span> &ndash; <span class="text-info">' + email + '</span>';
                if (firstName || surName) {
                    suggestionsHtml += '    <br /><small class="text-muted">' + firstName + ' ' + surName + '</small>';
                }
                suggestionsHtml += '    </a>';
                suggestionsHtml += '</li>';
            }
            
            return suggestionsHtml;
        },
        renderNoSuggestion: function () {
            return '<li class="no-result text-muted">No result</li>';
        },
        onSelectSuggestion: function (suggestion) {
            flog(this, suggestion);
        }
    };
    
    UserFinder.prototype.init = function () {
        flog('[UserFinder] Initializing...');
        
        var self = this;
        
        this.element.wrap('<div class="search-wrapper"></div>');
        this.element.before(
            '<input type="text" autocomplete="off" class="form-control search-input" value="" placeholder="' + (this.element.attr('placeholder') || '') + '" />'
        )
        this.element.after(
            '<ul class="dropdown-menu search-suggestions" style="display: none;" tabindex="-1"></ul>'
        );
        this.element.css('display', 'none').attr('tabindex', '-1');
        
        this.input = this.element.siblings('.search-input');
        this.suggestionsList = this.element.siblings('.search-suggestions');
        
        var timer;
        this.input.on({
            input: function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.search(self.input.val());
                }, 250);
            },
            keydown: function (e) {
                switch (e.keyCode) {
                    case KEYMAP.ESC:
                        self.suggestionsList.css('display', 'none');
                        break;
                    
                    case KEYMAP.UP:
                    case KEYMAP.DOWN:
                        e.preventDefault();
                        
                        var suggestions = self.suggestionsList.find('.search-suggestion');
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
                        
                        if (self.suggestionsList.is(':visible')) {
                            self.suggestionsList.find('.search-suggestion.active').trigger('click');
                        } else {
                            self.search(self.input.val());
                        }
                        
                        break;
                    
                    default:
                        // Do nothing
                }
            },
            blur: function () {
                setTimeout(function () {
                    self.suggestionsList.css('display', 'none');
                }, 250);
            }
        });
        
        this.suggestionsList.on({
            mouseenter: function () {
                self.suggestionsList.find('.search-suggestion.active').removeClass('active');
                $(this).addClass('active');
            },
            mouseleave: function () {
                $(this).removeClass('active');
            },
            click: function (e) {
                e.preventDefault();
                
                var suggestion = $(this);
                self.element.val(suggestion.attr('data-user-id'));
                self.input.val(suggestion.attr('data-user-id'));
                
                if (typeof self.options.onSelectSuggestion === 'function') {
                    self.options.onSelectSuggestion.call(self.element, suggestion);
                }
                
                self.suggestionsList.css('display', 'none');
            }
        }, '.search-suggestion');
        
        flog('[UserFinder] Initialized');
    };
    
    UserFinder.prototype.search = function (query) {
        flog('[UserFinder] Search: ' + query);
        
        var self = this;
        
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: self.options.url,
            data: {
                omni: query
            },
            success: function (resp) {
                flog('[UserFinder] Get response from server', resp);
                
                if (resp && resp.hits && resp.hits.total > 0) {
                    var data = [];
                    for (var i = 0; i < resp.hits.hits.length; i++) {
                        var hit = resp.hits.hits[i];
                        
                        if (hit && hit.fields && hit.fields.userId && data.length < 5) {
                            data.push(hit);
                        }
                    }
                    self.suggestionsList.html(self.options.renderSuggestions(data));
                } else {
                    self.suggestionsList.html(self.options.renderNoSuggestion());
                }
                
                self.suggestionsList.css('display', 'block');
            },
            error: function (jqXhr, status, error) {
                flog('[UserFinder] Get error response from server', jqXhr, status, error);
                self.suggestionsList.html(self.options.renderNoSuggestion());
                self.suggestionsList.css('display', 'block');
            }
        });
    };
    
    $.fn.userFinder = function (options) {
        return this.each(function () {
            var element = $(this)
            var data = element.data('userFinder');
            
            if (!data) {
                element.data('userFinder', (data = new UserFinder(this, options)));
            }
            
            if (typeof options == 'string') {
                data[options].apply(element, Array.prototype.slice.call(arguments, 1));
            }
        })
    };
    
    $.fn.userFinder.constructor = UserFinder;
    
})(jQuery);