Just a simple way to create masks to your currency form fields with [jQuery](http://jquery.com/).

***
### Show Time!

To view a complete demonstration of it's features and usage, access our [examples page](http://plentz.github.com/jquery-maskmoney)!

***
### Usage:
```html
	<head>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js" type="text/javascript"></script>
		<script src="jquery.maskMoney.js" type="text/javascript"></script>
	</head>
	<body>
		<input type="text" id="currency" />
	</body>
	<script type="text/javascript">
	$(function(){
		$("#currency").maskMoney();
	})
	</script>
```

***
### Options:

The options that you can set are:

 * ```symbol```: the symbol to be displayed before the value entered by the user(example: "US$"). default: ''
 * ```symbolStay```: set if the symbol will stay in the field after the user exists the field. default: false
 * ```thousands```: the thousands separator. default: ','
 * ```decimal```: the decimal separator. default: '.'
 * ```precision```: how many decimal places are allowed. default: 2
 * ```defaultZero```: when the user enters the field, it sets a default mask using zero. default: true
 * ```allowZero```: use this setting to prevent users from inputing zero. default: false
 * ```allowNegative```: use this setting to prevent users from inputing negative values. default: false
 
__IMPORTANT__: if you try to bind maskMoney to a read only field, nothing will happen, since we ignore completely read only fields. So, if you have a read only field, try to bind maskMoney to it, it will not work. Even if you change the field removing the readonly property, you will need to re-bind maskMoney to make it work.

***
### Bonus!

We have 2 bonus methods that can be useful to you:

 * ```.maskMoney('destroy')``` which removes maskMoney from an element.
 * ```.maskMoney('mask')``` which causes maskMoney to actually apply the mask to your input.

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
 * [Luis Fernando Gomes](https://github.com/luiscoms)
 * [Gary Moore](http://www.gmoore.net/)

***
### License:

__jQuery-maskMoney__ is released under the MIT license.