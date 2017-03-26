function initProductDetails(editorType, allGroups) {
    initProductDetailsForm();
    initProductContentsTab(editorType, allGroups);
    toggleOrderInfo();
    $('#canOrderChk').change(function (event) {
        toggleOrderInfo();
    });
    initProductImages();
    initProductVariants();
    initProductVariantImgUpload();
    initProductVariantImgSelector();
    initCategoryManagment();
    
    $(document).on('change', '#relatedAppIdSelect', function (e) {
        $('form.updateProduct').trigger('submit');
    });
    $(document).on('change', '[name=relatedItemId]', function (e) {
        $('form.updateProduct').trigger('submit');
    });
}

function initProductContentsTab(editorType, allGroups) {
    if (editorType === 'html') {
        initHtmlEditors();
    } else {
        $('.contenteditor').contentEditor({
            iframeMode: true,
            allGroups: allGroups,
            snippetsUrl: '_components'
        });
    }
    
    $('.updateProductContents').forms({
        onValid: function () {
            flog(editorType, '======================');
            if (editorType !== 'html') {
                var brief = $('#brief');
                brief.val(brief.contentEditor('getContent'));
                flog(brief.val());
                var notes = $('#notes');
                notes.val(notes.contentEditor('getContent'));
                flog(notes.val());
            }
        },
        onSuccess: function () {
            Msg.success('Successfully updated product\'s content!');
        }
    });
}

function initProductDetailsForm() {
    $('form.updateProduct').forms({
        callback: function (resp) {
            flog(resp)
            $('#relatedAppWrap').reloadFragment({
                whenComplete: function (dom) {
                }
            });
            Msg.success('Successfully updated product!');
            
            var webNameInput = $('form.updateProduct [name=webName]');
            var origWebname = webNameInput.data('orig')
            var newWebname = webNameInput.val();
            
            if (origWebname != newWebname && resp.status) {
                window.location.href = resp.nextHref;
            }
        }
    });
    
}

function initProductVariants() {
    var modal = $('#modal-product-option');
    modal.find('form').forms({
        callback: function (resp, form) {
            flog('done', resp, form);
            if (resp.status) {
                Msg.info('Saved');
                modal.modal('hide');
                reloadVariantList();
            } else {
                Msg.error('An error occured saving the option');
            }
        }
    });
    
    var variantsWrapper = $('#variants');
    
    variantsWrapper.on('click', '.btn-add-variant', function (e) {
        e.preventDefault();
        var target = $(e.target);
        var ppId = target.closest('.product-parameter').data('product-parameter-id');
        modal.find('input[name=productParameterId]').val(ppId);
        modal.find('input[name=productOptionId]').val('');
        modal.find('input[name=name]').val('');
        modal.find('input[name=title]').val('');
        modal.find('input[name=cost]').val('');
        flog('add variant for', ppId, modal.find('input[name=productParameterId]'));
        
        modal.modal('show');
    });
    
    variantsWrapper.on('click', '.add-variant-type', function (e) {
        e.preventDefault();
        var title = prompt('Please enter a name for the variant type, eg Colour or Size ');
        if (title !== null) {
            doCreateProductParameter(title);
        }
    });
    
    variantsWrapper.on('click', '.add-field', function (e) {
        e.preventDefault();
        var title = prompt('Please enter a name for the field, eg Height');
        if (title !== null) {
            doCreateProductField(title);
        }
    });
    
    variantsWrapper.on('click', '.btn-edit-variant', function (e) {
        e.preventDefault();
        var target = $(e.target);
        var tr = target.closest('tr');
        var ppId = target.closest('.product-parameter').data('product-parameter-id');
        modal.find('input[name=productParameterId]').val(ppId);
        var optId = target.closest('a').attr('href');
        modal.find('input[name=productOptionId]').val(optId);
        modal.find('input[name=name]').val(tr.find('.variant-name').text());
        modal.find('input[name=title]').val(tr.find('.variant-title').text());
        modal.find('input[name=cost]').val(tr.find('.variant-cost').text());
        modal.modal('show');
    });
    
    variantsWrapper.on('click', '.btn-option-img-del', function (e) {
        e.preventDefault();
        
        var btn = $(this);
        var optid = btn.data('optid');
        
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                productOptionId: optid,
                productOptionImgUrl: false
            },
            success: function () {
                reloadVariantList();
            }
        });
    });
    
    $(document.body).on('click', '.btn-delete-variant-type', function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var name = $(this).attr('title');
        confirmDelete(id, name, function () {
            Msg.success('Variant type deleted');
            reloadVariantList();
        });
    });
    
    $(document.body).on('click', '.btn-delete-variant', function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var name = $(this).attr('title');
        confirmDelete(id, name, function () {
            Msg.success('Variant deleted');
            reloadVariantList();
        });
    });
}

function reloadVariantList() {
    $('#variantsList').reloadFragment({
        whenComplete: function () {
            initProductVariantImgUpload();
        }
    });
}

function initProductVariantImgSelector() {
    var modal = $('#modal-option-img');
    
    $(document.body).on('click', '.btn-option-img', function (e) {
        e.preventDefault();
        
        var btn = $(this);
        var optid = btn.data('optid');
        
        modal.find('input[name=productOptionId]').val(optid);
        
        modal.modal('show');
    });
    
    $(document.body).on('click', '.select-opt-img', function (e) {
        e.preventDefault();
        
        modal.find('.btn-image-selected ').removeClass('image-selected');
        
        var img = $(this);
        img.closest('div').find('.btn-image-selected ').addClass('image-selected');
        var href = img.attr('href');
        
        var form = img.closest('form');
        form.find('input[name=productOptionImgUrl]').val(href);
    });
    
    $(document.body).on('click', '.image-change', function (e) {
        e.preventDefault();
        
        var btn = $(this);
        var optid = btn.data('optid');
        
        modal.find('input[name=productOptionId]').val(optid);
        
        modal.modal('show');
    });
    
    modal.find('form').forms({
        callback: function (resp) {
            modal.modal('hide');
            reloadVariantList();
        }
    });
    
    $(document.body).on('hidden.bs.modal', '#modal-option-img', function () {
        modal.find('input[name=productOptionId]').val(null);
        modal.find('.btn-image-selected ').removeClass('image-selected');
    });
}

function initProductVariantImgUpload() {
    $('.btn-option-img-upload').each(function (i, item) {
        var btn = $(item);
        var optid = btn.data('optid');
        
        btn.upcropImage({
            buttonContinueText: 'Save',
            url: window.location.pathname + '?productOptionId=' + optid,
            fieldName: 'variantImg',
            onCropComplete: function (resp) {
                flog('onCropComplete:', resp, resp.nextHref);
                reloadVariantList();
            },
            onContinue: function (resp) {
                flog('onContinue:', resp, resp.result.nextHref);
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        uploadedHref: resp.result.nextHref,
                        applyImage: true
                    },
                    success: function (resp) {
                        flog('success');
                        if (resp.status) {
                            Msg.info('Done');
                            reloadVariantList();
                        } else {
                            Msg.error('An error occured processing the variant image.');
                        }
                    },
                    error: function () {
                        alert('An error occured processing the variant image.');
                    }
                });
            }
        });
    });
}

function initProductImages() {
    $('#product-images').on('click', '.delete-image', function (e) {
        e.preventDefault();
        var target = $(e.target).closest('a');
        var href = target.attr('href');
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            target.closest('.product-image-thumb').remove();
        });
    });
    $('#btn-change-ava').upcropImage({
        buttonContinueText: 'Save',
        url: window.location.pathname, // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog('onCropComplete:', resp, resp.nextHref);
            $('#product-images').reloadFragment();
        },
        onContinue: function (resp) {
            flog('onContinue:', resp, resp.result.nextHref);
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    uploadedHref: resp.result.nextHref,
                    applyImage: true
                },
                success: function (resp) {
                    flog('success');
                    if (resp.status) {
                        Msg.info('Done');
                        $('#product-images').reloadFragment();
                    } else {
                        Msg.error('An error occured processing the product image');
                    }
                },
                error: function () {
                    alert('Sorry, we couldn\'t save your profile image.');
                }
            });
        }
    });
}

function toggleOrderInfo() {
    var chk = $('#canOrderChk:checked');
    if (chk.length > 0) {
        $('.ordering').show();
    } else {
        $('.ordering').hide();
    }
}

function doCreateProductParameter(newTitle) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        dataType: 'json',
        data: {
            newProductParameterTitle: newTitle
        },
        success: function (resp) {
            flog('success');
            if (resp.status) {
                Msg.info('Done');
                reloadVariantList();
            } else {
                Msg.error('An error occured creating the variant type');
            }
        },
        error: function () {
            alert('Sorry, we couldn\'t save.');
        }
    });
}

function doCreateProductField(newTitle) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        dataType: 'json',
        data: {
            newProductFieldTitle: newTitle
        },
        success: function (resp) {
            flog('success');
            if (resp.status) {
                Msg.info('Done');
                reloadVariantList();
            } else {
                Msg.error('An error occured creating the field');
            }
        },
        error: function () {
            alert('Sorry, we couldn\'t save.');
        }
    });
}

function initCategoryManagment() {
    flog('init delete category');
    $('.categories-wrapper').on('click', 'a.btn-delete-category', function (e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this category?')) {
            var a = $(this);
            var href = a.attr('href');
            var categoryName = $(e.target).closest('a').attr('href');
            doRemoveFromCategory(categoryName);
        }
    });
    
    $('.categories-wrapper').on('click', '.addCategory a', function (e) {
        flog('click', this);
        e.preventDefault();
        e.stopPropagation();
        var categoryName = $(e.target).closest('a').attr('href');
        doAddToCategory(categoryName);
    });
    
}

function doAddToCategory(categoryName) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {
            addProductCategory: categoryName
        },
        success: function (resp) {
            if (resp.status) {
                reloadCategories();
            } else {
                Msg.error('Couldnt add the product to category: ' + resp.messages);
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
        }
    })
    
}

function doRemoveFromCategory(categoryName) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: {
            removeProductCategory: categoryName
        },
        success: function (resp) {
            if (resp.status) {
                reloadCategories();
            } else {
                Msg.error('Couldnt remove the product to category: ' + resp.messages);
            }
        },
        error: function (e) {
            Msg.error(e.status + ': ' + e.statusText);
        }
    })
    
}

function reloadCategories() {
    $('#categoriesContainer').reloadFragment();
}