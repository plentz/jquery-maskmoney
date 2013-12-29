"use strict";

var KEY_TO_KEYCODE_MAP = {
    0: 48, 1: 49,
    2: 50, 3: 51,
    4: 52, 5: 53,
    6: 54, 7: 55,
    8: 56, 9: 57,
    "shift": 16, "ctrl": 17, "alt": 18,
    "backspace": 8, "tab": 9,
    "enter": 13, "esc": 27, "space": 32,
    "left": 37, "up": 38,
    "right": 39, "down": 40,
    "delete": 46,
    "home": 36, "end": 35,
    ",": 188, ".": 190,
    "-": 189, "=": 187,
};

function keypress(input, key) {
    input.trigger($.Event("keypress", { keyCode: KEY_TO_KEYCODE_MAP[key] } ));
}

function keydown(input, key) {
    input.trigger($.Event("keydown", { keyCode: KEY_TO_KEYCODE_MAP[key] } ));
}
