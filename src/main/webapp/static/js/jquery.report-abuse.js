/**
 *
 *  jquery.comments.js
 *
 * Config:
 * pageUrl - url of the resource to add comments to. Must end with a slash
 * a submit handler
 * renderCommentFn - a callback function to render the markup for a comment. Takes the following arguments user, comment, commentDate, where user
 * is an object containing name, href, photoHref
 * clearContainerFn - callback function to clear the comments container. Takes no arguments
 * ajaxLoadingFn - callback function to show ajax loading. Takes one argument isLoading (true/false)
 * currentUser - user object containing name, href, photoHref
 * 
 */

(function( $ ) {
    $.fn.reportAbuse = function(options) {
        var container = this;
        var config = $.extend( {
            'pageUrl' : window.location,
            'ajaxLoadingFn' : function(isLoading) {
                if( isLoading ) {
                    ajaxLoadingOn();
                } else {
                    ajaxLoadingOff();
                }
            },
            'aggregated': false  // if true will list all comments under the given page 
        }, options);  
  
        log("init reportAbuse", container.find(".post-report"), container );
        container.on("click", ".post-report", function(e) {
            e.preventDefault();
            var target = $(e.target);
            showReportModal(container, target, config);
        });
        
    };
})( jQuery );

function showReportModal(container, target, config) {
    var reportDiv = container.find("div.post-report-modal");
    var form;
    if (reportDiv.length === 0) {
        reportDiv = $("<div style='display: none' class='post-report-modal'><form method='POST'><button type='submit' >Report post</button><button class='close' type='button' >Cancel</button></form></div>");
        container.append(reportDiv);
        form = reportDiv.find("form");
        form.prepend("<textarea name='comments'></textarea>");
        form.prepend( createOption("COMPROMISED", "Compromised", "reportCategory") );
        form.prepend( createOption("SPAM", "Spam", "reportCategory") );
        form.prepend( createOption("ABUSIVE", "Abusive", "reportCategory") );        
        form.prepend( $("<div class='pageMessage'>") );
        form.find("input[value=ABUSIVE]").attr("checked", "true");
        form.forms({
            onSuccess: function() {
                reportDiv.hide();
                alert("Thank you for your report.");
                form.find(".alert").remove();
            }
        });
        form.find(".close").click(function() {
            reportDiv.hide(400);
        });
        log("created", reportDiv);
    } else {
        form = reportDiv.find("form");
        form.find("textarea").val("");
        form.find("input[value=ABUSIVE]").attr("checked", "true");
        log("reuse", reportDiv);
        reportDiv.offset( reportDivOffset );
    }
    var targetOffset = target.offset();
    var reportDivOffset = {
        top: targetOffset.top + 15,
        left: targetOffset.left - reportDiv.width()
    };
    reportDiv.show();
    reportDiv.offset( reportDivOffset );
    var href = target.attr("href");
    form.attr("action", href);    
}

function createOption(value, text, name) {
    var id = name + "_" + value;
    var div = $("<div>");
    var radio = $("<input type='radio' >");
    radio.attr("value", value);
    radio.attr("name", name);
    radio.attr("id", id);
    div.append(radio);
    
    var label = $("<label>");
    label.attr("for", id);
    label.text(text);
    div.append(label);
    return div;
}

