/**
 * Created by Anh on 4/15/2016.
 *
 * This file contains js overrides for bs335.leadman
 */

$(function(){
    var menuNotify = $('.menuNotifications');
    if(menuNotify.length){
        var str = menuNotify.find('a').attr('title');
        var count = $('<div>'+str+'</div').find('.badge').text();
        if(!count){
            count = '0';
        }
        menuNotify.find('a').attr('title', 'Notifications('+count+')');
    }
});