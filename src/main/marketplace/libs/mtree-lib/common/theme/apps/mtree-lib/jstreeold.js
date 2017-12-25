(function ($) {
    var methods = {
        addFile: function (name, href, hash) {
            var options = this.data('options');
            var tree = this.find('.jstree');
            flog('mtree:addFile', name, href, options);
            var js = {
                data: name,
                attr: {
                    'id': createNodeId(href, hash, options)
                }
            };
            var parentNode = $(options.selectedItem);
            flog('addFile, parentNode', parentNode);
            var icon = parentNode.find('> a > ins.jstree-icon');
            if (icon.hasClass('file')) {
                parentNode = parentNode.parent().closest('li');
                flog('addFile, parentNode2', parentNode);
            } else {
                flog('not a file', parentNode, icon);
            }
            var parent = null;
            if (parentNode && parentNode.length > 0) {
                parent = parentNode[0];
            } else {
                parent = null;
            }

            var r;
            if (parent) {
                flog('add inside', parent);
                r = $.jstree._reference(tree[0]).create_node(parent, 'inside', js);
            } else {
                flog('add root', parent);
                r = $.jstree._reference(tree[0]).create_node(-1, 'first', js);
            }
            flog('addFile: r=', r);
            if (r) {
                r.find('a ins').addClass('file');
                var ul = r.closest('ul');
                ul.find('li').sort(asc_sort).appendTo(ul);
                tree.mtree('select', r);
                //this.select(r);
                flog('done select', r);
            }
            parentNode.removeClass('jstree-closed');
            parentNode.addClass('jstree-open');
        }
    };

    $.fn.mtree = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist on jQuery.tooltip");
        }

    };
})(jQuery);