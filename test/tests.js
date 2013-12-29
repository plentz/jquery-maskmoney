test("chainable", function() {
  ok($("input:first").maskMoney().val("123"), "can be chained");
  equal($("input:first").val(), "123", "class was added correctly from chaining");
});

module("mask");
test("simple", function() {
  var $mm = $("input:first").maskMoney();
  $mm.val("");
  $mm.maskMoney("mask");
  equal($mm.val(), "0.00", "mask method when trigged correctly formatted input value");
});

test("with a number as parameter", function() {
  var $mm = $("input:first").maskMoney();
  $mm.maskMoney("mask", 123456.78);
  equal($mm.val(), "123,456.78", "mask method when trigged with a number as parameter correctly formatted input value");
});



module("unmasked");
test("with prefix", function() {
  var unmasked, $mm = $("input:first");
  $mm.val("+ 123.456,78");
  unmasked = $mm.maskMoney("unmasked")[0];
  equal(unmasked, 123456.78, "unmask method return the correct number when the field value has prefix");
});

test("with suffix", function() {
  var unmasked, $mm = $("input:first");
  $mm.val("123.456,78 €");
  unmasked = $mm.maskMoney("unmasked")[0];
  equal(unmasked, 123456.78, "unmask method return the correct number when the field value has suffix");
});

test("with prefix and suffix", function() {
  var unmasked, $mm = $("input:first");
  $mm.val("+ 123.456,78 €");
  unmasked = $mm.maskMoney("unmasked")[0];
  equal(unmasked, 123456.78, "unmask method return the correct number when the field value has prefix and suffix");
});

test("with collection of fields", function() {
  var unmasked, $mm = $(".all");
  $("#input1").val("+ 123.456,78 €");
  $("#input2").val("R$ 876.543,21");
  unmaskedCollection = $mm.maskMoney("unmasked").get();
  deepEqual(unmaskedCollection, [123456.78, 876543.21], "unmask method return the correct number when the field value has prefix and suffix");
});

