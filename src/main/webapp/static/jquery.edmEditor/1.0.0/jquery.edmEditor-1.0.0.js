(function ($) {
    $.fn.edmEditor = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.edmEditor] Method ' + method + ' does not exist on jquery.edmEditor');
        }
    };
    
    $.fn.edmEditor.DEFAULTS = {
        snippetsUrl: '',
        iframeMode: false,
        contentStyles: [{
            
        }]
    };
    
    var dependScripts = [
        '/static/jquery-ui/1.12.1-noui/jquery-ui.min.js',
        '/theme/toolbars.js',
        '/static/ckeditor456/ckeditor.js',
        '/static/ckeditor456/adapters/jquery.js',
        '/static/keditor/dist/js/keditor-0.0.0.min.js',
        '/static/keditor/dist/js/keditor-edm-components-0.0.0.js',
        '/static/jquery.mselect/1.1.0/jquery.mselect-1.1.0.js'
    ];
    
    var dependStyles = [
        '/static/keditor/dist/css/keditor-0.0.0.min.css',
        '/static/keditor/dist/css/keditor-bootstrap-form-0.0.0.min.css',
        '/static/keditor/dist/css/keditor-edm-components-0.0.0.min.css',
        '/static/font-awesome/4.7.0/css/font-awesome.min.css',
        '/static/jquery.edmEditor/1.0.0/jquery.edmEditor-1.0.0.css'
    ];
    
    var isDependenciesChecked = false;
    
    var methods = {
        checkDependencies: function (options, callback) {
            if (isDependenciesChecked) {
                callback();
            }
            
            if (options.iframeMode) {
                $.getStyleOnce(dependStyles[0]);
                if (!$.isArray(options.contentStyles)) {
                    options.contentStyles = [];
                }
                
                $.each(dependStyles, function (i, style) {
                    options.contentStyles.push({
                        href: style
                    });
                });
            } else {
                $.each(dependStyles, function (i, style) {
                    $.getStyleOnce(style);
                });
            }
            
            function loadScript(index) {
                $.getScriptOnce(dependScripts[index], function () {
                    if (index === dependScripts.length - 1) {
                        isDependenciesChecked = true;
                        callback();
                    } else {
                        loadScript(index + 1);
                    }
                });
            }
            
            loadScript(0);
        },
        init: function (options) {
            options = $.extend({}, $.fn.edmEditor.DEFAULTS, options);
            
            return $(this).each(function () {
                var target = $(this);
                
                methods.checkDependencies(options, function () {
                    target.keditor({
                        niceScrollEnabled: false,
                        tabContainersText: '<i class="fa fa-columns"></i>',
                        tabComponentsText: '<i class="fa fa-files-o"></i>',
                        snippetsUrl: options.snippetsUrl,
                        tabTooltipEnabled: false,
                        snippetsTooltipEnabled: false,
                        allGroups: options.allGroups,
                        iframeMode: options.iframeMode,
                        contentStyles: options.contentStyles
                    });
                });
            });
        },
        
        getContent: function () {
            return $(this).keditor('getContent', false);
        }
    };
    
})(jQuery);