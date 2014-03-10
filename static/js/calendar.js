$(document).ready(function() {
    flog("init calendar");
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
		
        editable: true,
			
        allDayDefault: false,
			
        events: "_DAV/PROPFIND?fields=name>id,spliffy:summary>title,spliffy:start,spliffy:end,spliffy:url&depth=3",
			
        eventDrop: function(event, deltaDays, minuteDelta) {
            flog("eventDrop", event, deltaDays, minuteDelta);
            //addStartDate(event, deltaDays, minuteDelta);
            //addEndDate(event, deltaDays, minuteDelta);
            updateEvent(event);
        },
			
        eventResize: function(event, deltaDays, minuteDelta) {
            //addStartDate(event, 0, 0);
            //addEndDate(event, deltaDays, minuteDelta);
            updateEvent(event);
        }
    		
    });
		
});
	
	
function addStartDate(event, deltaDays, minuteDelta) {
    var startDate = $.fullCalendar.parseDate( event.start );
    flog("addStartDate", event.start,deltaDays, startDate);    
    //startDate.setDate( startDate.getDate() + deltaDays );
    flog(" = ", startDate);
    //d.setDate(d.getDate() + deltaDays);
    //d.setMinutes(d.getMinutes() + minuteDelta);
    flog("got new date", startDate);
        
    //event.start = startDate;
    //setEventDate(startDate, d);
}

function addEndDate(event, deltaDays,minuteDelta) {
    flog("addEndDate", event);
    var sEndDate = event.end;
    if( !sEndDate ) {
        return;
    }
    var endDate = $.fullCalendar.parseDate( sEndDate );
    flog("addEndDate3", endDate);
    
    var yr = endDate.year;
    if( yr < 1900 ) {
        yr = yr + 1900;
    }
    var d = new Date(yr,endDate.month,endDate.date, endDate.hours, endDate.minutes);
    d.setDate(d.getDate() + deltaDays);
    d.setMinutes(d.getMinutes() + minuteDelta);        
    event.end = d;
    setEventDate(endDate, d);
}
	
function setEventDate(eventDate, date) {
    eventDate.date = date.getDate();
    eventDate.month = date.getMonth();
    eventDate.year = date.getFullYear();
    eventDate.hours = date.getHours();
    eventDate.minutes = date.getMinutes();
}

function updateEvent(event) {
    var sdt = toFormattedGMTDate(event.start);
    var edt = toFormattedGMTDate(event.end);
	   
    var data = "spliffy:startDate=" + sdt;
    if( edt ) {
        data += "&spliffy:endDate=" + edt;
    }
	   
    flog('start date: ', sdt, 'endDate: ', edt, event);
    //return;
	   	   
    $.ajax({
        type: 'POST',
        url: event.id + "/_DAV/PROPPATCH",
        data: data
    });

}
	
function toFormattedGMTDate(d) {
    if( d ) {        
        flog("toFormattedGMTDate", d);
        //d.setMinutes(d.getMinutes() + eventDate.timezoneOffset);
        var sdt = d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); // + "GMT";
        return sdt;
    } else {
        return "";
    }
}
	
function pad(i) {
    if( i < 10 ) {
        return "0" + i;
    } else {
        return i;
    }
}




