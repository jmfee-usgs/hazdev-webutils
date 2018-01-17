'use strict';

// textbox
// submit button

// copy text into header

(function () {
	var Model = require('mvc/Model'),
		View = require('mvc/View'),
		Util = require('util/Util');


	var HeaderModel = function(options) {
		var _this;

		_this = Model(Util.extend({},
				{
					header: 'Default header',
				},
				options));

		return _this;
	};


	var HeaderInputView = function (options) {
		var _this,
			_initialize;

		_this = View(options);

		_initialize = function (/*options*/) {
			_this.el.innerHTML =
				'<form>' +
				'<label for="header">Header</label>' +
				'<input type="text" id="header"/>' +
				'<button type="submit">Update Header</button>' +
				'</form>';

			_this.button = _this.el.querySelector('button');
			_this.form = _this.el.querySelector('form');
			_this.input = _this.el.querySelector('input');

			_this.form.addEventListener('submit', _this.onSubmit);
			_this.render();
		};

		_this.destroy = Util.compose(_this.destroy, function () {
			_this.form.removeEventListener('submit', _this.onSubmit);
			_this = null;
		});

		_this.onSubmit = function (e) {
			if (e) {
				e.preventDefault();
			}

			_this.model.set({
				'header': _this.input.value
			});

			return false;
		};

		_this.render = function () {
			var header = _this.model.get('header');
			_this.input.value = header;
		};


		_initialize(options);
		options = null;
		return _this;
	};


	var HeaderView = function (options) {
		var _this,
			_initialize;

		_this = View(options);

		_initialize = function (/*options*/ ) {
			_this.el.innerHTML = '<h1></h1>';
			_this.header = _this.el.querySelector('h1');
			_this.render();
		};

		_this.render = function (change) {
			console.log(change);
			_this.header.innerText = _this.model.get('header');
		};

		_initialize(options);
		options = null;
		return _this;
	};


	var HeaderApp = function (options) {
		var _this,
			_initialize;

		_this = View(options);

		_initialize = function (/*options*/) {
			_this.el.innerHTML =
					'<div class="header"></div>' +
					'<div class="headerinput"></div>';

			_this.headerView = HeaderView({
				el: _this.el.querySelector('.header'),
				model: _this.model
			});

			_this.headerInputView = HeaderInputView({
				el: _this.el.querySelector('.headerinput'),
				model: _this.model
			});
		};

		_initialize(options);
		options = null;
		return _this;
	};


	window.HeaderApp = HeaderApp({
		el: document.querySelector('#headerinput'),
		model: HeaderModel()
	});

})();
