Just a simple way to create masks to your currency form fields with [jQuery](http://jquery.com/).

***
### Usage:

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js" type="text/javascript"></script>
	<script src="jquery.maskMoney.js" type="text/javascript"></script>
	<script>
	$(function(){
		$("#currency").maskMoney();
		$("#real").maskMoney({symbol:"R$", decimal:",", thousands:"."});
		$("#precision").maskMoney({precision:3})
	})
	function removeMask(){
		$("#currency").unmaskMoney();
	}
	</script>

Default options are (but you can always change that):

	symbol:'US$',
	decimal:'.',
	precision:2,
	thousands:',',
	allowZero:false,
	allowNegative:false,
	showSymbol:false,
	symbolStay:false,
	defaultZero:true

***
### Contributors:
 * [Aurélio Saraiva](mailto:aureliosaraiva@gmail.com)
 * [Raul Pereira da Silva](http://raulpereira.com)
 * [Diego Plentz](http://plentz.org)
 * Otávio Ribeiro Medeiros
 * [xtream](http://github.com/xtream)

***
### License:
__jQuery-maskMoney__ is released under the MIT license.