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
        type: '',
        assetType: ''
    };
    
    AssetFinder.prototype.init = function () {
        flog('[AssetFinder] Initializing...');
        
        var self = this;
        var options = self.options;
        var element = self.element;
        
        var holder = self.holder = $('<input type="text" class="form-control " value="' + (element.attr('data-asset-name') || '') + '" placeholder="' + (element.attr('placeholder') || '') + '" />');
        element.css('display', 'none').after(holder);
        
        var type = options.type || '';
        if (!type) {
            flog('[AssetFinder] Type is empty. Check classes for type', element.attr('class'));
            
            if (element.hasClass('select-asset-image')) {
                type = 'image';
            }
            
            if (element.hasClass('select-asset-video')) {
                type = 'video';
            }
            
            if (element.hasClass('select-asset-content')) {
                type = 'content';
            }
        } else {
            flog('[AssetFinder] Type is ' + type);
        }
        
        var assetType = options.assetType || '';
        if (!assetType) {
            flog('[AssetFinder] Asset type is empty. Check data attribute "data-asset-type" for asset type', element.attr('data-asset-type'));
            
            assetType = element.attr('data-asset-type') || '';
        } else {
            flog('[AssetFinder] Asset type is ' + assetType);
        }
        
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
                        type: type,
                        assetType: assetType
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
    
    // Init asset finder for every class `select-asset`
    $(function () {
        $('.select-asset').each(function () {
            var input = $(this);
            input.assetFinder();
        });
    });
    
})(jQuery);