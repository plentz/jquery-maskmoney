Just a simple way to create masks to your currency form fields with [jQuery](http://jquery.com/).

***
### Show Time!

To view a complete demonstration of it's features and usage, access our [examples page](http://plentz.org/maskmoney)!

***
### Usage:
``` html
	<head>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
		<script src="jquery.maskMoney.js" type="text/javascript"></script>
	</head>
	<body>
		<input type="text" id="currency" />
	</body>
	<script>
	$(function(){
		$("#currency").maskMoney();
	})
	</script>
``` 

***
### Options:

The options that you can set are:

 * symbol: the symbol to be used before of the user values. default: 'US$'
 * showSymbol: set if the symbol must be displayed or not. default: false
 * symbolStay: set if the symbol will stay in the field after the user exists the field. default: false
 * thousands: the thousands separator. default: ','
 * decimal: the decimal separator. default: '.'
 * precision: how many decimal places are allowed. default: 2
 * defaultZero: when the user enters the field, it sets a default mask using zero. default: true
 * allowZero: use this setting to prevent users from inputing zero. default: false
 * allowNegative: use this setting to prevent users from inputing negative values. default: false
 * symbolLocation: use this setting to position the symbol at the left or right hand side of the value ('left'/'right')

***
### Bonus!

We have 2 bonus methods that can be useful to you:

 * .unmaskMoney() which removes maskMoney from an element.
 * .mask() which causes maskMoney to actually apply the mask to your input.

***
### Contributors:

 * [Aurélio Saraiva](mailto:aureliosaraiva@gmail.com)
 * [Raul Pereira da Silva](http://raulpereira.com)
 * [Diego Plentz](http://plentz.org)
 * [Otávio Ribeiro Medeiros](http://github.com/otaviomedeiros)
 * [Víctor Cruz](http://github.com/xtream)
 * [Synapse Studios](http://github.com/synapsestudios)
 * [Guilherme Garnier](http://blog.guilhermegarnier.com/)
 * [Plínio Balduino](http://github.com/pbalduino)
 * [André Silva] (http://github.com/cattox)

***
### License:

__jQuery-maskMoney__ is released under the MIT license.