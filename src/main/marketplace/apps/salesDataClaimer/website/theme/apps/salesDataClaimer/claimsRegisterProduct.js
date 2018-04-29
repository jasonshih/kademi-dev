(function ($) {
    $(function () {
        initWizard();
        initDateTimePickers();
        initImagePicker();
        
        $(".claimRegisterProductForm").forms({
            onSuccess: function (resp, form) {
                flog('Claims :: ', resp);
                if (resp === undefined || resp.status === false) {
                    Msg.info('Sorry there was an error submitting the form.');
                } else {
                    Msg.info("Thank you for your claim");
                }
            }
        });
    });

    function initDateTimePickers() {
        flog('initDateTimePickers');
    
        var purchaseDate = $('#purchase-date');
        purchaseDate.datetimepicker({
            format: 'DD/MM/YYYY',
            startDate: '01/05/2018',
            endDate: '31/08/2018'
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
                        }).end()
                        .find("button").each(function(){ 
                            $(this).replaceWith("");
                        }).end().clone().css("display", "block")
                        .find(":input").each(function() {
                            $(this).replaceWith('<span class="summary-field" data-parent-step="' + $(this).parents(".step-pane").data("step") + '">' + ($(this).find(":selected").html() === undefined ? $(this).val().replace("C:\\fakepath\\", "") : $(this).find(":selected").html()) + '</span>'); 
                        }).end().appendTo(".last-step");
                $("body").on("click", ".summary-field", function() {
                    $("li[data-step='" + $(this).data("parent-step") + "']").click();
                });
            }
        });

        myWizard.on('actionclicked.fu.wizard', function (evt, data) {
            if (data.step === 1) {
                var stepPane1 = stepPane.eq(0);
                resetValidation(stepPane1);
                if (!validateFormFields(stepPane1)) {
                    evt.preventDefault();
                }
                
                if( $('#confirm-email').val() != $('#email').val()){
                    showErrorField($('#confirm-email'));
                    showErrorMessage(stepPane2, null, 'Email address and confirm email address must be similar');
                    evt.preventDefault();
                }
            }

            if (data.step === 2) {
                var stepPane2 = stepPane.eq(1);
                resetValidation(stepPane2);
                if (!validateFormFields(stepPane2)) {
                    evt.preventDefault();
                }
                
                if($('#purchase-date').length > 0 && validateFormFields(stepPane2) ){
                    var purchaseDate = parseDate($('#purchase-date').val());
                    var month = purchaseDate.getMonth() + 1;
                    var year = purchaseDate.getFullYear();
                    if( month < 5 || month > 8 || year != 2018){
                        showErrorField($('#purchase-date'));
                        showErrorMessage(stepPane2, null, 'Your purchase must be between 1st May and 31st August to be eligible');
                        evt.preventDefault();
                    }
                }
                
                if($('#contact-email').is(":visible") && $('#contact-email').val() != $('#confirm-contact-email').val()){
                    showErrorField($('#confirm-contact-email'));
                    showErrorMessage(stepPane2, null, 'Supplier email address and confirm email address must be similar');
                    evt.preventDefault();
                }
                
                if($('#installer-email').is(":visible") && $('#installer-email').val() != $('#confirm-installer-email').val()){
                    showErrorField($('#confirm-installer-email'));
                    showErrorMessage(stepPane2, null, 'Installer email address and confirm email address must be similar');
                    evt.preventDefault();
                }
                
            }

            if (data.step === 3) {
                var stepPane3 = stepPane.eq(2);
                resetValidation(stepPane3);
                if (!validateFormFields(stepPane3)) {
                    evt.preventDefault();
                }
            }

            if (data.step === 4) {
                var stepPane4 = stepPane.eq(3);
                resetValidation(stepPane4);
                if (!validateFormFields(stepPane4)) {
                    evt.preventDefault();
                }
                
                var bsbReg = new RegExp("^[0-9]{6}$");
                if(!bsbReg.test($('#bsb-number').val())){
                    showErrorField($('#bsb-number'));
                    showErrorMessage(stepPane4, null, 'Your BSB number must be between exaclty 6 digits and cointains digits only to be eligible');
                    evt.preventDefault();
                }
                
                var accountReg = new RegExp("^[0-9]{1,10}$");
                if(!accountReg.test($('#account-no').val())){
                    showErrorField($('#account-no'));
                    showErrorMessage(stepPane4, null, 'Your account number must be less than 10 digits and cointains digits only to be eligible');
                    evt.preventDefault();
                }
            }

            if (data.step === 5) {
                $('#ClaimRegisterProductForm').trigger('submit');
                //myWizard.find('.actions .btn').prop('disabled', true);
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
        
              for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
              var val = place.address_components[i]['long_name'];
                      $(componentForm[addressType]).val(val);
            }
          }
        
              selected = true;
        });
    }


})(jQuery);