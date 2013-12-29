"use strict";

module("focus");
test("with prefix", function() {
    var $mm = $("#input1").maskMoney();
    $mm.val("12345678");
    $mm.trigger("focus");
    equal($mm.val(), "123,456.78", "format the value of the field on focus");
});
