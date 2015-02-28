"use strict";

module("focus");
test("with default mask", function() {
    var input = $("#input1").maskMoney();
    input.val("123456.78");
    input.trigger("focus");
    equal(input.val(), "123,456.78", "format the value of the field on focus");
});
