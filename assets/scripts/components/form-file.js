(function(addon)
{

	var component;

	if (window.FatKit) {
		component = addon(FatKit);
	}

	if (typeof define == "function" && define.amd) {
		define("fatkit-form-file", ["fatkit"], function(){
			return component || addon(FatKit);
		});
	}

})(function(UI)
{

	"use strict";

	UI.component('formFile', {

		boot: function()
		{

			// init code
			UI.ready(function(context)
			{

				UI.$("[data-f-form-file]", context).each(function()
				{

					var ele = UI.$(this);

					if (!ele.data("formFile"))
					{
						var obj = UI.formFile(ele, UI.Utils.options(ele.attr("data-f-form-file")));
					}

				});

			});

		},

		init: function()
		{

			var $this = this;

			// init + on change event
			this.on("change", function()
			{

				if(UI.$(this).next().is("input[type='text']"))
				{

					UI.$(this).next().val(UI.$(this).val().replace("C:\\fakepath\\", ""));

				}

			});

		}

	});

	return UI.formFile;

});
