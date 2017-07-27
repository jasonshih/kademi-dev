(function ($) {
    var _tlds = {};
    var contactTypes = ['Registrant', 'Admin', 'Tech'];

    var _selectedDomain = null;
    var _selectedTld = null;

    // Init Wizard
    function initWizard() {
        var wizardDiv = $('#awsRegisterDomainWizard');
        var extraFieldTemplate = Handlebars.compile($('#awsRegisterExtraFieldTemplate').html());

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
            flog(data);
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

                    updateRequiredFields(true);
                    updatePrivacyProtection(true);
                }
            } else if (data.step === 2) {
                if (data.direction === 'previous') {
                    _selectedTld = null;
                    _selectedDomain = null;
                    $('#awsContactDetails .required').removeClass('required');
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

        $('body').on('click', '.btn-aws-buydomain', function (e) {
            e.preventDefault();

            var btn = $(this);

            _selectedDomain = btn.data('domain');
            _selectedTld = btn.data('tld');

            $('#awsRegisterDomainWizard').wizard('next');
        });

        form.forms({
            allowPostForm: false,
            onValid: function (form, config) {
                var domainName = domainInp.val() + '.' + tldSelect.val();
                $('#awsDomainAvailabilityName').empty().text(domainName);
                $('#awsDomainAvailabilityStatus')
                        .empty()
                        .html('<i class="fa fa-refresh fa-spin"></i>');
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
                        } else {
                            flog('Oh No!!');
                        }
                    }
                });
            }
        });

        populateTLDs();
    }

    // Init Contact Details
    function initContactDetails() {
        $('body').on('change', '.awsContactDetailsSame', function (e) {
            var rad = $(this);

            if (rad.val() == 'yes') {
                $('.awsContactDetailsExtraFields').hide(500);
            } else {
                $('.awsContactDetailsExtraFields').show(500);
            }
        });

        $('body').on('change', '.awsContactType', function (e) {
            var inp = $(this);

            if (inp.val() === 'PERSON') {
                for (var i = 0; i < contactTypes.length; i++) {
                    $('#aws' + contactTypes[i] + '_organizationName').prop('disabled', true);
                }
                updateRequiredFields(false);
                updatePrivacyProtection(false);
            } else {
                for (var i = 0; i < contactTypes.length; i++) {
                    $('#aws' + contactTypes[i] + '_organizationName').prop('disabled', false);
                }
                updateRequiredFields(true);
                updatePrivacyProtection(true);
            }
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

        return '<tr>'
                + ' <td>' + name + '</td>'
                + ' <td>' + (avail ? '<i class="fa fa-check fa-2x text-success"></i> ' : '<i class="fa fa-times fa-2x text-danger"></i> ') + s + '</td>'
                + ' <td>' + (avail ? 'US$' + _tlds[tld].registerPrice + '</td>' : '')
                + ' <td>'
                + (avail ? '<button type="button" class="btn btn-info btn-aws-buydomain" data-tld="' + tld + '" data-domain="' + name + '">Buy Domain</button>' : '')
                + '</td>'
                + '</tr>';
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

    function updateRequiredFields(isCompany) {
        $('#awsContactDetails .required').removeClass('required');

        var tld = _tlds[_selectedTld];
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

                for (var b = 0; b < contactTypes.length; b++) {
                    $('#aws' + contactTypes[b] + '_' + fieldName).addClass('required');
                }
            }
        }
    }

    function updatePrivacyProtection(isCompany) {
        var tld = _tlds[_selectedTld];
        var privacyLevel = (isCompany ? tld.whoisPrivacyLevelForNonIndividuals : tld.whoisPrivacyLevelForIndividuals);

        if (privacyLevel === 'NONE') {
            $('.awsPrivacyProtectFalse').click();
            $('.awsPrivacyProtectFalse').prop('disabled', true);
            $('.awsPrivacyProtectTrue').prop('disabled', true);
        } else if (privacyLevel === 'PARTIAL') {
            $('.awsPrivacyProtectTrue').click();
            $('.awsPrivacyProtectFalse').prop('disabled', false);
            $('.awsPrivacyProtectTrue').prop('disabled', false);
        }
    }

    // Init Function
    $(function () {
        initWizard();
        initSearchDomain();
        initContactDetails();
    });
})(jQuery);