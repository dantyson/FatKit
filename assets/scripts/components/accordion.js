(function(addon) {
    var component;

    if (window.FatKit) {
        component = addon(FatKit);
    }

    if (typeof define == "function" && define.amd) {
        define("fatkit-accordion", ["fatkit"], function(){
            return component || addon(FatKit);
        });
    }
})(function(UI){

    "use strict";

    UI.component('accordion', {

        defaults: {
            showfirst  : true,
            collapse   : true,
            animate    : true,
            easing     : 'swing',
            duration   : 300,
            toggle     : '.f-accordion-title',
            containers : '.f-accordion-content',
            clsactive  : 'f-active'
        },

        boot:  function() {

            // init code
            UI.ready(function(context) {

                setTimeout(function(){

                    UI.$("[data-f-accordion]", context).each(function(){

                        var ele = UI.$(this);

                        if(!ele.data("accordion")) {
                            UI.accordion(ele, UI.Utils.options(ele.attr('data-f-accordion')));
                        }
                    });

                }, 0);
            });
        },

        init: function() {

            var $this = this;

            this.element.on('click.fatkit.accordion', this.options.toggle, function(e) {

                e.preventDefault();

                $this.toggleItem(UI.$(this).data('wrapper'), $this.options.animate, $this.options.collapse);
            });

            this.update();

            if (this.options.showfirst) {
                this.toggleItem(this.toggle.eq(0).data('wrapper'), false, false);
            }
        },

        toggleItem: function(wrapper, animated, collapse) {

            var $this = this;

            wrapper.data('toggle').toggleClass(this.options.clsactive);

            var active = wrapper.data('toggle').hasClass(this.options.clsactive);

            if (collapse) {
                this.toggle.not(wrapper.data('toggle')).removeClass(this.options.clsactive);
                this.content.not(wrapper.data('content')).parent().stop().animate({ height: 0 }, {easing: this.options.easing, duration: animated ? this.options.duration : 0});
            }

            if (animated) {

                wrapper.stop().animate({ height: active ? getHeight(wrapper.data('content')) : 0 }, {easing: this.options.easing, duration: this.options.duration, complete: function() {

                    if (active) {
                        UI.Utils.checkDisplay(wrapper.data('content'));
                        wrapper.height('auto');
                    }

                    $this.trigger('display.fatkit.check');
                }});

            } else {

                wrapper.stop().height(active ? 'auto' : 0);

                if (active) {
                    UI.Utils.checkDisplay(wrapper.data('content'));
                }

                this.trigger('display.fatkit.check');
            }

            this.element.trigger('toggle.fatkit.accordion', [active, wrapper.data('toggle'), wrapper.data('content')]);
        },

        update: function() {

            var $this = this, $content, $wrapper, $toggle;

            this.toggle = this.find(this.options.toggle);
            this.content = this.find(this.options.containers);

            this.content.each(function(index) {

                $content = UI.$(this);

                if ($content.parent().data('wrapper')) {
                    $wrapper = $content.parent();
                } else {
                    $wrapper = UI.$(this).wrap('<div data-wrapper="true" style="overflow:hidden;height:0;position:relative;"></div>').parent();
                }

                $toggle = $this.toggle.eq(index);

                $wrapper.data('toggle', $toggle);
                $wrapper.data('content', $content);
                $toggle.data('wrapper', $wrapper);
                $content.data('wrapper', $wrapper);
            });

            this.element.trigger('update.fatkit.accordion', [this]);
        }

    });

    // helper

    function getHeight(ele) {

        var $ele = UI.$(ele), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {

            var tmp = {
                position   : $ele.css("position"),
                visibility : $ele.css("visibility"),
                display    : $ele.css("display")
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

    return UI.accordion;
});
