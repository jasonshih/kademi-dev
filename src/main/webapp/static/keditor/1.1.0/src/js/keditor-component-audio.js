/**
 * KEditor Audio Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['audio'] = {
        /**
         * Function will be called when initializing a component with this type
         * @param {jQuery} contentArea
         * @param {jQuery} container
         * @param {jQuery} component
         * @param {Object} options
         */
        init: function (contentArea, container, component, options) {
            flog('init "audio" component', component);
            this.component = component;
            var img = component.find('img[data-src]');
            if(!img.attr('id')){
                this.componentId = $.keditor.generateId('component-audio');
                img.attr('id', this.componentId);
            }else{
                this.componentId = img.attr('id');
            }
            if(!img.parent().hasClass('audio-wrapper')){
                img.wrap('<div class="audio-wrapper"></div>');
            }
            this.src = img.attr('data-src');
            this.width = img.attr('data-width');
            this.autostart = img.attr('data-autostart')==='true';
            var instance = this;
            $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                instance.buildJWAudioPlayerPreview();
            });

        },

        /**
         * Function will be called for getting content of component from method of KEditor "target.keditor('getContent')"
         * @param {jQuery} component
         * @param {Object} options
         */
        getContent: function (component, options) {
            flog('getContent "audio" component, component');

            var html = '<img data-componentId="'+this.componentId+'" src="/theme/apps/content/preview/audio.png" data-autostart="'+this.autostart+'" data-width="'+this.width+'" data-src="'+this.src+'" data-kaudio="'+this.src+'" />';
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
        settingTitle: 'Audio settings',

        /**
         * Initialize setting form of this type
         * @param {jQuery} form Form contains all setting of this type and is child of div[id="keditor-setting-forms"]
         * @param {Object} options
         */
        initSettingForm: function (form, options) {
            flog('init "audio" settings', form);
            form.append(
                '<form class="form-horizontal">' +
                    '<div class="form-group">' +
                        '<label for="audioFileInput" class="col-sm-12">Audio file</label>' +
                        '<div class="col-sm-12">' +
                            '<div class="audio-toolbar">'+
                                '<a href="#" class="btn-audioFileInput btn btn-sm btn-primary"><i class="fa fa-upload"></i></a>'+
                                '<input id="audioFileInput" type="file" style="display: none">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="audio-autoplay" class="col-sm-12">Autoplay</label>' +
                        '<div class="col-sm-12">' +
                            '<input type="checkbox" id="audio-autoplay" />' +
                        '</div>' +
                    '</div>' +
                    //'<div class="form-group">' +
                    //    '<label for="audio-showcontrols" class="col-sm-12">Show Controls</label>' +
                    //    '<div class="col-sm-12">' +
                    //    '<input type="checkbox" id="audio-showcontrols" checked />' +
                    //    '</div>' +
                    //'</div>' +
                    '<div class="form-group">' +
                        '<label for="audio-width" class="col-sm-12">Width (px)</label>' +
                        '<div class="col-sm-12">' +
                        '<input type="number" id="audio-width" min="200" max="500" class="form-control" value="300" />' +
                        '</div>' +
                    '</div>' +
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
            var btnAudioFileInput = form.find('.btn-audioFileInput');
            btnAudioFileInput.mselect({
                contentTypes: ['audio'],
                bs3Modal: true,
                pagePath: window.location.pathname.replace('contenteditor',''),
                onSelectFile: function(url){
                    instance.src = url;
                    instance.refreshAudioPlayerPreview();
                }
            });

            var autoplayToggle = form.find('#audio-autoplay');
            if(this.autostart){
                autoplayToggle.prop('checked', true);
            }
            autoplayToggle.on('click', function(e){
                instance.autostart = this.checked;
                instance.buildJWAudioPlayerPreview();
            });

            //var showcontrolsToggle = form.find('#audio-showcontrols');
            //showcontrolsToggle.on('click', function(e){
            //});

            var audioWidth = form.find('#audio-width');
            audioWidth.val(this.width);
            audioWidth.on('change', function(){
                instance.width = this.value;
                instance.resizeAudioPlayerPreview();
            });
        },

        /**
         * Hide setting form for this type. This function will be called when user clicks again on setting button of component when setting panel is showed. You can clear setting form in this function
         * @param {jQuery} form Form contains all setting of this type and is child of div[id="keditor-setting-forms"]
         */
        hideSettingForm: function (form) {

        },


        buildJWAudioPlayerPreview: function () {
            var width = this.width;
            var src = this.src;
            var autostart = this.autostart;
            var playerInstance = jwplayer(this.componentId);
            playerInstance.setup({
                file: src,
                width: width,
                height: 30,
                autostart: autostart,
                flashplayer: "/static/jwplayer/6.10/jwplayer.flash.swf",
                html5player: "/static/jwplayer/6.10/jwplayer.html5.js",
                primary: "flash"
            });
            playerInstance.onReady(function () {
                log('jwplayer preview init done');
            });
        },

        refreshAudioPlayerPreview: function(){
            var instance = this;
            var playerInstance = jwplayer(instance.componentId);
            var src = instance.src;
            playerInstance.load([{
                file: src
            }]);
            playerInstance.play();
        },

        resizeAudioPlayerPreview: function(){
            var instance = this;
            var playerInstance = jwplayer(instance.componentId);
            var width = instance.width;

            playerInstance.resize(width,30);
        }
    };

})(jQuery);
