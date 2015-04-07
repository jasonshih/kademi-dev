var selectedCourse = null;

function loadQuizEditor(modal, data) {
    flog("loadQuizEditor. Data=", data);
    modal.find("input[name=maxAttempts]").val( data.maxAttempts );
    modal.find("input[name=passMarkPerc]").val( data.passMarkPerc );
    modal.find('#quiz-questions').html(data.body);
    var olQuiz = modal.find('ol.quiz');
    if (olQuiz.length === 0) {
        olQuiz = $('<ol class="quiz"></ol>');
        modal.find('#quiz-questions').append(olQuiz);
        flog("Didnt find ol quiz, so added", olQuiz, "to ", modal.find('#quiz-questions'));
    } else {
        flog("Found ol quiz", olQuiz);
    }
    // set answers into the quiz
    var quizItems = modal.find('ol.quiz > li');
    flog("Got quizItems", quizItems, "from modal", modal);
    for (prop in data) {
        if (prop.startsWith('answer')) {
            var n = prop.replace('answer', ''); // get the answer number
            flog('answer number:', n, 'quizItems', quizItems);
            //var li = $(quizItems[n]);
            //var li = quizItems.find('#' + n);
            var li = hackyFind(quizItems, n);
            flog('li', li);
            flog('answer', n, prop, data[prop], li);
            var input = li.find('input[type=text],select,textarea');
            if (input.length > 0) {
                input.val(data[prop]); // set answer on textboxes, selects and textareas
                flog('restored input', input, data[prop]);
            } else {
                var radios = li.find('input[type=radio]');
                flog('radios', radios);
                radios.attr('checked', '');
                var val = data[prop];
                var radio = radios.filter('[value=' + val + ']');
                flog('radio val', val, radio);
                radio.prop('checked', true); // set radio buttons
                flog('restored radio', radio);
            }
        }
    }
    modal.find('input[type=radio]').closest('ol').each(function(i, n) {
        var ol = $(n);
        ensureOneEmptyRadio(ol);
    });
}

function hackyFind(arr, id) {
    flog('hackyFind id=', id, 'array', arr);
    var found = null;
    $.each(arr, function(i, n) {
        var node = $(n);
        var nodeId = node.attr('id')
        var answerClass = 'answer' + id; // old way of identifying answers
        if (nodeId === id || node.hasClass(answerClass)) {
            found = node;
        }
    });
    return found;
}

function prepareQuizForSave(quizWrapper, data) {
    flog('prepareQuizForSave: build data object for quiz');
    var quiz = quizWrapper.find('#quiz-questions');
    // Set names onto all inputs. Just number them answer0, answer1, etc. And add a class to the li with the name of the input, to use in front end validation
    var questions = quiz.find('ol.quiz > li');
    questions.each(function(q, n) {
        var li = $(n);
        var id = li.attr('id');
        setClass(li, 'answer', id); // will remove old classes
        li.data('type', 'input');
        //setClass(li, 'answer', q); // will remove old classes
        li.find('input,select,textarea').each(function(inpNum, inp) {
            $(inp).attr('name', 'answer' + q);
        });
    });

    if (data) {
        data.pageName = quizWrapper.find('input[name=pageName]').val();
        data.pageTitle = quizWrapper.find('input[name=pageTitle]').val();
        data.template = quizWrapper.find('input[name=template]').val();
        data.order = quizWrapper.find('input[name=order]').val();
        data.maxAttempts = quizWrapper.find('input[name=maxAttempts]').val();
        data.passMarkPerc = quizWrapper.find('input[name=passMarkPerc]').val();
        data.passMarkPerc = quizWrapper.find('input[name=passMarkPerc]').val();
        data.passMarkPerc = quizWrapper.find('input[name=passMarkPerc]').val();
    } else {
        data = {
            pageName: quizWrapper.find('input[name=pageName]').val(),
            pageTitle: quizWrapper.find('input[name=pageTitle]').val(),
            template: quizWrapper.find('input[name=template]').val(),
            order: quizWrapper.find('input[name=order]').val(),
            maxAttempts: quizWrapper.find('input[name=maxAttempts]').val(),
            passMarkPerc: quizWrapper.find('input[name=passMarkPerc]').val()
        };
    }

    // Update the names of all inputs to be the class on the question li
    var inputs = quiz.find('input,select,textarea').not('.newQuestionType,input[name=pageTitle],input[name=pageName]');
    flog('update input names', inputs);
    inputs.each(function(i, n) {
        var inp = $(n);
        var name = inp.closest('li[id]').attr('class'); // the question li is the closest one with an id. question name is its class
        inp.attr('name', name);
        flog('set name', name, inp);
    });

    // Find all inputs and add them to the data object
    var inputs = quiz.find('input[type=text],select,textarea,input[type=radio]:checked').not('.newQuestionType,input[name=pageTitle],input[name=pageName]');
    flog('add inputs', inputs);
    inputs.each(function(i, n) {
        var inp = $(n);
        var name = inp.attr('name');
        var val = inp.val();
        data[name] = val;
        flog('set data att', name, val);
    });

    // remove any 'temp' elements that have been added as part of editing
    quizWrapper.find('.temp').remove();
    quiz.find('input[type=radio]').removeAttr('checked');
    removeEmptyRadios(quiz.find('ol ol'));

    data.body = quiz.html();
    flog('html', data.body);
    return data;
}

function initQuizBuilder() {
    var quizWrapper = $('#quiz-questions');

    flog('quizWrapper', quizWrapper);

    quizWrapper.on('click', 'h3, p, label', function(e) {
        e.stopPropagation();
        e.preventDefault();

        var target = $(this);

        flog('editable item clicked', target);

        var inp = $('<input class="form-control input-sm ' + target[0].tagName + '" type="text"/>');
        flog('created inp', inp);
        var txt = target.text();
        if (txt.startsWith('[')) { // place holder text
            inp.attr('placeholder', txt);
            txt = '';
        }
        inp.val(txt);
        inp.insertAfter(target);

        target.detach();
        flog('detached target', target);

        inp.focus();
        inp.focusout(function() {
            // put back original element
            var newText = inp.val().trim();
            flog('focusout: target=', target, 'newText=', newText);
            target.text(newText);

            // If its a label, and its empty, then remove it
            if (target.hasClass('LABEL') && newText.length == 0) {
                inp.closest('li').remove();
            } else {
                target.insertAfter(inp);
                if (newText.length === 0) {
                    target.text(inp.attr('placeholder'));
                }
                inp.remove();
            }
            if (target.is('label')) {
                ensureOneEmptyRadio(target.closest('ol'));
            }
        });
    });

    quizWrapper.on('keyup', 'input.radioLabel', function(e) {
        var inp = $(e.target);
        var li = inp.closest('li');
        var ul = li.closest('ul');
        var last = ul.find('li').filter(':last');
        flog('last', li, last, li == last);
        if (li.is(last)) {
            addRadioToMulti(ul);
        }
    });

    // Suppress enter key to prevent users from submitting, and closing, the modal edit window accidentally
    quizWrapper.on('keypress', 'input', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            e.stopPropagation();
            $(e.target).focusout();
        }
    });

    // insert a delete X on hover of a question li
    quizWrapper.on('mouseenter', 'ol.quiz > li', function(e) {
        var li = $(this);

        if (li.find('span.delete').length > 0) {
            return;
        }
        li.append('<span class="delete btn btn-xs btn-danger" title="Delete this question"><i class="fa fa-times"></i></span>');
    });

    quizWrapper.on('mouseleave', 'ol.quiz > li', function(e) {
        $(this).find('span.delete').remove();
    });

    quizWrapper.on('click', 'span.delete', function(e) {
        var li = $(e.target).closest('li');
        li.remove();
    });

    $('.btn-add-question').next().find('a').click(function(e) {
        e.preventDefault();

        var btn = $(this);
        flog('new question', btn);
        var type = btn.hasClass('btn-multiple') ? 'multi' : 'textbox';

        addQuestion(type);

    });

    function addQuestion(type) {
        flog('add question', type);
        if (type === 'textbox') {
            addQuestionTextbox();
        } else if (type === 'multi') {
            addQuestionMulti();
        }
    }

    function addQuestionTextbox() {
        var questions = quizWrapper.find('ol.quiz');
        flog('addQuestionTextbox', questions);
        var li = createQuestionLi(questions);
        li.append('<textarea class="form-control autoresize" cols="50" rows="1"></textarea>');
    }

    function addQuestionMulti() {
        var questions = quizWrapper.find('ol.quiz');
        flog('addQuestionMulti', questions);
        var li = createQuestionLi(questions);
        var olRadios = $('<ol></ol>');
        olRadios.attr('id', 'answers_' + li.attr('id'));
        li.append(olRadios);
        addRadioToMulti(olRadios);
    }

    function createQuestionLi(quizWrapper) {
        var id = Math.floor(Math.random() * 1000000);
        var li = $(
                '<li id="f' + id + '">' +
                '<h3>[Enter the question here]</h3>' +
                '<p>[Enter help text here]</p>' +
                '</li>'
                );
        li.addClass("answer" + id);
        quizWrapper.append(li);
        return li;
    }
}

function removeEmptyRadios(ol) {
    ol.find('li').each(function(i, n) {
        var li = $(n);
        var txt = li.find('label').text().trim()
        if (txt == '' || txt.startsWith('[')) {
            li.remove();
        }
    });

}
function ensureOneEmptyRadio(ol) {
    // remove any li"s containing empty labels, then add one empty one
    removeEmptyRadios(ol);
    addRadioToMulti(ol);
}

function addRadioToMulti(ol) {
    var question = ol.closest('li').attr('class');
    flog('addRadioToMulti', ol, question);
    var answerId = Math.floor(Math.random() * 1000000);
    var li = $('<li></li>');
    li.append($('<input type="radio" id="answer_' + answerId + '" value="' + answerId + '"/>'));
    li.append($('<label for="answer_' + answerId + '">[Enter answer text here]</label>'));
    ol.append(li);

    // Do this after appending
    var inputs = li.closest("ol").find('input');
    flog("Set name!", inputs, question);
    inputs.attr('name', question); // make the name of all radios the question

}

/**
 * Remove all other answer classes, and and the new one
 */
function setClass(element, prefix, suffix) {
    var el = $(element);
    flog('setClass', el, el.attr('class'));
    var classes = el.attr('class');
    if (classes) {
        $.each(classes.split(' '), function(i, n) {
            if (n.startsWith(prefix)) {
                el.removeClass(n);
            }
        });
    }
    el.addClass(prefix + suffix);
}