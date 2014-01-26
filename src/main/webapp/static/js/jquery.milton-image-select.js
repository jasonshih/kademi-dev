(function ($) {

	var methods = {
		init: function (options) {
			var input = this;

			var config = $.extend({
				btnClass: 'btn btn-success',
				btnOkClass: 'btn btn-primary',
				modalTitle: 'Select file',
				contentTypes: ['image'],
				excludedEndPaths: ['.mil/'],
				basePath: '/',
				pagePath: window.location.pathname,
				showModal: function (div) {
					div.modal('show');
				},
				onSelectFile: function (selectedUrl) {
				}
			}, options);

			log('init milton-file-select', config, input);
			var btn = $('<button type="button" class="' + config.btnClass + '">Select file</button>');

			input.wrap('<div class="input-group"></div>').attr('readonly', true);

			var wrapper = input.parent();

			wrapper.append('<span class="input-group-btn"></span>');

			btn.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				modal = getModal(config);
				config.showModal(modal);
			});

			wrapper.find('span.input-group-btn').append(btn);
		},
		setUrl: function (url) {
		}
	};

	function getModal(config) {
		var modal = $('#modal-milton-file-select');
		if (modal.length === 0) {
			$('body').append(
				'<div id="modal-milton-file-select" class="modal modal-md fade" aria-hidden="true" tabindex="-1">' +
					'<div class="modal-header">' +
						'<button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
						'<h4 class="modal-title">' + config.modalTitle + '</h4>' +
					'</div>' +
					'<div class="modal-body">' +
						'<div class="milton-image-select-container">' +
							'<div class="row">' +
								'<div class="col-md-4"><div class="milton-tree-wrapper"></div></div>' +
								'<div class="col-md-8">' +
									'<div id="milton-btn-upload-img" class="btn btn-success btn-upload"></div>' +
									'<div class="milton-image-preview"><img /></div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="modal-footer">' +
						'<button class="' + config.btnOkClass + ' btn-ok" type="button">Ok</button>' +
					'</div>' +
				'</div>'
			);
			modal = $('#modal-milton-file-select');

			var tree = modal.find('div.milton-tree-wrapper');
			var previewImg = modal.find('.milton-image-preview img');

			tree.mtree({
				basePath: config.basePath,
				pagePath: config.pagePath,
				excludedEndPaths: config.excludedEndPaths,
				includeContentTypes: config.contentTypes,
				onselectFolder: function (n) {
				},
				onselectFile: function (n, selectedUrl) {
					previewImg.attr('src', selectedUrl);
				}
			});

			$('#milton-btn-upload-img').mupload({
				buttonText: 'Upload image',
				oncomplete: function (data, name, href) {
					log('oncomplete', data);
					tree.mtree('addFile', name, href);
					url = href;
				}
			});

			modal.find('.btn-ok').click(function () {
				var url = previewImg.attr('src');
				var relUrl = url.substring(config.basePath.length, url.length);
				log('selected', url, relUrl);
				config.onSelectFile(relUrl);
				modal.modal('hide');
			});
		}

		return modal;
	}

	$.fn.mselect = function (method) {
		log('mselect', this);
		if (methods[method]) {
			return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " + method + " does not exist on jQuery.tooltip");
		}
	};
})(jQuery);
