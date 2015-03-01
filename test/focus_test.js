"use strict";

module("focus");
test("with default mask", function() {
    var input = $("#input1").maskMoney();
    input.val("12345678");
    input.trigger("focus");
    equal(input.val(), "12,345,678.00", "format the value of the field on focus");
});

test("with treatEmptyAsZero set to true", function() {
  var input = $("#input1").maskMoney({treatEmptyAsZero: true});
  input.val("");
  input.trigger("focus");
  equal(input.val(), "0.00", "format the value of the field on focus");
});

test("with treatEmptyAsZero set to false", function() {
  var input = $("#input1").maskMoney({treatEmptyAsZero: false});
  input.val("");
  input.trigger("focus");
  equal(input.val(), "", "format the value of the field on focus");
});

test("with treatEmptyAsZero set to false with space input", function() {
  var input = $("#input1").maskMoney({treatEmptyAsZero: false});
  input.val(" ");
  input.trigger("focus");
  equal(input.val(), "", "format the value of the field on focus");
});


test("with treatEmptyAsZero set to false and allowZero set to true", function() {
  var input = $("#input1").maskMoney({allowZero: true, treatEmptyAsZero: false});
  input.val("");
  input.trigger("focus");
  equal(input.val(), "", "format the value of the field on focus");
});
