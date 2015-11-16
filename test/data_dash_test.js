(function($) {
	"use strict";

	QUnit.module("data-dash api");
	QUnit.test("with field configured using data-* attributes", function() {
		var input = $("#input3").val("12345678").maskMoney().trigger("mask");		
		strictEqual(input.val(), "R$12.345.678,00", "configure maskMoney using data-* attributes");
	});

	QUnit.test("configuring a setting that isn't a single word", function() {
		var input = $("#input3");
		input.attr("data-allow-zero", "true");
		input.maskMoney();
		input.val("0");
		input.trigger("mask");
		strictEqual(input.val(), "R$0,00", "it works by using dashes-strictEqual instead of camelCase");
	});

	QUnit.test("allow to configure multiple fields using data-* attributes", function() {
		var input = $(".multiple-dash").maskMoney();
		input.val("12345678");
		input.trigger("mask");
		strictEqual($("#input3").val(), "R$12.345.678,00", "configure maskMoney using data-* attributes");
		strictEqual($("#input4").val(), "U$12,345,678.00", "configure maskMoney using data-* attributes");
	});
}(jQuery));