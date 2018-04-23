/* global formatter, Utils */

(function (g) {
    g.getClassNameForFileExtension = function (fileName, iconType) {
        var ext = Utils.safeString(fileName);
        if (ext.contains('.')) {
            ext = Utils.safeString(formatter.fileExt(ext)).toLowerCase();
        }

        if (Utils.isStringBlank(iconType)) {
            iconType = 'fa';
        }

        var icons = FILE_ICONS[iconType] || FILE_ICONS['fa'];

        var type = g.getClassNameForFileExtension.prototype.findType(ext);
        if (icons.hasOwnProperty(type)) {
            return icons[type];
        }

        return icons.file;
    };

    g.getClassNameForFileExtension.prototype.TYPES = {};
    g.getClassNameForFileExtension.prototype.TYPES.IMAGE = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    g.getClassNameForFileExtension.prototype.TYPES.PDF = ['pdf'];
    g.getClassNameForFileExtension.prototype.TYPES.WORD = ['doc', 'docx'];
    g.getClassNameForFileExtension.prototype.TYPES.POWERPOINT = ['ppt', 'pptx'];
    g.getClassNameForFileExtension.prototype.TYPES.EXCEL = ['xls', 'xlsx'];
    g.getClassNameForFileExtension.prototype.TYPES.AUDIO = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma'];
    g.getClassNameForFileExtension.prototype.TYPES.VIDEO = ['avi', 'flv', 'mkv', 'mp4', 'ogv'];
    g.getClassNameForFileExtension.prototype.TYPES.ARCHIVE = ['zip', 'tar', 'gz', 'rar', '7z'];
    g.getClassNameForFileExtension.prototype.TYPES.CODE = ['json', 'xml', 'js', 'css', 'html'];
    g.getClassNameForFileExtension.prototype.TYPES.TEXT = ['txt', 'log', 'csv'];

    g.getClassNameForFileExtension.prototype.findType = function (ext) {
        for (var i in this.TYPES) {
            var typeName = i;
            var values = this.TYPES[i];

            if (values.indexOf(ext) > -1) {
                return typeName.toLowerCase();
            }
        }

        return 'file';
    };

    var FILE_ICONS = FILE_ICONS || {};

    FILE_ICONS['fa'] = {
        image: 'fa-file-image-o',
        pdf: 'fa-file-pdf-o',
        word: 'fa-file-word-o',
        powerpoint: 'fa-file-powerpoint-o',
        excel: 'fa-file-excel-o',
        audio: 'fa-file-audio-o',
        video: 'fa-file-video-o',
        archive: 'fa-file-archive-o',
        code: 'fa-file-code-o',
        text: 'fa-file-text-o',
        file: 'fa-file-o'
    };
})(this);