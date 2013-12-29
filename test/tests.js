test("chainable", function() {
  ok($("#input1").maskMoney().val("123"), "can be chained");
  equal($("#input1").val(), "123", "class was added correctly from chaining");
});


test("init", function() {
  var events, $mm = $("#input1").maskMoney();
  events = jQuery._data($mm.get(0), "events");
  ok(events.blur, "attached the blur event");
  ok(events.keypress, "attached the keypress event");
  ok(events.keydown, "attached the keydown event");
  ok(events.focus, "attached the focus event");
  ok(events.click, "attached the click event");
});


test("destroy", function() {
  var events, $mm = $("#input1").maskMoney();
  $mm.maskMoney("destroy");
  events = jQuery._data($mm.get(0), "events");
  equal(events, undefined, "destroy method removed all attached events");
});


module("mask");
test("simple", function() {
  var $mm = $("#input1").maskMoney();
  $mm.val("");
  $mm.maskMoney("mask");
  equal($mm.val(), "0.00", "mask method when trigged correctly formatted input value");
});

test("with a number as parameter", function() {
  var $mm = $("#input1").maskMoney();
  $mm.maskMoney("mask", 123456.78);
  equal($mm.val(), "123,456.78", "mask method when trigged with a number as parameter correctly formatted input value");
});


module("unmasked");
test("with prefix", function() {
  var unmasked, $mm = $("#input1");
  $mm.val("+ 123.456,78");
  unmasked = $mm.maskMoney("unmasked")[0];
  equal(unmasked, 123456.78, "unmask method return the correct number when the field value has prefix");
});

test("with suffix", function() {
  var unmasked, $mm = $("#input1");
  $mm.val("123.456,78 €");
  unmasked = $mm.maskMoney("unmasked")[0];
  equal(unmasked, 123456.78, "unmask method return the correct number when the field value has suffix");
});

test("with prefix and suffix", function() {
  var unmasked, $mm = $("#input1");
  $mm.val("+ 123.456,78 €");
  unmasked = $mm.maskMoney("unmasked")[0];
  equal(unmasked, 123456.78, "unmask method return the correct number when the field value has prefix and suffix");
});

test("with collection of fields", function() {
  var unmaskedCollection, $mm = $(".all");
  $("#input1").val("+ 123.456,78 €");
  $("#input2").val("R$ 876.543,21");
  unmaskedCollection = $mm.maskMoney("unmasked").get();
  deepEqual(unmaskedCollection, [123456.78, 876543.21], "unmask method return the correct number when the field value has prefix and suffix");
});


module("focus");
test("with prefix", function() {
  var $mm = $("#input1").maskMoney();
  $mm.val("12345678");
  $mm.trigger("focus");
  equal($mm.val(), "123,456.78", "format the value of the field on focus");
});

