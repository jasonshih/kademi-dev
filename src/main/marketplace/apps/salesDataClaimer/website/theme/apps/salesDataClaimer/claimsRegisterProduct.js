(function ($) {
    $(function () {
        initWizard();

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
                $(".last-step").html(""); $("#ClaimRegisterProductForm .step-pane:not(.last-step)")
                        .find("select :selected").each(function() { $(this).attr("selected", "selected"); })
                        .end().find("button").each(function(){ $(this).replaceWith("")})
                        .end().clone().css("display", "block").find(":input")
                        .each(function() { $(this).replaceWith('<span class="summary-field" data-parent-step="' + $(this).parents(".step-pane").data("step") + '">' + ($(this).find(":selected").html() === undefined ? $(this).val() : $(this).find(":selected").html()) + '</span>'); }).end().appendTo(".last-step")
                $("body").on("click", ".summary-field", function() {
                    $("li[data-step='" + $(this).data("parent-step") + "']").click();
                });

            }
        });

        myWizard.on('actionclicked.fu.wizard', function (evt, data) {
            flog("here");
            if (data.step === 1) {
                var stepPane1 = stepPane.eq(0);
                resetValidation(stepPane1);
                if (!validateFormFields(stepPane1)) {
                    evt.preventDefault();
                }
            }

            if (data.step === 2) {
                var stepPane2 = stepPane.eq(1);
                resetValidation(stepPane2);
                if (!validateFormFields(stepPane2)) {
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