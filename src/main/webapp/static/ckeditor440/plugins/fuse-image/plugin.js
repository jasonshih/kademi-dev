var initialSelect;
var mtype = '';
var url = '';
var hash = '';
var src = '';
var selObj;
var imageInitDone = false;
var baseHashUrl = "http://" + window.location.host + "/_hashes/files/";

CKEDITOR.plugins.add('fuse-image',
        {
            init: function (editor) {
                //log("init image2");
                var iconPath = this.path + 'images/icon.png';
                var jsPath = this.path + "video/javascript";
                var basePath = this.path;

                editor.addCommand('imageDialog', new CKEDITOR.dialogCommand('imageDialog'));

                editor.ui.addButton('fuse-image', {
                    label: 'Browse and upload images',
                    command: 'imageDialog',
                    toolbar: 'insert,1',
                    icon: iconPath
                });
                //log("done button", iconPath);

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
                        if (element && !element.isReadOnly() && !element.data('cke-realelement'))
                            return {
                                imageItem: CKEDITOR.TRISTATE_ON
                            };
                        return null;
                    });
                }

                // These interfere with page themes, but might need to be put back somehow for editor layout
                //
                editor.element.getDocument().appendStyleSheet(this.path + 'imagePlugin.css');
                editor.element.getDocument().appendStyleSheet('/static/common/plugin.css');

                $.getScriptOnce(('/static/js/jquery.jstree.js'));
                $.getScriptOnce(('/static/js/jquery.hotkeys.js'));
                $.getScriptOnce(('/static/js/jquery.cookie.js'));
                $.getScriptOnce(('/static/js/jquery.iframe-transport.js'));
                $.getScriptOnce(('/static/js/canvas-to-blob.js'));
                $.getScriptOnce("/static/js/jquery-fileupload-9.5.2/js/jquery.fileupload.js");
                //$.getScriptOnce(('/static/js/jquery.fileupload.js'));

                $.getScriptOnce(('/static/js/jquery.milton-tree.js'));
                $.getScriptOnce(('/static/milton-upload/1.0.1/jquery.milton-upload.js'));

                var pagePath = toFolderPath(window.location.pathname);
                CKEDITOR.dialog.add('imageDialog', function (editor) {
                    log("add to editor", editor);
                    return {
                        title: 'Insert/Edit Image',
                        minWidth: 900,
                        minHeight: 480,
                        autoUpdateElement: true,
                        contents: [
                            {
                                id: 'fuse-image',
                                label: 'Insert/Edit Imagae',
                                elements: [
                                    {
                                        type: 'html',
                                        html: "<div id='imageTree' class='tree'></div><div id='imagePreview'><div id='imageUploaded'></div><div class='imageEditor'><div id='imageContainer'></div></div></div>",
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
                            $("#imageTree.tree").mtree("refreshSelected");
                            log("onShow", sel, element, editor, editor.getData());
                            if (element) {
                                element = element.getAscendant('img', true);
                                log("onShow2", element);
                            }

                            if (!element || element.getName() != 'img' || element.data('cke-realelement')) {
                                element = editor.document.createElement('img');
                                this.insertMode = true;
                                src = "";
                                url = "";
                                hash = "";
                            } else {
                                this.insertMode = false;
                                var p = getPathFromHref(window.location.href);
                                p = toFolderPath(p);
                                initialSelect = p;
                                mtype = element.getAttribute("mtype");
                                src = element.getAttribute("src");
                                url = src;
                                hash = element.getAttribute("data-hash");
                                if (!hash || hash === "") {
                                    hash = '';
                                }
                                flog(element);
                                log("update mode", initialSelect, url, mtype, src, hash);
                            }

                            this.element = element;

                            this.setupContent(this.element);

                            var imgInContent = this.element;

                            var imageEditor = $(".imageEditor");
                            var imageCont = imageEditor.find("#imageContainer");
                            var previewImg = $("#imageContainer img");
                            if (previewImg.length == 0) {
                                previewImg = $("<img/>");
                                imageCont.prepend(previewImg);
                                //imageCont.append(loremIpsum()); 
                            }

                            var imageFloat = $("#imageUploaded").siblings("#imageFloat");
                            if (imageFloat.length == 0) {
                                imageFloat = $("<select id='imageFloat'><option value=''>No alignment/float</option><option value='Left'>Align Left</option><option value='Right'>Align Right</option></select>");
                                imageFloat.click(function () {
                                    previewImg.removeAttr("align");
                                    var val = imageFloat.val();
                                    if (val) {
                                        previewImg.attr("align", val);
                                        flog("set align", previewImg, val)
                                    }
                                });
                                $("#imageUploaded").before(imageFloat);

                                imageFloat.before(
                                        '<div id="image-size">' +
                                        'Width: <input type="text" id="image-width" value="" /> ' +
                                        'Height: <input type="text" id="image-height" value="" />' +
                                        '</div>'
                                        );

                                $('#image-width').on('change', function () {
                                    var input = $(this);
                                    var ratio = +input.attr('data-ratio');
                                    var img = imageCont.find("img");
                                    var currentUrl = img.attr('src');
                                    var currentHash = img.attr('data-hash');

                                    if (currentUrl) {
                                        var newWidth = +input.val();
                                        var newHeight = newWidth / ratio;

                                        flog(newWidth, newHeight);

                                        setImage(img, currentUrl, currentHash, newWidth, newHeight, true);
                                    }
                                });

                                $('#image-height').on('change', function () {
                                    var input = $(this);
                                    var ratio = +input.attr('data-ratio');
                                    var img = imageCont.find("img");
                                    var currentUrl = img.attr('src');
                                    var currentHash = img.attr('data-hash');

                                    if (currentUrl) {
                                        var newHeight = +input.val();
                                        var newWidth = newHeight * ratio;

                                        flog(newWidth, newHeight);

                                        setImage(img, currentUrl, currentHash, newWidth, newHeight, true);
                                    }
                                });
                            }

                            setImage(previewImg, src, hash, imgInContent.getAttribute('width'), imgInContent.getAttribute('height'));

                            if (!imageInitDone) {
                                flog("init not done, lets do it");
                                imageInitDone = true;

                                $("#imageTree").mtree({
                                    basePath: pagePath,
                                    pagePath: "",
                                    excludedEndPaths: [".mil/"],
                                    includeContentTypes: ["image"],
                                    onselectFolder: function (n) {
                                        var selectedVideoUrl = $("#imageTree").mtree("getSelectedFolderUrl");
                                        flog("onselect: folder=", url);
                                        $("#imageUploaded").mupload("setUrl", selectedVideoUrl);
                                    },
                                    onselectFile: function (n, selectedVideoUrl, h) {
                                        url = selectedVideoUrl;
                                        hash = h;
                                        flog("selected file1", n, url, h);

                                        var img = imageCont.find("img");

                                        setImage(img, url, h, false, false);
                                        log("done set img", img);
                                    },
                                    isInCkeditor: true
                                });
                                $("#imageUploaded").mupload({
                                    isInCkeditor: true,
                                    buttonText: "Upload image",
                                    useDropzone: true,
                                    oncomplete: function (data, name, href) {
                                        hash = "";
                                        url = "";
                                        getHashFromUrl(href);
                                        flog("oncomplete", data, hash);
                                        $("#imageTree.tree").mtree("refreshSelected");
                                        url = href;
                                    }
                                });

                                initLoadingOverlay();

                                $('.milton-tree-toolbar').append(
                                        '<a class="btn-import-image cke_dialog_ui_button cke_dialog_ui_button_ok" title="Import image from web">' +
                                        '<span class="cke_dialog_ui_button"><i class="fa fa-sign-in"></i></span>' +
                                        '</a>'
                                        ).find('.btn-import-image').click(function (e) {
                                    e.preventDefault();

                                    var importUrl = prompt('Please enter image url you want to import:');
                                    var fileExtension = importUrl.substr(importUrl.length - 3, 3);
                                    var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                                    var allowedExtensions = '|jpg|gif|png|';

                                    if (importUrl) {
                                        hash = "";
                                        url = importUrl;
                                        if (urlRegex.test(importUrl) && allowedExtensions.indexOf('|' + fileExtension + '|') !== -1) {
                                            var img = imageCont.find("img");
                                            setImage(img, importUrl);
                                            log("done set img", img);
                                        } else {
                                            alert('Your url is invalid!');
                                        }
                                    }
                                });
                            }
                        },
                        onOk: function () {
                            var dialog = this;
                            var img = this.element;
                            var returnUrl = url;
                            if (returnUrl.startsWith("/")) {
                                returnUrl = returnUrl.substring(pagePath.length + 1); // convert to relative path
                            }
                            flog("onOk", url, pagePath, "=", returnUrl, "hash=", hash);
                            if (hash !== "" && useHash === "true") {
                                flog("Using Hash=", hash);
                                img.setAttribute("src", baseHashUrl + hash);
                            } else {
                                img.setAttribute("src", returnUrl);
                            }
                            var imageEditor = $(".imageEditor");
                            var previewImage = imageEditor.find("#imageContainer img");
                            var imageAlign = previewImage.attr("align");
                            if (imageAlign) {
                                img.setAttribute("align", imageAlign);
                            } else {
                                img.setAttribute("align", "");
                            }

                            img.setAttribute('width', previewImage.width());
                            img.setAttribute('height', previewImage.height());
                            img.setAttribute('data-hash', previewImage.attr("data-hash"));
                            img.setAttribute("data-filename", previewImage.attr("data-filename"));

                            if (this.insertMode) {
                                flog("insert mode", this.insertMode, img);
                                img.addClass("img-responsive"); // defaul to responsive for sizing 
                                editor.insertElement(img);
                            } else {
                                flog("update mode", this.insertMode, img);
                                editor.updateElement();
                            }
                            this.commitContent(img);
                            flog("commit content", img);
                        },
                        onHide: function () {
                            mtype = '';
                            url = '';
                            hash = '';
                            src = '';
                        }
                    };
                });
            }
        });

function setImage(img, src, hash, width, height, keepRatio) {
    flog("setImage", img, src, hash, width, height, keepRatio);
    var tempImg = document.createElement('img');
    tempImg.src = src;
    try {
        img.resizable("destroy");
    } catch (e) {
    }

    img.attr('style', '');

    tempImg.onload = function () {
        img.attr("data-filename", src)
        img.attr("data-hash", hash);
        flog(hash, !(hash === "undefined"), useHash);
        if (hash && !(hash === "undefined") && useHash === "true") {
            flog("Using Hash=", hash);
            img.attr("src", baseHashUrl + hash);
        } else {
            img.attr("src", src);
        }

        if (width && height) {
            img.css({
                width: width,
                height: height
            });
        }

        var originalWidth = img.width();
        var originalHeight = img.height();

        if (!keepRatio) {
            var ratio = originalWidth / originalHeight;
            $('#image-width').attr('data-ratio', ratio);
            $('#image-height').attr('data-ratio', ratio);
        }

        $('#image-width').val(originalWidth).attr({
            'data-width': originalWidth
        });
        $('#image-height').val(originalHeight).attr({
            'data-height': originalHeight
        });

        setTimeout(function () {
            img.resizable({
                aspectRatio: true,
                maxWidth: 1000,
                maxHeight: 1000,
                stop: function () {
                    $('#image-width').val(img.width());
                    $('#image-height').val(img.height());
                }
            });
        }, 0);
    };
}

/**
 * Just returns arbitrary text as paragraphs
 */
function loremIpsum() {
    var string =
            "<p>" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis fermentum libero, laoreet sodales enim sagittis at. In in dui a purus pharetra semper. Sed tincidunt varius lorem quis iaculis. Fusce placerat tellus eget mauris ultricies bibendum vestibulum diam lobortis. Donec in lacus ante, ac euismod lacus. Donec nibh sem, vehicula non eleifend non, posuere et enim. Curabitur venenatis eros in orci semper vehicula. Morbi venenatis lectus at tellus mollis quis porttitor purus vehicula." +
            "</p>" +
            "<p>" +
            "Vivamus nibh elit, convallis vitae iaculis a, iaculis nec libero. Nulla diam lacus, ornare sed semper ac, faucibus eget neque. Sed ultricies erat vestibulum tortor bibendum iaculis. Sed consectetur nisl eu leo pharetra euismod. Pellentesque sed metus ligula. Vestibulum vel enim erat. Donec felis neque, gravida laoreet lacinia at, fringilla nec erat." +
            "</p>";

    return string;
}

function getHashFromUrl(Url){
    var t = "/_DAV/PROPFIND?fields=milton:hash";
    $.ajax({
        url:  Url + t,
        cache: false
    }).done(function(data){
        var hash = data[0].hash;
        flog(hash);
    });
}