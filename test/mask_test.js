"use strict";

module("mask");
test("when triggered in a empty field", function() {
    var input = $("#input1").maskMoney();
    input.val("");
    input.maskMoney("mask");
    equal(input.val(), "0.00", "set zero as the value");
});

test("with a lot of leading zeros", function() {
    var input = $("#input1").maskMoney();
    input.val("000000000123");
    input.maskMoney("mask");
    equal(input.val(), "123.00", "removes the unecessary zeroes");
});

QUnit.skip("with a pre-formatted number", function() {
    var input = $("#input1").maskMoney();
    input.val("123,45");
    input.maskMoney("mask");
    equal(input.val(), "123.45", "keeps the number precision");
});

QUnit.skip("with a pre-formatted number smaller than the set precision", function() {
    var input = $("#input1").maskMoney();
    input.val("123,4");
    input.maskMoney("mask");
    equal(input.val(), "123.40", "keeps the number precision");
});

test("with negative symbol and a field that doesn't allow negative ", function() {
    var input = $("#input1").maskMoney({allowNegative: false});
    input.val("-123");
    input.maskMoney("mask");
    equal(input.val(), "123.00", "removes negative symbol");
});

QUnit.skip("with a number as parameter", function() {
    var input = $("#input1").maskMoney();
    input.maskMoney("mask", 123456.70);
    equal(input.val(), "123,456.70");
});

test("with a number as parameter", function() {
    var input = $("#input1").maskMoney({ precision: 0 });
    input.maskMoney("mask", 1000);
    equal(input.val(), "1,000");
});


test("with a decimal number as parameter", function() {
    var input = $("#input1").maskMoney();
    input.maskMoney("mask", 1.1);
    equal(input.val(), "1.10");
});

test("with a decimal number as parameter and different symbol", function() {
    var input = $("#input1").maskMoney({thousands: ".", decimal: ","});
    input.maskMoney("mask", 2001.1);
    equal(input.val(), "2.001,10");
});

test("without a decimal number as parameter and different symbol", function() {
    var input = $("#input1").maskMoney({thousands: ".", decimal: ","});
    input.maskMoney("mask", 2001);
    equal(input.val(), "2.001,00");
});



test("with a negative number as parameter", function() {
    var input = $("#input1").maskMoney({allowNegative: true});
    input.maskMoney("mask", -123456.78);
    equal(input.val(), "-123,456.78");
});

test("with a suffix", function() {
    var input = $("#input1").maskMoney({suffix: " €"});
    input.maskMoney("mask", 20316.22);
    equal(input.val(), "20,316.22 €");
});
