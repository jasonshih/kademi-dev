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

    function initEditQuote(editable) {
        if (editable) {
            initEditableQuote();
        } else {
            $("#manageQuote :input").prop("disabled", true);
            $(".remove-uneditable").remove();
            refreshTotals();
        }
    }
    
    function initEditableQuote() {
        initEntityFinder($('#vendor-search-input, #customer-search-input'));
        initDateTimePickers();
        initQuoteItems();
        initInvoiceDetailsForm();
        refreshTotals();
    }
    
    function initEntityFinder(target) {
        target.entityFinder({
            url: '/custs',
            useActualId: true
        });
    };
    
    function initQuoteItems() {
        var itemsWrapper = $('#line-items');
        
        $('.old-supplier').each(function () {
            initEntityFinder($(this));
        });
        
        itemsWrapper.find('tr .total-field').each(function () {
            $(this).html(Number($(this).html()).formatMoney(2, '.', ','));
        });
        
        itemsWrapper.on({
            blur: function () {
                var input = $(this);
                var tr = input.closest('tr');
                var tbody = tr.parent('tbody');
                
                setTimeout(function () {
                    tbody.find('.highlighted').removeClass('highlighted');
                    saveChangedRow(tr);
                }, 200);
            },
            keyup: function (e) {
                if (!$(this).hasClass('search-input') && e.keyCode === 13) {
                    saveChangedRow($(this).parents('tr'));
                }
            },
            keydown: function (e) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    
                    return false;
                }
            },
            focus: function () {
                $(this).parents('tr').addClass('highlighted');
            }
        }, 'input');
        
        var btnAddLine = $('.new-line-add');
        var trAddLine = btnAddLine.closest('tr');
        btnAddLine.on('click', function (e) {
            e.preventDefault();
            
            var templateHtml = $('#template-row').html();
            var template = $(templateHtml);
            template.find('input:eq(0)').focus();
            template.insertBefore(trAddLine);
            
            initEntityFinder(template.find('.supplier'));
            
            columnId++;
        }).trigger('click');
        
        itemsWrapper.on('blur', '.last-field', function () {
            btnAddLine.trigger('click');
        }).on('keyup', '.discount-field, .price-field, .quantity-field', function () {
            var parentRow = $(this).parents('tr');
            
            var quantity = Number(parentRow.find('.quantity-field').val());
            var price = Number(parentRow.find('.price-field').val());
            var discount = Number(parentRow.find('.discount-field').val());
            
            var amount = parentRow.find('.total-field');
            
            if (isNaN(quantity) || isNaN(price)) {
                amount.html((0).formatMoney(2, '.', ','));
                amount.data('total', 0);
                
                refreshTotals();
                
                return;
            }
            
            amount.data('total', (quantity * price) - (quantity * price * (isNaN(discount) ? 0 : (discount / 100))));
            amount.html(Number(amount.data('total')).formatMoney(2, '.', ','));
            
            refreshTotals();
        });
        
        itemsWrapper.on('click', '.btn-remove-quote', function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var tr = btn.closest('tr');
            
            if (tr.data('item-id') !== 'NEW') {
                if (confirm('Are you sure you want to delete this item?')) {
                    
                    $.ajax({
                        method: 'POST',
                        dataType: 'json',
                        data: {
                            'removeLineItem': currentQuoteId,
                            'lineItemId': tr.data('item-id')
                        },
                        success: function (data) {
                            tr.remove();
                            
                            if (itemsWrapper.find('tbody tr').length === 1) {
                                btnAddLine.trigger('click');
                            }
                            
                            refreshTotals();
                        }
                    });
                    
                }
            } else {
                tr.remove();
                
                if (itemsWrapper.find('tbody tr').length === 1) {
                    btnAddLine.trigger('click');
                }
                
                refreshTotals();
            }
        });
    }
    
    function initInvoiceDetailsForm() {
        $('#invoice-details-form').forms({
            callback: function () {
                Msg.success('done!');
            }
        });
    }
    
    function saveChangedRow(row) {
        var data = {
            'description': row.find('[name=description]').val(),
            'account': row.find('[name=account]').val(),
            'supplierName': row.find('[name=supplier]').val() || 0,
            'quantity': row.find('[name=quantity]').val(),
            'unitPrice': row.find('[name=unitPrice]').val(),
            'discountRate': row.find('[name=discountRate]').val(),
            'taxRate': row.find('[name=taxRate] :selected').val(),
        };
        
        if (row.data('item-id') === 'NEW') {
            data['addLineItem'] = currentQuoteId;
        } else {
            data['modifyLineItem'] = currentQuoteId;
            data['lineItemId'] = row.data('item-id');
        }
        
        $.ajax({
            method: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (row.data('item-id') === 'NEW') {
                    if (data.data !== undefined) {
                        row.data('item-id', data.data.id);
                    }
                }
            }
        });
    }
    
    function refreshTotals() {
        var total = 0;
        
        $('#line-items tbody tr').each(function () {
            var totalField = $(this).find('.total-field');
            
            if (totalField.length > 0) {
                total += Number(totalField.data('total'));
            }
            
            $('.subtotal-field').text(total.formatMoney(2, '.', ','));
            $('.global-total-field').text(total.formatMoney(2, '.', ','));
        });
    }
    
    function initDateTimePickers() {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        $('body').css('position', 'relative');
        var opts = {
            widgetParent: 'body',
            format: 'DD/MM/YYYY HH:mm'
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

    w.initializeQuoteComponent = function (quoteId, quoteLevel) {
        currentQuoteId = quoteId; 
        initEditQuote(quoteLevel === "New" || quoteLevel === "Assigned");
        initModalForm();
    };

})(this);