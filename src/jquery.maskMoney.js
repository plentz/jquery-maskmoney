(function ($) {
    "use strict";
    if (!$.browser) {
        $.browser = {};
        $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    }

    var methods = {
        destroy : function () {
            $(this).unbind(".maskMoney");

            if ($.browser.msie) {
                this.onpaste = null;
            }
            return this;
        },

        masked : function(settings){
            var maskObj = maskClass.apply(this, [settings]),
                $this = $(this);
        
            if ($this.is("input")){
                $this.val(maskObj.maskValue($this.val()));
            } else { 
                $this.text(maskObj.maskValue($this.text()));
            }            
            return $this;
        },

        mask : function (value) {
            return this.each(function () {
                var $this = $(this),
                    decimalSize;
                if (typeof value === "number") {
                    $this.trigger("mask");
                    decimalSize = $($this.val().split(/\D/)).last()[0].length;
                    value = value.toFixed(decimalSize);
                    $this.val(value);
                }
                return $this.trigger("mask");
            });
        },

        unmasked : function () {
            return this.map(function () {
                var value = ($(this).val() || "0"),
                    isNegative = value.indexOf("-") !== -1,
                    decimalPart;
                // get the last position of the array that is a number(coercion makes "" to be evaluated as false)
                $(value.split(/\D/).reverse()).each(function (index, element) {
                    if(element) {
                        decimalPart = element;
                        return false;
                   }
                });
                value = value.replace(/\D/g, "");
                value = value.replace(new RegExp(decimalPart + "$"), "." + decimalPart);
                if (isNegative) {
                    value = "-" + value;
                }
                return parseFloat(value);
            });
        },

        init : function (settings) {
            return this.each(function () {
                var maskObj = maskClass.apply(this, [settings]),
                    $input = $(this);
                
                $input.unbind(".maskMoney");
                $input.bind("keypress.maskMoney", maskObj.keypressEvent);
                $input.bind("keydown.maskMoney", maskObj.keydownEvent);
                $input.bind("blur.maskMoney", maskObj.blurEvent);
                $input.bind("focus.maskMoney", maskObj.focusEvent);
                $input.bind("click.maskMoney", maskObj.clickEvent);
                $input.bind("cut.maskMoney", maskObj.cutPasteEvent);
                $input.bind("paste.maskMoney", maskObj.cutPasteEvent);
                $input.bind("mask.maskMoney", maskObj.mask);
            });
        }
    };

    var maskClass = function(settings){
        var $input = $(this),
            onFocusValue;
            
        settings = $.extend({
            prefix: "",
            suffix: "",
            affixesStay: true,
            thousands: ",",
            decimal: ".",
            precision: 2,
            allowZero: false,
            allowNegative: false,
            decimalAfterDot: false
        }, settings, $input.data());
       
        var handler = {
            getInputSelection : function(){
                var el = $input.get(0),
                    start = 0,
                    end = 0,
                    normalizedValue,
                    range,
                    textInputRange,
                    len,
                    endRange;

                if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
                    start = el.selectionStart;
                    end = el.selectionEnd;
                } else {
                    range = document.selection.createRange();

                    if (range && range.parentElement() === el) {
                        len = el.value.length;
                        normalizedValue = el.value.replace(/\r\n/g, "\n");

                        // Create a working TextRange that lives only in the input
                        textInputRange = el.createTextRange();
                        textInputRange.moveToBookmark(range.getBookmark());

                        // Check if the start and end of the selection are at the very end
                        // of the input, since moveStart/moveEnd doesn't return what we want
                        // in those cases
                        endRange = el.createTextRange();
                        endRange.collapse(false);

                        if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                            start = end = len;
                        } else {
                            start = -textInputRange.moveStart("character", -len);
                            start += normalizedValue.slice(0, start).split("\n").length - 1;

                            if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                                end = len;
                            } else {
                                end = -textInputRange.moveEnd("character", -len);
                                end += normalizedValue.slice(0, end).split("\n").length - 1;
                            }
                        }
                    }
                }

                return {
                    start: start,
                    end: end
                };
            },

            canInputMoreNumbers : function() {
                var haventReachedMaxLength = !($input.val().length >= $input.attr("maxlength") && $input.attr("maxlength") >= 0),
                    selection = handler.getInputSelection(),
                    start = selection.start,
                    end = selection.end,
                    haveNumberSelected = (selection.start !== selection.end && $input.val().substring(start, end).match(/\d/)) ? true : false,
                    startWithZero = ($input.val().substring(0, 1) === "0");
                return haventReachedMaxLength || haveNumberSelected || startWithZero;
            },

            setCursorPosition : function(pos) {
                $input.each(function (index, elem) {
                    if (elem.setSelectionRange) {
                        elem.focus();
                        elem.setSelectionRange(pos, pos);
                    } else if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.collapse(true);
                        range.moveEnd("character", pos);
                        range.moveStart("character", pos);
                        range.select();
                    }
                });
            },

            setSymbol : function(value) {
                var operator = "";
                if (value.indexOf("-") > -1) {
                    value = value.replace("-", "");
                    operator = "-";
                }
                return operator + settings.prefix + value + settings.suffix;
            },

            maskValue : function(value) {
                var negative = (value.indexOf("-") > -1 && settings.allowNegative) ? "-" : "",
                    decimalAdd = handler.checkDecimalAfterDot(value),
                    onlyNumbers = value.replace(/[^0-9]/g, ""),
                    integerPart = decimalAdd || !settings.decimalAfterDot ? onlyNumbers.slice(0, onlyNumbers.length - settings.precision) : onlyNumbers,
                    newValue,
                    decimalPart,
                    leadingZeros;

                // remove initial zeros
                integerPart = integerPart.replace(/^0*/g, "");
                // put settings.thousands every 3 chars
                integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousands);
                if (integerPart === "") {
                    integerPart = "0";
                }
                newValue = negative + integerPart;

                if (settings.precision > 0 && (decimalAdd || !settings.decimalAfterDot)) {
                    decimalPart = onlyNumbers.slice(onlyNumbers.length - settings.precision);
                    leadingZeros = new Array((settings.precision + 1) - decimalPart.length).join(0);
                    newValue += settings.decimal + leadingZeros + decimalPart;
                }
                
                return handler.setSymbol(newValue);
            },

            maskAndPosition : function(startPos) {
                var originalLen = $input.val().length,
                    newLen;
                $input.val(handler.maskValue($input.val()));
                newLen = $input.val().length;
                startPos = startPos - (originalLen - newLen);
                handler.setCursorPosition(startPos);
            },

            mask : function() {
                var value = $input.val();
                $input.val(handler.maskValue(value));
            },

            changeSign : function() {
                var inputValue = $input.val();
                if (settings.allowNegative) {
                    if (inputValue !== "" && inputValue.charAt(0) === "-") {
                        return inputValue.replace("-", "");
                    } else {
                        return "-" + inputValue;
                    }
                } else {
                    return inputValue;
                }
            },

            preventDefault : function (e) {
                if (e.preventDefault) { //standard browsers
                    e.preventDefault();
                } else { // old internet explorer
                    e.returnValue = false;
                }
            },

            keypressEvent : function (e) {
                e = e || window.event;
                var key = e.which || e.charCode || e.keyCode,
                    keyPressedChar = String.fromCharCode(key),
                    needDecimalDot = handler.checkDecimalAfterDot(keyPressedChar),
                    selection,
                    startPos,
                    endPos,
                    value;

                //added to handle an IE "special" event
                if (key === undefined) {
                    return false;
                }

                // any key except the numbers 0-9
                if (!needDecimalDot && key < 48 || key > 57) {
                    // -(minus) key
                    if (key === 45) {
                        $input.val(handler.changeSign());
                        return false;
                    // +(plus) key
                    } else if (key === 43) {
                        $input.val($input.val().replace("-", ""));
                        return false;
                    // enter key or tab key
                    } else if (key === 13 || key === 9) {
                        return true;
                    } else if ($.browser.mozilla && (key === 37 || key === 39) && e.charCode === 0) {
                        // needed for left arrow key or right arrow key with firefox
                        // the charCode part is to avoid allowing "%"(e.charCode 0, e.keyCode 37)
                        return true;
                    } else { // any other key with keycode less than 48 and greater than 57
                        handler.preventDefault(e);
                        return true;
                    }
                } else if (!needDecimalDot && !handler.canInputMoreNumbers()) {
                    return false;
                } else {
                    handler.preventDefault(e);

                    selection = handler.getInputSelection();
                    startPos = selection.start;
                    endPos = selection.end;
                    value = $input.val();
                    $input.val(value.substring(0, startPos) + keyPressedChar + value.substring(endPos, value.length));
                    handler.maskAndPosition(startPos + 1);
                    return false;
                }
            },

            keydownEvent : function (e) {
                e = e || window.event;
                var key = e.which || e.charCode || e.keyCode,
                    selection,
                    startPos,
                    endPos,
                    value,
                    lastNumber;
                //needed to handle an IE "special" event
                if (key === undefined) {
                    return false;
                }

                selection = handler.getInputSelection();
                startPos = selection.start;
                endPos = selection.end;

                if (key === 8 || key === 46 || key === 63272) { // backspace or delete key (with special case for safari)
                    handler.preventDefault(e);

                    value = $input.val();
                    // not a selection
                    if (startPos === endPos) {
                        // backspace
                        if (key === 8) {
                            if (settings.suffix === "") {
                                startPos -= 1;
                            } else {
                                // needed to find the position of the last number to be erased
                                lastNumber = value.split("").reverse().join("").search(/\d/);
                                startPos = value.length - lastNumber - 1;
                                endPos = startPos + 1;
                            }
                        //delete
                        } else {
                            endPos += 1;
                        }
                    }

                    $input.val(value.substring(0, startPos) + value.substring(endPos, value.length));

                    handler.maskAndPosition(startPos);
                    return false;
                } else if (key === 9) { // tab key
                    return true;
                } else { // any other key
                    return true;
                }
            },

            focusEvent : function () {
                onFocusValue = $input.val();
                handler.mask();
                var input = $input.get(0),
                    textRange;
                if (input.createTextRange) {
                    textRange = input.createTextRange();
                    textRange.collapse(false); // set the cursor at the end of the input
                    textRange.select();
                }
            },

            cutPasteEvent : function () {
                setTimeout(function() {
                    handler.mask();
                }, 0);
            },

            getDefaultMask : function () {
                var n = parseFloat("0") / Math.pow(10, settings.precision);
                return (n.toFixed(settings.precision)).replace(new RegExp("\\.", "g"), settings.decimal);
            },

            blurEvent : function (e) {
                if ($.browser.msie) {
                    handler.keypressEvent(e);
                }

                if ($input.val() === "" || $input.val() === handler.setSymbol(handler.getDefaultMask())) {
                    if (!settings.allowZero) {
                        $input.val("");
                    } else if (!settings.affixesStay) {
                        $input.val(handler.getDefaultMask());
                    } else {
                        $input.val(handler.setSymbol(handler.getDefaultMask()));
                    }
                } else {
                    if (!settings.affixesStay) {
                        var newValue = $input.val().replace(settings.prefix, "").replace(settings.suffix, "");
                        $input.val(newValue);
                    }
                }
                if ($input.val() !== onFocusValue) {
                    $input.change();
                }
            },

            clickEvent : function () {
                var input = $input.get(0),
                    length;
                if (input.setSelectionRange) {
                    length = $input.val().length;
                    input.setSelectionRange(length, length);
                } else {
                    $input.val($input.val());
                }
            },

            checkDecimalAfterDot : function (string){
                return settings.decimalAfterDot && new RegExp("[.,"+(!/[.,\s]/.test(settings.decimal) ? settings.decimal : "")+"](?:\\d+)?$").test(string);
            }
        };
        
        $input.val(handler.maskValue($input.val()));
        
        return handler;
    };
    
    $.fn.maskMoney = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " +  method + " does not exist on jQuery.maskMoney");
        }
    };
})(window.jQuery || window.Zepto);
