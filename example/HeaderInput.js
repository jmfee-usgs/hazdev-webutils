'use strict';

// textbox
// submit button

// copy text into header

(function () {
	var Model = require('mvc/Model'),
		View = require('mvc/View'),
		Util = require('util/Util'),
		Xhr = require('util/Xhr');


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
				'<button type="button" class="otherbutton">Another button</button>' +
				'</form>';

			_this.button = _this.el.querySelector('button[type=submit]');
			_this.otherButton = _this.el.querySelector('.otherbutton');
			_this.form = _this.el.querySelector('form');
			_this.input = _this.el.querySelector('input');

			_this.form.addEventListener('submit', _this.onSubmit);
			_this.otherButton.addEventListener('click', _this.onOtherButtonClick);
		};

		_this.destroy = Util.compose(_this.destroy, function () {
			_this.form.removeEventListener('submit', _this.onSubmit);
			_this.otherButton.removeEventListener('click', _this.onOtherButtonClick);
			_this = null;
		});

		_this.onOtherButtonClick = function (e) {
			_this.trigger('other-button-click', e);
		};

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
			_this.model.on('change:header', _this.renderHeader);
		};

		_this.destroy = Util.compose(_this.destroy, function () {
			_this.model.off('change:header', _this.renderHeader);
		});

		_this.renderHeader = function () {
			// whenever header changes
			_this.header.innerText = _this.model.get('header');
		}

		_this.render = function (change) {
			// any part of the model changed
		};

		_initialize(options);
		options = null;
		return _this;
	};


	var HeaderApp = function (options) {
		var _this,
			_initialize;

		options = Util.extend({}, {
			headerUrl: 'HeaderInputData.json'
		}, options);
		_this = View(options);

		_initialize = function (options) {
			_this.el.classList.add('header-app');

			_this.headerUrl = options.headerUrl;

			_this.el.innerHTML =
					'<div class="loading-content">Loading...</div>' +
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

			_this.headerInputView.on('other-button-click', 'onHeaderInputViewOtherButtonClick', _this);
			_this.loadHeader();
		};

		_this.destroy = Util.compose(_this.destroy, function () {
			_this.headerInputView.off();
		});

		_this.loadHeader = function () {
			_this.el.classList.add('loading');

			Xhr.ajax({
				url: _this.headerUrl,
				success: function (json) {
					_this.model.set({
						header: json.header
					});
				},
				error: function () {
					_this.model.set({
						header: 'Error loading header'
					});
				},
				done: function () {
					_this.el.classList.remove('loading');
				}
			});
		};

		_this.onHeaderInputViewOtherButtonClick = function (e) {
			console.log('other button clicked');
			console.log(e);
		};

		_initialize(options);
		options = null;
		return _this;
	};



	var app = window.HeaderApp = HeaderApp({
		el: document.querySelector('#headerinput'),
		model: HeaderModel()
	});
	app.model.trigger('change');

})();
