"use strict";

module("unmasked");
test("with prefix", function() {
    var unmasked, $mm = $("#input1");
    $mm.val("+ 123.456,78");
    unmasked = $mm.maskMoney("unmasked")[0];
    equal(unmasked, 123456.78, "unmask method return the correct number when the field value has prefix");
});

test("with suffix", function() {
    var unmasked, $mm = $("#input1");
    $mm.val("123.456,78 €");
    unmasked = $mm.maskMoney("unmasked")[0];
    equal(unmasked, 123456.78, "unmask method return the correct number when the field value has suffix");
});

test("with prefix and suffix", function() {
    var unmasked, $mm = $("#input1");
    $mm.val("+ 123.456,78 €");
    unmasked = $mm.maskMoney("unmasked")[0];
    equal(unmasked, 123456.78, "unmask method return the correct number when the field value has prefix and suffix");
});

test("with collection of fields", function() {
    var unmaskedCollection, $mm = $(".all");
    $("#input1").val("+ 123.456,78 €");
    $("#input2").val("R$ 876.543,21");
    unmaskedCollection = $mm.maskMoney("unmasked").get();
    deepEqual(unmaskedCollection, [123456.78, 876543.21], "unmask method return the correct number when the field value has prefix and suffix");
});
