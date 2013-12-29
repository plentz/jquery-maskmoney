test("chainable", function() {
  ok($("input:first").maskMoney().val("123"), "can be chained");
  equal($("input:first").val(), "123", "class was added correctly from chaining");
});

test("mask", function() {
  var $mm = $("input").maskMoney();
  $mm.val("");
  $mm.maskMoney("mask");
  equal($mm.val(), "0.00", "mask method when trigged correctly formatted input value");
  $mm.maskMoney("mask", 123456.78);
  equal($mm.val(), "123,456.78", "mask method when trigged with a number as parameter correctly formatted input value");
});


