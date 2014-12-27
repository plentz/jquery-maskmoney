"use strict";

module("max");
test("prevents the insertion of more characters", function() {
    var input = $("#input1").maskMoney({ max: 1 });
    keypress(input, 1);
    keypress(input, 2);

    equal(input.val(), "1");
});
