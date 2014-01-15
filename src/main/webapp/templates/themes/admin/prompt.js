/** Start prompt.js */

var myPromptModal;

/**
 *  Show a styled prompt. On successful validation the callback function is called
 *  with the form as the argument. The callback should return true to close the
 *  form
 */
function myPrompt(id, url, title, instructions, caption, buttonName, buttonText, inputClass, inputPlaceholder, callback) {
    log("myPrompt");
    var existing = $("#" + id);
    if(existing ) {
        existing.remove();
    }
            
    var header = $("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='promptModalLabel'>Modal title</h4></div>");
    var inner = $("<div class='modal-body'><form method='POST'><div class='pageMessage'></div></form></div>");
    var notes = $("<p></p>");
    var table = $("<table><tbody></tbody></table>");
    var row1 = $("<tr><th><label for=''></label></th><td><input type='text' class='required'/></td></tr>");
    var row2 = $("<tr><td class='BtnBar' colspan='2'><button class='btn btn-primary'>Save</button></td></tr>");
    
    myPromptModal = $("<div class='modal fade' tabindex='-1' role='dialog' aria-labelledby='promptModalLabel' aria-hidden='true'></div>");
    myPromptModal.attr("id", id);
    //var modalContent = myPromptModal.find(".modal-content");
    var modalContent = myPromptModal;
    modalContent.append(header);
    modalContent.append(inner);
    
    notes.html(instructions);
    inner.find("form").append(notes).append(table);
    table.append(row1);
    table.append(row2);
    
    header.find("h4").text(title);
    var inputId = id + "_";
    row1.find("input").addClass(inputClass);    
    row1.find("input").attr("name", buttonName).attr("id", inputId).attr("placeholder", inputPlaceholder);    
    row1.find("label").attr("for", inputId).text(caption);
    row2.find("button").text(buttonText);
    
    var form = inner.find("form");
    form.attr("action", url);
    form.submit(function(e) {
        e.preventDefault();
        resetValidation(form);
        if( checkRequiredFields(form)) {
            var newName = form.find("input").val();
            if( callback(newName, form) ) {
                myPromptModal.modal("hide");
                //myPromptModal.remove();
            }
        }
    });

    $("body").append(myPromptModal);

    showModal(myPromptModal);
}

function closeMyPrompt() {
    flog("closeMyPrompt");        
    myPromptModal.modal("hide");
}

function showModal(modal) {
    flog("prompt.js: showModal: ", modal);
    modal.modal("show");
}

function closeModals() {
    flog("prompt.js: closeModals", $('.modal').find(":visible"));
    $('.modal').find(":visible").modal('hide');

}
