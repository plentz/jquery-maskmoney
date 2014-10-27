"use strict";

module("data-dash api");
test("with field configured using data-* attributes", function() {
    var input = $("#input3").maskMoney();
    input.val("123456.78");
    input.trigger("focus");
    equal(input.val(), "R$123.456,78", "configure maskMoney using data-* attributes");
});

test("configuring a setting that isn't a single word", function() {
    var input = $("#input3");
    input.attr("data-allow-zero", "true");
    input.maskMoney();
    input.val("0");
    input.trigger("mask").trigger("blur");
    equal(input.val(), "R$0,00", "it works by using dashes-pattern instead of camelCase");
});
