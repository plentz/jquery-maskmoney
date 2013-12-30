"use strict";

test("chainable", function() {
    ok($("#input1").maskMoney().val("123"), "can be chained");
    equal($("#input1").val(), "123", "class was added correctly from chaining");
});

test("init", function() {
    var input = $("#input1").maskMoney(),
        events;
    events = jQuery._data(input.get(0), "events");
    ok(events.blur, "attached the blur event");
    ok(events.keypress, "attached the keypress event");
    ok(events.keydown, "attached the keydown event");
    ok(events.focus, "attached the focus event");
    ok(events.click, "attached the click event");
});


test("destroy", function() {
    var input = $("#input1").maskMoney(),
        events;
    input.maskMoney("destroy");
    events = jQuery._data(input.get(0), "events");
    equal(events, undefined, "destroy method removed all attached events");
});
