(function ($) {
    $(function () {
        initWizard();
        initDateTimePickers();
        initImagePicker();
        initOrgPickers();
        initBSBNumber();
        initIndoorSerialCheck();
        
        $(".claimRegisterProductForm").forms({
            beforePostForm: function(form, config, data) {
                $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", true);
                $(".form-message").slideUp(300, function() {    $(this).remove();   });
                
                return data;
            },
            onError: function (resp, form, config) {
                $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                
                try {
                    flog('[jquery.forms] Status indicates failure', resp);
                    
                    if (resp) {
                        if (resp.messages && resp.messages.length > 0) {
                            showErrorMessage(form, config, resp.messages);
                        } else {
                            showErrorMessage(form, config, config.cantProcessRequestErrorMessage);
                        }
                        
                        showFieldMessages(resp.fieldMessages, form);
                    } else {
                        showErrorMessage(form, config, config.cantProcessRequestErrorMessage);
                    }
                } catch (e) {
                    flog('[jquery.forms] Error!', e);
                }
            },
            onSuccess: function (resp, form) {
                flog('Claims :: ', resp);
                
                $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                
                if (resp === undefined || resp.status === false) {
                    Msg.info('Sorry there was an error submitting the form.');
                } else {
                    $(".result-unique-id-no").html(resp.data.claimGroupId);
                    
                    $(".last-step .step-pane:eq(0) > .row").prepend('<div class="col-md-6 print-show" style="display: none;">' +
                        '<div class="form-group">' +
                            '<label for="title" class="col-md-12">Unique ID number:</label>' +
                            '<div class="col-md-12">' +
                                '<span class="summary-field" data-parent-step="1">' + resp.data.claimGroupId + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>');
                    
                    $("#ClaimRegisterProductForm").slideUp(300);
                    $("#thankYou").slideDown(300);
                }
            }
        });
    });

    function initDateTimePickers() {
        flog('initDateTimePickers');
    
        var purchaseDate = $('#purchase-date');
        purchaseDate.datetimepicker({
            format: 'DD/MM/YYYY'/*,
            startDate: '01/05/2018',
            endDate: '31/08/2018'*/
        });
        
        var installationDate = $('#installation-date');
        installationDate.datetimepicker({
            format: 'DD/MM/YYYY'
        });
    }
    
    function initImagePicker(){
        $('.success-invoice-image').hide();
        $('#invoice-image').change(function(){
            $('.success-invoice-image').show();    
        });
        
        $('.success-installation-image').hide();
        $('#installation-invoice-image').change(function(){
            $('.success-installation-image').show();    
        });
    }
    
    function initOrgPickers() {
        //$("#supplier-orgId, #installer-orgId").select2();
        //#supplier-orgId, 
        $("#supplier-orgId, #installer-orgId").on("change", function() {
            var email = $(this).find(":selected").data("email");
            if(email === ""){
                return;
            }
            $("#" + $(this).data("email-to")).val(email);
            $("#confirm-" + $(this).data("email-to")).val(email);
        });
    }   
    
    function initBSBNumber() {
        
        var dash = "-"; 

        function isNumber (o) {
          return ! isNaN (o-0);
        }  
        
        $(".bsb-number-12").keyup(function(e){
            txtVal = $(this).val();  
            if(isNumber(txtVal) && txtVal.length>3) {
                $(this).val(txtVal.substring(0,3) )
            }
        });
        
        //called when key is pressed in textbox
        $("#bsb-number-1, #bsb-number-2").keydown(function (e) {
             //if the letter is not digit then display error and don't type anything
             if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                //display error message
                $("#errmsg12").html("Digits Only").show().fadeOut("slow");
                return false;
            }
            else{
               $('#bsb-number-1').bind('keypress', function(e) {
                    if($(this).val().length == 2){
                      $('#bsb-number-2').focus();
                    }
                });   
            }
        });
        
        $("#bsb-number-1").keyup(function(){
            $('#bsb-number').val( $(this).val() +  dash + $('#bsb-number-2').val() );
        });        
        $("#bsb-number-2").keyup(function(){
            $('#bsb-number').val( $('#bsb-number-1').val() +  dash + $(this).val() );
        });
         
        $('#btn').click(function(){
            alert( $('#bsb-number').val() );
        });
        
        
    }
    
    function initIndoorSerialCheck(){
        
        $("#prod1-indoor-serial-number").change(function() {
            $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", true);
        	$.ajax({
                url: /salesDataClaimsProducts/,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    validate: true,
                    serialNumber: $('#prod1-indoor-serial-number').val()
                },
                success: function (resp) {
                    $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                    if (!resp.status) {
                        showErrorField($('#prod1-indoor-serial-number'));
                        showErrorMessage($(".step-pane:eq(2)"), null, 'A claim has already been submitted from this serial number "' + $("#prod1-indoor-serial-number").val() + '"!');
                        $("#prod1-indoor-serial-number").val("");  
                    } 
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                    $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                }
            });
        });
        
        $("#prod2-indoor-serial-number").change(function() {
            $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", true);
        	$.ajax({
                url: /salesDataClaimsProducts/,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    validate: true,
                    serialNumber: $('#prod2-indoor-serial-number').val()
                },
                success: function (resp) {
                    $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                    if (!resp.status) {
                        showErrorField($('#prod2-indoor-serial-number'));
                        showErrorMessage($(".step-pane:eq(2)"), null, 'A claim has already been submitted from this serial number "' + $("#prod2-indoor-serial-number").val() + '"!');
                        $("#prod2-indoor-serial-number").val("");    
                    } 
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                    $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                }
            });
        });
        
        $("#prod3-indoor-serial-number").change(function() {
            $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", true);
        	$.ajax({
                url: /salesDataClaimsProducts/,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    validate: true,
                    serialNumber: $('#prod3-indoor-serial-number').val()
                },
                success: function (resp) {
                    $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                    if (!resp.status) {
                        showErrorField($('#prod3-indoor-serial-number'));
                        showErrorMessage($(".step-pane:eq(2)"), null, 'A claim has already been submitted from this serial number "' + $("#prod3-indoor-serial-number").val() + '"!');
                        $("#prod3-indoor-serial-number").val("");        
                    } 
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                    $("#ClaimRegisterProductForm button, #ClaimRegisterProductForm :input").prop("disabled", false);
                }
            });
        });
        
       
    }
    
    
    function parseDate(input) {
      var parts = input.match(/(\d+)/g);
      // note parts[1]-1
      return new Date(parts[2], parts[1]-1, parts[0]);
    }
    
    function initWizard() {
        flog('initWizard');

        var myWizard = $('#myWizard');
        var stepPane = myWizard.find('.step-pane');
        myWizard.wizard();

        myWizard.on('changed.fu.wizard', function (evt, data) {
            if (data.step === 1) {

            }

            if (data.step === 2) {
                var stepPane2 = stepPane.eq(1);
            }

            if (data.step === 5) {
               // $(".last-step").html(""); $("#ClaimRegisterProductForm .step-pane:not(.last-step)").clone().css("display", "block").find(":input").prop("disabled", true).end().appendTo(".last-step")
                $(".last-step").html(""); 
                $("#ClaimRegisterProductForm .step-pane:not(.last-step)")
                        .find("select :selected").each(function() { 
                            $(this).attr("selected", "selected"); 
                        }).end().clone()
                        .find("button").remove().end()
						.find(".ignore").remove().end()
						.css("display", "block")
                        .find(":input").each(function() {
                            $(this).replaceWith('<span class="summary-field" data-parent-step="' + $(this).parents(".step-pane").data("step") + '">' + ($(this).find(":selected").html() === undefined ? $(this).val().replace("C:\\fakepath\\", "") : $(this).find(":selected").html()) + '</span>'); 
                        }).end().appendTo(".last-step");
                $("body").on("click", ".summary-field", function() {
                    $("li[data-step='" + $(this).data("parent-step") + "']").click();
                });
            }
        });

        myWizard.on('actionclicked.fu.wizard', function (evt, data) {
            if (data.direction === "previous") {
                $(".form-message").remove();
                    
                return;
            }
            
            var error = false;
            
            if (data.step === 1) {
                var stepPane1 = stepPane.eq(0);
                resetValidation(stepPane1);
                $(".form-message .error-message, .form-message .error-message-title").remove();

                if (!validateFormFields(stepPane.eq(0))) {
                    evt.preventDefault();
                    error = true;
                }
                
                if( $('#confirm-email').val() != $('#email').val()){
                    showErrorField($('#confirm-email'));
                    showErrorMessage(stepPane1, null, 'Email address and confirm email address must be similar');
                    evt.preventDefault();
                    error = true;
                }
                
                if (!error) {
                    $(".form-message").remove();
                }
            }

            if (data.step === 2) {
                var stepPane2 = stepPane.eq(1);
                resetValidation(stepPane2);
                $(".form-message .error-message, .form-message .error-message-title").remove();
                
                if (!validateFormFields(stepPane2)) {
                    evt.preventDefault();
                    error = true;
                }
                
                if($('#purchase-date').length > 0 && validateFormFields(stepPane2) ){
                    var purchaseDate = parseDate($('#purchase-date').val());
                    var month = purchaseDate.getMonth() + 1;
                    var year = purchaseDate.getFullYear();
                    if( month < 5 || month > 8 || year != 2018){
                        showErrorField($('#purchase-date'));
                        showErrorMessage(stepPane2, null, 'Your purchase must be between 1st May and 31st August to be eligible');
                        evt.preventDefault();
                        error = true;
                    }
                }
                
                if($('#contact-email').is(":visible") && $('#contact-email').val() != $('#confirm-contact-email').val()){
                    showErrorField($('#confirm-contact-email'));
                    showErrorMessage(stepPane2, null, 'Supplier email address and confirm email address must be similar');
                    evt.preventDefault();
                    error = true;
                }
                
                if($('#installer-email').is(":visible") && $('#installer-email').val() != $('#confirm-installer-email').val()){
                    showErrorField($('#confirm-installer-email'));
                    showErrorMessage(stepPane2, null, 'Installer email address and confirm email address must be similar');
                    evt.preventDefault();
                    error = true;
                }
                
                if (!error) {
                    $(".form-message").remove();
                }
            }

            if (data.step === 3) {
                var stepPane3 = stepPane.eq(2);
                resetValidation(stepPane3);
                $(".form-message .error-message, .form-message .error-message-title").remove();
                
                if (!validateFormFields(stepPane3)) {
                    evt.preventDefault();
                    error = true;
                }
                
                var serialReg = new RegExp("^([a-zA-Z0-9]){11}$");
                if($('#prod1-indoor-serial-number').is(":visible")){
                    
                    if(!serialReg.test($('#prod1-indoor-serial-number').val())){
                        showErrorField($('#prod1-indoor-serial-number'));
                        showErrorMessage(stepPane3, null, 'Product 1 indoor Serial must contain 11 characters including numbers and letters to be eligible');
                        evt.preventDefault();
                        error = true;
                    }
                }
                if($('#prod2-indoor-serial-number').is(":visible")){
                    if(!serialReg.test($('#prod2-indoor-serial-number').val())){
                        showErrorField($('#prod2-indoor-serial-number'));
                        showErrorMessage(stepPane3, null, 'Product 2 indoor Serial must contain 11 characters including numbers and letters to be eligible');
                        evt.preventDefault();
                        error = true;
                    }
                }
                if($('#prod3-indoor-serial-number').is(":visible")){
                    if(!serialReg.test($('#prod3-indoor-serial-number').val())){
                        showErrorField($('#prod3-indoor-serial-number'));
                        showErrorMessage(stepPane3, null, 'Product 3 indoor Serial must contain 11 characters including numbers and letters to be eligible');
                        evt.preventDefault();
                        error = true;
                    }
                }
                
                if (!error) {
                    $(".form-message").remove();
                }
            }

            if (data.step === 4) {
                var stepPane4 = stepPane.eq(3);
                resetValidation(stepPane4);
                $(".form-message .error-message, .form-message .error-message-title").remove();
                
                if (!validateFormFields(stepPane4)) {
                    evt.preventDefault();
                    error = true;
                }
                
                var bsbReg = new RegExp("^[0-9]{3}-[0-9]{3}$");
                if(!bsbReg.test($('#bsb-number').val())){
                    showErrorField($('#bsb-number'));
                    showErrorMessage(stepPane4, null, 'Your BSB number must be between exactly 6 digits and contains digits only to be eligible');
                    evt.preventDefault();
                    error = true;
                }
                
                var accountReg = new RegExp("^[0-9]{1,10}$");
                if(!accountReg.test($('#account-no').val())){
                    showErrorField($('#account-no'));
                    showErrorMessage(stepPane4, null, 'Your account number must be less than 10 digits and contains digits only to be eligible');
                    evt.preventDefault();
                    error = true;
                }
                
                if (!error) {
                    $(".form-message").remove();
                }
            }

            if (data.step === 5) {
                $('#ClaimRegisterProductForm').trigger('submit');
                
                if (!error) {
                    $(".form-message").remove();
                }
            }
        });

        $("body").on("change", ".dynamic-toggle", function() {
            $("." + $(this).data("group-class")).hide();
            $($(this).find(":selected").data("toggle")).show();
        });
        
        var options = {
        types: ['geocode'],
        componentRestrictions: {country: "au"}
        };
        
        var componentForm = {
              locality: '#suburb',
              administrative_area_level_1: '#state',
              postal_code: '#postcode'
            };
        
        var input = document.getElementById("address1");
        google.maps.event.addDomListener(input, 'keydown', function(event) { 
          if (event.keyCode === 13) { 
              event.preventDefault(); 
          }
        }); 
        
        var selected = false;
        
        $("#address1").on("keyup", function() {
              selected = false;
        });
        
        $("#address1").on("blur", function() {
              if (!selected) {
                      $("#address1").val("");
          }
        });
        
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', function (event) {
          var place = autocomplete.getPlace();
        
              if (place === undefined || place.address_components === undefined) {
                      $("#address1").val("");
                      selected = false;
                      return;	
            }
        
            $.ajax({
                url: /salesDataClaimsProducts/,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    validate: true,
                    address: $('#address1').val()
                },
                success: function (resp) {
                    if (!resp.status) {
                        showErrorField($('#address1'));
                        showErrorMessage($(".step-pane:eq(0)"), null, 'A claim has already been submitted from this address "' + $("#address1").val() + '"!');
                        $("#address1").val("");
                        selected = false;
                    } else {
                        
                        for (var i = 0; i < place.address_components.length; i++) {
                            var addressType = place.address_components[i].types[0];
                            if (componentForm[addressType]) {
                              var val = place.address_components[i]['long_name'];
                                      $(componentForm[addressType]).val(val);
                            }
                        }
                
                        selected = true;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error in checking address: ', jqXHR, textStatus, errorThrown);
                }
            });
    
        });
    }


})(jQuery);

 function showFormMessage(form, config, message, title, type, callback) {
    var alertMsg = $(".form-message");

	if (alertMsg.find(":contains(" + $(message).text() + ")").length > 0) {
		return;
    }

	if (alertMsg.length > 0) {
        alertMsg.append(message);
        alertMsg.attr('class', 'form-message alert alert-' + type);
    } else {
		alertMsg = $(config.renderMessageWrapper(message, type));
    }

	if (title && title.length > 0) {
        var messageTitle = alertMsg.find('.form-message-title');
        if (messageTitle.length === 0) {
            var btnClose = alertMsg.find('.close');
            var titleHtml = '<p class="form-message-title"><b>' + title + '</b></p>';
            if (btnClose.length === 0) {
                alertMsg.prepend(titleHtml);
            } else {
                btnClose.after(titleHtml);
            }
        } else {
            messageTitle.html('<b>' + title + '</b');
        }
    }

    $(".step-content").prepend(alertMsg);

    alertMsg.slideDown(300);
 }