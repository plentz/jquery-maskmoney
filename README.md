# jQuery maskMoney [![Build Status](https://travis-ci.org/plentz/jquery-maskmoney.png)](https://travis-ci.org/plentz/jquery-maskmoney)

Just a simple way to create masks to your currency form fields with [jQuery](http://jquery.com/).

***
### Download

To get the latest(minified) version, [click here](https://cdn.rawgit.com/plentz/jquery-maskmoney/master/dist/jquery.maskMoney.min.js).

You can also use [CloudFlare's cdnjs](http://cdnjs.com/). Just choose the version you want to use [here](http://cdnjs.com/libraries/jquery-maskmoney/).

***
### Show Time!

To view a complete demonstration of it's features and usage, access our [examples page](http://plentz.github.com/jquery-maskmoney)!

***
### Usage:
```html
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" type="text/javascript"></script>
  <script src="dist/jquery.maskMoney.min.js" type="text/javascript"></script>
</head>
<body>
  <input type="text" id="currency" />
</body>
<script>
  $(function() {
    $('#currency').maskMoney();
  })
</script>
```

***
### Options:

The options that you can set are:

 * `prefix`: the prefix to be displayed before(aha!) the value entered by the user(example: "US$ 1234.23"). default: ''
 * `suffix`: the suffix to be displayed after the value entered by the user(example: "1234.23 €"). default: ''
 * `affixesStay`: set if the prefix and suffix will stay in the field's value after the user exits the field. default: true
 * `thousands`: the thousands separator. default: ','
 * `decimal`: the decimal separator. default: '.'
 * `precision`: how many decimal places are allowed. default: 2
 * `allowZero`: use this setting to prevent users from inputing zero. default: false
 * `allowNegative`: use this setting to prevent users from inputing negative values. default: false

__IMPORTANT__: if you try to bind maskMoney to a read only field, nothing will happen, since we ignore completely read only fields. So, if you have a read only field, try to bind maskMoney to it, it will not work. Even if you change the field removing the readonly property, you will need to re-bind maskMoney to make it work.

***
### Bonus!

We have 3 bonus methods that can be useful to you:

 * `.maskMoney('destroy')` removes maskMoney from an element.
 * `.maskMoney('mask')` apply the mask to your input. This method can work as a setter as well, if you pass a value to it, like this `.maskMoney('mask', 1999.99)`
 * `.maskMoney('unmasked')` return a float value (ex.: 'R$ 1.234,56' => 1234.56). PS: If you have only one input field, you should use this way `.maskMoney('unmasked')[0]`, since it will always return an array.

You can also configure maskMoney options using the data-* API instead of passing it as a hash in the `.maskMoney` method call. To use it, simply set the options using `data-<option>`, like this:

 ```html
 	<input type="text" data-affixes-stay="true" data-prefix="R$ " data-thousands="." data-decimal="," />
 ```

 And when you bind maskMoney to that field, we will read those options. **ATTENTION**: for settings that isn't entirely lowercase, you will need to use dashes instead of capital letters. For example, to set `allowZero`, you will need to add a attribute called `data-allow-zero`.

***
### Tests:

To run our test suite, just clone the repo and open `test/index.html`. If you want to run it using nodejs, clone the repo and run:

```
npm install && grunt test
```

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
 * [Daniel Loureiro](https://github.com/loureirorg)
 * [Thiago Silva](http://twitter.com/tafs7/)
 * [Guilherme Nagatomo](https://github.com/guilhermehn)

***
### License:

__jQuery-maskMoney__ is released under the MIT license.
