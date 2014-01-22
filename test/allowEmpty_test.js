"use strict";

module("allowEmpty");

// Test allowZero: false with 0 default value
test("allowZero: false -  mask empties default 0 value", function() {
    var input = $("#input4").maskMoney();
    input.trigger("mask");
    equal(input.val(), "", "0 value should be empty due to settings");
});

// Test allowZero: true with 0 default value
test("allowZero: true - mask keeps default 0 value", function() {
    var input = $("#input5").maskMoney();
    input.trigger("mask");
    equal(input.val(), "0.00$", "0 value should be 0.00$ due to settings");
});

// Test allowZero: false with 0 input
test("allowZero: false -  mask empties 0 input value", function() {
    var input = $("#input4").maskMoney();
    keypress(input, 0);
    equal(input.val(), "", "0 value should be empty due to settings");
});

// Test allowZero: true with 0 input
test("allowZero: true - mask keeps 0 input value", function() {
    var input = $("#input5").maskMoney();
    keypress(input, 0);
    equal(input.val(), "0.00$", "0 value should be 0.00$ due to settings");
});

// Test allowZero: false with input changes to a zero value
test("allowZero: false - input changes to a zero value (empty due to setting)", function() {
    var input = $("#input4").maskMoney();
    input.trigger("mask"); // formats the 0 default value

    keypress(input, 1);
    keypress(input, 2);
    keypress(input, 3);

    keydown(input, "backspace");
    keydown(input, "backspace");
    keydown(input, "backspace");

    equal(input.val(), "", "field should be empty");
});

// Test allowZero: true with input changes to a zero value
test("allowZero: true - input changes to a zero value", function() {
    var input = $("#input5").maskMoney();
    input.trigger("mask"); // formats the 0 default value

    keypress(input, 1);
    keypress(input, 2);
    keypress(input, 3);

    keydown(input, "backspace");
    keydown(input, "backspace");
    keydown(input, "backspace");

    equal(input.val(), "0.00$", "field should be 0.00$");
});

// Test allowZero: true with input changes to an empty value
test("allowZero: true - backspace on zero value changes to empty", function() {
    var input = $("#input5").maskMoney();
    input.trigger("mask"); // formats the 0 default value

    keypress(input, 1);
    keypress(input, 2);
    keypress(input, 3);

    keydown(input, "backspace");
    keydown(input, "backspace");
    keydown(input, "backspace"); // zero value
    keydown(input, "backspace"); // one more backspace will make it empty

    equal(input.val(), "", "field should be empty");
});