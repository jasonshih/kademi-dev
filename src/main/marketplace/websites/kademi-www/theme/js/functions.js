jQuery(document).ready(function(){
    init();
    initPageContent();
//    log("init pjax", $('#menu ul li a'));
//    $('#menu ul li a').pjax2('#outer-wrapper', {
//        fragment: "#outer-wrapper",
//        success: function() {
//            $('#menu ul li').removeClass("active");
//            initPageContent();
//        }
//    });
//    $('#subnav ul li a').pjax2('#content .inner', {
//        fragment: "#content .inner",
//        success: function() {
//        // dont bother with page init for subnav
//        }
//    });    
    
})

function init() {
    // Menu Pointer
    jQuery('#menu ul li a').hover(function(e) {
        jQuery(this).parent().css('background-position', 'bottom');
    }, function(e) {
        jQuery(this).parent().css('background-position', -130);
    });
	

    // Login Box
    jQuery('.login-btn').click(function(e) {
        jQuery('#login-box').toggle(200);
		
        return false;
    });
    jQuery(document).click(function(e) {
        jQuery('#login-box').hide(100);
    });
    jQuery('#login-box').click(function(e) {
        e.stopPropagation();
    });
	
    jQuery('.forget-paswword').click(function(e) {
        jQuery('.login-form').hide(200);
        jQuery('.forget-login-form').show(200);
    });
	
    jQuery('.login-form-link').click(function(e) {
        jQuery('.forget-login-form').hide(200);
        jQuery('.login-form').show(200);
    });
    $(".login-inner").user({
        urlSuffix: "/login",
        userNameProperty: "username",
        passwordProperty: "password",
        callback: function() {
            alert("logged in");
        }
    });
}

/**
 * Must be called after every pjax transition
 */
function initPageContent() {
    var thisHref = window.location.pathname;
    $('#menu ul li a').each(function(i, n) {
        var node = $(n);
        var href = node.attr("href");
        if( !href.startsWith("/")) {
            href = "/" + href;
        }
        if( thisHref.startsWith( href ) ) {
            node.parent().addClass("active");
        } else {
        //			node.parent().removeClass("active");		
        }
    });

    // Price Table 
    //    jQuery('#price-table ul li').hover(function(e) {
    //        var rowH = jQuery(this).innerHeight();
    //        var popupMargin = rowH - 20;
    //        jQuery(this).addClass('highlight');
    //        jQuery(this).find('.price-popup').show();
    //        jQuery(this).find('.price-popup').css('bottom', popupMargin);
    //    }, function(e) {
    //        jQuery(this).removeClass('highlight');
    //        jQuery(this).find('.price-popup').hide();
    //    });
	
    jQuery('#price-table ul li:first').addClass('first');
    jQuery('#price-table ul li:last').css('border', 0).addClass('last');
    
    // FAQ
    jQuery('.faq-link').click(function(e) {
        jQuery(this).parent().html('FAQs you might like to know...');
        jQuery('.wrapper-faqs').slideToggle();		
        return false;
    }); 
	jQuery('input[type="text"], input[type="tel"], input[type="email"], input[type="password"]').focus(function() {
        if (this.value == this.defaultValue){
            this.value = '';
        }
        if(this.value != this.defaultValue){
            this.select();
        }
    });
    jQuery('input[type="text"], input[type="tel"], input[type="email"], input[type="password"]').blur(function() {
        if (this.value == ''){
            this.value = this.defaultValue;
        }
    });
	jQuery('textarea').focus(function() {
        if (this.value == this.defaultValue){
            this.value = '';
        }
        if(this.value != this.defaultValue){
            this.select();
        }
    });
    jQuery('textarea').blur(function() {
        if (this.value == ''){
            this.value = this.defaultValue;
        }
    });      
}
