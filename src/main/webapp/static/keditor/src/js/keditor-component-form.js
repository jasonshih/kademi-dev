/**
 * KEditor Form Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['form'] = {
        initFormBuilder: function (component) {
            var self = this;
            
            $.getScriptOnce('/static/formBuilder/2.5.3/form-builder.min.js', function () {
                $.getScriptOnce('/static/formBuilder/2.5.3/form-render.min.js', function () {
                    var formBuilderArea = component.find('.form-builder-area');
                    var formData = component.find('.form-data');
                    var formContent = component.find('.form-content');
                    
                    component.find('.keditor-component-content').prepend(
                        '<p class="form-builder-tools" style="text-align: right;">' +
                        '    <a href="#" class="btn btn-primary btn-preview-form">Preview form</a> ' +
                        '    <a href="#" class="btn btn-info btn-edit-form disabled">Edit form</a>' +
                        '</p>'
                    );
                    
                    var btnEditForm = component.find('.btn-edit-form');
                    var btnPreviewForm = component.find('.btn-preview-form');
                    
                    formBuilderArea.formBuilder({
                        disableInjectedStyle: true,
                        showActionButtons: false,
                        dataType: 'json',
                        formData: formData.html(),
                        disableFields: [
                            'autocomplete',
                            'paragraph',
                            'header'
                        ],
                        disabledAttrs: ['access'],
                        
                        typeUserDisabledAttrs: {
                            'checkbox-group': [
                                'toggle',
                                'inline'
                            ]
                        }
                    });
                    
                    btnEditForm.on('click', function (e) {
                        e.preventDefault();
                        
                        if (!btnEditForm.hasClass('disabled')) {
                            formBuilderArea.show();
                            formContent.hide();
                            btnEditForm.addClass('disabled');
                            btnPreviewForm.removeClass('disabled');
                        }
                    });
                    
                    btnPreviewForm.on('click', function (e) {
                        e.preventDefault();
                        
                        if (!btnPreviewForm.hasClass('disabled')) {
                            self.renderForm(component);
                            
                            formBuilderArea.hide();
                            formContent.show();
                            btnEditForm.removeClass('disabled');
                            btnPreviewForm.addClass('disabled');
                        }
                    });
                })
            });
        },
        
        renderForm: function (component, formBuilder) {
            var formContent = component.find('.form-content');
            
            if (!formBuilder) {
                var formBuilderArea = component.find('.form-builder-area');
                formBuilder = formBuilderArea.data('formBuilder');
            }
            
            formContent.formRender({
                dataType: 'json',
                formData: formBuilder.actions.getData('json')
            });
            
            if (formContent.hasClass('form-horizontal')) {
                formContent.children('div').each(function () {
                    var div = $(this);
                    var dataGrid = formContent.attr('data-grid') || '4-8';
                    dataGrid = dataGrid.split('-');
                    
                    if (div.attr('class')) {
                        if (div.hasClass('fb-button')) {
                            div.find('button').wrap('<div class="col-sm-' + dataGrid[1] + ' col-sm-offset-' + dataGrid[0] + '"></div>');
                        } else {
                            var label = div.children('label');
                            var input = div.children('input, select, textarea');
                            var subDiv = div.children('div');
                            
                            label.addClass('control-label col-sm-' + dataGrid[0]);
                            
                            if (subDiv.length > 0) {
                                subDiv.addClass('col-sm-' + dataGrid[1]);
                            } else {
                                input.addClass('form-control').wrap('<div class="col-sm-' + dataGrid[1] + '"></div>');
                            }
                        }
                    }
                });
            }
        },
        
        init: function (contentArea, container, component, keditor) {
            flog('init "form" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var formBuilder = component.find('.form-builder-area');
            var formContent = component.find('.form-content');
            var formData = component.find('.form-data');
            
            if (formData.length === 0) {
                componentContent.append('<div class="form-data" style="display: none !important;"></div>')
            }
            
            if (formContent.length === 0) {
                componentContent.append('<form class="form-content" style="display: none !important;"></form>')
            } else {
                formContent.hide()
            }
            
            if (formBuilder.length === 0) {
                formBuilder = $('<div class="form-builder-area clearfix"></div>');
                componentContent.append(formBuilder);
            }
            
            this.initFormBuilder(component);
        },
        
        getContent: function (component, keditor) {
            flog('getContent "form" component', component);
            
            var self = this;
            var componentContent = component.find('.keditor-component-content');
            var formData = component.find('.form-data');
            var formBuilderArea = $('#' + component.attr('id')).find('.form-builder-area');
            var formBuilder = formBuilderArea.data('formBuilder');
            
            self.renderForm(component, formBuilder);
            formData.html(formBuilder.actions.getData('json'));
            component.find('.form-builder-area, .form-builder-tools').remove();
            component.find('.form-content').show();
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Form Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "form" component');
            
            var self = this;
            
            return $.ajax({
                url: '/static/keditor/componentFormSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.txt-form-action').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.attr('action', this.value);
                    });
                    
                    form.find('.select-method').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.attr('action', this.value);
                    });
                    
                    form.find('.select-enctype').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.attr('enctype', this.value);
                    });
                    
                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.removeClass('form-inline form-horizontal');
                        if (this.value) {
                            formContent.addClass(this.value);
                        }
                        self.renderForm(component);
                        form.find('.select-grid-wrapper').css('display', this.value === 'form-horizontal' ? 'block' : 'none');
                    });
                    
                    form.find('.select-grid').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var formContent = component.find('.form-content');
                        
                        formContent.attr('data-grid', this.value);
                        self.renderForm(component);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "form" component', component);
            var formContent = component.find('.form-content');
            
            var layout = '';
            if (formContent.hasClass('form-inline')) {
                layout = 'form-inline';
            } else if (formContent.hasClass('form-horizontal')) {
                layout = 'form-horizontal';
            }
            
            form.find('.txt-form-action').val(formContent.attr('action') || '');
            form.find('.select-method').val(formContent.attr('method') || 'get');
            form.find('.select-enctype').val(formContent.attr('enctype'));
            form.find('.select-layout').val(layout);
            form.find('.select-grid-wrapper').css('display', layout === 'form-horizontal' ? 'block' : 'none');
            form.find('.select-grid').val(formContent.attr('data-grid') || '4-8');
        }
    };
    
})(jQuery);
