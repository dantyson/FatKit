(function(addon) {

	var component;

	if (window.FatKit) {
		component = addon(FatKit);
	}

	if (typeof define == "function" && define.amd) {
		define("fatkit-search", ["fatkit"], function(){
			return component || addon(FatKit);
		});
	}

})(function(UI){

	"use strict";

	UI.component('search', {
		defaults: {
			msgResultsHeader   : 'Search Results',
			msgMoreResults     : 'More Results',
			msgNoResults       : 'No results found',
			template           : '<ul class="f-nav f-nav-search f-autocomplete-results">\
									  {{#msgResultsHeader}}<li class="f-nav-header f-skip">{{msgResultsHeader}}</li>{{/msgResultsHeader}}\
									  {{#items && items.length}}\
										  {{~items}}\
										  <li data-url="{{!$item.url}}">\
											  <a href="{{!$item.url}}">\
												  {{{$item.title}}}\
												  {{#$item.text}}<div>{{{$item.text}}}</div>{{/$item.text}}\
											  </a>\
										  </li>\
										  {{/items}}\
										  {{#msgMoreResults}}\
											  <li class="f-nav-divider f-skip"></li>\
											  <li class="f-search-moreresults" data-moreresults="true"><a href="#" onclick="jQuery(this).closest(\'form\').submit();">{{msgMoreResults}}</a></li>\
										  {{/msgMoreResults}}\
									  {{/end}}\
									  {{^items.length}}\
										{{#msgNoResults}}<li class="f-skip"><a>{{msgNoResults}}</a></li>{{/msgNoResults}}\
									  {{/end}}\
								  </ul>',

			renderer: function(data) {

				var $this = this, opts = this.options;

				this.dropdown.append(this.template({"items":data.results || [], "msgResultsHeader":opts.msgResultsHeader, "msgMoreResults": opts.msgMoreResults, "msgNoResults": opts.msgNoResults}));
				this.show();
			}
		},

		boot: function() {

			// init code
			UI.$html.on("focus.search.fatkit", "[data-f-search]", function(e) {
				var ele =UI.$(this);

				if (!ele.data("search")) {
					var obj = UI.search(ele, UI.Utils.options(ele.attr("data-f-search")));
				}
			});
		},

		init: function() {
			var $this = this;

			this.autocomplete = UI.autocomplete(this.element, this.options);

			this.autocomplete.dropdown.addClass('f-dropdown-search');

			this.autocomplete.input.on("keyup", function(){
				$this.element[$this.autocomplete.input.val() ? "addClass":"removeClass"]("f-active");
			}).closest("form").on("reset", function(){
				$this.value="";
				$this.element.removeClass("f-active");
			});

			this.on('select.f.autocomplete', function(e, data) {
				if (data.url) {
				  location.href = data.url;
				} else if(data.moreresults) {
				  $this.autocomplete.input.closest('form').submit();
				}
			});

			this.element.data("search", this);
		}
	});
});
