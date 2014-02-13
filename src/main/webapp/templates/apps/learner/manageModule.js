function initManageModule(baseHref, themePath) {
	window.request_url = function () {
		var str = "";
		var p = getSelectedProgram();
		if(p) {
			str += p.name + "/";
		}
		if(selectedCourse) {
			str += selectedCourse.name + "/"; // TODO: branches
		}
		log("str", str);
		var s = baseHref + "/" + str + "_DAV/PROPFIND?fields=href,name,milton:title,iscollection&where=iscollection";
		log("request_url", s);
		return s;
	};

	initCssForEditor(themePath);
	initDropdownMix();
	initThumbnail();
	initCRUDModulePages();
	initModuleList();
	initPublishingMenu('manageModules');
	initAddQuizModal();
	initFormDetails();
	initQuizBuilder();

	window.onbeforeunload = isModalOpen;
}

function initCssForEditor(themePath) {
	var cssPath = evaluateRelativePath(window.location.pathname, '../../../../../theme/theme-params.less');
	cssPath += ',' + themePath + 'theme.less,/static/common/contentStyles.less';
	cssPath = cssPath.replaceAll('/', '--');
	cssPath = '/' + cssPath + '.compile.less';

	log('push theme css file for editor', cssPath);
	themeCssFiles.push(cssPath);
	themeCssFiles.push('/static/prettify/prettify.css');
}

function initThumbnail() {
	var pagePath = '';
	var basePath = window.location.pathname;

	log('init thumbnail-image selector', basePath, pagePath);
	var thumbSel = $('input.thumbnail-image');
	thumbSel.mselect({
		basePath: basePath,
		pagePath: pagePath,
		onSelectFile: function (selectedUrl) {
			// selectedUrl is absolute, need relative to module
			log('selectedUrl', selectedUrl, this);
			thumbSel.val(selectedUrl);
		}
	});
}

function getSelectedProgram() {
	var a = $('#programs-wrapper').find('.active');
	log('getSelectedProgram', a);
	if (a.length === 0) {
		return null;
	} else {
		return {
			name: a.html()
		};
	}
}

function getSelectedCourse() {
	var a = $('#courses-wrapper').find('.active');
	log('getSelectedCourse', a);
	if (a.length === 0) {
		return null;
	} else {
		return {
			name: a.html()
		};
	}
}

function getSelectedModule() {
	var a = $('#modules-wrapper').find('.active');
	log('getSelectedModule', a);
	if (a.length === 0) {
		return null;
	} else {
		return {
			name: a.html()
		};
	}
}

function uploadCurrentModule(mixWrapper) {
	var str = getSelectedProgram().name;
	var c = getSelectedCourse();
	if (c) {
		str += ' / ' + c.name;
	}
	var m = getSelectedModule();
	if (m) {
		str += ' / ' + m.name;
	}
	mixWrapper.find('span.current-module').html(str);
}

function propfindHref(href) {
	return href + '_DAV/PROPFIND?fields=href,name,milton:title,iscollection&where=iscollection';
}

function initDropdownMix() {
	log('initDropDown');

	var mixWrapper = $('.program-course-module-mix');
	var dropdown = mixWrapper.find('.dropdown-menu');
	var mainContent = $('.main-content').children('.container');
	var btnShowMix = $('.btn-show-mix');

	var adjustDropdownWidth = function () {
		dropdown.css('width', mainContent.width());
	};

	adjustDropdownWidth();

	Bob.onPageResized(function () {
		adjustDropdownWidth();
	});

	Bob.onPageClicked(function (e, $target) {
		if (!$target.is(btnShowMix) && !$target.parents().is(btnShowMix) && !$target.parents().is(dropdown)) {
			mixWrapper.removeClass('open');
		}
	});

	btnShowMix.on('click', function (e) {
		e.preventDefault();

		mixWrapper[mixWrapper.hasClass('open') ? 'removeClass' : 'addClass']('open');
	});

	var programsList = $('#programs-wrapper').find('.programs-list');
	var coursesList = $('#courses-wrapper').find('.courses-list');
	var modulesList = $('#modules-wrapper').find('.modules-list');

	// Add event for item of Program list
	programsList.on('click', 'a', function (e) {
		e.preventDefault();

		var a = $(this);
		log('program click', a);

		if (!a.hasClass('active')) {
			a.siblings('.active').removeClass('active');
			a.addClass('active');

			modulesList.html('');
			coursesList.html('').addClass('loading');

			uploadCurrentModule(mixWrapper);

			var url = propfindHref(a.attr('href'));
			$.getJSON(url, function (data) {
				var courseStr = '';

				for (var i = 1; i < data.length; i++) {
					var name = data[i]['name'];
					if (!name.startsWith('.')) {
						courseStr += '<a class="course" href="' + data[i]['href'] + '">' + data[i]['title'] + '</a>';
					}
				}

				coursesList.append(courseStr).removeClass('loading');
			});
		}
	});

	// Add event for item of Course list
	coursesList.on('click', 'a', function (e) {
		e.preventDefault();

		var a = $(this);

		if (!a.hasClass('active')) {
			a.siblings('.active').removeClass('active');
			a.addClass('active');

			modulesList.html('').addClass('loading');

			uploadCurrentModule(mixWrapper);

			var url = propfindHref(a.attr('href'));
			$.getJSON(url, function (data) {
				var moduleStr = '';
				for (var i = 1; i < data.length; i++) {
					log('module', data[i]);
					var name = data[i]['name'];
					if (!name.startsWith('.')) {
						moduleStr +='<a class="module" href="' + data[i]['href'] + '">' + data[i]['title'] + '</a>';
					}
				}

				modulesList.append(moduleStr).removeClass('loading');
			});
		}
	});

	// Add event for item of Module list
	modulesList.on('click', 'a', function (e) {
		var a = $(this);

		if (!a.hasClass('active')) {
			a.siblings('.active').removeClass('active');
			a.addClass('active');

			mixWrapper.removeClass('open');
			uploadCurrentModule(mixWrapper);
		} else {
			e.preventDefault();
		}
	});
}

function initCRUDModulePages() {
	var modal = $('#modal-add-page');
	var form = modal.find('form');

	initFuseModal(modal, function () {
		modal.find('.modal-body').css('height', getStandardModalEditorHeight());
		initHtmlEditors(modal.find('.htmleditor'), getStandardEditorHeight(), null, null, standardRemovePlugins + ',autogrow'); // disable autogrow
	});

	$('.btn-add-page').click(function (e) {
		e.preventDefault();
		log('initAddPageModal: click');

		modal.find('input[type=text], textarea,input[name=pageName]').val('');

		form.unbind().submit(function (e) {
			log('submit clicked', e.target);
			e.preventDefault();
			//createPage(modal.find('form'));
			doSavePage(modal.find('form'), null, false);
		});

		openFuseModal(modal);
	});
}

function initModuleList() {
	var pagesList = $('#pages-list');

	// Dragable row
	var cont = $('div.Content');
	pagesList.sortable({
		items: 'article',
		sort: function () {
			if (cont.hasClass('ajax-loading')) {
				return false;
			}
			$(this).removeClass('ui-state-default');
		},
		update: function () {
			log('module page change order');
			saveModulePages();
		}
	});

	pagesList.on('click', '.btn-edit-page', function (e) {
		e.preventDefault();

		log('click edit', e, this);

		var a = $(this);
		var name = a.attr('href');
		var article = a.closest('article');
		showEditModal(name, article);
	});

	// Delete button
	pagesList.on('click', 'a.btn-delete-page', function (e) {
		e.preventDefault();

		log('Delete page', $(this));

		var a = $(this);
		var parent = a.closest('article');
		var href = a.attr('href');
		var name = parent.find('> span.article-name').text();

		confirmDelete(href, name, function () {
			log('remove', parent);
			parent.remove();
		});
	});
}

function checkFormControlState(type) {
	var allWrappers = {
		reward: $('.rewards-wrapper'),
		certificate: $('.certificates-wrapper')
	};

	allWrappers.all = allWrappers.reward.add(allWrappers.certificates);

	var wrappers;

	if (type) {
		wrappers = allWrappers[type];
	} else {
		wrappers = allWrappers.all;
	}

	wrappers.each(function () {
		var wrapper = $(this);
		var btnAdd = wrapper.prev();
		var contents = wrapper.children('div');

		if (type) {
			wrapper[contents.length === 0 ? 'addClass': 'removeClass']('hide');
			btnAdd[contents.length === 0 ? 'addClass': 'removeClass']('btn-add-first');
		}

		contents.each(function (i) {
			var content = $(this);

			if (type === 'reward') {
				var numRewards = 'numRewards' + i;

				content.find('input:text').attr({
					name: numRewards,
					id: numRewards
				});
				content.find('label').attr('for', numRewards);

				content.find('select').attr('name', 'reward' + i);
			} else {
				var points = 'points' + i;

				content.find(points).attr({
					name: numRewards,
					id: points
				});
				content.find('label').attr('for', points);

				content.find('select').attr('name', 'certificates' + i);
			}
		});
	});
}

function initFormControl(name) {
	var wrapper = $('.' + name +'s-wrapper');
	var btnAdd = wrapper.prev();
	var template = wrapper.children().eq(0).clone();

	checkFormControlState();

	btnAdd.on('click', function (e) {
		e.preventDefault();

		if (btnAdd.hasClass('btn-add-first')) {
			btnAdd.removeClass('btn-add-first');
			wrapper.removeClass('hide');
		} else {
			wrapper.append(template.clone());
		}

		checkFormControlState(name);
	});

	wrapper.on('click', '.btn-delete-' + name, function (e) {
		e.preventDefault();

		var btn = $(this);
		var parent = btn.closest('.' + name);

		parent.remove();

		checkFormControlState(name);
	});
}

// Event for Add and Edit Certificate and Reward button in Module details panel
function initFormDetails() {
	checkFormControlState();

	var detailsWrapper = $('#details');
	var formDetails = detailsWrapper.find('form');

	var addFirst = $('.addFirst');
	addFirst.click(function (e) {
		e.preventDefault();
		var btn = $(e.target);
		var editList = btn.closest('.editList');
		editList.find('.editRow').show().find('input').val(1);
		btn.hide();
		log('hide', btn);
	});

	initFormControl('certificate');
	initFormControl('reward');

	$('.certificates-wrapper').on('click', 'a.btn-preview-certificate', function (e) {
		e.preventDefault();

		var btn = $(this);
		var certId = btn.closest('.certificate').find('select').val();

		if (certId === '') {
			alert('Please select a certificate');
		} else {
			var href = 'cert_' + certId + '/certificatePreview.pdf';
			window.open(href, '_bank');
		}
	});

	var chkEmailConfirm = $('#emailConfirm');
	var contentEmailConfirm = $('#email-confirm-content');
	var checkEmailConfirm = function () {
		contentEmailConfirm[chkEmailConfirm.is(':checked') ? 'removeClass' : 'addClass']('hide');
	};
	checkEmailConfirm();

	// For email
	chkEmailConfirm.on('click', function () {
		checkEmailConfirm();
	});

	formDetails.forms({
		validate: function (form) {
			return checkEditListsValid(form);
		},
		callback: function (resp) {
			log('done', resp);
			alert('Module details saved');
			if (resp.nextHref && resp.nextHref !== window.location.pathname) {
				window.location.href = resp.nextHref;
			}
		}
	});

	initHtmlEditors(formDetails.find('.htmleditor'), getStandardEditorHeight() + 'px', null, null, 'autogrow');
}

function checkEditListsValid(form) {
	log('checkEditListsValid');

	var isOk = true;

	$('.certificates-wrapper, .rewards-wrapper').each(function (i) {
		var wrapper = $(this);
		var values = [];

		if (!wrapper.hasClass('hide')) {
			wrapper.children().each(function (rowIndex) {
				$(this).find('select.requiredIf, input.requiredIf').each(function () {
					var input = $(this);
					var val = input.val().trim();

					if (val === '') {
						isOk = false;
						showValidation(input, 'A value is required', form);
					} else {
						log('val', val, values);

						if (values.indexOf(val) !== -1) {
							showErrorField(input);
							alert('Duplicate ' + input.attr('data-basename') + ' on row ' + rowIndex);
							isOk = false;
						} else {
							values.push(val);
							log('val2', val, values);
						}
					}
				});
			});
		}
	});

	return isOk;
}

function saveModulePages() {
	var order = 0;

	log('saveModulePages');
	$('#pages-list').find('article.page').each(function (i, node) {
		var page = $(node);
		order++;
		$('input', page).attr('value', order);
	});

	showLoadingOverlay();

	$.ajax({
		type: "POST",
		url: '',
		data: $('form.modulePages').serialize(),
		dataType: 'json',
		success: function (resp) {
			hideLoadingOverlay();
			log('saved module', resp);
		},
		error: function (resp) {
			hideLoadingOverlay();
			alert('Sorry couldnt update module');
		}
	});
}

function initAddQuizModal() {
	var modal = $('#modal-add-quiz');
	var form = modal.find('form');

	modal.find('.modal-body').css('min-height', getStandardModalHeight());

	$('.btn-quiz-page').click(function (e) {
		e.preventDefault();

		modal.find('input[type=text], textarea,input[name=pageName]').val('');
		modal.find('#quiz-questions').html('<ol class="quiz"></ol>');
		form.unbind().submit(function (e) {
			e.preventDefault();
			doSavePage(form, null, true);
		});

		modal.modal('show');
	});
}

function showEditModal(name, pageArticle) {
	log('showEditModal', name, pageArticle);

	var editModal;
	var isQuiz = pageArticle.hasClass('quiz');
	if (isQuiz) {
		editModal = $('#modal-add-quiz');
	} else {
		editModal = $('#modal-add-page');
	}

	var form = editModal.find('form');
	editModal.find('input[name=pageName]').val(name);
	editModal.find('input:text, textarea').val('');

	openFuseModal(editModal);

	form.unbind().submit(function (e) {
		e.preventDefault();
		e.stopPropagation();
		log('edit submit click', e.target);
		doSavePage(form, pageArticle, isQuiz);
	});

	editModal.find('.btn-history').unbind().history({
		pageUrl: name,
		showPreview: false,
		afterRevertFn: function () {
			loadModalEditorContent(editModal, name, isQuiz);
		}
	});
	loadModalEditorContent(editModal, name, isQuiz);
}

function isModalOpen() {
	log('isModalOpen');
	if ($('#modal-add-quiz').is(':visible') || $('#modal-add-page').is(':visible')) {
		return 'Please close the edit modal before leaving this page';
	}
}

function loadModalEditorContent(modal, name, isQuiz) {
	$.ajax({
		type: "GET",
		url: name + '?type=json',
		dataType: 'json',
		success: function (resp) {
			var data = resp.data;
			log('resp', resp);
			log('set into', modal, modal.find('input[name=pageTitle]'));
			modal.find('input[name=pageTitle]').val(data.title);

			if (isQuiz) {
				loadQuizEditor(modal, data);
			} else {
				modal.find('textarea').val(data.body);
			}
		},
		error: function (resp) {
			log('error', resp);
			alert('err: couldnt load page data');
		}
	});
}

function doSavePage(form, pageArticle, isQuiz) {
	var modal = form.closest('.modal');
	log('doSavePage', form, isQuiz);

	resetValidation(form);
	if (!checkRequiredFields(form)) {
		return;
	}

	var $title = form.find('input[name=pageTitle]');
	var data;
	if (isQuiz) {
		data = prepareQuizForSave(form);

	} else {
		log('check ck editors', CKEDITOR.instances);
		for (var key in CKEDITOR.instances) {
			var editor = CKEDITOR.instances[key];
			var content = editor.getData();
			log('got ck content', key, content, editor);
			var inp = $('textarea[name=' + key + ']', form);
			if (inp) {
				inp.html(content);
				log('updated', inp);
			}
		}
		data = form.serialize();
	}
	log('do ajax post', form.attr('action'), data);
	try {
		modal.find('button[data-type=form-submit]').attr('disabled', 'true');
		log('set disabled', modal.find('button[data-type=form-submit]'));
		form.addClass('ajax-processing');
		$.ajax({
			type: "POST",
			url: form.attr('action'),
			data: data,
			dataType: 'json',
			success: function (data) {
				log('set enabled', modal.find('button[data-type=form-submit]'));
				form.removeClass('ajax-processing');
				modal.find('button[data-type=form-submit]').removeAttr('disabled');
				if (data.status) {
					var title = $title.val();
					if (pageArticle == null) { // indicated new page
						var pageName = getFileName(data.messages[0]);
						var href = data.nextHref;
						addPageToList(pageName, href, title, isQuiz);
					} else {
						pageArticle.find('> span').text(title);
					}
					closeFuseModal(modal);

					saveModulePages();                 
				} else {
					alert('There was an error saving the page: ' + data.messages);
				}
			},
			error: function (resp) {
				form.removeClass('ajax-processing');
				log('error', resp);
				alert('Sorry, an error occured saving your changes. If you have entered editor content that you dont want to lose, please switch the editor to source view, then copy the content. Then refresh the page and re-open the editor and paste the content back in.');
			}
		});
	} catch (e) {
		log('exception in createJob', e);
	}
	return false;
}

function addPageToList(pageName, href, title, isQuiz) {
	log('newRow', title, isQuiz);
	var newFileName = getFileName(href);
	var type = isQuiz ? 'quiz' : 'file';
	var className = isQuiz ? 'clip-question' : 'clip-file-2';

	$('#pages-list').append(
		'<article class="page ' + type + '">' +
			'<input type="hidden" name="' + pageName + '" value="$order"/>' +
			'<i class="' + className + '"></i>' +
			'<span class="article-name">' + title + '</span>' +
			'<aside class="article-action">' +
				'<div class="btn-group btn-group-sm">' +
					'<button type="button" class="btn btn-move-file btn-orange dropdown-toggle" title="Move up or down">' +
						'<i class="glyphicon glyphicon-sort"></i>' +
					'</button>' +
					'<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown">' +
						'<i class="fa fa-cog"></i>' +
					'</button>' +
					'<ul class="dropdown-menu pull-right">' +
						'<li><a href="' + newFileName + '" class="btn-edit-page" title="Edit page">Edit page</a></li>' +
						'<li><a href="' + newFileName + '?goto" target="_blank" title="View page">View page</a></li>' +
						'<li class="divider"></li>' +
						'<li><a href="' + href + '" class="btn-delete-page" title="Delete page">Delete page</a></li>' +
					'</ul>' +
				'</div>' +
			'</aside>' +
		'</article>'
	);
}
