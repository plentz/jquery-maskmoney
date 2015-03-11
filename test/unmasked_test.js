"use strict";

module("unmasked");
test("with prefix", function() {
    var input = $("#input1"),
        unmasked;
    input.val("+ 123.456,78").maskMoney({ decimal: "," });
    unmasked = input.maskMoney("unmasked")[0];
    equal(unmasked, 123456.78, "unmask method return the correct number when the field value has prefix");
});

test("with suffix", function() {
    var input = $("#input1"),
        unmasked;
    input.val("123.456,78 €").maskMoney({ decimal: "," });
    unmasked = input.maskMoney("unmasked")[0];
    equal(unmasked, 123456.78, "unmask method return the correct number when the field value has suffix");
});

test("with prefix and suffix", function() {
    var input = $("#input1"),
        unmasked;
    input.val("+ 123.456,78 €").maskMoney({ decimal: "," });
    unmasked = input.maskMoney("unmasked")[0];
    equal(unmasked, 123456.78, "unmask method return the correct number when the field value has prefix and suffix");
});

test("with negative number", function() {
    var input = $("#input1"),
        unmasked;
    input.val("-R$ 123.456,78").maskMoney({ decimal: "," });
    unmasked = input.maskMoney("unmasked")[0];
    equal(unmasked, -123456.78, "unmask method return the correct number when the field value has prefix and suffix");
});

test("with collection of fields", function() {
    var input = $(".all"),
        unmaskedCollection;
    $("#input1").val("+ 123.456,78 €").maskMoney({ decimal: "," });
    $("#input2").val("R$ 876.543,21").maskMoney({ decimal: "," });
    unmaskedCollection = input.maskMoney("unmasked").get();
    deepEqual(unmaskedCollection, [123456.78, 876543.21], "unmask method return the correct number when the field value has prefix and suffix");
});
