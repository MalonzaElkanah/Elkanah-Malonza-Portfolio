/*! lightgallery - v1.6.11 - 2018-05-22
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2018 Sachin N; Licensed GPLv3 */
/*! lightgallery - v1.6.11 - 2018-05-22
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2018 Sachin N; Licensed GPLv3 */
(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof module === 'object' && module.exports) ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(root["jQuery"]);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***

    (function () ***REMOVED***
        'use strict';

        var defaults = ***REMOVED***

            mode: 'lg-slide',

            // Ex : 'ease'
            cssEasing: 'ease',

            //'for jquery animation'
            easing: 'linear',
            speed: 600,
            height: '100%',
            width: '100%',
            addClass: '',
            startClass: 'lg-start-zoom',
            backdropDuration: 150,
            hideBarsDelay: 6000,

            useLeft: false,

            closable: true,
            loop: true,
            escKey: true,
            keyPress: true,
            controls: true,
            slideEndAnimatoin: true,
            hideControlOnEnd: false,
            mousewheel: true,

            getCaptionFromTitleOrAlt: true,

            // .lg-item || '.lg-sub-html'
            appendSubHtmlTo: '.lg-sub-html',

            subHtmlSelectorRelative: false,

            /**
             * @desc number of preload slides
             * will exicute only after the current slide is fully loaded.
             *
             * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
             * slide will be loaded in the background after the 4th slide is fully loaded..
             * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
             *
             */
            preload: 1,
            showAfterLoad: true,
            selector: '',
            selectWithin: '',
            nextHtml: '',
            prevHtml: '',

            // 0, 1
            index: false,

            iframeMaxWidth: '100%',

            download: true,
            counter: true,
            appendCounterTo: '.lg-toolbar',

            swipeThreshold: 50,
            enableSwipe: true,
            enableDrag: true,

            dynamic: false,
            dynamicEl: [],
            galleryId: 1
        ***REMOVED***;

        function Plugin(element, options) ***REMOVED***

            // Current lightGallery element
            this.el = element;

            // Current jquery element
            this.$el = $(element);

            // lightGallery settings
            this.s = $.extend(***REMOVED******REMOVED***, defaults, options);

            // When using dynamic mode, ensure dynamicEl is an array
            if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) ***REMOVED***
                throw ('When using dynamic mode, you must also define dynamicEl as an Array.');
            ***REMOVED***

            // lightGallery modules
            this.modules = ***REMOVED******REMOVED***;

            // false when lightgallery complete first slide;
            this.lGalleryOn = false;

            this.lgBusy = false;

            // Timeout function for hiding controls;
            this.hideBartimeout = false;

            // To determine browser supports for touch events;
            this.isTouch = ('ontouchstart' in document.documentElement);

            // Disable hideControlOnEnd if sildeEndAnimation is true
            if (this.s.slideEndAnimatoin) ***REMOVED***
                this.s.hideControlOnEnd = false;
            ***REMOVED***

            // Gallery items
            if (this.s.dynamic) ***REMOVED***
                this.$items = this.s.dynamicEl;
            ***REMOVED*** else ***REMOVED***
                if (this.s.selector === 'this') ***REMOVED***
                    this.$items = this.$el;
                ***REMOVED*** else if (this.s.selector !== '') ***REMOVED***
                    if (this.s.selectWithin) ***REMOVED***
                        this.$items = $(this.s.selectWithin).find(this.s.selector);
                    ***REMOVED*** else ***REMOVED***
                        this.$items = this.$el.find($(this.s.selector));
                    ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                    this.$items = this.$el.children();
                ***REMOVED***
            ***REMOVED***

            // .lg-item
            this.$slide = '';

            // .lg-outer
            this.$outer = '';

            this.init();

            return this;
        ***REMOVED***

        Plugin.prototype.init = function () ***REMOVED***

            var _this = this;

            // s.preload should not be more than $item.length
            if (_this.s.preload > _this.$items.length) ***REMOVED***
                _this.s.preload = _this.$items.length;
            ***REMOVED***

            // if dynamic option is enabled execute immediately
            var _hash = window.location.hash;
            if (_hash.indexOf('lg=' + this.s.galleryId) > 0) ***REMOVED***

                _this.index = parseInt(_hash.split('&slide=')[1], 10);

                $('body').addClass('lg-from-hash');
                if (!$('body').hasClass('lg-on')) ***REMOVED***
                    setTimeout(function () ***REMOVED***
                        _this.build(_this.index);
                    ***REMOVED***);

                    $('body').addClass('lg-on');
                ***REMOVED***
            ***REMOVED***

            if (_this.s.dynamic) ***REMOVED***

                _this.$el.trigger('onBeforeOpen.lg');

                _this.index = _this.s.index || 0;

                // prevent accidental double execution
                if (!$('body').hasClass('lg-on')) ***REMOVED***
                    setTimeout(function () ***REMOVED***
                        _this.build(_this.index);
                        $('body').addClass('lg-on');
                    ***REMOVED***);
                ***REMOVED***
            ***REMOVED*** else ***REMOVED***

                // Using different namespace for click because click event should not unbind if selector is same object('this')
                _this.$items.on('click.lgcustom', function (event) ***REMOVED***

                    // For IE8
                    try ***REMOVED***
                        event.preventDefault();
                        event.preventDefault();
                    ***REMOVED*** catch (er) ***REMOVED***
                        event.returnValue = false;
                    ***REMOVED***

                    _this.$el.trigger('onBeforeOpen.lg');

                    _this.index = _this.s.index || _this.$items.index(this);

                    // prevent accidental double execution
                    if (!$('body').hasClass('lg-on')) ***REMOVED***
                        _this.build(_this.index);
                        $('body').addClass('lg-on');
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***

        ***REMOVED***;

        Plugin.prototype.build = function (index) ***REMOVED***

            var _this = this;

            _this.structure();

            // module constructor
            $.each($.fn.lightGallery.modules, function (key) ***REMOVED***
                _this.modules[key] = new $.fn.lightGallery.modules[key](_this.el);
            ***REMOVED***);

            // initiate slide function
            _this.slide(index, false, false, false);

            if (_this.s.keyPress) ***REMOVED***
                _this.keyPress();
            ***REMOVED***

            if (_this.$items.length > 1) ***REMOVED***

                _this.arrow();

                setTimeout(function () ***REMOVED***
                    _this.enableDrag();
                    _this.enableSwipe();
                ***REMOVED***, 50);

                if (_this.s.mousewheel) ***REMOVED***
                    _this.mousewheel();
                ***REMOVED***
            ***REMOVED*** else ***REMOVED***
                _this.$slide.on('click.lg', function () ***REMOVED***
                    _this.$el.trigger('onSlideClick.lg');
                ***REMOVED***);
            ***REMOVED***

            _this.counter();

            _this.closeGallery();

            _this.$el.trigger('onAfterOpen.lg');

            // Hide controllers if mouse doesn't move for some period
            _this.$outer.on('mousemove.lg click.lg touchstart.lg', function () ***REMOVED***

                _this.$outer.removeClass('lg-hide-items');

                clearTimeout(_this.hideBartimeout);

                // Timeout will be cleared on each slide movement also
                _this.hideBartimeout = setTimeout(function () ***REMOVED***
                    _this.$outer.addClass('lg-hide-items');
                ***REMOVED***, _this.s.hideBarsDelay);

            ***REMOVED***);

            _this.$outer.trigger('mousemove.lg');

        ***REMOVED***;

        Plugin.prototype.structure = function () ***REMOVED***
            var list = '';
            var controls = '';
            var i = 0;
            var subHtmlCont = '';
            var template;
            var _this = this;

            $('body').append('<div class="lg-backdrop"></div>');
            $('.lg-backdrop').css('transition-duration', this.s.backdropDuration + 'ms');

            // Create gallery items
            for (i = 0; i < this.$items.length; i++) ***REMOVED***
                list += '<div class="lg-item"></div>';
            ***REMOVED***

            // Create controlls
            if (this.s.controls && this.$items.length > 1) ***REMOVED***
                controls = '<div class="lg-actions">' +
                    '<button class="lg-prev lg-icon">' + this.s.prevHtml + '</button>' +
                    '<button class="lg-next lg-icon">' + this.s.nextHtml + '</button>' +
                    '</div>';
            ***REMOVED***

            if (this.s.appendSubHtmlTo === '.lg-sub-html') ***REMOVED***
                subHtmlCont = '<div class="lg-sub-html"></div>';
            ***REMOVED***

            template = '<div class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' +
                '<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' +
                '<div class="lg-inner">' + list + '</div>' +
                '<div class="lg-toolbar lg-group">' +
                '<span class="lg-close lg-icon"></span>' +
                '</div>' +
                controls +
                subHtmlCont +
                '</div>' +
                '</div>';

            $('body').append(template);
            this.$outer = $('.lg-outer');
            this.$slide = this.$outer.find('.lg-item');

            if (this.s.useLeft) ***REMOVED***
                this.$outer.addClass('lg-use-left');

                // Set mode lg-slide if use left is true;
                this.s.mode = 'lg-slide';
            ***REMOVED*** else ***REMOVED***
                this.$outer.addClass('lg-use-css3');
            ***REMOVED***

            // For fixed height gallery
            _this.setTop();
            $(window).on('resize.lg orientationchange.lg', function () ***REMOVED***
                setTimeout(function () ***REMOVED***
                    _this.setTop();
                ***REMOVED***, 100);
            ***REMOVED***);

            // add class lg-current to remove initial transition
            this.$slide.eq(this.index).addClass('lg-current');

            // add Class for css support and transition mode
            if (this.doCss()) ***REMOVED***
                this.$outer.addClass('lg-css3');
            ***REMOVED*** else ***REMOVED***
                this.$outer.addClass('lg-css');

                // Set speed 0 because no animation will happen if browser doesn't support css3
                this.s.speed = 0;
            ***REMOVED***

            this.$outer.addClass(this.s.mode);

            if (this.s.enableDrag && this.$items.length > 1) ***REMOVED***
                this.$outer.addClass('lg-grab');
            ***REMOVED***

            if (this.s.showAfterLoad) ***REMOVED***
                this.$outer.addClass('lg-show-after-load');
            ***REMOVED***

            if (this.doCss()) ***REMOVED***
                var $inner = this.$outer.find('.lg-inner');
                $inner.css('transition-timing-function', this.s.cssEasing);
                $inner.css('transition-duration', this.s.speed + 'ms');
            ***REMOVED***

            setTimeout(function () ***REMOVED***
                $('.lg-backdrop').addClass('in');
            ***REMOVED***);

            setTimeout(function () ***REMOVED***
                _this.$outer.addClass('lg-visible');
            ***REMOVED***, this.s.backdropDuration);

            if (this.s.download) ***REMOVED***
                this.$outer.find('.lg-toolbar').append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>');
            ***REMOVED***

            // Store the current scroll top value to scroll back after closing the gallery..
            this.prevScrollTop = $(window).scrollTop();

        ***REMOVED***;

        // For fixed height gallery
        Plugin.prototype.setTop = function () ***REMOVED***
            if (this.s.height !== '100%') ***REMOVED***
                var wH = $(window).height();
                var top = (wH - parseInt(this.s.height, 10)) / 2;
                var $lGallery = this.$outer.find('.lg');
                if (wH >= parseInt(this.s.height, 10)) ***REMOVED***
                    $lGallery.css('top', top + 'px');
                ***REMOVED*** else ***REMOVED***
                    $lGallery.css('top', '0px');
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;

        // Find css3 support
        Plugin.prototype.doCss = function () ***REMOVED***
            // check for css animation support
            var support = function () ***REMOVED***
                var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                var root = document.documentElement;
                var i = 0;
                for (i = 0; i < transition.length; i++) ***REMOVED***
                    if (transition[i] in root.style) ***REMOVED***
                        return true;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***;

            if (support()) ***REMOVED***
                return true;
            ***REMOVED***

            return false;
        ***REMOVED***;

        /**
         *  @desc Check the given src is video
         *  @param ***REMOVED***String***REMOVED*** src
         *  @return ***REMOVED***Object***REMOVED*** video type
         *  Ex:***REMOVED*** youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] ***REMOVED***
         */
        Plugin.prototype.isVideo = function (src, index) ***REMOVED***

            var html;
            if (this.s.dynamic) ***REMOVED***
                html = this.s.dynamicEl[index].html;
            ***REMOVED*** else ***REMOVED***
                html = this.$items.eq(index).attr('data-html');
            ***REMOVED***

            if (!src) ***REMOVED***
                if (html) ***REMOVED***
                    return ***REMOVED***
                        html5: true
                    ***REMOVED***;
                ***REMOVED*** else ***REMOVED***
                    console.error('lightGallery :- data-src is not pvovided on slide item ' + (index + 1) + '. Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html');
                    return false;
                ***REMOVED***
            ***REMOVED***

            var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
            var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
            var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
            var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);

            if (youtube) ***REMOVED***
                return ***REMOVED***
                    youtube: youtube
                ***REMOVED***;
            ***REMOVED*** else if (vimeo) ***REMOVED***
                return ***REMOVED***
                    vimeo: vimeo
                ***REMOVED***;
            ***REMOVED*** else if (dailymotion) ***REMOVED***
                return ***REMOVED***
                    dailymotion: dailymotion
                ***REMOVED***;
            ***REMOVED*** else if (vk) ***REMOVED***
                return ***REMOVED***
                    vk: vk
                ***REMOVED***;
            ***REMOVED***
        ***REMOVED***;

        /**
         *  @desc Create image counter
         *  Ex: 1/10
         */
        Plugin.prototype.counter = function () ***REMOVED***
            if (this.s.counter) ***REMOVED***
                $(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.$items.length + '</span></div>');
            ***REMOVED***
        ***REMOVED***;

        /**
         *  @desc add sub-html into the slide
         *  @param ***REMOVED***Number***REMOVED*** index - index of the slide
         */
        Plugin.prototype.addHtml = function (index) ***REMOVED***
            var subHtml = null;
            var subHtmlUrl;
            var $currentEle;
            if (this.s.dynamic) ***REMOVED***
                if (this.s.dynamicEl[index].subHtmlUrl) ***REMOVED***
                    subHtmlUrl = this.s.dynamicEl[index].subHtmlUrl;
                ***REMOVED*** else ***REMOVED***
                    subHtml = this.s.dynamicEl[index].subHtml;
                ***REMOVED***
            ***REMOVED*** else ***REMOVED***
                $currentEle = this.$items.eq(index);
                if ($currentEle.attr('data-sub-html-url')) ***REMOVED***
                    subHtmlUrl = $currentEle.attr('data-sub-html-url');
                ***REMOVED*** else ***REMOVED***
                    subHtml = $currentEle.attr('data-sub-html');
                    if (this.s.getCaptionFromTitleOrAlt && !subHtml) ***REMOVED***
                        subHtml = $currentEle.attr('title') || $currentEle.find('img').first().attr('alt');
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***

            if (!subHtmlUrl) ***REMOVED***
                if (typeof subHtml !== 'undefined' && subHtml !== null) ***REMOVED***

                    // get first letter of subhtml
                    // if first letter starts with . or # get the html form the jQuery object
                    var fL = subHtml.substring(0, 1);
                    if (fL === '.' || fL === '#') ***REMOVED***
                        if (this.s.subHtmlSelectorRelative && !this.s.dynamic) ***REMOVED***
                            subHtml = $currentEle.find(subHtml).html();
                        ***REMOVED*** else ***REMOVED***
                            subHtml = $(subHtml).html();
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                    subHtml = '';
                ***REMOVED***
            ***REMOVED***

            if (this.s.appendSubHtmlTo === '.lg-sub-html') ***REMOVED***

                if (subHtmlUrl) ***REMOVED***
                    this.$outer.find(this.s.appendSubHtmlTo).load(subHtmlUrl);
                ***REMOVED*** else ***REMOVED***
                    this.$outer.find(this.s.appendSubHtmlTo).html(subHtml);
                ***REMOVED***

            ***REMOVED*** else ***REMOVED***

                if (subHtmlUrl) ***REMOVED***
                    this.$slide.eq(index).load(subHtmlUrl);
                ***REMOVED*** else ***REMOVED***
                    this.$slide.eq(index).append(subHtml);
                ***REMOVED***
            ***REMOVED***

            // Add lg-empty-html class if title doesn't exist
            if (typeof subHtml !== 'undefined' && subHtml !== null) ***REMOVED***
                if (subHtml === '') ***REMOVED***
                    this.$outer.find(this.s.appendSubHtmlTo).addClass('lg-empty-html');
                ***REMOVED*** else ***REMOVED***
                    this.$outer.find(this.s.appendSubHtmlTo).removeClass('lg-empty-html');
                ***REMOVED***
            ***REMOVED***

            this.$el.trigger('onAfterAppendSubHtml.lg', [index]);
        ***REMOVED***;

        /**
         *  @desc Preload slides
         *  @param ***REMOVED***Number***REMOVED*** index - index of the slide
         */
        Plugin.prototype.preload = function (index) ***REMOVED***
            var i = 1;
            var j = 1;
            for (i = 1; i <= this.s.preload; i++) ***REMOVED***
                if (i >= this.$items.length - index) ***REMOVED***
                    break;
                ***REMOVED***

                this.loadContent(index + i, false, 0);
            ***REMOVED***

            for (j = 1; j <= this.s.preload; j++) ***REMOVED***
                if (index - j < 0) ***REMOVED***
                    break;
                ***REMOVED***

                this.loadContent(index - j, false, 0);
            ***REMOVED***
        ***REMOVED***;

        /**
         *  @desc Load slide content into slide.
         *  @param ***REMOVED***Number***REMOVED*** index - index of the slide.
         *  @param ***REMOVED***Boolean***REMOVED*** rec - if true call loadcontent() function again.
         *  @param ***REMOVED***Boolean***REMOVED*** delay - delay for adding complete class. it is 0 except first time.
         */
        Plugin.prototype.loadContent = function (index, rec, delay) ***REMOVED***

            var _this = this;
            var _hasPoster = false;
            var _$img;
            var _src;
            var _poster;
            var _srcset;
            var _sizes;
            var _html;
            var getResponsiveSrc = function (srcItms) ***REMOVED***
                var rsWidth = [];
                var rsSrc = [];
                for (var i = 0; i < srcItms.length; i++) ***REMOVED***
                    var __src = srcItms[i].split(' ');

                    // Manage empty space
                    if (__src[0] === '') ***REMOVED***
                        __src.splice(0, 1);
                    ***REMOVED***

                    rsSrc.push(__src[0]);
                    rsWidth.push(__src[1]);
                ***REMOVED***

                var wWidth = $(window).width();
                for (var j = 0; j < rsWidth.length; j++) ***REMOVED***
                    if (parseInt(rsWidth[j], 10) > wWidth) ***REMOVED***
                        _src = rsSrc[j];
                        break;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***;

            if (_this.s.dynamic) ***REMOVED***

                if (_this.s.dynamicEl[index].poster) ***REMOVED***
                    _hasPoster = true;
                    _poster = _this.s.dynamicEl[index].poster;
                ***REMOVED***

                _html = _this.s.dynamicEl[index].html;
                _src = _this.s.dynamicEl[index].src;

                if (_this.s.dynamicEl[index].responsive) ***REMOVED***
                    var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
                    getResponsiveSrc(srcDyItms);
                ***REMOVED***

                _srcset = _this.s.dynamicEl[index].srcset;
                _sizes = _this.s.dynamicEl[index].sizes;

            ***REMOVED*** else ***REMOVED***

                if (_this.$items.eq(index).attr('data-poster')) ***REMOVED***
                    _hasPoster = true;
                    _poster = _this.$items.eq(index).attr('data-poster');
                ***REMOVED***

                _html = _this.$items.eq(index).attr('data-html');
                _src = _this.$items.eq(index).attr('href') || _this.$items.eq(index).attr('data-src');

                if (_this.$items.eq(index).attr('data-responsive')) ***REMOVED***
                    var srcItms = _this.$items.eq(index).attr('data-responsive').split(',');
                    getResponsiveSrc(srcItms);
                ***REMOVED***

                _srcset = _this.$items.eq(index).attr('data-srcset');
                _sizes = _this.$items.eq(index).attr('data-sizes');

            ***REMOVED***

            //if (_src || _srcset || _sizes || _poster) ***REMOVED***

            var iframe = false;
            if (_this.s.dynamic) ***REMOVED***
                if (_this.s.dynamicEl[index].iframe) ***REMOVED***
                    iframe = true;
                ***REMOVED***
            ***REMOVED*** else ***REMOVED***
                if (_this.$items.eq(index).attr('data-iframe') === 'true') ***REMOVED***
                    iframe = true;
                ***REMOVED***
            ***REMOVED***

            var _isVideo = _this.isVideo(_src, index);
            if (!_this.$slide.eq(index).hasClass('lg-loaded')) ***REMOVED***
                if (iframe) ***REMOVED***
                    _this.$slide.eq(index).prepend('<div class="lg-video-cont lg-has-iframe" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
                ***REMOVED*** else if (_hasPoster) ***REMOVED***
                    var videoClass = '';
                    if (_isVideo && _isVideo.youtube) ***REMOVED***
                        videoClass = 'lg-has-youtube';
                    ***REMOVED*** else if (_isVideo && _isVideo.vimeo) ***REMOVED***
                        videoClass = 'lg-has-vimeo';
                    ***REMOVED*** else ***REMOVED***
                        videoClass = 'lg-has-html5';
                    ***REMOVED***

                    _this.$slide.eq(index).prepend('<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');

                ***REMOVED*** else if (_isVideo) ***REMOVED***
                    _this.$slide.eq(index).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>');
                    _this.$el.trigger('hasVideo.lg', [index, _src, _html]);
                ***REMOVED*** else ***REMOVED***
                    _this.$slide.eq(index).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + _src + '" /></div>');
                ***REMOVED***

                _this.$el.trigger('onAferAppendSlide.lg', [index]);

                _$img = _this.$slide.eq(index).find('.lg-object');
                if (_sizes) ***REMOVED***
                    _$img.attr('sizes', _sizes);
                ***REMOVED***

                if (_srcset) ***REMOVED***
                    _$img.attr('srcset', _srcset);
                    try ***REMOVED***
                        picturefill(***REMOVED***
                            elements: [_$img[0]]
                        ***REMOVED***);
                    ***REMOVED*** catch (e) ***REMOVED***
                        console.warn('lightGallery :- If you want srcset to be supported for older browser please include picturefil version 2 javascript library in your document.');
                    ***REMOVED***
                ***REMOVED***

                if (this.s.appendSubHtmlTo !== '.lg-sub-html') ***REMOVED***
                    _this.addHtml(index);
                ***REMOVED***

                _this.$slide.eq(index).addClass('lg-loaded');
            ***REMOVED***

            _this.$slide.eq(index).find('.lg-object').on('load.lg error.lg', function () ***REMOVED***

                // For first time add some delay for displaying the start animation.
                var _speed = 0;

                // Do not change the delay value because it is required for zoom plugin.
                // If gallery opened from direct url (hash) speed value should be 0
                if (delay && !$('body').hasClass('lg-from-hash')) ***REMOVED***
                    _speed = delay;
                ***REMOVED***

                setTimeout(function () ***REMOVED***
                    _this.$slide.eq(index).addClass('lg-complete');
                    _this.$el.trigger('onSlideItemLoad.lg', [index, delay || 0]);
                ***REMOVED***, _speed);

            ***REMOVED***);

            // @todo check load state for html5 videos
            if (_isVideo && _isVideo.html5 && !_hasPoster) ***REMOVED***
                _this.$slide.eq(index).addClass('lg-complete');
            ***REMOVED***

            if (rec === true) ***REMOVED***
                if (!_this.$slide.eq(index).hasClass('lg-complete')) ***REMOVED***
                    _this.$slide.eq(index).find('.lg-object').on('load.lg error.lg', function () ***REMOVED***
                        _this.preload(index);
                    ***REMOVED***);
                ***REMOVED*** else ***REMOVED***
                    _this.preload(index);
                ***REMOVED***
            ***REMOVED***

            //***REMOVED***
        ***REMOVED***;

        /**
        *   @desc slide function for lightgallery
            ** Slide() gets call on start
            ** ** Set lg.on true once slide() function gets called.
            ** Call loadContent() on slide() function inside setTimeout
            ** ** On first slide we do not want any animation like slide of fade
            ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
            ** ** Else loadContent() should wait for the transition to complete.
            ** ** So set timeout s.speed + 50
        <=> ** loadContent() will load slide content in to the particular slide
            ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
            ** ** preload will execute only when the previous slide is fully loaded (images iframe)
            ** ** avoid simultaneous image load
        <=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
            ** loadContent()  <====> Preload();
    
        *   @param ***REMOVED***Number***REMOVED*** index - index of the slide
        *   @param ***REMOVED***Boolean***REMOVED*** fromTouch - true if slide function called via touch event or mouse drag
        *   @param ***REMOVED***Boolean***REMOVED*** fromThumb - true if slide function called via thumbnail click
        *   @param ***REMOVED***String***REMOVED*** direction - Direction of the slide(next/prev)
        */
        Plugin.prototype.slide = function (index, fromTouch, fromThumb, direction) ***REMOVED***

            var _prevIndex = this.$outer.find('.lg-current').index();
            var _this = this;

            // Prevent if multiple call
            // Required for hsh plugin
            if (_this.lGalleryOn && (_prevIndex === index)) ***REMOVED***
                return;
            ***REMOVED***

            var _length = this.$slide.length;
            var _time = _this.lGalleryOn ? this.s.speed : 0;

            if (!_this.lgBusy) ***REMOVED***

                if (this.s.download) ***REMOVED***
                    var _src;
                    if (_this.s.dynamic) ***REMOVED***
                        _src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
                    ***REMOVED*** else ***REMOVED***
                        _src = _this.$items.eq(index).attr('data-download-url') !== 'false' && (_this.$items.eq(index).attr('data-download-url') || _this.$items.eq(index).attr('href') || _this.$items.eq(index).attr('data-src'));

                    ***REMOVED***

                    if (_src) ***REMOVED***
                        $('#lg-download').attr('href', _src);
                        _this.$outer.removeClass('lg-hide-download');
                    ***REMOVED*** else ***REMOVED***
                        _this.$outer.addClass('lg-hide-download');
                    ***REMOVED***
                ***REMOVED***

                this.$el.trigger('onBeforeSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);

                _this.lgBusy = true;

                clearTimeout(_this.hideBartimeout);

                // Add title if this.s.appendSubHtmlTo === lg-sub-html
                if (this.s.appendSubHtmlTo === '.lg-sub-html') ***REMOVED***

                    // wait for slide animation to complete
                    setTimeout(function () ***REMOVED***
                        _this.addHtml(index);
                    ***REMOVED***, _time);
                ***REMOVED***

                this.arrowDisable(index);

                if (!direction) ***REMOVED***
                    if (index < _prevIndex) ***REMOVED***
                        direction = 'prev';
                    ***REMOVED*** else if (index > _prevIndex) ***REMOVED***
                        direction = 'next';
                    ***REMOVED***
                ***REMOVED***

                if (!fromTouch) ***REMOVED***

                    // remove all transitions
                    _this.$outer.addClass('lg-no-trans');

                    this.$slide.removeClass('lg-prev-slide lg-next-slide');

                    if (direction === 'prev') ***REMOVED***

                        //prevslide
                        this.$slide.eq(index).addClass('lg-prev-slide');
                        this.$slide.eq(_prevIndex).addClass('lg-next-slide');
                    ***REMOVED*** else ***REMOVED***

                        // next slide
                        this.$slide.eq(index).addClass('lg-next-slide');
                        this.$slide.eq(_prevIndex).addClass('lg-prev-slide');
                    ***REMOVED***

                    // give 50 ms for browser to add/remove class
                    setTimeout(function () ***REMOVED***
                        _this.$slide.removeClass('lg-current');

                        //_this.$slide.eq(_prevIndex).removeClass('lg-current');
                        _this.$slide.eq(index).addClass('lg-current');

                        // reset all transitions
                        _this.$outer.removeClass('lg-no-trans');
                    ***REMOVED***, 50);
                ***REMOVED*** else ***REMOVED***

                    this.$slide.removeClass('lg-prev-slide lg-current lg-next-slide');
                    var touchPrev;
                    var touchNext;
                    if (_length > 2) ***REMOVED***
                        touchPrev = index - 1;
                        touchNext = index + 1;

                        if ((index === 0) && (_prevIndex === _length - 1)) ***REMOVED***

                            // next slide
                            touchNext = 0;
                            touchPrev = _length - 1;
                        ***REMOVED*** else if ((index === _length - 1) && (_prevIndex === 0)) ***REMOVED***

                            // prev slide
                            touchNext = 0;
                            touchPrev = _length - 1;
                        ***REMOVED***

                    ***REMOVED*** else ***REMOVED***
                        touchPrev = 0;
                        touchNext = 1;
                    ***REMOVED***

                    if (direction === 'prev') ***REMOVED***
                        _this.$slide.eq(touchNext).addClass('lg-next-slide');
                    ***REMOVED*** else ***REMOVED***
                        _this.$slide.eq(touchPrev).addClass('lg-prev-slide');
                    ***REMOVED***

                    _this.$slide.eq(index).addClass('lg-current');
                ***REMOVED***

                if (_this.lGalleryOn) ***REMOVED***
                    setTimeout(function () ***REMOVED***
                        _this.loadContent(index, true, 0);
                    ***REMOVED***, this.s.speed + 50);

                    setTimeout(function () ***REMOVED***
                        _this.lgBusy = false;
                        _this.$el.trigger('onAfterSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);
                    ***REMOVED***, this.s.speed);

                ***REMOVED*** else ***REMOVED***
                    _this.loadContent(index, true, _this.s.backdropDuration);

                    _this.lgBusy = false;
                    _this.$el.trigger('onAfterSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);
                ***REMOVED***

                _this.lGalleryOn = true;

                if (this.s.counter) ***REMOVED***
                    $('#lg-counter-current').text(index + 1);
                ***REMOVED***

            ***REMOVED***
            _this.index = index;

        ***REMOVED***;

        /**
         *  @desc Go to next slide
         *  @param ***REMOVED***Boolean***REMOVED*** fromTouch - true if slide function called via touch event
         */
        Plugin.prototype.goToNextSlide = function (fromTouch) ***REMOVED***
            var _this = this;
            var _loop = _this.s.loop;
            if (fromTouch && _this.$slide.length < 3) ***REMOVED***
                _loop = false;
            ***REMOVED***

            if (!_this.lgBusy) ***REMOVED***
                if ((_this.index + 1) < _this.$slide.length) ***REMOVED***
                    _this.index++;
                    _this.$el.trigger('onBeforeNextSlide.lg', [_this.index]);
                    _this.slide(_this.index, fromTouch, false, 'next');
                ***REMOVED*** else ***REMOVED***
                    if (_loop) ***REMOVED***
                        _this.index = 0;
                        _this.$el.trigger('onBeforeNextSlide.lg', [_this.index]);
                        _this.slide(_this.index, fromTouch, false, 'next');
                    ***REMOVED*** else if (_this.s.slideEndAnimatoin && !fromTouch) ***REMOVED***
                        _this.$outer.addClass('lg-right-end');
                        setTimeout(function () ***REMOVED***
                            _this.$outer.removeClass('lg-right-end');
                        ***REMOVED***, 400);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;

        /**
         *  @desc Go to previous slide
         *  @param ***REMOVED***Boolean***REMOVED*** fromTouch - true if slide function called via touch event
         */
        Plugin.prototype.goToPrevSlide = function (fromTouch) ***REMOVED***
            var _this = this;
            var _loop = _this.s.loop;
            if (fromTouch && _this.$slide.length < 3) ***REMOVED***
                _loop = false;
            ***REMOVED***

            if (!_this.lgBusy) ***REMOVED***
                if (_this.index > 0) ***REMOVED***
                    _this.index--;
                    _this.$el.trigger('onBeforePrevSlide.lg', [_this.index, fromTouch]);
                    _this.slide(_this.index, fromTouch, false, 'prev');
                ***REMOVED*** else ***REMOVED***
                    if (_loop) ***REMOVED***
                        _this.index = _this.$items.length - 1;
                        _this.$el.trigger('onBeforePrevSlide.lg', [_this.index, fromTouch]);
                        _this.slide(_this.index, fromTouch, false, 'prev');
                    ***REMOVED*** else if (_this.s.slideEndAnimatoin && !fromTouch) ***REMOVED***
                        _this.$outer.addClass('lg-left-end');
                        setTimeout(function () ***REMOVED***
                            _this.$outer.removeClass('lg-left-end');
                        ***REMOVED***, 400);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;

        Plugin.prototype.keyPress = function () ***REMOVED***
            var _this = this;
            if (this.$items.length > 1) ***REMOVED***
                $(window).on('keyup.lg', function (e) ***REMOVED***
                    if (_this.$items.length > 1) ***REMOVED***
                        if (e.keyCode === 37) ***REMOVED***
                            e.preventDefault();
                            _this.goToPrevSlide();
                        ***REMOVED***

                        if (e.keyCode === 39) ***REMOVED***
                            e.preventDefault();
                            _this.goToNextSlide();
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***

            $(window).on('keydown.lg', function (e) ***REMOVED***
                if (_this.s.escKey === true && e.keyCode === 27) ***REMOVED***
                    e.preventDefault();
                    if (!_this.$outer.hasClass('lg-thumb-open')) ***REMOVED***
                        _this.destroy();
                    ***REMOVED*** else ***REMOVED***
                        _this.$outer.removeClass('lg-thumb-open');
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***;

        Plugin.prototype.arrow = function () ***REMOVED***
            var _this = this;
            this.$outer.find('.lg-prev').on('click.lg', function () ***REMOVED***
                _this.goToPrevSlide();
            ***REMOVED***);

            this.$outer.find('.lg-next').on('click.lg', function () ***REMOVED***
                _this.goToNextSlide();
            ***REMOVED***);
        ***REMOVED***;

        Plugin.prototype.arrowDisable = function (index) ***REMOVED***

            // Disable arrows if s.hideControlOnEnd is true
            if (!this.s.loop && this.s.hideControlOnEnd) ***REMOVED***
                if ((index + 1) < this.$slide.length) ***REMOVED***
                    this.$outer.find('.lg-next').removeAttr('disabled').removeClass('disabled');
                ***REMOVED*** else ***REMOVED***
                    this.$outer.find('.lg-next').attr('disabled', 'disabled').addClass('disabled');
                ***REMOVED***

                if (index > 0) ***REMOVED***
                    this.$outer.find('.lg-prev').removeAttr('disabled').removeClass('disabled');
                ***REMOVED*** else ***REMOVED***
                    this.$outer.find('.lg-prev').attr('disabled', 'disabled').addClass('disabled');
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;

        Plugin.prototype.setTranslate = function ($el, xValue, yValue) ***REMOVED***
            // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
            if (this.s.useLeft) ***REMOVED***
                $el.css('left', xValue);
            ***REMOVED*** else ***REMOVED***
                $el.css(***REMOVED***
                    transform: 'translate3d(' + (xValue) + 'px, ' + yValue + 'px, 0px)'
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***;

        Plugin.prototype.touchMove = function (startCoords, endCoords) ***REMOVED***

            var distance = endCoords - startCoords;

            if (Math.abs(distance) > 15) ***REMOVED***
                // reset opacity and transition duration
                this.$outer.addClass('lg-dragging');

                // move current slide
                this.setTranslate(this.$slide.eq(this.index), distance, 0);

                // move next and prev slide with current slide
                this.setTranslate($('.lg-prev-slide'), -this.$slide.eq(this.index).width() + distance, 0);
                this.setTranslate($('.lg-next-slide'), this.$slide.eq(this.index).width() + distance, 0);
            ***REMOVED***
        ***REMOVED***;

        Plugin.prototype.touchEnd = function (distance) ***REMOVED***
            var _this = this;

            // keep slide animation for any mode while dragg/swipe
            if (_this.s.mode !== 'lg-slide') ***REMOVED***
                _this.$outer.addClass('lg-slide');
            ***REMOVED***

            this.$slide.not('.lg-current, .lg-prev-slide, .lg-next-slide').css('opacity', '0');

            // set transition duration
            setTimeout(function () ***REMOVED***
                _this.$outer.removeClass('lg-dragging');
                if ((distance < 0) && (Math.abs(distance) > _this.s.swipeThreshold)) ***REMOVED***
                    _this.goToNextSlide(true);
                ***REMOVED*** else if ((distance > 0) && (Math.abs(distance) > _this.s.swipeThreshold)) ***REMOVED***
                    _this.goToPrevSlide(true);
                ***REMOVED*** else if (Math.abs(distance) < 5) ***REMOVED***

                    // Trigger click if distance is less than 5 pix
                    _this.$el.trigger('onSlideClick.lg');
                ***REMOVED***

                _this.$slide.removeAttr('style');
            ***REMOVED***);

            // remove slide class once drag/swipe is completed if mode is not slide
            setTimeout(function () ***REMOVED***
                if (!_this.$outer.hasClass('lg-dragging') && _this.s.mode !== 'lg-slide') ***REMOVED***
                    _this.$outer.removeClass('lg-slide');
                ***REMOVED***
            ***REMOVED***, _this.s.speed + 100);

        ***REMOVED***;

        Plugin.prototype.enableSwipe = function () ***REMOVED***
            var _this = this;
            var startCoords = 0;
            var endCoords = 0;
            var isMoved = false;

            if (_this.s.enableSwipe && _this.doCss()) ***REMOVED***

                _this.$slide.on('touchstart.lg', function (e) ***REMOVED***
                    if (!_this.$outer.hasClass('lg-zoomed') && !_this.lgBusy) ***REMOVED***
                        e.preventDefault();
                        _this.manageSwipeClass();
                        startCoords = e.originalEvent.targetTouches[0].pageX;
                    ***REMOVED***
                ***REMOVED***);

                _this.$slide.on('touchmove.lg', function (e) ***REMOVED***
                    if (!_this.$outer.hasClass('lg-zoomed')) ***REMOVED***
                        e.preventDefault();
                        endCoords = e.originalEvent.targetTouches[0].pageX;
                        _this.touchMove(startCoords, endCoords);
                        isMoved = true;
                    ***REMOVED***
                ***REMOVED***);

                _this.$slide.on('touchend.lg', function () ***REMOVED***
                    if (!_this.$outer.hasClass('lg-zoomed')) ***REMOVED***
                        if (isMoved) ***REMOVED***
                            isMoved = false;
                            _this.touchEnd(endCoords - startCoords);
                        ***REMOVED*** else ***REMOVED***
                            _this.$el.trigger('onSlideClick.lg');
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***

        ***REMOVED***;

        Plugin.prototype.enableDrag = function () ***REMOVED***
            var _this = this;
            var startCoords = 0;
            var endCoords = 0;
            var isDraging = false;
            var isMoved = false;
            if (_this.s.enableDrag && _this.doCss()) ***REMOVED***
                _this.$slide.on('mousedown.lg', function (e) ***REMOVED***
                    if (!_this.$outer.hasClass('lg-zoomed') && !_this.lgBusy && !$(e.target).text().trim()) ***REMOVED***
                        e.preventDefault();
                        _this.manageSwipeClass();
                        startCoords = e.pageX;
                        isDraging = true;

                        // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                        _this.$outer.scrollLeft += 1;
                        _this.$outer.scrollLeft -= 1;

                        // *

                        _this.$outer.removeClass('lg-grab').addClass('lg-grabbing');

                        _this.$el.trigger('onDragstart.lg');
                    ***REMOVED***
                ***REMOVED***);

                $(window).on('mousemove.lg', function (e) ***REMOVED***
                    if (isDraging) ***REMOVED***
                        isMoved = true;
                        endCoords = e.pageX;
                        _this.touchMove(startCoords, endCoords);
                        _this.$el.trigger('onDragmove.lg');
                    ***REMOVED***
                ***REMOVED***);

                $(window).on('mouseup.lg', function (e) ***REMOVED***
                    if (isMoved) ***REMOVED***
                        isMoved = false;
                        _this.touchEnd(endCoords - startCoords);
                        _this.$el.trigger('onDragend.lg');
                    ***REMOVED*** else if ($(e.target).hasClass('lg-object') || $(e.target).hasClass('lg-video-play')) ***REMOVED***
                        _this.$el.trigger('onSlideClick.lg');
                    ***REMOVED***

                    // Prevent execution on click
                    if (isDraging) ***REMOVED***
                        isDraging = false;
                        _this.$outer.removeClass('lg-grabbing').addClass('lg-grab');
                    ***REMOVED***
                ***REMOVED***);

            ***REMOVED***
        ***REMOVED***;

        Plugin.prototype.manageSwipeClass = function () ***REMOVED***
            var _touchNext = this.index + 1;
            var _touchPrev = this.index - 1;
            if (this.s.loop && this.$slide.length > 2) ***REMOVED***
                if (this.index === 0) ***REMOVED***
                    _touchPrev = this.$slide.length - 1;
                ***REMOVED*** else if (this.index === this.$slide.length - 1) ***REMOVED***
                    _touchNext = 0;
                ***REMOVED***
            ***REMOVED***

            this.$slide.removeClass('lg-next-slide lg-prev-slide');
            if (_touchPrev > -1) ***REMOVED***
                this.$slide.eq(_touchPrev).addClass('lg-prev-slide');
            ***REMOVED***

            this.$slide.eq(_touchNext).addClass('lg-next-slide');
        ***REMOVED***;

        Plugin.prototype.mousewheel = function () ***REMOVED***
            var _this = this;
            _this.$outer.on('mousewheel.lg', function (e) ***REMOVED***

                if (!e.deltaY) ***REMOVED***
                    return;
                ***REMOVED***

                if (e.deltaY > 0) ***REMOVED***
                    _this.goToPrevSlide();
                ***REMOVED*** else ***REMOVED***
                    _this.goToNextSlide();
                ***REMOVED***

                e.preventDefault();
            ***REMOVED***);

        ***REMOVED***;

        Plugin.prototype.closeGallery = function () ***REMOVED***

            var _this = this;
            var mousedown = false;
            this.$outer.find('.lg-close').on('click.lg', function () ***REMOVED***
                _this.destroy();
            ***REMOVED***);

            if (_this.s.closable) ***REMOVED***

                // If you drag the slide and release outside gallery gets close on chrome
                // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
                _this.$outer.on('mousedown.lg', function (e) ***REMOVED***

                    if ($(e.target).is('.lg-outer') || $(e.target).is('.lg-item ') || $(e.target).is('.lg-img-wrap')) ***REMOVED***
                        mousedown = true;
                    ***REMOVED*** else ***REMOVED***
                        mousedown = false;
                    ***REMOVED***

                ***REMOVED***);

                _this.$outer.on('mousemove.lg', function () ***REMOVED***
                    mousedown = false;
                ***REMOVED***);

                _this.$outer.on('mouseup.lg', function (e) ***REMOVED***

                    if ($(e.target).is('.lg-outer') || $(e.target).is('.lg-item ') || $(e.target).is('.lg-img-wrap') && mousedown) ***REMOVED***
                        if (!_this.$outer.hasClass('lg-dragging')) ***REMOVED***
                            _this.destroy();
                        ***REMOVED***
                    ***REMOVED***

                ***REMOVED***);

            ***REMOVED***

        ***REMOVED***;

        Plugin.prototype.destroy = function (d) ***REMOVED***

            var _this = this;

            if (!d) ***REMOVED***
                _this.$el.trigger('onBeforeClose.lg');
                $(window).scrollTop(_this.prevScrollTop);
            ***REMOVED***


            /**
             * if d is false or undefined destroy will only close the gallery
             * plugins instance remains with the element
             *
             * if d is true destroy will completely remove the plugin
             */

            if (d) ***REMOVED***
                if (!_this.s.dynamic) ***REMOVED***
                    // only when not using dynamic mode is $items a jquery collection
                    this.$items.off('click.lg click.lgcustom');
                ***REMOVED***

                $.removeData(_this.el, 'lightGallery');
            ***REMOVED***

            // Unbind all events added by lightGallery
            this.$el.off('.lg.tm');

            // Distroy all lightGallery modules
            $.each($.fn.lightGallery.modules, function (key) ***REMOVED***
                if (_this.modules[key]) ***REMOVED***
                    _this.modules[key].destroy();
                ***REMOVED***
            ***REMOVED***);

            this.lGalleryOn = false;

            clearTimeout(_this.hideBartimeout);
            this.hideBartimeout = false;
            $(window).off('.lg');
            $('body').removeClass('lg-on lg-from-hash');

            if (_this.$outer) ***REMOVED***
                _this.$outer.removeClass('lg-visible');
            ***REMOVED***

            $('.lg-backdrop').removeClass('in');

            setTimeout(function () ***REMOVED***
                if (_this.$outer) ***REMOVED***
                    _this.$outer.remove();
                ***REMOVED***

                $('.lg-backdrop').remove();

                if (!d) ***REMOVED***
                    _this.$el.trigger('onCloseAfter.lg');
                ***REMOVED***

            ***REMOVED***, _this.s.backdropDuration + 50);
        ***REMOVED***;

        $.fn.lightGallery = function (options) ***REMOVED***
            return this.each(function () ***REMOVED***
                if (!$.data(this, 'lightGallery')) ***REMOVED***
                    $.data(this, 'lightGallery', new Plugin(this, options));
                ***REMOVED*** else ***REMOVED***
                    try ***REMOVED***
                        $(this).data('lightGallery').init();
                    ***REMOVED*** catch (err) ***REMOVED***
                        console.error('lightGallery has not initiated properly');
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***;

        $.fn.lightGallery.modules = ***REMOVED******REMOVED***;

    ***REMOVED***)();


***REMOVED***));

/*! lg-autoplay - v1.0.4 - 2017-03-28
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2017 Sachin N; Licensed GPLv3 */

(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof exports === 'object') ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(jQuery);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***


    (function () ***REMOVED***

        'use strict';

        var defaults = ***REMOVED***
            autoplay: false,
            pause: 5000,
            progressBar: true,
            fourceAutoplay: false,
            autoplayControls: true,
            appendAutoplayControlsTo: '.lg-toolbar'
        ***REMOVED***;

        /**
         * Creates the autoplay plugin.
         * @param ***REMOVED***object***REMOVED*** element - lightGallery element
         */
        var Autoplay = function (element) ***REMOVED***

            this.core = $(element).data('lightGallery');

            this.$el = $(element);

            // Execute only if items are above 1
            if (this.core.$items.length < 2) ***REMOVED***
                return false;
            ***REMOVED***

            this.core.s = $.extend(***REMOVED******REMOVED***, defaults, this.core.s);
            this.interval = false;

            // Identify if slide happened from autoplay
            this.fromAuto = true;

            // Identify if autoplay canceled from touch/drag
            this.canceledOnTouch = false;

            // save fourceautoplay value
            this.fourceAutoplayTemp = this.core.s.fourceAutoplay;

            // do not allow progress bar if browser does not support css3 transitions
            if (!this.core.doCss()) ***REMOVED***
                this.core.s.progressBar = false;
            ***REMOVED***

            this.init();

            return this;
        ***REMOVED***;

        Autoplay.prototype.init = function () ***REMOVED***
            var _this = this;

            // append autoplay controls
            if (_this.core.s.autoplayControls) ***REMOVED***
                _this.controls();
            ***REMOVED***

            // Create progress bar
            if (_this.core.s.progressBar) ***REMOVED***
                _this.core.$outer.find('.lg').append('<div class="lg-progress-bar"><div class="lg-progress"></div></div>');
            ***REMOVED***

            // set progress
            _this.progress();

            // Start autoplay
            if (_this.core.s.autoplay) ***REMOVED***
                _this.$el.one('onSlideItemLoad.lg.tm', function () ***REMOVED***
                    _this.startlAuto();
                ***REMOVED***);
            ***REMOVED***

            // cancel interval on touchstart and dragstart
            _this.$el.on('onDragstart.lg.tm touchstart.lg.tm', function () ***REMOVED***
                if (_this.interval) ***REMOVED***
                    _this.cancelAuto();
                    _this.canceledOnTouch = true;
                ***REMOVED***
            ***REMOVED***);

            // restore autoplay if autoplay canceled from touchstart / dragstart
            _this.$el.on('onDragend.lg.tm touchend.lg.tm onSlideClick.lg.tm', function () ***REMOVED***
                if (!_this.interval && _this.canceledOnTouch) ***REMOVED***
                    _this.startlAuto();
                    _this.canceledOnTouch = false;
                ***REMOVED***
            ***REMOVED***);

        ***REMOVED***;

        Autoplay.prototype.progress = function () ***REMOVED***

            var _this = this;
            var _$progressBar;
            var _$progress;

            _this.$el.on('onBeforeSlide.lg.tm', function () ***REMOVED***

                // start progress bar animation
                if (_this.core.s.progressBar && _this.fromAuto) ***REMOVED***
                    _$progressBar = _this.core.$outer.find('.lg-progress-bar');
                    _$progress = _this.core.$outer.find('.lg-progress');
                    if (_this.interval) ***REMOVED***
                        _$progress.removeAttr('style');
                        _$progressBar.removeClass('lg-start');
                        setTimeout(function () ***REMOVED***
                            _$progress.css('transition', 'width ' + (_this.core.s.speed + _this.core.s.pause) + 'ms ease 0s');
                            _$progressBar.addClass('lg-start');
                        ***REMOVED***, 20);
                    ***REMOVED***
                ***REMOVED***

                // Remove setinterval if slide is triggered manually and fourceautoplay is false
                if (!_this.fromAuto && !_this.core.s.fourceAutoplay) ***REMOVED***
                    _this.cancelAuto();
                ***REMOVED***

                _this.fromAuto = false;

            ***REMOVED***);
        ***REMOVED***;

        // Manage autoplay via play/stop buttons
        Autoplay.prototype.controls = function () ***REMOVED***
            var _this = this;
            var _html = '<span class="lg-autoplay-button lg-icon"></span>';

            // Append autoplay controls
            $(this.core.s.appendAutoplayControlsTo).append(_html);

            _this.core.$outer.find('.lg-autoplay-button').on('click.lg', function () ***REMOVED***
                if ($(_this.core.$outer).hasClass('lg-show-autoplay')) ***REMOVED***
                    _this.cancelAuto();
                    _this.core.s.fourceAutoplay = false;
                ***REMOVED*** else ***REMOVED***
                    if (!_this.interval) ***REMOVED***
                        _this.startlAuto();
                        _this.core.s.fourceAutoplay = _this.fourceAutoplayTemp;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***;

        // Autostart gallery
        Autoplay.prototype.startlAuto = function () ***REMOVED***
            var _this = this;

            _this.core.$outer.find('.lg-progress').css('transition', 'width ' + (_this.core.s.speed + _this.core.s.pause) + 'ms ease 0s');
            _this.core.$outer.addClass('lg-show-autoplay');
            _this.core.$outer.find('.lg-progress-bar').addClass('lg-start');

            _this.interval = setInterval(function () ***REMOVED***
                if (_this.core.index + 1 < _this.core.$items.length) ***REMOVED***
                    _this.core.index++;
                ***REMOVED*** else ***REMOVED***
                    _this.core.index = 0;
                ***REMOVED***

                _this.fromAuto = true;
                _this.core.slide(_this.core.index, false, false, 'next');
            ***REMOVED***, _this.core.s.speed + _this.core.s.pause);
        ***REMOVED***;

        // cancel Autostart
        Autoplay.prototype.cancelAuto = function () ***REMOVED***
            clearInterval(this.interval);
            this.interval = false;
            this.core.$outer.find('.lg-progress').removeAttr('style');
            this.core.$outer.removeClass('lg-show-autoplay');
            this.core.$outer.find('.lg-progress-bar').removeClass('lg-start');
        ***REMOVED***;

        Autoplay.prototype.destroy = function () ***REMOVED***

            this.cancelAuto();
            this.core.$outer.find('.lg-progress-bar').remove();
        ***REMOVED***;

        $.fn.lightGallery.modules.autoplay = Autoplay;

    ***REMOVED***)();


***REMOVED***));

/*! lg-fullscreen - v1.0.1 - 2016-09-30
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2016 Sachin N; Licensed GPLv3 */

(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof exports === 'object') ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(jQuery);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***

    (function () ***REMOVED***

        'use strict';

        var defaults = ***REMOVED***
            fullScreen: true
        ***REMOVED***;

        var Fullscreen = function (element) ***REMOVED***

            // get lightGallery core plugin data
            this.core = $(element).data('lightGallery');

            this.$el = $(element);

            // extend module defalut settings with lightGallery core settings
            this.core.s = $.extend(***REMOVED******REMOVED***, defaults, this.core.s);

            this.init();

            return this;
        ***REMOVED***;

        Fullscreen.prototype.init = function () ***REMOVED***
            var fullScreen = '';
            if (this.core.s.fullScreen) ***REMOVED***

                // check for fullscreen browser support
                if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled &&
                    !document.mozFullScreenEnabled && !document.msFullscreenEnabled) ***REMOVED***
                    return;
                ***REMOVED*** else ***REMOVED***
                    fullScreen = '<span class="lg-fullscreen lg-icon"></span>';
                    this.core.$outer.find('.lg-toolbar').append(fullScreen);
                    this.fullScreen();
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;

        Fullscreen.prototype.requestFullscreen = function () ***REMOVED***
            var el = document.documentElement;
            if (el.requestFullscreen) ***REMOVED***
                el.requestFullscreen();
            ***REMOVED*** else if (el.msRequestFullscreen) ***REMOVED***
                el.msRequestFullscreen();
            ***REMOVED*** else if (el.mozRequestFullScreen) ***REMOVED***
                el.mozRequestFullScreen();
            ***REMOVED*** else if (el.webkitRequestFullscreen) ***REMOVED***
                el.webkitRequestFullscreen();
            ***REMOVED***
        ***REMOVED***;

        Fullscreen.prototype.exitFullscreen = function () ***REMOVED***
            if (document.exitFullscreen) ***REMOVED***
                document.exitFullscreen();
            ***REMOVED*** else if (document.msExitFullscreen) ***REMOVED***
                document.msExitFullscreen();
            ***REMOVED*** else if (document.mozCancelFullScreen) ***REMOVED***
                document.mozCancelFullScreen();
            ***REMOVED*** else if (document.webkitExitFullscreen) ***REMOVED***
                document.webkitExitFullscreen();
            ***REMOVED***
        ***REMOVED***;

        // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
        Fullscreen.prototype.fullScreen = function () ***REMOVED***
            var _this = this;

            $(document).on('fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg', function () ***REMOVED***
                _this.core.$outer.toggleClass('lg-fullscreen-on');
            ***REMOVED***);

            this.core.$outer.find('.lg-fullscreen').on('click.lg', function () ***REMOVED***
                if (!document.fullscreenElement &&
                    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) ***REMOVED***
                    _this.requestFullscreen();
                ***REMOVED*** else ***REMOVED***
                    _this.exitFullscreen();
                ***REMOVED***
            ***REMOVED***);

        ***REMOVED***;

        Fullscreen.prototype.destroy = function () ***REMOVED***

            // exit from fullscreen if activated
            this.exitFullscreen();

            $(document).off('fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg');
        ***REMOVED***;

        $.fn.lightGallery.modules.fullscreen = Fullscreen;

    ***REMOVED***)();

***REMOVED***));

/*! lg-pager - v1.0.2 - 2017-01-22
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2017 Sachin N; Licensed GPLv3 */

(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof exports === 'object') ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(jQuery);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***

    (function () ***REMOVED***

        'use strict';

        var defaults = ***REMOVED***
            pager: false
        ***REMOVED***;

        var Pager = function (element) ***REMOVED***

            this.core = $(element).data('lightGallery');

            this.$el = $(element);
            this.core.s = $.extend(***REMOVED******REMOVED***, defaults, this.core.s);
            if (this.core.s.pager && this.core.$items.length > 1) ***REMOVED***
                this.init();
            ***REMOVED***

            return this;
        ***REMOVED***;

        Pager.prototype.init = function () ***REMOVED***
            var _this = this;
            var pagerList = '';
            var $pagerCont;
            var $pagerOuter;
            var timeout;

            _this.core.$outer.find('.lg').append('<div class="lg-pager-outer"></div>');

            if (_this.core.s.dynamic) ***REMOVED***
                for (var i = 0; i < _this.core.s.dynamicEl.length; i++) ***REMOVED***
                    pagerList += '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' + _this.core.s.dynamicEl[i].thumb + '" /></div></span>';
                ***REMOVED***
            ***REMOVED*** else ***REMOVED***
                _this.core.$items.each(function () ***REMOVED***

                    if (!_this.core.s.exThumbImage) ***REMOVED***
                        pagerList += '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' + $(this).find('img').attr('src') + '" /></div></span>';
                    ***REMOVED*** else ***REMOVED***
                        pagerList += '<span class="lg-pager-cont"> <span class="lg-pager"></span><div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="' + $(this).attr(_this.core.s.exThumbImage) + '" /></div></span>';
                    ***REMOVED***

                ***REMOVED***);
            ***REMOVED***

            $pagerOuter = _this.core.$outer.find('.lg-pager-outer');

            $pagerOuter.html(pagerList);

            $pagerCont = _this.core.$outer.find('.lg-pager-cont');
            $pagerCont.on('click.lg touchend.lg', function () ***REMOVED***
                var _$this = $(this);
                _this.core.index = _$this.index();
                _this.core.slide(_this.core.index, false, true, false);
            ***REMOVED***);

            $pagerOuter.on('mouseover.lg', function () ***REMOVED***
                clearTimeout(timeout);
                $pagerOuter.addClass('lg-pager-hover');
            ***REMOVED***);

            $pagerOuter.on('mouseout.lg', function () ***REMOVED***
                timeout = setTimeout(function () ***REMOVED***
                    $pagerOuter.removeClass('lg-pager-hover');
                ***REMOVED***);
            ***REMOVED***);

            _this.core.$el.on('onBeforeSlide.lg.tm', function (e, prevIndex, index) ***REMOVED***
                $pagerCont.removeClass('lg-pager-active');
                $pagerCont.eq(index).addClass('lg-pager-active');
            ***REMOVED***);

        ***REMOVED***;

        Pager.prototype.destroy = function () ***REMOVED***

        ***REMOVED***;

        $.fn.lightGallery.modules.pager = Pager;

    ***REMOVED***)();


***REMOVED***));

/*! lg-thumbnail - v1.1.0 - 2017-08-08
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2017 Sachin N; Licensed GPLv3 */

(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof exports === 'object') ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(jQuery);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***

    (function () ***REMOVED***

        'use strict';

        var defaults = ***REMOVED***
            thumbnail: true,

            animateThumb: true,
            currentPagerPosition: 'middle',

            thumbWidth: 100,
            thumbHeight: '80px',
            thumbContHeight: 100,
            thumbMargin: 5,

            exThumbImage: false,
            showThumbByDefault: true,
            toogleThumb: true,
            pullCaptionUp: true,

            enableThumbDrag: true,
            enableThumbSwipe: true,
            swipeThreshold: 50,

            loadYoutubeThumbnail: true,
            youtubeThumbSize: 1,

            loadVimeoThumbnail: true,
            vimeoThumbSize: 'thumbnail_small',

            loadDailymotionThumbnail: true
        ***REMOVED***;

        var Thumbnail = function (element) ***REMOVED***

            // get lightGallery core plugin data
            this.core = $(element).data('lightGallery');

            // extend module default settings with lightGallery core settings
            this.core.s = $.extend(***REMOVED******REMOVED***, defaults, this.core.s);

            this.$el = $(element);
            this.$thumbOuter = null;
            this.thumbOuterWidth = 0;
            this.thumbTotalWidth = (this.core.$items.length * (this.core.s.thumbWidth + this.core.s.thumbMargin));
            this.thumbIndex = this.core.index;

            if (this.core.s.animateThumb) ***REMOVED***
                this.core.s.thumbHeight = '100%';
            ***REMOVED***

            // Thumbnail animation value
            this.left = 0;

            this.init();

            return this;
        ***REMOVED***;

        Thumbnail.prototype.init = function () ***REMOVED***
            var _this = this;
            if (this.core.s.thumbnail && this.core.$items.length > 1) ***REMOVED***
                if (this.core.s.showThumbByDefault) ***REMOVED***
                    setTimeout(function () ***REMOVED***
                        _this.core.$outer.addClass('lg-thumb-open');
                    ***REMOVED***, 700);
                ***REMOVED***

                if (this.core.s.pullCaptionUp) ***REMOVED***
                    this.core.$outer.addClass('lg-pull-caption-up');
                ***REMOVED***

                this.build();
                if (this.core.s.animateThumb && this.core.doCss()) ***REMOVED***
                    if (this.core.s.enableThumbDrag) ***REMOVED***
                        this.enableThumbDrag();
                    ***REMOVED***

                    if (this.core.s.enableThumbSwipe) ***REMOVED***
                        this.enableThumbSwipe();
                    ***REMOVED***

                    this.thumbClickable = false;
                ***REMOVED*** else ***REMOVED***
                    this.thumbClickable = true;
                ***REMOVED***

                this.toogle();
                this.thumbkeyPress();
            ***REMOVED***
        ***REMOVED***;

        Thumbnail.prototype.build = function () ***REMOVED***
            var _this = this;
            var thumbList = '';
            var vimeoErrorThumbSize = '';
            var $thumb;
            var html = '<div class="lg-thumb-outer">' +
                '<div class="lg-thumb lg-group">' +
                '</div>' +
                '</div>';

            switch (this.core.s.vimeoThumbSize) ***REMOVED***
                case 'thumbnail_large':
                    vimeoErrorThumbSize = '640';
                    break;
                case 'thumbnail_medium':
                    vimeoErrorThumbSize = '200x150';
                    break;
                case 'thumbnail_small':
                    vimeoErrorThumbSize = '100x75';
            ***REMOVED***

            _this.core.$outer.addClass('lg-has-thumb');

            _this.core.$outer.find('.lg').append(html);

            _this.$thumbOuter = _this.core.$outer.find('.lg-thumb-outer');
            _this.thumbOuterWidth = _this.$thumbOuter.width();

            if (_this.core.s.animateThumb) ***REMOVED***
                _this.core.$outer.find('.lg-thumb').css(***REMOVED***
                    width: _this.thumbTotalWidth + 'px',
                    position: 'relative'
                ***REMOVED***);
            ***REMOVED***

            if (this.core.s.animateThumb) ***REMOVED***
                _this.$thumbOuter.css('height', _this.core.s.thumbContHeight + 'px');
            ***REMOVED***

            function getThumb(src, thumb, index) ***REMOVED***
                var isVideo = _this.core.isVideo(src, index) || ***REMOVED******REMOVED***;
                var thumbImg;
                var vimeoId = '';

                if (isVideo.youtube || isVideo.vimeo || isVideo.dailymotion) ***REMOVED***
                    if (isVideo.youtube) ***REMOVED***
                        if (_this.core.s.loadYoutubeThumbnail) ***REMOVED***
                            thumbImg = '//img.youtube.com/vi/' + isVideo.youtube[1] + '/' + _this.core.s.youtubeThumbSize + '.jpg';
                        ***REMOVED*** else ***REMOVED***
                            thumbImg = thumb;
                        ***REMOVED***
                    ***REMOVED*** else if (isVideo.vimeo) ***REMOVED***
                        if (_this.core.s.loadVimeoThumbnail) ***REMOVED***
                            thumbImg = '//i.vimeocdn.com/video/error_' + vimeoErrorThumbSize + '.jpg';
                            vimeoId = isVideo.vimeo[1];
                        ***REMOVED*** else ***REMOVED***
                            thumbImg = thumb;
                        ***REMOVED***
                    ***REMOVED*** else if (isVideo.dailymotion) ***REMOVED***
                        if (_this.core.s.loadDailymotionThumbnail) ***REMOVED***
                            thumbImg = '//www.dailymotion.com/thumbnail/video/' + isVideo.dailymotion[1];
                        ***REMOVED*** else ***REMOVED***
                            thumbImg = thumb;
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                    thumbImg = thumb;
                ***REMOVED***

                thumbList += '<div data-vimeo-id="' + vimeoId + '" class="lg-thumb-item" style="width:' + _this.core.s.thumbWidth + 'px; height: ' + _this.core.s.thumbHeight + '; margin-right: ' + _this.core.s.thumbMargin + 'px"><img src="' + thumbImg + '" /></div>';
                vimeoId = '';
            ***REMOVED***

            if (_this.core.s.dynamic) ***REMOVED***
                for (var i = 0; i < _this.core.s.dynamicEl.length; i++) ***REMOVED***
                    getThumb(_this.core.s.dynamicEl[i].src, _this.core.s.dynamicEl[i].thumb, i);
                ***REMOVED***
            ***REMOVED*** else ***REMOVED***
                _this.core.$items.each(function (i) ***REMOVED***

                    if (!_this.core.s.exThumbImage) ***REMOVED***
                        getThumb($(this).attr('href') || $(this).attr('data-src'), $(this).find('img').attr('src'), i);
                    ***REMOVED*** else ***REMOVED***
                        getThumb($(this).attr('href') || $(this).attr('data-src'), $(this).attr(_this.core.s.exThumbImage), i);
                    ***REMOVED***

                ***REMOVED***);
            ***REMOVED***

            _this.core.$outer.find('.lg-thumb').html(thumbList);

            $thumb = _this.core.$outer.find('.lg-thumb-item');

            // Load vimeo thumbnails
            $thumb.each(function () ***REMOVED***
                var $this = $(this);
                var vimeoVideoId = $this.attr('data-vimeo-id');

                if (vimeoVideoId) ***REMOVED***
                    $.getJSON('//www.vimeo.com/api/v2/video/' + vimeoVideoId + '.json?callback=?', ***REMOVED***
                        format: 'json'
                    ***REMOVED***, function (data) ***REMOVED***
                        $this.find('img').attr('src', data[0][_this.core.s.vimeoThumbSize]);
                    ***REMOVED***);
                ***REMOVED***
            ***REMOVED***);

            // manage active class for thumbnail
            $thumb.eq(_this.core.index).addClass('active');
            _this.core.$el.on('onBeforeSlide.lg.tm', function () ***REMOVED***
                $thumb.removeClass('active');
                $thumb.eq(_this.core.index).addClass('active');
            ***REMOVED***);

            $thumb.on('click.lg touchend.lg', function () ***REMOVED***
                var _$this = $(this);
                setTimeout(function () ***REMOVED***

                    // In IE9 and bellow touch does not support
                    // Go to slide if browser does not support css transitions
                    if ((_this.thumbClickable && !_this.core.lgBusy) || !_this.core.doCss()) ***REMOVED***
                        _this.core.index = _$this.index();
                        _this.core.slide(_this.core.index, false, true, false);
                    ***REMOVED***
                ***REMOVED***, 50);
            ***REMOVED***);

            _this.core.$el.on('onBeforeSlide.lg.tm', function () ***REMOVED***
                _this.animateThumb(_this.core.index);
            ***REMOVED***);

            $(window).on('resize.lg.thumb orientationchange.lg.thumb', function () ***REMOVED***
                setTimeout(function () ***REMOVED***
                    _this.animateThumb(_this.core.index);
                    _this.thumbOuterWidth = _this.$thumbOuter.width();
                ***REMOVED***, 200);
            ***REMOVED***);

        ***REMOVED***;

        Thumbnail.prototype.setTranslate = function (value) ***REMOVED***
            // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
            this.core.$outer.find('.lg-thumb').css(***REMOVED***
                transform: 'translate3d(-' + (value) + 'px, 0px, 0px)'
            ***REMOVED***);
        ***REMOVED***;

        Thumbnail.prototype.animateThumb = function (index) ***REMOVED***
            var $thumb = this.core.$outer.find('.lg-thumb');
            if (this.core.s.animateThumb) ***REMOVED***
                var position;
                switch (this.core.s.currentPagerPosition) ***REMOVED***
                    case 'left':
                        position = 0;
                        break;
                    case 'middle':
                        position = (this.thumbOuterWidth / 2) - (this.core.s.thumbWidth / 2);
                        break;
                    case 'right':
                        position = this.thumbOuterWidth - this.core.s.thumbWidth;
                ***REMOVED***
                this.left = ((this.core.s.thumbWidth + this.core.s.thumbMargin) * index - 1) - position;
                if (this.left > (this.thumbTotalWidth - this.thumbOuterWidth)) ***REMOVED***
                    this.left = this.thumbTotalWidth - this.thumbOuterWidth;
                ***REMOVED***

                if (this.left < 0) ***REMOVED***
                    this.left = 0;
                ***REMOVED***

                if (this.core.lGalleryOn) ***REMOVED***
                    if (!$thumb.hasClass('on')) ***REMOVED***
                        this.core.$outer.find('.lg-thumb').css('transition-duration', this.core.s.speed + 'ms');
                    ***REMOVED***

                    if (!this.core.doCss()) ***REMOVED***
                        $thumb.animate(***REMOVED***
                            left: -this.left + 'px'
                        ***REMOVED***, this.core.s.speed);
                    ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                    if (!this.core.doCss()) ***REMOVED***
                        $thumb.css('left', -this.left + 'px');
                    ***REMOVED***
                ***REMOVED***

                this.setTranslate(this.left);

            ***REMOVED***
        ***REMOVED***;

        // Enable thumbnail dragging and swiping
        Thumbnail.prototype.enableThumbDrag = function () ***REMOVED***

            var _this = this;
            var startCoords = 0;
            var endCoords = 0;
            var isDraging = false;
            var isMoved = false;
            var tempLeft = 0;

            _this.$thumbOuter.addClass('lg-grab');

            _this.core.$outer.find('.lg-thumb').on('mousedown.lg.thumb', function (e) ***REMOVED***
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) ***REMOVED***
                    // execute only on .lg-object
                    e.preventDefault();
                    startCoords = e.pageX;
                    isDraging = true;

                    // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                    _this.core.$outer.scrollLeft += 1;
                    _this.core.$outer.scrollLeft -= 1;

                    // *
                    _this.thumbClickable = false;
                    _this.$thumbOuter.removeClass('lg-grab').addClass('lg-grabbing');
                ***REMOVED***
            ***REMOVED***);

            $(window).on('mousemove.lg.thumb', function (e) ***REMOVED***
                if (isDraging) ***REMOVED***
                    tempLeft = _this.left;
                    isMoved = true;
                    endCoords = e.pageX;

                    _this.$thumbOuter.addClass('lg-dragging');

                    tempLeft = tempLeft - (endCoords - startCoords);

                    if (tempLeft > (_this.thumbTotalWidth - _this.thumbOuterWidth)) ***REMOVED***
                        tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
                    ***REMOVED***

                    if (tempLeft < 0) ***REMOVED***
                        tempLeft = 0;
                    ***REMOVED***

                    // move current slide
                    _this.setTranslate(tempLeft);

                ***REMOVED***
            ***REMOVED***);

            $(window).on('mouseup.lg.thumb', function () ***REMOVED***
                if (isMoved) ***REMOVED***
                    isMoved = false;
                    _this.$thumbOuter.removeClass('lg-dragging');

                    _this.left = tempLeft;

                    if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) ***REMOVED***
                        _this.thumbClickable = true;
                    ***REMOVED***

                ***REMOVED*** else ***REMOVED***
                    _this.thumbClickable = true;
                ***REMOVED***

                if (isDraging) ***REMOVED***
                    isDraging = false;
                    _this.$thumbOuter.removeClass('lg-grabbing').addClass('lg-grab');
                ***REMOVED***
            ***REMOVED***);

        ***REMOVED***;

        Thumbnail.prototype.enableThumbSwipe = function () ***REMOVED***
            var _this = this;
            var startCoords = 0;
            var endCoords = 0;
            var isMoved = false;
            var tempLeft = 0;

            _this.core.$outer.find('.lg-thumb').on('touchstart.lg', function (e) ***REMOVED***
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) ***REMOVED***
                    e.preventDefault();
                    startCoords = e.originalEvent.targetTouches[0].pageX;
                    _this.thumbClickable = false;
                ***REMOVED***
            ***REMOVED***);

            _this.core.$outer.find('.lg-thumb').on('touchmove.lg', function (e) ***REMOVED***
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) ***REMOVED***
                    e.preventDefault();
                    endCoords = e.originalEvent.targetTouches[0].pageX;
                    isMoved = true;

                    _this.$thumbOuter.addClass('lg-dragging');

                    tempLeft = _this.left;

                    tempLeft = tempLeft - (endCoords - startCoords);

                    if (tempLeft > (_this.thumbTotalWidth - _this.thumbOuterWidth)) ***REMOVED***
                        tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
                    ***REMOVED***

                    if (tempLeft < 0) ***REMOVED***
                        tempLeft = 0;
                    ***REMOVED***

                    // move current slide
                    _this.setTranslate(tempLeft);

                ***REMOVED***
            ***REMOVED***);

            _this.core.$outer.find('.lg-thumb').on('touchend.lg', function () ***REMOVED***
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) ***REMOVED***

                    if (isMoved) ***REMOVED***
                        isMoved = false;
                        _this.$thumbOuter.removeClass('lg-dragging');
                        if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) ***REMOVED***
                            _this.thumbClickable = true;
                        ***REMOVED***

                        _this.left = tempLeft;
                    ***REMOVED*** else ***REMOVED***
                        _this.thumbClickable = true;
                    ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                    _this.thumbClickable = true;
                ***REMOVED***
            ***REMOVED***);

        ***REMOVED***;

        Thumbnail.prototype.toogle = function () ***REMOVED***
            var _this = this;
            if (_this.core.s.toogleThumb) ***REMOVED***
                _this.core.$outer.addClass('lg-can-toggle');
                _this.$thumbOuter.append('<span class="lg-toogle-thumb lg-icon"></span>');
                _this.core.$outer.find('.lg-toogle-thumb').on('click.lg', function () ***REMOVED***
                    _this.core.$outer.toggleClass('lg-thumb-open');
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***;

        Thumbnail.prototype.thumbkeyPress = function () ***REMOVED***
            var _this = this;
            $(window).on('keydown.lg.thumb', function (e) ***REMOVED***
                if (e.keyCode === 38) ***REMOVED***
                    e.preventDefault();
                    _this.core.$outer.addClass('lg-thumb-open');
                ***REMOVED*** else if (e.keyCode === 40) ***REMOVED***
                    e.preventDefault();
                    _this.core.$outer.removeClass('lg-thumb-open');
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***;

        Thumbnail.prototype.destroy = function () ***REMOVED***
            if (this.core.s.thumbnail && this.core.$items.length > 1) ***REMOVED***
                $(window).off('resize.lg.thumb orientationchange.lg.thumb keydown.lg.thumb');
                this.$thumbOuter.remove();
                this.core.$outer.removeClass('lg-has-thumb');
            ***REMOVED***
        ***REMOVED***;

        $.fn.lightGallery.modules.Thumbnail = Thumbnail;

    ***REMOVED***)();

***REMOVED***));

/*! lg-video - v1.2.2 - 2018-05-01
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2018 Sachin N; Licensed GPLv3 */

(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof module === 'object' && module.exports) ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(root["jQuery"]);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***

    (function () ***REMOVED***

        'use strict';

        var defaults = ***REMOVED***
            videoMaxWidth: '855px',

            autoplayFirstVideo: true,

            youtubePlayerParams: false,
            vimeoPlayerParams: false,
            dailymotionPlayerParams: false,
            vkPlayerParams: false,

            videojs: false,
            videojsOptions: ***REMOVED******REMOVED***
        ***REMOVED***;

        var Video = function (element) ***REMOVED***

            this.core = $(element).data('lightGallery');

            this.$el = $(element);
            this.core.s = $.extend(***REMOVED******REMOVED***, defaults, this.core.s);
            this.videoLoaded = false;

            this.init();

            return this;
        ***REMOVED***;

        Video.prototype.init = function () ***REMOVED***
            var _this = this;

            // Event triggered when video url found without poster
            _this.core.$el.on('hasVideo.lg.tm', onHasVideo.bind(this));

            // Set max width for video
            _this.core.$el.on('onAferAppendSlide.lg.tm', onAferAppendSlide.bind(this));

            if (_this.core.doCss() && (_this.core.$items.length > 1) && (_this.core.s.enableSwipe || _this.core.s.enableDrag)) ***REMOVED***
                _this.core.$el.on('onSlideClick.lg.tm', function () ***REMOVED***
                    var $el = _this.core.$slide.eq(_this.core.index);
                    _this.loadVideoOnclick($el);
                ***REMOVED***);
            ***REMOVED*** else ***REMOVED***

                // For IE 9 and bellow
                _this.core.$slide.on('click.lg', function () ***REMOVED***
                    _this.loadVideoOnclick($(this));
                ***REMOVED***);
            ***REMOVED***

            _this.core.$el.on('onBeforeSlide.lg.tm', onBeforeSlide.bind(this));

            _this.core.$el.on('onAfterSlide.lg.tm', function (event, prevIndex) ***REMOVED***
                _this.core.$slide.eq(prevIndex).removeClass('lg-video-playing');
            ***REMOVED***);

            if (_this.core.s.autoplayFirstVideo) ***REMOVED***
                _this.core.$el.on('onAferAppendSlide.lg.tm', function (e, index) ***REMOVED***
                    if (!_this.core.lGalleryOn) ***REMOVED***
                        var $el = _this.core.$slide.eq(index);
                        setTimeout(function () ***REMOVED***
                            _this.loadVideoOnclick($el);
                        ***REMOVED***, 100);
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***;

        Video.prototype.loadVideo = function (src, addClass, noPoster, index, html) ***REMOVED***
            var video = '';
            var autoplay = 1;
            var a = '';
            var isVideo = this.core.isVideo(src, index) || ***REMOVED******REMOVED***;

            // Enable autoplay based on setting for first video if poster doesn't exist
            if (noPoster) ***REMOVED***
                if (this.videoLoaded) ***REMOVED***
                    autoplay = 0;
                ***REMOVED*** else ***REMOVED***
                    autoplay = this.core.s.autoplayFirstVideo ? 1 : 0;
                ***REMOVED***
            ***REMOVED***

            if (isVideo.youtube) ***REMOVED***

                a = '?wmode=opaque&autoplay=' + autoplay + '&enablejsapi=1';
                if (this.core.s.youtubePlayerParams) ***REMOVED***
                    a = a + '&' + $.param(this.core.s.youtubePlayerParams);
                ***REMOVED***

                video = '<iframe class="lg-video-object lg-youtube ' + addClass + '" width="560" height="315" src="//www.youtube.com/embed/' + isVideo.youtube[1] + a + '" frameborder="0" allowfullscreen></iframe>';

            ***REMOVED*** else if (isVideo.vimeo) ***REMOVED***

                a = '?autoplay=' + autoplay + '&api=1';
                if (this.core.s.vimeoPlayerParams) ***REMOVED***
                    a = a + '&' + $.param(this.core.s.vimeoPlayerParams);
                ***REMOVED***

                video = '<iframe class="lg-video-object lg-vimeo ' + addClass + '" width="560" height="315"  src="//player.vimeo.com/video/' + isVideo.vimeo[1] + a + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

            ***REMOVED*** else if (isVideo.dailymotion) ***REMOVED***

                a = '?wmode=opaque&autoplay=' + autoplay + '&api=postMessage';
                if (this.core.s.dailymotionPlayerParams) ***REMOVED***
                    a = a + '&' + $.param(this.core.s.dailymotionPlayerParams);
                ***REMOVED***

                video = '<iframe class="lg-video-object lg-dailymotion ' + addClass + '" width="560" height="315" src="//www.dailymotion.com/embed/video/' + isVideo.dailymotion[1] + a + '" frameborder="0" allowfullscreen></iframe>';

            ***REMOVED*** else if (isVideo.html5) ***REMOVED***
                var fL = html.substring(0, 1);
                if (fL === '.' || fL === '#') ***REMOVED***
                    html = $(html).html();
                ***REMOVED***

                video = html;

            ***REMOVED*** else if (isVideo.vk) ***REMOVED***

                a = '&autoplay=' + autoplay;
                if (this.core.s.vkPlayerParams) ***REMOVED***
                    a = a + '&' + $.param(this.core.s.vkPlayerParams);
                ***REMOVED***

                video = '<iframe class="lg-video-object lg-vk ' + addClass + '" width="560" height="315" src="//vk.com/video_ext.php?' + isVideo.vk[1] + a + '" frameborder="0" allowfullscreen></iframe>';

            ***REMOVED***

            return video;
        ***REMOVED***;

        Video.prototype.loadVideoOnclick = function ($el) ***REMOVED***

            var _this = this;
            // check slide has poster
            if ($el.find('.lg-object').hasClass('lg-has-poster') && $el.find('.lg-object').is(':visible')) ***REMOVED***

                // check already video element present
                if (!$el.hasClass('lg-has-video')) ***REMOVED***

                    $el.addClass('lg-video-playing lg-has-video');

                    var _src;
                    var _html;
                    var _loadVideo = function (_src, _html) ***REMOVED***

                        $el.find('.lg-video').append(_this.loadVideo(_src, '', false, _this.core.index, _html));

                        if (_html) ***REMOVED***
                            if (_this.core.s.videojs) ***REMOVED***
                                try ***REMOVED***
                                    videojs(_this.core.$slide.eq(_this.core.index).find('.lg-html5').get(0), _this.core.s.videojsOptions, function () ***REMOVED***
                                        this.play();
                                    ***REMOVED***);
                                ***REMOVED*** catch (e) ***REMOVED***
                                    console.error('Make sure you have included videojs');
                                ***REMOVED***
                            ***REMOVED*** else ***REMOVED***
                                _this.core.$slide.eq(_this.core.index).find('.lg-html5').get(0).play();
                            ***REMOVED***
                        ***REMOVED***

                    ***REMOVED***;

                    if (_this.core.s.dynamic) ***REMOVED***

                        _src = _this.core.s.dynamicEl[_this.core.index].src;
                        _html = _this.core.s.dynamicEl[_this.core.index].html;

                        _loadVideo(_src, _html);

                    ***REMOVED*** else ***REMOVED***

                        _src = _this.core.$items.eq(_this.core.index).attr('href') || _this.core.$items.eq(_this.core.index).attr('data-src');
                        _html = _this.core.$items.eq(_this.core.index).attr('data-html');

                        _loadVideo(_src, _html);

                    ***REMOVED***

                    var $tempImg = $el.find('.lg-object');
                    $el.find('.lg-video').append($tempImg);

                    // @todo loading icon for html5 videos also
                    // for showing the loading indicator while loading video
                    if (!$el.find('.lg-video-object').hasClass('lg-html5')) ***REMOVED***
                        $el.removeClass('lg-complete');
                        $el.find('.lg-video-object').on('load.lg error.lg', function () ***REMOVED***
                            $el.addClass('lg-complete');
                        ***REMOVED***);
                    ***REMOVED***

                ***REMOVED*** else ***REMOVED***

                    var youtubePlayer = $el.find('.lg-youtube').get(0);
                    var vimeoPlayer = $el.find('.lg-vimeo').get(0);
                    var dailymotionPlayer = $el.find('.lg-dailymotion').get(0);
                    var html5Player = $el.find('.lg-html5').get(0);
                    if (youtubePlayer) ***REMOVED***
                        youtubePlayer.contentWindow.postMessage('***REMOVED***"event":"command","func":"playVideo","args":""***REMOVED***', '*');
                    ***REMOVED*** else if (vimeoPlayer) ***REMOVED***
                        try ***REMOVED***
                            $f(vimeoPlayer).api('play');
                        ***REMOVED*** catch (e) ***REMOVED***
                            console.error('Make sure you have included froogaloop2 js');
                        ***REMOVED***
                    ***REMOVED*** else if (dailymotionPlayer) ***REMOVED***
                        dailymotionPlayer.contentWindow.postMessage('play', '*');

                    ***REMOVED*** else if (html5Player) ***REMOVED***
                        if (_this.core.s.videojs) ***REMOVED***
                            try ***REMOVED***
                                videojs(html5Player).play();
                            ***REMOVED*** catch (e) ***REMOVED***
                                console.error('Make sure you have included videojs');
                            ***REMOVED***
                        ***REMOVED*** else ***REMOVED***
                            html5Player.play();
                        ***REMOVED***
                    ***REMOVED***

                    $el.addClass('lg-video-playing');

                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;

        Video.prototype.destroy = function () ***REMOVED***
            this.videoLoaded = false;
        ***REMOVED***;

        function onHasVideo(event, index, src, html) ***REMOVED***
            /*jshint validthis:true */
            var _this = this;
            _this.core.$slide.eq(index).find('.lg-video').append(_this.loadVideo(src, 'lg-object', true, index, html));
            if (html) ***REMOVED***
                if (_this.core.s.videojs) ***REMOVED***
                    try ***REMOVED***
                        videojs(_this.core.$slide.eq(index).find('.lg-html5').get(0), _this.core.s.videojsOptions, function () ***REMOVED***
                            if (!_this.videoLoaded && _this.core.s.autoplayFirstVideo) ***REMOVED***
                                this.play();
                            ***REMOVED***
                        ***REMOVED***);
                    ***REMOVED*** catch (e) ***REMOVED***
                        console.error('Make sure you have included videojs');
                    ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                    if (!_this.videoLoaded && _this.core.s.autoplayFirstVideo) ***REMOVED***
                        _this.core.$slide.eq(index).find('.lg-html5').get(0).play();
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***

        function onAferAppendSlide(event, index) ***REMOVED***
            /*jshint validthis:true */
            var $videoCont = this.core.$slide.eq(index).find('.lg-video-cont');
            if (!$videoCont.hasClass('lg-has-iframe')) ***REMOVED***
                $videoCont.css('max-width', this.core.s.videoMaxWidth);
                this.videoLoaded = true;
            ***REMOVED***
        ***REMOVED***

        function onBeforeSlide(event, prevIndex, index) ***REMOVED***
            /*jshint validthis:true */
            var _this = this;

            var $videoSlide = _this.core.$slide.eq(prevIndex);
            var youtubePlayer = $videoSlide.find('.lg-youtube').get(0);
            var vimeoPlayer = $videoSlide.find('.lg-vimeo').get(0);
            var dailymotionPlayer = $videoSlide.find('.lg-dailymotion').get(0);
            var vkPlayer = $videoSlide.find('.lg-vk').get(0);
            var html5Player = $videoSlide.find('.lg-html5').get(0);
            if (youtubePlayer) ***REMOVED***
                youtubePlayer.contentWindow.postMessage('***REMOVED***"event":"command","func":"pauseVideo","args":""***REMOVED***', '*');
            ***REMOVED*** else if (vimeoPlayer) ***REMOVED***
                try ***REMOVED***
                    $f(vimeoPlayer).api('pause');
                ***REMOVED*** catch (e) ***REMOVED***
                    console.error('Make sure you have included froogaloop2 js');
                ***REMOVED***
            ***REMOVED*** else if (dailymotionPlayer) ***REMOVED***
                dailymotionPlayer.contentWindow.postMessage('pause', '*');

            ***REMOVED*** else if (html5Player) ***REMOVED***
                if (_this.core.s.videojs) ***REMOVED***
                    try ***REMOVED***
                        videojs(html5Player).pause();
                    ***REMOVED*** catch (e) ***REMOVED***
                        console.error('Make sure you have included videojs');
                    ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                    html5Player.pause();
                ***REMOVED***
            ***REMOVED*** if (vkPlayer) ***REMOVED***
                $(vkPlayer).attr('src', $(vkPlayer).attr('src').replace('&autoplay', '&noplay'));
            ***REMOVED***

            var _src;
            if (_this.core.s.dynamic) ***REMOVED***
                _src = _this.core.s.dynamicEl[index].src;
            ***REMOVED*** else ***REMOVED***
                _src = _this.core.$items.eq(index).attr('href') || _this.core.$items.eq(index).attr('data-src');

            ***REMOVED***

            var _isVideo = _this.core.isVideo(_src, index) || ***REMOVED******REMOVED***;
            if (_isVideo.youtube || _isVideo.vimeo || _isVideo.dailymotion || _isVideo.vk) ***REMOVED***
                _this.core.$outer.addClass('lg-hide-download');
            ***REMOVED***

        ***REMOVED***

        $.fn.lightGallery.modules.video = Video;

    ***REMOVED***)();

***REMOVED***));

/*! lg-zoom - v1.1.0 - 2017-08-08
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2017 Sachin N; Licensed GPLv3 */

(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof exports === 'object') ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(jQuery);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***

    (function () ***REMOVED***

        'use strict';

        var getUseLeft = function () ***REMOVED***
            var useLeft = false;
            var isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
            if (isChrome && parseInt(isChrome[2], 10) < 54) ***REMOVED***
                useLeft = true;
            ***REMOVED***

            return useLeft;
        ***REMOVED***;

        var defaults = ***REMOVED***
            scale: 1,
            zoom: true,
            actualSize: true,
            enableZoomAfter: 300,
            useLeftForZoom: getUseLeft()
        ***REMOVED***;

        var Zoom = function (element) ***REMOVED***

            this.core = $(element).data('lightGallery');

            this.core.s = $.extend(***REMOVED******REMOVED***, defaults, this.core.s);

            if (this.core.s.zoom && this.core.doCss()) ***REMOVED***
                this.init();

                // Store the zoomable timeout value just to clear it while closing
                this.zoomabletimeout = false;

                // Set the initial value center
                this.pageX = $(window).width() / 2;
                this.pageY = ($(window).height() / 2) + $(window).scrollTop();
            ***REMOVED***

            return this;
        ***REMOVED***;

        Zoom.prototype.init = function () ***REMOVED***

            var _this = this;
            var zoomIcons = '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';

            if (_this.core.s.actualSize) ***REMOVED***
                zoomIcons += '<span id="lg-actual-size" class="lg-icon"></span>';
            ***REMOVED***

            if (_this.core.s.useLeftForZoom) ***REMOVED***
                _this.core.$outer.addClass('lg-use-left-for-zoom');
            ***REMOVED*** else ***REMOVED***
                _this.core.$outer.addClass('lg-use-transition-for-zoom');
            ***REMOVED***

            this.core.$outer.find('.lg-toolbar').append(zoomIcons);

            // Add zoomable class
            _this.core.$el.on('onSlideItemLoad.lg.tm.zoom', function (event, index, delay) ***REMOVED***

                // delay will be 0 except first time
                var _speed = _this.core.s.enableZoomAfter + delay;

                // set _speed value 0 if gallery opened from direct url and if it is first slide
                if ($('body').hasClass('lg-from-hash') && delay) ***REMOVED***

                    // will execute only once
                    _speed = 0;
                ***REMOVED*** else ***REMOVED***

                    // Remove lg-from-hash to enable starting animation.
                    $('body').removeClass('lg-from-hash');
                ***REMOVED***

                _this.zoomabletimeout = setTimeout(function () ***REMOVED***
                    _this.core.$slide.eq(index).addClass('lg-zoomable');
                ***REMOVED***, _speed + 30);
            ***REMOVED***);

            var scale = 1;
            /**
             * @desc Image zoom
             * Translate the wrap and scale the image to get better user experience
             *
             * @param ***REMOVED***String***REMOVED*** scaleVal - Zoom decrement/increment value
             */
            var zoom = function (scaleVal) ***REMOVED***

                var $image = _this.core.$outer.find('.lg-current .lg-image');
                var _x;
                var _y;

                // Find offset manually to avoid issue after zoom
                var offsetX = ($(window).width() - $image.prop('offsetWidth')) / 2;
                var offsetY = (($(window).height() - $image.prop('offsetHeight')) / 2) + $(window).scrollTop();

                _x = _this.pageX - offsetX;
                _y = _this.pageY - offsetY;

                var x = (scaleVal - 1) * (_x);
                var y = (scaleVal - 1) * (_y);

                $image.css('transform', 'scale3d(' + scaleVal + ', ' + scaleVal + ', 1)').attr('data-scale', scaleVal);

                if (_this.core.s.useLeftForZoom) ***REMOVED***
                    $image.parent().css(***REMOVED***
                        left: -x + 'px',
                        top: -y + 'px'
                    ***REMOVED***).attr('data-x', x).attr('data-y', y);
                ***REMOVED*** else ***REMOVED***
                    $image.parent().css('transform', 'translate3d(-' + x + 'px, -' + y + 'px, 0)').attr('data-x', x).attr('data-y', y);
                ***REMOVED***
            ***REMOVED***;

            var callScale = function () ***REMOVED***
                if (scale > 1) ***REMOVED***
                    _this.core.$outer.addClass('lg-zoomed');
                ***REMOVED*** else ***REMOVED***
                    _this.resetZoom();
                ***REMOVED***

                if (scale < 1) ***REMOVED***
                    scale = 1;
                ***REMOVED***

                zoom(scale);
            ***REMOVED***;

            var actualSize = function (event, $image, index, fromIcon) ***REMOVED***
                var w = $image.prop('offsetWidth');
                var nw;
                if (_this.core.s.dynamic) ***REMOVED***
                    nw = _this.core.s.dynamicEl[index].width || $image[0].naturalWidth || w;
                ***REMOVED*** else ***REMOVED***
                    nw = _this.core.$items.eq(index).attr('data-width') || $image[0].naturalWidth || w;
                ***REMOVED***

                var _scale;

                if (_this.core.$outer.hasClass('lg-zoomed')) ***REMOVED***
                    scale = 1;
                ***REMOVED*** else ***REMOVED***
                    if (nw > w) ***REMOVED***
                        _scale = nw / w;
                        scale = _scale || 2;
                    ***REMOVED***
                ***REMOVED***

                if (fromIcon) ***REMOVED***
                    _this.pageX = $(window).width() / 2;
                    _this.pageY = ($(window).height() / 2) + $(window).scrollTop();
                ***REMOVED*** else ***REMOVED***
                    _this.pageX = event.pageX || event.originalEvent.targetTouches[0].pageX;
                    _this.pageY = event.pageY || event.originalEvent.targetTouches[0].pageY;
                ***REMOVED***

                callScale();
                setTimeout(function () ***REMOVED***
                    _this.core.$outer.removeClass('lg-grabbing').addClass('lg-grab');
                ***REMOVED***, 10);
            ***REMOVED***;

            var tapped = false;

            // event triggered after appending slide content
            _this.core.$el.on('onAferAppendSlide.lg.tm.zoom', function (event, index) ***REMOVED***

                // Get the current element
                var $image = _this.core.$slide.eq(index).find('.lg-image');

                $image.on('dblclick', function (event) ***REMOVED***
                    actualSize(event, $image, index);
                ***REMOVED***);

                $image.on('touchstart', function (event) ***REMOVED***
                    if (!tapped) ***REMOVED***
                        tapped = setTimeout(function () ***REMOVED***
                            tapped = null;
                        ***REMOVED***, 300);
                    ***REMOVED*** else ***REMOVED***
                        clearTimeout(tapped);
                        tapped = null;
                        actualSize(event, $image, index);
                    ***REMOVED***

                    event.preventDefault();
                ***REMOVED***);

            ***REMOVED***);

            // Update zoom on resize and orientationchange
            $(window).on('resize.lg.zoom scroll.lg.zoom orientationchange.lg.zoom', function () ***REMOVED***
                _this.pageX = $(window).width() / 2;
                _this.pageY = ($(window).height() / 2) + $(window).scrollTop();
                zoom(scale);
            ***REMOVED***);

            $('#lg-zoom-out').on('click.lg', function () ***REMOVED***
                if (_this.core.$outer.find('.lg-current .lg-image').length) ***REMOVED***
                    scale -= _this.core.s.scale;
                    callScale();
                ***REMOVED***
            ***REMOVED***);

            $('#lg-zoom-in').on('click.lg', function () ***REMOVED***
                if (_this.core.$outer.find('.lg-current .lg-image').length) ***REMOVED***
                    scale += _this.core.s.scale;
                    callScale();
                ***REMOVED***
            ***REMOVED***);

            $('#lg-actual-size').on('click.lg', function (event) ***REMOVED***
                actualSize(event, _this.core.$slide.eq(_this.core.index).find('.lg-image'), _this.core.index, true);
            ***REMOVED***);

            // Reset zoom on slide change
            _this.core.$el.on('onBeforeSlide.lg.tm', function () ***REMOVED***
                scale = 1;
                _this.resetZoom();
            ***REMOVED***);

            // Drag option after zoom
            _this.zoomDrag();

            _this.zoomSwipe();

        ***REMOVED***;

        // Reset zoom effect
        Zoom.prototype.resetZoom = function () ***REMOVED***
            this.core.$outer.removeClass('lg-zoomed');
            this.core.$slide.find('.lg-img-wrap').removeAttr('style data-x data-y');
            this.core.$slide.find('.lg-image').removeAttr('style data-scale');

            // Reset pagx pagy values to center
            this.pageX = $(window).width() / 2;
            this.pageY = ($(window).height() / 2) + $(window).scrollTop();
        ***REMOVED***;

        Zoom.prototype.zoomSwipe = function () ***REMOVED***
            var _this = this;
            var startCoords = ***REMOVED******REMOVED***;
            var endCoords = ***REMOVED******REMOVED***;
            var isMoved = false;

            // Allow x direction drag
            var allowX = false;

            // Allow Y direction drag
            var allowY = false;

            _this.core.$slide.on('touchstart.lg', function (e) ***REMOVED***

                if (_this.core.$outer.hasClass('lg-zoomed')) ***REMOVED***
                    var $image = _this.core.$slide.eq(_this.core.index).find('.lg-object');

                    allowY = $image.prop('offsetHeight') * $image.attr('data-scale') > _this.core.$outer.find('.lg').height();
                    allowX = $image.prop('offsetWidth') * $image.attr('data-scale') > _this.core.$outer.find('.lg').width();
                    if ((allowX || allowY)) ***REMOVED***
                        e.preventDefault();
                        startCoords = ***REMOVED***
                            x: e.originalEvent.targetTouches[0].pageX,
                            y: e.originalEvent.targetTouches[0].pageY
                        ***REMOVED***;
                    ***REMOVED***
                ***REMOVED***

            ***REMOVED***);

            _this.core.$slide.on('touchmove.lg', function (e) ***REMOVED***

                if (_this.core.$outer.hasClass('lg-zoomed')) ***REMOVED***

                    var _$el = _this.core.$slide.eq(_this.core.index).find('.lg-img-wrap');
                    var distanceX;
                    var distanceY;

                    e.preventDefault();
                    isMoved = true;

                    endCoords = ***REMOVED***
                        x: e.originalEvent.targetTouches[0].pageX,
                        y: e.originalEvent.targetTouches[0].pageY
                    ***REMOVED***;

                    // reset opacity and transition duration
                    _this.core.$outer.addClass('lg-zoom-dragging');

                    if (allowY) ***REMOVED***
                        distanceY = (-Math.abs(_$el.attr('data-y'))) + (endCoords.y - startCoords.y);
                    ***REMOVED*** else ***REMOVED***
                        distanceY = -Math.abs(_$el.attr('data-y'));
                    ***REMOVED***

                    if (allowX) ***REMOVED***
                        distanceX = (-Math.abs(_$el.attr('data-x'))) + (endCoords.x - startCoords.x);
                    ***REMOVED*** else ***REMOVED***
                        distanceX = -Math.abs(_$el.attr('data-x'));
                    ***REMOVED***

                    if ((Math.abs(endCoords.x - startCoords.x) > 15) || (Math.abs(endCoords.y - startCoords.y) > 15)) ***REMOVED***

                        if (_this.core.s.useLeftForZoom) ***REMOVED***
                            _$el.css(***REMOVED***
                                left: distanceX + 'px',
                                top: distanceY + 'px'
                            ***REMOVED***);
                        ***REMOVED*** else ***REMOVED***
                            _$el.css('transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
                        ***REMOVED***
                    ***REMOVED***

                ***REMOVED***

            ***REMOVED***);

            _this.core.$slide.on('touchend.lg', function () ***REMOVED***
                if (_this.core.$outer.hasClass('lg-zoomed')) ***REMOVED***
                    if (isMoved) ***REMOVED***
                        isMoved = false;
                        _this.core.$outer.removeClass('lg-zoom-dragging');
                        _this.touchendZoom(startCoords, endCoords, allowX, allowY);

                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);

        ***REMOVED***;

        Zoom.prototype.zoomDrag = function () ***REMOVED***

            var _this = this;
            var startCoords = ***REMOVED******REMOVED***;
            var endCoords = ***REMOVED******REMOVED***;
            var isDraging = false;
            var isMoved = false;

            // Allow x direction drag
            var allowX = false;

            // Allow Y direction drag
            var allowY = false;

            _this.core.$slide.on('mousedown.lg.zoom', function (e) ***REMOVED***

                // execute only on .lg-object
                var $image = _this.core.$slide.eq(_this.core.index).find('.lg-object');

                allowY = $image.prop('offsetHeight') * $image.attr('data-scale') > _this.core.$outer.find('.lg').height();
                allowX = $image.prop('offsetWidth') * $image.attr('data-scale') > _this.core.$outer.find('.lg').width();

                if (_this.core.$outer.hasClass('lg-zoomed')) ***REMOVED***
                    if ($(e.target).hasClass('lg-object') && (allowX || allowY)) ***REMOVED***
                        e.preventDefault();
                        startCoords = ***REMOVED***
                            x: e.pageX,
                            y: e.pageY
                        ***REMOVED***;

                        isDraging = true;

                        // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                        _this.core.$outer.scrollLeft += 1;
                        _this.core.$outer.scrollLeft -= 1;

                        _this.core.$outer.removeClass('lg-grab').addClass('lg-grabbing');
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);

            $(window).on('mousemove.lg.zoom', function (e) ***REMOVED***
                if (isDraging) ***REMOVED***
                    var _$el = _this.core.$slide.eq(_this.core.index).find('.lg-img-wrap');
                    var distanceX;
                    var distanceY;

                    isMoved = true;
                    endCoords = ***REMOVED***
                        x: e.pageX,
                        y: e.pageY
                    ***REMOVED***;

                    // reset opacity and transition duration
                    _this.core.$outer.addClass('lg-zoom-dragging');

                    if (allowY) ***REMOVED***
                        distanceY = (-Math.abs(_$el.attr('data-y'))) + (endCoords.y - startCoords.y);
                    ***REMOVED*** else ***REMOVED***
                        distanceY = -Math.abs(_$el.attr('data-y'));
                    ***REMOVED***

                    if (allowX) ***REMOVED***
                        distanceX = (-Math.abs(_$el.attr('data-x'))) + (endCoords.x - startCoords.x);
                    ***REMOVED*** else ***REMOVED***
                        distanceX = -Math.abs(_$el.attr('data-x'));
                    ***REMOVED***

                    if (_this.core.s.useLeftForZoom) ***REMOVED***
                        _$el.css(***REMOVED***
                            left: distanceX + 'px',
                            top: distanceY + 'px'
                        ***REMOVED***);
                    ***REMOVED*** else ***REMOVED***
                        _$el.css('transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);

            $(window).on('mouseup.lg.zoom', function (e) ***REMOVED***

                if (isDraging) ***REMOVED***
                    isDraging = false;
                    _this.core.$outer.removeClass('lg-zoom-dragging');

                    // Fix for chrome mouse move on click
                    if (isMoved && ((startCoords.x !== endCoords.x) || (startCoords.y !== endCoords.y))) ***REMOVED***
                        endCoords = ***REMOVED***
                            x: e.pageX,
                            y: e.pageY
                        ***REMOVED***;
                        _this.touchendZoom(startCoords, endCoords, allowX, allowY);

                    ***REMOVED***

                    isMoved = false;
                ***REMOVED***

                _this.core.$outer.removeClass('lg-grabbing').addClass('lg-grab');

            ***REMOVED***);
        ***REMOVED***;

        Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY) ***REMOVED***

            var _this = this;
            var _$el = _this.core.$slide.eq(_this.core.index).find('.lg-img-wrap');
            var $image = _this.core.$slide.eq(_this.core.index).find('.lg-object');
            var distanceX = (-Math.abs(_$el.attr('data-x'))) + (endCoords.x - startCoords.x);
            var distanceY = (-Math.abs(_$el.attr('data-y'))) + (endCoords.y - startCoords.y);
            var minY = (_this.core.$outer.find('.lg').height() - $image.prop('offsetHeight')) / 2;
            var maxY = Math.abs(($image.prop('offsetHeight') * Math.abs($image.attr('data-scale'))) - _this.core.$outer.find('.lg').height() + minY);
            var minX = (_this.core.$outer.find('.lg').width() - $image.prop('offsetWidth')) / 2;
            var maxX = Math.abs(($image.prop('offsetWidth') * Math.abs($image.attr('data-scale'))) - _this.core.$outer.find('.lg').width() + minX);

            if ((Math.abs(endCoords.x - startCoords.x) > 15) || (Math.abs(endCoords.y - startCoords.y) > 15)) ***REMOVED***
                if (allowY) ***REMOVED***
                    if (distanceY <= -maxY) ***REMOVED***
                        distanceY = -maxY;
                    ***REMOVED*** else if (distanceY >= -minY) ***REMOVED***
                        distanceY = -minY;
                    ***REMOVED***
                ***REMOVED***

                if (allowX) ***REMOVED***
                    if (distanceX <= -maxX) ***REMOVED***
                        distanceX = -maxX;
                    ***REMOVED*** else if (distanceX >= -minX) ***REMOVED***
                        distanceX = -minX;
                    ***REMOVED***
                ***REMOVED***

                if (allowY) ***REMOVED***
                    _$el.attr('data-y', Math.abs(distanceY));
                ***REMOVED*** else ***REMOVED***
                    distanceY = -Math.abs(_$el.attr('data-y'));
                ***REMOVED***

                if (allowX) ***REMOVED***
                    _$el.attr('data-x', Math.abs(distanceX));
                ***REMOVED*** else ***REMOVED***
                    distanceX = -Math.abs(_$el.attr('data-x'));
                ***REMOVED***

                if (_this.core.s.useLeftForZoom) ***REMOVED***
                    _$el.css(***REMOVED***
                        left: distanceX + 'px',
                        top: distanceY + 'px'
                    ***REMOVED***);
                ***REMOVED*** else ***REMOVED***
                    _$el.css('transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
                ***REMOVED***

            ***REMOVED***
        ***REMOVED***;

        Zoom.prototype.destroy = function () ***REMOVED***

            var _this = this;

            // Unbind all events added by lightGallery zoom plugin
            _this.core.$el.off('.lg.zoom');
            $(window).off('.lg.zoom');
            _this.core.$slide.off('.lg.zoom');
            _this.core.$el.off('.lg.tm.zoom');
            _this.resetZoom();
            clearTimeout(_this.zoomabletimeout);
            _this.zoomabletimeout = false;
        ***REMOVED***;

        $.fn.lightGallery.modules.zoom = Zoom;

    ***REMOVED***)();


***REMOVED***));

/*! lg-hash - v1.0.4 - 2017-12-20
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2017 Sachin N; Licensed GPLv3 */

(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof exports === 'object') ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(jQuery);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***

    (function () ***REMOVED***

        'use strict';

        var defaults = ***REMOVED***
            hash: true
        ***REMOVED***;

        var Hash = function (element) ***REMOVED***

            this.core = $(element).data('lightGallery');

            this.core.s = $.extend(***REMOVED******REMOVED***, defaults, this.core.s);

            if (this.core.s.hash) ***REMOVED***
                this.oldHash = window.location.hash;
                this.init();
            ***REMOVED***

            return this;
        ***REMOVED***;

        Hash.prototype.init = function () ***REMOVED***
            var _this = this;
            var _hash;

            // Change hash value on after each slide transition
            _this.core.$el.on('onAfterSlide.lg.tm', function (event, prevIndex, index) ***REMOVED***
                if (history.replaceState) ***REMOVED***
                    history.replaceState(null, null, window.location.pathname + window.location.search + '#lg=' + _this.core.s.galleryId + '&slide=' + index);
                ***REMOVED*** else ***REMOVED***
                    window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + index;
                ***REMOVED***
            ***REMOVED***);

            // Listen hash change and change the slide according to slide value
            $(window).on('hashchange.lg.hash', function () ***REMOVED***
                _hash = window.location.hash;
                var _idx = parseInt(_hash.split('&slide=')[1], 10);

                // it galleryId doesn't exist in the url close the gallery
                if ((_hash.indexOf('lg=' + _this.core.s.galleryId) > -1)) ***REMOVED***
                    _this.core.slide(_idx, false, false);
                ***REMOVED*** else if (_this.core.lGalleryOn) ***REMOVED***
                    _this.core.destroy();
                ***REMOVED***

            ***REMOVED***);
        ***REMOVED***;

        Hash.prototype.destroy = function () ***REMOVED***

            if (!this.core.s.hash) ***REMOVED***
                return;
            ***REMOVED***

            // Reset to old hash value
            if (this.oldHash && this.oldHash.indexOf('lg=' + this.core.s.galleryId) < 0) ***REMOVED***
                if (history.replaceState) ***REMOVED***
                    history.replaceState(null, null, this.oldHash);
                ***REMOVED*** else ***REMOVED***
                    window.location.hash = this.oldHash;
                ***REMOVED***
            ***REMOVED*** else ***REMOVED***
                if (history.replaceState) ***REMOVED***
                    history.replaceState(null, document.title, window.location.pathname + window.location.search);
                ***REMOVED*** else ***REMOVED***
                    window.location.hash = '';
                ***REMOVED***
            ***REMOVED***

            this.core.$el.off('.lg.hash');

        ***REMOVED***;

        $.fn.lightGallery.modules.hash = Hash;

    ***REMOVED***)();


***REMOVED***));

/*! lg-share - v1.1.0 - 2017-10-03
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2017 Sachin N; Licensed GPLv3 */

(function (root, factory) ***REMOVED***
    if (typeof define === 'function' && define.amd) ***REMOVED***
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function (a0) ***REMOVED***
            return (factory(a0));
        ***REMOVED***);
    ***REMOVED*** else if (typeof exports === 'object') ***REMOVED***
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    ***REMOVED*** else ***REMOVED***
        factory(jQuery);
    ***REMOVED***
***REMOVED***(this, function ($) ***REMOVED***

    (function () ***REMOVED***

        'use strict';

        var defaults = ***REMOVED***
            share: true,
            facebook: true,
            facebookDropdownText: 'Facebook',
            twitter: true,
            twitterDropdownText: 'Twitter',
            googlePlus: true,
            googlePlusDropdownText: 'GooglePlus',
            pinterest: true,
            pinterestDropdownText: 'Pinterest'
        ***REMOVED***;

        var Share = function (element) ***REMOVED***

            this.core = $(element).data('lightGallery');

            this.core.s = $.extend(***REMOVED******REMOVED***, defaults, this.core.s);
            if (this.core.s.share) ***REMOVED***
                this.init();
            ***REMOVED***

            return this;
        ***REMOVED***;

        Share.prototype.init = function () ***REMOVED***
            var _this = this;
            var shareHtml = '<span id="lg-share" class="lg-icon">' +
                '<ul class="lg-dropdown" style="position: absolute;">';
            shareHtml += _this.core.s.facebook ? '<li><a id="lg-share-facebook" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' + this.core.s.facebookDropdownText + '</span></a></li>' : '';
            shareHtml += _this.core.s.twitter ? '<li><a id="lg-share-twitter" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' + this.core.s.twitterDropdownText + '</span></a></li>' : '';
            shareHtml += _this.core.s.googlePlus ? '<li><a id="lg-share-googleplus" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' + this.core.s.googlePlusDropdownText + '</span></a></li>' : '';
            shareHtml += _this.core.s.pinterest ? '<li><a id="lg-share-pinterest" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' + this.core.s.pinterestDropdownText + '</span></a></li>' : '';
            shareHtml += '</ul></span>';

            this.core.$outer.find('.lg-toolbar').append(shareHtml);
            this.core.$outer.find('.lg').append('<div id="lg-dropdown-overlay"></div>');
            $('#lg-share').on('click.lg', function () ***REMOVED***
                _this.core.$outer.toggleClass('lg-dropdown-active');
            ***REMOVED***);

            $('#lg-dropdown-overlay').on('click.lg', function () ***REMOVED***
                _this.core.$outer.removeClass('lg-dropdown-active');
            ***REMOVED***);

            _this.core.$el.on('onAfterSlide.lg.tm', function (event, prevIndex, index) ***REMOVED***

                setTimeout(function () ***REMOVED***

                    $('#lg-share-facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + (encodeURIComponent(_this.getSahreProps(index, 'facebookShareUrl') || window.location.href)));

                    $('#lg-share-twitter').attr('href', 'https://twitter.com/intent/tweet?text=' + _this.getSahreProps(index, 'tweetText') + '&url=' + (encodeURIComponent(_this.getSahreProps(index, 'twitterShareUrl') || window.location.href)));

                    $('#lg-share-googleplus').attr('href', 'https://plus.google.com/share?url=' + (encodeURIComponent(_this.getSahreProps(index, 'googleplusShareUrl') || window.location.href)));

                    $('#lg-share-pinterest').attr('href', 'http://www.pinterest.com/pin/create/button/?url=' + (encodeURIComponent(_this.getSahreProps(index, 'pinterestShareUrl') || window.location.href)) + '&media=' + encodeURIComponent(_this.getSahreProps(index, 'src')) + '&description=' + _this.getSahreProps(index, 'pinterestText'));

                ***REMOVED***, 100);
            ***REMOVED***);
        ***REMOVED***;

        Share.prototype.getSahreProps = function (index, prop) ***REMOVED***
            var shareProp = '';
            if (this.core.s.dynamic) ***REMOVED***
                shareProp = this.core.s.dynamicEl[index][prop];
            ***REMOVED*** else ***REMOVED***
                var _href = this.core.$items.eq(index).attr('href');
                var _prop = this.core.$items.eq(index).data(prop);
                shareProp = prop === 'src' ? _href || _prop : _prop;
            ***REMOVED***
            return shareProp;
        ***REMOVED***;

        Share.prototype.destroy = function () ***REMOVED***

        ***REMOVED***;

        $.fn.lightGallery.modules.share = Share;

    ***REMOVED***)();



***REMOVED***));
