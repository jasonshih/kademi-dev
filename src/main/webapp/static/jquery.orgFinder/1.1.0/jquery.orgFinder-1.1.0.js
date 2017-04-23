(function ($) {
    var KEYMAP = {
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40
    };
    var OrgFinder = function (element, options) {
        flog('[OrgFinder]', element, options);
        
        this.element = $(element)
        this.options = $.extend({}, OrgFinder.DEFAULTS, options);
        this.init();
    };
    
    OrgFinder.version = '1.1.0';
    
    OrgFinder.DEFAULTS = {
        url: '/organisations/map/',
        orgTypes: '',
        maxResults: 5,
        renderSuggestions: function (data) {
            var suggestionsHtml = '';
            
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                
                suggestionsHtml += '<li class="search-suggestion" data-org-id="' + item.orgId + '" data-title="' + item.title + '">';
                suggestionsHtml += '    <a href="javascript:void(0)" tabindex="-1">' + item.title;
                suggestionsHtml += '         <small>';
                
                if (item.phone) {
                    suggestionsHtml += '         <div><i class="fa fa-phone fa-fw"></i> ' + item.phone + '</div>';
                }
                
                if (item.email) {
                    suggestionsHtml += '         <div><i class="fa fa-envelope-o fa-fw"></i> ' + item.email + '</div>';
                }
                
                var address = [];
                if (item.address) {
                    address.push(item.address);
                }
                if (item.addressLine2) {
                    address.push(item.addressLine2);
                }
                var temp = (item.addressState || '') + ' ' + (item.postcode || '')
                if (temp.trim() !== '') {
                    address.push(temp);
                }
                if (item.country) {
                    address.push(item.country);
                }
                if (address.length > 0) {
                    suggestionsHtml += '         <div><i class="fa fa-map-marker fa-fw"></i> ' + address.join(', ') + '</div>';
                }
                
                suggestionsHtml += '         </small>';
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
    
    OrgFinder.prototype.init = function () {
        flog('[OrgFinder] Initializing...');
        
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
                self.element.val(suggestion.attr('data-org-id'));
                self.input.val(suggestion.attr('data-title'));
                
                if (typeof self.options.onSelectSuggestion === 'function') {
                    self.options.onSelectSuggestion.call(self.element, suggestion);
                }
                
                self.suggestionsList.css('display', 'none');
            }
        }, '.search-suggestion');
        
        flog('[OrgFinder] Initialized');
    };
    
    OrgFinder.prototype.search = function (query) {
        flog('[OrgFinder] Search: ' + query);
        
        var self = this;
        
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: self.options.url,
            data: {
                jsonQuery: query,
                orgTypes: self.options.orgTypes,
                maxResults: self.options.maxResults
            },
            success: function (resp) {
                flog('[OrgFinder] Get response from server', resp);
                
                if (resp && resp.status && $.isArray(resp.data) && resp.data.length > 0) {
                    self.suggestionsList.html(self.options.renderSuggestions(resp.data));
                } else {
                    self.suggestionsList.html(self.options.renderNoSuggestion());
                }
                
                self.suggestionsList.css('display', 'block');
            },
            error: function (jqXhr, status, error) {
                flog('[OrgFinder] Get error response from server', jqXhr, status, error);
                self.suggestionsList.html(self.options.renderNoSuggestion());
                self.suggestionsList.css('display', 'block');
            }
        });
    };
    
    $.fn.orgFinder = function (options) {
        return this.each(function () {
            var element = $(this)
            var data = element.data('orgFinder');
            
            if (!data) {
                element.data('orgFinder', (data = new OrgFinder(this, options)));
            }
            
            if (typeof options == 'string') {
                data[options].apply(element, Array.prototype.slice.call(arguments, 1));
            }
        })
    };
    
    $.fn.orgFinder.constructor = OrgFinder;
    
})(jQuery);