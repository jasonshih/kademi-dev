(function ($) {
    var AssetFinder = function (element, options) {
        flog('[AssetFinder]', element, options);
        
        var self = this;
        
        $.getStyleOnce('/static/typeahead/0.11.1/typeahead.css');
        $.getScriptOnce('/static/typeahead/0.11.1/typeahead.jquery.js', function () {
            self.element = $(element)
            self.options = $.extend({}, AssetFinder.DEFAULTS, options);
            self.init();
        });
    };
    
    AssetFinder.version = '1.0.0';
    
    AssetFinder.DEFAULTS = {
        url: '/assets/',
        maxResults: 5,
        type: ''
    };
    
    AssetFinder.prototype.init = function () {
        flog('[AssetFinder] Initializing...');
        
        var self = this;
        var options = self.options;
        var element = self.element;
        
        var holder = self.holder = $('<input type="text" class="form-control " value="" />');
        element.css('display', 'none').after(holder);
        
        holder.typeahead({
            highlight: true,
            minLength: 1,
            hint: true
        }, {
            display: 'name',
            name: 'data',
            limit: options.maxResults,
            source: function (query, sync, async) {
                $.ajax({
                    url: options.url,
                    type: 'get',
                    dataType: 'json',
                    data: {
                        q: holder.val(),
                        type: options.type
                    },
                    success: function (resp) {
                        if (resp && resp.status) {
                            async(resp.data);
                        } else {
                            async(null);
                        }
                    },
                    error: function () {
                        async(null);
                    }
                });
            },
            templates: {
                empty: '<div class="empty-message">No asset match your search</div>',
                suggestion: function (data) {
                    return '<div>' + data.name + '</div>'
                }
            }
        });
        
        holder.on('typeahead:selected', function (e, datum) {
            flog('Selected assets suggestion', datum);
            
            element.val(datum.uniqueId);
        });
        
        flog('[AssetFinder] Initialized');
    };
    
    $.fn.assetFinder = function (options) {
        return this.each(function () {
            var element = $(this)
            var data = element.data('assetFinder');
            
            if (!data) {
                element.data('assetFinder', (data = new AssetFinder(this, options)));
            }
            
            if (typeof options == 'string') {
                data[options].apply(element, Array.prototype.slice.call(arguments, 1));
            }
        })
    };
    
    $.fn.assetFinder.constructor = AssetFinder;
    
})(jQuery);