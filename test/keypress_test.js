"use strict";

module("typing with default settings");
test("format the field value", function() {
    var input = $("#input1").maskMoney();
    keypress(input, 1);
    keypress(input, 2);
    keypress(input, 3);
    keypress(input, 4);
    keypress(input, 5);
    keypress(input, 6);

    equal(input.val(), "1,234.56", "format the value of the field on focus");
});

// Couldn't get this test working. If you can, please do:
//test("backspace should persist mask", function() {
//    var input = $("#input1").maskMoney();
//    keypress(input, 1);
//    keypress(input, 2);
//    keypress(input, 3);
//    keypress(input, 4);
//    keypress(input, 5);
//    keypress(input, 6);
//    keypress(input, 7);
//    keypress(input, 8);
//    equal(input.val(), "123,456.78", "format the value of the field on focus");
//    keypress(input, 'backspace');
//    keypress(input, 'backspace');
//    equal(input.val(), "1,234.56", "format the value of the field on focus");
//});
