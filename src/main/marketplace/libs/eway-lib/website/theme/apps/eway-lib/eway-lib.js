$(function () {
    $(document).on("onBeforeCheckout", function (e, data, form) {
                //  eCrypt.encryptValue(value, key);
        var encKey = form.find("input[name=encKey]").val();
        if( console.log ) {
            console.log("before crypto", encKey, data.cardnumber, data.cardcvn);
        }

        data.cardnumber = eCrypt.encryptValue(data.cardnumber, encKey);
        data.cardcvn = eCrypt.encryptValue(data.cardcvn, encKey);
        if( console.log ) {
            console.log("applied crypto", data.cardnumber, data.cardcvn);
        }
    });
});