var iframeUrl;
var win = $(window);

function initManageBlogArticle(pagePath) {
    $.timeago.settings.allowFuture = true;
    $('.timeago').timeago();
    
    
    initFullscreenEditor($('[name=body]'));
    
    $('.article-form').forms({
        onSuccess: function (resp, form) {
            flog('Done', form, resp);
            if (resp.nextHref) {
                window.location = resp.nextHref;
            } else {
                reloadFullscreenEditorPreview($('[name=body]'));
            }
            Msg.info('Saved');
        }
    });
    
    
    initPublish();
    initGroupEditing();
    initManageArticleImage();
    initManageArticleGallery();
    initManageArticleFiles();
    initGraphControls();
    loadGraphData();
}

function initPublish() {
    var rejectModal = $('#rejectModal');
    $('.article-reject').click(function (e) {
        e.preventDefault();
        rejectModal.modal('show');
    });
    rejectModal.find('form').forms({
        onSuccess: function (data) {
            Msg.info('Rejected/un-published');
            window.location.reload();
        }
    });
    
    $('.article-submit').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: window.location.pathname,
            data: {submit: 'doit'},
            method: "POST",
            datatype: "json"
        }).done(function (data) {
            flog('Done', data);
            Msg.info('Submitted for approval');
            window.location.reload();
        });
    });
    
    var publishModal = $('#publishModal');
    $('.article-publish').click(function (e) {
        e.preventDefault();
        publishModal.modal('show');
    });
    
    publishModal.find('form').forms({
        onSuccess: function (data) {
            Msg.info('Published');
            flog('done publish', data);
            window.location.reload();
        }
    });
}

var options = {
    startDate: null,
    endDate: null,
    interval: "day"
};

function loadGraphData() {
    var href = "?activity&" + $.param(options);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (resp) {
            var json = null;
            
            if (resp !== null && resp.length > 0) {
                json = JSON.parse(resp);
            }
            
            flog('response', json);
            handleData(json);
        }
    });
}

function handleData(resp) {
    var aggr = (resp !== null ? resp.aggregations : null);
    
    initHistogram(aggr);
}


function initGraphControls() {
    flog("initGraphControls");
    var reportRange = $('#analytics-range');
    
    function cb(start, end) {
        options.startDate = start.format('DD/MM/YYYY');
        options.endDate = end.format('DD/MM/YYYY');
        loadGraphData();
    }
    
    reportRange.exist(function () {
        flog("init analytics range");
        reportRange.daterangepicker({
            format: 'DD/MM/YYYY',
            startDate: moment().subtract('days', 6),
            endDate: moment(),
            ranges: {
                'Today': [
                    moment().toISOString(),
                    moment().toISOString()
                ],
                'Last 7 Days': [
                    moment().subtract('days', 6).toISOString(),
                    moment().toISOString()
                ],
                'Last 30 Days': [
                    moment().subtract('days', 29).toISOString(),
                    moment().toISOString()],
                'This Month': [
                    moment().startOf('month').toISOString(),
                    moment().endOf('month').toISOString()],
                'Last Month': [
                    moment().subtract('month', 1).startOf('month').toISOString(),
                    moment().subtract('month', 1).endOf('month').toISOString()],
                'This Year': [
                    moment().startOf('year').toISOString(),
                    moment().toISOString()],
            }
        }, cb);
    });
}

function initHistogram(aggr) {
    flog("initHistogram", aggr);
    
    $('#chart_histogram svg').empty();
    nv.addGraph(function () {
        
        var myData = [];
        $.each(aggr.type.buckets, function (b, typeBucket) {
            var series = {
                key: typeBucket.key,
                values: []
            };
            myData.push(series);
        });
        
        $.each(aggr.reqDate.buckets, function (i, dateBucket) {
            var typeBuckets = dateBucket.type.buckets;
            var map = {};
            $.each(typeBuckets, function (ss, typeBucket) {
                //flog("add to map",dateBucket.key, typeBucket.doc_count);
                map[typeBucket.key] = typeBucket.doc_count;
            });
            
            $.each(myData, function (s, series) {
                var docCount = map[series.key];
                //flog("point", docCount, series.key, map);
                if (docCount) {
                    series.values.push({x: dateBucket.key, y: docCount});
                } else {
                    series.values.push({x: dateBucket.key, y: 0});
                }
            });
            
        });
        
        flog(myData);
        
        var chart = nv.models.stackedAreaChart()
            .margin({right: 100})
            .x(function (d) {
                return d.x;
            })   //We can modify the data accessor functions...
            .y(function (d) {
                return d.y;
            })   //...in case your data is formatted differently.
            .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
            .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
            .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
            .clipEdge(true);
        
        chart.xAxis
            .tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            });
        
        chart.yAxis
            .tickFormat(d3.format(',.2f'));
        
        d3.select('#chart_histogram svg')
            .datum(myData)
            .call(chart);
        
        nv.utils.windowResize(chart.update);
        
        return chart;
    });
}

function initManageArticleFiles() {
    var filesContainer = $('#files-container');
    var addFileModal = $('#modal-add-file');
    addFileModal.find('form.form-horizontal').forms({
        onProgress: function (percentComplete, form) {
            $(".modal").modal("hide");
            form[0].reset();
            $('.progress-bar')
                .html(round(percentComplete, 1) + '%')
                .css('width', percentComplete + '%');
            $('.progressContainer').show();
        },
        onSuccess: function (resp, form) {
            filesContainer.reloadFragment();
        }
    });
    filesContainer.on('click', '.file-delete', function (e) {
        e.preventDefault();
        var href = $(e.target).closest('a').attr('href');
        flog('delete image', $(e.target), href);
        
        confirmDelete(href, href, function () {
            filesContainer.reloadFragment();
        });
    });
}

function initManageArticleImage() {
    var imageContainer = $('#images-container');
    var addImageModal = $('#modal-add-image');
    addImageModal.find('form.form-horizontal').forms({
        onSuccess: function () {
            imageContainer.reloadFragment();
            $(".modal").modal("hide");
        }
    });
    
    var upcropZone = addImageModal.find('.upcrop-zone');
    var editImageZone = addImageModal.find('.edit-image-zone');
    upcropZone.upcropImage({
        buttonUploadText: "<i class='clip-folder'></i> Upload image",
        buttonCropText: 'Crop and use this image',
        modalTitle: 'Add and crop image',
        ratio: 0,
        isEmbedded: true,
        embeddedTemplate: '<div class="upcrop-embedded" id="{{upcropId}}">' +
        '   <div class="modal-header">' +
        '       <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '       <h4 class="modal-title">Add and crop image</h4>' +
        '   </div>' +
        '   <div class="modal-body">' +
        '       <div class="form-horizontal">' +
        '           <div class="form-group orientation hide">' +
        '               <label class="col-sm-3 control-label" for="newTagName">Orientation</label>' +
        '               <div class="col-sm-9">' +
        '                   <select class="form-control">' +
        '                       <option value="">Default</option>' +
        '                       <option value="square">Square</option>' +
        '                       <option value="vertical">Vertical</option>' +
        '                       <option value="horizontal">Horizontal</option>' +
        '                   </select>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '       {{upcropZone}}' +
        '   </div>' +
        '   <div class="modal-footer">' +
        '       <div class="pull-left">' +
        '           {{buttonUploadOther}}' +
        '       </div>' +
        '       <button class="btn btn-default btn-cancel" type="button" data-dismiss="modal">Cancel</button> ' +
        '       {{buttonCrop}} ' +
        '       {{buttonContinue}}' +
        '   </div>' +
        '</div>'
        ,
        onUploadComplete: function (data, name, href) {
            flog("manageBlogArticle.js: onUploadComplete");
            upcropZone.find('.orientation').removeClass('hide');
//            setAddImageFormData(data, name, true);
        },
        onUploadedImageLoad: function () {
            addImageModal.trigger('resize');
        },
        onUploadOther: function () {
            addImageModal.trigger('resize');
            upcropZone.find('.orientation').addClass('hide');
            upcropZone.find('.orientation select').val('');
        },
        onContinue: function (data, name) {
            setAddImageFormData(data, name, false);
        },
        onCropComplete: setAddImageFormData,
        onReady: function (upcropContainer) {
            var cbbOrientation = upcropContainer.find('.orientation select');
            cbbOrientation.on('change', function () {
                var value = cbbOrientation.val();
                var ratio;
                switch (value) {
                    case 'square':
                        ratio = 1;
                        break;
                    
                    case 'vertical':
                        ratio = 1 / 2;
                        break;
                    
                    case 'horizontal':
                        ratio = 2 / 1;
                        break;
                    
                    default:
                        ratio = 0;
                }
                
                var jcropApi = upcropZone.upcropImage('getJcropApi');
                jcropApi.setOptions({
                    aspectRatio: ratio
                });
            });
            
            var btnCancel = upcropContainer.find('.btn-cancel');
            var btnUploadOther = upcropContainer.find('.btn-upload-other');
            
            btnCancel.on('click', function (e) {
                btnUploadOther.trigger('click');
            });
        }
    });
    
    function setAddImageFormData(data, name, ignoreOrientation) {
        if (data.result) {
            data = data.result;
        }
        var hash = data.data;
        if (typeof hash == "object") {
            hash = hash.file;
        }
        flog("setAddImageFormData: data=", data);
        flog("setAddImageFormData: hash=", hash);
        
        addImageModal.find('.preview').attr('src', data.nextHref);
        addImageModal.find('input[name=hash]').val(hash); // the hash of the 'file' file input that was uploaded
        addImageModal.find('input[name=fileName]').val(name);
        addImageModal.find('input[name=orientation]').val(ignoreOrientation ? '' : upcropZone.find('.orientation select').val());
        flog('set', addImageModal.find('input[name=fileName]'));
        upcropZone.find('.orientation select').val('');
        upcropZone.addClass('hide');
        editImageZone.removeClass('hide');
    }
    
    imageContainer.on('click', '.image-delete', function (e) {
        e.preventDefault();
        var href = $(e.target).closest('a').attr('href');
        flog('delete image', $(e.target), href);
        
        confirmDelete(href, getFileName(href), function () {
            imageContainer.reloadFragment();
        });
    });
    
    
    addImageModal.find('.btn-add-other-img').on('click', function (e) {
        e.preventDefault();
        
        upcropZone.removeClass('hide');
        editImageZone.addClass('hide');
        addImageModal.find('.btn-upload-other').trigger('click');
    });
    
    
    addImageModal.find('.btn-close').on('click', function (e) {
        
        upcropZone.removeClass('hide');
        editImageZone.addClass('hide');
        addImageModal.find('.btn-upload-other').trigger('click');
    });
}


function initManageArticleGallery() {
    var galleryContainer = $('#images-container');
    var addGalleryModal = $('#modal-add-gallery');
    addGalleryModal.find('form.form-horizontal').forms({
        onSuccess: function () {
            galleryContainer.reloadFragment();
            addGalleryModal.modal("hide");
        }
    });
    uploadZone = $("#uploadFileDropzone");
    $.getScriptOnce('/static/js/jquery.milton-upload.js', function () {
        uploadZone.mupload({
            // url: window.location.pathname,
            fieldName: "file",
            useJsonPut: false, // Just do a POST
            useDropzone: true,
            oncomplete: function (data, name, href) {
                flog('uploaded image:', data, name, data.result.nextHref);
                uploadedHref = data.result.nextHref;
                uploadedName = name;
                
                if (data.result) {
                    data = data.result;
                }
                var hash = data.data;
                if (typeof hash == "object") {
                    hash = hash.file;
                }
                
                saveManageArticleGallery(hash, uploadedName, "");
            }
        });
    });
    
    addGalleryModal.on('hide.bs.modal', function (e) {
        galleryContainer.reloadFragment();
    });
}

function saveManageArticleGallery(hash, name, ignoreOrientation) {
    var objImage = {
        hash: hash,
        fileName: name,
        orientation: ignoreOrientation
    };
    
    var saveData = $.ajax({
        type: 'POST',
        url: window.location.pathname,
        data: objImage,
        success: function (resultData) {
            flog("save galleries data success", resultData);
        }
    });
    saveData.error(function () {
        alert("Something went wrong");
    });
}

function initGroupEditing() {
    $('#modalGroup input[type=checkbox]').click(function () {
        var $chk = $(this);
        flog('checkbox click', $chk, $chk.is(':checked'));
        var isRecip = $chk.is(':checked');
        setGroupRecipient($chk.attr('name'), isRecip);
    });
}

function setGroupRecipient(name, isRecip) {
    flog('setGroupRecipient', name, isRecip);
    try {
        $.ajax({
            type: "POST",
            url: window.location.pathname,
            data: {
                group: name,
                isRecip: isRecip
            },
            dataType: 'json',
            success: function (data) {
                if (data.status) {
                    flog('saved ok', data);
                    $('#groupMemberships').reloadFragment({});
                    //if (isRecip) {
                    //    $('.GroupList').append("<button class='btn btn-sm btn-default reset-margin-bottom' type='button' style='margin-right: 5px;'>" + name + "</button>");
                    //    flog('appended to', $('.GroupList'));
                    //} else {
                    //    var toRemove = $('.GroupList button').filter(function() {
                    //        return $(this).text() == name;
                    //    });
                    //    toRemove.remove();
                    //}
                } else {
                    flog('error', data);
                    Msg.error('Sorry, couldnt save ' + data);
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry, couldnt save - ' + resp);
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}
