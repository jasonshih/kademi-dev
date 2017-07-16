var selectedForum;

function initManageForum() {
	initCRUDForum();
	initForumModal();

	addTopicButton();
	initTopicController();
}

function initCRUDForum() {
	var body = $(document.body);


	$('.btn-add-forum').on('click', function(e) {
		e.preventDefault();

		showForumModal();
	});

	// Bind event for Delete forum
	body.on('click', '.btn-delete-forum', function(e) {
		e.preventDefault();

		confirmDeleteForum(e);
	});

	// Bind event for Edit forum
	body.on('click', '.btn-edit-forum', function(e) {
		e.preventDefault();

		var selectedForum = $(this).closest('div.forum');
		showForumModal(selectedForum);
	});
}

function initForumModal() {
	var modal = $('#modal-forum');

	modal.find('form').forms({
        onSuccess: function() {
            modal.modal('hide');
            Msg.success($('#title').val() + ' is saved!');
            $('#forum-wrapper').reloadFragment();
		}
	});
}

function showForumModal(selected) {
	var modal = $('#modal-forum');
	var modalTitle = modal.find('.modal-title');
	var modalForm = modal.find('form');
	var controls = modal.find('input:text, textarea');
	var action = modal.find('#action');

	if (selected) {
		modalTitle.html('Edit Forum');
		controls.each(function () {
			var control = $(this);
			var id = control.attr('id');

			control.val(selected.attr('data-' + id));
		});
		modalForm.attr('action', selected.attr('data-name'));
		action.val('');
	} else {
		modalTitle.html('Add Forum');
		controls.val('');
		modalForm.attr('action', '.');
		action.val('create');
	}

	modal.modal('show');
}

function confirmDeleteForum(e) {
    var forum = $(e.target).closest('div.forum');
    var forumLink = forum.find('.btn-delete-forum');
    var href = forumLink.attr('href');
    var name = getFileName(href);

    confirmDelete(href, name, function() {
        Msg.success(forum.attr('data-title') + ' is deleted!');
        forum.remove();
    });
}

// TODO: recheck topic
function initTopicController() {

	// Bind event for Delete button
	$('body').on('click', 'a.DeleteTopic', function(e) {
		e.preventDefault();
		confirmDeleteTopic($(this).closest('li'));
	});

	// Bind event for Edit button
	$('body').on('click', 'a.RenameTopic', function(e) {
		e.preventDefault();

		var _selectedTopic = $(this).parent().parent();

		showForumModal('Topic', 'Rename', {
			name: _selectedTopic.find('> span').html(),
			topic: _selectedTopic.attr('data-topic'),
			forum: _selectedTopic.parent().attr('data-forum')
		}, function() {
			renameTopic(_selectedTopic);
		});
	});
}

function addTopicButton() {
	$('body').on('click', 'button.AddTopic', function(e) {
		e.preventDefault();
		log('add topic onclick');
		selectedForum = $(e.target).closest('div.Forum');
		var forumLink = selectedForum.find('header div.ShowDialog > a');
		var forumHref = forumLink.attr('href');
		log('selectedForum', selectedForum);
		showForumModal('Topic', 'Add', {
			forum: $(this).parent().parent().attr('data-forum')
		}, function() {
			addTopic(forumHref);
		});
	});
}

function maxOrderTopic(obj) {
	var _order = [];
	obj.find('ul.TopicList li').each(function() {
		_order.push($(this).attr('data-topic'));
	});

	_order.sort().reverse();

	return (parseInt(_order[0]) + 1);
}

function addTopic(forumName) {
	var modal = $('#modalForum');
	var name = $('input[name=name]', modal).val();
	log('addTopic', name);
	if( name == null || name.length == 0 ) {
		Msg.error('Please enter a name for the new topic');
		return;
	}

	$.ajax({
		type: "POST",
		url: forumName,
		dataType: 'json',
		data: {
			newName: name
		},
		success: function(data) {
			log('response', data);

			$.tinybox.close();

			var topicsUl = $('ul.TopicList', selectedForum);
			var topicLi = $('<li><span>' + name + '</span></li>');
			topicsUl.append(topicLi);
			var aside = $('<aside></aside>');
			topicLi.append(aside);
			var topicHref = forumName + '/' + data.nextHref;
			aside.append('<a title="Rename this topic" class="Edit RenameTopic" href="' + topicHref + '"><span class="Hidden">Rename this topic</span></a> ');
			aside.append('<a title="Delete this topic" class="Delete DeleteTopic" href="' + topicHref + '"><span class="Hidden">Delete this topic</span></a> ');
		},
		error: function(resp) {
			log('error', resp);
			Msg.error('err');
		}
	});

}

function confirmDeleteTopic(topicLi) {
	var href = topicLi.find('a.Delete').attr('href');
	var name = topicLi.find('> span').text();
	log('Cofirm delete topic', href, name);
	confirmDelete(href, name, function() {
		topicLi.remove();
	});
}
function renameTopic(topicLi) {    
    var modal = $('#modalForum');
    var title = $('input[name=name]', modal).val();
    var topicHref = topicLi.find('a.RenameTopic').attr('href');
    log('renameTopic', topicHref);
    var data = new Object();
    data['milton:title'] = title;
    var url = topicHref;
    if( !url.endsWith('/')) {
        url += '/';
    }
    url += '_DAV/PROPPATCH';
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: data,
        success: function(data) {
            log('response', data);
            topicLi.find('> span').text(title);
            $.tinybox.close();
        },
        error: function(resp) {
            log('error', resp);
            Msg.error('err');
        }
    });    
}