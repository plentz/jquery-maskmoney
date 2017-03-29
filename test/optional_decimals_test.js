"use strict";

module("optional decimals");

test("testing basic entry with unenforced decimals",function() {
    var input = $("#input1").maskMoney({ 
        allowNoDecimal: true
    });

    input.trigger("focus");
    keypress(input, 1);
    keypress(input, 2);
    keypress(input, 3);
    keypress(input, 4);
    keypress(input, 5);
    keypress(input, 6);
    keypress(input, 7);

    equal(input.val(), "1,234,567", "accept the input and format correctly");

    // no idea why this doesn't work. so I'm hacking around it to simulate keypress
    // keypress(input, ".");
    input.val(input.val() + ".");
    keypress(input, 8);
    keypress(input, 9);
    keypress(input, 0);

    equal(input.val(), "1,234,567.89", "accept the input and format correctly");
});

test("testing basic entries with unenforced decimals and variable precision",function() {
    var input = $("#input1").maskMoney({ 
        allowNoDecimal: true,
        precision: 3
    });

    input.trigger("focus");
    keypress(input, 1);
    keypress(input, 2);
    keypress(input, 3);
    keypress(input, 4);
    keypress(input, 5);
    keypress(input, 6);
    keypress(input, 7);

    equal(input.val(), "1,234,567", "accept the input and format correctly");

    // no idea why this doesn't work. so I'm hacking around it to simulate keypress
    // keypress(input, ".");
    input.val(input.val() + ".");
    keypress(input, 8);
    keypress(input, 9);
    keypress(input, 0);

    equal(input.val(), "1,234,567.890", "accept the input and format correctly");

    keypress(input, 1);

    equal(input.val(), "1,234,567.890", "accept the input and format correctly");
});

test("testing prefilled entries with unenforced decimals",function() {
    var input = $("#input1").maskMoney({ 
        allowNoDecimal: true 
    });

    input.val("1234567.890");
    input.trigger("focus");

    equal(input.val(), "1,234,567.89", "accept the input and format correctly");
});

test("testing prefilled entries with unenforced decimals and variable precision",function() {
    var input = $("#input1").maskMoney({ 
        allowNoDecimal: true,
        precision: 3 
    });

    input.val("1234567.890");
    input.trigger("focus");

    equal(input.val(), "1,234,567.890", "accept the input and format correctly");

    input.val("1234567.8901");
    input.trigger("focus");

    equal(input.val(), "1,234,567.890", "accept the input and format correctly");
});

test("testing unmask of unenforced decimals", function() {
    var input = $("#input1").maskMoney({ 
        allowNoDecimal: true
    });

    input.val("1,234,567");
    input.maskMoney("mask");

    equal(input.maskMoney("unmasked")[0], 1234567.00, "check appropriate unmasked precision");


    input.val("1234567.89");
    input.maskMoney("mask");

    equal(input.maskMoney("unmasked")[0], 1234567.89);

    input.val("1234567.8901234");
    input.maskMoney("mask");

    equal(input.maskMoney("unmasked")[0], 1234567.89);

});