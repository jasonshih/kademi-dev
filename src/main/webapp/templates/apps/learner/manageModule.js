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

	initFormDetails();
	initAddQuizModal();
	initQuizBuilder();
	initPublishingMenu('manageModules');

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

	log('init thumbnail selector', basePath, pagePath);
	var thumbSel = $('input.thumbnail');
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
		var editorHeight = ($(window).height() - 500) + 'px';
		modal.find('.modal-body').css('height', editorHeight + 100);
		initHtmlEditors(modal.find('.htmleditor'), editorHeight, null, null, standardRemovePlugins + ',autogrow'); // disable autogrow
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

// Event for Add and Edit Certificate and Reward button in Module details panel
function initFormDetails() {
	initModuleDetailsState(true);

	var addFirst = $('.addFirst');
	addFirst.click(function (e) {
		e.preventDefault();
		var btn = $(e.target);
		var editList = btn.closest('.editList');
		editList.find('.editRow').show().find('input').val(1);
		btn.hide();
		log('hide', btn);
	});

	$('#moduleDetailsForm').on('click', '.Delete', function (e) {
		e.preventDefault();
		e.stopPropagation();
		var div = $(e.target).closest('div');
		var container = div.parent();
		if (container.find('div').length > 1) {
			log('remove', div);
			div.remove();
			initModuleDetailsState(false);
		} else {
			log('will hide', div);
			// otherwise will be hidden, so just reset values
			div.find('select, input').val('');
			initModuleDetailsState(true);
		}
	});

	$('#moduleDetailsForm').on('click', '.addRow', function (e) {
		e.preventDefault();
		e.stopPropagation();
		var div = $(e.target).closest('div');
		log('addRow', div);
		var container = div.parent();
		var newDiv = div.clone();
		container.append(newDiv);
		newDiv.find('input').val(1);
		initModuleDetailsState(false);
	});

	// For email
	$('#emailConfirm').on('click', function () {
		var $controls = $('div.EmailMessage');
		if ($(this).is(':checked')) {
			$controls.removeClass('Hidden');
		} else {
			$controls.addClass('Hidden');
		}
	});

	$('#moduleDetailsForm').forms({
		validate: function (form) {
			return checkEditListsValid();
		},
		callback: function (resp) {
			log('done', resp);
			alert('Module details saved');
			if (resp.nextHref && resp.nextHref !== window.location.pathname) {
				window.location.href = resp.nextHref;
			}
		}
	});
	initHtmlEditors($('#moduleDetailsForm .htmleditor'));

	$('body').on('click', 'a.previewCertPdf', function (e) {
		var node = $(e.target);
		var certId = node.parent().find('select').val();
		if (certId === '') {
			alert('Please select a certificate');
		} else {
			var href = 'cert_' + certId + '/certificatePreview.pdf';
			window.open(href);
		}
	});
}

function checkEditListsValid(form) {
	log('checkEditListsValid');
	var isOk = true;
	$('.editList').each(function (i, n) {
		var editList = $(n);
		var editRows = editList.find('> div');
		var values = new Array();
		editRows.filter(':visible').each(function (rowIndex, n) {
			var row = $(n);
			row.find('select, input').filter('.requiredIf').each(function (ii, inputNode) {
				var inp = $(inputNode);
				if (inp.val() === '') {
					isOk = false
					showValidation(inp, 'A value is required', form);
				} else {
					// check for dups
					var val = inp.val();
					log('val', val, values);
					if (values.indexOf(val) > -1) {
						showErrorField(inp);
						alert('Duplicate ' + inp.attr('data-basename') + ' on row ' + rowIndex);
						isOk = false;
					}
					values.push(val);
					log('val2', val, values);
				}
			});
		});
	});
	return isOk;
}

function initModuleDetailsState(allowHide) {
	log('initModuleDetailsState');
	// If first edit item is blank, then hide it and show add button
	$('.editList').each(function (i, n) {
		var editList = $(n);
		var addFirst = editList.find('> button');
		var editRows = editList.find('> div');
		var lastRow = editRows.last();
		var lastSelect = lastRow.find('select');
		log('check select', lastSelect, lastSelect.val());
		if (editRows.length === 1 && lastSelect.val().length === 0) {//&& allowHide
			editRows.hide();
			addFirst.show();
		} else {
			log('hide addFirst', addFirst);
			addFirst.hide();
		}
		// Make sure all certs have a delete button, and update name and id to be sequential counter
		editRows.each(function (i, n) {
			var cert = $(n);
			cert.find('select, input').each(function (ii, inp) {
				var target = $(inp);
				var updatedName = target.attr('data-basename') + i;
				target.attr('name', updatedName);
				target.attr('id', updatedName);
			});
			var btn = cert.find('button.Delete');
			if (btn.length === 0) {
				cert.append('<button title="Delete" class="SmallBtn Delete NoText"><span>Delete</span></button>');
			}
		});

		// Make sure only last cert has a plus button to add a cert
		editRows.find('button.Add').remove();
		lastRow.append('<button title="Add" class="SmallBtn Add NoText addRow"><span>Add</span></button>');
	});
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
	$('.AddQuizPage').click(function (e) {
		e.preventDefault();
		var modal = $('#modalCreateQuiz');
		modal.find('input[type=text], textarea,input[name=pageName]').val('');
		modal.find('#quizQuestions').html('<ol class="quiz"></ol>');
		var form = modal.find('form');
		form.unbind();
		form.submit(function (e) {
			e.preventDefault();
			//createPage(modal.find('form'));
			doSavePage(modal.find('form'), null, true);
		});
		$.tinybox.show(modal, {
			overlayClose: false,
			opacity: 0
		});
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

	if (isQuiz) {
		editModal.modal('show');
	} else {
		openFuseModal(editModal);
	}

	form.unbind().submit(function (e) {
		e.preventDefault();
		e.stopPropagation();
		log('edit submit click', e.target);
		doSavePage(form, pageArticle, isQuiz);
	});

	editModal.find('.btn-history-page').unbind().history({
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
	if ($('#modalCreateQuiz').is(':visible') || $('#modalCreatePage').is(':visible')) {
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
	var newRow = $('<article class="modulePage"></article>');
	if (isQuiz) {
		newRow.addClass('Quiz');
	}
	$('form.modulePages div.MainContent').append(newRow);
	log('newRow', newRow, title, isQuiz);
	newRow.append('<input type="hidden" value="" name="' + pageName + '"/>');
	newRow.append('<span>' + title + '</span>');
	var aside = $('<aside class="Hidden"></aside>');
	newRow.append(aside);
	var newFileName = getFileName(href);
	aside.append('<a href="' + newFileName + '" class="Edit" title="Edit page"><span class="Hidden">Edit page</span></a>');
	aside.append('<a href="' + newFileName + '?goto" target="_blank" class="View" title="View page"><span class="Hidden">View page</span></a>');
	aside.append('<a href="" class="Move" title="Move up or down"><span class="Hidden">Move up or down</span></a>');
	aside.append('<a href="' + href + '" class="Delete" title="Delete page"><span class="Hidden">Delete page</span></a>');
}
