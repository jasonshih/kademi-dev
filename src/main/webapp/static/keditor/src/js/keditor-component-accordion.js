/**
 * KEditor Jumbotron Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['accordion'] = {
        settingEnabled: true,

        settingTitle: 'Accordion Settings',
        options: {
            toolbarGroups: [
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                {name: 'forms', groups: ['forms']},
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                {name: 'links', groups: ['links']},
                {name: 'insert', groups: ['insert']},
                '/',
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'styles', groups: ['styles']},
                {name: 'colors', groups: ['colors']},
                {name: 'tools', groups: ['tools']},
                {name: 'others', groups: ['others']}
            ],
            title: false,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes: allowed through
            bodyId: 'editor',
            templates_replaceContent: false,
            enterMode: 'P',
            forceEnterMode: true,
            format_tags: 'p;h1;h2;h3;h4;h5;h6',
            removePlugins: 'table,magicline,tabletools',
            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Textarea,TextField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,BGColor,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor',
            minimumChangeMilliseconds: 100
        },
        init: function(contentArea, container, component, keditor){
            var self = this;
            var options = self.options;
            var id = keditor.generateId('accordion');
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.accordionWrap .panel-group').attr('id', id);
            componentContent.find('.accordionWrap a[data-toggle]').attr('data-parent', '#' + id);


            var panels = componentContent.find('.panel');
            panels.each(function(index, item){
                var p = $(item);
                var itemId = keditor.generateId('heading'+index);
                var panelCollapseId = keditor.generateId('collapse'+index);
                p.find('.panel-heading').attr('id', itemId);
                p.find('.panel-collapse').attr('aria-labelledby', itemId).attr('id', panelCollapseId);
                var title = p.find('a[data-toggle]').html();
                if (title.indexOf ('<div>') === -1){
                    p.find('a[data-toggle]').attr('href', '#'+panelCollapseId).html('<div>'+title+'</div>');
                }
            });

            componentContent.find('.accordionWrap .panel-collapse').collapse('show');
            componentContent.find('.panel-footer, .btnAddAccordionItem').removeClass('hide');
            componentContent.find('.panel-title a div').prop('contenteditable', true);
            componentContent.find('.panel-collapse .panel-body').prop('contenteditable', true);

            componentContent.find('.panel-title a div, .panel-collapse .panel-body').on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });

            var editor = componentContent.find('.panel-title a div, .panel-collapse .panel-body').ckeditor(self.options).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });

            $(document).off('click', '.btnDeleteAccordionItem').on('click', '.btnDeleteAccordionItem', function(e){
                e.preventDefault();

                if (confirm('Are you sure you want to delete this item?')){
                    var panelsCount = componentContent.find('.panel').length;
                    if (panelsCount > 1) {
                        $(this).parents('.panel').remove();
                    } else {
                        Msg.error('You cant delete the last item');
                    }
                }
            });

            $(document).off('click', '.btnAddAccordionItem').on('click', '.btnAddAccordionItem', function(e){
                e.preventDefault();
                var clone = componentContent.find('.panel').first().clone();
                var itemId = keditor.generateId('heading');
                var panelCollapseId = keditor.generateId('collapse');
                clone.find('.panel-heading').attr('id', itemId);
                clone.find('.panel-collapse').attr('aria-labelledby', itemId).attr('id', panelCollapseId);
                clone.find('a[data-toggle]').attr('href', '#'+panelCollapseId);
                componentContent.find('.accordionWrap .panel-group').append(clone);
                var editor = clone.find('.panel-title a div, .panel-collapse .panel-body').ckeditor(self.options).editor;
                editor.on('instanceReady', function () {
                    flog('CKEditor is ready', component);

                    if (typeof options.onComponentReady === 'function') {
                        options.onComponentReady.call(contentArea, component, editor);
                    }
                });
            });
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.panel-title a div').each(function(){
                var h = $(this).html();
                $(this).parent('a').html(h);
            });
            componentContent.find('.panel-collapse .panel-body').each(function(){
                var h = $(this).html();
                $(this).replaceWith('<div class="panel-body">'+h+'</div>');
            });
            componentContent.find('.panel-footer, .btnAddAccordionItem').addClass('hide');
            return componentContent.html();
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "jumbotron" component');
            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
            '           <label class="col-sm-12">Heading</label>' +
                '       <div class="col-sm-12">' +
                '            <textarea class="form-control" name="accordHeading"></textarea> ' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '           <label class="col-sm-12">Content</label>' +
                '       <div class="col-sm-12">' +
                '            <textarea class="form-control" name="accordContent"></textarea> ' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "accordion" component', component);
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };
})(jQuery);

