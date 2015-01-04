

function addStartDate(event, deltaDays, minuteDelta) {
    flog("addStartDate", deltaDays, minuteDelta, event.start, event.end);
    var d = event.start; //new Date(yr, sdt.month, sdt.date, sdt.hours, sdt.minutes);
    d.setDate(d.getDate() + deltaDays);
    d.setMinutes(d.getMinutes() + minuteDelta);
    event.start = d;
    flog("new start date", d, event);
//    setEventDate(event.startDate, d);
}

function addEndDate(event, deltaDays, minuteDelta) {
    flog("addEndDate", deltaDays, minuteDelta, event.end);
    var d = event.end;
    d.setDate(d.getDate() + deltaDays);
    d.setMinutes(d.getMinutes() + minuteDelta);
    event.end = d;
    flog("new end date", d);
//    setEventDate(event.endDate, d);
}

function parseISO8601(iso8601) {
    var s = $.trim(iso8601);
    s = s.replace(/\.\d+/, ""); // remove milliseconds
    s = s.replace(/-/, "/").replace(/-/, "/");
    s = s.replace(/T/, " ").replace(/Z/, " UTC");
    s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
    return new Date(s);
}


function setEventDate(eventDate, date) {
//    eventDate.date = date.getDate();
//    eventDate.month = date.getMonth();
//    eventDate.year = date.getFullYear();
//    eventDate.hours = date.getHours();
//    eventDate.minutes = date.getMinutes();
}

function updateEvent(event) {
    flog("updateEvent", event.start, event.end);
    var sdt = toFormattedGMTDate(event.start);
    var edt = toFormattedGMTDate(event.end);

    flog("dates", sdt, edt);
    //return;

    $.ajax({
        type: 'POST',
        url: event.url,
        data: {
            startDate: sdt,
            endDate: edt
        }
    });

}

function toFormattedGMTDate(eventDate) {
    var d = eventDate;
    //d.setMinutes(d.getMinutes() + eventDate.timezoneOffset);    
    var sdt = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); // + "GMT";
    flog("toFormattedGMT", sdt, d);
    return sdt;
}

function pad(i) {
    if (i < 10) {
        return "0" + i;
    } else {
        return i;
    }
}

function adjustStartDate(event, deltaDays, minuteDelta) {
    adjustDates(event, "start", deltaDays, minuteDelta);
}
function adjustEndDate(event, deltaDays, minuteDelta) {
    adjustDates(event, "end", deltaDays, minuteDelta);
}
function adjustDates(event, type, deltaDays, minuteDelta) {
    flog("adjustStartDate", event.start, event.end);
    $.ajax({
        type: 'POST',
        url: event.url,
        data: {
            adjustType: type,
            deltaDays: deltaDays,
            minuteDelta: minuteDelta
        }
    });
}

