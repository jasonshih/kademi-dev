(function ($) {
    $.fn.mselect = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jquery.mselect');
        }
    };

    $.fn.mselect.DEFAULT = {
        btnClass: 'btn btn-success',
        btnOkClass: 'btn btn-sm btn-primary',
        modalTitle: 'Select file',
        contentTypes: ['image'],
        excludedEndPaths: ['.mil/'],
        basePath: '/',
        pagePath: window.location.pathname,
        showModal: function (modal) {
            modal.modal('show');
        },
        onSelectFile: function (selectedUrl, selectedRelUrl) {
        },
        useModal: true
    };

    var methods = {
        init: function (options) {
            var config = $.extend({}, $.fn.mselect.DEFAULT, options);
            var target = this;

            flog('[jquery.mselect] Initializing mselect', config, target);
            if (config.useModal) {
                flog('[jquery.mselect] Initializing button and modal...', config, target);
                target.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var modal = getModal(config);
                    config.showModal(modal);
                });
            } else {
                flog('[jquery.mselect] Initializing mselect container only', config, target);

                target.html(getSelectContainer(config));
                initSelectContainer(target, config);
            }
            
            flog('[jquery.mselect] Initialized mselect');
        }
    };

    function initSelectContainer(container, config, onOk) {
        flog('[jquery.mselect] initSelectContainer', container, config);

        var tree = container.find('div.milton-tree-wrapper');
        var previewImg = container.find('.milton-image-preview img');

        tree.mtree({
            basePath: config.basePath,
            pagePath: config.pagePath,
            excludedEndPaths: config.excludedEndPaths,
            includeContentTypes: config.contentTypes,
            onselectFolder: function (n) {
            },
            onselectFile: function (n, selectedUrl) {
                previewImg.attr('src', selectedUrl);
            }
        });

        $('#milton-btn-upload-img').mupload({
            url: config.basePath,
            buttonText: '<i class="fa fa-upload"></i>',
            oncomplete: function (data, name, href) {
                flog('[jquery.mselect] oncomplete', data);
                tree.mtree('addFile', name, href);
                url = href;
            }
        });

        container.find('.btn-ok').click(function () {
            var url = previewImg.attr('src');
            var relUrl = url.substring(config.basePath.length, url.length);

            flog('[jquery.mselect] Selected', url, relUrl);

            if (typeof config.onSelectFile === 'function') {
                config.onSelectFile.call(this, url, relUrl);
            }

            if (typeof onOk === 'function') {
                onOK.call(this);
            }
        });
    }

    function getSelectContainer(config) {
        var extraElement = '';

        if (!config.useModal) {
            extraElement += '<button type="button" class="btn btn-primary btn-ok"><i class="fa fa-check"></i></button>';
        }

        return (
            '<div class="milton-image-select-container">' +
            '    <div class="row">' +
            '        <div class="col-xs-4"><div class="milton-tree-wrapper"></div></div>' +
            '        <div class="col-xs-8">' +
            '            <div id="milton-btn-upload-img" class="btn-upload"></div>' + extraElement +
            '            <div class="milton-image-preview"><img /></div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );
    }

    function getModal(config) {
        flog('[jquery.mselect] getModal', config);

        var modal = $('#modal-milton-file-select');
        if (modal.length === 0) {
            $('body').append(
                '<div id="modal-milton-file-select" class="modal modal-md fade" aria-hidden="true" tabindex="-1">' +
                '   <div class="modal-header">' +
                '       <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
                '       <h4 class="modal-title">' + config.modalTitle + '</h4>' +
                '   </div>' +
                '   <div class="modal-body">' + getSelectContainer(config) + '</div>' +
                '   <div class="modal-footer">' +
                '<button class="' + config.btnOkClass + ' btn-ok" type="button"> OK </button>' +
                '   </div>' +
                '</div>'
            );
            modal = $('#modal-milton-file-select');

            initSelectContainer(modal, config, function () {
                modal.modal('hide');
            });
        }

        return modal;
    }

})(jQuery);
