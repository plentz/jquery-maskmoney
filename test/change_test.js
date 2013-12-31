"use strict";

module("change");
test("it calls the change event when the field's value is changed", function() {
    var input = $("#input1").maskMoney(),
        changeWasCalled = false;

    input.change(function() {
        changeWasCalled = true;
    });
    input.val("0.01");
    input.trigger("focus");
    keypress(input, 1);
    input.trigger("blur");
    ok(changeWasCalled, "change was called");
    equal(input.val(), "0.11", "changed value");
});

test("it doesn't call the change event when the field's value is unchanged", function() {
    var input = $("#input1").maskMoney(),
        changeWasCalled = false;

    input.change(function() {
        changeWasCalled = true;
    });
    input.val("0.01");
    input.trigger("focus");
    input.trigger("blur");
    ok(!changeWasCalled, "change was not called");
    equal(input.val(), "0.01", "changed value");
});
