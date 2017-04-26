(function ($) {
    var DomFinder = function (element, options) {
        flog('[DomFinder]', element, options);
        
        this.element = $(element)
        this.options = $.extend({}, DomFinder.DEFAULTS, options);
        
        if (typeof this.options.filter !== 'function') {
            $.error('[DomFinder] "filter" option is not function!');
        }
        
        if (typeof this.options.showItem !== 'function') {
            $.error('[DomFinder] "showItem" option is not function!');
        }
        
        if (typeof this.options.hideItem !== 'function') {
            $.error('[DomFinder] "hideItem" option is not function!');
        }
        
        this.init();
    };
    
    DomFinder.version = '1.0.0';
    
    DomFinder.DEFAULTS = {
        container: null,
        items: null,
        filter: function (items, query) {
            query = query.toLowerCase();
            
            return items.filter(function () {
                var text = ($(this).text() || '').toLowerCase();
                
                return text.indexOf(query) !== -1;
            });
        },
        showItem: function (items) {
            items.css('display', 'block');
        },
        hideItem: function (items) {
            items.css('display', 'none');
        },
        onSearched: function (query) {
            
        }
    };
    
    DomFinder.prototype.init = function () {
        flog('[DomFinder] Initializing...');
        
        var self = this;
        var container = this.container = $(this.options.container);
        
        var timer;
        this.element.on('input', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var query = (self.element.val() || '').trim();
                var items = container.find(self.options.items);
                
                if (query === '') {
                    self.options.showItem.call(self, items, query);
                } else {
                    var matched = self.options.filter.call(self, items, query);
                    self.options.showItem.call(self, matched, query);
                    self.options.hideItem.call(self, items.not(matched), query);
                }
                
                if (typeof self.options.onSearched === 'function') {
                    self.options.onSearched.call(self, query);
                }
            }, 250);
        });
        
        flog('[DomFinder] Initialized');
    };
    
    $.fn.domFinder = function (options) {
        return this.each(function () {
            var element = $(this)
            var data = element.data('domFinder');
            
            if (!data) {
                element.data('domFinder', (data = new DomFinder(this, options)));
            }
            
            if (typeof options == 'string') {
                data[options].apply(element, Array.prototype.slice.call(arguments, 1));
            }
        })
    };
    
    $.fn.domFinder.constructor = DomFinder;
    
})(jQuery);