(function($) {
	"use strict";

	module("focus");
	test("with default mask", function() {
		var input = $("#input1").maskMoney();
		input.focus().val("12345678");
		//TODO: IE bug, works after focus twice. First one not working.
		strictEqual(input.focus().val(), "12,345,678.00", "format the value of the field on focus");
	});
}(jQuery));