!function ($) {

    "use strict"; // jshint ;_

    /* Imageupload PUBLIC CLASS DEFINITION
     * ================================= */

    var Imageupload = function (element, options) {
        this.$element = $(element);
        this.type = "image";

        this.$input = this.$element.find(':file');
        if (this.$input.length === 0)
            return;

        this.name = this.$input.attr('name') || options.name || this.$element.data('name');

        this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]');
        if (this.$hidden.length === 0) {
            this.$hidden = $('<input type="hidden" />');
            this.$element.prepend(this.$hidden);
        }

        this.$preview = this.$element.find('.imageupload-preview');
        var height = this.$preview.css('height');
        if (this.$preview.css('display') != 'inline' && height != '0px' && height != 'none')
            this.$preview.css('line-height', height);

        this.original = {
            'exists': this.$element.hasClass('imageupload-exists'),
            'preview': this.$preview.html(),
            'hiddenVal': this.$hidden.val()
        };

        this.$remove = this.$element.find('[data-dismiss="imageupload"]');

        this.$element.find('[data-trigger="imageupload"]').on('click.imageupload', $.proxy(this.trigger, this));

        this.listen();
    };

    Imageupload.prototype = {
        listen: function () {
            this.$input.on('change.imageupload', $.proxy(this.change, this));
            $(this.$input[0].form).on('reset.imageupload', $.proxy(this.reset, this));
            if (this.$remove)
                this.$remove.on('click.imageupload', $.proxy(this.clear, this));
        },
        change: function (e, invoked) {
            if (invoked === 'clear')
                return;

            var file = e.target.files !== undefined ? e.target.files[0] : (e.target.value ? {name: e.target.value.replace(/^.+\\/, '')} : null);

            if (!file) {
                this.clear();
                return;
            }

            this.$hidden.val('');
            this.$hidden.attr('name', '');
            this.$input.attr('name', this.name);

            if (this.type === "image" && this.$preview.length > 0 && (typeof file.type !== "undefined" ? file.type.match('image.*') : file.name.match(/\.(gif|png|jpe?g)$/i)) && typeof FileReader !== "undefined") {
                var preview = this.$preview;
                var element = this.$element;

                var formData = new FormData();

                formData.append(this.name, this.name);
                formData.append('file', file);
                formData.append('action', 'save');

                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    dataType: 'JSON',
                    data: formData,
                    beforeSend: function (xhr, options) {
                        options.data = formData;
                        if (formData.fake) {
                            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + formData.boundary);
                            xhr.send = function (data) {
                                xhr.sendAsBinary(data.toString());
                            }
                        }
                    },
                    success: function (resp) {
                        flog(resp);
                        if (resp.status) {
                            preview.html('<img src="' + resp.nextHref + '" ' + (preview.css('max-height') != 'none' ? 'style="max-height: ' + preview.css('max-height') + ';"' : '') + ' />')
                            element.addClass('imageupload-exists').removeClass('imageupload-new')
                        } else {

                        }
                    },
                    error: function (resp) {
                        flog(resp)
                    }
                });
            } else {
                this.$preview.text(file.name)
                this.$element.addClass('imageupload-exists').removeClass('imageupload-new')
            }
        },
        clear: function (e) {
            this.$hidden.val('')
            this.$hidden.attr('name', this.name)
            this.$input.attr('name', '')

            //ie8+ doesn't support changing the value of input with type=file so clone instead
            if (navigator.userAgent.match(/msie/i)) {
                var inputClone = this.$input.clone(true);
                this.$input.after(inputClone);
                this.$input.remove();
                this.$input = inputClone;
            } else {
                this.$input.val('');
            }

            this.$preview.html('');
            this.$element.addClass('imageupload-new').removeClass('imageupload-exists');

            if (e) {
                this.$input.trigger('change', ['clear']);
                e.preventDefault();
            }

            var formData = new FormData();

            formData.append(this.name, this.name);
            formData.append('action', 'remove');

            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                processData: false,
                contentType: false,
                dataType: 'JSON',
                data: formData,
                beforeSend: function (xhr, options) {
                    options.data = formData;
                    if (formData.fake) {
                        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + formData.boundary);
                        xhr.send = function (data) {
                            xhr.sendAsBinary(data.toString());
                        }
                    }
                },
                success: function (resp) {
                    flog(resp);
                    if (resp.status) {

                    } else {

                    }
                },
                error: function (resp) {
                    flog(resp)
                }
            });
        },
        reset: function (e) {
            this.clear();

            this.$hidden.val(this.original.hiddenVal);
            this.$preview.html(this.original.preview);

            if (this.original.exists)
                this.$element.addClass('imageupload-exists').removeClass('imageupload-new');
            else
                this.$element.addClass('imageupload-new').removeClass('imageupload-exists');
        },
        trigger: function (e) {
            this.$input.trigger('click');
            e.preventDefault();
        }
    };


    /* Imageupload PLUGIN DEFINITION
     * =========================== */

    $.fn.imageupload = function (options) {
        return this.each(function () {
            var $this = $(this)
                    , data = $this.data('imageupload');
            if (!data)
                $this.data('imageupload', (data = new Imageupload(this, options)));
            if (typeof options == 'string')
                data[options]();
        });
    };

    $.fn.imageupload.Constructor = Imageupload;


    /* Imageupload DATA-API
     * ================== */

    $(document).on('click.imageupload.data-api', '[data-provides="imageupload"]', function (e) {
        var $this = $(this);
        if ($this.data('imageupload'))
            return;
        $this.imageupload($this.data());

        var $target = $(e.target).closest('[data-dismiss="imageupload"],[data-trigger="imageupload"]');
        if ($target.length > 0) {
            $target.trigger('click.imageupload');
            e.preventDefault();
        }
    });

}(window.jQuery);