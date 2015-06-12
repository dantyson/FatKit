(function(UI) {

    "use strict";

    UI.component('buttonRadio', {

        defaults: {
            "target": ".f-btn"
        },

        boot: function() {

            // init code
            UI.$html.on("click.buttonradio.fatkit", "[data-f-btn-radio]", function(e) {

                var ele = UI.$(this);

                if (!ele.data("buttonRadio")) {

                    var obj    = UI.buttonRadio(ele, UI.Utils.options(ele.attr("data-f-btn-radio"))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        target.trigger("click");
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                var ele = UI.$(this);

                if (ele.is('a[href="#"]')) e.preventDefault();

                $this.find($this.options.target).not(ele).removeClass("f-active").blur();
                $this.trigger("change.f.button", [ele.addClass("f-active")]);
            });

        },

        getSelected: function() {
            return this.find(".f-active");
        }
    });

    UI.component('buttonCheckbox', {

        defaults: {
            "target": ".f-btn"
        },

        boot: function() {

            UI.$html.on("click.buttoncheckbox.fatkit", "[data-f-btn-checkbox]", function(e) {
                var ele = UI.$(this);

                if (!ele.data("buttonCheckbox")) {

                    var obj    = UI.buttonCheckbox(ele, UI.Utils.options(ele.attr("data-f-btn-checkbox"))),
                        target = UI.$(e.target);

                    if (target.is(obj.options.target)) {
                        ele.trigger("change.f.button", [target.toggleClass("f-active").blur()]);
                    }
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", this.options.target, function(e) {

                if (UI.$(this).is('a[href="#"]')) e.preventDefault();

                $this.trigger("change.f.button", [UI.$(this).toggleClass("f-active").blur()]);
            });

        },

        getSelected: function() {
            return this.find(".f-active");
        }
    });


    UI.component('button', {

        defaults: {},

        boot: function() {

            UI.$html.on("click.button.fatkit", "[data-f-btn]", function(e) {
                var ele = UI.$(this);

                if (!ele.data("button")) {

                    var obj = UI.button(ele, UI.Utils.options(ele.attr("data-f-btn")));
                    ele.trigger("click");
                }
            });
        },

        init: function() {

            var $this = this;

            this.on("click", function(e) {

                if ($this.element.is('a[href="#"]')) e.preventDefault();

                $this.toggle();
                $this.trigger("change.f.button", [$this.element.blur().hasClass("f-active")]);
            });

        },

        toggle: function() {
            this.element.toggleClass("f-active");
        }
    });

})(FatKit);
