function initManagePages() {
    initPublishingMenu('');
    initCRUDPages();
    initAddPageModal();
    initCopyCutPaste();
    setRecentItem(window.location.pathname, window.location.pathname);
    initPjax();
    initDeleteFolders();
}

function initCopyCutPaste() {
    $('#pages-inner').cutcopy();
}

function initCRUDPages() {
    var container = $('#filesContainer');
    
    container.on('click', '.btn-create-folder', function (e) {
        e.stopPropagation();
        e.preventDefault();
        flog('initManageFiles: add folder');
        var parentHref = window.location.pathname;
        showCreateFolder(parentHref, 'New folder', 'Please enter a name for the new folder', function () {
            $('#page-list').reloadFragment({
                url: window.location.href
            });
        });
    });
    
    container.on('click', '.btn-edit-page', function (e) {
        e.preventDefault();
        flog('click edit page', e, this);
        
        var a = $(this);
        var name = a.attr('href');
        var article = a.closest('article');
        showEditModal(name, article);
    });
    
    container.on('click', '.btn-delete-page', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var target = $(this);
        var href = target.attr('href');
        flog('click delete. href', href);
        var name = getFileName(href);
        var article = target.closest('article');
        confirmDelete(href, name, function () {
            flog('deleted', article);
            article.remove();
            Msg.success('Deleted ' + name);
        });
    });
}

function initAddPageModal() {
    flog('initAddPageModal');
    
    var modal = $('#modal-save-page');
    var form = modal.find('form');
    var txtNewFileName = form.find(".newFileName[type=text]");
    var txtNewFileNameHidden = form.find(".newFileName[type=hidden]");
    
    $('.btn-add-page').on('click', function () {
        addMetaTag('keywords', '');
        addMetaTag('description', '');
    });
    
    $(document.body).on('hidden.bs.modal', '#modal-save-page', function () {
        modal.find('.btn-history-page').addClass('hidden');
        clearForm(form);
        $('.meta-wrapper').html('');
        $('.param-wrapper').html('');
        form.find('.defaultFolderPageTrigger').val('0');
        form.find('.fileNameTrigger').val('1');
        txtNewFileNameHidden.val('index');
        form.find('.fileNameTrigger').trigger('click');
        form.find('[name=template]').val('theme/page');
    });
    
    form.find('.defaultFolderPageTrigger').on('click', function () {
        flog('Default folder page is clicked!', txtNewFileName, txtNewFileNameHidden);
        
        txtNewFileName.prop('disabled', true).removeClass('required');
        txtNewFileNameHidden.attr('disabled', false);
    });
    
    form.find('.fileNameTrigger').on('click', function () {
        flog('File name is clicked!', txtNewFileName, txtNewFileNameHidden);
        
        txtNewFileName.prop('disabled', false).addClass('required');
        txtNewFileNameHidden.attr('disabled', true);
    });
    
    form.on("input", ".pageTitle", function (e) {
        var inp = $(e.target);
        var val = inp.val();
        var pageName = form.find('[type=hidden][name=pageName]');
        
        if (!pageName.val() && txtNewFileName.is(':enabled')) {
            // new page
            var newVal = val.toLowerCase();
            newVal = newVal.replaceAll("[", "-");
            newVal = newVal.replaceAll("]", "-");
            newVal = newVal.replaceAll(" ", "-");
            newVal = newVal.replaceAll("{", "-");
            newVal = newVal.replaceAll("}", "-");
            newVal = newVal.replaceAll("(", "-");
            newVal = newVal.replaceAll(")", "-");
            flog("on change", val, newVal);
            txtNewFileName.val(newVal);
        }
    });
    
    form.forms({
        beforePostForm: function (form, config, data) {
            var pageName = form.find('[name=pageName]').val();
            if (pageName.length === 0) {
                form.attr('action', 'autoname.new');
            } else {
                form.attr('action', pageName);
            }
            
            return data;
        },
        onSuccess: function (resp) {
            if (resp.status) {
                $('#page-list').reloadFragment({
                    url: window.location.href,
                    whenComplete: function () {
                        Msg.success('Page is saved!');
                        modal.modal('hide');
                    }
                });
            } else {
                Msg.error('There was an error saving the page: ' + resp.messages);
            }
        },
        onError: function (resp) {
            flog('error', resp);
            Msg.error('Sorry, an error occured saving your changes. If you have entered editor content that you dont want to lose, please switch the editor to source view, then copy the content. Then refresh the page and re-open the editor and paste the content back in.');
        }
    });
    
    $('.btn-add-meta').on('click', function (e) {
        e.preventDefault();
        
        addMetaTag('', '');
    });
    
    $(document.body).on('click', '.btn-remove-meta', function (e) {
        e.preventDefault();
        
        $(this).closest('.meta').remove();
    });
    
    $('.btn-add-param').on('click', function (e) {
        e.preventDefault();
        
        addParam('', '');
    });
    
    $(document.body).on('click', '.btn-remove-param', function (e) {
        e.preventDefault();
        
        $(this).closest('.param').remove();
    });
}

function showEditModal(name, pageArticle) {
    flog('showEditModal', name, pageArticle);
    
    var modal = $('#modal-save-page');
    var form = modal.find('form');
    
    var btnHistoryPage = modal.find('.btn-history-page');
    btnHistoryPage.unbind().removeClass('hidden');
    btnHistoryPage.history({
        pageUrl: name,
        showPreview: false,
        modal: $('#modal-history')
    });
    
    $.ajax({
        type: 'GET',
        url: name + '?type=json',
        dataType: 'json',
        success: function (resp) {
            flog('Loaded page data', resp);
            
            var data = resp.data;
            
            var template = data.template || '';
            
            if (!template.endsWith('.html')) {
                template += '.html';
            }
            modal.find('select option').each(function (i, n) {
                var opt = $(n);
                if (template.startsWith(opt.attr('value'))) {
                    opt.prop('selected', true);
                } else {
                    opt.prop('selected', false);
                }
            });
            
            modal.find('input[name=pageName]').val(name);
            modal.find('input[name=title]').val(data.title);
            modal.find('input[name=itemType]').val(data.itemType);
            modal.find('input[name=category]').val(data.category);
            modal.find('input[name=tags]').val(data.tags);
            
            if (name === 'index.html') {
                modal.find('.defaultFolderPageTrigger').trigger('click');
            } else {
                modal.find('.fileNameTrigger').trigger('click');
                modal.find('.newFileName[type=text]').val(name);
            }
            
            addMetaTags(data.metas);
            addParams(data);
            
            modal.modal('show');
        },
        error: function (resp) {
            flog('Could not load page data', resp);
            Msg.error('Could not load page data');
        }
    });
}

function initDeleteFolders() {
    $('body').on('click', '.btn-delete-folder', function (e) {
        e.preventDefault();
        
        var btn = $(this);
        var href = btn.attr('href');
        
        confirmDelete(href, href, function () {
            $('#subFoldersList').reloadFragment();
        });
    });
}

function initPjax() {
    var container = $('#filesContainer');
    // var files = $('#page-list');
    flog('initPjax', container);
    container.on('click', 'a.pjax', function (e) {
        e.preventDefault();
        
        var a = $(this);
        var href = a.attr('href');
        var name = a.text();
        
        flog('click pjax', a);
        
        container.reloadFragment({
            url: href,
            whenComplete: function (response, status, xhr) {
                flog('done', response, status, xhr);
                
                document.title = name;
                window.history.pushState('', href, href);
                
                setRecentItem(window.location.pathname, window.location.pathname);
                
                var dom = $(response);
                container.html(dom.find('#filesContainer > *'));
                
                initFilesLayout();
                initCopyCutPaste();
            }
        });
    });
}

// ============================================================
// Meta and data/param functions
// ============================================================
function addParams(paramsData) {
    $.each(paramsData, function (title, value) {
        if (paramsData.hasOwnProperty(title)) {
            if (title !== 'title' && title !== 'itemType' && title !== 'category' && title !== 'tags' && title !== 'metas' && title !== 'body' && title !== 'cssFiles' && title !== 'template') {
                addParam(title, value);
            }
        }
    });
}

function addMetaTags(metasData) {
    var hasKeywords = false;
    var hasDescription = false;
    $.each(metasData, function (i, meta) {
        addMetaTag(meta.name, meta.content);
        
        if (meta.name === 'keywords') {
            hasKeywords = true;
        }
        
        if (meta.name === 'description') {
            hasDescription = true;
        }
    });
    if (!hasKeywords) {
        addMetaTag('keywords', '');
    }
    if (!hasDescription) {
        addMetaTag('description', '');
    }
}

function addMetaTag(name, content) {
    var metaWrapper = $('.meta-wrapper');
    var id = Base64.encode(uuid4());
    var isSeoMeta = name === 'keywords' || name === 'description';
    
    metaWrapper.append(
        '<div class="input-group meta">' +
        '    <input type="text" class="form-control input-sm required" name="metaName.' + id + '" placeholder="Meta name" value="' + name + '" ' + (isSeoMeta ? 'readonly="readonly"' : '') + ' />' +
        '    <input type="text" class="form-control input-sm ' + (isSeoMeta ? '' : 'required') + '" name="metaContent.' + id + '" placeholder="Meta content" value="' + content + '" />' +
        '    <span class="input-group-btn">' +
        '        <button class="btn btn-sm btn-danger btn-remove-meta" type="button" ' + (isSeoMeta ? 'disabled="disabled"' : '') + '><i class="fa fa-remove"></i></button>' +
        '    </span>' +
        '</div>'
    );
}

var uuid4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, _uuid4);
};
//// OPTIMIZATION - cache callback
var _uuid4 = function(cc) {
    var rr = Math.random() * 16 | 0; return (cc === 'x' ? rr : (rr & 0x3 | 0x8)).toString(16);
};

function addParam(title, value) {
    var metaWrapper = $('.param-wrapper');
    var id = (new Date()).getTime();
    
    metaWrapper.append(
        '<div class="input-group param">' +
        '    <input type="text" class="form-control input-sm required" required="required" name="paramTitle.' + id + '" placeholder="Data/parameter title" value="' + title + '" />' +
        '    <input type="text" class="form-control input-sm required" required="required" name="paramValue.' + id + '" placeholder="Data/parameter value" value="' + value + '" />' +
        '    <span class="input-group-btn">' +
        '        <button class="btn btn-sm btn-danger btn-remove-param" type="button"><i class="fa fa-remove"></i></button>' +
        '    </span>' +
        '</div>'
    );
}
