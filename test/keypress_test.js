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
