var editorSkin = "bootstrapck";

var toolbarSets = {};

var standardExtraPlugins = "autogrow,embed_video,embed_audio,fuse-image,modal,bspanel,forms,bslayout2col,bslayout3col";
var standardRemovePlugins = "resize,image,save,newpage,preview,tliyoutube,image2,pbckcode,googledocs,language"
var templatesPath = '/theme/editor-templates.js';
var stylesPath = "/theme/styles.js";

toolbarSets["Full"] = [
    {name: 'document', groups: ['mode', 'document', 'doctools']},
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
    {name: 'forms'},
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
    {name: 'links'},
    {name: 'insert'},
    {name: 'styles'},
    {name: 'colors'},
    {name: 'tools'},
    {name: 'layouts'},
    {name: 'about'}

//    {name: 'clipboard', groups: ['clipboard', 'undo']},
//    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
//    {name: 'links'},
//    {name: 'insert'},
//    {name: 'forms'},
//    {name: 'tools'},
//    {name: 'document', groups: ['mode', 'document', 'doctools']},
//    {name: 'others'},
//    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
//    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
//    {name: 'styles'}
];

toolbarSets["Balanced"] = [
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
    {name: 'links'},
    {name: 'insert'},
    {name: 'forms'},
    {name: 'tools'},
    {name: 'document', groups: ['mode', 'document', 'doctools']},
    //{name: 'others'},
    '/',
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
    {name: 'styles'},
    {name: 'layouts'}
];

//toolbarSets["Balanced"] = [
//    ['Paste', 'PasteText', 'PasteFromWord', '-', 'Print', 'SpellChecker'],
//    ['Undo', 'Redo', '-', 'Find', 'Replace'],
//    ['Bold', 'Italic', 'Underline', '-', 'Subscript', 'Superscript', 'RemoveFormat'],
//    ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
//    ['FontFormat', 'FontSize'],
//    ['Link', 'Image', 'Table', 'SpecialChar'] // No comma for the last row.
//
//];

toolbarSets["Default"] = [
    {name: 'document', groups: ['mode', 'document', 'doctools']},
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
    {name: 'links'},
    {name: 'insert'},
    {name: 'forms'},
    {name: 'tools'},
    {name: 'others'},
    //{name: 'colors'},
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
    {name: 'styles'},
    {name: 'layouts'},
];

//toolbarSets["Default"] = [
//    ['Source', '-'],
//    ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Print', 'SpellCheckerer'],
//    ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
//    ['Video', 'Image2', 'Table', 'Rule', 'SpecialChar', 'PageBreak'],
//    ['Bold', 'Italic', 'Underline', 'StrikeThrough', '-', 'Subscript', 'Superscript'],
//    ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
//    ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyFull'],
//    ['Link', 'Unlink', 'Anchor'],
//    ['Maximize', 'ShowBlocks', '-', 'Templates'], // No comma for the last row.
//    ['Styles', 'Format']
//];
//

toolbarSets["Lite"] = [
    {name: 'links'},
    {name: 'others'},
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
];

//toolbarSets["Lite"] = [
//    ['Bold', 'Italic', '-', 'Image', 'Link', 'Unlink']
//];

toolbarSets["BasicAndStyle"] = [
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
    {name: 'links'},
    {name: 'insert'},
    {name: 'forms'},
    {name: 'tools'},
    {name: 'document', groups: ['mode', 'document', 'doctools']},
    {name: 'others'},
    '/',
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
    {name: 'styles'},
    {name: 'colors'}
];

//toolbarSets["BasicAndStyle"] = [
//    ['FontFormat'],
//    '/',
//    ['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Image', 'Link', 'Unlink', '-', 'About']
//];

toolbarSets["Image"] = [
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
    {name: 'links'},
    {name: 'insert'},
    {name: 'forms'},
    {name: 'tools'},
    {name: 'document', groups: ['mode', 'document', 'doctools']},
    {name: 'others'},
    '/',
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
    {name: 'styles'},
    {name: 'colors'}
];


//toolbarSets["Image"] = [
//    ['Bold', 'Italic', '-', 'Link', 'Unlink', '-', 'Image', 'Flash']
//];

toolbarSets["Logo"] = [
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
    {name: 'links'},
    {name: 'insert'},
    {name: 'forms'},
    {name: 'tools'},
    {name: 'document', groups: ['mode', 'document', 'doctools']},
    {name: 'others'},
    '/',
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
    {name: 'styles'},
    {name: 'colors'}
];

//
//toolbarSets["Logo"] = [
//    ['Bold', 'Italic', '-', 'Image', '-', 'Source']
//];
$(function () {
    // https://github.com/Kademi/kademi-dev/issues/1397
    CKEDITOR.timestamp = '141020161';
})