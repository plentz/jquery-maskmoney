Adapted original script to allow backpsace & cursor positioning.
Below lies the original README, slightly adapted to include changes

*** 

Just a simple way to create masks to your currency form fields with [jQuery](http://jquery.com/).
Can also be applied to other fields (ex: percentage).

***
### Usage:

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js" type="text/javascript"></script>
	<script src="jquery.maskMoney.js" type="text/javascript"></script>
	<script>
	$(function(){
		$("#currency").maskMoney();
		$("#euro").maskMoney({symbol:"€ ", decimal:",", thousands:"."});
		$("#euribor").maskMoney({precision:3, intSize: 2})
	})
	function removeMask(){
		$("#currency").unmaskMoney();
	}
	</script>

Default options are (but you can always change that):

	symbol:'US$',
	decimal:'.',
	precision:2,
        intSize: 20,
	thousands:',',
	allowZero:false,
	allowNegative:false,
	showSymbol:false

***
### Contributors:
 * [Aurélio Saraiva](aureliosaraiva@gmail.com)
 * [Raul Pereira da Silva](http://raulpereira.com)
 * [Diego Plentz](http://plentz.org)
 * Otávio Ribeiro Medeiros
 * [xtream](http://github.com/xtream)

***
### License:
__jQuery-maskMoney__ is released under the MIT license.
