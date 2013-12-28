/*
* maskMoney plugin for jQuery
* http://plentz.github.com/jquery-maskmoney/
* version: 2.9.0
* Licensed under the MIT license
*/
(function ($) {
    if (!$.browser) {
        $.browser = {};
        $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    }

    var methods = {
        destroy : function () {
            $(this).unbind('.maskMoney');

            if ($.browser.msie) {
                this.onpaste = null;
            }
            return this;
        },

        mask : function (value) {
            return this.each(function () {
                var $this = $(this),
                    decimalSize;
                if (typeof value === 'number') {
                    $this.trigger('mask');
                    decimalSize = $($this.val().split(/\D/)).last()[0].length;
                    value = value.toFixed(decimalSize);
                    $this.val(value);
                }
                return $this.trigger('mask');
            });
        },

        unmasked : function () {
            return this.map(function () {
                var unmaskedStr = ($(this).val() || '0'),
                    isNegative = unmaskedStr.indexOf("-") !== -1,
                    decimalPart = $(unmaskedStr.split(/\D/)).last()[0];
                unmaskedStr = unmaskedStr.replace(/\D/g, '');
                unmaskedStr = unmaskedStr.replace(new RegExp(decimalPart + '$'), '.' + decimalPart);
                if (isNegative) {
                    unmaskedStr = "-" + unmaskedStr;
                }
                return parseFloat(unmaskedStr);
            });
        },

        init : function (settings) {
            settings = $.extend({
                prefix: '',
                suffix: '',
                affixesStay: true,
                thousands: ',',
                decimal: '.',
                precision: 2,
                allowZero: false,
                allowNegative: false
            }, settings);

            return this.each(function () {
                var $input = $(this),
                    dirty = false;

                // data-* api
                settings = $.extend(settings, $input.data());

                function markAsDirty() {
                    dirty = true;
                }

                function clearDirt() {
                    dirty = false;
                }

                function getInputSelection() {
                    var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange, el = $input.get(0);

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
                } // getInputSelection

                function canInputMoreNumbers() {
                    var haventReachedMaxLength = !($input.val().length >= $input.attr('maxlength') && $input.attr('maxlength') >= 0),
                        selection = getInputSelection(),
                        start = selection.start,
                        end = selection.end,
                        haveNumberSelected = (selection.start !== selection.end && $input.val().substring(start, end).match(/\d/)) ? true : false,
                        startWithZero = ($input.val().substring(0, 1) === '0');
                    return haventReachedMaxLength || haveNumberSelected || startWithZero;
                }

                function setCursorPosition(pos) {
                    $input.each(function (index, elem) {
                        if (elem.setSelectionRange) {
                            elem.focus();
                            elem.setSelectionRange(pos, pos);
                        } else if (elem.createTextRange) {
                            var range = elem.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    });
                    return this;
                }

                function setSymbol(value) {
                    var operator = '';
                    if (value.indexOf('-') > -1) {
                        value = value.replace('-', '');
                        operator = '-';
                    }
                    return operator + settings.prefix + value + settings.suffix;
                }

                function maskValue(value) {
                    var negative = (value.indexOf('-') > -1) ? '-' : '',
                        onlyNumbers = value.replace(/[^0-9]/g, ""),
                        integerPart = onlyNumbers.slice(0, onlyNumbers.length - settings.precision),
                        newValue,
                        decimalPart,
                        leadingZeros;

                    // remove initial zeros
                    integerPart = integerPart.replace(/^0/g, "");
                    // put settings.thousands every 3 chars
                    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousands);
                    if (integerPart === '') {
                        integerPart = '0';
                    }
                    newValue = negative + integerPart;

                    if (settings.precision > 0) {
                        decimalPart = onlyNumbers.slice(onlyNumbers.length - settings.precision);
                        leadingZeros = new Array((settings.precision + 1) - decimalPart.length).join(0);
                        newValue += settings.decimal + leadingZeros + decimalPart;
                    }
                    return setSymbol(newValue);
                }

                function maskAndPosition(startPos) {
                    var originalLen = $input.val().length;
                    $input.val(maskValue($input.val()));
                    var newLen = $input.val().length;
                    startPos = startPos - (originalLen - newLen);
                    setCursorPosition(startPos);
                }

                function mask() {
                    var value = $input.val();
                    $input.val(maskValue(value));
                }

                function changeSign() {
                    var inputValue = $input.val();
                    if (settings.allowNegative) {
                        if (inputValue !== '' && inputValue.charAt(0) === '-') {
                            return inputValue.replace('-', '');
                        } else {
                            return '-' + inputValue;
                        }
                    } else {
                        return inputValue;
                    }
                }

                function preventDefault(e) {
                    if (e.preventDefault) { //standard browsers
                        e.preventDefault();
                    } else { // old internet explorer
                        e.returnValue = false;
                    }
                }

                function keypressEvent(e) {
                    e = e || window.event;
                    var key = e.which || e.charCode || e.keyCode;
                    //needed to handle an IE "special" event
                    if (key === undefined) {
                        return false;
                    }
                    // any key except the numbers 0-9
                    if (key < 48 || key > 57) {
                        // -(minus) key
                        if (key === 45) {
                            markAsDirty();
                            $input.val(changeSign());
                            return false;
                        // +(plus) key
                        } else if (key === 43) {
                            markAsDirty();
                            $input.val($input.val().replace('-', ''));
                            return false;
                        // enter key or tab key
                        } else if (key === 13 || key === 9) {
                            if (dirty) {
                                clearDirt();
                                $input.change();
                            }
                            return true;
                        } else if ($.browser.mozilla && (key === 37 || key === 39) && e.charCode === 0) {
                            // needed for left arrow key or right arrow key with firefox
                            // the charCode part is to avoid allowing '%'(e.charCode 0, e.keyCode 37)
                            return true;
                        } else { // any other key with keycode less than 48 and greater than 57
                            preventDefault(e);
                            return true;
                        }
                    } else if (!canInputMoreNumbers()) {
                        return false;
                    } else {
                        preventDefault(e);

                        var keyPressedChar = String.fromCharCode(key);
                        var selection = getInputSelection();
                        var startPos = selection.start;
                        var endPos = selection.end;
                        var value = $input.val();
                        $input.val(value.substring(0, startPos) + keyPressedChar + value.substring(endPos, value.length));
                        maskAndPosition(startPos + 1);
                        markAsDirty();
                        return false;
                    }
                }

                function keydownEvent(e) {
                    e = e || window.event;
                    var key = e.which || e.charCode || e.keyCode;
                    //needed to handle an IE "special" event
                    if (key === undefined) {
                        return false;
                    }

                    var selection = getInputSelection();
                    var startPos = selection.start;
                    var endPos = selection.end;

                    if (key === 8 || key === 46 || key === 63272) { // backspace or delete key (with special case for safari)
                        preventDefault(e);

                        var value = $input.val();
                        // not a selection
                        if (startPos === endPos) {
                            // backspace
                            if (key === 8) {
                                if (settings.suffix === '') {
                                    startPos -= 1;
                                } else {
                                    // needed to find the position of the last number to be erased
                                    var lastNumber = value.split("").reverse().join("").search(/\d/);
                                    startPos = value.length - lastNumber - 1;
                                    endPos = startPos + 1;
                                }
                            //delete
                            } else {
                                endPos += 1;
                            }
                        }

                        $input.val(value.substring(0, startPos) + value.substring(endPos, value.length));

                        maskAndPosition(startPos);
                        markAsDirty();
                        return false;
                    } else if (key === 9) { // tab key
                        if (dirty) {
                            $input.change();
                            clearDirt();
                        }
                        return true;
                    } else { // any other key
                        return true;
                    }
                }

                function focusEvent(e) {
                    mask();
                    if (this.createTextRange) {
                        var textRange = this.createTextRange();
                        textRange.collapse(false); // set the cursor at the end of the input
                        textRange.select();
                    }
                }

                function getDefaultMask() {
                    var n = parseFloat('0') / Math.pow(10, settings.precision);
                    return (n.toFixed(settings.precision)).replace(new RegExp('\\.', 'g'), settings.decimal);
                }

                function blurEvent(e) {
                    if ($.browser.msie) {
                        keypressEvent(e);
                    }

                    if ($input.val() === '' || $input.val() === setSymbol(getDefaultMask())) {
                        if (!settings.allowZero) {
                            $input.val('');
                        } else if (!settings.affixesStay) {
                            $input.val(getDefaultMask());
                        } else {
                            $input.val(setSymbol(getDefaultMask()));
                        }
                    } else {
                        if (!settings.affixesStay) {
                            var newValue = $input.val().replace(settings.prefix, '').replace(settings.suffix, '');
                            $input.val(newValue);
                        }
                    }
                }

                function clickEvent(event) {
                    if (this.setSelectionRange) {
                        var length = $input.val().length;
                        this.setSelectionRange(length, length);
                    } else {
                        $input.val($input.val());
                    }
                }

                $input.unbind('.maskMoney');
                $input.bind('keypress.maskMoney', keypressEvent);
                $input.bind('keydown.maskMoney', keydownEvent);
                $input.bind('blur.maskMoney', blurEvent);
                $input.bind('focus.maskMoney', focusEvent);
                $input.bind('click.maskMoney', clickEvent);
                $input.bind('mask.maskMoney', mask);
            });
        }
    };

    $.fn.maskMoney = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.maskMoney');
        }
    };
})(window.jQuery || window.Zepto);
