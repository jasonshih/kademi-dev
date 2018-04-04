(function ($) {
   
    
    $(function () {
        initWizard();
                
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
//                $('#ClaimRegisterProductForm').trigger('submit');
//                myWizard.find('.actions .btn').prop('disabled', true);
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
                var orgId = $('#orgId');
                if (!orgId.val() && orgId.is(':enabled')) {
                    evt.preventDefault();

                    showErrorField(orgId);
                    showErrorMessage(stepPane2, null, 'Please select Dealer. If you\'re not sure, please select <b>Ask Waterco</b> option');
                }
            }

            if (data.step === 3) {
                var stepPane3 = stepPane.eq(2);
                resetValidation(stepPane3);
                if (!validateFormFields(stepPane3)) {
                    evt.preventDefault();
                }
            }
        });
    }

    
})(jQuery);