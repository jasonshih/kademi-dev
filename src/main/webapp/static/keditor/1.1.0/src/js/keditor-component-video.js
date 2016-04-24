/**
 * KEditor Video Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['video'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "video" component', component);

            this.component = component;
            var img = component.find('img[data-video-src]');
            if (!img.attr('id')) {
                this.componentId = keditor.generateId('component-video');
                img.attr('id', this.componentId);
            } else {
                this.componentId = img.attr('id');
            }

            if (!img.parent().hasClass('video-wrapper')) {
                img.wrap('<div class="video-wrapper"></div>');
            }
            this.src = img.attr('data-video-src');
            this.aspectratio = img.attr('data-aspectratio');
            this.repeat = img.attr('data-repeat') === 'true';
            this.controls = img.attr('data-controls') === 'true';
            this.autostart = img.attr('data-autostart') === 'true';
            var instance = this;
            $.getScript('/static/jwplayer/6.10/jwplayer.js', function () {
                jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                instance.buildJWVideoPlayerPreview();
            });
        },

        getContent: function (component, keditor) {
            flog('getContent "video" component, component');
            var posterHref = this.src + '/alt-640-360.png';
            var html = '<img id="' + this.componentId + '" class="video-jw" src="' + posterHref + '" data-autostart="' + this.autostart + '" data-aspectratio="' + this.aspectratio + '" data-video-src="' + this.src + '" data-repeat="' + this.repeat + '" data-controls="' + this.controls + '" />';
            return html;
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Video Settings',

        initSettingForm: function (form, keditor) {
            flog('init "video" settings', form);
            var self = this;
            form.append(
                '<form class="form-horizontal">' +
                '<div class="form-group">' +
                '<label for="videoFileInput" class="col-sm-12">Video file</label>' +
                '<div class="col-sm-12">' +
                '<div class="video-toolbar">' +
                '<a href="#" class="btn-videoFileInput btn btn-sm btn-primary"><i class="fa fa-upload"></i></a>' +
                '<input id="videoFileInput" type="file" style="display: none">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="video-autoplay" class="col-sm-12">Autoplay</label>' +
                '<div class="col-sm-12">' +
                '<input type="checkbox" id="video-autoplay" />' +
                '</div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="video-loop" class="col-sm-12">Repeat</label>' +
                '<div class="col-sm-12">' +
                '<input type="checkbox" id="video-loop" />' +
                '</div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="video-showcontrols" class="col-sm-12">Show Controls</label>' +
                '<div class="col-sm-12">' +
                '<input type="checkbox" id="video-showcontrols" checked />' +
                '</div>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="" class="col-sm-12">Ratio</label>' +
                '<div class="col-sm-12">' +
                '<input type="radio" name="video-radio" class="video-ratio" value="4:3" checked /> 4:3' +
                '</div>' +
                '<div class="col-sm-12">' +
                '<input type="radio" name="video-radio" class="video-ratio" value="16:9" /> 16:9' +
                '</div>' +
                '</div>' +
                '</form>'
            );
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "video" component', form, component);

            var instance = this;
            var btnVideoFileInput = form.find('.btn-videoFileInput');
            btnVideoFileInput.mselect({
                contentTypes: ['video'],
                bs3Modal: true,
                pagePath: window.location.pathname.replace('contenteditor', ''),
                onSelectFile: function (url) {
                    instance.src = url;
                    instance.refreshVideoPlayerPreview();
                }
            });

            var autoplayToggle = form.find('#video-autoplay');
            if (this.autostart) {
                autoplayToggle.prop('checked', true);
            }
            autoplayToggle.on('click', function (e) {
                instance.autostart = this.checked;
                instance.buildJWVideoPlayerPreview();
            });


            var loopToggle = form.find('#video-loop');
            if (this.repeat) {
                loopToggle.prop('checked', true);
            }
            loopToggle.on('click', function (e) {
                instance.repeat = this.checked;
                instance.buildJWVideoPlayerPreview();
            });

            var ratio = form.find('.video-ratio');
            form.find('.video-ratio[value="' + this.aspectratio + '"]').prop('checked', true);
            ratio.on('click', function (e) {
                if (this.checked) {
                    instance.aspectratio = this.value;
                    instance.buildJWVideoPlayerPreview();
                }
            });

            var showcontrolsToggle = form.find('#video-showcontrols');
            if (this.controls) {
                showcontrolsToggle.prop('checked', true);
            }
            showcontrolsToggle.on('click', function (e) {
                instance.controls = this.checked;
                instance.buildJWVideoPlayerPreview();
            });
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        },

        buildJWVideoPlayerPreview: function () {
            var src = this.src;
            var autostart = this.autostart;
            var repeat = this.repeat;
            var aspectratio = this.aspectratio;
            var controls = this.controls;
            var playerInstance = jwplayer(this.componentId);
            var posterHref = src + '/alt-640-360.png';

            flog("buildJWPlayer", src, "aspectratio=", aspectratio);
            playerInstance.setup({
                autostart: autostart,
                repeat: repeat,
                controls: controls,
                aspectratio: aspectratio,
                flashplayer: "/static/jwplayer/6.10/jwplayer.flash.swf",
                html5player: "/static/jwplayer/6.10/jwplayer.html5.js",
                width: "100%",
                androidhls: true, //enable hls on android 4.1+
                playlist: [{
                    image: posterHref,
                    sources: [{
                        file: src
                    }
                        , {
                            file: src + "/../alt-640-360.webm"
                        }, {
                            file: src + "/../alt-640-360.m4v"
                        }]
                }]
                , primary: "flash"
            });
            playerInstance.onReady(function () {
                flog('jwplayer preview init done');

            });
        },

        refreshVideoPlayerPreview: function () {
            var playerInstance = jwplayer(this.componentId);
            var src = this.src;
            playerInstance.load([{
                file: src
            }]);
            playerInstance.play();
        }
    };
})(jQuery);
