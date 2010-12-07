/* Adapted script to support for caret positioning and plus/minus sign
 * Also including fieldSelection plugin to allow caret position
 */
 
/*
 * jQuery plugin: fieldSelection - v0.1.0 - last change: 2006-12-16
 * (c) 2006 Alex Brem <alex@0xab.cd> - http://blog.0xab.cd
 */


/*
* @Copyright (c) 2010 AurÃ©lio Saraiva, Diego Plentz
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
	$.fn.mask = function(settings) {
		settings = $.extend({
			symbol: '€ ',
			decimal: ',',
			thousands:'.',
			precision: 2,
			intSize: 20,
			allowZero: false,
			allowNegative: false,
			showSymbol: false
		}, settings);

		
		return this.each(function() {
			var input = $(this);
			//input size overrides settings
			
			//handles special keys
			function keydownEvent(e) {			
				if(!canMask()) {preventDefault(e);return false;}
				
				e = e||window.event;
				var k = e.charCode||e.keyCode||e.which;
				if (k == undefined) return; //needed to handle an IE "special" event
				
				//let the pasteEvent() handle selections
				if(input.getSelection().length > 0) return true;
				
				//modifiers allowed, do the normal thing
				if(e.ctrlKey || e.altKey) return true;
				
				// backspace|delete key
				if (k == 8 || k == 46) {
					var isBackspace = (k == 8);		
					preventDefault(e);					
					
					//bookeeping
					var initialLength = input.val().length;
					var caretPos = input.getSelection().start;
					//detect the char we're trying to remove
					var targetPos = caretPos + (isBackspace ? -1 : 0);
					var chr = input.val().charAt(targetPos);
					if(isNaN(chr)) targetPos = targetPos  + (isBackspace ? -1 : 1);					
										
					//delete decimals
					//we can be either at the RIGHT of the separator 
					// OR at the immediate LEFT of separater and pressed the DEL key
					if(caretPos >= (initialLength - settings.precision) || 
					  (!isBackspace && chr === settings.decimal && caretPos == (initialLength - settings.precision - 1))) {		
					  
						input.val(maskValue(input.val().replaceAt(targetPos,'0')));	
						//if we DELETE a decimal sign, we move 2 places instead of only one
						input.setCaretPosition(caretPos + (isBackspace ? -1 : (chr === settings.decimal ? 2 : 1) ));
					}					
					else {					
						//remove char, set char position						
						input.val(maskValue(input.val().replaceAt(targetPos,'')));	
						input.setCaretPosition(caretPos - (initialLength - input.val().length) + (isBackspace ? 0 : 1) );					
					}
					return true;
				}
			}

			//handles 'visible' keys
			function keypressEvent(e) {			
				if(!canMask()) {preventDefault(e);return false;}
				
				e = e||window.event;
				var k = e.charCode||e.keyCode||e.which;
				if (k == undefined) return true; //needed to handle an IE "special" event				
				//special case...
				if(k == 0) { preventDefault(e);return false; }
				
				//let the pasteEvent() handle selections
				if(input.getSelection().length > 0) return true;
				
				//modifiers allowed, do the normal thing
				if(e.ctrlKey || e.altKey) return true;
								
				//home || end || delete(46) (delete requires special treatment to differentiate the (.)  )
				if(k == 35 || k == 36) return true;
				
				//dot?(46) || comma (44)
				//first condition is to fix some IE/FFox issues
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
				//intSize reached
				if(integerPart(input.val()).length >= settings.intSize) {
					return false;
				}

				preventDefault(e);
				
				var key = String.fromCharCode(k);
				var currVal = input.val();				
				var caretPos = input.getSelection().start;
				var initialLength = currVal.length;
				
				//cents - in this mode we overwrite existing cents value				
				//at the end of input && replaceCents mode, do nothing
				if(caretPos == initialLength) {
					return false;
				}				
				// this way the value doesn't grow
				else if (caretPos >= (initialLength - settings.precision)) {
					input.val(currVal.replaceAt(caretPos, key));
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
			}
			
			//detects paste, reformats input
			function pasteEvent(e) {	
				if(!canMask()) {preventDefault(e);return false;}
				
				if(e.ctrlKey) {
					preventDefault(e);
					//handle differences in decimals
					pasteValue(trimInput(input.val()));
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
			
			//gives the integer part
			function integerPart() {
				var v = input.val();
				if(v.indexOf(settings.decimal) >= 0) {
					v = v.substr(0, v.indexOf(settings.decimal));
				}
				v = replaceAll(v, settings.thousands, '');
				return v;
			}
			
			//
			function replaceAll(src, stringToFind, stringToReplace){
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
				var decimalSep = currVal.lastIndexOf(settings.decimal);
				var decimalsLeft = currVal.length - decimalSep - 1;
				//we may be pasting some text with differences in decimal precision
				//we will try and preserve the "semantics" of the pasted value
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
				if (input.val()=='') {
					input.val(setSymbol(getDefaultMask()));
				} else {
					pasteValue(input.val());
					//input.val(setSymbol(maskValue(input.val())));
				}
                if (this.createTextRange) {
                    var textRange = this.createTextRange();
                    textRange.collapse(false); // set the cursor at the end of the input
                    textRange.select();
                }                
				//position cursor right after separator
				input.setCaretPosition(input.val().length - (settings.precision + 1));
			}

			//handles unmasking
			function blurEvent(e) {
                if ($.browser.msie) {
                    keypressEvent(e);
                }

				if (input.val()==setSymbol(getDefaultMask())) {
					if(!settings.allowZero) input.val('');
				} else {
					input.val(input.val().replace(settings.symbol,''));
				}
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
			function canMask(){ return !(input.attr('disabled') || input.attr('readonly'));}
						
			input.bind('keydown', keydownEvent);
			input.bind('keypress', keypressEvent);			
			input.bind('keyup', pasteEvent);	
			
			input.bind('blur', blurEvent);
			input.bind('focus', focusEvent);

			input.one('unmask',function() {
				input.unbind('focus', focusEvent);
				input.unbind('blur', blurEvent);
				input.unbind('keypress', keypressEvent);
				input.unbind('keydown', keydownEvent);

				if ($.browser.msie) {
                    this.onpaste= null;
				} else if ($.browser.mozilla) {
                    this.removeEventListener('input',blurEvent,false);
                }
			});
		});
	}

	$.fn.unmask = function() {return this.trigger('unmask');};
})(jQuery);