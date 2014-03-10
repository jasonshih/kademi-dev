/** Start prompt.js */

var myPromptModal;

/**
 *  Show a styled prompt. On successful validation the callback function is called
 *  with the form as the argument. The callback should return true to close the
 *  form
 */
function myPrompt(id, url, title, instructions, caption, buttonName, buttonText, inputClass, inputPlaceholder, callback) {
    log('myPrompt');
    var existing = $('#' + id);
    if(existing ) {
        existing.remove();
    }
    
    var modalString = '<div id="' + id + '" class="modal modal-sm fade" tabindex="-1" role="dialog" aria-labelledby="promptModalLabel" aria-hidden="true"></div>';
    myPromptModal = $(modalString);
    
    var inputId = id + '_';
    
    myPromptModal.html(        
        '<div class="modal-header">' +
           '<button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
           '<h4 class="modal-title">' + title + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +
            '<form method="POST" class="form-horizontal" action="' + url + '">' +
                '<b>' + instructions + '</b><hr class="modal-splitter" />' +
                '<p class="alert alert-danger modal-alert"></p>' +
                '<div class="form-group">' + 
                    '<label for="' + inputId + '" class="control-label col-md-4">' + caption + '</label>' +
                    '<div class="col-md-8">' +
                        '<input type="text" class="required form-control" id="' + inputId + '" name="' + buttonName + '" placeholder="' + inputPlaceholder + '" />'+
                    '</div>' +
                '</div>' +
            '</form>' +
        '</div>' +
        '<div class="modal-footer">' +
           '<button class="btn btn-default" data-dismiss="modal" type="button">Close</button>' +
           '<button class="btn btn-primary" data-type="form-submit" type="button">' + buttonText + '</button>' +
        '</div>'
    );
    
    var form = myPromptModal.find('form');
    
    form.submit(function(e) {
        e.preventDefault();
        resetValidation(form);
        
        if( checkRequiredFields(form)) {
            var newName = form.find('input').val();
            if( callback(newName, form) ) {
                myPromptModal.modal('hide');
            }
        }
    });

    $('body').append(myPromptModal);

    showModal(myPromptModal);
}

function closeMyPrompt() {
    flog('closeMyPrompt');        
    myPromptModal.modal('hide');
}

function showModal(modal) {
    flog('prompt.js: showModal: ', modal);
    modal.modal('show');
}

function closeModals() {
    flog('prompt.js: closeModals', $(".modal").find(':visible'));
    $(".modal").find(':visible').modal("hide");

}
