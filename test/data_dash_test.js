(function($) {
	"use strict";

	module("data-dash api");
	test("with field configured using data-* attributes", function() {
		var input = $("#input3").maskMoney();
		input.val("12345678");
		input.trigger("focus");
		strictEqual(input.val(), "R$12.345.678,00", "configure maskMoney using data-* attributes");
	});

	test("configuring a setting that isn't a single word", function() {
		var input = $("#input3");
		input.attr("data-allow-zero", "true");
		input.maskMoney();
		input.val("0");
		input.trigger("mask");
		strictEqual(input.val(), "R$0,00", "it works by using dashes-strictEqual instead of camelCase");
	});

	test("allow to configure multiple fields using data-* attributes", function() {
		var input = $(".multiple-dash").maskMoney();
		input.val("12345678");
		input.trigger("focus");
		strictEqual($("#input3").val(), "R$12.345.678,00", "configure maskMoney using data-* attributes");
		strictEqual($("#input4").val(), "U$12,345,678.00", "configure maskMoney using data-* attributes");
	});
}(jQuery));