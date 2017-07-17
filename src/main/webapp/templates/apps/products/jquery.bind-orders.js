/**
 * 
 * Jquery plugin to bind a set of inputs to a set of orders for a given product
 * 
 */
(function($) {

    var methods = {
        init: function(options) {
            var container = this;

            var config = $.extend({
                product: "product1", // set to the appropriate product
            }, options);

            // set initial state
            initBindOrdersInitialState(container, config);
            container.find("form").forms({
                onSuccess: function() {
                    Msg.success("done!");
                }
            });
        },
        subscribe: function( ) {
        },
        unsubscribe: function( ) {
        }
    };

    $.fn.bindOrders = function(method) {
        log("bindOrders", this);
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.bindOrders');
        }
    };
})(jQuery);

function initBindOrdersInitialState(container, config) {
    try {
        container.addClass("ajax-loading");
        $.ajax({
            type: 'GET',
            url: "/products/" + config.product,
            dataType: "json",
            success: function(resp) {
                ajaxLoadingOff();
                container.removeClass("ajax-loading");
                log("resp", resp.data.myOrders);
                var forms = container.find("form");
                $.each(resp.data.myOrders, function(i, order) {
                    log("order", order);
                    var f = $(forms[i]);
                    f.find("[name=orderId]").val( order.id );
                    for(optName in order.options) {
                        var optValue = order.options[optName];
                        log("opt", optName, optValue);                        
                        f.find("[name='" + optName + "']").val( optValue );
                    }
                });
            },
            error: function(resp) {
                ajaxLoadingOff();
                container.removeClass("ajax-loading");
                alert("Error loading subscription details");
            }
        });
    } catch (e) {
        ajaxLoadingOff();
        log("exception", e);
    }
}

function onChangeSubscribeState(container, config) {
    var newSelectedVal = container.is(":selected") || container.is(":checked");
    changeSubscribeState(container, config, newSelectedVal);
}

function changeSubscribeState(container, config, newSelectedVal) {
    try {
        container.addClass("ajax-loading");
        $.ajax({
            type: 'POST',
            url: "/products/" + config.product,
            data: {
                enableOptin: newSelectedVal,
                group: config.group
            },
            dataType: "json",
            success: function(resp) {
                ajaxLoadingOff();
                container.removeClass("ajax-loading");
                if( newSelectedVal ) {
                    container.removeClass(config.optedOutClass);
                    container.addClass(config.optedInClass);
                } else {
                    container.removeClass(config.optedInClass);
                    container.addClass(config.optedOutClass);                    
                }
                config.onSuccess(newSelectedVal);
            },
            error: function(resp) {
                ajaxLoadingOff();
                container.removeClass("ajax-loading");                
                config.onError(resp);
            }
        });
    } catch (e) {
        ajaxLoadingOff();
        log("exception", e);
    }
}