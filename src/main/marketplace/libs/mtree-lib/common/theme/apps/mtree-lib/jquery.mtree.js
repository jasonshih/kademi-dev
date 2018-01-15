(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
}(function ($, undefined) {
    var log = function () {
        var args = Array.prototype.slice.apply(arguments);
        args[0] = '[MTree] ' + args[0];
        flog.apply(null, args);
    };
    
    var ASSETS_HREF = '/assets/';
    
    var DEFAULTS = {
        pagePath: null,
        basePath: window.location.href,
        showToolbar: true,
        showAssets: true,
        onlyFolders: false,
        theme: 'default',
        excludedEndPaths: [],
        includeContentType: null,
        onSelect: function (node, type, url, hash, isAsset) {
            
        },
        onDelete: function (node, parentFolder, type) {
            
        },
        onCreate: function (node, parentNode, type) {
            
        },
        onTabSwitch: function (tabType) {
        
        }
    };
    
    function MTree(target, options) {
        log('Initialize', target, options);
        
        this.target = target;
        this.options = $.extend({}, DEFAULTS, options);
        this.init();
    };
    
    MTree.DEFAULTS = DEFAULTS;
    
    MTree.prototype.init = function () {
        var self = this;
        var options = self.options;
        var target = self.target;
        
        var htmlContent = '';
        htmlContent += '<div class="mtree-wrapper">';
        if (options.showToolbar) {
            htmlContent += '    <div class="mtree-toolbar">';
            htmlContent += '        <button type="button" class="btn btn-success btn-sm mtree-btn-add-folder" title="Add folder"><i class="fa fa-plus"></i></button>';
            htmlContent += '        <button type="button" class="btn btn-danger btn-sm mtree-btn-delete-file" title="Delete"><i class="fa fa-times"></i></button>';
            if (options.showAssets) {
                htmlContent += '    <button type="button" class="btn btn-danger btn-sm mtree-btn-delete-asset" title="Delete" style="display: none"><i class="fa fa-times"></i></button>';
            }
            htmlContent += '    </div>';
        }
        if (options.showAssets) {
            var filesTabId = self.generateId('tab-files');
            var assetsTabId = self.generateId('tab-assets');
            
            htmlContent += '    <ul class="nav nav-tabs mtree-tabs">';
            htmlContent += '        <li class="active"><a href="#' + filesTabId + '" data-toggle="tab" data-type="files">Files</a></li>';
            htmlContent += '        <li><a href="#' + assetsTabId + '" data-toggle="tab" data-type="assets">Assets</a></li>';
            htmlContent += '    </ul>';
            htmlContent += '    <div class="tab-content mtree-tab-contents">';
            htmlContent += '        <div class="tab-pane tab-pane-files active" id="' + filesTabId + '">';
            htmlContent += '            <div class="mtree mtree-files"></div>';
            htmlContent += '        </div>';
            htmlContent += '        <div class="tab-pane tab-pane-assets" id="' + assetsTabId + '">';
            htmlContent += '            <p><input type="text" class="form-control mtree-assets-finder" /></p>';
            htmlContent += '            <div class="mtree mtree-assets"></div>';
            htmlContent += '        </div>';
            htmlContent += '    </div>';
        } else {
            htmlContent += '    <div class="mtree mtree-files panel panel-default"></div>';
        }
        htmlContent += '</div>';
        
        target.html(htmlContent);
        
        self.treeFiles = target.find('.mtree-files');
        
        if (options.showToolbar) {
            self.toolbar = target.find('.mtree-toolbar');
            self.btnDeleteFile = self.toolbar.find('.mtree-btn-delete-file').on('click', function (e) {
                e.preventDefault();
                
                var selectedNode = self.getSelectedFileNode();
                
                if (selectedNode) {
                    self.deleteNode(selectedNode);
                }
            });
            
            if (options.showAssets) {
                self.btnDeleteAsset = self.toolbar.find('.mtree-btn-delete-asset').on('click', function (e) {
                    e.preventDefault();
                    
                    var selectedNode = self.getSelectedAssetNode();
                    
                    if (selectedNode) {
                        self.deleteNode(selectedNode);
                    }
                });
            }
            
            self.btnAddFolder = self.toolbar.find('.mtree-btn-add-folder').on('click', function (e) {
                e.preventDefault();
                
                self.addFolder(prompt('Please enter name of new folder'));
            });
        }
        
        self.initTree();
        
        if (options.showAssets) {
            self.treeAssets = target.find('.mtree-assets');
            self.txtAssetsFinder = self.target.find('.mtree-assets-finder');
            self.tabs = target.find('.mtree-tabs a[data-toggle="tab"]');
            self.initTree(true);
            self.initTabs();
            self.adjustTabHeight();
        }
    };
    
    MTree.prototype.adjustTabHeight = function () {
        var self = this;
        var tabsWrapper = self.target.find('.mtree-tabs');
        self.target.find('.mtree-tab-contents').css('top', tabsWrapper.outerHeight() + tabsWrapper.position().top - 1);
    };
    
    MTree.prototype.initTabs = function () {
        var self = this;
        var options = self.options;
        
        self.tabs.on('show.bs.tab', function () {
            var type = $(this).attr('data-type');
            
            if (type === 'assets') {
                self.btnAddFolder.hide()
                self.btnDeleteAsset.show()
                self.btnDeleteFile.hide();
            } else {
                self.btnAddFolder.show();
                self.btnDeleteAsset.hide()
                self.btnDeleteFile.show();
            }
            
            if (typeof options.onTabSwitch === 'function') {
                options.onTabSwitch.call(self, type);
            }
        });
    };
    
    MTree.prototype.deleteNode = function (node) {
        log('deleteNode', node);
        
        var self = this;
        var options = self.options;
        
        var name = node.attr('data-name');
        var href = node.attr('href');
        var type = node.attr('data-type');
        var isAsset = node.hasClass('mtree-asset');
        var nodeWrapper = node.parent();
        var callbackAfterDeleted = function () {
            log('Node is deleted');
            
            var parentFolders = nodeWrapper.parents('.mtree-folder-wrapper');
            var parentFolder = null;
            if (parentFolders.length > 0) {
                parentFolder = parentFolders.eq(0).children('.mtree-node.mtree-folder');
            }
            
            if (typeof options.onDelete) {
                options.onDelete.call(self, node, parentFolder, type);
            }
            
            if (isAsset) {
                self.jstreeAssets.delete_node([node.attr('id')]);
            } else {
                self.jstreeFiles.delete_node([node.attr('id')]);
                self.jstreeFiles.select_node(parentFolder);
            }
        };
        
        if (isAsset) {
            if (confirm('Are you sure you want to delete ' + name + '?')) {
                $.ajax({
                    type: 'DELETE',
                    url: href,
                    success: function () {
                        callbackAfterDeleted();
                    },
                    error: function (resp) {
                        log('Error in deleting asset', resp);
                        alert('Sorry, an error occured deleting ' + href + '. Please check your internet connection');
                    }
                });
            }
        } else {
            confirmDelete(href, name, callbackAfterDeleted);
        }
    };
    
    MTree.prototype.initTree = function (isAssets) {
        var self = this;
        var options = self.options;
        var target = isAssets ? self.treeAssets : self.treeFiles;
        
        // Init jstree
        target.jstree({
            'core': {
                'check_callback': true,
                'multiple': false,
                'data': function (node, callback) {
                    log('Load data for folder node', node);
                    
                    var loadUrl;
                    var dataRequest;
                    if (isAssets) {
                        loadUrl = ASSETS_HREF;
                        dataRequest = {
                            q: self.txtAssetsFinder.val() || '',
                            type: options.includeContentType
                        }
                    } else {
                        if (node.id === '#') {
                            loadUrl = options.basePath;
                        } else {
                            loadUrl = node.a_attr.href;
                        }
                        
                        loadUrl = self.getPropFindUrl(loadUrl);
                    }
                    log('Load url: ' + loadUrl);
                    
                    $.ajax({
                        url: loadUrl,
                        dataType: 'json',
                        type: 'get',
                        data: dataRequest,
                        success: function (resp) {
                            log('Tree data from server', resp);
                            
                            var treeData = [];
                            var data = resp;
                            if (isAssets) {
                                data = resp.data;
                            }
                            
                            $.each(data, function (index, item) {
                                if (isAssets) {
                                    treeData.push(self.generateItemData(item, index));
                                } else {
                                    if (item.iscollection || !options.onlyFolders) {
                                        if (index > 0 && self.isDisplayable(item)) {
                                            treeData.push(self.generateItemData(item, index));
                                        }
                                    }
                                }
                            });
                            
                            log('Tree data', treeData);
                            callback(treeData);
                        },
                        error: function (xhr, statusCode, errorThrown) {
                            log('[MTree] Error when loading tree data', xhr, statusCode, errorThrown);
                        }
                    });
                }
            }
        });
        
        if (isAssets) {
            self.jstreeAssets = self.treeAssets.jstree(true);
            
            self.treeAssets.on('select_node.jstree', function (e, data) {
                var type = data.node.a_attr['data-type'];
                var url = data.node.a_attr['href'];
                var hash = data.node.a_attr['data-hash'] || '';
                var selectedNode = self.treeAssets.find('.mtree-node[id="' + data.node.a_attr['id'] + '"]');
                
                if (typeof options.onSelect === 'function') {
                    options.onSelect.call(self, selectedNode, type, url, hash, true);
                }
            });
            
            var timer = null;
            self.txtAssetsFinder.on('keydown', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.jstreeAssets.load_node('#');
                }, 250);
            });
        } else {
            self.jstreeFiles = self.treeFiles.jstree(true);
            
            self.treeFiles.on('loaded.jstree', function () {
                if (options.pagePath) {
                    self.openPath(options.pagePath);
                }
            });
            self.treeFiles.on('select_node.jstree', function (e, data) {
                var type = data.node.a_attr['data-type'];
                var url = data.node.a_attr['href'];
                var hash = data.node.a_attr['data-hash'] || '';
                var selectedNode = self.treeFiles.find('.mtree-node[id="' + data.node.a_attr['id'] + '"]');
                
                if (typeof options.onSelect === 'function') {
                    options.onSelect.call(self, selectedNode, type, url, hash, false);
                }
            });
        }
    };
    
    MTree.prototype.deselectNode = function (node) {
        if (node && node.hasClass('mtree-asset')) {
            this.jstreeAssets.deselect_node(this.treeAssets.find('.mtree-node.jstree-clicked'));
        } else {
            this.jstreeFiles.deselect_node(node || this.treeFiles.find('.mtree-node.jstree-clicked'));
        }
    };
    
    MTree.prototype.addFolder = function (name) {
        var self = this;
        
        if (name) {
            var selectedFolderHref = self.getSelectedFolderUrl();
            createFolder(name, selectedFolderHref, function () {
                self.addNode(selectedFolderHref + name + '/');
            })
        }
    };
    
    MTree.prototype.addNode = function (path) {
        var self = this;
        var options = self.options;
        var isAsset = path.indexOf('/assets/') === 0;
        
        log('addNode', path, isAsset);
        
        if (isAsset) {
            $.ajax({
                url: self.getPropFindUrl(path),
                cache: false
            }).done(function (data) {
                if (data && data[0]) {
                    var item = self.generateItemData(data[0]);
                    log('Data for new node', item);
                    
                    self.jstreeAssets.load_node('#', function () {
                        var newNode = self.treeAssets.find('.mtree-node[href="' + path + '"]');
                        
                        if (typeof options.onCreate === 'function') {
                            options.onCreate.call(self, newNode, null, item.type);
                        }
                        
                        self.deselectNode();
                        self.jstreeAssets.select_node(newNode);
                    });
                }
            });
        } else {
            var parentPath = self.getParentFolderUrl(path);
            
            self.openPath(parentPath, function (parentNode) {
                var parentId = parentNode ? parentNode.attr('id') : null;
                
                setTimeout(function () {
                    $.ajax({
                        url: self.getPropFindUrl(path),
                        cache: false
                    }).done(function (data) {
                        if (data && data[0]) {
                            var item = self.generateItemData(data[0]);
                            log('Data for new node', item);
                            
                            var existingNode = self.treeFiles.find('.mtree-node[href="' + escape(path) + '"]');
                            
                            if (existingNode && existingNode.length > 0) {
                                log('Delete old node', existingNode);
                                self.jstreeFiles.delete_node(existingNode);
                            }
                            
                            log('Add new node to parent id: ' + parentId);
                            self.jstreeFiles.create_node(parentId, item, 'first', function () {
                                var newNode = self.treeFiles.find('#' + item.id);
                                
                                if (typeof options.onCreate === 'function') {
                                    options.onCreate.call(self, newNode, parentNode, item.type);
                                }
                                
                                self.deselectNode();
                                self.jstreeFiles.select_node(newNode);
                            });
                        }
                    });
                })
            }, 300);
        }
    };
    
    MTree.prototype.generateId = function (type, suffix) {
        return 'mtree-' + type + '-' + (new Date()).getTime() + (suffix || '');
    };
    
    MTree.prototype.generateItemData = function (item, itemIndex) {
        var self = this;
        
        var type = item.iscollection ? 'folder' : 'file';
        item.type = type;
        item.id = item.id || self.generateId(type, itemIndex);
        item.icon = 'fa fa-' + type + '-o';
        item.text = item.name;
        item.state = {
            opened: false
        };
        
        item.a_attr = {
            class: 'mtree-node mtree-' + type,
            id: item.id,
            href: escape(item.href || ASSETS_HREF + item.uniqueId),
            'data-name': item.name,
            'data-type': type
        };
        item.li_attr = {
            class: 'mtree-node-wrapper mtree-' + type + '-wrapper'
        };
        
        if (item.hash) {
            item.a_attr['data-hash'] = item.hash;
        }
        
        if (item.iscollection) {
            item.children = true;
        }
        
        // Is assets
        if (item.uniqueId) {
            item.a_attr['data-asset'] = true;
            item.a_attr['class'] += ' mtree-asset';
            item.a_attr['data-format'] = item.format;
        }
        
        return item;
    };
    
    MTree.prototype.getCleanUrl = function (url) {
        return (url || '').replace(/\/\//g, '/');
    };
    
    MTree.prototype.getPropFindUrl = function (url) {
        var self = this;
        url = self.getCleanUrl(url + '/');
        
        url = url + '_DAV/PROPFIND?fields=name,milton:hash,getcontenttype>contentType,href,iscollection&depth=1';
        return url;
    };
    
    MTree.prototype.getSelectedFileNode = function () {
        var self = this;
        var selectedNodeIds = self.jstreeFiles.get_selected();
        
        if (selectedNodeIds && selectedNodeIds.length > 0) {
            return self.treeFiles.find('#' + selectedNodeIds[0]).find('.mtree-node').eq(0);
        }
        
        return null;
    }
    
    MTree.prototype.getSelectedAssetNode = function () {
        var self = this;
        var selectedNodeIds = self.jstreeAssets.get_selected();
        
        if (selectedNodeIds && selectedNodeIds.length > 0) {
            return self.treeAssets.find('#' + selectedNodeIds[0]).find('.mtree-node').eq(0);
        }
        
        return null;
    }
    
    MTree.prototype.getParentFolderUrl = function (url) {
        log('getParentFolderUrl', url);
        
        if (this.endsWith(url, '/')) {
            url = url.substr(0, url.length - 1);
        }
        
        return url.substr(0, url.lastIndexOf('/') + 1);
    };
    
    MTree.prototype.getSelectedFolder = function () {
        log('getSelectedFolder');
        
        var self = this;
        var selectedNode = self.getSelectedFileNode();
        log('Selected node', selectedNode);
        
        if (selectedNode) {
            if (selectedNode.attr('data-type') === 'folder') {
                return selectedNode;
            } else {
                var folder = selectedNode.closest('.mtree-folder-wrapper');
                
                if (folder.length > 0) {
                    return folder.children('.mtree-node.mtree-folder');
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    };
    
    MTree.prototype.getSelectedFolderUrl = function () {
        log('getSelectedFolderUrl');
        
        var self = this;
        var selectedFolder = self.getSelectedFolder();
        log('Selected folder', selectedFolder);
        
        if (selectedFolder) {
            return selectedFolder.attr('href');
        } else {
            return self.options.basePath;
        }
    };
    
    MTree.prototype.getRelativePath = function (url) {
        return url.substring(this.options.basePath.length, url.length);
    };
    
    MTree.prototype.openPath = function (url, callback) {
        log('openPath: ' + url);
        
        var self = this;
        var relPath = self.getRelativePath(url);
        if (self.endsWith(relPath, '/')) {
            relPath = relPath.substring(0, relPath.length - 1);
        }
        log('Relative path: ' + relPath);
        
        var pathParts = relPath ? relPath.split('/') : [];
        var openPathIndex = function (partIndex) {
            if (partIndex >= pathParts.length) {
                return;
            }
            
            var node = self.treeFiles.find('.mtree-node[data-name="' + pathParts[partIndex] + '"]');
            if (node.length > 0) {
                self.openNode(node, function () {
                    if (partIndex < pathParts.length) {
                        openPathIndex(partIndex + 1);
                    }
                    
                    if (partIndex === pathParts.length - 1) {
                        log('Last folder', node);
                        
                        self.deselectNode();
                        self.jstreeFiles.select_node(node);
                        
                        if (typeof callback === 'function') {
                            flog('Path "' + url + '" is opened');
                            callback(node);
                        }
                    }
                });
            }
        };
        
        if (pathParts.length > 0) {
            openPathIndex(0);
        } else {
            self.deselectNode();
            
            if (typeof callback === 'function') {
                flog('Path "' + url + '" is opened');
                callback(null);
            }
        }
    };
    
    MTree.prototype.openNode = function (node, callback) {
        if (node.length === 0) {
            log('Node does not exist', node);
            return;
        }
        
        if (node.hasClass('mtree-asset')) {
            this.jstreeAssets.open_node(node, callback);
        } else {
            this.jstreeFiles.open_node(node, callback);
        }
    };
    
    MTree.prototype.isDisplayable = function (item) {
        var self = this;
        var options = self.options;
        
        if (!item.iscollection) {
            if (options.includeContentType) {
                var isCorrectType;
                if (item.contentType && item.contentType.contains(options.includeContentType)) {
                    isCorrectType = true;
                }
                
                if (!isCorrectType) {
                    return false;
                }
            }
        }
        
        if (self.isExcluded(item.href)) {
            return false;
        } else if (!self.isDisplayableFileHref(item.href)) {
            return false;
        }
        
        return true;
    };
    
    MTree.prototype.isDisplayableFileHref = function (href) {
        var self = this;
        
        if (href == 'Thumbs.db') {
            return false;
        }
        if (self.endsWith(href, '/regs/')) {
            return false;
        }
        if (self.endsWith(href, '.MOI')) {
            return false;
        }
        if (self.endsWith(href, '.THM')) {
            return false;
        }
        
        return true;
    }
    
    MTree.prototype.isExcluded = function (href) {
        var self = this;
        var options = self.options;
        
        for (var i = 0; i < options.excludedEndPaths.length; i++) {
            var p = options.excludedEndPaths[i];
            if (self.endsWith(href, p)) {
                return true;
            }
        }
        return false;
    }
    
    MTree.prototype.endsWith = function (str, suffix) {
        if (typeof str === 'string') {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        } else {
            return false;
        }
    };
    
    $.fn.mtree = function (options) {
        var element = $(this)
        var data = element.data('mtree');
        
        if (!data) {
            element.data('mtree', (data = new MTree(element, options)));
        }
        
        if (typeof options == 'string') {
            return data[options].apply(data, Array.prototype.slice.call(arguments, 1));
        } else {
            return data;
        }
    };
    
    $.fn.mtree.constructor = MTree;
}));
