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
        /**
         * Function will be called when initializing a component with this type
         * @param {jQuery} contentArea
         * @param {jQuery} container
         * @param {jQuery} component
         * @param {Object} options
         */
        init: function (contentArea, container, component, options) {
            flog('init "video" component', component);

            this.component = component;
            var img = component.find('img[data-src]');
            if(!img.attr('id')){
                this.componentId = $.keditor.generateId('component-video');
                img.attr('id', this.componentId);
            }else{
                this.componentId = img.attr('id');
            }

            this.src = img.attr('data-src');
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

        /**
         * Function will be called for getting content of component from method of KEditor "target.keditor('getContent')"
         * @param {jQuery} component
         * @param {Object} options
         */
        getContent: function (component, options) {
            flog('getContent "video" component, component');

            var html = '<img id="'+this.componentId+'" src="/theme/apps/content/preview/audio.png" data-autostart="'+this.autostart+'" data-aspectratio="'+this.aspectratio+'" data-src="'+this.src+'" data-repeat="'+this.repeat+'" data-controls="'+this.controls+'" />';
            return html;
        },

        /**
         * Function will be called when deleting component
         * @param {jQuery} component
         * @param {Object} options
         */
        destroy: function (component, options) {

        },

        // Enable setting panel for this type or not
        settingEnabled: true,

        // Title of setting panel
        settingTitle: 'Video settings',

        /**
         * Initialize setting form of this type
         * @param {jQuery} form Form contains all setting of this type and is child of div[id="keditor-setting-forms"]
         * @param {Object} options
         */
        initSettingForm: function (form, options) {
            flog('init "video" settings', form);
            var self = this;
            form.append(
                '<form class="form-horizontal">' +
                    '<div class="form-group">' +
                        '<label for="videoFileInput" class="col-sm-12">Video file</label>' +
                        '<div class="col-sm-12">' +
                            '<div class="video-toolbar">'+
                                '<a href="#" class="btn-videoFileInput btn btn-sm btn-primary"><i class="fa fa-upload"></i></a>'+
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
                    //'<div class="form-group">' +
                    //    '<label for="video-width" class="col-sm-12">Width (px)</label>' +
                    //    '<div class="col-sm-12">' +
                    //    '<input type="number" id="video-width" min="320" max="1920" class="form-control" value="320" />' +
                    //    '</div>' +
                    //'</div>' +
                '</form>'
            );


        },

        /**
         * Show setting form for this type. This function will be called when user clicks on setting button of component when setting panel is hidden. You can fulfill form controls in this function.
         * @param {jQuery} form Form contains all setting of this type and is child of div[id="keditor-setting-forms"]
         * @param {jQuery} component Component will be applied setting
         * @param {Object} options
         */
        showSettingForm: function (form, component, options) {
            var instance = this;
            var btnVideoFileInput = form.find('.btn-videoFileInput');
            btnVideoFileInput.mselect({
                contentTypes: ['video'],
                bs3Modal: true,
                pagePath: window.location.pathname.replace('contenteditor',''),
                onSelectFile: function(url){
                    instance.src = url;
                    instance.refreshVideoPlayerPreview();
                }
            });

            var autoplayToggle = form.find('#video-autoplay');
            if(this.autostart){
                autoplayToggle.prop('checked', true);
            }
            autoplayToggle.on('click', function(e){
                instance.autostart = this.checked;
                instance.buildJWVideoPlayerPreview();
            });


            var loopToggle = form.find('#video-loop');
            if(this.repeat){
                loopToggle.prop('checked', true);
            }
            loopToggle.on('click', function(e){
                instance.repeat = this.checked;
                instance.buildJWVideoPlayerPreview();
            });

            var ratio = form.find('.video-ratio');
            ratio.find('[value='+this.aspectratio+']').prop('checked', true);
            ratio.on('click', function(e){
                if(this.checked){
                    instance.aspectratio = this.value;
                    instance.buildJWVideoPlayerPreview();
                }
            });

            var showcontrolsToggle = form.find('#video-showcontrols');
            if(this.controls){
                showcontrolsToggle.prop('checked', true);
            }
            showcontrolsToggle.on('click', function(e){
                instance.controls = this.checked;
                instance.buildJWVideoPlayerPreview();
            });

            //var videoWidth = form.find('#video-width');
            //videoWidth.on('change', function(){
            //});
        },

        /**
         * Hide setting form for this type. This function will be called when user clicks again on setting button of component when setting panel is showed. You can clear setting form in this function
         * @param {jQuery} form Form contains all setting of this type and is child of div[id="keditor-setting-forms"]
         */
        hideSettingForm: function (form) {

        },

        buildJWVideoPlayerPreview: function () {
            var src = this.src;
            var autostart = this.autostart;
            var repeat = this.repeat;
            var aspectratio = this.aspectratio;
            var controls = this.controls;
            var playerInstance = jwplayer(this.componentId);

            flog("buildJWPlayer", src, "size=", h, w);
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

        refreshVideoPlayerPreview: function(){
            var instance = this;
            var playerInstance = jwplayer(instance.componentId);
            var src = instance.src;
            playerInstance.load([{
                file: src
            }]);
            playerInstance.play();
        }
    };
})(jQuery);
