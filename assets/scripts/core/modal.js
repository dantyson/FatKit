(function(UI) {

	"use strict";

	var active = false, $html = UI.$html, body;

	UI.component('modal', {

		defaults: {
			keyboard: true,
			bgclose: true,
			minScrollHeight: 150,
			center: false
		},

		scrollable: false,
		transition: false,

		init: function() {

			if (!body) body = UI.$('body');

			var $this = this;

			this.transition = UI.support.transition;
			this.paddingdir = "padding-" + (UI.langdirection == 'left' ? "right":"left");
			this.dialog     = this.find(".f-modal-dialog");

			this.on("click", ".f-modal-close", function(e) {
				e.preventDefault();
				$this.hide();
			}).on("click", function(e)
			{

				var target = UI.$(e.target);

				if (target[0] == $this.element[0] && $this.options.bgclose) {
					$this.hide();
				}
			});
		},

		toggle: function() {
			return this[this.isActive() ? "hide" : "show"]();
		},

		show: function() {

			var $this = this;

			if (this.isActive()) return;
			if (active) active.hide(true);

			this.element.removeClass("f-open").show();
			this.resize();

			active = this;
			$html.addClass("f-modal-page").height(); // force browser engine redraw

			this.element.addClass("f-open").trigger("show.fatkit.modal");

			UI.Utils.checkDisplay(this.dialog, true);

			return this;
		},

		hide: function(force) {

			if (!this.isActive()) return;

			if (!force && UI.support.transition) {

				var $this = this;

				this.one(UI.support.transition.end, function() {
					$this._hide();
				}).removeClass("f-open");

			} else {

				this._hide();
			}

			return this;
		},

		resize: function() {

			var bodywidth  = body.width();

			this.scrollbarwidth = window.innerWidth - bodywidth;

			body.css(this.paddingdir, this.scrollbarwidth);

			this.element.css('overflow-y', this.scrollbarwidth ? 'scroll' : 'auto');

			if (!this.updateScrollable() && this.options.center) {

				var dh  = this.dialog.outerHeight(),
				pad = parseInt(this.dialog.css('margin-top'), 10) + parseInt(this.dialog.css('margin-bottom'), 10);

				if ((dh + pad) < window.innerHeight) {
					this.dialog.css({'top': (window.innerHeight/2 - dh/2) - pad });
				} else {
					this.dialog.css({'top': ''});
				}
			}
		},

		updateScrollable: function() {

			// has scrollable?
			var scrollable = this.dialog.find('.f-overflow-container:visible:first');

			if (scrollable.length) {

				scrollable.css("height", 0);

				var offset = Math.abs(parseInt(this.dialog.css("margin-top"), 10)),
				dh     = this.dialog.outerHeight(),
				wh     = window.innerHeight,
				h      = wh - 2*(offset < 20 ? 20:offset) - dh;

				scrollable.css("height", h < this.options.minScrollHeight ? "":h);

				return true;
			}

			return false;
		},

		_hide: function() {

			this.element.hide().removeClass("f-open");

			$html.removeClass("f-modal-page");

			body.css(this.paddingdir, "");

			if(active===this) active = false;

			this.trigger("hide.fatkit.modal");
		},

		isActive: function() {
			return (active == this);
		}

	});

	UI.component('modalTrigger', {

		boot: function() {

			// init code
			UI.$html.on("click.modal.fatkit", "[data-f-modal]", function(e) {

				var ele = UI.$(this);

				if (ele.is("a")) {
					e.preventDefault();
				}

				var objOptions = UI.Utils.options(ele.attr("data-f-modal"));

				var strHref = ele.attr("href");

				if(!!objOptions.selector)
				{

					var objTest = $('<div id="f-ajax-response"></div>');
					$("body").append(objTest);

					var loadModal = UI.modal.dialog('<div class="f-modal-spinner"></div>');
					loadModal.show();

					$("#f-ajax-response").load(strHref + " " + objOptions.selector, function()
					{

						loadModal.hide();
						var imodal = UI.modal.dialogclose('<div class="f-modal-content">' + $("#f-ajax-response").html() + '</div>', {}, true);
						imodal.show();

						imodal.find(".f-modal-content").on("click", "a", function(e)
						{

							e.preventDefault();
							window.open($(this).attr("href"));

						});

						$("#f-ajax-response").remove();

					});

				} else if (!ele.data("modalTrigger"))
				{

					var modal = UI.modalTrigger(ele, UI.Utils.options(ele.attr("data-f-modal")));
					modal.show();

				}

			});

			// close modal on esc button
			UI.$html.on('keydown.modal.fatkit', function (e) {

				if (active && e.keyCode === 27 && active.options.keyboard) { // ESC
					e.preventDefault();
					active.hide();
				}
			});

			UI.$win.on("resize orientationchange", UI.Utils.debounce(function(){
				if (active) active.resize();
			}, 150));
		},

		init: function() {

			var $this = this;

			this.options = UI.$.extend({
				"target": $this.element.is("a") ? $this.element.attr("href") : false
			}, this.options);

			this.modal = UI.modal(this.options.target, this.options);

			this.on("click", function(e) {
				e.preventDefault();
				$this.show();
			});

			//methods
			this.proxy(this.modal, "show hide isActive");
		}
	});

	UI.modal.dialog = function(content, options) {

		var modal = UI.modal(UI.$(UI.modal.dialog.template).appendTo("body"), options);

		modal.on("hide.fatkit.modal", function(){
			if (modal.persist) {
				modal.persist.appendTo(modal.persist.data("modalPersistParent"));
				modal.persist = false;
			}
			modal.element.remove();
		});

		setContent(content, modal);

		return modal;
	};

	UI.modal.dialog.template = '<div class="f-modal"><div class="f-modal-dialog" style="min-height:0;"></div></div>';

	UI.modal.dialogclose = function(content, options, blnLarge) {

		var modal = UI.modal(UI.$(!!blnLarge ? UI.modal.dialogclose.template.replace('"f-modal-dialog"', '"f-modal-dialog f-modal-dialog-large"') : UI.modal.dialogclose.template).appendTo("body"), options);

		modal.on("hide.fatkit.modal", function(){
			if (modal.persist) {
				modal.persist.appendTo(modal.persist.data("modalPersistParent"));
				modal.persist = false;
			}
			modal.element.remove();
		});

		setContent(content, modal);

		return modal;
	};

	UI.modal.dialogclose.template = '<div class="f-modal"><div class="f-modal-dialog" style="min-height:0;"><a class="f-modal-close f-close"></a></div></div>';

	UI.modal.alert = function(content, options)
	{

		UI.modal.dialog(([
			'<div class="f-margin f-modal-content">'+String(content)+'</div>',
			'<div class="f-modal-footer f-text-right"><button class="f-btn f-btn-primary f-modal-close">Ok</button></div>'
		]).join(""), UI.$.extend({bgclose:false, keyboard:false}, options)).show();
	};

	UI.modal.confirm = function(content, onconfirm, options)
	{

		onconfirm = UI.$.isFunction(onconfirm) ? onconfirm : function(){};

		var modal = UI.modal.dialog(([
			'<div class="f-margin f-modal-content">'+String(content)+'</div>',
			'<div class="f-modal-footer f-text-right"><button class="f-btn f-btn-primary js-modal-confirm">Ok</button> <button class="f-btn f-modal-close">Cancel</button></div>'
		]).join(""), UI.$.extend({bgclose:false, keyboard:false}, options));

		modal.element.find(".js-modal-confirm").on("click", function(){
			onconfirm();
			modal.hide();
		});

		modal.show();
	};

	UI.modal.prompt = function(text, value, onsubmit, options) {

		onsubmit = UI.$.isFunction(onsubmit) ? onsubmit : function(value){};

		var modal = UI.modal.dialog(([
			text ? '<div class="f-modal-content f-form">' + String(text) + '</div>':'',
			'<div class="f-margin-small-top f-modal-content f-form"><p><input type="text" class="f-width-1-1"></p></div>',
			'<div class="f-modal-footer f-text-right"><button class="f-btn f-btn-primary js-modal-ok">Ok</button> <button class="f-btn f-modal-close">Cancel</button></div>'
		]).join(""), UI.$.extend({ bgclose : false, keyboard : false}, options)),
		input = modal.element.find("input[type='text']").val(value || '');

		modal.element.find(".js-modal-ok").on("click", function(){
			if (onsubmit(input.val())!==false){
				modal.hide();
			}
		});
		modal.show();
		setTimeout(function(){ input.focus(); }, 100);
	};

	UI.modal.blockUI = function(content, options)
	{

		var modal = UI.modal.dialog(([
			'<div class="f-margin f-modal-content">' + String(content || '<div class="f-text-center">...</div>') + '</div>'
		]).join(""), UI.$.extend({ bgclose : false, keyboard : false}, options));

		modal.content = modal.element.find('.f-modal-content:first');
		modal.show();

		return modal;
	};

	// helper functions
	function setContent(content, modal)
	{

		if(!modal) return;

		if(typeof content === 'object')
		{

			// convert DOM object to a jQuery object
			content = content instanceof jQuery ? content : UI.$(content);

			if(content.parent().length)
			{

				modal.persist = content;
				modal.persist.data("modalPersistParent", content.parent());

			}

		} else if (typeof content === 'string' || typeof content === 'number')
		{

			// just insert the data as innerHTML
			content = UI.$('<div></div>').html(content);

		} else {

			// unsupported data type!
			content = UI.$('<div></div>').html('FatKit.modal Error: Unsupported data type: ' + typeof content);

		}

		content.appendTo(modal.element.find('.f-modal-dialog'));

		return modal;

	}

})(FatKit);
