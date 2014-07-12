"use strict";

// stop()/start() is used when you have async tests. since we use setTimeout({}, 0)
// to call mask() inside cutPasteEvent function, we need to use them

module("cut & paste");
test("when cuting", function() {
    stop();
    var input = $("#input1").maskMoney();
    input.val("12345678");
    input.trigger("cut");
    setTimeout( function() {
        start();
        equal(input.val(), "123,456.78", "format the value of the field");
    }, 1);
});

test("when pasting", function() {
    stop();
    var input = $("#input1").maskMoney();
    input.val("12345678");
    input.trigger("paste");
    setTimeout( function() {
        start();
        equal(input.val(), "123,456.78", "format the value of the field");
    }, 1);
});

test("when pasting w/ decimalOnly: true", function() {
    stop();
    var input = $("#input1").maskMoney({decimalOnly:true});
    input.val("1.23");
    input.trigger("paste");
    setTimeout( function() {
        start();
        equal(input.val(), "0.23", "format the value of the field");
    }, 1);
});


