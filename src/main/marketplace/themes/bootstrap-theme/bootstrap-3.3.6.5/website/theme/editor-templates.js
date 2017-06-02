/*
 Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.addTemplates('default',{
    imagesPath: "/templates/themes/bootstrap335/editor-icons/",
    templates:[


        {
            title:'Show/Hide Button',
            image:'template-show-hide.png',
            description:'A button which causes all following content to be initially hidden, and is only shown when clicked',
            //html:'<h6 class="btnHideFollowing">Type the title here</h6>'
            html:'<h6 type="button" class="btn btn-default btnHideFollowing"><span>Action here</span></h6>'
        },
        {
            title:'Accentuated box',
            image:'template-accentuated-box.png',
            description:'A box to add empasis to any block of content',
            html:'<div class="accentuated alert alert-info"><p>Type the text here</p></div><br/>'
        },
        // TODO, paddy says not working
//    {
//        title:'Text over image2',
//        image:'icon_floating_type.gif',
//        description:'A resizable box with text floating over an image',
//        html:'<div class="textOverImage"><img src="/static/editor/gear.png" class="bgImage"/><div>Text goes here</div></div><br/>'
//    },
        {
            title:'Table - striped',
            image:'template-table.png',
            description:'A table with alternating row colours',
            html:'<table width="100%" class="table table-striped"><thead><tr><th></th><th></th><th></th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><br/>'
        },
        {
            title:'Table in panel (rounded corners)',
            image:'template-table.png',
            description:'A table inside a panel, with rounded corners and heading',
            html:'<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">Panel heading</h3></div><div class="table-container"><table width="100%" class="table"><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table></div></div>'
        },
        {
            title:'Block quote with citation',
            image:'template-block-quote.png',
            description:'A block quote, with footer text for the source of the quote',
            html:'<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p><footer>Someone famous in <cite title="Source Title">Source Title</cite></footer></blockquote>'
        },
        {
            title:'List group',
            image:'template-list.png',
            description:'List groups are a flexible and powerful component for displaying not only simple lists of elements, but complex ones with custom content.',
            html:'<ul class="list-group"><li class="list-group-item">Cras justo odio</li></ul>'
        }  ,
        {
            title:'2 column layout table, 60/30',
            image:'',
            description:'A table that gives you 2 columns',
            html:'<table width="100%" class="table"><tbody><tr><td width="66%"></td><td></td></tr></tbody></table><br/>'
        },
        {
            title:'2 column layout table, 50/50',
            image:'',
            description:'A table that gives you 2 columns',
            html:'<table width="100%" class="table"><tbody><tr><td width="50%"></td><td></td></tr></tbody></table><br/>'
        },
        {
            title:'2 column layout table, 30/60',
            image:'',
            description:'A table that gives you 2 columns',
            html:'<table width="100%" class="table"><tbody><tr><td width="33%"></td><td></td></tr></tbody></table><br/>'
        },

    ]
});
//
//    <div class="panel panel-default dropdown-btn collapsed">
//        <div class="panel-heading" >
//            <h3 class="panel-title"><a class="panel-toggle">Panel title</a></h3>
//        </div>
//        
//        <div id="collapseOne" class="panel-collapse collapse">
//            <div class="panel-body">
//            Panel content
//            </div>
//        </div>		
//    </div>

