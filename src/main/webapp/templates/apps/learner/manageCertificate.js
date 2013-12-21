function initManageCertificate() {
    log("initManageCertificate: ");
    initPreviewSize();
    initCertificateController();
    $("form.addCert").forms({
        callback: function(resp) {
            log("done");
            window.location.href = resp.nextHref;
        }
    });
}

function initManageCertificatePage(certId) {
    log("initManageCertificate: ", certId);
    themeCssFiles.push("/templates/apps/learner/certificate.dyn.css?imageHash=" + certId);
    edify($("#manageCertificate"), 
        function(resp) {
            log("done", resp);
            alert("Saved ok");
        },
        function(form) {
            var content = $("#editContent");
            log("validate", form, content, content.val());
            if( content.val().trim() == "") {
                alert("Please enter some content for the certificate");
                return false;
            }
            return true;            
        }
    );
                
    $("#uploadBtn").mupload({
        url: "",
        useJsonPut: false,
        buttonText: "New image",
        oncomplete: function(data, name, href) {
            window.location.reload();
        }
    }); 
    
}

function initPreviewSize() {
    var adjustSize = function() {
        var $contentPreview = $('.ContentPreview'),
        width = $contentPreview.width();
			
        $contentPreview.css('height', width	* 841 / 595);
    }
	
    adjustSize();
	
    $(window).resize(function() {
        adjustSize();
    });
    	
}

function initCertificateController() {
    // Bind event for DeleteCert button
    $('body').on('click', 'a.DeleteCert', function(e) {
        e.preventDefault();
        var $n = $(this);
        var name = $n.parent().parent().find("span.title").text();
        log("delete onclick", $n, name);
        confirmDelete($n.attr("href"), name, function() {
            $n.parent().parent().remove();
        });
    });
}

function showAddCert(source) {
    var modal = $(source).parent().find(".Modal");
    $.tinybox.show(modal, {
        overlayClose: false,
        opacity: 0
    }); 
    return false;
}

function showCreateMissingCerts(source) {
    var modal = $(source).parent().find(".Modal");
    $.tinybox.show(modal, {
        overlayClose: false,
        opacity: 0
    }); 
    return false;
}