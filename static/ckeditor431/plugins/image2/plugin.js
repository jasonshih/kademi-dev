var initialSelect;
var mtype = '';
var url = '';
var src = '';
var selObj;
var imageInitDone = false;

CKEDITOR.plugins.add('image2',
    {
        init: function (editor) {
            //log("init image2");
            var iconPath = this.path + 'images/icon.png';
            var jsPath = this.path + "video/javascript";
            var basePath = this.path;

            editor.addCommand('imageDialog', new CKEDITOR.dialogCommand('imageDialog'));

            editor.ui.addButton('Image2', {
                label: 'Insert Image',
                command: 'imageDialog',
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
            $.getScriptOnce(('/static/js/jquery.fileupload.js'));

            $.getScriptOnce(('/static/js/jquery.milton-tree.js'));
            $.getScriptOnce(('/static/js/jquery.milton-upload.js'));

            var pagePath = toFolderPath(window.location.pathname);
            CKEDITOR.dialog.add('imageDialog', function (editor) {
                log("add to editor", editor);
                return {
                    title: 'Insert/Edit Image',
                    minWidth: 900,
                    minHeight: 480,
                    contents: [
                        {
                            id: 'image2',
                            label: 'Insert/Edit Image',
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
                        } else {
                            this.insertMode = false;
                            var p = getPathFromHref(window.location.href);
                            p = toFolderPath(p);
                            initialSelect = p;
                            mtype = element.getAttribute("mtype");
                            src = element.getAttribute("src");
                            url = src;
                            log("update mode", initialSelect, url, mtype, src);
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
                            imageCont.append(loremIpsum());
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
                        }

                        console.log(imgInContent.getAttribute('width'));
                        setImage(previewImg, src, imgInContent.getAttribute('width'), imgInContent.getAttribute('height'));

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
                                onselectFile: function (n, selectedVideoUrl) {
                                    url = selectedVideoUrl;
                                    log("selected file1", n, url);

                                    var img = imageCont.find("img");

                                    setImage(img, url);
                                    log("done set img", img);
                                }
                            });
                            $("#imageUploaded").mupload({
                                isInCkeditor: true,
                                buttonText: "Upload image",
                                useDropzone: true,
                                oncomplete: function (data, name, href) {
                                    flog("oncomplete", data);
                                    $("#imageTree").mtree("addFile", name, href);
                                    url = href;
                                }
                            });
                        }
                    },
                    onOk: function () {
                        var dialog = this,
                            img = this.element;
                        var returnUrl = url;
                        if (returnUrl.startsWith("/")) {
                            returnUrl = returnUrl.substring(pagePath.length + 1); // convert to relative path
                        }
                        log("onOk", url, pagePath, "=", returnUrl);
                        img.setAttribute("src", returnUrl);
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

                        if (this.insertMode) {
                            log("insert mode", this.insertMode, img);
                            editor.insertElement(img);
                        } else {
                            log("update mode", this.insertMode, img);
                            editor.updateElement();
                        }
                        this.commitContent(img);
                        log("commit content", img);
                    }
                };
            });
        }
    });

function setImage(img, src, width, height) {
    var tempImg = document.createElement('img');
    tempImg.src = src;
    try {
        img.resizable( "destroy" );
    } catch (e) {}

    img.attr('style', '');

    tempImg.onload = function () {
        img.attr("src", src);

        if (width && height) {
            img.css({
                width: width,
                height: height
            });
        }

        setTimeout(function () {
            img.resizable({
                aspectRatio: true,
                maxWidth: 1000,
                maxHeight: 1000
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