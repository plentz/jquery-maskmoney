(function($) {
	"use strict";

	module("focus");
	QUnit.test("with default mask", function() {
		var input = $("#input1").maskMoney();
		input.val("12345678");
		$(input).focus();				
		strictEqual(input.val(), "12,345,678.00", "format the value of the field on focus");
	});
}(jQuery));