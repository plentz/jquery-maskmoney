"use strict";

module("mask");
test("when triggered in a empty field", function() {
    var input = $("#input1").maskMoney();
    input.val("");
    input.maskMoney("mask");
    equal(input.val(), "0.00", "set zero as the value");
});

test("with a lot of leading zeroes", function() {
    var input = $("#input1").maskMoney();
    input.val("000000000123");
    input.maskMoney("mask");
    equal(input.val(), "1.23", "removes the unecessary zeroes");
});

test("with negative symbol and a field that doesn't allow negative ", function() {
    var input = $("#input1").maskMoney({allowNegative: false});
    input.val("-123");
    input.maskMoney("mask");
    equal(input.val(), "1.23", "removes negative symbol");
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
