var url = '';
var src = '';
var audioImage = 'data:image/jpeg;base64,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6Yulehszlj8jgIRqcRhkaEzJSSxUOfrUyv8AKUr7PR+0BRICQo3GwUDSWUxscnCgoaMYeiU1V1todSpeT15CAdpMzVqIZREQ7iXod4iWy82eEhaVZSUkyyGQD9FHLM6iIzP2VAOZOneIgJx0grXAOsLOGhmoeLcJ5oq3kGozLKosqSUST+wBoNkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFkudoxr2d8AslztGNezvgFlOFlxjBfHHs74D8Rq0KdSSVYxSUJS47l9JRfb7CqT/AKAMcBcfR1OpG9RijUPEzKEl71Hp2uNjURTzbClw6m1KJxBLMjdPC9CpNZ/AXMxFq38opeveejhOnMxavrelu0Yz34etF6YkiksFGzOdwJUembk5blsJhNpfgDjHVLw4kiQlTZOqqwTUo8nsIcbac20ppafHOlj28uOz02nxbo+2NSJn1ni0Zj55SDFIZAzRFqhCpnAnM1UfiWTjExDRwxRLrpOIhziiViiMyLL6VXxFa/6u7HGPpd9v3f793HR09kxM466n5TGJ/rlX/S9NpbH0jgWZfEtxbcslkJAOxLCiW0t1pJms0LLIoiw6qyG2tu1L28ptOFadNunSs9YrGWjgpevQNTii8no6/KphMGoKYREca20OkpJLSttCU+mRYJZSPrMBtvThGGiginFLW3iY+EXht1YaalGeEmvJX7AGuyOaQc6j7RhFpabmc3hpwprCSaoSDlbZpeionA9Ftb6iqq9YCjp/Gsx09mMawWCzExTzzSeqpLjhqT/AwGx9E84k0qpYl+arSyy4w4yzEL/JbdUaTJRn6q0kpNfxAXl5z0OP+/Zd82xvgHnNQ737Lvm2N8A85qHe/Zd82xvgHnNQ737Lvm2N8A85qHe/Zd82xvgHnNQ737Lvm2N8B5uUqoc28w4qdy5TaHEKWkotg8hKIz/TAWG1M0Ptoeh3EvsOkS2XmzJaFpVlJSVFWRkYDl7p+m0tmPSGryFSXFwkK1DxjqDIyN5JqMyrLrNKVEkwFegOvOgf+qiR/tX4x4BvwCEpzDvRNCqQQ7CDcfelsY202kqzUtbCySRF8TMBxAAzZHNFSqcwMzS2TqoJ9uIJozqJRtqJWDX6q6gE/TTpNpRStxSIx/yeX11ty6HrSyX3vWs/ioBqYAA+GRGVQDPl9I6TSxnES2bRkGxXXimH3G0V/dSZEA9nqZU1faU09Ppg40sqloVEumRkfqP0gEQhsk/Ez6zAfsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG0RXSJP4yhvmrGqTEwaHW3GIhys3kIarqbwq8qcuSvqAQsJPJtBy6LlsLFLZgo/A8sYQdROYuvBJXrqy9QDBAAAAAAAAAAHwyIyqAZkLPqRwcIqCg5rFw0GuvCh2n3ENnX1+ikyIBgobwcvWZ9ZmA/YDsDoOh3ofoskTbyDQs0PuElRVHgORLriD/3JURkA3oAAUtSW7NbMTavk9oYZ+UeSeX4vD/S/on1VdfXV6wEXmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbABmo82wAZqPNsAGajzbADIl91jy1nEYnHYRYHlFp4quv9PH/VVfeyALxh/J/J2vJsDyfATicXVgYFXo4NWSqrqqAegD/9k=';
var audioInitDone = false;
function buildAudioPlayerPreview(path, container){
    var audiotag = document.createElement("audio");
    audiotag.setAttribute("controls", "controls");
    var source = document.createElement('source');
    source.setAttribute('src',path);
    audiotag.appendChild(source);
    audiotag.load();
    audiotag.style.width = '80%';
    container.appendChild(audiotag);
}

CKEDITOR.plugins.add('embed_audio', {
    init: function (editor) {
        var iconPath = this.path + 'images/icon.png';

        editor.addCommand('audioDialog', new CKEDITOR.dialogCommand('audioDialog'));

        editor.ui.addButton('Audio', {
            label: 'Insert Audio',
            command: 'audioDialog',
            toolbar: 'insert,2',
            icon: iconPath
        });

        if (editor.contextMenu) {
            editor.addMenuGroup('audioGroup');
            editor.addMenuItem('audioItem', {
                label: 'Edit Audio',
                icon: iconPath,
                command: 'audioDialog',
                group: 'audioGroup'
            });
            editor.contextMenu.addListener(function (element) {
                if (element) {
                    element = element.getAscendant('img', true);
                }
                if (element && !element.isReadOnly() && element.data('kaudio')) {
                    log("Found a video!", element);
                    return {
                        audioItem: CKEDITOR.TRISTATE_ON
                    };
                }
                return null;
            });
        }

        // These interfere with page themes, but might need to be put back somehow for editor layout
        // 
        editor.element.getDocument().appendStyleSheet(this.path + 'audioPlugin.css');
        editor.element.getDocument().appendStyleSheet('/static/common/plugin.css');

        $.getScriptOnce(('/static/js/jquery.jstree.js'));
        //$.getScriptOnce(('/static/js/jquery.hotkeys.js'));
        $.getScriptOnce(('/static/js/jquery.cookie.js'));

        $.getScriptOnce("/static/js/jquery-fileupload-9.5.2/js/jquery.iframe-transport.js");
        $.getScriptOnce("/static/js/jquery-fileupload-9.5.2/js/vendor/jquery.ui.widget.js");
        $.getScriptOnce("/static/js/jquery-fileupload-9.5.2/js/jquery.fileupload.js");



        var pagePath = toFolderPath(window.location.pathname);
        CKEDITOR.dialog.add('audioDialog', function (editor) {
            log("add to editor", editor);
            return {
                title: 'Insert/Edit Audio',
                minWidth: 900,
                minHeight: 480,
                contents: [
                    {
                        id: 'audio',
                        label: 'Insert/Edit Audio',
                        elements: [
                            {
                                type: 'html',
                                html: '<div class="row" style="width: 100%; max-width: 900px">'
                                + '  <div class="col-md-4">'
                                + '    <div id="myAudioTree" class="tree"></div>'
                                + '  </div>'
                                + '  <div class="col-md-8">'
                                + '    <div role="tabpanel">'
                                + '      <ul class="nav nav-tabs" role="tablist" id="imageTabs">'
                                + '        <li role="presentation" class="active"><a href="#upload" aria-controls="upload" role="tab" data-toggle="tab">Upload</a></li>'
                                + '        <li role="presentation"><a href="#preview" aria-controls="preview" role="tab" data-toggle="tab">Preview</a></li>'
                                + '      </ul>'
                                + '      <div class="tab-content">'
                                + '        <div role="tabpanel" class="tab-pane fade active in" id="upload">'
                                + '          <div class="myUploaded"></div>'
                                + '        </div>'
                                + '        <div role="tabpanel" class="tab-pane fade" id="preview">'
                                + '          <div id="myAudioPreview"></div>'
                                + '        </div>'
                                + '      </div>'
                                + '    </div>' // end tabpabel
                                + '  </div>' // end col-md-8
                                + '</div>', // end row
                                commit: function (data) {
                                    log("commit, data=", data);
                                }
                            }
                        ]
                    }
                ],
                onShow: function () {

                    var sel = editor.getSelection();
                    var element = sel.getStartElement();
                    log("onShow", sel, element, editor, editor.getData());
                    if (!element || element.getName() != 'img' || !element.data('kaudio') ) {
                        element = editor.document.createElement('img');
                        element.setAttribute('src',audioImage);
                        element.setAttribute('data-kaudio', url);
                        this.insertMode = true;
                    } else {
                        this.insertMode = false;
                        src = element.data("kaudio");
                        url = src;
                        log("update mode", url, src);
                    }
                    this.element = element;

                    this.setupContent(this.element);
                    if(!audioInitDone){
                        audioInitDone = true;
                        $("#myAudioTree").mtree({
                            basePath: pagePath,
                            pagePath: "",
                            excludedEndPaths: [".mil/"],
                            includeContentTypes: ["audio"],
                            onselectFolder: function (n) {
                                var selectedVideoUrl = $("#myAudioTree").mtree("getSelectedFolderUrl");
                                log("onselect: folder=", url);
                                $(".myUploaded").mupload("setUrl", selectedVideoUrl);
                            },
                            onselectFile: function (n, selectedVideoUrl) {
                                url = selectedVideoUrl;
                                log("selected file", n, url);
                                var container = document.getElementById('myAudioPreview');
                                container.innerHTML = '';
                                buildAudioPlayerPreview(url, container);
                            },
                            isInCkeditor: true
                        });
                        $(".myUploaded").mupload({
                            isInCkeditor: true,
                            buttonText: "Upload video",
                            useDropzone: true,
                            oncomplete: function (data, name, href) {
                                log("oncomplete", data);
                                $("#myAudioTree").mtree("addFile", name, href);
                                url = href;
                                var container = document.getElementById('myAudioPreview');
                                container.innerHTML = '';
                                buildAudioPlayerPreview(url, container);
                            }
                        });
                    }
                },
                onOk: function () {
                    var img = this.element;
                    var returnUrl = url;
                    if (returnUrl.startsWith("/")) {
                        returnUrl = returnUrl.substring(pagePath.length + 1); // convert to relative path
                    }
                    log("onOk", url, pagePath, "=", returnUrl);
                    img.setAttribute("data-kaudio", returnUrl)
                    if (this.insertMode) {
                        log("inserted", img);
                        editor.insertElement(img);
                    } else {
                        log('update element');
                        editor.updateElement();
                    }
                    this.commitContent(img);
                    log("commit content", img);
                },
                onHide: function(){
                    var audioPreview = $('#myAudioPreview').find('audio')[0];
                    if(audioPreview && typeof audioPreview.pause === 'function'){
                        audioPreview.pause();
                        audioPreview.currentTime = 0;
                    }
                }
            };
        });
    }
});
