/**
 *  Simple plugin to reload content for an element. Usage:
 *  
 *  $("#categories-container").reloadFragment();
 *  
 *  Note that the element must have an ID!
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($) {

    var methods = {
        init: function(options) {
            var id = this.attr("id");
            if( id === null || id === "") {
                flog("WARN: couldnt load fragment because container does not have an id");
            } else {
                flog("reload", window.location.pathname, $("#" + id));
                this.load(window.location.pathname + ' #' + id + ' > *');
            }
        },
        reload: function( ) {
            flog("reload", this);
        }
    };

    $.fn.reloadFragment = function(method) {
        flog("reloadFragment", this);
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.subscribe');
        }
    };
})(jQuery);
