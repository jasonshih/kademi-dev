(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['unsubscribeLink'] = $.extend({}, KEditor.components['text'], {
        options: {
            title: false,
            allowedContent: true,
            bodyId: 'editor',
            templates_replaceContent: false,
            toolbarGroups: [
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph', groups: ['align', 'bidi', 'paragraph']},
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                '/',
                {name: 'styles', groups: ['styles']},
                {name: 'colors', groups: ['colors']},
                {name: 'tools', groups: ['tools']},
                {name: 'others', groups: ['others']},
                {name: 'about', groups: ['about']}
            ],
            extraPlugins: 'lineheight,onchange',
            removePlugins: 'table,magicline,tabletools',
            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteUnsubscribe,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Unsubscribearea,UnsubscribeField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,BGColor,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor,Styles,Format',
            enterMode: CKEDITOR.ENTER_DIV,
            forceEnterMode: true,
            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
            filebrowserUploadUrl: '/uploader/upload',
            format_tags: 'p;h1;h2;h3;h4;h5;h6',
            stylesSet: 'myStyles:' + stylesPath,
            line_height: '1;1.2;1.5;2;2.2;2.5'
        },
        settingEnabled: true,
        settingTitle: 'View In Browser Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "unsubscribeLink" component');

            form.append(
                    '<form class="form-horizontal">' +
                    '   <div class="form-group">' +
                    '       <label for="photo-align" class="col-sm-12">Message:</label>' +
                    '       <div class="col-sm-12">' +
                    '           <input class="form-control message" type="text" />' +
                    '       </div>' +
                    '   </div>' +
                    '</form>'
                    );

            form.find('.message').on('change', function () {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                component.attr('data-message', this.value);
                keditor.initDynamicContent(dynamicElement);
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "unsubscribeLink" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.message').val(dataAttributes['data-message']);
        }
    });

})(jQuery);