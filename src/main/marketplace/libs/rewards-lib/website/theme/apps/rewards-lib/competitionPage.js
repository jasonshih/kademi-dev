(function ($) {
    $(function () {
        var components = $('[data-type="component-competitionForm"]');
        if (components.length > 0) {
            components.each(function () {
                var component = $(this);
                
                initForm(component);
                initOrgSearchPromo(component);
                initSkuSearchPromo(component);
            });
        }
    });
    
    function initForm(component) {
        var form = component.find('form.entryForm');
        var thanks = component.find('.thankyou');
        
        component.find('form.entryForm').forms({
            onSuccess: function () {
                form.fhide();
                thanks.fshow();
            }
        });
        
        var myPromotionUpload = component.find('.promotion-photo-uploader');
        var viewUploaded = form.find('div.viewUploaded');
        var uploadUrl = myPromotionUpload.attr('data-url');
        if (uploadUrl) {
            myPromotionUpload.mupload({
                url: uploadUrl,
                buttonText: 'Upload a photo',
                oncomplete: function (data, name, href) {
                    // Using the hash, if not the name
                    if (href.indexOf("uploads/") > 0) {
                        var hash = href.split("uploads/")[1]
                        form.find('input[name=userAttachmentHash]').val(hash);
                    } else {
                        form.find('input[name=userAttachmentHash]').val(name);
                    }
                    
                    viewUploaded.css('background-image', 'url("' + href + '/alt-640-640.png' + '")');
                    viewUploaded.attr('data-url', href);
                }
            });
        }
        
        var rewardQuizes = component.find('.viewQuiz');
        rewardQuizes.each(function (i, n) {
            var quiz = $(n);
            var json = quiz.text();
            quiz.text('');
            quiz.formRender({
                dataType: 'json',
                formData: json,
                labelClasses: 'control-label',
                inputClasses: 'form-control'
            });
            quiz.show();
        });
        
        component.find('.go-again').click(function (e) {
            e.preventDefault();
            
            var currentUploadedUrl = viewUploaded.attr('data-url');
            var existingImg = form.find('.promotion-photo-inner[href="' + currentUploadedUrl + '"]');
            if (existingImg.length === 0) {
                var bg = currentUploadedUrl + '/alt-640-640.png';
                var a = $('<a href="' + currentUploadedUrl + '" class="promotion-photo-inner" )><span class="promotion-photo-label">My photo</span></a>');
                a.css('background-image', "url('"+bg+"')");
                var div = $('<div class="' + viewUploaded.attr('data-class') + ' promotion-photo promotion-photo-user"></div>');
                div.append(a);
                viewUploaded.parent().after(div);
            }
            viewUploaded.css('background-image', 'url("/static/images/photo_holder_squared.png")');
            viewUploaded.attr('data-url', '');
            
            form.fshow();
            thanks.fhide();
            form.find('.reset-on-resubmit').val('');
        });
    }
    
    function initOrgSearchPromo(component) {
        var orgSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: window.location.pathname + '?searchOrgs=%QUERY',
                wildcard: '%QUERY'
            }
        });
        
        component.find('.relatedOrgTitlePromo').typeahead({
            highlight: true
        }, {
            display: 'title',
            limit: 10,
            source: orgSearch,
            templates: {
                empty: '<div class="empty-message">No existing stores were found.</div>',
                suggestion: Handlebars.compile('<div><strong>{{title}}</strong></div>')
            }
        });
        
        component.find('.relatedOrgTitlePromo').bind('typeahead:select', function (ev, sug) {
            component.find('input[name=relatedOrg]').val(sug.orgId);
        });
    }
    
    function initSkuSearchPromo(component) {
        var orgSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: window.location.pathname + '?searchProducts=%QUERY',
                wildcard: '%QUERY',
                filter: function (data) {
                    var newData = data.map(function (item) {
                        item.tokens.splice(2, 1);
                        return {value: item.value, skuTitle: item.tokens.join(' - ')}
                    })
                    return newData;
                }
            }
        });
        
        component.find('.relatedProductSkuTitlePromo').typeahead({
            highlight: true
        }, {
            display: 'skuTitle',
            limit: 10,
            source: orgSearch,
            templates: {
                empty: '<div class="empty-message">No existing SKUs were found.</div>',
                suggestion: Handlebars.compile('<div><span>{{skuTitle}}</span></div>')
            }
        });
        
        component.find('.relatedProductSkuTitlePromo').bind('typeahead:select', function (ev, sug) {
            component.find('input[name=relatedProductSku]').val(sug.value);
        });
    }
})(jQuery);