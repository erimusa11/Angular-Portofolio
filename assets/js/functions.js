/*
 * Template functions file.
 */
jQuery(function () {
    "use strict";
    var screen_has_mouse = false
        , $body = jQuery("body")
        , $logo = jQuery("#mccan-identity")
        , $social_links = jQuery("#mccan-social-profiles")
        , $menu = jQuery("#mccan-site-menu")
        , $content_wrap = jQuery(".mccan-content-wrap")
        , $hero_media = jQuery(".mccan-hero-media")
        , $hero_carousel = jQuery(".mccan-hero-media .owl-carousel")
        , win_width = jQuery(window).width();
    // Simple way of determining if user is using a mouse device.
    function themeMouseMove() {
        screen_has_mouse = true;
    }
    function themeTouchStart() {
        jQuery(window).off("mousemove.mccan");
        screen_has_mouse = false;
        setTimeout(function () {
            jQuery(window).on("mousemove.mccan", themeMouseMove);
        }, 250);
    }
    if (!navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        jQuery(window).on("touchstart.mccan", themeTouchStart).on("mousemove.mccan", themeMouseMove);
        if (window.navigator.msPointerEnabled) {
            document.addEventListener("MSPointerDown", themeTouchStart, false);
        }
    }
    // Initialize custom scrollbars
    if (jQuery.fn.overlayScrollbars) {
        jQuery("body, .mccan-additional-menu-content").each(function () {
            jQuery(this).overlayScrollbars({
                nativeScrollbarsOverlaid: {
                    initialize: false
                }
                , overflowBehavior: {
                    x: "hidden"
                }
                , scrollbars: {
                    autoHide: "scroll"
                }
            });
        });
    }
    // Handle both mouse hover and touch events for traditional menu + mobile hamburger.
    jQuery(".mccan-site-menu-toggle").on("click.mccan", function (e) {
        $body.toggleClass("mccan-mobile-menu-opened");
        jQuery(window).resize();
        if (!$body.hasClass("mccan-mobile-menu-opened")) {
            $menu.removeAttr("style");
            $social_links.removeAttr("style");
        }
        e.preventDefault();
    });
    jQuery("#mccan-site-menu .menu-expand").on("click.mccan", function (e) {
        var $parent = jQuery(this).parent();
        if (jQuery(".mccan-site-menu-toggle").is(":visible")) {
            $parent.toggleClass("collapse");
        }
        e.preventDefault();
    });
    jQuery("#mccan-site-menu .current-menu-parent").addClass("collapse");
    jQuery(document).on({
        mouseenter: function () {
            if (screen_has_mouse) {
                jQuery(this).addClass("hover");
            }
        }
        , mouseleave: function () {
            if (screen_has_mouse) {
                jQuery(this).removeClass("hover");
            }
        }
    }, "#mccan-site-menu li");
    if (jQuery("html").hasClass("touchevents")) {
        jQuery("#mccan-site-menu li.mccan-menu-item-has-children > a:not(.menu-expand)").on("click.mccan", function (e) {
            if (!screen_has_mouse && !window.navigator.msPointerEnabled && !jQuery(".mccan-site-menu-toggle").is(":visible")) {
                var $parent = jQuery(this).parent();
                if (!$parent.parents(".hover").length) {
                    jQuery("#mccan-site-menu li.mccan-menu-item-has-children").not($parent).removeClass("hover");
                }
                $parent.toggleClass("hover");
                e.preventDefault();
            }
        });
    }
    else {
        // Toggle visibility of dropdowns on keyboard focus events.
        jQuery("#mccan-site-menu li > a:not(.menu-expand), #top .site-title a, #social-links-menu a:first").on("focus.mccan blur.mccan", function (e) {
            if (screen_has_mouse && !jQuery("#top .mccan-site-menu-toggle").is(":visible")) {
                var $parent = jQuery(this).parent();
                if (!$parent.parents(".hover").length) {
                    jQuery("#mccan-site-menu .mccan-menu-item-has-children.hover").not($parent).removeClass("hover");
                }
                if ($parent.hasClass("mccan-menu-item-has-children")) {
                    $parent.addClass("hover");
                }
                e.preventDefault();
            }
        });
    }
    // Handle custom my info.
    jQuery(".mccan-my-info .field > a").on("click.mccan", function (e) {
        var $field = jQuery(this).parent();
        $field.toggleClass("show-dropdown").siblings().removeClass("show-dropdown");
        e.preventDefault();
    });
    jQuery(".mccan-my-info .dropdown .values a").on("click.mccan", function (e) {
        jQuery(this).parent().addClass("selected").siblings().removeClass("selected");
        var $field = jQuery(this).parents(".field");
        jQuery("input[type=hidden]", $field).val(jQuery(this).data("value"));
        jQuery("span.field-value", $field).html(jQuery(this).html());
        e.preventDefault();
    });
    if (jQuery.fn.owlCarousel) {
        var multiple_items = jQuery(".item", $hero_carousel).length > 1
            , prev_video_active;
        if (!multiple_items) {
            jQuery(".mccan-my-info").addClass("full-width");
        }
        var onTranslate = function (event) {
                jQuery("video", event.target).each(function () {
                    this.pause();
                });
            }
            , onTranslated = function (event) {
                jQuery(".owl-item.active video", event.target).each(function () {
                    this.play();
                });
                if (jQuery(".owl-item.active .mccan-light-hero-colors", event.target).length > 0) {
                    $body.addClass("mccan-light-hero-colors");
                }
                else {
                    $body.removeClass("mccan-light-hero-colors");
                }
            };
        $hero_carousel.owlCarousel({
            items: 1
            , loop: multiple_items
            , mouseDrag: multiple_items
            , touchDrag: multiple_items
            , nav: true
            , navElement: 'a href="#"'
            , navText: ['<span class="mccan-ti mccan-ti-arrow-left"></span>', '<span class="mccan-ti mccan-ti-arrow-right"></span>']
            , dots: false
            , lazyLoad: true
            , lazyLoadEager: 1
            , video: true
            , responsiveRefreshRate: 0
            , onTranslate: onTranslate
            , onTranslated: onTranslated
            , onLoadedLazy: onTranslated
            , onInitialized: function (event) {
                if (multiple_items) {
                    $body.addClass("hero-has-nav");
                }
                jQuery('<div class="owl-expand"><a href="#"><span class="mccan-ti"></span></a></div>').insertAfter(jQuery(".owl-nav", event.target)).on("click.mccan", function (e) {
                    e.preventDefault();
                    if ($body.hasClass("expanded-hero-start")) {
                        return;
                    }
                    var initialAttribs, finalAttribs, completed = 0
                        , duration = $hero_carousel.data("expand-duration")
                        , $hero_collection = $hero_media.add($hero_carousel);
                    if (isNaN(duration)) {
                        duration = 1000;
                    }
                    $body.toggleClass("expanded-hero").addClass("expanded-hero-start").removeClass("expanded-hero-completed");
                    if ($body.hasClass("expanded-hero")) {
                        initialAttribs = {
                            "right": $hero_media.css("right")
                            , "textIndent": 0
                        };
                        finalAttribs = {
                            "right": 0
                            , "textIndent": 100
                        };
                    }
                    else {
                        initialAttribs = {
                            "textIndent": 100
                            , "right": 0
                        };
                        $hero_media.css("right", "");
                        finalAttribs = {
                            "textIndent": 0
                            , "right": $hero_media.css("right")
                        };
                        $hero_media.css("right", "0");
                    }
                    jQuery(".mccan-hero-media .mccan-ti-spin").css(initialAttribs).animate(finalAttribs, {
                        duration: duration
                        , easing: "easeOutCubic"
                        , step: function (now, fx) {
                            if ("right" == fx.prop) {
                                $hero_collection.css("right", now);
                                $hero_carousel.data("owl.carousel").refresh(true);
                            }
                            else {
                                $content_wrap.css({
                                    "-webkit-transform": "translate(" + now + "%)"
                                    , "-ms-transform": "translate(" + now + "%)"
                                    , "transform": "translate(" + now + "%)"
                                , });
                            }
                        }
                        , complete: function () {
                            completed++;
                            if (completed < 1) {
                                return;
                            }
                            $body.addClass("expanded-hero-completed").removeClass("expanded-hero-start");
                            // clear JS set properties, as they will be set in the CSS as well by the "expanded-hero-completed" selector
                            $hero_media.add($hero_carousel).add($content_wrap).removeAttr("style");
                        }
                    });
                    if (!$body.hasClass("mccan-cv")) {
                        var $nav_buttons = jQuery(this).add(jQuery(this).prev(".owl-nav"));
                        $nav_buttons.animate({
                            "bottom": (-jQuery(this).outerHeight())
                        }, {
                            duration: duration / 2
                            , complete: function () {
                                var $nav = jQuery(".owl-nav", $hero_carousel)
                                    , $expand = jQuery(".owl-expand", $hero_carousel)
                                    , right_expand;
                                if ($body.hasClass("expanded-hero")) {
                                    $nav.css({
                                        "right": 0
                                    });
                                    if ($nav.hasClass("disabled")) {
                                        right_expand = 0;
                                    }
                                    else {
                                        right_expand = $nav.outerWidth();
                                    }
                                    $expand.css({
                                        "right": right_expand
                                        , "margin-right": 0
                                    });
                                }
                                else {
                                    jQuery(this).css({
                                        "right": ""
                                        , "margin-right": ""
                                    });
                                }
                                jQuery(this).animate({
                                    "bottom": 0
                                }, {
                                    duration: duration / 2
                                    , complete: function () {
                                        if (!$body.hasClass("expanded-hero")) {
                                            jQuery(this).removeAttr("style");
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                jQuery(".owl-stage", event.target).on("dblclick.mccan", function (e) {
                    $hero_carousel.find(".owl-expand:visible").trigger("click.mccan");
                });
                var tapedTwice = false;
                jQuery(".owl-stage", event.target).on("touchstart.mccan", function (e) {
                    if (!tapedTwice) {
                        tapedTwice = true;
                        setTimeout(function () {
                            tapedTwice = false;
                        }, 300);
                    }
                    else {
                        $hero_carousel.find(".owl-expand:visible").trigger("click.mccan");
                    }
                });
                jQuery(".mccan-ti-loading", $hero_media).addClass("finished");
            }
        });
    }
    jQuery(".mccan-menu-overlay").on("click.mccan", function (e) {
        if (e.offsetX < 0 && $body.hasClass("mccan-mobile-menu-opened")) {
            jQuery(".mccan-site-menu-toggle").trigger("click.mccan");
        }
    });
    jQuery(window).on("resize", function () {
        win_width = jQuery(window).width();
        if ($body.hasClass("mccan-mobile-menu-opened")) {
            var menu_pos = 0;
            if (win_width < 767) {
                $menu.css({
                    top: $logo.position().top * 2 + $logo.outerHeight()
                });
            }
            else {
                $menu.removeAttr("style");
                $social_links.removeAttr("style");
            }
        }
        else {
            if ($body.hasClass("mccan-full-content")) {
                $content_wrap.css("padding-top", "");
                var contentTop = parseInt($content_wrap.css("padding-top"), 10)
                    , logoHeight = jQuery(".logo", $logo).outerHeight() + $logo.offset().top * 2;
                if (logoHeight > contentTop) {
                    $content_wrap.css("padding-top", logoHeight);
                }
            }
        }
    });
    if ($body.hasClass("mccan-full-content")) {
        jQuery(window).resize();
    }
    jQuery.extend(jQuery.easing, {
    easeOutCubic: function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }});
    // Testimonial Carousel
	$('#testimonial-carousel').owlCarousel({
        loop: true,
        autoplay: true,
        smartSpeed: 500,
        items: 1,
        nav: false
    });    
});
