/* 
 * Adapted script to support for other usages.
 *  - Copy/paste
 *  - Cursor positioning
 *  - Integer part limiting
 *  - dot/comma jump to decimal part
 */

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
(function($) {

	//helper fn
	String.prototype.replaceAt=function(index, char) {
		return this.substr(0, index) + char + this.substr(index + (char.length == 0 ? 1 : char.length) );
	}
	
	// selects all text of an input
	$.fn.selectAll = function(start, end) {
	    return this.each(function() {
	    	var from = start |= 0;
	    	var to = end |= $(this).val().length
	        if(this.setSelectionRange) {
	            this.focus();
	            this.setSelectionRange(from, to);
	        } else if(this.createTextRange) {
	            var range = this.createTextRange();	            
	            range.collapse(true);
	            range.moveStart('character', from);
	            range.moveEnd('character', to);
	            range.select();
	        }
	    });
	};

	//returns caret position
	$.fn.getSelection = function() {
		var e = this.jquery ? this[0] : this;
		return (

			/* mozilla / dom 3.0 */
			('selectionStart' in e && function() {
				var l = e.selectionEnd - e.selectionStart;
				return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
			}) ||

			/* exploder */
			(document.selection && function() {
				e.focus();
				var r = document.selection.createRange();
				if (r == null) {
					return { start: 0, end: e.value.length, length: 0 }
				}

				var re = e.createTextRange();
				var rc = re.duplicate();
				re.moveToBookmark(r.getBookmark());
				rc.setEndPoint('EndToStart', re);

				return { start: rc.text.length, end: rc.text.length + r.text.length, length: r.text.length, text: r.text };
			}) ||

			/* browser not supported */
			function() {
				return { start: 0, end: e.value.length, length: 0 };
			}

		)();

	};

	//replaces text
	$.fn.replaceSelection = function() {
		var e = this.jquery ? this[0] : this;
		var text = arguments[0] || '';
		return (

			/* mozilla / dom 3.0 */
			('selectionStart' in e && function() {
				e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
				return this;
			}) ||

			/* exploder */
			(document.selection && function() {
				e.focus();
				document.selection.createRange().text = text;
				return this;
			}) ||

			/* browser not supported */
			function() {
				e.value += text;
				return this;
			}

		)();
	};
	
	//sets caret pos
	$.fn.setCaretPosition = function(pos) {
	  this.each(function(index, elem) {
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

	/**
	 * main entry point
	 */
	$.fn.maskMoney = function(settings) {
		settings = $.extend({
			symbol: '€ ',
			decimal: ',',
			thousands:'.',
			precision: 2,
			intSize: 20,
			allowZero: true,
			allowNegative: true,
			showSymbol: false
		}, settings);

		//main declaration
		return this.each(function() {
			var input = $(this);
			
			input.data('hasChanged', false);		
			input.data('canMask', true);		
			
			// handles special keys
			// responsible for delete, dot/comma, backspace, etc
			function keydownEvent(e) {	
				//if the field is disabled, we let the event bubble up
				if(!isEnabled()) {return true;}
				
				// reset maskeable attr
				// if someone set the property to false, 
				// we reset it because another key was pressed
				input.data('canMask', true);
				
				e = e||window.event;
				var k = e.charCode||e.keyCode||e.which;
				if (k == undefined) return; //needed to handle an IE "special" event
			
				//modifiers allowed, do the normal thing
				if(e.ctrlKey || e.altKey) return true;
				
				// backspace|delete key
				if (k == 8 || k == 46) {
					var isBackspace = (k == 8);		
					preventDefault(e);	
					
					//if a selection/text range is active
					if(input.getSelection().length > 0) {
						// if we selected ALL of the text's value 
						// remember a backspace/delete key was detected
						// we need to clear the field and prevent the other keyXXX handlers of firing
						if(input.getSelection().length == input.val().length) {
							input.val('');
							input.data('canMask',false);
						}
						return true;
					}
					
					//bookeeping
					var initialVal = input.val();
					var initialLength = initialVal.length;
					var caretPos = input.getSelection().start;
					//detect the char we're trying to remove
					var targetPos = caretPos + (isBackspace ? -1 : 0);
					var chr = initialVal.charAt(targetPos);
					if(targetPos < initialLength && isNaN(chr)) targetPos = targetPos  + (isBackspace ? -1 : 1);					
										
					//delete decimals
					//we can be either at the RIGHT of the separator 
					// OR at the immediate LEFT of separater and pressed the DEL key
					if((settings.precision > 0 && caretPos >= (initialLength - settings.precision)) 
					   || (!isBackspace && chr === settings.decimal && caretPos == (initialLength - settings.precision - 1))) {	
						
						if(targetPos >= initialLength) return;
						
						input.val(maskValue(input.val().replaceAt(targetPos,'0')));
						//if we DELETE a decimal sign, we move 2 places instead of only one
						input.setCaretPosition(caretPos + (isBackspace ? -1 : (chr === settings.decimal ? 2 : 1) ));
					}					
					else {					
						//remove char, set char position						
						input.val(maskValue(input.val().replaceAt(targetPos,'')));	
						input.setCaretPosition(caretPos - (initialLength - input.val().length) + (isBackspace ? 0 : 1) );					
					}
					
				}
                                return true;
			}

			// handles 'visible' keys
			// numbers and such
			function keypressEvent(e) {
				if(!isEnabled() || !input.data('canMask')) {preventDefault(e);return false;}
				
				e = e||window.event;
				var k = e.charCode||e.keyCode||e.which;
				if (k == undefined) return true; //needed to handle an IE "special" event				
				//special case...
				if(k == 0) { preventDefault(e);return false; }
				
				var isNumberOrDecimal = ((k >= 48 && k <=57) || ((e.which == 46 && k == 46) || k == 44));
				// if we have all text selectioned and pressed either a number or a decimal sep
				if(input.getSelection().length > 0 && isNumberOrDecimal) {					
					// ticket #32: if all of the field is selected, clear all and start from decimal sep
					if(input.getSelection().length == input.val().length) {
						var isPositionAtDecimals = (settings.decimal == '' || (e.which == 46 && k == 46) || k == 44);
						var key = String.fromCharCode(k);
						var val = getDefaultMask();
						// if it's a number, we write the value directly and prevent the bubbling
						// so the value change looks smoother
						if(!isNaN(key)) { val = val.replaceAt(0, key); }
						
						input.val(setSymbol(val));
						input.setCaretPosition(input.val().length - (settings.precision + (isPositionAtDecimals ? 0 : 1)));
						return false;
					}
					return true;
				}
				
				//modifiers allowed, do the normal thing
				if(e.ctrlKey || e.altKey) return true;
								
				//home || end || delete(46) (delete requires special treatment to differentiate the (.)  )
				if(k == 35 || k == 36) return true;
				
				// dot?(46) || comma (44)
				// first condition is to fix some IE/FFox issues
				if((e.which == 46 && k == 46) || k == 44) {		
					input.setCaretPosition(input.val().length - settings.precision);
					return false;
				}				
				
				// tab key
				if (k==9)  return true;
				//left / right
				if (k == 37 || k == 39)  return true;							
				//plus / minus keys
				if (k < 48 || k > 57) {
					if (k==45) { // -(minus) key
						input.val(changeSign(input));
						return false;
					}
					if (k==43) { // +(plus) key
						input.val(input.val().replace('-',''));
						return false;
					} else	{
						preventDefault(e);
						return true;
					}
				} 
				
				//maxSize reached
				if (input.val().length == input.attr('maxlength')) {
					return false;
				}
				
				// intSize reached 
				// even if I remove my curr selected text, if it overflows return false
				var sel = input.getSelection();
				if(integerPart(input.val()).length >= settings.intSize && ((sel.end - sel.start) < (input.val()).length - settings.precision)) {
					return false;
				}

				preventDefault(e);
				input.data('hasChanged', true);
				
				var key = String.fromCharCode(k);
				var currVal = input.val();				
				var caretPos = input.getSelection().start;
				var initialLength = currVal.length;
				
				//cents - in this mode we overwrite existing cents value				
				//at the end of input && replaceCents mode, do nothing
				if(caretPos == initialLength && settings.decimal !=='' && currVal.indexOf(settings.decimal) != -1) {
					return false;
				}				
				// this way the value doesn't grow
				else if (caretPos >= (initialLength - settings.precision)) {
                                        //fix problem when the field is clear and we start typing
					if(currVal.trim() === '' ) currVal = getDefaultMask();
					input.val(maskValue(currVal.replaceAt(caretPos, key)));
					input.setCaretPosition(caretPos + 1);
				}				
				//non-cents
				else {
					//insert keyed char at caret pos
					var newVal = currVal.substr(0, caretPos) + key + currVal.substr(caretPos, initialLength);
					input.val(maskValue(newVal));
					//set caret at original pos
					input.setCaretPosition(caretPos + (input.val().length - initialLength));
				}
				//trigger new event to force bubbling for other listeners
				
				input.change();
			}
			
			// handles keyup events
			// detects paste (because of the ctrlKey), reformats input
			function keyupEvent(e) {	
				if(!isEnabled() || !input.data('canMask')) {preventDefault(e);return false;}
				//read char
				var k = e.charCode||e.keyCode||e.which;
				if (k == undefined) return true;				
				if (k == 0) { preventDefault(e);return false; }
				
				if(e.ctrlKey) {
					preventDefault(e);
					//handle differences in decimals
					pasteValue(trimInput(input.val()));
				} 
				else if(e.shiftKey || k==9 || k==16) { // Tab || shift 
					return true;
				}
				else if(input.val() !== getDefaultMask()) {
					// handles selection and then keying something
					var currVal = input.val();				
					var caretPos = input.getSelection().start;
					var initialLength = currVal.length;
					input.val(maskValue(currVal));
					input.setCaretPosition(caretPos + (input.val().length - initialLength));
					
				}
			}
			
			//trims input
			function trimInput(v) {
				var ip = integerPart(v);
				if(ip.length > settings.intSize) {
					//trim from far left
					v = ip.substr((v.length - settings.intSize), v.length)
				}
				return v;
			}
			
			// gives the integer part
			function integerPart(v) {
				if(settings.decimal !== '' && v.indexOf(settings.decimal) >= 0) {
					v = v.substr(0, v.indexOf(settings.decimal));
				}
				v = replaceAll(v, settings.thousands, '');
				return v;
			}
			
			//
			function replaceAll(src, stringToFind, stringToReplace){
			  if(stringToFind == '' || src == '') return src;
			  var temp = src;
			  var index = temp.indexOf(stringToFind);
			  	while(index != -1){
			  		temp = temp.replace(stringToFind,stringToReplace);
			        index = temp.indexOf(stringToFind);
			    }
			  	return temp;
			}
			
			//pastes a value onto the input
			function pasteValue(v) {
				//handle differences in decimals
				var currVal = v;
				// #1399 fix decimal sep
				// "massage" val to make it nicer to process 
				currVal = v.replace(/,/gi, settings.thousands);
				currVal = v.replace(/\s/gi, "");
				if(currVal.lastIndexOf(settings.thousands) > 0) {
					currVal = currVal.replaceAt(currVal.lastIndexOf(settings.thousands), settings.decimal);
				}
				var decimalSep = (settings.decimal === '') ? -1 : currVal.lastIndexOf(settings.decimal);
				var decimalsLeft = currVal.length - decimalSep - 1;
				// we may be pasting some text with differences in decimal precision
				// we will try and preserve the "semantics"/"value" of the pasted value
				// if the field has precision enabled and no decimal separator has been found
				if( (settings.precision > 0 && decimalSep == -1) || 
				    (decimalSep > 0 && (decimalsLeft != settings.precision))) {
											
					//diff is the nr of chars we need to add or remove
					var diff = decimalSep == -1 ? settings.precision : Math.abs(decimalsLeft - settings.precision);
					//we add more zeros if decimalSep doesn't exist OR decimal is less than precision
				    var isAdd = decimalSep == -1 || decimalsLeft < settings.precision ;
					
					//adjust decimals, add them or remove them
					for(var i=0; i < diff; i++) {
						currVal = isAdd ? ( currVal + '0') : (currVal.substr(0, currVal.length - 1));
					}
				}
				input.val(maskValue(currVal));
				
			}

			//handles masking and caret position on focus
			function focusEvent(e) {
				if(!isEnabled()) {return true;}
				
				//#32 when focus, consider that the field has changed and let the default value stay after blur
				input.data('hasChanged', true);
				
				if (input.val()=='') {
					input.val(setSymbol(getDefaultMask()));
				} else {
					pasteValue(input.val());
				}
				input.selectAll();
			}

			//handles unmasking
			function blurEvent(e) {
				if (input.val() == setSymbol(getDefaultMask())) {
					if(!settings.allowZero || !input.data('hasChanged')) input.val('');
				} 
				else {
					input.val(input.val().replace(settings.symbol,''));
				}
				//bubble
				return true;
			}

			//prevents default evt handling
			function preventDefault(e) {
				if (e.preventDefault) { //standart browsers
					e.preventDefault();
				} else { // internet explorer
					e.returnValue = false
				}
			}

			//applies the mask
			function maskValue(v) {
				v = v.replace(settings.symbol,'');

				var strCheck = '0123456789';
				var len = v.length;
				var a = '', t = '', neg='';

				if(len!=0 && v.charAt(0)=='-'){
					v = v.replace('-','');
					if(settings.allowNegative){
						neg = '-';
					}
				}

				if (len==0) {
					t = '0.00';
				}

				for (var i = 0; i<len; i++) {
					if ((v.charAt(i)!='0') && (v.charAt(i)!=settings.decimal)) break;
                }

				for (; i<len; i++) {
					if (strCheck.indexOf(v.charAt(i))!=-1) a+= v.charAt(i);
				}

				var n = parseFloat(a);
				n = isNaN(n) ? 0 : n/Math.pow(10,settings.precision); 
				t = n.toFixed(settings.precision);

                i = settings.precision == 0 ? 0 : 1;
				var p, d = (t=t.split('.'))[i].substr(0,settings.precision);
				for (p = (t=t[0]).length; (p-=3)>=1;) {
					t = t.substr(0,p)+settings.thousands+t.substr(p);
				}
				
				return (settings.precision>0)
                    ? setSymbol(neg+t+settings.decimal+d+Array((settings.precision+1)-d.length).join(0))
                    : setSymbol(neg+t);
			}

			function getDefaultMask() {
				var n = parseFloat('0')/Math.pow(10,settings.precision);
				return (n.toFixed(settings.precision)).replace(new RegExp('\\.','g'),settings.decimal);
			}

			//sets the currency symbol
			function setSymbol(v) {
				return settings.showSymbol ? (settings.showSymbol + v) : v;
			}

			//toggles +/- sign
			function changeSign(i){
				if (settings.allowNegative) {
					var vic = i.val();
					if (i.val()!='' && i.val().charAt(0)=='-'){
						return i.val().replace('-','');
					} else{
						return '-'+i.val();
					}
				} else {
					return i.val();
				}
			}
			
			//indicates if the input is 'maskeable'
			function isEnabled(){ return !(input.attr('disabled') || input.attr('readonly')) ;}
			
			//unmask old listeners
			if(typeof(input.unmaskMoney) != 'undefined') input.unmaskMoney();
			
			input.bind('keydown', keydownEvent);
			input.bind('keypress', keypressEvent);			
			input.bind('keyup', keyupEvent);	
			input.bind('blur', blurEvent); //blur causes problems
			input.bind('focus', focusEvent);

			input.one('unmaskMoney',function() {
				input.unbind('focus', focusEvent);
				input.unbind('blur', blurEvent);
				input.unbind('keypress', keypressEvent);
				input.unbind('keydown', keydownEvent);
				
				input.removeAttr('canMask');
				input.removeAttr('hasChanged');

				if ($.browser.msie) {
                    this.onpaste= null;
				} else if ($.browser.mozilla) {
                    this.removeEventListener('input',blurEvent,false);
                }
			});
		});
	}

	$.fn.unmaskMoney = function() {return this.trigger('unmaskMoney');};
})(jQuery);