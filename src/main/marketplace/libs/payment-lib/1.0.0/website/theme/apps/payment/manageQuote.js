Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

(function (w) {
    var columnId = 0;
    var currentQuoteId = 0;

    function initEditQuote() {
        initGenericSearch('vendor-search-input');
        initGenericSearch('customer-search-input');

        initDateTimePickers();

        $(".old-supplier").each(function () {
            initGenericSearch($(this).prop("id"));
        });

        $("tr:not(.template-row) .total-field").each(function () {
            $(this).html(Number($(this).html()).formatMoney(2, '.', ','));
        });

        refreshTotals();

        $("#invoice-details-form").forms({
            callback: function () {
                Msg.success("done!");
            }
        });

        $("#line-items").on("blur", "input", function () {
            var row = $(this).parents("tr");

            saveChangedRow(row);
        });

        $("#line-items").on("keyup", "input", function (event) {
            if (event.keyCode === 13) {
                var row = $(this).parents("tr");

                saveChangedRow(row);
            }
        });


        $("#line-items").on("focus", "input", function () {
            $(this).parents("tr").addClass("highlighted");
        }).on("blur", "input", function () {
            $(this).parents("tbody").find(".highlighted").removeClass("highlighted");
        });

        $(".new-line-add").on("click", function () {
            $(".template-row").clone().removeClass("template-row").insertBefore(".new-line-add").find(".supplier").prop("id", "supplier-" + columnId).end().find(".supplier-suggestions").prop("id", "supplier-" + columnId + "-suggestions").end().find("input:eq(0)").focus();

            initGenericSearch('supplier-' + columnId);

            columnId++;
        });

        $("#line-items tbody").on("blur", ".last-field", function () {
            $(".new-line-add").click();
        });

        $("#line-items tbody").on("keydown", "input", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();

                return false;
            }
        });

        $("#line-items tbody").on("keyup", ".discount-field, .price-field, .quantity-field", function () {
            var parentRow = $(this).parents("tr");

            var quantity = Number(parentRow.find(".quantity-field").val());
            var price = Number(parentRow.find(".price-field").val());
            var discount = Number(parentRow.find(".discount-field").val());

            var amount = parentRow.find(".total-field");

            if (isNaN(quantity) || isNaN(price)) {
                amount.html((0).formatMoney(2, '.', ','));
                amount.data("total", 0);

                refreshTotals();

                return;
            }

            amount.data("total", (quantity * price) - (quantity * price * (isNaN(discount) ? 0 : (discount / 100))));
            amount.html(Number(amount.data("total")).formatMoney(2, '.', ','));

            refreshTotals();
        });

        $(".new-line-add").click();
    }

    function saveChangedRow(row) {
        var data = {
            "description": row.find('[name="description"]').val(),
            "account": row.find('[name="account"]').val(),
            "supplierName": row.find('[name="supplier"]').data("selected-id") == undefined ? 0 : row.find('[name="supplier"]').data("selected-id"),
            "quantity": row.find('[name="quantity"]').val(),
            "unitPrice": row.find('[name="unitPrice"]').val(),
            "discountRate": row.find('[name="discountRate"]').val(),
            "taxRate": row.find('[name="taxRate"] :selected').val(),
        };

        if (row.data("item-id") === "NEW") {
            data["addLineItem"] = currentQuoteId;
        } else {
            data["modifyLineItem"] = currentQuoteId;
            data["lineItemId"] = row.data("item-id");
        }

        $.ajax({
            method: "POST",
            dataType: "json",
            data: data,
            success(data) {
                if (row.data("item-id") === "NEW") {
                    if (data.data !== undefined) {
                        row.data("item-id", data.data.id);
                    }
                }
            }
        });
    }

    function refreshTotals() {
        var total = 0;

        $("#line-items tbody tr:not(.template-row)").each(function () {
            var totalField = $(this).find(".total-field");

            if (totalField.length > 0) {
                total += Number(totalField.data("total"));
            }

            $(".subtotal-field").text(total.formatMoney(2, '.', ','));
            $(".global-total-field").text(total.formatMoney(2, '.', ','));
        });
    }

    function selectSuggestion(inputId) {
        var suggestionsWrapper = $('#' + inputId + '-suggestions');
        var txt = $('#' + inputId);
        var hiddenField = $('#' + txt.data('value-input-id'));
        var backdrop = $('#' + inputId + '-backdrop')

        var actived = suggestionsWrapper.find('.suggestion').filter('.active');

        if (actived.length > 0) {
            txt.val(actived.data('name')).data('selected-id', actived.data('user-id'));
            hiddenField.val(actived.data('user-id'));

            suggestionsWrapper.addClass('hide');
            backdrop.addClass('hide');
        }
    }

    function initGenericSearch(inputId) {
        flog('initGenericSearch');

        var txt = $('#' + inputId);

        if (txt.length > 0) {
            var suggestionsWrapper = $('#' + inputId + '-suggestions');

            var backdrop = $('<div />', {
                id: '' + inputId + '-backdrop',
                class: 'hide search-backdrop'
            }).on('click', function () {
                backdrop.addClass('hide');
                suggestionsWrapper.addClass('hide');
            }).appendTo(document.body);

            txt.on({
                input: function () {
                    typewatch(function () {
                        var text = txt.val().trim();

                        if (text.length > 0) {
                            doTopNavSearch(text, suggestionsWrapper, backdrop, inputId);
                        } else {
                            suggestionsWrapper.addClass('hide');
                            backdrop.addClass('hide');
                        }
                    }, 500);
                },
                keydown: function (e) {
                    switch (e.keyCode) {
                        case keymap.ESC:
                            flog('Pressed ESC button');

                            suggestionsWrapper.addClass('hide');
                            backdrop.addClass('hide');

                            e.preventDefault();
                            break;

                        case keymap.UP:
                            flog('Pressed UP button');

                            var suggestions = suggestionsWrapper.find('.suggestion');
                            if (suggestions.length > 0) {
                                var actived = suggestions.filter('.active');
                                var prev = actived.prev();

                                actived.removeClass('active');
                                if (prev.length > 0) {
                                    prev.addClass('active');
                                } else {
                                    suggestions.last().addClass('active');
                                }
                            }

                            e.preventDefault();
                            break;

                        case keymap.DOWN:
                            flog('Pressed DOWN button');

                            var suggestions = suggestionsWrapper.find('.suggestion');
                            if (suggestions.length > 0) {
                                var actived = suggestions.filter('.active');
                                var next = actived.next();

                                actived.removeClass('active');
                                if (next.length > 0) {
                                    next.addClass('active');
                                } else {
                                    suggestions.first().addClass('active');
                                }
                            }

                            e.preventDefault();
                            break;

                        case keymap.ENTER:
                            flog('Pressed DOWN button');

                            selectSuggestion(inputId);

                            e.preventDefault();
                            break;

                        default:
                        // Nothing
                    }
                }
            });

            suggestionsWrapper.on({
                mouseenter: function () {
                    suggestionsWrapper.find('.suggestion').removeClass('active');
                    $(this).addClass('active');
                },
                mouseleave: function () {
                    $(this).removeClass('active');
                }
            }, '.suggestion');
        }
    }

    function doTopNavSearch(query, suggestionsWrapper, backdrop, inputId) {
        flog('doTopNavSearch', query, suggestionsWrapper, backdrop);

        $.ajax({
            url: '/leads',
            type: 'GET',
            data: {
                q: query,
                status: 'Active'
            },
            dataType: 'JSON',
            success: function (resp) {
                flog('Got search response from server', resp);

                var suggestionStr = '';

                if (resp && resp.hits && resp.hits.total > 0) {
                    for (var i = 0; i < resp.hits.hits.length; i++) {
                        var suggestion = resp.hits.hits[i];
                        if (suggestion.fields.leadId) {
                            var userId = suggestion.fields['profile.id'];
                            var email;
                            if (suggestion.fields['profile.email']) {
                                email = suggestion.fields['profile.email'][0];
                            } else {
                                email = "";
                            }
                            var userName = email;
                            var firstName = suggestion.fields['profile.firstName'] ? suggestion.fields['profile.firstName'][0] : '';
                            var surName = suggestion.fields['profile.surName'] ? suggestion.fields['profile.surName'][0] : '';

                            suggestionStr += '<li class="suggestion" data-user-id="' + userId + '" data-name="' + firstName + ' ' + surName + '">';

                            suggestionStr += '    <a href="#" onclick="selectSuggestion(\'' + inputId + '\')">';
                            suggestionStr += '        <span><span class="email">' + email + '</span>';
                            if (firstName || surName) {
                                suggestionStr += '    <br /><small class="text-muted">' + firstName + ' ' + surName + '</small>';
                            }
                            suggestionStr += '    </a>';
                        } else if (suggestion.fields.entityId) {
                            var id = suggestion.fields.entityId[0];
                            var orgId = suggestion.fields.orgId[0];
                            var orgTitle = suggestion.fields.title[0];

                            suggestionStr += '<li class="suggestion" data-user-id="' + id + '" data-name="' + orgTitle + '">';

                            suggestionStr += '    <a href="#" onclick="selectSuggestion(\'' + inputId + '\')">';
                            suggestionStr += '        <span>' + orgTitle + '</span>';
                            suggestionStr += '    <br /><small class="text-muted">OrgID: ' + orgId + '</small>';
                            suggestionStr += '    </a>';

                        }
                        suggestionStr += '</li>';
                    }
                } else {
                    suggestionStr = '<li class="search-no-result">No result.</li>';
                }

                suggestionsWrapper.html(suggestionStr).removeClass('hide');
                backdrop.removeClass('hide');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('Error when doTopNavSearch with query: ' + query, jqXHR, textStatus, errorThrown);
            }
        });
    }

    function initDateTimePickers() {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        $('body').css('position', 'relative');
        var opts = {
            widgetParent: 'body',
            format: "DD/MM/YYYY HH:mm"
        };

        $('.date-pickers').datetimepicker(opts);

        $('.date-pickers').on('dp.show', function () {
            var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last');
            if (datepicker.hasClass('bottom')) {
                var top = $(this).offset().top - $(this).outerHeight();
                var left = $(this).offset().left;
                datepicker.css({
                    'top': top + 'px',
                    'bottom': 'auto',
                    'left': left + 'px',
                    'z-index': 9999
                });
            } else if (datepicker.hasClass('top')) {
                var top = $(this).offset().top - datepicker.outerHeight() - 40;
                var left = $(this).offset().left;
                datepicker.css({
                    'top': top + 'px',
                    'bottom': 'auto',
                    'left': left + 'px',
                    'z-index': 9999
                });
            }
        });
    }

    w.removeRow = function (event, caller) {
        if ($(caller).parents("tr").data("item-id") !== 'NEW') {
            if (confirm("Are you sure you want to delete this item?")) {

                $.ajax({
                    method: "POST",
                    dataType: "json",
                    data: {
                        "removeLineItem": currentQuoteId,
                        "lineItemId": $(caller).parents("tr").data("item-id")
                    },
                    success(data) {
                        $(caller).parents("tr").remove();

                        if ($("#line-items tbody tr").size() === 2) {
                            $(".new-line-add").click();
                        }

                        refreshTotals();
                    }
                });

            }
        } else {
            $(caller).parents("tr").remove();

            if ($("#line-items tbody tr").size() === 2) {
                $(".new-line-add").click();
            }

            refreshTotals();
        }
    };


    function initModalForm() {
        var modal = $("#cloneQuoteModal");
        var form = modal.find(" form");

        form.forms({
            callback: function (resp) {
                if (resp.nextHref) {
                    window.location.href = "/quotes/" + resp.nextHref;
                }

                flog("done", resp);
                modal.modal('hide');
                Msg.success('Quote is cloned!');
                reloadQuoteTable();
            }
        });

        $("#clone-quote-button").on("click", function () {
            $("#clone-quote-form").submit();
        });
        
        var modal = $('#uploadFileModal');
        var form = modal.find('form');

        $('body').on('click', '.upload-files', function (e) {
            e.preventDefault();

            modal.modal('show');
        });

        form.forms({
            callback: function (resp) {
                Msg.info('Files Uploaded');
                reloadFileList();
                modal.modal('hide');
            }
        });
    }
    ;

    w.initializeQuoteComponent = function (quoteId) {
        currentQuoteId = quoteId;
        initEditQuote();
        initModalForm();
    };

})(this);