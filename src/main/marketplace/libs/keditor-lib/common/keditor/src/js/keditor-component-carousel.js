(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['carousel'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "carousel" component', component);
            var componentContent = component.children('.keditor-component-content');
            var carousel = componentContent.find('.carousel');
            
            if (carousel.find('.carousel-img').length === 0 && carousel.find('.carousel-content').length === 0) {
                var self = this;
                var images = [];
                
                carousel.addClass('carousel-fixed-height');
                carousel.find('.carousel-inner .item').each(function () {
                    var item = $(this);
                    
                    images.push({
                        src: item.find('img').attr('src'),
                        hash: item.attr('data-hash')
                    });
                });
                
                carousel.attr('data-height', 300).css('height', 300);
                carousel.find('.carousel-inner').html('');
                carousel.find('.carousel-indicators').html('');
                
                $.each(images, function (i, image) {
                    self.addItemToCarousel(component, {
                        src: image.src,
                        hash: image.hash
                    });
                });
            }
            
            var id = keditor.generateId('component-carousel');
            carousel.attr('id', id);
            carousel.find('.carousel-indicators li').attr('data-target', '#' + id);
            carousel.find('.carousel-control').attr('href', '#' + id);
        },
        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.carousel-inner').children().removeClass('active').eq(0).addClass('active');
            
            return componentContent.html();
        },
        settingEnabled: true,
        
        settingTitle: 'Carousel settings',
        
        editingItemId: '',
        
        initSettingForm: function (form, keditor) {
            flog('init "carousel" settings', form);
            
            var self = this;
            return $.ajax({
                url: '/static/keditor/componentCarouselSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    $.getStyleOnce('/static/bootstrap-iconpicker/1.7.0/css/bootstrap-iconpicker.min.css');
                    $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                        $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                            form.find('.btn-prev-icon, .btn-next-icon').iconpicker({
                                iconset: 'fontawesome',
                                cols: 10,
                                rows: 4,
                                placement: 'left'
                            });
                            
                            form.find('.btn-prev-icon').on('change', function (e) {
                                var carousel = keditor.getSettingComponent().find('.carousel');
                                carousel.find('.glyphicon-chevron-left').attr('class', 'fa glyphicon-chevron-left ' + e.icon);
                            });
                            
                            form.find('.btn-next-icon').on('change', function (e) {
                                var carousel = keditor.getSettingComponent().find('.carousel');
                                carousel.find('.glyphicon-chevron-right').attr('class', 'fa glyphicon-chevron-right ' + e.icon);
                            });
                        });
                    });
                    
                    var carouselAddImage = form.find('.carouselAddImage');
                    var carouselItemsWrap = form.find('.carouselItemsWrap');
                    
                    carouselAddImage.mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: keditor.options.pagePath,
                        basePath: keditor.options.basePath,
                        onSelectFile: function (url, relUrl, type, hash) {
                            flog('Keditor carousel selected a file', url, hash);
                            self.addItemToList(form, {
                                src: url,
                                hash: hash,
                                caption: ''
                            });
                            
                            self.refreshCarousel(keditor.getSettingComponent(), form);
                            self.editingItemId = '';
                        }
                    });
                    
                    carouselItemsWrap.sortable({
                        handle: '.btn-sort-item',
                        items: '> .carouselItem',
                        axis: 'y',
                        tolerance: 'pointer',
                        sort: function () {
                            $(this).removeClass('ui-state-default');
                        },
                        update: function () {
                            self.refreshCarousel(keditor.getSettingComponent(), form);
                        }
                    });
                    
                    // Content modal
                    var editorContent = self.initModalContent(form, keditor)
                    var modalContent = $('#modal-carousel-content');
                    
                    // Caption modal
                    var editorCaption = self.initModalCaption(form, keditor)
                    var modalCaption = $('#modal-carousel-caption');
                    
                    form.find('.carouselAddImage').on('click', function (e) {
                        e.preventDefault();
                    });
                    
                    form.find('.carouselAddContent').on('click', function (e) {
                        e.preventDefault();
                        modalContent.modal('show');
                    });
                    
                    form.on('click', '.carouselItem a.btn-remove-item', function (e) {
                        e.preventDefault();
                        
                        if (confirm('Are you sure that you want to delete this image?')) {
                            var btn = $(this);
                            var hash = btn.closest('.btn-group').siblings('[data-hash]').attr('data-hash');
                            
                            var carousel = keditor.getSettingComponent().find('.carousel');
                            carousel.find('[data-hash=' + hash + ']').remove();
                            btn.closest('.carouselItem').remove();
                            
                            self.refreshCarousel(keditor.getSettingComponent(), form);
                        }
                    });
                    
                    form.on('click', '.carouselItem a.btn-edit-item', function (e) {
                        e.preventDefault();
                        
                        var carouselItem = $(this).closest('.carouselItem');
                        self.editingItemId = carouselItem.attr('id');
                        var txtCarouselContent = carouselItem.find('.txt-carousel-content');
                        
                        if (txtCarouselContent.length > 0) {
                            editorContent.setData(txtCarouselContent.val() || '');
                            form.find('.carouselAddContent').trigger('click');
                        } else {
                            form.find('.carouselAddImage').trigger('click');
                        }
                    });
                    
                    
                    form.on('click', '.carouselItem a.btn-edit-caption-item', function (e) {
                        e.preventDefault();
                        
                        var carouselItem = $(this).closest('.carouselItem');
                        self.editingItemId = carouselItem.attr('id');
                        var txtCarouselCaption = carouselItem.find('.txt-carousel-caption');
                        
                        editorCaption.setData(txtCarouselCaption.val() || '');
                        modalCaption.modal('show');
                    });
                    
                    form.find('.carouselHeight').on('change', function (e) {
                        var value = this.value;
                        
                        if (isNaN(value) || +value < 200) {
                            value = 200;
                            this.value = 200;
                        }
                        
                        var carousel = keditor.getSettingComponent().find('.carousel');
                        carousel.attr('data-height', value);
                        carousel.css('height', value);
                    });
                    
                    form.find('.carouselPause').on('change', function (e) {
                        e.preventDefault();
                        var comp = keditor.getSettingComponent().find('.carousel');
                        comp.attr('data-pause', this.value);
                    });
                    
                    form.find('.carouselInterval').on('change', function (e) {
                        e.preventDefault();
                        var comp = keditor.getSettingComponent().find('.carousel');
                        comp.attr('data-interval', this.value);
                    });
                    
                    form.find('.carouselWrap').on('click', function (e) {
                        var comp = keditor.getSettingComponent().find('.carousel');
                        if (this.checked) {
                            comp.attr('data-wrap', 'true');
                        } else {
                            comp.attr('data-wrap', 'false');
                        }
                    });
                    
                    form.find('.select-image-size').on('change', function () {
                        var carousel = keditor.getSettingComponent().find('.carousel');
                        
                        carousel.attr('data-image-size', this.value);
                        
                        carousel.find('.carousel-img').css('background-size', this.value === 'centered' ? 'unset' : '');
                    });
                }
            });
        },
        
        initModalContent: function (form, keditor) {
            var self = this;
            
            var modalContent = $(
                '<div class="modal fade" tabindex="-1" id="modal-carousel-content">' +
                '    <div class="modal-dialog modal-lg">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <button type="button" class="close" data-dismiss="modal">&times;</button>' +
                '                <h4 class="modal-title">Edit content</h4>' +
                '            </div>' +
                '            <div class="modal-body">' +
                '                <textarea id="modal-carousel-content-body" class="form-control" rows="12"></textarea>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '                <button type="button" class="btn btn-primary btn-carousel-save-content">Save</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
            ).appendTo(document.body);
            
            var contentOptions = $.extend({}, keditor.options.ckeditorOptions);
            contentOptions.removePlugins = contentOptions.removePlugins.replace(',autogrow', '') + ',sourcedialog';
            contentOptions.extraPlugins = contentOptions.extraPlugins + ',autogrow';
            var editorContent = $('#modal-carousel-content-body').ckeditor(contentOptions).editor;
            
            modalContent.on('hidden.bs.modal', function () {
                editorContent.setData('');
                self.editingItemId = '';
            });
            
            modalContent.find('.btn-carousel-save-content').on('click', function (e) {
                e.preventDefault();
                
                flog('Keditor carousel add content');
                
                var carouselContent = editorContent.getData() || '';
                self.addItemToList(form, {
                    content: carouselContent
                });
                
                self.refreshCarousel(keditor.getSettingComponent(), form);
                modalContent.modal('hide');
            });
            
            return editorContent;
        },
        
        initModalCaption: function (form, keditor) {
            var self = this;
            
            var modalCaption = $(
                '<div class="modal fade" tabindex="-1" id="modal-carousel-caption">' +
                '    <div class="modal-dialog modal-lg">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <button type="button" class="close" data-dismiss="modal">&times;</button>' +
                '                <h4 class="modal-title">Edit caption</h4>' +
                '            </div>' +
                '            <div class="modal-body">' +
                '                <textarea id="modal-carousel-caption-body" class="form-control" rows="12"></textarea>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '                <button type="button" class="btn btn-primary btn-carousel-save-caption">Save</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
            ).appendTo(document.body);
            
            var captionOptions = $.extend({}, keditor.options.ckeditorOptions);
            captionOptions.removePlugins = captionOptions.removePlugins.replace(',autogrow', '') + ',sourcedialog';
            captionOptions.extraPlugins = captionOptions.extraPlugins + ',autogrow';
            captionOptions.toolbarGroups = toolbarSets['Lite'];
            var editorCaption = $('#modal-carousel-caption-body').ckeditor(captionOptions).editor;
            
            modalCaption.on('hidden.bs.modal', function () {
                editorCaption.setData('');
                self.editingItemId = '';
            });
            
            modalCaption.find('.btn-carousel-save-caption').on('click', function (e) {
                e.preventDefault();
                
                flog('Keditor carousel add content');
                
                var carouselCaption = editorCaption.getData() || '';
                var item = form.find('#' + self.editingItemId).find('.img-responsive');
                self.addItemToList(form, {
                    src: item.attr('src'),
                    hash: item.attr('data-hash'),
                    caption: carouselCaption
                });
                
                self.refreshCarousel(keditor.getSettingComponent(), form);
                modalCaption.modal('hide');
            });
            
            return editorCaption;
        },
        
        showSettingForm: function (form, component, keditor) {
            var self = this;
            self.editingItemId = '';
            form.find('.carouselItemsWrap').html('');
            component.find('.carousel-inner > .item').each(function () {
                var item = $(this);
                var carouselImg = item.find('.carousel-img');
                var carouselContent = item.find('.carousel-content');
                
                if (carouselContent.length > 0) {
                    self.addItemToList(form, {
                        content: carouselContent.html()
                    });
                } else {
                    var url = carouselImg.css('background-image');
                    url = url.slice(4, -1).replace(/['"]/g, '');
                    var hash = $(item).attr('data-hash');
                    var caption = item.find('.carousel-caption');
                    
                    self.addItemToList(form, {
                        src: url,
                        hash: hash,
                        caption: caption.html() || ''
                    });
                }
            });
            
            var carousel = component.find('.carousel');
            var isWrap = carousel.attr('data-wrap');
            var pause = carousel.attr('data-pause');
            var interval = carousel.attr('data-interval');
            var height = carousel.attr('data-height');
            
            form.find('.carouselPause').val(pause);
            form.find('.carouselInterval').val(interval);
            form.find('.carouselWrap').prop('checked', isWrap === 'true');
            form.find('.carouselHeight').val(height);
            form.find('.select-image-size').val(carousel.attr('data-image-size') || 'stretched');
            
            $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                    var iconPrev = carousel.find('.glyphicon-chevron-left').attr('class') || '';
                    iconPrev = iconPrev.replace('glyphicon-chevron-left', '').replace('fa', '').trim();
                    form.find('.btn-prev-icon').find('i').attr('class', 'fa ' + iconPrev).end().find('input').val(iconPrev);
                    
                    var iconNext = carousel.find('.glyphicon-chevron-right').attr('class') || '';
                    iconNext = iconNext.replace('glyphicon-chevron-right', '').replace('fa', '').trim();
                    form.find('.btn-next-icon').find('i').attr('class', 'fa ' + iconNext).end().find('input').val(iconNext);
                });
            });
        },
        
        addItemToCarousel: function (component, data) {
            flog('addItemToCarousel', component, data);
            
            var carousel = component.find('.carousel');
            var carouselInner = carousel.find('.carousel-inner');
            var id = carousel.attr('id');
            var index = carouselInner.children().length;
            var cls = index === 0 ? 'active' : '';
            var backgroundUrl = "background-image: url('" + data.src + "')";
            var backgroundSize = carousel.attr('data-image-size') === 'centered' ? ';background-size: unset' : '';
            
            carousel.find('.carousel-indicators').append(
                '<li data-target="#' + id + '" data-slide-to="' + index + '" class="' + cls + '"></li>'
            );
            
            var itemStr = '';
            if (data.content) {
                itemStr += '<div class="item ' + cls + '">';
                itemStr += '   <div class="carousel-content clearfix">' + data.content + '</div>';
                itemStr += '   <div class="carousel-caption"></div>';
                itemStr += '</div>';
            } else {
                itemStr += '<div data-hash="' + data.hash + '" class="item ' + cls + '">';
                itemStr += '   <div class="carousel-img" style="' + backgroundUrl + backgroundSize + '"></div>';
                itemStr += '   <div class="carousel-caption">' + data.caption + '</div>';
                itemStr += '</div>';
            }
            
            carouselInner.append(itemStr);
        },
        
        addItemToList: function (form, data) {
            flog('addItemToList', form, data);
            
            var editCaption = '';
            
            var itemStr = '';
            if (data.content) {
                itemStr += '<img class="img-responsive" src="/static/keditor/componentCarouselContent.png" />';
                itemStr += '<textarea style="display: none" class="txt-carousel-content">' + data.content + '</textarea>';
            } else {
                itemStr += '<img class="img-responsive" src="' + data.src + '" data-hash="' + data.hash + '" />';
                itemStr += '<textarea style="display: none" class="txt-carousel-caption">' + data.caption + '</textarea>';
                editCaption = '<a title="Edit caption" class="btn btn-success btn-edit-caption-item" href="#"><i class="fa fa-file"></i></a>';
            }
            
            itemStr += '   <div class="btn-group btn-group-xs">';
            itemStr += '       <a title="Reorder item" class="btn btn-info btn-sort-item" href="#"><i class="fa fa-sort"></i></a>';
            itemStr += '       <a title="Edit item" class="btn btn-primary btn-edit-item" href="#"><i class="fa fa-edit"></i></a>' + editCaption;
            itemStr += '       <a title="Delete item" class="btn btn-danger btn-remove-item" href="#"><i class="fa fa-trash"></i></a>';
            itemStr += '   </div>';
            
            if (this.editingItemId) {
                form.find('#' + this.editingItemId).html(itemStr);
                this.editingItemId = '';
            } else {
                form.find('.carouselItemsWrap').append(
                    '<div class="carouselItem" id="carouselItem-' + (new Date()).getTime() + '">' + itemStr + '</div>'
                );
            }
        },
        
        refreshCarousel: function (component, form) {
            var self = this;
            var carousel = component.find('.carousel');
            carousel.find('.carousel-inner').html('');
            carousel.find('.carousel-indicators').html('');
            
            form.find('.carouselItemsWrap').find('.carouselItem').each(function () {
                var carouselItem = $(this);
                var txtContent = carouselItem.find('.txt-carousel-content');
                var txtCaption = carouselItem.find('.txt-carousel-caption');
                var img = carouselItem.find('img');
                
                if (txtContent.length === 0) {
                    self.addItemToCarousel(component, {
                        src: img.attr('src'),
                        hash: img.attr('data-hash'),
                        caption: txtCaption.val()
                    });
                } else {
                    self.addItemToCarousel(component, {
                        content: txtContent.val()
                    });
                }
            });
        }
    }
    
})(jQuery);