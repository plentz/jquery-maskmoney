(function($) {
	"use strict";

	module("mask");
	test("when triggered in a empty field", function() {
		var input = $("#input1").maskMoney();
		input.val("");
		input.maskMoney("mask");
		strictEqual(input.val(), "0.00", "set zero as the value");
	});

	test("with a lot of leading zeros", function() {
		var input = $("#input1").maskMoney();
		input.val("000000000123");
		input.maskMoney("mask");
		strictEqual(input.val(), "123.00", "removes the unecessary zeroes");
	});

	//TODO: come back later 
	// test("with a pre-formatted number", function() {
	//     var input = $("#input1").maskMoney();
	//     input.val("123,45");
	//     input.maskMoney("mask");
	//     strictEqual(input.val(), "12,345.00", "keeps the number precision 1");
	// });

	// test("with a pre-formatted number smaller than the set precision 2", function() {
	//     var input = $("#input1").maskMoney();
	//     input.val("123,4");
	//     input.maskMoney("mask");
	//     strictEqual(input.val(), "1,234.00", "keeps the number precision 3");
	// });

	// test("with a number as parameter", function() {
	//     var input = $("#input1").maskMoney({ precision: 0 });
	//     input.maskMoney("mask", 123456.70);
	//     strictEqual(input.val(), "123,456.70", "keeps the number precision");
	// });

	test("with negative symbol and a field that doesn't allow negative ", function() {
		var input = $("#input1").maskMoney({allowNegative: false});
		input.val("-123");
		input.maskMoney("mask");
		strictEqual(input.val(), "123.00", "removes negative symbol");
	});

	test("with a number as parameter", function() {
		var input = $("#input1").maskMoney({ precision: 0 });
		input.maskMoney("mask", 1000);
		strictEqual(input.val(), "1,000");
	});

	test("with a negative number as parameter", function() {
		var input = $("#input1").maskMoney({allowNegative: true});
		input.maskMoney("mask", -123456.78);
		strictEqual(input.val(), "-123,456.78");
	});

	test("with a suffix", function() {
		var input = $("#input1").maskMoney({suffix: " €"});
		input.maskMoney("mask", 20316.22);
		strictEqual(input.val(), "20,316.22 €");
	});
}(jQuery));