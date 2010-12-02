/* Adapted script to support for caret positioning and plus/minus sign 
 * Also including fieldSelection plugin to allow caret position
 */
/*
 * jQuery plugin: fieldSelection - v0.1.0 - last change: 2006-12-16 
 * (c) 2006 Alex Brem <alex@0xab.cd> - http://blog.0xab.cd 
 */
/*
 * @Copyright (c) 2010 Aurélio Saraiva, Diego Plentz
 * @Page http://github.com/plentz/jquery-maskmoney
 * try at http://inoveideia.com.br/maskInputMoney/
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * @Version: 0.5
 * @Release: 2010-10-19
 */
(function ($) {
    //helper fn
    String.prototype.replaceAt = function (index, char) {
        return this.substr(0, index) + char + this.substr(index + (char.length == 0 ? 1 : char.length));
    }
    //returns caret position
    $.fn.getSelection = function () {
        var e = this.jquery ? this[0] : this;
        return ( /* mozilla / dom 3.0 */ ('selectionStart' in e &&
        function () {
            var l = e.selectionEnd - e.selectionStart;
            return {
                start: e.selectionStart,
                end: e.selectionEnd,
                length: l,
                text: e.value.substr(e.selectionStart, l)
            };
        }) || /* exploder */ (document.selection &&
        function () {
            e.focus();
            var r = document.selection.createRange();
            if (r == null) {
                return {
                    start: 0,
                    end: e.value.length,
                    length: 0
                }
            }
            var re = e.createTextRange();
            var rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);
            return {
                start: rc.text.length,
                end: rc.text.length + r.text.length,
                length: r.text.length,
                text: r.text
            };
        }) || /* browser not supported */
        function () {
            return {
                start: 0,
                end: e.value.length,
                length: 0
            };
        })();
    };
    //replaces text
    $.fn.replaceSelection = function () {
        var e = this.jquery ? this[0] : this;
        var text = arguments[0] || '';
        return ( /* mozilla / dom 3.0 */ ('selectionStart' in e &&
        function () {
            e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
            return this;
        }) || /* exploder */ (document.selection &&
        function () {
            e.focus();
            document.selection.createRange().text = text;
            return this;
        }) || /* browser not supported */
        function () {
            e.value += text;
            return this;
        })();
    };
    //sets caret pos
    $.fn.setCaretPosition = function (pos) {
        this.each(function (index, elem) {
            if (elem.setSelectionRange) {
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
    $.fn.maskMoney = function (settings) {
        settings = $.extend({
            symbol: '€',
            decimal: '.',
            precision: 2,
            thousands: ',',
            allowZero: false,
            allowNegative: true,
            showSymbol: false
        }, settings);
        settings.symbol = settings.symbol + ' ';
        return this.each(function () {
            var input = $(this);
            function keypressEvent(e) {
                e = e || window.event;
                var k = e.charCode || e.keyCode || e.which;
                if (k == undefined) return; //needed to handle an IE "special" event
                //home || end || delete(46) (delete requires special treatment to differentiate the (.)  )
                if (k == 35 || k == 36) return true;
                // backspace key
                if (k == 8) {
                    //return true;                           
                    preventDefault(e);
                    var caretPos = input.getSelection().start;
                    var chr = input.val().charAt(caretPos >= 0 ? (caretPos - 1) : 0);
                    var isNumber = !isNaN(chr);
                    var targetPos = isNumber ? (caretPos - 1) : caretPos;
                    var initialLength = input.val().length;
                    input.val(maskValue(input.val().replaceAt(targetPos, '')));
                    var finalLength = input.val().length;
                    input.setCaretPosition(caretPos - (initialLength != finalLength ? 1 : 0));
                    return false;
                }
                // tab key
                if (k == 9) return true;
                //left / right
                if (k == 37 || k == 39) return true;
                //plus / minus keys
                if (k < 48 || k > 57) {
                    if (k == 45) { // -(minus) key
                        input.val(changeSign(input));
                        return false;
                    }
                    if (k == 43) { // +(plus) key
                        input.val(input.val().replace('-', ''));
                        return false;
                    } else {
                        preventDefault(e);
                        return true;
                    }
                }
                //maxSize reached
                else if (input.val().length == input.attr('maxlength')) {
                    return false;
                }
                preventDefault(e);
                var currVal = input.val();
                var key = String.fromCharCode(k);
                var startPos = input.getSelection().start;
                var startLen = currVal.length;
                //insert keyed char at caret pos
                var newVal = currVal.substr(0, startPos) + key + currVal.substr(startPos, startLen);
                input.val(maskValue(newVal));
                //set caret at original pos
                input.setCaretPosition(startPos + (input.val().length - startLen));
            }
            function focusEvent(e) {
                if (input.val() == '') {
                    input.val(setSymbol(getDefaultMask()));
                } else {
                    input.val(setSymbol(input.val()));
                }
                if (this.createTextRange) {
                    var textRange = this.createTextRange();
                    textRange.collapse(false); // set the cursor at the end of the input
                    textRange.select();
                }
            }
            function blurEvent(e) {
                if ($.browser.msie) {
                    keypressEvent(e);
                }
                if (input.val() == setSymbol(getDefaultMask())) {
                    if (!settings.allowZero) input.val('');
                } else {
                    input.val(input.val().replace(settings.symbol, ''));
                }
            }
            function preventDefault(e) {
                if (e.preventDefault) { //standart browsers
                    e.preventDefault();
                } else { // internet explorer
                    e.returnValue = false
                }
            }
            function maskValue(v) {
                v = v.replace(settings.symbol, '');
                var strCheck = '0123456789';
                var len = v.length;
                var a = '',
                    t = '',
                    neg = '';
                if (len != 0 && v.charAt(0) == '-') {
                    v = v.replace('-', '');
                    if (settings.allowNegative) {
                        neg = '-';
                    }
                }
                if (len == 0) {
                    t = '0.00';
                }
                for (var i = 0; i < len; i++) {
                    if ((v.charAt(i) != '0') && (v.charAt(i) != settings.decimal)) break;
                }
                for (; i < len; i++) {
                    if (strCheck.indexOf(v.charAt(i)) != -1) a += v.charAt(i);
                }
                var n = parseFloat(a);
                n = isNaN(n) ? 0 : n / Math.pow(10, settings.precision);
                t = n.toFixed(settings.precision);
                i = settings.precision == 0 ? 0 : 1;
                var p, d = (t = t.split('.'))[i].substr(0, settings.precision);
                for (p = (t = t[0]).length;
                (p -= 3) >= 1;) {
                    t = t.substr(0, p) + settings.thousands + t.substr(p);
                }
                return (settings.precision > 0) ? setSymbol(neg + t + settings.decimal + d + Array((settings.precision + 1) - d.length).join(0)) : setSymbol(neg + t);
            }
            function getDefaultMask() {
                var n = parseFloat('0') / Math.pow(10, settings.precision);
                return (n.toFixed(settings.precision)).replace(new RegExp('\\.', 'g'), settings.decimal);
            }
            function setSymbol(v) {
                if (settings.showSymbol) {
                    return settings.symbol + v;
                }
                return v;
            }
            function changeSign(i) {
                if (settings.allowNegative) {
                    var vic = i.val();
                    if (i.val() != '' && i.val().charAt(0) == '-') {
                        return i.val().replace('-', '');
                    } else {
                        return '-' + i.val();
                    }
                } else {
                    return i.val();
                }
            }
            input.bind('keypress', keypressEvent);
            input.bind('blur', blurEvent);
            input.bind('focus', focusEvent);
            input.one('unmaskMoney', function () {
                input.unbind('focus', focusEvent);
                input.unbind('blur', blurEvent);
                input.unbind('keypress', keypressEvent);
                if ($.browser.msie) {
                    this.onpaste = null;
                } else if ($.browser.mozilla) {
                    this.removeEventListener('input', blurEvent, false);
                }
            });
        });
    }
    $.fn.unmaskMoney = function () {
        return this.trigger('unmaskMoney');
    };
})(jQuery);
