"use strict";

module("mask");
test("simple", function() {
    var $mm = $("#input1").maskMoney();
    $mm.val("");
    $mm.maskMoney("mask");
    equal($mm.val(), "0.00", "mask method when trigged correctly formatted input value");
});

test("with a number as parameter", function() {
    var $mm = $("#input1").maskMoney();
    $mm.maskMoney("mask", 123456.78);
    equal($mm.val(), "123,456.78", "mask method when trigged with a number as parameter correctly formatted input value");
});
