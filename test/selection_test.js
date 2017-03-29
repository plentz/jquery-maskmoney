"use strict";

module("double click selection");
test("when double clicking", function() {
    var input = $("#input1").maskMoney();
    input.val("123.45");
    input.maskMoney("mask");
    input.trigger("dblclick");
    equal(input.val(), "123.45", "the content does not change");
});

test("when double clicking and hitting delete", function() {
    var input = $("#input1").maskMoney();
    input.val("12345");
    input.maskMoney("mask");
    input.trigger("dblclick");
    keydown(input, "backspace");
    equal(input.val(), "0.00", "all the content is cleared");
});