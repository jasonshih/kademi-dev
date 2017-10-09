// Editor Skin
var editorSkin = "bootstrapck";

// Plugins
var standardExtraPlugins = "autogrow,embed_video,embed_audio,fuse-image,kcode,modal,bspanel,forms,bslayout2col,bslayout3col";
var standardRemovePlugins = "resize,image,save,newpage,preview,tliyoutube,image2,pbckcode,googledocs,language"

// Paths
var templatesPath = '/theme/js/editor-templates.js';
var stylesPath = "/theme/js/styles.js";

// ================================================================
// Toolbar sets
// ================================================================
var toolbarSets = {};
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

toolbarSets["Lite"] = [
    {name: 'links'},
    {name: 'others'},
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
];

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

$(function () {
    // https://github.com/Kademi/kademi-dev/issues/1397
    CKEDITOR.timestamp = '141020161';
});
