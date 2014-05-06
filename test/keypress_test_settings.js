"use strict";

module("typing with decimalOnly");
test("decimalOnly : true - reject third keystroke", function(){
    var input = $("#input1").maskMoney({decimalOnly:true});
    input.trigger("focus");
    keypress(input, 1);
    keypress(input, 2);
    keypress(input, 3);

    equal(input.val(), "0.12", "format the value of the field on focus");
});
