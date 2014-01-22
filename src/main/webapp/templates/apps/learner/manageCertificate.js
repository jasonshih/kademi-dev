function initManageCertificates() {
    log('initManageCertificate: ');
    initPreviewSize();
    initCertificateController();
    initModalCertificate();
}

function initManageCertificatePage(certId) {
    log('initManageCertificate: ', certId);
    themeCssFiles.push('/templates/apps/learner/certificate.dyn.css?imageHash=' + certId);
    edify($('#manageCertificate'), 
        function(resp) {
            log('done', resp);
            alert('Saved ok');
        },
        function(form) {
            var content = $('#editContent');
            log('validate', form, content, content.val());
            if( content.val().trim() == '') {
                alert('Please enter some content for the certificate');
                return false;
            }
            return true;            
        }
    );
                
    $('#uploadBtn').mupload({
        url: '',
        useJsonPut: false,
        buttonText: 'New image',
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

function initModalCertificate() {
    var modal = $('#modal-add-cert');
    
    $('.btn-add-cert').on('click', function (e) {
        e.preventDefault();
        
        modal.modal('show');
    });
    
    modal.find('form').forms({
        callback: function(resp) {
            log('done');
            window.location.href = resp.nextHref;        
            modal.modal('hide');
        }
    });
}

function initCertificateController() {
    // Bind event for DeleteCert button
    $(document.body).on('click', 'a.btn-delete-cert', function(e) {
        e.preventDefault();
        var a = $(this);
        var name = a.attr('data-name');;
        
        log('delete onclick', a, name);
        confirmDelete(a.attr('href'), name, function() {
            window.location.reload();
        });
    });
}

function showAddCert(source) {
    var modal = $(source).parent().find('.Modal');
    $.tinybox.show(modal, {
        overlayClose: false,
        opacity: 0
    }); 
    return false;
}

function showCreateMissingCerts(source) {
    var modal = $(source).parent().find('.Modal');
    $.tinybox.show(modal, {
        overlayClose: false,
        opacity: 0
    }); 
    return false;
}