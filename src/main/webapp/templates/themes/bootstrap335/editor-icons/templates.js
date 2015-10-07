/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.addTemplates('default',{
    imagesPath: "/static/editor/",
    templates:[
    
    {
        title:'Activity box',
        image:'icon_activity.gif',
        description:'A box for a learning activity',
        html:'<div class="activity alert alert-info"><p>Type the text here</p></div><br/>'
    },    
    
    {
        title:'Show/Hide Button',
        image:'icon_show.gif',
        description:'A button which causes all following content to be initially hidden, and is only shown when clicked',
        //html:'<h6 class="btnHideFollowing">Type the title here</h6>'
        html:'<h6 type="button" class="btn btn-default btnHideFollowing"><span>Action here</span> <span class="caret">&nbsp;</span></h6>'
    },
    {
        title:'Accentuated box',
        image:'icon_accentuated.gif',
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
        title:'Striped table',
        image:'',
        description:'A table with alternating row colours',
        html:'<table width="100%" class="table table-striped"><thead><tr><th></th><th></th><th></th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><br/>'
    },
    {
        title:'Striped table, rows and columns',
        image:'',
        description:'A table with alternating row colours',
        html:'<table width="100%" class="striped striped-cols"><thead><tr><th></th><th></th><th></th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><br/>'
    },    
    {
        title:'Block quote with citation',
        image:'',
        description:'A block quote, with footer text for the source of the quote',
        html:'<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p><footer>Someone famous in <cite title="Source Title">Source Title</cite></footer></blockquote>'
    },                     
    {
        title:'List group',
        image:'',
        description:'List groups are a flexible and powerful component for displaying not only simple lists of elements, but complex ones with custom content.',
        html:'<ul class="list-group"><li class="list-group-item">Cras justo odio</li></ul>'
    },                
    

    
    {
        title:'2 Column Page layout',
        image:'',
        description:'A page width table with 2 columns',
        html:'<div class="row"><div class="col-md-6">First column</div><div class="col-md-6">Second column</div></div><br/>'
    },
        {
        title:'3 Column Page layout',
        image:'',
        description:'A page width table with 2 columns',
        html:'<div class="row"><div class="col-md-4">First column</div><div class="col-md-4">Second column</div><div class="col-md-4">Third column</div></div><br/>'
    }
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

