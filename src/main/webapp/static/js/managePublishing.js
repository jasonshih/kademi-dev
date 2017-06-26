function initPublishingMenu(managePage) {
    flog('initPublishingMenu', $('.publishing .branches'));
    
    var modal = initCopyVersionModal(managePage);
    
    $('.publishing .branches').on('click', 'a.copy', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        var btn = $(this);
        var link = btn.closest('li').find('.branch');
        var srcHref = link.attr('href');
        srcHref = toFolderPath(srcHref);
        modal.find('form').attr('action', srcHref);
        modal.modal('show');
    }).on('click', 'a.hide-branch', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        var link = $(this);
        flog('hide branch:', link);
        
        var li = link.closest('li');
        var srcHref = link.attr('href');
        srcHref = toFolderPath(srcHref);
        
        hideBranch(srcHref, function () {
            li.next('.divider').hide();
            li.hide(700);
        });
    });
}

function initCopyVersionModal(managePage) {
    flog('initCopyVersionModal');
    
    var modal = $(
        '<div id="modal-copy-version" class="modal fade" tabindex="-1" data-manage-page="' + managePage + '">' +
        '    <div class="modal-dialog modal-sm">' +
        '       <div class="modal-content">' +
        '           <div class="modal-header">' +
        '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
        '               <h4 class="modal-title">Copy website version</h4>' +
        '       </div>' +
        '           <form method="POST" class="form-horizontal" action="">' +
        '               <div class="modal-body">' +
        '                   <p class="alert alert-info">Make a copy of this version of the website</p>' +
        '                   <p class="form-message alert alert-danger" style="display: none;"></p>' +
        '                   <div class="form-group">' +
        '                       <label for="copyVersion_" class="control-label col-md-3">Enter a name</label>' +
        '                       <div class="col-md-8">' +
        '                           <input type="text" class="form-control regex required" required="true" id="copyVersion_" name="copyToName" data-regex="^[a-zA-Z0-9-]+$" data-message="Version name is invalid" placeholder="Enter a simple name for the version, eg version2" />' +
        '                           <small class="help-block">Simple characters only, no punctuation, dots, etc, all lower case</small>' +
        '                       </div>' +
        '                   </div>' +
        '               </div>' +
        '               <div class="modal-footer">' +
        '                   <button class="btn btn-sm btn-default" data-dismiss="modal" type="button">Close</button>' +
        '                   <button class="btn btn-sm btn-primary" type="submit" type="submit">Copy</button>' +
        '               </div>' +
        '           </form>' +
        '       </div>' +
        '    </div>' +
        '</div>'
    );
    
    $(document.body).append(modal);
    
    modal.find('form').forms({
        onSuccess: function (resp) {
            $(".publishing .branches").append(
                '<li class="list-item" role="presentation">' +
                '    <a class="branch noclear" href="' + resp.nextHref + (managePage ? '/' + managePage : '') + '">' + modal.find('[name=copyToName]').val() + '</a>' +
                '</li>'
            );
            modal.modal('hide');
        }
    });
    
    return modal;
}


function hideBranch(href, callback) {
    flog("hideBranch", href);
    $.ajax({
        type: 'POST',
        url: href,
        data: {
            hide: true
        },
        dataType: "json",
        success: function (resp) {
            log("hid branch", resp);
            if (callback) {
                callback(resp);
            }
        },
        error: function (resp) {
            flog("error", resp);
            Msg.error("Sorry couldnt hide the version: " + resp);
        }
    });
}