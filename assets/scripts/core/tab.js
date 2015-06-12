(function(UI) {

    "use strict";

    UI.component('tab', {

        defaults: {
            'target'    : '>li:not(.f-tab-responsive, .f-disabled)',
            'connect'   : false,
            'active'    : 0,
            'animation' : false,
            'duration'  : 200
        },

        boot: function() {

            // init code
            UI.ready(function(context) {

                UI.$("[data-f-tab]", context).each(function() {

                    var tab = UI.$(this);

                    if (!tab.data("tab")) {
                        var obj = UI.tab(tab, UI.Utils.options(tab.attr("data-f-tab")));
                    }
                });
            });
        },

        init: function() {

            var $this = this;

            this.on("click.fatkit.tab", this.options.target, function(e) {
                e.preventDefault();

                if ($this.switcher && $this.switcher.animating) {
                    return;
                }

                $this.find($this.options.target).not(this).removeClass("f-active").blur();
                $this.trigger("change.fatkit.tab", [UI.$(this).addClass("f-active")]);
            });

            if (this.options.connect) {
                this.connect = UI.$(this.options.connect);
            }

            // init responsive tab
            this.responsivetab = UI.$('<li class="f-tab-responsive f-active"><a></a></li>').append('<div class="f-dropdown f-dropdown-small"><ul class="f-nav f-nav-dropdown"></ul><div>');

            this.responsivetab.dropdown = this.responsivetab.find('.f-dropdown');
            this.responsivetab.lst      = this.responsivetab.dropdown.find('ul');
            this.responsivetab.caption  = this.responsivetab.find('a:first');

            if (this.element.hasClass("f-tab-bottom")) this.responsivetab.dropdown.addClass("f-dropdown-up");

            // handle click
            this.responsivetab.lst.on('click.fatkit.tab', 'a', function(e) {

                e.preventDefault();
                e.stopPropagation();

                var link = UI.$(this);

                $this.element.children(':not(.f-tab-responsive)').eq(link.data('index')).trigger('click');
            });

            this.on('show.fatkit.switcher change.fatkit.tab', function(e, tab) {
                $this.responsivetab.caption.html(tab.text());
            });

            this.element.append(this.responsivetab);

            // init FatKit components
            if (this.options.connect) {
                this.switcher = UI.switcher(this.element, {
                    "toggle"    : ">li:not(.f-tab-responsive)",
                    "connect"   : this.options.connect,
                    "active"    : this.options.active,
                    "animation" : this.options.animation,
                    "duration"  : this.options.duration
                });
            }

            UI.dropdown(this.responsivetab, {"mode": "click"});

            // init
            $this.trigger("change.fatkit.tab", [this.element.find(this.options.target).filter('.f-active')]);

            this.check();

            UI.$win.on('resize orientationchange', UI.Utils.debounce(function(){
                if ($this.element.is(":visible"))  $this.check();
            }, 100));

            this.on('display.fatkit.check', function(){
                if ($this.element.is(":visible"))  $this.check();
            });
        },

        check: function() {

            var children = this.element.children(':not(.f-tab-responsive)').removeClass('f-hidden');

            if (!children.length) return;

            var top          = (children.eq(0).offset().top + Math.ceil(children.eq(0).height()/2)),
                doresponsive = false,
                item, link;

            this.responsivetab.lst.empty();

            children.each(function(){

                if (UI.$(this).offset().top > top) {
                    doresponsive = true;
                }
            });

            if (doresponsive) {

                for (var i = 0; i < children.length; i++) {

                    item = UI.$(children.eq(i));
                    link = item.find('a');

                    if (item.css('float') != 'none' && !item.attr('f-dropdown')) {

                        item.addClass('f-hidden');

                        if (!item.hasClass('f-disabled')) {
                            this.responsivetab.lst.append('<li><a href="'+link.attr('href')+'" data-index="'+i+'">'+link.html()+'</a></li>');
                        }
                    }
                }
            }

            this.responsivetab[this.responsivetab.lst.children().length ? 'removeClass':'addClass']('f-hidden');
        }
    });

})(FatKit);
