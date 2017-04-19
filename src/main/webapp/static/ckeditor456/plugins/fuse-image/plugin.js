CKEDITOR.plugins.add('fuse-image', {
    init: function (editor) {
        var loadmselect = function (f) {
            $.getScriptOnce('/static/jquery.mselect/1.1.0/jquery.mselect-1.1.0.js', f);
        }

        var iconPath = this.path + 'images/icon.png';
        $('body').append(
            '<div id="modal-fuse-image" class="modal fade" aria-hidden="true" tabindex="-1">' +
            '   <div class="modal-dialog modal-lg">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header">' +
            '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
            '               <h4 class="modal-title">Select image</h4>' +
            '           </div>' +
            '           <div class="modal-body"></div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
        var that = this;
        var modal = $('#modal-fuse-image');
        var command = new CKEDITOR.command( editor, {
            exec: function( instance ) {
                var sel = instance.getSelection();
                var element = sel.getStartElement();
                if (element) {
                    element = element.getAscendant('img', true);
                }

                if (!element || element.getName() != 'img' || element.data('cke-realelement')) {
                    element = instance.document.createElement('img');
                    that.insertMode = true;
                } else {
                    that.insertMode = false;
                }

                that.element = element;
                loadmselect(function () {
                    modal.find('.modal-body').mselect({
                        contentTypes: ['image'],
                        useModal: false,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var imageUrl = '/_hashes/files/' + hash;
                            that.element.setAttribute('src', imageUrl);
                            that.element.addClass('img-responsive');
                            if (that.insertMode){
                                instance.insertElement(that.element);
                            } else {
                                instance.updateElement();
                            }
                            modal.modal('hide');
                        }
                    });

                    modal.modal();
                });

            }
        } );
        editor.addCommand('imageDialog', command);

        editor.ui.addButton('fuse-image', {
            label: 'Browse and upload images',
            command: 'imageDialog',
            toolbar: 'insert,1',
            icon: iconPath
        });

        if (editor.contextMenu) {
            editor.addMenuGroup('imageGroup');
            editor.addMenuItem('imageItem',
                {
                    label: 'Edit image',
                    icon: iconPath,
                    command: 'imageDialog',
                    group: 'imageGroup'
                });
            editor.contextMenu.addListener(function (element) {
                if (element)
                    element = element.getAscendant('img', true);
                if (element && !element.isReadOnly() && !element.data('cke-realelement') && !element.data('kaudio') && !element.hasClass('video-jw'))
                    return {
                        imageItem: CKEDITOR.TRISTATE_ON
                    };
                return null;
            });
        }

    }
});