/*
* maskMoney plugin for jQuery
* http://plentz.github.com/jquery-maskmoney/
* version: 2.5.0
* Licensed under the MIT license
*/
;(function($) {
	if (!$.browser) {
		$.browser = {};
		$.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
		$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
		$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
		$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
	}

	var methods = {
		destroy : function() {
			$(this).unbind('.maskMoney');

			if ($.browser.msie) {
				this.onpaste = null;
			}
			return this;
		},

		mask : function(value) {
			return this.each(function() {
				var $this = $(this);
				if (typeof(value) == 'number') {
					$this.trigger('mask');
					var decimalSize = $($this.val().split(/\D/)).last()[0].length;
					value = value.toFixed(decimalSize)
					$this.val(value);
				}
				return $this.trigger('mask');
			});
		},

		unmasked : function() {
			return this.map(function() {
				var unmaskedStr = ($(this).val() || '0');
				var isNegative = unmaskedStr.indexOf("-") != -1;
				var decimalPart = $(unmaskedStr.split(/\D/)).last()[0];
				unmaskedStr = unmaskedStr.replace(/\D/g, '');
				unmaskedStr = unmaskedStr.replace(new RegExp(decimalPart + '$'), '.' + decimalPart);
				if (isNegative) {
					unmaskedStr = "-" + unmaskedStr;
				}
				return parseFloat(unmaskedStr);
			})
		},

		init : function(settings) {
			settings = $.extend({
				symbol: '',
				symbolStay: false,
				thousands: ',',
				decimal: '.',
				precision: 2,
				allowZero: false,
				allowNegative: false
			}, settings);

			if (settings.defaultZero != null && window.console) {
				console.log("settings.defaultZero is deprecated - more info here https://github.com/plentz/jquery-maskmoney/issues/55");
			}

			return this.each(function() {
				var $input = $(this);
				var dirty = false;

				function markAsDirty() {
					dirty = true;
				}

				function clearDirt() {
					dirty = false;
				}

				function keypressEvent(e) {
					e = e || window.event;
					var key = e.which || e.charCode || e.keyCode;
					//needed to handle an IE "special" event
					if (key == undefined) {
						return false;
					}
					// any key except the numbers 0-9
					if (key < 48 || key > 57) {
						// -(minus) key
						if (key == 45) {
							markAsDirty();
							$input.val(changeSign());
							return false;
						// +(plus) key
						} else if (key == 43) {
							markAsDirty();
							$input.val($input.val().replace('-',''));
							return false;
						// enter key or tab key
						} else if (key == 13 || key == 9) {
							if (dirty) {
								clearDirt();
								$(this).change();
							}
							return true;
						} else if ($.browser.mozilla && (key == 37 || key == 39) && e.charCode == 0) {
							// needed for left arrow key or right arrow key with firefox
							// the charCode part is to avoid allowing '%'(e.charCode 0, e.keyCode 37)
							return true;
						} else { // any other key with keycode less than 48 and greater than 57
							preventDefault(e);
							return true;
						}
					} else if (canInputMoreNumbers()) {
						return false;
					} else {
						preventDefault(e);

						var keyPressedChar = String.fromCharCode(key);
						var x = $input.get(0);
						var selection = getInputSelection(x);
						var startPos = selection.start;
						var endPos = selection.end;
						x.value = x.value.substring(0, startPos) + keyPressedChar + x.value.substring(endPos, x.value.length);
						maskAndPosition(x, startPos + 1);
						markAsDirty();
						return false;
					}
				}

				function keydownEvent(e) {
					e = e || window.event;
					var key = e.which || e.charCode || e.keyCode;
					//needed to handle an IE "special" event
					if (key == undefined) {
						return false;
					}

					var x = $input.get(0);
					var selection = getInputSelection(x);
					var startPos = selection.start;
					var endPos = selection.end;

					if (key == 8 || key == 46 || key == 63272) { // backspace or delete key (with special case for safari)
						preventDefault(e);

						// not a selection
						if (startPos == endPos) {
							// backspace
							if(key == 8) {
								startPos -= 1;
							//delete
							} else {
								endPos += 1;
							}
						}

						x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length);

						maskAndPosition(x, startPos);
						markAsDirty();
						return false;
					} else if (key == 9) { // tab key
						if (dirty) {
							$(this).change();
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

				function blurEvent(e) {
					if ($.browser.msie) {
						keypressEvent(e);
					}

					if ($input.val() == '' || $input.val() == setSymbol(getDefaultMask()) || $input.val() == settings.symbol) {
						if (!settings.allowZero) {
							$input.val('');
						} else if (!settings.symbolStay) {
							$input.val(getDefaultMask());
						} else {
							$input.val(setSymbol(getDefaultMask()));
						}
					} else {
						if (!settings.symbolStay) {
							$input.val($input.val().replace(settings.symbol,''));
						} else if (settings.symbolStay && $input.val() == settings.symbol) {
							$input.val(setSymbol(getDefaultMask()));
						}
					}
				}

				function canInputMoreNumbers() {
					var reachedMaxLength = ($input.val().length >= $input.attr('maxlength') && $input.attr('maxlength') >= 0);
					var selection = getInputSelection($input.get(0));
					var start = selection.start;
					var end = selection.end;
					var hasNumberSelected = (selection.start != selection.end && $input.val().substring(start,end).match(/\d/))? true : false;
					return reachedMaxLength && !hasNumberSelected;
				}

				function preventDefault(e) {
					if (e.preventDefault) { //standard browsers
						e.preventDefault();
					} else { // old internet explorer
						e.returnValue = false;
					}
				}

				function maskAndPosition(x, startPos) {
					var originalLen = $input.val().length;
					$input.val(maskValue(x.value));
					var newLen = $input.val().length;
					startPos = startPos - (originalLen - newLen);
					setCursorPosition(startPos);
				}

				function mask() {
					var value = $input.val();
					$input.val(maskValue(value));
				}

				function maskValue(value) {
					value = value.replace(settings.symbol, '');

					var strCheck = '0123456789';
					var len = value.length;
					var a = '', t = '';
					var negative = '';

					if (len != 0 && value.charAt(0)=='-') {
						value = value.replace('-','');
						if (settings.allowNegative) {
							negative = '-';
						}
					}

					if (len == 0) {
						t = '0.00';
					}

					for (var i = 0; i < len; i++) {
						if (value.charAt(i) != '0' && value.charAt(i) != settings.decimal) {
							break;
						}
					}

					for (; i < len; i++) {
						if (strCheck.indexOf(value.charAt(i)) != -1) {
							a += value.charAt(i);
						}
					}
					var n = parseFloat(a);

					n = isNaN(n) ? 0 : n / Math.pow(10, settings.precision);
					t = n.toFixed(settings.precision);

					i = settings.precision == 0 ? 0 : 1;
					var p, d = (t = t.split('.'))[i].substr(0, settings.precision);
					for (p = (t = t[0]).length; (p -= 3) >= 1;) {
						t = t.substr(0, p) + settings.thousands + t.substr(p);
					}

					return (settings.precision > 0)
						? setSymbol(negative + t + settings.decimal + d + Array((settings.precision + 1) - d.length).join(0))
						: setSymbol(negative + t);
				}

				function getDefaultMask() {
					var n = parseFloat('0') / Math.pow(10, settings.precision);
					return (n.toFixed(settings.precision)).replace(new RegExp('\\.','g'),settings.decimal);
				}

				function setSymbol(value) {
					if (settings.symbol != '') {
						var operator = '';
						if (value.length != 0 && value.charAt(0) == '-') {
							value = value.replace('-', '');
							operator = '-';
						}

						if (value.substr(0, settings.symbol.length) != settings.symbol) {
							value = operator + settings.symbol + value;
						}
					}
					return value;
				}

				function changeSign() {
					var inputValue = $input.val();
					if (settings.allowNegative) {
						if (inputValue != '' && inputValue.charAt(0) == '-') {
							return inputValue.replace('-','');
						} else {
							return '-' + inputValue;
						}
					} else {
						return inputValue;
					}
				}

				function setCursorPosition(pos) {
					$input.each(function(index, elem) {
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
				};

				function getInputSelection(el) {
					var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

					if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
						start = el.selectionStart;
						end = el.selectionEnd;
					} else {
						range = document.selection.createRange();

						if (range && range.parentElement() == el) {
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
								start = -textInputRange.moveStart("character", - len);
								start += normalizedValue.slice(0, start).split("\n").length - 1;

								if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
									end = len;
								} else {
									end = -textInputRange.moveEnd("character", - len);
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

				$input.unbind('.maskMoney');
				$input.bind('keypress.maskMoney', keypressEvent);
				$input.bind('keydown.maskMoney', keydownEvent);
				$input.bind('blur.maskMoney', blurEvent);
				$input.bind('focus.maskMoney', focusEvent);
				$input.bind('mask.maskMoney', mask);
			})
		}
	}

	$.fn.maskMoney = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.maskMoney');
		}
	};
})(window.jQuery || window.Zepto);
