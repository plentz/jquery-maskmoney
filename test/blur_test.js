"use strict";

module("blur");
test("with default mask", function() {
  var input = $("#input1").maskMoney();
  input.val("12345678");
  input.trigger("focus");
  input.trigger("blur");
  equal(input.val(), "123,456.78", "format the value of the field on focus");
});

test("with allowZero set to true", function() {
  var input = $("#input1").maskMoney({allowZero: true});
  input.val("0");
  input.trigger("focus");
  input.trigger("blur");
  equal(input.val(), "0.00", "format the value of the field on focus");
});

test("with allowZero set to false", function() {
  var input = $("#input1").maskMoney({allowZero: false});
  input.val("0");
  input.trigger("focus");
  input.trigger("blur");
  equal(input.val(), "", "format the value of the field on focus");
});

test("with treatEmptyAsZero set to true and allowZero set to true", function() {
  var input = $("#input1").maskMoney({allowZero: true, treatEmptyAsZero: true});
  input.val("");
  input.trigger("focus");
  input.trigger("blur");
  equal(input.val(), "0.00", "format the value of the field on focus");
});

test("with treatEmptyAsZero set to true and allowZero set to false", function() {
  var input = $("#input1").maskMoney({allowZero: false, treatEmptyAsZero: true});
  input.val("");
  input.trigger("focus");
  input.trigger("blur");
  equal(input.val(), "", "format the value of the field on focus");
});

test("with treatEmptyAsZero set to false and allowZero set to true", function() {
  var input = $("#input1").maskMoney({allowZero: true, treatEmptyAsZero: false});
  input.val("");
  input.trigger("focus");
  input.trigger("blur");
  equal(input.val(), "", "format the value of the field on focus");
});

test("with treatEmptyAsZero set to false and allowZero set to true, a zero input should be 0", function() {
  var input = $("#input1").maskMoney({allowZero: true, treatEmptyAsZero: false});
  input.trigger("focus");
  input.val("0.00");
  input.trigger("blur");
  equal(input.val(), "0.00", "format the value of the field on focus");
});

test("with treatEmptyAsZero set to false and allowZero set to false", function() {
  var input = $("#input1").maskMoney({allowZero: false, treatEmptyAsZero: false});
  input.val("");
  input.trigger("focus");
  input.trigger("blur");
  equal(input.val(), "", "format the value of the field on focus");
});

