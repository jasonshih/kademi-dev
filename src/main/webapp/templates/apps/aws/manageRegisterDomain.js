(function ($) {
    var _tlds = {};
    var contactTypes = ['Registrant', 'Admin', 'Tech'];
    var rowTemplate = Handlebars.compile('<tr>'
            + '    <td>{{domainName}}</td>'
            + '    <td>'
            + '        <i class="fa fa-2x {{\#if available}}fa-check text-success{{else}}fa-times text-danger{{/if}}" data-toggle="tooltip" data-placement="top" title="{{hint}}"></i> {{status}}</td>'
            + '    <td>{{\#if available}}US${{registerPrice}}{{/if}}</td>'
            + '    <td>'
            + '        {{\#if available}}'
            + '        <button type="button" class="btn btn-info btn-aws-buydomain" data-tld="{{tld}}" data-domain="{{domainName}}">Buy Domain</button>'
            + '        {{/if}}'
            + '    </td>'
            + '</tr>');
    var extraFieldTemplate = Handlebars.compile($('#awsRegisterExtraFieldTemplate').html());
    var reviewTemplate = Handlebars.compile($('#awsRegisterReviewDetailsTemplate').html());

    var _selectedDomain = null;
    var _selectedTld = null;

    // Init Wizard
    function initWizard() {
        var wizardDiv = $('#awsRegisterDomainWizard');
        var awsContactDetailsForm = $('#awsContactDetails');

        wizardDiv.wizard();

        wizardDiv.on('changed.fu.wizard', function (evt, data) {
            if (data.step === 1) {
                // IE 11 fix
                var ul = wizardDiv.find('ul.steps');
                if (ul.css('margin-left') !== '0') {
                    ul.css('margin-left', '0');
                }
            }
        });

        wizardDiv.on('actionclicked.fu.wizard', function (e, data) {
            if (data.step === 1) {
                if (_selectedTld == null || _selectedDomain == null) {
                    e.preventDefault();
                    Kalert.warning('Please select a domain first', 'A domain is required to move to the next step');
                } else if (data.direction === 'next') {
                    var tld = _tlds[_selectedTld];

                    // Clear any existing extra fields
                    for (var i = 0; i < contactTypes.length; i++) {
                        $('#aws' + contactTypes[i] + '_extraParams').empty();
                    }

                    // Check for extra params
                    if (tld.extraParams.length > 0) {
                        for (var i = 0; i < tld.extraParams.length; i++) {
                            var ep = tld.extraParams[i];

                            for (var b = 0; b < contactTypes.length; b++) {
                                ep.CONTACT_TYPE = contactTypes[b];
                                $('#aws' + contactTypes[b] + '_extraParams').append(extraFieldTemplate(ep));
                            }
                        }
                    }

                    updateRequiredFields();
                    updatePrivacyProtection();
                    resetValidation(awsContactDetailsForm);
                }
            } else if (data.step === 2) {
                if (data.direction === 'previous') {
                    _selectedTld = null;
                    _selectedDomain = null;
                    $('#awsContactDetails .required').removeClass('required');
                } else if (data.direction === 'next') {
                    // Check fields first
                    resetValidation(awsContactDetailsForm);

                    if (validateFormFields(awsContactDetailsForm)) {
                        // Populate review tab
                        var allTheSame = $('.awsContactDetailsSame:checked').val() === 'true';
                        var formData = $('#awsContactDetails').serializeArray();

                        if (allTheSame) {
                            var details = {};

                            for (var i = 0; i < formData.length; i++) {
                                var field = formData[i];

                                if (field.name.startsWith('Registrant')) {
                                    details[field.name.replace('Registrant_', '')] = field.value;
                                }
                            }

                            var template = reviewTemplate(details);

                            for (var i = 0; i < contactTypes.length; i++) {
                                $('#aws' + contactTypes[i] + 'ReviewDetails').empty().append(template);
                            }
                        } else {
                            // reviewTemplate

                            for (var i = 0; i < contactTypes.length; i++) {
                                var ct = contactTypes[i];
                                var details = {};

                                for (var b = 0; b < formData.length; b++) {
                                    var field = formData[b];

                                    if (field.name.startsWith(ct)) {
                                        details[field.name.replace(ct + '_', '')] = field.value;
                                    }
                                }
                                
                                var template = reviewTemplate(details);

                                $('#aws' + ct + 'ReviewDetails').empty().append(template);
                            }
                        }

                        $('#awsReviewSelectedDomain').text(_selectedDomain);
                    } else {
                        e.preventDefault();
                    }
                }
            } else if (data.step === 3) {
                if (data.direction === 'next') {
                    var acceptedTcs = $('#acceptTCS').is(':checked');
                    if (acceptedTcs) {
                        var detailsFormData = awsContactDetailsForm.serializeWithFiles();
                        detailsFormData.append('acceptedTCS', acceptedTcs);
                        detailsFormData.append('selectedDomain', _selectedDomain);
                        detailsFormData.append('selectedTld', _selectedTld);
                        detailsFormData.append('purchaseDomain', true);

                        flog('Data', detailsFormData);

                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            data: detailsFormData,
                            processData: false,
                            contentType: false,
                            success: function (data) {

                            },
                            error: function (jqXHR, textStatus, errorThrown) {

                            }
                        });
                    } else {
                        e.preventDefault();
                        Kalert.warning('Please accept the Terms and Conditions', 'The Terms and Conditions must be accepted before continuing');
                    }
                }
            }
        });
    }

    // init search domain
    function initSearchDomain() {
        var domainInp = $('#awsDomain');
        var tldSelect = $('#awsTldSelect');
        var form = $('#awsSearchDomain');

        $(".chosen-select").chosen({
            search_contains: true,
            disable_search_threshold: 0,
            width: '100%'
        });

        $('body').on('click', '.btn-aws-checkdomain', function (e) {
            e.preventDefault();

            _selectedDomain = null;
            _selectedTld = null;

            $('#awsDomainAvailabilityName').empty();
            $('#awsDomainAvailabilityStatus').empty().html('<i class="fa fa-refresh fa-spin"></i>');
            $('#awsDomainSuggestionsTable').empty().html('<i class="fa fa-refresh fa-spin"></i>');
            $('#awsDomainAvailabilityTable').empty().append('<i class="fa fa-refresh fa-spin"></i>');
            $('#awsDomainAvailability').hide();
            $('#awsDomainSuggestions').hide();

            resetValidation(form);

            if (validateFormFields(form)) {
                var domainName = domainInp.val() + '.' + tldSelect.val();
                $('#awsDomainAvailabilityName').empty().text(domainName);
                $('#awsDomainAvailability').show();
                $('#awsDomainSuggestions').show();

                $.ajax({
                    dataType: 'json',
                    data: {
                        tldAvailability: true,
                        domainName: domainName
                    },
                    success: function (resp) {
                        if (resp.status) {
                            $('#awsDomainAvailabilityTable')
                                    .empty()
                                    .append(generateDomainRow(domainName, resp.data.status));
                            $('[data-toggle="tooltip"]').tooltip('destroy');
                            $('[data-toggle="tooltip"]').tooltip();
                        } else {

                        }
                    }
                });

                $.ajax({
                    dataType: 'json',
                    data: {
                        tldSuggestions: true,
                        domainName: domainName
                    },
                    success: function (resp) {
                        if (resp.status) {
                            var rows = [];

                            for (var i = 0; i < resp.data.length; i++) {
                                var sugg = resp.data[i];
                                var h = generateDomainRow(sugg.name, sugg.status);
                                rows.push(h);
                            }

                            $('#awsDomainSuggestionsTable')
                                    .empty()
                                    .append(rows);
                            $('[data-toggle="tooltip"]').tooltip('destroy');
                            $('[data-toggle="tooltip"]').tooltip();
                        } else {
                            flog('Oh No!!');
                        }
                    }
                });
            }
        });

        $('body').on('click', '.btn-aws-buydomain', function (e) {
            e.preventDefault();

            var btn = $(this);

            _selectedDomain = btn.data('domain');
            _selectedTld = btn.data('tld');

            $('#awsRegisterDomainWizard').wizard('next');
        });

        populateTLDs();
    }

    // Init Contact Details
    function initContactDetails() {
        $('body').on('change', '.awsContactDetailsSame', function (e) {
            var rad = $(this);

            if (rad.val() == 'true') {
                $('.awsContactDetailsExtraFields').hide(500);
                $('.awsContactDetailsExtraFields').find('input, select, textarea').prop('disabled', true);
            } else {
                $('.awsContactDetailsExtraFields').show(500);
                $('.awsContactDetailsExtraFields').find('input, select, textarea').prop('disabled', false);
            }

            updateRequiredFields();
            updatePrivacyProtection();
        });

        $('body').on('change', '.awsContactType', function (e) {
            var inp = $(this);

            if (inp.val() === 'PERSON') {
                for (var i = 0; i < contactTypes.length; i++) {
                    $('#aws' + contactTypes[i] + '_organizationName').prop('disabled', true);
                }
            } else {
                for (var i = 0; i < contactTypes.length; i++) {
                    $('#aws' + contactTypes[i] + '_organizationName').prop('disabled', false);
                }
            }

            updateRequiredFields();
            updatePrivacyProtection();
        });
    }

    function generateDomainRow(name, status) {
        var s, hint;
        var avail = false;
        var tld = name.substring(name.indexOf('.') + 1);

        switch (status) {
            case 'AVAILABLE':
                s = 'Available';
                hint = 'The domain name is available.';
                avail = true;
                break;
            case 'AVAILABLE_RESERVED':
                s = 'Available Reserved';
                hint = 'The domain name is reserved under specific conditions.';
                break;
            case 'AVAILABLE_PREORDER':
                s = 'Available Pre-order';
                hint = 'The domain name is available and can be pre-ordered.';
                avail = true;
                break;
            case 'DONT_KNOW':
                s = 'Don\'t Know';
                hint = 'The TLD registry didn\'t reply with a definitive answer about whether the domain name is available. Amazon Route 53 can return this response for a variety of reasons, for example, the registry is performing maintenance. Try again later.';
                break;
            case 'PENDING':
                s = 'Pending';
                hint = 'The TLD registry didn\'t return a response in the expected amount of time. When the response is delayed, it usually takes just a few extra seconds. You can resubmit the request immediately.';
                break;
            case 'RESERVED':
                s = 'Reserved';
                hint = 'The domain name has been reserved for another person or organization.';
                break;
            case 'UNAVAILABLE':
            case 'UNAVAILABLE_PREMIUM':
            case 'UNAVAILABLE_RESTRICTED':
                s = 'Unavailable';
                hint = 'The domain name is not available.';
                break;
        }

        return rowTemplate({
            domainName: name,
            available: avail,
            hint: hint,
            status: s,
            registerPrice: _tlds[tld].registerPrice,
            tld: tld
        });
    }

    function populateTLDs() {
        $.ajax({
            url: '?fetchTlds',
            dataType: 'json',
            success: function (resp) {
                if (resp.status) {
                    var tlds = resp.data;
                    var options = [];

                    for (var i = 0; i < tlds.length; i++) {
                        var tld = tlds[i];
                        options.push('<option value="' + tld.name + '">.' + tld.name + ' - US$' + tld.registerPrice + '</option>');
                        _tlds[tld.name] = tld;
                    }

                    $('#awsTldSelect')
                            .empty()
                            .append(options);

                    $("#awsTldSelect").trigger("chosen:updated");
                } else {
                    // TODO handle error
                }
            }
        });
    }

    function updateRequiredFields() {
        $('#awsContactDetails .required').removeClass('required');

        var tld = _tlds[_selectedTld];

        var allTheSame = $('.awsContactDetailsSame:checked').val() === 'true';

        var cts = (allTheSame ? ['Registrant'] : contactTypes);

        for (var b = 0; b < cts.length; b++) {
            var type = cts[b];
            var isCompany = $('aws' + type + '_contactType').val() != 'PERSON';

            var ownerFields = (isCompany ? tld.ownerFieldsForNonIndividuals : tld.ownerFieldsForIndividuals);

            if (ownerFields !== null && ownerFields.length > 0) {
                for (var i = 0; i < ownerFields.length; i++) {
                    var fieldName = null;
                    var f = ownerFields[i];
                    switch (f) {
                        case 'CONTACT_TYPE':
                            fieldName = 'contactType';
                            break;
                        case 'FIRST_NAME':
                            fieldName = 'firstName';
                            break;
                        case 'LAST_NAME':
                            fieldName = 'lastName';
                            break;
                        case 'ORG':
                            fieldName = 'organizationName';
                            break;
                        case 'EMAIL':
                            fieldName = 'email';
                            break;
                        default:
                            fieldName = f;
                    }

                    $('#aws' + type + '_' + fieldName).addClass('required');
                }
            }
        }
    }

    function updatePrivacyProtection() {
        var tld = _tlds[_selectedTld];
        var allTheSame = $('.awsContactDetailsSame:checked').val() === 'true';
        var cts = (allTheSame ? ['Registrant'] : contactTypes);

        for (var b = 0; b < cts.length; b++) {
            var type = cts[b];
            var isCompany = $('aws' + type + '_contactType').val() != 'PERSON';

            var privacyLevel = (isCompany ? tld.whoisPrivacyLevelForNonIndividuals : tld.whoisPrivacyLevelForIndividuals);
            $('#aws' + type + 'RegisterDomainProtectionStatus').empty();

            var t = '#aws' + type + '_privacyProtectTrue';
            var f = '#aws' + type + '_privacyProtectFalse';

            if (privacyLevel === 'NONE') {
                $(f).click();
                $(f).prop('disabled', true);
                $(t).prop('disabled', true);
                $(f).closest('label').addClass('disabled');
                $(t).closest('label').addClass('disabled');

                $('.awsRegisterDomainProtectionStatus').text('Privacy protection is not available for .' + _selectedTld + ' domains.');
            } else if (privacyLevel === 'PARTIAL') {
                $(t).click();
                $(f).prop('disabled', false);
                $(t).prop('disabled', false);
                $(f).closest('label').removeClass('disabled');
                $(t).closest('label').removeClass('disabled');

                $('#aws' + type + 'RegisterDomainProtectionStatus').text('Privacy protection hides some contact details for .' + _selectedTld + ' domains.');
            }
        }
    }

    // Init Function
    $(function () {
        initWizard();
        initSearchDomain();
        initContactDetails();
    });
})(jQuery);