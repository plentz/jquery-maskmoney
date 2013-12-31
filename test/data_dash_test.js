"use strict";

module("data-dash api");
test("with default mask", function() {
    var input = $("#input3").maskMoney();
    input.val("12345678");
    input.trigger("focus");
    equal(input.val(), "R$123.456,78", "configure maskMoney using data-* attributes");
});
