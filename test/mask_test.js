"use strict";

module("mask");
test("simple", function() {
    var input = $("#input1").maskMoney();
    input.val("");
    input.maskMoney("mask");
    equal(input.val(), "0.00", "mask method when trigged correctly formatted input value");
});

test("with a number as parameter", function() {
    var input = $("#input1").maskMoney();
    input.maskMoney("mask", 123456.78);
    equal(input.val(), "123,456.78", "mask method when trigged with a number as parameter correctly formatted input value");
});

test("with a negative number as parameter", function() {
    var input = $("#input1").maskMoney({allowNegative: true});
    input.maskMoney("mask", -123456.78);
    equal(input.val(), "-123,456.78", "mask method when trigged with a negative number as parameter correctly formatted input value");
});
