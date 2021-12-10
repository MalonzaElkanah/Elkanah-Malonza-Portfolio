/**
 * Super simple wysiwyg editor v0.8.9
 * https://summernote.org
 *
 * Copyright 2013- Alan Hong. and other contributors
 * summernote may be freely distributed under the MIT license.
 *
 * Date: 2017-12-25T06:39Z
 */
(function (global, factory) ***REMOVED***
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(factory(global.jQuery));
***REMOVED***(this, (function ($$1) ***REMOVED*** 'use strict';

$$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;

var Renderer = /** @class */ (function () ***REMOVED***
    function Renderer(markup, children, options, callback) ***REMOVED***
        this.markup = markup;
        this.children = children;
        this.options = options;
        this.callback = callback;
    ***REMOVED***
    Renderer.prototype.render = function ($parent) ***REMOVED***
        var $node = $$1(this.markup);
        if (this.options && this.options.contents) ***REMOVED***
            $node.html(this.options.contents);
        ***REMOVED***
        if (this.options && this.options.className) ***REMOVED***
            $node.addClass(this.options.className);
        ***REMOVED***
        if (this.options && this.options.data) ***REMOVED***
            $$1.each(this.options.data, function (k, v) ***REMOVED***
                $node.attr('data-' + k, v);
            ***REMOVED***);
        ***REMOVED***
        if (this.options && this.options.click) ***REMOVED***
            $node.on('click', this.options.click);
        ***REMOVED***
        if (this.children) ***REMOVED***
            var $container_1 = $node.find('.note-children-container');
            this.children.forEach(function (child) ***REMOVED***
                child.render($container_1.length ? $container_1 : $node);
            ***REMOVED***);
        ***REMOVED***
        if (this.callback) ***REMOVED***
            this.callback($node, this.options);
        ***REMOVED***
        if (this.options && this.options.callback) ***REMOVED***
            this.options.callback($node);
        ***REMOVED***
        if ($parent) ***REMOVED***
            $parent.append($node);
        ***REMOVED***
        return $node;
    ***REMOVED***;
    return Renderer;
***REMOVED***());
var renderer = ***REMOVED***
    create: function (markup, callback) ***REMOVED***
        return function () ***REMOVED***
            var options = typeof arguments[1] === 'object' ? arguments[1] : arguments[0];
            var children = $$1.isArray(arguments[0]) ? arguments[0] : [];
            if (options && options.children) ***REMOVED***
                children = options.children;
            ***REMOVED***
            return new Renderer(markup, children, options, callback);
        ***REMOVED***;
    ***REMOVED***
***REMOVED***;

var editor = renderer.create('<div class="note-editor note-frame card"/>');
var toolbar = renderer.create('<div class="note-toolbar-wrapper"><div class="note-toolbar card-header"></div></div>');
var editingArea = renderer.create('<div class="note-editing-area"/>');
var codable = renderer.create('<textarea class="note-codable"/>');
var editable = renderer.create('<div class="note-editable card-block" contentEditable="true"/>');
var statusbar = renderer.create([
    '<div class="note-statusbar">',
    '  <div class="note-resizebar">',
    '    <div class="note-icon-bar"/>',
    '    <div class="note-icon-bar"/>',
    '    <div class="note-icon-bar"/>',
    '  </div>',
    '</div>'
].join(''));
var airEditor = renderer.create('<div class="note-editor"/>');
var airEditable = renderer.create('<div class="note-editable" contentEditable="true"/>');
var buttonGroup = renderer.create('<div class="note-btn-group btn-group">');
var dropdown = renderer.create('<div class="dropdown-menu">', function ($node, options) ***REMOVED***
    var markup = $$1.isArray(options.items) ? options.items.map(function (item) ***REMOVED***
        var value = (typeof item === 'string') ? item : (item.value || '');
        var content = options.template ? options.template(item) : item;
        var option = (typeof item === 'object') ? item.option : undefined;
        var dataValue = 'data-value="' + value + '"';
        var dataOption = (option !== undefined) ? ' data-option="' + option + '"' : '';
        return '<a class="dropdown-item" href="#" ' + (dataValue + dataOption) + '>' + content + '</a>';
    ***REMOVED***).join('') : options.items;
    $node.html(markup);
***REMOVED***);
var dropdownButtonContents = function (contents) ***REMOVED***
    return contents;
***REMOVED***;
var dropdownCheck = renderer.create('<div class="dropdown-menu note-check">', function ($node, options) ***REMOVED***
    var markup = $$1.isArray(options.items) ? options.items.map(function (item) ***REMOVED***
        var value = (typeof item === 'string') ? item : (item.value || '');
        var content = options.template ? options.template(item) : item;
        return '<a class="dropdown-item" href="#" data-value="' + value + '">' + icon(options.checkClassName) + ' ' + content + '</a>';
    ***REMOVED***).join('') : options.items;
    $node.html(markup);
***REMOVED***);
var palette = renderer.create('<div class="note-color-palette"/>', function ($node, options) ***REMOVED***
    var contents = [];
    for (var row = 0, rowSize = options.colors.length; row < rowSize; row++) ***REMOVED***
        var eventName = options.eventName;
        var colors = options.colors[row];
        var buttons = [];
        for (var col = 0, colSize = colors.length; col < colSize; col++) ***REMOVED***
            var color = colors[col];
            buttons.push([
                '<button type="button" class="note-color-btn"',
                'style="background-color:', color, '" ',
                'data-event="', eventName, '" ',
                'data-value="', color, '" ',
                'title="', color, '" ',
                'data-toggle="button" tabindex="-1"></button>'
            ].join(''));
        ***REMOVED***
        contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
    ***REMOVED***
    $node.html(contents.join(''));
    if (options.tooltip) ***REMOVED***
        $node.find('.note-color-btn').tooltip(***REMOVED***
            container: options.container,
            trigger: 'hover',
            placement: 'bottom'
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
var dialog = renderer.create('<div class="modal" aria-hidden="false" tabindex="-1"/>', function ($node, options) ***REMOVED***
    if (options.fade) ***REMOVED***
        $node.addClass('fade');
    ***REMOVED***
    $node.html([
        '<div class="modal-dialog">',
        '  <div class="modal-content">',
        (options.title
            ? '    <div class="modal-header">' +
                '      <h4 class="modal-title">' + options.title + '</h4>' +
                '      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '    </div>' : ''),
        '    <div class="modal-body">' + options.body + '</div>',
        (options.footer
            ? '    <div class="modal-footer">' + options.footer + '</div>' : ''),
        '  </div>',
        '</div>'
    ].join(''));
***REMOVED***);
var popover = renderer.create([
    '<div class="note-popover popover in">',
    '  <div class="arrow"/>',
    '  <div class="popover-content note-children-container"/>',
    '</div>'
].join(''), function ($node, options) ***REMOVED***
    var direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';
    $node.addClass(direction);
    if (options.hideArrow) ***REMOVED***
        $node.find('.arrow').hide();
    ***REMOVED***
***REMOVED***);
var checkbox = renderer.create('<label class="custom-control custom-checkbox"></label>', function ($node, options) ***REMOVED***
    if (options.id) ***REMOVED***
        $node.attr('for', options.id);
    ***REMOVED***
    $node.html([
        ' <input type="checkbox" class="custom-control-input"' + (options.id ? ' id="' + options.id + '"' : ''),
        (options.checked ? ' checked' : '') + '/>',
        ' <label class="custom-control-label" for="'+ options.id +'">' + (options.text ? options.text : '') + '</label>',
        '</label>'
    ].join(''));
***REMOVED***);
var icon = function (iconClassName, tagName) ***REMOVED***
    tagName = tagName || 'i';
    return '<' + tagName + ' class="' + iconClassName + '"/>';
***REMOVED***;
var ui = ***REMOVED***
    editor: editor,
    toolbar: toolbar,
    editingArea: editingArea,
    codable: codable,
    editable: editable,
    statusbar: statusbar,
    airEditor: airEditor,
    airEditable: airEditable,
    buttonGroup: buttonGroup,
    dropdown: dropdown,
    dropdownButtonContents: dropdownButtonContents,
    dropdownCheck: dropdownCheck,
    palette: palette,
    dialog: dialog,
    popover: popover,
    icon: icon,
    checkbox: checkbox,
    options: ***REMOVED******REMOVED***,
    button: function ($node, options) ***REMOVED***
        return renderer.create('<button type="button" class="note-btn btn btn-light btn-sm" tabindex="-1">', function ($node, options) ***REMOVED***
            if (options && options.tooltip) ***REMOVED***
                $node.attr(***REMOVED***
                    title: options.tooltip
                ***REMOVED***).tooltip(***REMOVED***
                    container: options.container,
                    trigger: 'hover',
                    placement: 'bottom'
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***)($node, options);
    ***REMOVED***,
    toggleBtn: function ($btn, isEnable) ***REMOVED***
        $btn.toggleClass('disabled', !isEnable);
        $btn.attr('disabled', !isEnable);
    ***REMOVED***,
    toggleBtnActive: function ($btn, isActive) ***REMOVED***
        $btn.toggleClass('active', isActive);
    ***REMOVED***,
    onDialogShown: function ($dialog, handler) ***REMOVED***
        $dialog.one('shown.bs.modal', handler);
    ***REMOVED***,
    onDialogHidden: function ($dialog, handler) ***REMOVED***
        $dialog.one('hidden.bs.modal', handler);
    ***REMOVED***,
    showDialog: function ($dialog) ***REMOVED***
        $dialog.modal('show');
    ***REMOVED***,
    hideDialog: function ($dialog) ***REMOVED***
        $dialog.modal('hide');
    ***REMOVED***,
    createLayout: function ($note, options) ***REMOVED***
        var $editor = (options.airMode ? ui.airEditor([
            ui.editingArea([
                ui.airEditable()
            ])
        ]) : ui.editor([
            ui.toolbar(),
            ui.editingArea([
                ui.codable(),
                ui.editable()
            ]),
            ui.statusbar()
        ])).render();
        $editor.insertAfter($note);
        return ***REMOVED***
            note: $note,
            editor: $editor,
            toolbar: $editor.find('.note-toolbar'),
            editingArea: $editor.find('.note-editing-area'),
            editable: $editor.find('.note-editable'),
            codable: $editor.find('.note-codable'),
            statusbar: $editor.find('.note-statusbar')
        ***REMOVED***;
    ***REMOVED***,
    removeLayout: function ($note, layoutInfo) ***REMOVED***
        $note.html(layoutInfo.editable.html());
        layoutInfo.editor.remove();
        $note.show();
    ***REMOVED***
***REMOVED***;

/**
 * @class core.func
 *
 * func utils (for high-order func's arg)
 *
 * @singleton
 * @alternateClassName func
 */
function eq(itemA) ***REMOVED***
    return function (itemB) ***REMOVED***
        return itemA === itemB;
    ***REMOVED***;
***REMOVED***
function eq2(itemA, itemB) ***REMOVED***
    return itemA === itemB;
***REMOVED***
function peq2(propName) ***REMOVED***
    return function (itemA, itemB) ***REMOVED***
        return itemA[propName] === itemB[propName];
    ***REMOVED***;
***REMOVED***
function ok() ***REMOVED***
    return true;
***REMOVED***
function fail() ***REMOVED***
    return false;
***REMOVED***
function not(f) ***REMOVED***
    return function () ***REMOVED***
        return !f.apply(f, arguments);
    ***REMOVED***;
***REMOVED***
function and(fA, fB) ***REMOVED***
    return function (item) ***REMOVED***
        return fA(item) && fB(item);
    ***REMOVED***;
***REMOVED***
function self(a) ***REMOVED***
    return a;
***REMOVED***
function invoke(obj, method) ***REMOVED***
    return function () ***REMOVED***
        return obj[method].apply(obj, arguments);
    ***REMOVED***;
***REMOVED***
var idCounter = 0;
/**
 * generate a globally-unique id
 *
 * @param ***REMOVED***String***REMOVED*** [prefix]
 */
function uniqueId(prefix) ***REMOVED***
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
***REMOVED***
/**
 * returns bnd (bounds) from rect
 *
 * - IE Compatibility Issue: http://goo.gl/sRLOAo
 * - Scroll Issue: http://goo.gl/sNjUc
 *
 * @param ***REMOVED***Rect***REMOVED*** rect
 * @return ***REMOVED***Object***REMOVED*** bounds
 * @return ***REMOVED***Number***REMOVED*** bounds.top
 * @return ***REMOVED***Number***REMOVED*** bounds.left
 * @return ***REMOVED***Number***REMOVED*** bounds.width
 * @return ***REMOVED***Number***REMOVED*** bounds.height
 */
function rect2bnd(rect) ***REMOVED***
    var $document = $(document);
    return ***REMOVED***
        top: rect.top + $document.scrollTop(),
        left: rect.left + $document.scrollLeft(),
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
    ***REMOVED***;
***REMOVED***
/**
 * returns a copy of the object where the keys have become the values and the values the keys.
 * @param ***REMOVED***Object***REMOVED*** obj
 * @return ***REMOVED***Object***REMOVED***
 */
function invertObject(obj) ***REMOVED***
    var inverted = ***REMOVED******REMOVED***;
    for (var key in obj) ***REMOVED***
        if (obj.hasOwnProperty(key)) ***REMOVED***
            inverted[obj[key]] = key;
        ***REMOVED***
    ***REMOVED***
    return inverted;
***REMOVED***
/**
 * @param ***REMOVED***String***REMOVED*** namespace
 * @param ***REMOVED***String***REMOVED*** [prefix]
 * @return ***REMOVED***String***REMOVED***
 */
function namespaceToCamel(namespace, prefix) ***REMOVED***
    prefix = prefix || '';
    return prefix + namespace.split('.').map(function (name) ***REMOVED***
        return name.substring(0, 1).toUpperCase() + name.substring(1);
    ***REMOVED***).join('');
***REMOVED***
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * @param ***REMOVED***Function***REMOVED*** func
 * @param ***REMOVED***Number***REMOVED*** wait
 * @param ***REMOVED***Boolean***REMOVED*** immediate
 * @return ***REMOVED***Function***REMOVED***
 */
function debounce(func, wait, immediate) ***REMOVED***
    var _this = this;
    var timeout;
    return function () ***REMOVED***
        var context = _this;
        var args = arguments;
        var later = function () ***REMOVED***
            timeout = null;
            if (!immediate) ***REMOVED***
                func.apply(context, args);
            ***REMOVED***
        ***REMOVED***;
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) ***REMOVED***
            func.apply(context, args);
        ***REMOVED***
    ***REMOVED***;
***REMOVED***
var func = ***REMOVED***
    eq: eq,
    eq2: eq2,
    peq2: peq2,
    ok: ok,
    fail: fail,
    self: self,
    not: not,
    and: and,
    invoke: invoke,
    uniqueId: uniqueId,
    rect2bnd: rect2bnd,
    invertObject: invertObject,
    namespaceToCamel: namespaceToCamel,
    debounce: debounce
***REMOVED***;

/**
 * returns the first item of an array.
 *
 * @param ***REMOVED***Array***REMOVED*** array
 */
function head(array) ***REMOVED***
    return array[0];
***REMOVED***
/**
 * returns the last item of an array.
 *
 * @param ***REMOVED***Array***REMOVED*** array
 */
function last(array) ***REMOVED***
    return array[array.length - 1];
***REMOVED***
/**
 * returns everything but the last entry of the array.
 *
 * @param ***REMOVED***Array***REMOVED*** array
 */
function initial(array) ***REMOVED***
    return array.slice(0, array.length - 1);
***REMOVED***
/**
 * returns the rest of the items in an array.
 *
 * @param ***REMOVED***Array***REMOVED*** array
 */
function tail(array) ***REMOVED***
    return array.slice(1);
***REMOVED***
/**
 * returns item of array
 */
function find(array, pred) ***REMOVED***
    for (var idx = 0, len = array.length; idx < len; idx++) ***REMOVED***
        var item = array[idx];
        if (pred(item)) ***REMOVED***
            return item;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
/**
 * returns true if all of the values in the array pass the predicate truth test.
 */
function all(array, pred) ***REMOVED***
    for (var idx = 0, len = array.length; idx < len; idx++) ***REMOVED***
        if (!pred(array[idx])) ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***
    return true;
***REMOVED***
/**
 * returns index of item
 */
function indexOf(array, item) ***REMOVED***
    return $$1.inArray(item, array);
***REMOVED***
/**
 * returns true if the value is present in the list.
 */
function contains(array, item) ***REMOVED***
    return indexOf(array, item) !== -1;
***REMOVED***
/**
 * get sum from a list
 *
 * @param ***REMOVED***Array***REMOVED*** array - array
 * @param ***REMOVED***Function***REMOVED*** fn - iterator
 */
function sum(array, fn) ***REMOVED***
    fn = fn || func.self;
    return array.reduce(function (memo, v) ***REMOVED***
        return memo + fn(v);
    ***REMOVED***, 0);
***REMOVED***
/**
 * returns a copy of the collection with array type.
 * @param ***REMOVED***Collection***REMOVED*** collection - collection eg) node.childNodes, ...
 */
function from(collection) ***REMOVED***
    var result = [];
    var length = collection.length;
    var idx = -1;
    while (++idx < length) ***REMOVED***
        result[idx] = collection[idx];
    ***REMOVED***
    return result;
***REMOVED***
/**
 * returns whether list is empty or not
 */
function isEmpty$1(array) ***REMOVED***
    return !array || !array.length;
***REMOVED***
/**
 * cluster elements by predicate function.
 *
 * @param ***REMOVED***Array***REMOVED*** array - array
 * @param ***REMOVED***Function***REMOVED*** fn - predicate function for cluster rule
 * @param ***REMOVED***Array[]***REMOVED***
 */
function clusterBy(array, fn) ***REMOVED***
    if (!array.length) ***REMOVED***
        return [];
    ***REMOVED***
    var aTail = tail(array);
    return aTail.reduce(function (memo, v) ***REMOVED***
        var aLast = last(memo);
        if (fn(last(aLast), v)) ***REMOVED***
            aLast[aLast.length] = v;
        ***REMOVED***
        else ***REMOVED***
            memo[memo.length] = [v];
        ***REMOVED***
        return memo;
    ***REMOVED***, [[head(array)]]);
***REMOVED***
/**
 * returns a copy of the array with all false values removed
 *
 * @param ***REMOVED***Array***REMOVED*** array - array
 * @param ***REMOVED***Function***REMOVED*** fn - predicate function for cluster rule
 */
function compact(array) ***REMOVED***
    var aResult = [];
    for (var idx = 0, len = array.length; idx < len; idx++) ***REMOVED***
        if (array[idx]) ***REMOVED***
            aResult.push(array[idx]);
        ***REMOVED***
    ***REMOVED***
    return aResult;
***REMOVED***
/**
 * produces a duplicate-free version of the array
 *
 * @param ***REMOVED***Array***REMOVED*** array
 */
function unique(array) ***REMOVED***
    var results = [];
    for (var idx = 0, len = array.length; idx < len; idx++) ***REMOVED***
        if (!contains(results, array[idx])) ***REMOVED***
            results.push(array[idx]);
        ***REMOVED***
    ***REMOVED***
    return results;
***REMOVED***
/**
 * returns next item.
 * @param ***REMOVED***Array***REMOVED*** array
 */
function next(array, item) ***REMOVED***
    var idx = indexOf(array, item);
    if (idx === -1) ***REMOVED***
        return null;
    ***REMOVED***
    return array[idx + 1];
***REMOVED***
/**
 * returns prev item.
 * @param ***REMOVED***Array***REMOVED*** array
 */
function prev(array, item) ***REMOVED***
    var idx = indexOf(array, item);
    if (idx === -1) ***REMOVED***
        return null;
    ***REMOVED***
    return array[idx - 1];
***REMOVED***
/**
 * @class core.list
 *
 * list utils
 *
 * @singleton
 * @alternateClassName list
 */
var lists = ***REMOVED***
    head: head,
    last: last,
    initial: initial,
    tail: tail,
    prev: prev,
    next: next,
    find: find,
    contains: contains,
    all: all,
    sum: sum,
    from: from,
    isEmpty: isEmpty$1,
    clusterBy: clusterBy,
    compact: compact,
    unique: unique
***REMOVED***;

var isSupportAmd = typeof define === 'function' && define.amd; // eslint-disable-line
/**
 * returns whether font is installed or not.
 *
 * @param ***REMOVED***String***REMOVED*** fontName
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isFontInstalled(fontName) ***REMOVED***
    var testFontName = fontName === 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
    var $tester = $$1('<div>').css(***REMOVED***
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        fontSize: '200px'
    ***REMOVED***).text('mmmmmmmmmwwwwwww').appendTo(document.body);
    var originalWidth = $tester.css('fontFamily', testFontName).width();
    var width = $tester.css('fontFamily', fontName + ',' + testFontName).width();
    $tester.remove();
    return originalWidth !== width;
***REMOVED***
var userAgent = navigator.userAgent;
var isMSIE = /MSIE|Trident/i.test(userAgent);
var browserVersion;
if (isMSIE) ***REMOVED***
    var matches = /MSIE (\d+[.]\d+)/.exec(userAgent);
    if (matches) ***REMOVED***
        browserVersion = parseFloat(matches[1]);
    ***REMOVED***
    matches = /Trident\/.*rv:([0-9]***REMOVED***1,***REMOVED***[.0-9]***REMOVED***0,***REMOVED***)/.exec(userAgent);
    if (matches) ***REMOVED***
        browserVersion = parseFloat(matches[1]);
    ***REMOVED***
***REMOVED***
var isEdge = /Edge\/\d+/.test(userAgent);
var hasCodeMirror = !!window.CodeMirror;
if (!hasCodeMirror && isSupportAmd) ***REMOVED***
    // Webpack
    if (typeof __webpack_require__ === 'function') ***REMOVED***
        try ***REMOVED***
            // If CodeMirror can't be resolved, `require.resolve` will throw an
            // exception and `hasCodeMirror` won't be set to `true`.
            require.resolve('codemirror');
            hasCodeMirror = true;
        ***REMOVED***
        catch (e) ***REMOVED***
            // do nothing
        ***REMOVED***
    ***REMOVED***
    else if (typeof require !== 'undefined') ***REMOVED***
        // Browserify
        if (typeof require.resolve !== 'undefined') ***REMOVED***
            try ***REMOVED***
                // If CodeMirror can't be resolved, `require.resolve` will throw an
                // exception and `hasCodeMirror` won't be set to `true`.
                require.resolve('codemirror');
                hasCodeMirror = true;
            ***REMOVED***
            catch (e) ***REMOVED***
                // do nothing
            ***REMOVED***
            // Almond/Require
        ***REMOVED***
        else if (typeof require.specified !== 'undefined') ***REMOVED***
            hasCodeMirror = require.specified('codemirror');
        ***REMOVED***
    ***REMOVED***
***REMOVED***
var isSupportTouch = (('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
// [workaround] IE doesn't have input events for contentEditable
// - see: https://goo.gl/4bfIvA
var inputEventName = (isMSIE || isEdge) ? 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted' : 'input';
/**
 * @class core.env
 *
 * Object which check platform and agent
 *
 * @singleton
 * @alternateClassName env
 */
var env = ***REMOVED***
    isMac: navigator.appVersion.indexOf('Mac') > -1,
    isMSIE: isMSIE,
    isEdge: isEdge,
    isFF: !isEdge && /firefox/i.test(userAgent),
    isPhantom: /PhantomJS/i.test(userAgent),
    isWebkit: !isEdge && /webkit/i.test(userAgent),
    isChrome: !isEdge && /chrome/i.test(userAgent),
    isSafari: !isEdge && /safari/i.test(userAgent),
    browserVersion: browserVersion,
    jqueryVersion: parseFloat($$1.fn.jquery),
    isSupportAmd: isSupportAmd,
    isSupportTouch: isSupportTouch,
    hasCodeMirror: hasCodeMirror,
    isFontInstalled: isFontInstalled,
    isW3CRangeSupport: !!document.createRange,
    inputEventName: inputEventName
***REMOVED***;

var NBSP_CHAR = String.fromCharCode(160);
var ZERO_WIDTH_NBSP_CHAR = '\ufeff';
/**
 * @method isEditable
 *
 * returns whether node is `note-editable` or not.
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isEditable(node) ***REMOVED***
    return node && $$1(node).hasClass('note-editable');
***REMOVED***
/**
 * @method isControlSizing
 *
 * returns whether node is `note-control-sizing` or not.
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isControlSizing(node) ***REMOVED***
    return node && $$1(node).hasClass('note-control-sizing');
***REMOVED***
/**
 * @method makePredByNodeName
 *
 * returns predicate which judge whether nodeName is same
 *
 * @param ***REMOVED***String***REMOVED*** nodeName
 * @return ***REMOVED***Function***REMOVED***
 */
function makePredByNodeName(nodeName) ***REMOVED***
    nodeName = nodeName.toUpperCase();
    return function (node) ***REMOVED***
        return node && node.nodeName.toUpperCase() === nodeName;
    ***REMOVED***;
***REMOVED***
/**
 * @method isText
 *
 *
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @return ***REMOVED***Boolean***REMOVED*** true if node's type is text(3)
 */
function isText(node) ***REMOVED***
    return node && node.nodeType === 3;
***REMOVED***
/**
 * @method isElement
 *
 *
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @return ***REMOVED***Boolean***REMOVED*** true if node's type is element(1)
 */
function isElement(node) ***REMOVED***
    return node && node.nodeType === 1;
***REMOVED***
/**
 * ex) br, col, embed, hr, img, input, ...
 * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
 */
function isVoid(node) ***REMOVED***
    return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON|^INPUT/.test(node.nodeName.toUpperCase());
***REMOVED***
function isPara(node) ***REMOVED***
    if (isEditable(node)) ***REMOVED***
        return false;
    ***REMOVED***
    // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
    return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
***REMOVED***
function isHeading(node) ***REMOVED***
    return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
***REMOVED***
var isPre = makePredByNodeName('PRE');
var isLi = makePredByNodeName('LI');
function isPurePara(node) ***REMOVED***
    return isPara(node) && !isLi(node);
***REMOVED***
var isTable = makePredByNodeName('TABLE');
var isData = makePredByNodeName('DATA');
function isInline(node) ***REMOVED***
    return !isBodyContainer(node) &&
        !isList(node) &&
        !isHr(node) &&
        !isPara(node) &&
        !isTable(node) &&
        !isBlockquote(node) &&
        !isData(node);
***REMOVED***
function isList(node) ***REMOVED***
    return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
***REMOVED***
var isHr = makePredByNodeName('HR');
function isCell(node) ***REMOVED***
    return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
***REMOVED***
var isBlockquote = makePredByNodeName('BLOCKQUOTE');
function isBodyContainer(node) ***REMOVED***
    return isCell(node) || isBlockquote(node) || isEditable(node);
***REMOVED***
var isAnchor = makePredByNodeName('A');
function isParaInline(node) ***REMOVED***
    return isInline(node) && !!ancestor(node, isPara);
***REMOVED***
function isBodyInline(node) ***REMOVED***
    return isInline(node) && !ancestor(node, isPara);
***REMOVED***
var isBody = makePredByNodeName('BODY');
/**
 * returns whether nodeB is closest sibling of nodeA
 *
 * @param ***REMOVED***Node***REMOVED*** nodeA
 * @param ***REMOVED***Node***REMOVED*** nodeB
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isClosestSibling(nodeA, nodeB) ***REMOVED***
    return nodeA.nextSibling === nodeB ||
        nodeA.previousSibling === nodeB;
***REMOVED***
/**
 * returns array of closest siblings with node
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***function***REMOVED*** [pred] - predicate function
 * @return ***REMOVED***Node[]***REMOVED***
 */
function withClosestSiblings(node, pred) ***REMOVED***
    pred = pred || func.ok;
    var siblings = [];
    if (node.previousSibling && pred(node.previousSibling)) ***REMOVED***
        siblings.push(node.previousSibling);
    ***REMOVED***
    siblings.push(node);
    if (node.nextSibling && pred(node.nextSibling)) ***REMOVED***
        siblings.push(node.nextSibling);
    ***REMOVED***
    return siblings;
***REMOVED***
/**
 * blank HTML for cursor position
 * - [workaround] old IE only works with &nbsp;
 * - [workaround] IE11 and other browser works with bogus br
 */
var blankHTML = env.isMSIE && env.browserVersion < 11 ? '&nbsp;' : '<br>';
/**
 * @method nodeLength
 *
 * returns #text's text size or element's childNodes size
 *
 * @param ***REMOVED***Node***REMOVED*** node
 */
function nodeLength(node) ***REMOVED***
    if (isText(node)) ***REMOVED***
        return node.nodeValue.length;
    ***REMOVED***
    if (node) ***REMOVED***
        return node.childNodes.length;
    ***REMOVED***
    return 0;
***REMOVED***
/**
 * returns whether node is empty or not.
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isEmpty(node) ***REMOVED***
    var len = nodeLength(node);
    if (len === 0) ***REMOVED***
        return true;
    ***REMOVED***
    else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) ***REMOVED***
        // ex) <p><br></p>, <span><br></span>
        return true;
    ***REMOVED***
    else if (lists.all(node.childNodes, isText) && node.innerHTML === '') ***REMOVED***
        // ex) <p></p>, <span></span>
        return true;
    ***REMOVED***
    return false;
***REMOVED***
/**
 * padding blankHTML if node is empty (for cursor position)
 */
function paddingBlankHTML(node) ***REMOVED***
    if (!isVoid(node) && !nodeLength(node)) ***REMOVED***
        node.innerHTML = blankHTML;
    ***REMOVED***
***REMOVED***
/**
 * find nearest ancestor predicate hit
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Function***REMOVED*** pred - predicate function
 */
function ancestor(node, pred) ***REMOVED***
    while (node) ***REMOVED***
        if (pred(node)) ***REMOVED***
            return node;
        ***REMOVED***
        if (isEditable(node)) ***REMOVED***
            break;
        ***REMOVED***
        node = node.parentNode;
    ***REMOVED***
    return null;
***REMOVED***
/**
 * find nearest ancestor only single child blood line and predicate hit
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Function***REMOVED*** pred - predicate function
 */
function singleChildAncestor(node, pred) ***REMOVED***
    node = node.parentNode;
    while (node) ***REMOVED***
        if (nodeLength(node) !== 1) ***REMOVED***
            break;
        ***REMOVED***
        if (pred(node)) ***REMOVED***
            return node;
        ***REMOVED***
        if (isEditable(node)) ***REMOVED***
            break;
        ***REMOVED***
        node = node.parentNode;
    ***REMOVED***
    return null;
***REMOVED***
/**
 * returns new array of ancestor nodes (until predicate hit).
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Function***REMOVED*** [optional] pred - predicate function
 */
function listAncestor(node, pred) ***REMOVED***
    pred = pred || func.fail;
    var ancestors = [];
    ancestor(node, function (el) ***REMOVED***
        if (!isEditable(el)) ***REMOVED***
            ancestors.push(el);
        ***REMOVED***
        return pred(el);
    ***REMOVED***);
    return ancestors;
***REMOVED***
/**
 * find farthest ancestor predicate hit
 */
function lastAncestor(node, pred) ***REMOVED***
    var ancestors = listAncestor(node);
    return lists.last(ancestors.filter(pred));
***REMOVED***
/**
 * returns common ancestor node between two nodes.
 *
 * @param ***REMOVED***Node***REMOVED*** nodeA
 * @param ***REMOVED***Node***REMOVED*** nodeB
 */
function commonAncestor(nodeA, nodeB) ***REMOVED***
    var ancestors = listAncestor(nodeA);
    for (var n = nodeB; n; n = n.parentNode) ***REMOVED***
        if ($$1.inArray(n, ancestors) > -1) ***REMOVED***
            return n;
        ***REMOVED***
    ***REMOVED***
    return null; // difference document area
***REMOVED***
/**
 * listing all previous siblings (until predicate hit).
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Function***REMOVED*** [optional] pred - predicate function
 */
function listPrev(node, pred) ***REMOVED***
    pred = pred || func.fail;
    var nodes = [];
    while (node) ***REMOVED***
        if (pred(node)) ***REMOVED***
            break;
        ***REMOVED***
        nodes.push(node);
        node = node.previousSibling;
    ***REMOVED***
    return nodes;
***REMOVED***
/**
 * listing next siblings (until predicate hit).
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Function***REMOVED*** [pred] - predicate function
 */
function listNext(node, pred) ***REMOVED***
    pred = pred || func.fail;
    var nodes = [];
    while (node) ***REMOVED***
        if (pred(node)) ***REMOVED***
            break;
        ***REMOVED***
        nodes.push(node);
        node = node.nextSibling;
    ***REMOVED***
    return nodes;
***REMOVED***
/**
 * listing descendant nodes
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Function***REMOVED*** [pred] - predicate function
 */
function listDescendant(node, pred) ***REMOVED***
    var descendants = [];
    pred = pred || func.ok;
    // start DFS(depth first search) with node
    (function fnWalk(current) ***REMOVED***
        if (node !== current && pred(current)) ***REMOVED***
            descendants.push(current);
        ***REMOVED***
        for (var idx = 0, len = current.childNodes.length; idx < len; idx++) ***REMOVED***
            fnWalk(current.childNodes[idx]);
        ***REMOVED***
    ***REMOVED***)(node);
    return descendants;
***REMOVED***
/**
 * wrap node with new tag.
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Node***REMOVED*** tagName of wrapper
 * @return ***REMOVED***Node***REMOVED*** - wrapper
 */
function wrap(node, wrapperName) ***REMOVED***
    var parent = node.parentNode;
    var wrapper = $$1('<' + wrapperName + '>')[0];
    parent.insertBefore(wrapper, node);
    wrapper.appendChild(node);
    return wrapper;
***REMOVED***
/**
 * insert node after preceding
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Node***REMOVED*** preceding - predicate function
 */
function insertAfter(node, preceding) ***REMOVED***
    var next = preceding.nextSibling;
    var parent = preceding.parentNode;
    if (next) ***REMOVED***
        parent.insertBefore(node, next);
    ***REMOVED***
    else ***REMOVED***
        parent.appendChild(node);
    ***REMOVED***
    return node;
***REMOVED***
/**
 * append elements.
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Collection***REMOVED*** aChild
 */
function appendChildNodes(node, aChild) ***REMOVED***
    $$1.each(aChild, function (idx, child) ***REMOVED***
        node.appendChild(child);
    ***REMOVED***);
    return node;
***REMOVED***
/**
 * returns whether boundaryPoint is left edge or not.
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isLeftEdgePoint(point) ***REMOVED***
    return point.offset === 0;
***REMOVED***
/**
 * returns whether boundaryPoint is right edge or not.
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isRightEdgePoint(point) ***REMOVED***
    return point.offset === nodeLength(point.node);
***REMOVED***
/**
 * returns whether boundaryPoint is edge or not.
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isEdgePoint(point) ***REMOVED***
    return isLeftEdgePoint(point) || isRightEdgePoint(point);
***REMOVED***
/**
 * returns whether node is left edge of ancestor or not.
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Node***REMOVED*** ancestor
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isLeftEdgeOf(node, ancestor) ***REMOVED***
    while (node && node !== ancestor) ***REMOVED***
        if (position(node) !== 0) ***REMOVED***
            return false;
        ***REMOVED***
        node = node.parentNode;
    ***REMOVED***
    return true;
***REMOVED***
/**
 * returns whether node is right edge of ancestor or not.
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Node***REMOVED*** ancestor
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isRightEdgeOf(node, ancestor) ***REMOVED***
    if (!ancestor) ***REMOVED***
        return false;
    ***REMOVED***
    while (node && node !== ancestor) ***REMOVED***
        if (position(node) !== nodeLength(node.parentNode) - 1) ***REMOVED***
            return false;
        ***REMOVED***
        node = node.parentNode;
    ***REMOVED***
    return true;
***REMOVED***
/**
 * returns whether point is left edge of ancestor or not.
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @param ***REMOVED***Node***REMOVED*** ancestor
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isLeftEdgePointOf(point, ancestor) ***REMOVED***
    return isLeftEdgePoint(point) && isLeftEdgeOf(point.node, ancestor);
***REMOVED***
/**
 * returns whether point is right edge of ancestor or not.
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @param ***REMOVED***Node***REMOVED*** ancestor
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isRightEdgePointOf(point, ancestor) ***REMOVED***
    return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor);
***REMOVED***
/**
 * returns offset from parent.
 *
 * @param ***REMOVED***Node***REMOVED*** node
 */
function position(node) ***REMOVED***
    var offset = 0;
    while ((node = node.previousSibling)) ***REMOVED***
        offset += 1;
    ***REMOVED***
    return offset;
***REMOVED***
function hasChildren(node) ***REMOVED***
    return !!(node && node.childNodes && node.childNodes.length);
***REMOVED***
/**
 * returns previous boundaryPoint
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @param ***REMOVED***Boolean***REMOVED*** isSkipInnerOffset
 * @return ***REMOVED***BoundaryPoint***REMOVED***
 */
function prevPoint(point, isSkipInnerOffset) ***REMOVED***
    var node;
    var offset;
    if (point.offset === 0) ***REMOVED***
        if (isEditable(point.node)) ***REMOVED***
            return null;
        ***REMOVED***
        node = point.node.parentNode;
        offset = position(point.node);
    ***REMOVED***
    else if (hasChildren(point.node)) ***REMOVED***
        node = point.node.childNodes[point.offset - 1];
        offset = nodeLength(node);
    ***REMOVED***
    else ***REMOVED***
        node = point.node;
        offset = isSkipInnerOffset ? 0 : point.offset - 1;
    ***REMOVED***
    return ***REMOVED***
        node: node,
        offset: offset
    ***REMOVED***;
***REMOVED***
/**
 * returns next boundaryPoint
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @param ***REMOVED***Boolean***REMOVED*** isSkipInnerOffset
 * @return ***REMOVED***BoundaryPoint***REMOVED***
 */
function nextPoint(point, isSkipInnerOffset) ***REMOVED***
    var node, offset;
    if (nodeLength(point.node) === point.offset) ***REMOVED***
        if (isEditable(point.node)) ***REMOVED***
            return null;
        ***REMOVED***
        node = point.node.parentNode;
        offset = position(point.node) + 1;
    ***REMOVED***
    else if (hasChildren(point.node)) ***REMOVED***
        node = point.node.childNodes[point.offset];
        offset = 0;
    ***REMOVED***
    else ***REMOVED***
        node = point.node;
        offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
    ***REMOVED***
    return ***REMOVED***
        node: node,
        offset: offset
    ***REMOVED***;
***REMOVED***
/**
 * returns whether pointA and pointB is same or not.
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** pointA
 * @param ***REMOVED***BoundaryPoint***REMOVED*** pointB
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isSamePoint(pointA, pointB) ***REMOVED***
    return pointA.node === pointB.node && pointA.offset === pointB.offset;
***REMOVED***
/**
 * returns whether point is visible (can set cursor) or not.
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isVisiblePoint(point) ***REMOVED***
    if (isText(point.node) || !hasChildren(point.node) || isEmpty(point.node)) ***REMOVED***
        return true;
    ***REMOVED***
    var leftNode = point.node.childNodes[point.offset - 1];
    var rightNode = point.node.childNodes[point.offset];
    if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) ***REMOVED***
        return true;
    ***REMOVED***
    return false;
***REMOVED***
/**
 * @method prevPointUtil
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @param ***REMOVED***Function***REMOVED*** pred
 * @return ***REMOVED***BoundaryPoint***REMOVED***
 */
function prevPointUntil(point, pred) ***REMOVED***
    while (point) ***REMOVED***
        if (pred(point)) ***REMOVED***
            return point;
        ***REMOVED***
        point = prevPoint(point);
    ***REMOVED***
    return null;
***REMOVED***
/**
 * @method nextPointUntil
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @param ***REMOVED***Function***REMOVED*** pred
 * @return ***REMOVED***BoundaryPoint***REMOVED***
 */
function nextPointUntil(point, pred) ***REMOVED***
    while (point) ***REMOVED***
        if (pred(point)) ***REMOVED***
            return point;
        ***REMOVED***
        point = nextPoint(point);
    ***REMOVED***
    return null;
***REMOVED***
/**
 * returns whether point has character or not.
 *
 * @param ***REMOVED***Point***REMOVED*** point
 * @return ***REMOVED***Boolean***REMOVED***
 */
function isCharPoint(point) ***REMOVED***
    if (!isText(point.node)) ***REMOVED***
        return false;
    ***REMOVED***
    var ch = point.node.nodeValue.charAt(point.offset - 1);
    return ch && (ch !== ' ' && ch !== NBSP_CHAR);
***REMOVED***
/**
 * @method walkPoint
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** startPoint
 * @param ***REMOVED***BoundaryPoint***REMOVED*** endPoint
 * @param ***REMOVED***Function***REMOVED*** handler
 * @param ***REMOVED***Boolean***REMOVED*** isSkipInnerOffset
 */
function walkPoint(startPoint, endPoint, handler, isSkipInnerOffset) ***REMOVED***
    var point = startPoint;
    while (point) ***REMOVED***
        handler(point);
        if (isSamePoint(point, endPoint)) ***REMOVED***
            break;
        ***REMOVED***
        var isSkipOffset = isSkipInnerOffset &&
            startPoint.node !== point.node &&
            endPoint.node !== point.node;
        point = nextPoint(point, isSkipOffset);
    ***REMOVED***
***REMOVED***
/**
 * @method makeOffsetPath
 *
 * return offsetPath(array of offset) from ancestor
 *
 * @param ***REMOVED***Node***REMOVED*** ancestor - ancestor node
 * @param ***REMOVED***Node***REMOVED*** node
 */
function makeOffsetPath(ancestor, node) ***REMOVED***
    var ancestors = listAncestor(node, func.eq(ancestor));
    return ancestors.map(position).reverse();
***REMOVED***
/**
 * @method fromOffsetPath
 *
 * return element from offsetPath(array of offset)
 *
 * @param ***REMOVED***Node***REMOVED*** ancestor - ancestor node
 * @param ***REMOVED***array***REMOVED*** offsets - offsetPath
 */
function fromOffsetPath(ancestor, offsets) ***REMOVED***
    var current = ancestor;
    for (var i = 0, len = offsets.length; i < len; i++) ***REMOVED***
        if (current.childNodes.length <= offsets[i]) ***REMOVED***
            current = current.childNodes[current.childNodes.length - 1];
        ***REMOVED***
        else ***REMOVED***
            current = current.childNodes[offsets[i]];
        ***REMOVED***
    ***REMOVED***
    return current;
***REMOVED***
/**
 * @method splitNode
 *
 * split element or #text
 *
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @param ***REMOVED***Object***REMOVED*** [options]
 * @param ***REMOVED***Boolean***REMOVED*** [options.isSkipPaddingBlankHTML] - default: false
 * @param ***REMOVED***Boolean***REMOVED*** [options.isNotSplitEdgePoint] - default: false
 * @return ***REMOVED***Node***REMOVED*** right node of boundaryPoint
 */
function splitNode(point, options) ***REMOVED***
    var isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
    var isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;
    // edge case
    if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) ***REMOVED***
        if (isLeftEdgePoint(point)) ***REMOVED***
            return point.node;
        ***REMOVED***
        else if (isRightEdgePoint(point)) ***REMOVED***
            return point.node.nextSibling;
        ***REMOVED***
    ***REMOVED***
    // split #text
    if (isText(point.node)) ***REMOVED***
        return point.node.splitText(point.offset);
    ***REMOVED***
    else ***REMOVED***
        var childNode = point.node.childNodes[point.offset];
        var clone = insertAfter(point.node.cloneNode(false), point.node);
        appendChildNodes(clone, listNext(childNode));
        if (!isSkipPaddingBlankHTML) ***REMOVED***
            paddingBlankHTML(point.node);
            paddingBlankHTML(clone);
        ***REMOVED***
        return clone;
    ***REMOVED***
***REMOVED***
/**
 * @method splitTree
 *
 * split tree by point
 *
 * @param ***REMOVED***Node***REMOVED*** root - split root
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @param ***REMOVED***Object***REMOVED*** [options]
 * @param ***REMOVED***Boolean***REMOVED*** [options.isSkipPaddingBlankHTML] - default: false
 * @param ***REMOVED***Boolean***REMOVED*** [options.isNotSplitEdgePoint] - default: false
 * @return ***REMOVED***Node***REMOVED*** right node of boundaryPoint
 */
function splitTree(root, point, options) ***REMOVED***
    // ex) [#text, <span>, <p>]
    var ancestors = listAncestor(point.node, func.eq(root));
    if (!ancestors.length) ***REMOVED***
        return null;
    ***REMOVED***
    else if (ancestors.length === 1) ***REMOVED***
        return splitNode(point, options);
    ***REMOVED***
    return ancestors.reduce(function (node, parent) ***REMOVED***
        if (node === point.node) ***REMOVED***
            node = splitNode(point, options);
        ***REMOVED***
        return splitNode(***REMOVED***
            node: parent,
            offset: node ? position(node) : nodeLength(parent)
        ***REMOVED***, options);
    ***REMOVED***);
***REMOVED***
/**
 * split point
 *
 * @param ***REMOVED***Point***REMOVED*** point
 * @param ***REMOVED***Boolean***REMOVED*** isInline
 * @return ***REMOVED***Object***REMOVED***
 */
function splitPoint(point, isInline) ***REMOVED***
    // find splitRoot, container
    //  - inline: splitRoot is a child of paragraph
    //  - block: splitRoot is a child of bodyContainer
    var pred = isInline ? isPara : isBodyContainer;
    var ancestors = listAncestor(point.node, pred);
    var topAncestor = lists.last(ancestors) || point.node;
    var splitRoot, container;
    if (pred(topAncestor)) ***REMOVED***
        splitRoot = ancestors[ancestors.length - 2];
        container = topAncestor;
    ***REMOVED***
    else ***REMOVED***
        splitRoot = topAncestor;
        container = splitRoot.parentNode;
    ***REMOVED***
    // if splitRoot is exists, split with splitTree
    var pivot = splitRoot && splitTree(splitRoot, point, ***REMOVED***
        isSkipPaddingBlankHTML: isInline,
        isNotSplitEdgePoint: isInline
    ***REMOVED***);
    // if container is point.node, find pivot with point.offset
    if (!pivot && container === point.node) ***REMOVED***
        pivot = point.node.childNodes[point.offset];
    ***REMOVED***
    return ***REMOVED***
        rightNode: pivot,
        container: container
    ***REMOVED***;
***REMOVED***
function create(nodeName) ***REMOVED***
    return document.createElement(nodeName);
***REMOVED***
function createText(text) ***REMOVED***
    return document.createTextNode(text);
***REMOVED***
/**
 * @method remove
 *
 * remove node, (isRemoveChild: remove child or not)
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Boolean***REMOVED*** isRemoveChild
 */
function remove(node, isRemoveChild) ***REMOVED***
    if (!node || !node.parentNode) ***REMOVED***
        return;
    ***REMOVED***
    if (node.removeNode) ***REMOVED***
        return node.removeNode(isRemoveChild);
    ***REMOVED***
    var parent = node.parentNode;
    if (!isRemoveChild) ***REMOVED***
        var nodes = [];
        for (var i = 0, len = node.childNodes.length; i < len; i++) ***REMOVED***
            nodes.push(node.childNodes[i]);
        ***REMOVED***
        for (var i = 0, len = nodes.length; i < len; i++) ***REMOVED***
            parent.insertBefore(nodes[i], node);
        ***REMOVED***
    ***REMOVED***
    parent.removeChild(node);
***REMOVED***
/**
 * @method removeWhile
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***Function***REMOVED*** pred
 */
function removeWhile(node, pred) ***REMOVED***
    while (node) ***REMOVED***
        if (isEditable(node) || !pred(node)) ***REMOVED***
            break;
        ***REMOVED***
        var parent = node.parentNode;
        remove(node);
        node = parent;
    ***REMOVED***
***REMOVED***
/**
 * @method replace
 *
 * replace node with provided nodeName
 *
 * @param ***REMOVED***Node***REMOVED*** node
 * @param ***REMOVED***String***REMOVED*** nodeName
 * @return ***REMOVED***Node***REMOVED*** - new node
 */
function replace(node, nodeName) ***REMOVED***
    if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) ***REMOVED***
        return node;
    ***REMOVED***
    var newNode = create(nodeName);
    if (node.style.cssText) ***REMOVED***
        newNode.style.cssText = node.style.cssText;
    ***REMOVED***
    appendChildNodes(newNode, lists.from(node.childNodes));
    insertAfter(newNode, node);
    remove(node);
    return newNode;
***REMOVED***
var isTextarea = makePredByNodeName('TEXTAREA');
/**
 * @param ***REMOVED***jQuery***REMOVED*** $node
 * @param ***REMOVED***Boolean***REMOVED*** [stripLinebreaks] - default: false
 */
function value($node, stripLinebreaks) ***REMOVED***
    var val = isTextarea($node[0]) ? $node.val() : $node.html();
    if (stripLinebreaks) ***REMOVED***
        return val.replace(/[\n\r]/g, '');
    ***REMOVED***
    return val;
***REMOVED***
/**
 * @method html
 *
 * get the HTML contents of node
 *
 * @param ***REMOVED***jQuery***REMOVED*** $node
 * @param ***REMOVED***Boolean***REMOVED*** [isNewlineOnBlock]
 */
function html($node, isNewlineOnBlock) ***REMOVED***
    var markup = value($node);
    if (isNewlineOnBlock) ***REMOVED***
        var regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
        markup = markup.replace(regexTag, function (match, endSlash, name) ***REMOVED***
            name = name.toUpperCase();
            var isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) &&
                !!endSlash;
            var isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);
            return match + ((isEndOfInlineContainer || isBlockNode) ? '\n' : '');
        ***REMOVED***);
        markup = $$1.trim(markup);
    ***REMOVED***
    return markup;
***REMOVED***
function posFromPlaceholder(placeholder) ***REMOVED***
    var $placeholder = $$1(placeholder);
    var pos = $placeholder.offset();
    var height = $placeholder.outerHeight(true); // include margin
    return ***REMOVED***
        left: pos.left,
        top: pos.top + height
    ***REMOVED***;
***REMOVED***
function attachEvents($node, events) ***REMOVED***
    Object.keys(events).forEach(function (key) ***REMOVED***
        $node.on(key, events[key]);
    ***REMOVED***);
***REMOVED***
function detachEvents($node, events) ***REMOVED***
    Object.keys(events).forEach(function (key) ***REMOVED***
        $node.off(key, events[key]);
    ***REMOVED***);
***REMOVED***
/**
 * @method isCustomStyleTag
 *
 * assert if a node contains a "note-styletag" class,
 * which implies that's a custom-made style tag node
 *
 * @param ***REMOVED***Node***REMOVED*** an HTML DOM node
 */
function isCustomStyleTag(node) ***REMOVED***
    return node && !isText(node) && lists.contains(node.classList, 'note-styletag');
***REMOVED***
var dom = ***REMOVED***
    /** @property ***REMOVED***String***REMOVED*** NBSP_CHAR */
    NBSP_CHAR: NBSP_CHAR,
    /** @property ***REMOVED***String***REMOVED*** ZERO_WIDTH_NBSP_CHAR */
    ZERO_WIDTH_NBSP_CHAR: ZERO_WIDTH_NBSP_CHAR,
    /** @property ***REMOVED***String***REMOVED*** blank */
    blank: blankHTML,
    /** @property ***REMOVED***String***REMOVED*** emptyPara */
    emptyPara: "<p>" + blankHTML + "</p>",
    makePredByNodeName: makePredByNodeName,
    isEditable: isEditable,
    isControlSizing: isControlSizing,
    isText: isText,
    isElement: isElement,
    isVoid: isVoid,
    isPara: isPara,
    isPurePara: isPurePara,
    isHeading: isHeading,
    isInline: isInline,
    isBlock: func.not(isInline),
    isBodyInline: isBodyInline,
    isBody: isBody,
    isParaInline: isParaInline,
    isPre: isPre,
    isList: isList,
    isTable: isTable,
    isData: isData,
    isCell: isCell,
    isBlockquote: isBlockquote,
    isBodyContainer: isBodyContainer,
    isAnchor: isAnchor,
    isDiv: makePredByNodeName('DIV'),
    isLi: isLi,
    isBR: makePredByNodeName('BR'),
    isSpan: makePredByNodeName('SPAN'),
    isB: makePredByNodeName('B'),
    isU: makePredByNodeName('U'),
    isS: makePredByNodeName('S'),
    isI: makePredByNodeName('I'),
    isImg: makePredByNodeName('IMG'),
    isTextarea: isTextarea,
    isEmpty: isEmpty,
    isEmptyAnchor: func.and(isAnchor, isEmpty),
    isClosestSibling: isClosestSibling,
    withClosestSiblings: withClosestSiblings,
    nodeLength: nodeLength,
    isLeftEdgePoint: isLeftEdgePoint,
    isRightEdgePoint: isRightEdgePoint,
    isEdgePoint: isEdgePoint,
    isLeftEdgeOf: isLeftEdgeOf,
    isRightEdgeOf: isRightEdgeOf,
    isLeftEdgePointOf: isLeftEdgePointOf,
    isRightEdgePointOf: isRightEdgePointOf,
    prevPoint: prevPoint,
    nextPoint: nextPoint,
    isSamePoint: isSamePoint,
    isVisiblePoint: isVisiblePoint,
    prevPointUntil: prevPointUntil,
    nextPointUntil: nextPointUntil,
    isCharPoint: isCharPoint,
    walkPoint: walkPoint,
    ancestor: ancestor,
    singleChildAncestor: singleChildAncestor,
    listAncestor: listAncestor,
    lastAncestor: lastAncestor,
    listNext: listNext,
    listPrev: listPrev,
    listDescendant: listDescendant,
    commonAncestor: commonAncestor,
    wrap: wrap,
    insertAfter: insertAfter,
    appendChildNodes: appendChildNodes,
    position: position,
    hasChildren: hasChildren,
    makeOffsetPath: makeOffsetPath,
    fromOffsetPath: fromOffsetPath,
    splitTree: splitTree,
    splitPoint: splitPoint,
    create: create,
    createText: createText,
    remove: remove,
    removeWhile: removeWhile,
    replace: replace,
    html: html,
    value: value,
    posFromPlaceholder: posFromPlaceholder,
    attachEvents: attachEvents,
    detachEvents: detachEvents,
    isCustomStyleTag: isCustomStyleTag
***REMOVED***;

$$1.summernote = $$1.summernote || ***REMOVED***
    lang: ***REMOVED******REMOVED***
***REMOVED***;
$$1.extend($$1.summernote.lang, ***REMOVED***
    'en-US': ***REMOVED***
        font: ***REMOVED***
            bold: 'Bold',
            italic: 'Italic',
            underline: 'Underline',
            clear: 'Remove Font Style',
            height: 'Line Height',
            name: 'Font Family',
            strikethrough: 'Strikethrough',
            subscript: 'Subscript',
            superscript: 'Superscript',
            size: 'Font Size'
        ***REMOVED***,
        image: ***REMOVED***
            image: 'Picture',
            insert: 'Insert Image',
            resizeFull: 'Resize Full',
            resizeHalf: 'Resize Half',
            resizeQuarter: 'Resize Quarter',
            floatLeft: 'Float Left',
            floatRight: 'Float Right',
            floatNone: 'Float None',
            shapeRounded: 'Shape: Rounded',
            shapeCircle: 'Shape: Circle',
            shapeThumbnail: 'Shape: Thumbnail',
            shapeNone: 'Shape: None',
            dragImageHere: 'Drag image or text here',
            dropImage: 'Drop image or Text',
            selectFromFiles: 'Select from files',
            maximumFileSize: 'Maximum file size',
            maximumFileSizeError: 'Maximum file size exceeded.',
            url: 'Image URL',
            remove: 'Remove Image',
            original: 'Original'
        ***REMOVED***,
        video: ***REMOVED***
            video: 'Video',
            videoLink: 'Video Link',
            insert: 'Insert Video',
            url: 'Video URL',
            providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion or Youku)'
        ***REMOVED***,
        link: ***REMOVED***
            link: 'Link',
            insert: 'Insert Link',
            unlink: 'Unlink',
            edit: 'Edit',
            textToDisplay: 'Text to display',
            url: 'To what URL should this link go?',
            openInNewWindow: 'Open in new window'
        ***REMOVED***,
        table: ***REMOVED***
            table: 'Table',
            addRowAbove: 'Add row above',
            addRowBelow: 'Add row below',
            addColLeft: 'Add column left',
            addColRight: 'Add column right',
            delRow: 'Delete row',
            delCol: 'Delete column',
            delTable: 'Delete table'
        ***REMOVED***,
        hr: ***REMOVED***
            insert: 'Insert Horizontal Rule'
        ***REMOVED***,
        style: ***REMOVED***
            style: 'Style',
            p: 'Normal',
            blockquote: 'Quote',
            pre: 'Code',
            h1: 'Header 1',
            h2: 'Header 2',
            h3: 'Header 3',
            h4: 'Header 4',
            h5: 'Header 5',
            h6: 'Header 6'
        ***REMOVED***,
        lists: ***REMOVED***
            unordered: 'Unordered list',
            ordered: 'Ordered list'
        ***REMOVED***,
        options: ***REMOVED***
            help: 'Help',
            fullscreen: 'Full Screen',
            codeview: 'Code View'
        ***REMOVED***,
        paragraph: ***REMOVED***
            paragraph: 'Paragraph',
            outdent: 'Outdent',
            indent: 'Indent',
            left: 'Align left',
            center: 'Align center',
            right: 'Align right',
            justify: 'Justify full'
        ***REMOVED***,
        color: ***REMOVED***
            recent: 'Recent Color',
            more: 'More Color',
            background: 'Background Color',
            foreground: 'Foreground Color',
            transparent: 'Transparent',
            setTransparent: 'Set transparent',
            reset: 'Reset',
            resetToDefault: 'Reset to default'
        ***REMOVED***,
        shortcut: ***REMOVED***
            shortcuts: 'Keyboard shortcuts',
            close: 'Close',
            textFormatting: 'Text formatting',
            action: 'Action',
            paragraphFormatting: 'Paragraph formatting',
            documentStyle: 'Document Style',
            extraKeys: 'Extra keys'
        ***REMOVED***,
        help: ***REMOVED***
            'insertParagraph': 'Insert Paragraph',
            'undo': 'Undoes the last command',
            'redo': 'Redoes the last command',
            'tab': 'Tab',
            'untab': 'Untab',
            'bold': 'Set a bold style',
            'italic': 'Set a italic style',
            'underline': 'Set a underline style',
            'strikethrough': 'Set a strikethrough style',
            'removeFormat': 'Clean a style',
            'justifyLeft': 'Set left align',
            'justifyCenter': 'Set center align',
            'justifyRight': 'Set right align',
            'justifyFull': 'Set full align',
            'insertUnorderedList': 'Toggle unordered list',
            'insertOrderedList': 'Toggle ordered list',
            'outdent': 'Outdent on current paragraph',
            'indent': 'Indent on current paragraph',
            'formatPara': 'Change current block\'s format as a paragraph(P tag)',
            'formatH1': 'Change current block\'s format as H1',
            'formatH2': 'Change current block\'s format as H2',
            'formatH3': 'Change current block\'s format as H3',
            'formatH4': 'Change current block\'s format as H4',
            'formatH5': 'Change current block\'s format as H5',
            'formatH6': 'Change current block\'s format as H6',
            'insertHorizontalRule': 'Insert horizontal rule',
            'linkDialog.show': 'Show Link Dialog'
        ***REMOVED***,
        history: ***REMOVED***
            undo: 'Undo',
            redo: 'Redo'
        ***REMOVED***,
        specialChar: ***REMOVED***
            specialChar: 'SPECIAL CHARACTERS',
            select: 'Select Special characters'
        ***REMOVED***
    ***REMOVED***
***REMOVED***);

var KEY_MAP = ***REMOVED***
    'BACKSPACE': 8,
    'TAB': 9,
    'ENTER': 13,
    'SPACE': 32,
    'DELETE': 46,
    // Arrow
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40,
    // Number: 0-9
    'NUM0': 48,
    'NUM1': 49,
    'NUM2': 50,
    'NUM3': 51,
    'NUM4': 52,
    'NUM5': 53,
    'NUM6': 54,
    'NUM7': 55,
    'NUM8': 56,
    // Alphabet: a-z
    'B': 66,
    'E': 69,
    'I': 73,
    'J': 74,
    'K': 75,
    'L': 76,
    'R': 82,
    'S': 83,
    'U': 85,
    'V': 86,
    'Y': 89,
    'Z': 90,
    'SLASH': 191,
    'LEFTBRACKET': 219,
    'BACKSLASH': 220,
    'RIGHTBRACKET': 221
***REMOVED***;
/**
 * @class core.key
 *
 * Object for keycodes.
 *
 * @singleton
 * @alternateClassName key
 */
var key = ***REMOVED***
    /**
     * @method isEdit
     *
     * @param ***REMOVED***Number***REMOVED*** keyCode
     * @return ***REMOVED***Boolean***REMOVED***
     */
    isEdit: function (keyCode) ***REMOVED***
        return lists.contains([
            KEY_MAP.BACKSPACE,
            KEY_MAP.TAB,
            KEY_MAP.ENTER,
            KEY_MAP.SPACE,
            KEY_MAP.DELETE
        ], keyCode);
    ***REMOVED***,
    /**
     * @method isMove
     *
     * @param ***REMOVED***Number***REMOVED*** keyCode
     * @return ***REMOVED***Boolean***REMOVED***
     */
    isMove: function (keyCode) ***REMOVED***
        return lists.contains([
            KEY_MAP.LEFT,
            KEY_MAP.UP,
            KEY_MAP.RIGHT,
            KEY_MAP.DOWN
        ], keyCode);
    ***REMOVED***,
    /**
     * @property ***REMOVED***Object***REMOVED*** nameFromCode
     * @property ***REMOVED***String***REMOVED*** nameFromCode.8 "BACKSPACE"
     */
    nameFromCode: func.invertObject(KEY_MAP),
    code: KEY_MAP
***REMOVED***;

/**
 * return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
 *
 * @param ***REMOVED***TextRange***REMOVED*** textRange
 * @param ***REMOVED***Boolean***REMOVED*** isStart
 * @return ***REMOVED***BoundaryPoint***REMOVED***
 *
 * @see http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
 */
function textRangeToPoint(textRange, isStart) ***REMOVED***
    var container = textRange.parentElement();
    var offset;
    var tester = document.body.createTextRange();
    var prevContainer;
    var childNodes = lists.from(container.childNodes);
    for (offset = 0; offset < childNodes.length; offset++) ***REMOVED***
        if (dom.isText(childNodes[offset])) ***REMOVED***
            continue;
        ***REMOVED***
        tester.moveToElementText(childNodes[offset]);
        if (tester.compareEndPoints('StartToStart', textRange) >= 0) ***REMOVED***
            break;
        ***REMOVED***
        prevContainer = childNodes[offset];
    ***REMOVED***
    if (offset !== 0 && dom.isText(childNodes[offset - 1])) ***REMOVED***
        var textRangeStart = document.body.createTextRange();
        var curTextNode = null;
        textRangeStart.moveToElementText(prevContainer || container);
        textRangeStart.collapse(!prevContainer);
        curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;
        var pointTester = textRange.duplicate();
        pointTester.setEndPoint('StartToStart', textRangeStart);
        var textCount = pointTester.text.replace(/[\r\n]/g, '').length;
        while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) ***REMOVED***
            textCount -= curTextNode.nodeValue.length;
            curTextNode = curTextNode.nextSibling;
        ***REMOVED***
        // [workaround] enforce IE to re-reference curTextNode, hack
        var dummy = curTextNode.nodeValue; // eslint-disable-line
        if (isStart && curTextNode.nextSibling && dom.isText(curTextNode.nextSibling) &&
            textCount === curTextNode.nodeValue.length) ***REMOVED***
            textCount -= curTextNode.nodeValue.length;
            curTextNode = curTextNode.nextSibling;
        ***REMOVED***
        container = curTextNode;
        offset = textCount;
    ***REMOVED***
    return ***REMOVED***
        cont: container,
        offset: offset
    ***REMOVED***;
***REMOVED***
/**
 * return TextRange from boundary point (inspired by google closure-library)
 * @param ***REMOVED***BoundaryPoint***REMOVED*** point
 * @return ***REMOVED***TextRange***REMOVED***
 */
function pointToTextRange(point) ***REMOVED***
    var textRangeInfo = function (container, offset) ***REMOVED***
        var node, isCollapseToStart;
        if (dom.isText(container)) ***REMOVED***
            var prevTextNodes = dom.listPrev(container, func.not(dom.isText));
            var prevContainer = lists.last(prevTextNodes).previousSibling;
            node = prevContainer || container.parentNode;
            offset += lists.sum(lists.tail(prevTextNodes), dom.nodeLength);
            isCollapseToStart = !prevContainer;
        ***REMOVED***
        else ***REMOVED***
            node = container.childNodes[offset] || container;
            if (dom.isText(node)) ***REMOVED***
                return textRangeInfo(node, 0);
            ***REMOVED***
            offset = 0;
            isCollapseToStart = false;
        ***REMOVED***
        return ***REMOVED***
            node: node,
            collapseToStart: isCollapseToStart,
            offset: offset
        ***REMOVED***;
    ***REMOVED***;
    var textRange = document.body.createTextRange();
    var info = textRangeInfo(point.node, point.offset);
    textRange.moveToElementText(info.node);
    textRange.collapse(info.collapseToStart);
    textRange.moveStart('character', info.offset);
    return textRange;
***REMOVED***
/**
   * Wrapped Range
   *
   * @constructor
   * @param ***REMOVED***Node***REMOVED*** sc - start container
   * @param ***REMOVED***Number***REMOVED*** so - start offset
   * @param ***REMOVED***Node***REMOVED*** ec - end container
   * @param ***REMOVED***Number***REMOVED*** eo - end offset
   */
var WrappedRange = /** @class */ (function () ***REMOVED***
    function WrappedRange(sc, so, ec, eo) ***REMOVED***
        this.sc = sc;
        this.so = so;
        this.ec = ec;
        this.eo = eo;
        // isOnEditable: judge whether range is on editable or not
        this.isOnEditable = this.makeIsOn(dom.isEditable);
        // isOnList: judge whether range is on list node or not
        this.isOnList = this.makeIsOn(dom.isList);
        // isOnAnchor: judge whether range is on anchor node or not
        this.isOnAnchor = this.makeIsOn(dom.isAnchor);
        // isOnCell: judge whether range is on cell node or not
        this.isOnCell = this.makeIsOn(dom.isCell);
        // isOnData: judge whether range is on data node or not
        this.isOnData = this.makeIsOn(dom.isData);
    ***REMOVED***
    // nativeRange: get nativeRange from sc, so, ec, eo
    WrappedRange.prototype.nativeRange = function () ***REMOVED***
        if (env.isW3CRangeSupport) ***REMOVED***
            var w3cRange = document.createRange();
            w3cRange.setStart(this.sc, this.so);
            w3cRange.setEnd(this.ec, this.eo);
            return w3cRange;
        ***REMOVED***
        else ***REMOVED***
            var textRange = pointToTextRange(***REMOVED***
                node: this.sc,
                offset: this.so
            ***REMOVED***);
            textRange.setEndPoint('EndToEnd', pointToTextRange(***REMOVED***
                node: this.ec,
                offset: this.eo
            ***REMOVED***));
            return textRange;
        ***REMOVED***
    ***REMOVED***;
    WrappedRange.prototype.getPoints = function () ***REMOVED***
        return ***REMOVED***
            sc: this.sc,
            so: this.so,
            ec: this.ec,
            eo: this.eo
        ***REMOVED***;
    ***REMOVED***;
    WrappedRange.prototype.getStartPoint = function () ***REMOVED***
        return ***REMOVED***
            node: this.sc,
            offset: this.so
        ***REMOVED***;
    ***REMOVED***;
    WrappedRange.prototype.getEndPoint = function () ***REMOVED***
        return ***REMOVED***
            node: this.ec,
            offset: this.eo
        ***REMOVED***;
    ***REMOVED***;
    /**
     * select update visible range
     */
    WrappedRange.prototype.select = function () ***REMOVED***
        var nativeRng = this.nativeRange();
        if (env.isW3CRangeSupport) ***REMOVED***
            var selection = document.getSelection();
            if (selection.rangeCount > 0) ***REMOVED***
                selection.removeAllRanges();
            ***REMOVED***
            selection.addRange(nativeRng);
        ***REMOVED***
        else ***REMOVED***
            nativeRng.select();
        ***REMOVED***
        return this;
    ***REMOVED***;
    /**
     * Moves the scrollbar to start container(sc) of current range
     *
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    WrappedRange.prototype.scrollIntoView = function (container) ***REMOVED***
        var height = $$1(container).height();
        if (container.scrollTop + height < this.sc.offsetTop) ***REMOVED***
            container.scrollTop += Math.abs(container.scrollTop + height - this.sc.offsetTop);
        ***REMOVED***
        return this;
    ***REMOVED***;
    /**
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    WrappedRange.prototype.normalize = function () ***REMOVED***
        /**
         * @param ***REMOVED***BoundaryPoint***REMOVED*** point
         * @param ***REMOVED***Boolean***REMOVED*** isLeftToRight
         * @return ***REMOVED***BoundaryPoint***REMOVED***
         */
        var getVisiblePoint = function (point, isLeftToRight) ***REMOVED***
            if ((dom.isVisiblePoint(point) && !dom.isEdgePoint(point)) ||
                (dom.isVisiblePoint(point) && dom.isRightEdgePoint(point) && !isLeftToRight) ||
                (dom.isVisiblePoint(point) && dom.isLeftEdgePoint(point) && isLeftToRight) ||
                (dom.isVisiblePoint(point) && dom.isBlock(point.node) && dom.isEmpty(point.node))) ***REMOVED***
                return point;
            ***REMOVED***
            // point on block's edge
            var block = dom.ancestor(point.node, dom.isBlock);
            if (((dom.isLeftEdgePointOf(point, block) || dom.isVoid(dom.prevPoint(point).node)) && !isLeftToRight) ||
                ((dom.isRightEdgePointOf(point, block) || dom.isVoid(dom.nextPoint(point).node)) && isLeftToRight)) ***REMOVED***
                // returns point already on visible point
                if (dom.isVisiblePoint(point)) ***REMOVED***
                    return point;
                ***REMOVED***
                // reverse direction
                isLeftToRight = !isLeftToRight;
            ***REMOVED***
            var nextPoint = isLeftToRight ? dom.nextPointUntil(dom.nextPoint(point), dom.isVisiblePoint)
                : dom.prevPointUntil(dom.prevPoint(point), dom.isVisiblePoint);
            return nextPoint || point;
        ***REMOVED***;
        var endPoint = getVisiblePoint(this.getEndPoint(), false);
        var startPoint = this.isCollapsed() ? endPoint : getVisiblePoint(this.getStartPoint(), true);
        return new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
    ***REMOVED***;
    /**
     * returns matched nodes on range
     *
     * @param ***REMOVED***Function***REMOVED*** [pred] - predicate function
     * @param ***REMOVED***Object***REMOVED*** [options]
     * @param ***REMOVED***Boolean***REMOVED*** [options.includeAncestor]
     * @param ***REMOVED***Boolean***REMOVED*** [options.fullyContains]
     * @return ***REMOVED***Node[]***REMOVED***
     */
    WrappedRange.prototype.nodes = function (pred, options) ***REMOVED***
        pred = pred || func.ok;
        var includeAncestor = options && options.includeAncestor;
        var fullyContains = options && options.fullyContains;
        // TODO compare points and sort
        var startPoint = this.getStartPoint();
        var endPoint = this.getEndPoint();
        var nodes = [];
        var leftEdgeNodes = [];
        dom.walkPoint(startPoint, endPoint, function (point) ***REMOVED***
            if (dom.isEditable(point.node)) ***REMOVED***
                return;
            ***REMOVED***
            var node;
            if (fullyContains) ***REMOVED***
                if (dom.isLeftEdgePoint(point)) ***REMOVED***
                    leftEdgeNodes.push(point.node);
                ***REMOVED***
                if (dom.isRightEdgePoint(point) && lists.contains(leftEdgeNodes, point.node)) ***REMOVED***
                    node = point.node;
                ***REMOVED***
            ***REMOVED***
            else if (includeAncestor) ***REMOVED***
                node = dom.ancestor(point.node, pred);
            ***REMOVED***
            else ***REMOVED***
                node = point.node;
            ***REMOVED***
            if (node && pred(node)) ***REMOVED***
                nodes.push(node);
            ***REMOVED***
        ***REMOVED***, true);
        return lists.unique(nodes);
    ***REMOVED***;
    /**
     * returns commonAncestor of range
     * @return ***REMOVED***Element***REMOVED*** - commonAncestor
     */
    WrappedRange.prototype.commonAncestor = function () ***REMOVED***
        return dom.commonAncestor(this.sc, this.ec);
    ***REMOVED***;
    /**
     * returns expanded range by pred
     *
     * @param ***REMOVED***Function***REMOVED*** pred - predicate function
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    WrappedRange.prototype.expand = function (pred) ***REMOVED***
        var startAncestor = dom.ancestor(this.sc, pred);
        var endAncestor = dom.ancestor(this.ec, pred);
        if (!startAncestor && !endAncestor) ***REMOVED***
            return new WrappedRange(this.sc, this.so, this.ec, this.eo);
        ***REMOVED***
        var boundaryPoints = this.getPoints();
        if (startAncestor) ***REMOVED***
            boundaryPoints.sc = startAncestor;
            boundaryPoints.so = 0;
        ***REMOVED***
        if (endAncestor) ***REMOVED***
            boundaryPoints.ec = endAncestor;
            boundaryPoints.eo = dom.nodeLength(endAncestor);
        ***REMOVED***
        return new WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
    ***REMOVED***;
    /**
     * @param ***REMOVED***Boolean***REMOVED*** isCollapseToStart
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    WrappedRange.prototype.collapse = function (isCollapseToStart) ***REMOVED***
        if (isCollapseToStart) ***REMOVED***
            return new WrappedRange(this.sc, this.so, this.sc, this.so);
        ***REMOVED***
        else ***REMOVED***
            return new WrappedRange(this.ec, this.eo, this.ec, this.eo);
        ***REMOVED***
    ***REMOVED***;
    /**
     * splitText on range
     */
    WrappedRange.prototype.splitText = function () ***REMOVED***
        var isSameContainer = this.sc === this.ec;
        var boundaryPoints = this.getPoints();
        if (dom.isText(this.ec) && !dom.isEdgePoint(this.getEndPoint())) ***REMOVED***
            this.ec.splitText(this.eo);
        ***REMOVED***
        if (dom.isText(this.sc) && !dom.isEdgePoint(this.getStartPoint())) ***REMOVED***
            boundaryPoints.sc = this.sc.splitText(this.so);
            boundaryPoints.so = 0;
            if (isSameContainer) ***REMOVED***
                boundaryPoints.ec = boundaryPoints.sc;
                boundaryPoints.eo = this.eo - this.so;
            ***REMOVED***
        ***REMOVED***
        return new WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
    ***REMOVED***;
    /**
     * delete contents on range
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    WrappedRange.prototype.deleteContents = function () ***REMOVED***
        if (this.isCollapsed()) ***REMOVED***
            return this;
        ***REMOVED***
        var rng = this.splitText();
        var nodes = rng.nodes(null, ***REMOVED***
            fullyContains: true
        ***REMOVED***);
        // find new cursor point
        var point = dom.prevPointUntil(rng.getStartPoint(), function (point) ***REMOVED***
            return !lists.contains(nodes, point.node);
        ***REMOVED***);
        var emptyParents = [];
        $$1.each(nodes, function (idx, node) ***REMOVED***
            // find empty parents
            var parent = node.parentNode;
            if (point.node !== parent && dom.nodeLength(parent) === 1) ***REMOVED***
                emptyParents.push(parent);
            ***REMOVED***
            dom.remove(node, false);
        ***REMOVED***);
        // remove empty parents
        $$1.each(emptyParents, function (idx, node) ***REMOVED***
            dom.remove(node, false);
        ***REMOVED***);
        return new WrappedRange(point.node, point.offset, point.node, point.offset).normalize();
    ***REMOVED***;
    /**
     * makeIsOn: return isOn(pred) function
     */
    WrappedRange.prototype.makeIsOn = function (pred) ***REMOVED***
        return function () ***REMOVED***
            var ancestor = dom.ancestor(this.sc, pred);
            return !!ancestor && (ancestor === dom.ancestor(this.ec, pred));
        ***REMOVED***;
    ***REMOVED***;
    /**
     * @param ***REMOVED***Function***REMOVED*** pred
     * @return ***REMOVED***Boolean***REMOVED***
     */
    WrappedRange.prototype.isLeftEdgeOf = function (pred) ***REMOVED***
        if (!dom.isLeftEdgePoint(this.getStartPoint())) ***REMOVED***
            return false;
        ***REMOVED***
        var node = dom.ancestor(this.sc, pred);
        return node && dom.isLeftEdgeOf(this.sc, node);
    ***REMOVED***;
    /**
     * returns whether range was collapsed or not
     */
    WrappedRange.prototype.isCollapsed = function () ***REMOVED***
        return this.sc === this.ec && this.so === this.eo;
    ***REMOVED***;
    /**
     * wrap inline nodes which children of body with paragraph
     *
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    WrappedRange.prototype.wrapBodyInlineWithPara = function () ***REMOVED***
        if (dom.isBodyContainer(this.sc) && dom.isEmpty(this.sc)) ***REMOVED***
            this.sc.innerHTML = dom.emptyPara;
            return new WrappedRange(this.sc.firstChild, 0, this.sc.firstChild, 0);
        ***REMOVED***
        /**
         * [workaround] firefox often create range on not visible point. so normalize here.
         *  - firefox: |<p>text</p>|
         *  - chrome: <p>|text|</p>
         */
        var rng = this.normalize();
        if (dom.isParaInline(this.sc) || dom.isPara(this.sc)) ***REMOVED***
            return rng;
        ***REMOVED***
        // find inline top ancestor
        var topAncestor;
        if (dom.isInline(rng.sc)) ***REMOVED***
            var ancestors = dom.listAncestor(rng.sc, func.not(dom.isInline));
            topAncestor = lists.last(ancestors);
            if (!dom.isInline(topAncestor)) ***REMOVED***
                topAncestor = ancestors[ancestors.length - 2] || rng.sc.childNodes[rng.so];
            ***REMOVED***
        ***REMOVED***
        else ***REMOVED***
            topAncestor = rng.sc.childNodes[rng.so > 0 ? rng.so - 1 : 0];
        ***REMOVED***
        // siblings not in paragraph
        var inlineSiblings = dom.listPrev(topAncestor, dom.isParaInline).reverse();
        inlineSiblings = inlineSiblings.concat(dom.listNext(topAncestor.nextSibling, dom.isParaInline));
        // wrap with paragraph
        if (inlineSiblings.length) ***REMOVED***
            var para = dom.wrap(lists.head(inlineSiblings), 'p');
            dom.appendChildNodes(para, lists.tail(inlineSiblings));
        ***REMOVED***
        return this.normalize();
    ***REMOVED***;
    /**
     * insert node at current cursor
     *
     * @param ***REMOVED***Node***REMOVED*** node
     * @return ***REMOVED***Node***REMOVED***
     */
    WrappedRange.prototype.insertNode = function (node) ***REMOVED***
        var rng = this.wrapBodyInlineWithPara().deleteContents();
        var info = dom.splitPoint(rng.getStartPoint(), dom.isInline(node));
        if (info.rightNode) ***REMOVED***
            info.rightNode.parentNode.insertBefore(node, info.rightNode);
        ***REMOVED***
        else ***REMOVED***
            info.container.appendChild(node);
        ***REMOVED***
        return node;
    ***REMOVED***;
    /**
     * insert html at current cursor
     */
    WrappedRange.prototype.pasteHTML = function (markup) ***REMOVED***
        var contentsContainer = $$1('<div></div>').html(markup)[0];
        var childNodes = lists.from(contentsContainer.childNodes);
        var rng = this.wrapBodyInlineWithPara().deleteContents();
        return childNodes.reverse().map(function (childNode) ***REMOVED***
            return rng.insertNode(childNode);
        ***REMOVED***).reverse();
    ***REMOVED***;
    /**
     * returns text in range
     *
     * @return ***REMOVED***String***REMOVED***
     */
    WrappedRange.prototype.toString = function () ***REMOVED***
        var nativeRng = this.nativeRange();
        return env.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
    ***REMOVED***;
    /**
     * returns range for word before cursor
     *
     * @param ***REMOVED***Boolean***REMOVED*** [findAfter] - find after cursor, default: false
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    WrappedRange.prototype.getWordRange = function (findAfter) ***REMOVED***
        var endPoint = this.getEndPoint();
        if (!dom.isCharPoint(endPoint)) ***REMOVED***
            return this;
        ***REMOVED***
        var startPoint = dom.prevPointUntil(endPoint, function (point) ***REMOVED***
            return !dom.isCharPoint(point);
        ***REMOVED***);
        if (findAfter) ***REMOVED***
            endPoint = dom.nextPointUntil(endPoint, function (point) ***REMOVED***
                return !dom.isCharPoint(point);
            ***REMOVED***);
        ***REMOVED***
        return new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
    ***REMOVED***;
    /**
     * create offsetPath bookmark
     *
     * @param ***REMOVED***Node***REMOVED*** editable
     */
    WrappedRange.prototype.bookmark = function (editable) ***REMOVED***
        return ***REMOVED***
            s: ***REMOVED***
                path: dom.makeOffsetPath(editable, this.sc),
                offset: this.so
            ***REMOVED***,
            e: ***REMOVED***
                path: dom.makeOffsetPath(editable, this.ec),
                offset: this.eo
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***;
    /**
     * create offsetPath bookmark base on paragraph
     *
     * @param ***REMOVED***Node[]***REMOVED*** paras
     */
    WrappedRange.prototype.paraBookmark = function (paras) ***REMOVED***
        return ***REMOVED***
            s: ***REMOVED***
                path: lists.tail(dom.makeOffsetPath(lists.head(paras), this.sc)),
                offset: this.so
            ***REMOVED***,
            e: ***REMOVED***
                path: lists.tail(dom.makeOffsetPath(lists.last(paras), this.ec)),
                offset: this.eo
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***;
    /**
     * getClientRects
     * @return ***REMOVED***Rect[]***REMOVED***
     */
    WrappedRange.prototype.getClientRects = function () ***REMOVED***
        var nativeRng = this.nativeRange();
        return nativeRng.getClientRects();
    ***REMOVED***;
    return WrappedRange;
***REMOVED***());
/**
 * Data structure
 *  * BoundaryPoint: a point of dom tree
 *  * BoundaryPoints: two boundaryPoints corresponding to the start and the end of the Range
 *
 * See to http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Position
 */
var range = ***REMOVED***
    /**
     * create Range Object From arguments or Browser Selection
     *
     * @param ***REMOVED***Node***REMOVED*** sc - start container
     * @param ***REMOVED***Number***REMOVED*** so - start offset
     * @param ***REMOVED***Node***REMOVED*** ec - end container
     * @param ***REMOVED***Number***REMOVED*** eo - end offset
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    create: function (sc, so, ec, eo) ***REMOVED***
        if (arguments.length === 4) ***REMOVED***
            return new WrappedRange(sc, so, ec, eo);
        ***REMOVED***
        else if (arguments.length === 2) ***REMOVED***
            ec = sc;
            eo = so;
            return new WrappedRange(sc, so, ec, eo);
        ***REMOVED***
        else ***REMOVED***
            var wrappedRange = this.createFromSelection();
            if (!wrappedRange && arguments.length === 1) ***REMOVED***
                wrappedRange = this.createFromNode(arguments[0]);
                return wrappedRange.collapse(dom.emptyPara === arguments[0].innerHTML);
            ***REMOVED***
            return wrappedRange;
        ***REMOVED***
    ***REMOVED***,
    createFromSelection: function () ***REMOVED***
        var sc, so, ec, eo;
        if (env.isW3CRangeSupport) ***REMOVED***
            var selection = document.getSelection();
            if (!selection || selection.rangeCount === 0) ***REMOVED***
                return null;
            ***REMOVED***
            else if (dom.isBody(selection.anchorNode)) ***REMOVED***
                // Firefox: returns entire body as range on initialization.
                // We won't never need it.
                return null;
            ***REMOVED***
            var nativeRng = selection.getRangeAt(0);
            sc = nativeRng.startContainer;
            so = nativeRng.startOffset;
            ec = nativeRng.endContainer;
            eo = nativeRng.endOffset;
        ***REMOVED***
        else ***REMOVED***
            var textRange = document.selection.createRange();
            var textRangeEnd = textRange.duplicate();
            textRangeEnd.collapse(false);
            var textRangeStart = textRange;
            textRangeStart.collapse(true);
            var startPoint = textRangeToPoint(textRangeStart, true);
            var endPoint = textRangeToPoint(textRangeEnd, false);
            // same visible point case: range was collapsed.
            if (dom.isText(startPoint.node) && dom.isLeftEdgePoint(startPoint) &&
                dom.isTextNode(endPoint.node) && dom.isRightEdgePoint(endPoint) &&
                endPoint.node.nextSibling === startPoint.node) ***REMOVED***
                startPoint = endPoint;
            ***REMOVED***
            sc = startPoint.cont;
            so = startPoint.offset;
            ec = endPoint.cont;
            eo = endPoint.offset;
        ***REMOVED***
        return new WrappedRange(sc, so, ec, eo);
    ***REMOVED***,
    /**
     * @method
     *
     * create WrappedRange from node
     *
     * @param ***REMOVED***Node***REMOVED*** node
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    createFromNode: function (node) ***REMOVED***
        var sc = node;
        var so = 0;
        var ec = node;
        var eo = dom.nodeLength(ec);
        // browsers can't target a picture or void node
        if (dom.isVoid(sc)) ***REMOVED***
            so = dom.listPrev(sc).length - 1;
            sc = sc.parentNode;
        ***REMOVED***
        if (dom.isBR(ec)) ***REMOVED***
            eo = dom.listPrev(ec).length - 1;
            ec = ec.parentNode;
        ***REMOVED***
        else if (dom.isVoid(ec)) ***REMOVED***
            eo = dom.listPrev(ec).length;
            ec = ec.parentNode;
        ***REMOVED***
        return this.create(sc, so, ec, eo);
    ***REMOVED***,
    /**
     * create WrappedRange from node after position
     *
     * @param ***REMOVED***Node***REMOVED*** node
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    createFromNodeBefore: function (node) ***REMOVED***
        return this.createFromNode(node).collapse(true);
    ***REMOVED***,
    /**
     * create WrappedRange from node after position
     *
     * @param ***REMOVED***Node***REMOVED*** node
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    createFromNodeAfter: function (node) ***REMOVED***
        return this.createFromNode(node).collapse();
    ***REMOVED***,
    /**
     * @method
     *
     * create WrappedRange from bookmark
     *
     * @param ***REMOVED***Node***REMOVED*** editable
     * @param ***REMOVED***Object***REMOVED*** bookmark
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    createFromBookmark: function (editable, bookmark) ***REMOVED***
        var sc = dom.fromOffsetPath(editable, bookmark.s.path);
        var so = bookmark.s.offset;
        var ec = dom.fromOffsetPath(editable, bookmark.e.path);
        var eo = bookmark.e.offset;
        return new WrappedRange(sc, so, ec, eo);
    ***REMOVED***,
    /**
     * @method
     *
     * create WrappedRange from paraBookmark
     *
     * @param ***REMOVED***Object***REMOVED*** bookmark
     * @param ***REMOVED***Node[]***REMOVED*** paras
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    createFromParaBookmark: function (bookmark, paras) ***REMOVED***
        var so = bookmark.s.offset;
        var eo = bookmark.e.offset;
        var sc = dom.fromOffsetPath(lists.head(paras), bookmark.s.path);
        var ec = dom.fromOffsetPath(lists.last(paras), bookmark.e.path);
        return new WrappedRange(sc, so, ec, eo);
    ***REMOVED***
***REMOVED***;

/**
 * @method readFileAsDataURL
 *
 * read contents of file as representing URL
 *
 * @param ***REMOVED***File***REMOVED*** file
 * @return ***REMOVED***Promise***REMOVED*** - then: dataUrl
 */
function readFileAsDataURL(file) ***REMOVED***
    return $$1.Deferred(function (deferred) ***REMOVED***
        $$1.extend(new FileReader(), ***REMOVED***
            onload: function (e) ***REMOVED***
                var dataURL = e.target.result;
                deferred.resolve(dataURL);
            ***REMOVED***,
            onerror: function (err) ***REMOVED***
                deferred.reject(err);
            ***REMOVED***
        ***REMOVED***).readAsDataURL(file);
    ***REMOVED***).promise();
***REMOVED***
/**
 * @method createImage
 *
 * create `<image>` from url string
 *
 * @param ***REMOVED***String***REMOVED*** url
 * @return ***REMOVED***Promise***REMOVED*** - then: $image
 */
function createImage(url) ***REMOVED***
    return $$1.Deferred(function (deferred) ***REMOVED***
        var $img = $$1('<img>');
        $img.one('load', function () ***REMOVED***
            $img.off('error abort');
            deferred.resolve($img);
        ***REMOVED***).one('error abort', function () ***REMOVED***
            $img.off('load').detach();
            deferred.reject($img);
        ***REMOVED***).css(***REMOVED***
            display: 'none'
        ***REMOVED***).appendTo(document.body).attr('src', url);
    ***REMOVED***).promise();
***REMOVED***

var History = /** @class */ (function () ***REMOVED***
    function History($editable) ***REMOVED***
        this.stack = [];
        this.stackOffset = -1;
        this.$editable = $editable;
        this.editable = $editable[0];
    ***REMOVED***
    History.prototype.makeSnapshot = function () ***REMOVED***
        var rng = range.create(this.editable);
        var emptyBookmark = ***REMOVED*** s: ***REMOVED*** path: [], offset: 0 ***REMOVED***, e: ***REMOVED*** path: [], offset: 0 ***REMOVED*** ***REMOVED***;
        return ***REMOVED***
            contents: this.$editable.html(),
            bookmark: (rng ? rng.bookmark(this.editable) : emptyBookmark)
        ***REMOVED***;
    ***REMOVED***;
    History.prototype.applySnapshot = function (snapshot) ***REMOVED***
        if (snapshot.contents !== null) ***REMOVED***
            this.$editable.html(snapshot.contents);
        ***REMOVED***
        if (snapshot.bookmark !== null) ***REMOVED***
            range.createFromBookmark(this.editable, snapshot.bookmark).select();
        ***REMOVED***
    ***REMOVED***;
    /**
    * @method rewind
    * Rewinds the history stack back to the first snapshot taken.
    * Leaves the stack intact, so that "Redo" can still be used.
    */
    History.prototype.rewind = function () ***REMOVED***
        // Create snap shot if not yet recorded
        if (this.$editable.html() !== this.stack[this.stackOffset].contents) ***REMOVED***
            this.recordUndo();
        ***REMOVED***
        // Return to the first available snapshot.
        this.stackOffset = 0;
        // Apply that snapshot.
        this.applySnapshot(this.stack[this.stackOffset]);
    ***REMOVED***;
    /**
    * @method reset
    * Resets the history stack completely; reverting to an empty editor.
    */
    History.prototype.reset = function () ***REMOVED***
        // Clear the stack.
        this.stack = [];
        // Restore stackOffset to its original value.
        this.stackOffset = -1;
        // Clear the editable area.
        this.$editable.html('');
        // Record our first snapshot (of nothing).
        this.recordUndo();
    ***REMOVED***;
    /**
     * undo
     */
    History.prototype.undo = function () ***REMOVED***
        // Create snap shot if not yet recorded
        if (this.$editable.html() !== this.stack[this.stackOffset].contents) ***REMOVED***
            this.recordUndo();
        ***REMOVED***
        if (this.stackOffset > 0) ***REMOVED***
            this.stackOffset--;
            this.applySnapshot(this.stack[this.stackOffset]);
        ***REMOVED***
    ***REMOVED***;
    /**
     * redo
     */
    History.prototype.redo = function () ***REMOVED***
        if (this.stack.length - 1 > this.stackOffset) ***REMOVED***
            this.stackOffset++;
            this.applySnapshot(this.stack[this.stackOffset]);
        ***REMOVED***
    ***REMOVED***;
    /**
     * recorded undo
     */
    History.prototype.recordUndo = function () ***REMOVED***
        this.stackOffset++;
        // Wash out stack after stackOffset
        if (this.stack.length > this.stackOffset) ***REMOVED***
            this.stack = this.stack.slice(0, this.stackOffset);
        ***REMOVED***
        // Create new snapshot and push it to the end
        this.stack.push(this.makeSnapshot());
    ***REMOVED***;
    return History;
***REMOVED***());

var Style = /** @class */ (function () ***REMOVED***
    function Style() ***REMOVED***
    ***REMOVED***
    /**
     * @method jQueryCSS
     *
     * [workaround] for old jQuery
     * passing an array of style properties to .css()
     * will result in an object of property-value pairs.
     * (compability with version < 1.9)
     *
     * @private
     * @param  ***REMOVED***jQuery***REMOVED*** $obj
     * @param  ***REMOVED***Array***REMOVED*** propertyNames - An array of one or more CSS properties.
     * @return ***REMOVED***Object***REMOVED***
     */
    Style.prototype.jQueryCSS = function ($obj, propertyNames) ***REMOVED***
        if (env.jqueryVersion < 1.9) ***REMOVED***
            var result_1 = ***REMOVED******REMOVED***;
            $$1.each(propertyNames, function (idx, propertyName) ***REMOVED***
                result_1[propertyName] = $obj.css(propertyName);
            ***REMOVED***);
            return result_1;
        ***REMOVED***
        return $obj.css(propertyNames);
    ***REMOVED***;
    /**
     * returns style object from node
     *
     * @param ***REMOVED***jQuery***REMOVED*** $node
     * @return ***REMOVED***Object***REMOVED***
     */
    Style.prototype.fromNode = function ($node) ***REMOVED***
        var properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
        var styleInfo = this.jQueryCSS($node, properties) || ***REMOVED******REMOVED***;
        styleInfo['font-size'] = parseInt(styleInfo['font-size'], 10);
        return styleInfo;
    ***REMOVED***;
    /**
     * paragraph level style
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @param ***REMOVED***Object***REMOVED*** styleInfo
     */
    Style.prototype.stylePara = function (rng, styleInfo) ***REMOVED***
        $$1.each(rng.nodes(dom.isPara, ***REMOVED***
            includeAncestor: true
        ***REMOVED***), function (idx, para) ***REMOVED***
            $$1(para).css(styleInfo);
        ***REMOVED***);
    ***REMOVED***;
    /**
     * insert and returns styleNodes on range.
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @param ***REMOVED***Object***REMOVED*** [options] - options for styleNodes
     * @param ***REMOVED***String***REMOVED*** [options.nodeName] - default: `SPAN`
     * @param ***REMOVED***Boolean***REMOVED*** [options.expandClosestSibling] - default: `false`
     * @param ***REMOVED***Boolean***REMOVED*** [options.onlyPartialContains] - default: `false`
     * @return ***REMOVED***Node[]***REMOVED***
     */
    Style.prototype.styleNodes = function (rng, options) ***REMOVED***
        rng = rng.splitText();
        var nodeName = (options && options.nodeName) || 'SPAN';
        var expandClosestSibling = !!(options && options.expandClosestSibling);
        var onlyPartialContains = !!(options && options.onlyPartialContains);
        if (rng.isCollapsed()) ***REMOVED***
            return [rng.insertNode(dom.create(nodeName))];
        ***REMOVED***
        var pred = dom.makePredByNodeName(nodeName);
        var nodes = rng.nodes(dom.isText, ***REMOVED***
            fullyContains: true
        ***REMOVED***).map(function (text) ***REMOVED***
            return dom.singleChildAncestor(text, pred) || dom.wrap(text, nodeName);
        ***REMOVED***);
        if (expandClosestSibling) ***REMOVED***
            if (onlyPartialContains) ***REMOVED***
                var nodesInRange_1 = rng.nodes();
                // compose with partial contains predication
                pred = func.and(pred, function (node) ***REMOVED***
                    return lists.contains(nodesInRange_1, node);
                ***REMOVED***);
            ***REMOVED***
            return nodes.map(function (node) ***REMOVED***
                var siblings = dom.withClosestSiblings(node, pred);
                var head = lists.head(siblings);
                var tails = lists.tail(siblings);
                $$1.each(tails, function (idx, elem) ***REMOVED***
                    dom.appendChildNodes(head, elem.childNodes);
                    dom.remove(elem);
                ***REMOVED***);
                return lists.head(siblings);
            ***REMOVED***);
        ***REMOVED***
        else ***REMOVED***
            return nodes;
        ***REMOVED***
    ***REMOVED***;
    /**
     * get current style on cursor
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @return ***REMOVED***Object***REMOVED*** - object contains style properties.
     */
    Style.prototype.current = function (rng) ***REMOVED***
        var $cont = $$1(!dom.isElement(rng.sc) ? rng.sc.parentNode : rng.sc);
        var styleInfo = this.fromNode($cont);
        // document.queryCommandState for toggle state
        // [workaround] prevent Firefox nsresult: "0x80004005 (NS_ERROR_FAILURE)"
        try ***REMOVED***
            styleInfo = $$1.extend(styleInfo, ***REMOVED***
                'font-bold': document.queryCommandState('bold') ? 'bold' : 'normal',
                'font-italic': document.queryCommandState('italic') ? 'italic' : 'normal',
                'font-underline': document.queryCommandState('underline') ? 'underline' : 'normal',
                'font-subscript': document.queryCommandState('subscript') ? 'subscript' : 'normal',
                'font-superscript': document.queryCommandState('superscript') ? 'superscript' : 'normal',
                'font-strikethrough': document.queryCommandState('strikethrough') ? 'strikethrough' : 'normal',
                'font-family': document.queryCommandValue('fontname') || styleInfo['font-family']
            ***REMOVED***);
        ***REMOVED***
        catch (e) ***REMOVED*** ***REMOVED***
        // list-style-type to list-style(unordered, ordered)
        if (!rng.isOnList()) ***REMOVED***
            styleInfo['list-style'] = 'none';
        ***REMOVED***
        else ***REMOVED***
            var orderedTypes = ['circle', 'disc', 'disc-leading-zero', 'square'];
            var isUnordered = $$1.inArray(styleInfo['list-style-type'], orderedTypes) > -1;
            styleInfo['list-style'] = isUnordered ? 'unordered' : 'ordered';
        ***REMOVED***
        var para = dom.ancestor(rng.sc, dom.isPara);
        if (para && para.style['line-height']) ***REMOVED***
            styleInfo['line-height'] = para.style.lineHeight;
        ***REMOVED***
        else ***REMOVED***
            var lineHeight = parseInt(styleInfo['line-height'], 10) / parseInt(styleInfo['font-size'], 10);
            styleInfo['line-height'] = lineHeight.toFixed(1);
        ***REMOVED***
        styleInfo.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
        styleInfo.ancestors = dom.listAncestor(rng.sc, dom.isEditable);
        styleInfo.range = rng;
        return styleInfo;
    ***REMOVED***;
    return Style;
***REMOVED***());

var Bullet = /** @class */ (function () ***REMOVED***
    function Bullet() ***REMOVED***
    ***REMOVED***
    /**
     * toggle ordered list
     */
    Bullet.prototype.insertOrderedList = function (editable) ***REMOVED***
        this.toggleList('OL', editable);
    ***REMOVED***;
    /**
     * toggle unordered list
     */
    Bullet.prototype.insertUnorderedList = function (editable) ***REMOVED***
        this.toggleList('UL', editable);
    ***REMOVED***;
    /**
     * indent
     */
    Bullet.prototype.indent = function (editable) ***REMOVED***
        var _this = this;
        var rng = range.create(editable).wrapBodyInlineWithPara();
        var paras = rng.nodes(dom.isPara, ***REMOVED*** includeAncestor: true ***REMOVED***);
        var clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
        $$1.each(clustereds, function (idx, paras) ***REMOVED***
            var head = lists.head(paras);
            if (dom.isLi(head)) ***REMOVED***
                _this.wrapList(paras, head.parentNode.nodeName);
            ***REMOVED***
            else ***REMOVED***
                $$1.each(paras, function (idx, para) ***REMOVED***
                    $$1(para).css('marginLeft', function (idx, val) ***REMOVED***
                        return (parseInt(val, 10) || 0) + 25;
                    ***REMOVED***);
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***);
        rng.select();
    ***REMOVED***;
    /**
     * outdent
     */
    Bullet.prototype.outdent = function (editable) ***REMOVED***
        var _this = this;
        var rng = range.create(editable).wrapBodyInlineWithPara();
        var paras = rng.nodes(dom.isPara, ***REMOVED*** includeAncestor: true ***REMOVED***);
        var clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
        $$1.each(clustereds, function (idx, paras) ***REMOVED***
            var head = lists.head(paras);
            if (dom.isLi(head)) ***REMOVED***
                _this.releaseList([paras]);
            ***REMOVED***
            else ***REMOVED***
                $$1.each(paras, function (idx, para) ***REMOVED***
                    $$1(para).css('marginLeft', function (idx, val) ***REMOVED***
                        val = (parseInt(val, 10) || 0);
                        return val > 25 ? val - 25 : '';
                    ***REMOVED***);
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***);
        rng.select();
    ***REMOVED***;
    /**
     * toggle list
     *
     * @param ***REMOVED***String***REMOVED*** listName - OL or UL
     */
    Bullet.prototype.toggleList = function (listName, editable) ***REMOVED***
        var _this = this;
        var rng = range.create(editable).wrapBodyInlineWithPara();
        var paras = rng.nodes(dom.isPara, ***REMOVED*** includeAncestor: true ***REMOVED***);
        var bookmark = rng.paraBookmark(paras);
        var clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
        // paragraph to list
        if (lists.find(paras, dom.isPurePara)) ***REMOVED***
            var wrappedParas_1 = [];
            $$1.each(clustereds, function (idx, paras) ***REMOVED***
                wrappedParas_1 = wrappedParas_1.concat(_this.wrapList(paras, listName));
            ***REMOVED***);
            paras = wrappedParas_1;
            // list to paragraph or change list style
        ***REMOVED***
        else ***REMOVED***
            var diffLists = rng.nodes(dom.isList, ***REMOVED***
                includeAncestor: true
            ***REMOVED***).filter(function (listNode) ***REMOVED***
                return !$$1.nodeName(listNode, listName);
            ***REMOVED***);
            if (diffLists.length) ***REMOVED***
                $$1.each(diffLists, function (idx, listNode) ***REMOVED***
                    dom.replace(listNode, listName);
                ***REMOVED***);
            ***REMOVED***
            else ***REMOVED***
                paras = this.releaseList(clustereds, true);
            ***REMOVED***
        ***REMOVED***
        range.createFromParaBookmark(bookmark, paras).select();
    ***REMOVED***;
    /**
     * @param ***REMOVED***Node[]***REMOVED*** paras
     * @param ***REMOVED***String***REMOVED*** listName
     * @return ***REMOVED***Node[]***REMOVED***
     */
    Bullet.prototype.wrapList = function (paras, listName) ***REMOVED***
        var head = lists.head(paras);
        var last = lists.last(paras);
        var prevList = dom.isList(head.previousSibling) && head.previousSibling;
        var nextList = dom.isList(last.nextSibling) && last.nextSibling;
        var listNode = prevList || dom.insertAfter(dom.create(listName || 'UL'), last);
        // P to LI
        paras = paras.map(function (para) ***REMOVED***
            return dom.isPurePara(para) ? dom.replace(para, 'LI') : para;
        ***REMOVED***);
        // append to list(<ul>, <ol>)
        dom.appendChildNodes(listNode, paras);
        if (nextList) ***REMOVED***
            dom.appendChildNodes(listNode, lists.from(nextList.childNodes));
            dom.remove(nextList);
        ***REMOVED***
        return paras;
    ***REMOVED***;
    /**
     * @method releaseList
     *
     * @param ***REMOVED***Array[]***REMOVED*** clustereds
     * @param ***REMOVED***Boolean***REMOVED*** isEscapseToBody
     * @return ***REMOVED***Node[]***REMOVED***
     */
    Bullet.prototype.releaseList = function (clustereds, isEscapseToBody) ***REMOVED***
        var releasedParas = [];
        $$1.each(clustereds, function (idx, paras) ***REMOVED***
            var head = lists.head(paras);
            var last = lists.last(paras);
            var headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) : head.parentNode;
            var lastList = headList.childNodes.length > 1 ? dom.splitTree(headList, ***REMOVED***
                node: last.parentNode,
                offset: dom.position(last) + 1
            ***REMOVED***, ***REMOVED***
                isSkipPaddingBlankHTML: true
            ***REMOVED***) : null;
            var middleList = dom.splitTree(headList, ***REMOVED***
                node: head.parentNode,
                offset: dom.position(head)
            ***REMOVED***, ***REMOVED***
                isSkipPaddingBlankHTML: true
            ***REMOVED***);
            paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi)
                : lists.from(middleList.childNodes).filter(dom.isLi);
            // LI to P
            if (isEscapseToBody || !dom.isList(headList.parentNode)) ***REMOVED***
                paras = paras.map(function (para) ***REMOVED***
                    return dom.replace(para, 'P');
                ***REMOVED***);
            ***REMOVED***
            $$1.each(lists.from(paras).reverse(), function (idx, para) ***REMOVED***
                dom.insertAfter(para, headList);
            ***REMOVED***);
            // remove empty lists
            var rootLists = lists.compact([headList, middleList, lastList]);
            $$1.each(rootLists, function (idx, rootList) ***REMOVED***
                var listNodes = [rootList].concat(dom.listDescendant(rootList, dom.isList));
                $$1.each(listNodes.reverse(), function (idx, listNode) ***REMOVED***
                    if (!dom.nodeLength(listNode)) ***REMOVED***
                        dom.remove(listNode, true);
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***);
            releasedParas = releasedParas.concat(paras);
        ***REMOVED***);
        return releasedParas;
    ***REMOVED***;
    return Bullet;
***REMOVED***());

/**
 * @class editing.Typing
 *
 * Typing
 *
 */
var Typing = /** @class */ (function () ***REMOVED***
    function Typing() ***REMOVED***
        // a Bullet instance to toggle lists off
        this.bullet = new Bullet();
    ***REMOVED***
    /**
     * insert tab
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @param ***REMOVED***Number***REMOVED*** tabsize
     */
    Typing.prototype.insertTab = function (rng, tabsize) ***REMOVED***
        var tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
        rng = rng.deleteContents();
        rng.insertNode(tab, true);
        rng = range.create(tab, tabsize);
        rng.select();
    ***REMOVED***;
    /**
     * insert paragraph
     */
    Typing.prototype.insertParagraph = function (editable) ***REMOVED***
        var rng = range.create(editable);
        // deleteContents on range.
        rng = rng.deleteContents();
        // Wrap range if it needs to be wrapped by paragraph
        rng = rng.wrapBodyInlineWithPara();
        // finding paragraph
        var splitRoot = dom.ancestor(rng.sc, dom.isPara);
        var nextPara;
        // on paragraph: split paragraph
        if (splitRoot) ***REMOVED***
            // if it is an empty line with li
            if (dom.isEmpty(splitRoot) && dom.isLi(splitRoot)) ***REMOVED***
                // toogle UL/OL and escape
                this.bullet.toggleList(splitRoot.parentNode.nodeName);
                return;
                // if it is an empty line with para on blockquote
            ***REMOVED***
            else if (dom.isEmpty(splitRoot) && dom.isPara(splitRoot) && dom.isBlockquote(splitRoot.parentNode)) ***REMOVED***
                // escape blockquote
                dom.insertAfter(splitRoot, splitRoot.parentNode);
                nextPara = splitRoot;
                // if new line has content (not a line break)
            ***REMOVED***
            else ***REMOVED***
                nextPara = dom.splitTree(splitRoot, rng.getStartPoint());
                var emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
                emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));
                $$1.each(emptyAnchors, function (idx, anchor) ***REMOVED***
                    dom.remove(anchor);
                ***REMOVED***);
                // replace empty heading, pre or custom-made styleTag with P tag
                if ((dom.isHeading(nextPara) || dom.isPre(nextPara) || dom.isCustomStyleTag(nextPara)) && dom.isEmpty(nextPara)) ***REMOVED***
                    nextPara = dom.replace(nextPara, 'p');
                ***REMOVED***
            ***REMOVED***
            // no paragraph: insert empty paragraph
        ***REMOVED***
        else ***REMOVED***
            var next = rng.sc.childNodes[rng.so];
            nextPara = $$1(dom.emptyPara)[0];
            if (next) ***REMOVED***
                rng.sc.insertBefore(nextPara, next);
            ***REMOVED***
            else ***REMOVED***
                rng.sc.appendChild(nextPara);
            ***REMOVED***
        ***REMOVED***
        range.create(nextPara, 0).normalize().select().scrollIntoView(editable);
    ***REMOVED***;
    return Typing;
***REMOVED***());

/**
 * @class Create a virtual table to create what actions to do in change.
 * @param ***REMOVED***object***REMOVED*** startPoint Cell selected to apply change.
 * @param ***REMOVED***enum***REMOVED*** where  Where change will be applied Row or Col. Use enum: TableResultAction.where
 * @param ***REMOVED***enum***REMOVED*** action Action to be applied. Use enum: TableResultAction.requestAction
 * @param ***REMOVED***object***REMOVED*** domTable Dom element of table to make changes.
 */
var TableResultAction = function (startPoint, where, action, domTable) ***REMOVED***
    var _startPoint = ***REMOVED*** 'colPos': 0, 'rowPos': 0 ***REMOVED***;
    var _virtualTable = [];
    var _actionCellList = [];
    /// ///////////////////////////////////////////
    // Private functions
    /// ///////////////////////////////////////////
    /**
     * Set the startPoint of action.
     */
    function setStartPoint() ***REMOVED***
        if (!startPoint || !startPoint.tagName || (startPoint.tagName.toLowerCase() !== 'td' && startPoint.tagName.toLowerCase() !== 'th')) ***REMOVED***
            console.error('Impossible to identify start Cell point.', startPoint);
            return;
        ***REMOVED***
        _startPoint.colPos = startPoint.cellIndex;
        if (!startPoint.parentElement || !startPoint.parentElement.tagName || startPoint.parentElement.tagName.toLowerCase() !== 'tr') ***REMOVED***
            console.error('Impossible to identify start Row point.', startPoint);
            return;
        ***REMOVED***
        _startPoint.rowPos = startPoint.parentElement.rowIndex;
    ***REMOVED***
    /**
     * Define virtual table position info object.
     *
     * @param ***REMOVED***int***REMOVED*** rowIndex Index position in line of virtual table.
     * @param ***REMOVED***int***REMOVED*** cellIndex Index position in column of virtual table.
     * @param ***REMOVED***object***REMOVED*** baseRow Row affected by this position.
     * @param ***REMOVED***object***REMOVED*** baseCell Cell affected by this position.
     * @param ***REMOVED***bool***REMOVED*** isSpan Inform if it is an span cell/row.
     */
    function setVirtualTablePosition(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) ***REMOVED***
        var objPosition = ***REMOVED***
            'baseRow': baseRow,
            'baseCell': baseCell,
            'isRowSpan': isRowSpan,
            'isColSpan': isColSpan,
            'isVirtual': isVirtualCell
        ***REMOVED***;
        if (!_virtualTable[rowIndex]) ***REMOVED***
            _virtualTable[rowIndex] = [];
        ***REMOVED***
        _virtualTable[rowIndex][cellIndex] = objPosition;
    ***REMOVED***
    /**
     * Create action cell object.
     *
     * @param ***REMOVED***object***REMOVED*** virtualTableCellObj Object of specific position on virtual table.
     * @param ***REMOVED***enum***REMOVED*** resultAction Action to be applied in that item.
     */
    function getActionCell(virtualTableCellObj, resultAction, virtualRowPosition, virtualColPosition) ***REMOVED***
        return ***REMOVED***
            'baseCell': virtualTableCellObj.baseCell,
            'action': resultAction,
            'virtualTable': ***REMOVED***
                'rowIndex': virtualRowPosition,
                'cellIndex': virtualColPosition
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    /**
     * Recover free index of row to append Cell.
     *
     * @param ***REMOVED***int***REMOVED*** rowIndex Index of row to find free space.
     * @param ***REMOVED***int***REMOVED*** cellIndex Index of cell to find free space in table.
     */
    function recoverCellIndex(rowIndex, cellIndex) ***REMOVED***
        if (!_virtualTable[rowIndex]) ***REMOVED***
            return cellIndex;
        ***REMOVED***
        if (!_virtualTable[rowIndex][cellIndex]) ***REMOVED***
            return cellIndex;
        ***REMOVED***
        var newCellIndex = cellIndex;
        while (_virtualTable[rowIndex][newCellIndex]) ***REMOVED***
            newCellIndex++;
            if (!_virtualTable[rowIndex][newCellIndex]) ***REMOVED***
                return newCellIndex;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
    /**
     * Recover info about row and cell and add information to virtual table.
     *
     * @param ***REMOVED***object***REMOVED*** row Row to recover information.
     * @param ***REMOVED***object***REMOVED*** cell Cell to recover information.
     */
    function addCellInfoToVirtual(row, cell) ***REMOVED***
        var cellIndex = recoverCellIndex(row.rowIndex, cell.cellIndex);
        var cellHasColspan = (cell.colSpan > 1);
        var cellHasRowspan = (cell.rowSpan > 1);
        var isThisSelectedCell = (row.rowIndex === _startPoint.rowPos && cell.cellIndex === _startPoint.colPos);
        setVirtualTablePosition(row.rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false);
        // Add span rows to virtual Table.
        var rowspanNumber = cell.attributes.rowSpan ? parseInt(cell.attributes.rowSpan.value, 10) : 0;
        if (rowspanNumber > 1) ***REMOVED***
            for (var rp = 1; rp < rowspanNumber; rp++) ***REMOVED***
                var rowspanIndex = row.rowIndex + rp;
                adjustStartPoint(rowspanIndex, cellIndex, cell, isThisSelectedCell);
                setVirtualTablePosition(rowspanIndex, cellIndex, row, cell, true, cellHasColspan, true);
            ***REMOVED***
        ***REMOVED***
        // Add span cols to virtual table.
        var colspanNumber = cell.attributes.colSpan ? parseInt(cell.attributes.colSpan.value, 10) : 0;
        if (colspanNumber > 1) ***REMOVED***
            for (var cp = 1; cp < colspanNumber; cp++) ***REMOVED***
                var cellspanIndex = recoverCellIndex(row.rowIndex, (cellIndex + cp));
                adjustStartPoint(row.rowIndex, cellspanIndex, cell, isThisSelectedCell);
                setVirtualTablePosition(row.rowIndex, cellspanIndex, row, cell, cellHasRowspan, true, true);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
    /**
     * Process validation and adjust of start point if needed
     *
     * @param ***REMOVED***int***REMOVED*** rowIndex
     * @param ***REMOVED***int***REMOVED*** cellIndex
     * @param ***REMOVED***object***REMOVED*** cell
     * @param ***REMOVED***bool***REMOVED*** isSelectedCell
     */
    function adjustStartPoint(rowIndex, cellIndex, cell, isSelectedCell) ***REMOVED***
        if (rowIndex === _startPoint.rowPos && _startPoint.colPos >= cell.cellIndex && cell.cellIndex <= cellIndex && !isSelectedCell) ***REMOVED***
            _startPoint.colPos++;
        ***REMOVED***
    ***REMOVED***
    /**
     * Create virtual table of cells with all cells, including span cells.
     */
    function createVirtualTable() ***REMOVED***
        var rows = domTable.rows;
        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) ***REMOVED***
            var cells = rows[rowIndex].cells;
            for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) ***REMOVED***
                addCellInfoToVirtual(rows[rowIndex], cells[cellIndex]);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
    /**
     * Get action to be applied on the cell.
     *
     * @param ***REMOVED***object***REMOVED*** cell virtual table cell to apply action
     */
    function getDeleteResultActionToCell(cell) ***REMOVED***
        switch (where) ***REMOVED***
            case TableResultAction.where.Column:
                if (cell.isColSpan) ***REMOVED***
                    return TableResultAction.resultAction.SubtractSpanCount;
                ***REMOVED***
                break;
            case TableResultAction.where.Row:
                if (!cell.isVirtual && cell.isRowSpan) ***REMOVED***
                    return TableResultAction.resultAction.AddCell;
                ***REMOVED***
                else if (cell.isRowSpan) ***REMOVED***
                    return TableResultAction.resultAction.SubtractSpanCount;
                ***REMOVED***
                break;
        ***REMOVED***
        return TableResultAction.resultAction.RemoveCell;
    ***REMOVED***
    /**
     * Get action to be applied on the cell.
     *
     * @param ***REMOVED***object***REMOVED*** cell virtual table cell to apply action
     */
    function getAddResultActionToCell(cell) ***REMOVED***
        switch (where) ***REMOVED***
            case TableResultAction.where.Column:
                if (cell.isColSpan) ***REMOVED***
                    return TableResultAction.resultAction.SumSpanCount;
                ***REMOVED***
                else if (cell.isRowSpan && cell.isVirtual) ***REMOVED***
                    return TableResultAction.resultAction.Ignore;
                ***REMOVED***
                break;
            case TableResultAction.where.Row:
                if (cell.isRowSpan) ***REMOVED***
                    return TableResultAction.resultAction.SumSpanCount;
                ***REMOVED***
                else if (cell.isColSpan && cell.isVirtual) ***REMOVED***
                    return TableResultAction.resultAction.Ignore;
                ***REMOVED***
                break;
        ***REMOVED***
        return TableResultAction.resultAction.AddCell;
    ***REMOVED***
    function init() ***REMOVED***
        setStartPoint();
        createVirtualTable();
    ***REMOVED***
    /// ///////////////////////////////////////////
    // Public functions
    /// ///////////////////////////////////////////
    /**
     * Recover array os what to do in table.
     */
    this.getActionList = function () ***REMOVED***
        var fixedRow = (where === TableResultAction.where.Row) ? _startPoint.rowPos : -1;
        var fixedCol = (where === TableResultAction.where.Column) ? _startPoint.colPos : -1;
        var actualPosition = 0;
        var canContinue = true;
        while (canContinue) ***REMOVED***
            var rowPosition = (fixedRow >= 0) ? fixedRow : actualPosition;
            var colPosition = (fixedCol >= 0) ? fixedCol : actualPosition;
            var row = _virtualTable[rowPosition];
            if (!row) ***REMOVED***
                canContinue = false;
                return _actionCellList;
            ***REMOVED***
            var cell = row[colPosition];
            if (!cell) ***REMOVED***
                canContinue = false;
                return _actionCellList;
            ***REMOVED***
            // Define action to be applied in this cell
            var resultAction = TableResultAction.resultAction.Ignore;
            switch (action) ***REMOVED***
                case TableResultAction.requestAction.Add:
                    resultAction = getAddResultActionToCell(cell);
                    break;
                case TableResultAction.requestAction.Delete:
                    resultAction = getDeleteResultActionToCell(cell);
                    break;
            ***REMOVED***
            _actionCellList.push(getActionCell(cell, resultAction, rowPosition, colPosition));
            actualPosition++;
        ***REMOVED***
        return _actionCellList;
    ***REMOVED***;
    init();
***REMOVED***;
/**
*
* Where action occours enum.
*/
TableResultAction.where = ***REMOVED*** 'Row': 0, 'Column': 1 ***REMOVED***;
/**
*
* Requested action to apply enum.
*/
TableResultAction.requestAction = ***REMOVED*** 'Add': 0, 'Delete': 1 ***REMOVED***;
/**
*
* Result action to be executed enum.
*/
TableResultAction.resultAction = ***REMOVED*** 'Ignore': 0, 'SubtractSpanCount': 1, 'RemoveCell': 2, 'AddCell': 3, 'SumSpanCount': 4 ***REMOVED***;
/**
 *
 * @class editing.Table
 *
 * Table
 *
 */
var Table = /** @class */ (function () ***REMOVED***
    function Table() ***REMOVED***
    ***REMOVED***
    /**
     * handle tab key
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @param ***REMOVED***Boolean***REMOVED*** isShift
     */
    Table.prototype.tab = function (rng, isShift) ***REMOVED***
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var table = dom.ancestor(cell, dom.isTable);
        var cells = dom.listDescendant(table, dom.isCell);
        var nextCell = lists[isShift ? 'prev' : 'next'](cells, cell);
        if (nextCell) ***REMOVED***
            range.create(nextCell, 0).select();
        ***REMOVED***
    ***REMOVED***;
    /**
     * Add a new row
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @param ***REMOVED***String***REMOVED*** position (top/bottom)
     * @return ***REMOVED***Node***REMOVED***
     */
    Table.prototype.addRow = function (rng, position) ***REMOVED***
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var currentTr = $$1(cell).closest('tr');
        var trAttributes = this.recoverAttributes(currentTr);
        var html = $$1('<tr' + trAttributes + '></tr>');
        var vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Add, $$1(currentTr).closest('table')[0]);
        var actions = vTable.getActionList();
        for (var idCell = 0; idCell < actions.length; idCell++) ***REMOVED***
            var currentCell = actions[idCell];
            var tdAttributes = this.recoverAttributes(currentCell.baseCell);
            switch (currentCell.action) ***REMOVED***
                case TableResultAction.resultAction.AddCell:
                    html.append('<td' + tdAttributes + '>' + dom.blank + '</td>');
                    break;
                case TableResultAction.resultAction.SumSpanCount:
                    if (position === 'top') ***REMOVED***
                        var baseCellTr = currentCell.baseCell.parent;
                        var isTopFromRowSpan = (!baseCellTr ? 0 : currentCell.baseCell.closest('tr').rowIndex) <= currentTr[0].rowIndex;
                        if (isTopFromRowSpan) ***REMOVED***
                            var newTd = $$1('<div></div>').append($$1('<td' + tdAttributes + '>' + dom.blank + '</td>').removeAttr('rowspan')).html();
                            html.append(newTd);
                            break;
                        ***REMOVED***
                    ***REMOVED***
                    var rowspanNumber = parseInt(currentCell.baseCell.rowSpan, 10);
                    rowspanNumber++;
                    currentCell.baseCell.setAttribute('rowSpan', rowspanNumber);
                    break;
            ***REMOVED***
        ***REMOVED***
        if (position === 'top') ***REMOVED***
            currentTr.before(html);
        ***REMOVED***
        else ***REMOVED***
            var cellHasRowspan = (cell.rowSpan > 1);
            if (cellHasRowspan) ***REMOVED***
                var lastTrIndex = currentTr[0].rowIndex + (cell.rowSpan - 2);
                $$1($$1(currentTr).parent().find('tr')[lastTrIndex]).after($$1(html));
                return;
            ***REMOVED***
            currentTr.after(html);
        ***REMOVED***
    ***REMOVED***;
    /**
     * Add a new col
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @param ***REMOVED***String***REMOVED*** position (left/right)
     * @return ***REMOVED***Node***REMOVED***
     */
    Table.prototype.addCol = function (rng, position) ***REMOVED***
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var row = $$1(cell).closest('tr');
        var rowsGroup = $$1(row).siblings();
        rowsGroup.push(row);
        var vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Add, $$1(row).closest('table')[0]);
        var actions = vTable.getActionList();
        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) ***REMOVED***
            var currentCell = actions[actionIndex];
            var tdAttributes = this.recoverAttributes(currentCell.baseCell);
            switch (currentCell.action) ***REMOVED***
                case TableResultAction.resultAction.AddCell:
                    if (position === 'right') ***REMOVED***
                        $$1(currentCell.baseCell).after('<td' + tdAttributes + '>' + dom.blank + '</td>');
                    ***REMOVED***
                    else ***REMOVED***
                        $$1(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
                    ***REMOVED***
                    break;
                case TableResultAction.resultAction.SumSpanCount:
                    if (position === 'right') ***REMOVED***
                        var colspanNumber = parseInt(currentCell.baseCell.colSpan, 10);
                        colspanNumber++;
                        currentCell.baseCell.setAttribute('colSpan', colspanNumber);
                    ***REMOVED***
                    else ***REMOVED***
                        $$1(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
                    ***REMOVED***
                    break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
    /*
    * Copy attributes from element.
    *
    * @param ***REMOVED***object***REMOVED*** Element to recover attributes.
    * @return ***REMOVED***string***REMOVED*** Copied string elements.
    */
    Table.prototype.recoverAttributes = function (el) ***REMOVED***
        var resultStr = '';
        if (!el) ***REMOVED***
            return resultStr;
        ***REMOVED***
        var attrList = el.attributes || [];
        for (var i = 0; i < attrList.length; i++) ***REMOVED***
            if (attrList[i].name.toLowerCase() === 'id') ***REMOVED***
                continue;
            ***REMOVED***
            if (attrList[i].specified) ***REMOVED***
                resultStr += ' ' + attrList[i].name + '=\'' + attrList[i].value + '\'';
            ***REMOVED***
        ***REMOVED***
        return resultStr;
    ***REMOVED***;
    /**
     * Delete current row
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @return ***REMOVED***Node***REMOVED***
     */
    Table.prototype.deleteRow = function (rng) ***REMOVED***
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var row = $$1(cell).closest('tr');
        var cellPos = row.children('td, th').index($$1(cell));
        var rowPos = row[0].rowIndex;
        var vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Delete, $$1(row).closest('table')[0]);
        var actions = vTable.getActionList();
        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) ***REMOVED***
            if (!actions[actionIndex]) ***REMOVED***
                continue;
            ***REMOVED***
            var baseCell = actions[actionIndex].baseCell;
            var virtualPosition = actions[actionIndex].virtualTable;
            var hasRowspan = (baseCell.rowSpan && baseCell.rowSpan > 1);
            var rowspanNumber = (hasRowspan) ? parseInt(baseCell.rowSpan, 10) : 0;
            switch (actions[actionIndex].action) ***REMOVED***
                case TableResultAction.resultAction.Ignore:
                    continue;
                case TableResultAction.resultAction.AddCell:
                    var nextRow = row.next('tr')[0];
                    if (!nextRow) ***REMOVED***
                        continue;
                    ***REMOVED***
                    var cloneRow = row[0].cells[cellPos];
                    if (hasRowspan) ***REMOVED***
                        if (rowspanNumber > 2) ***REMOVED***
                            rowspanNumber--;
                            nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                            nextRow.cells[cellPos].setAttribute('rowSpan', rowspanNumber);
                            nextRow.cells[cellPos].innerHTML = '';
                        ***REMOVED***
                        else if (rowspanNumber === 2) ***REMOVED***
                            nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                            nextRow.cells[cellPos].removeAttribute('rowSpan');
                            nextRow.cells[cellPos].innerHTML = '';
                        ***REMOVED***
                    ***REMOVED***
                    continue;
                case TableResultAction.resultAction.SubtractSpanCount:
                    if (hasRowspan) ***REMOVED***
                        if (rowspanNumber > 2) ***REMOVED***
                            rowspanNumber--;
                            baseCell.setAttribute('rowSpan', rowspanNumber);
                            if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) ***REMOVED***
                                baseCell.innerHTML = '';
                            ***REMOVED***
                        ***REMOVED***
                        else if (rowspanNumber === 2) ***REMOVED***
                            baseCell.removeAttribute('rowSpan');
                            if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) ***REMOVED***
                                baseCell.innerHTML = '';
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                    continue;
                case TableResultAction.resultAction.RemoveCell:
                    // Do not need remove cell because row will be deleted.
                    continue;
            ***REMOVED***
        ***REMOVED***
        row.remove();
    ***REMOVED***;
    /**
     * Delete current col
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @return ***REMOVED***Node***REMOVED***
     */
    Table.prototype.deleteCol = function (rng) ***REMOVED***
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        var row = $$1(cell).closest('tr');
        var cellPos = row.children('td, th').index($$1(cell));
        var vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Delete, $$1(row).closest('table')[0]);
        var actions = vTable.getActionList();
        for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) ***REMOVED***
            if (!actions[actionIndex]) ***REMOVED***
                continue;
            ***REMOVED***
            switch (actions[actionIndex].action) ***REMOVED***
                case TableResultAction.resultAction.Ignore:
                    continue;
                case TableResultAction.resultAction.SubtractSpanCount:
                    var baseCell = actions[actionIndex].baseCell;
                    var hasColspan = (baseCell.colSpan && baseCell.colSpan > 1);
                    if (hasColspan) ***REMOVED***
                        var colspanNumber = (baseCell.colSpan) ? parseInt(baseCell.colSpan, 10) : 0;
                        if (colspanNumber > 2) ***REMOVED***
                            colspanNumber--;
                            baseCell.setAttribute('colSpan', colspanNumber);
                            if (baseCell.cellIndex === cellPos) ***REMOVED***
                                baseCell.innerHTML = '';
                            ***REMOVED***
                        ***REMOVED***
                        else if (colspanNumber === 2) ***REMOVED***
                            baseCell.removeAttribute('colSpan');
                            if (baseCell.cellIndex === cellPos) ***REMOVED***
                                baseCell.innerHTML = '';
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                    continue;
                case TableResultAction.resultAction.RemoveCell:
                    dom.remove(actions[actionIndex].baseCell, true);
                    continue;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
    /**
     * create empty table element
     *
     * @param ***REMOVED***Number***REMOVED*** rowCount
     * @param ***REMOVED***Number***REMOVED*** colCount
     * @return ***REMOVED***Node***REMOVED***
     */
    Table.prototype.createTable = function (colCount, rowCount, options) ***REMOVED***
        var tds = [];
        var tdHTML;
        for (var idxCol = 0; idxCol < colCount; idxCol++) ***REMOVED***
            tds.push('<td>' + dom.blank + '</td>');
        ***REMOVED***
        tdHTML = tds.join('');
        var trs = [];
        var trHTML;
        for (var idxRow = 0; idxRow < rowCount; idxRow++) ***REMOVED***
            trs.push('<tr>' + tdHTML + '</tr>');
        ***REMOVED***
        trHTML = trs.join('');
        var $table = $$1('<table>' + trHTML + '</table>');
        if (options && options.tableClassName) ***REMOVED***
            $table.addClass(options.tableClassName);
        ***REMOVED***
        return $table[0];
    ***REMOVED***;
    /**
     * Delete current table
     *
     * @param ***REMOVED***WrappedRange***REMOVED*** rng
     * @return ***REMOVED***Node***REMOVED***
     */
    Table.prototype.deleteTable = function (rng) ***REMOVED***
        var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
        $$1(cell).closest('table').remove();
    ***REMOVED***;
    return Table;
***REMOVED***());

var KEY_BOGUS = 'bogus';
/**
 * @class Editor
 */
var Editor = /** @class */ (function () ***REMOVED***
    function Editor(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.$note = context.layoutInfo.note;
        this.$editor = context.layoutInfo.editor;
        this.$editable = context.layoutInfo.editable;
        this.options = context.options;
        this.lang = this.options.langInfo;
        this.editable = this.$editable[0];
        this.lastRange = null;
        this.style = new Style();
        this.table = new Table();
        this.typing = new Typing();
        this.bullet = new Bullet();
        this.history = new History(this.$editable);
        this.context.memo('help.undo', this.lang.help.undo);
        this.context.memo('help.redo', this.lang.help.redo);
        this.context.memo('help.tab', this.lang.help.tab);
        this.context.memo('help.untab', this.lang.help.untab);
        this.context.memo('help.insertParagraph', this.lang.help.insertParagraph);
        this.context.memo('help.insertOrderedList', this.lang.help.insertOrderedList);
        this.context.memo('help.insertUnorderedList', this.lang.help.insertUnorderedList);
        this.context.memo('help.indent', this.lang.help.indent);
        this.context.memo('help.outdent', this.lang.help.outdent);
        this.context.memo('help.formatPara', this.lang.help.formatPara);
        this.context.memo('help.insertHorizontalRule', this.lang.help.insertHorizontalRule);
        this.context.memo('help.fontName', this.lang.help.fontName);
        // native commands(with execCommand), generate function for execCommand
        var commands = [
            'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
            'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
            'formatBlock', 'removeFormat', 'backColor'
        ];
        for (var idx = 0, len = commands.length; idx < len; idx++) ***REMOVED***
            this[commands[idx]] = (function (sCmd) ***REMOVED***
                return function (value) ***REMOVED***
                    _this.beforeCommand();
                    document.execCommand(sCmd, false, value);
                    _this.afterCommand(true);
                ***REMOVED***;
            ***REMOVED***)(commands[idx]);
            this.context.memo('help.' + commands[idx], this.lang.help[commands[idx]]);
        ***REMOVED***
        this.fontName = this.wrapCommand(function (value) ***REMOVED***
            return _this.fontStyling('font-family', "\'" + value + "\'");
        ***REMOVED***);
        this.fontSize = this.wrapCommand(function (value) ***REMOVED***
            return _this.fontStyling('font-size', value + 'px');
        ***REMOVED***);
        for (var idx = 1; idx <= 6; idx++) ***REMOVED***
            this['formatH' + idx] = (function (idx) ***REMOVED***
                return function () ***REMOVED***
                    _this.formatBlock('H' + idx);
                ***REMOVED***;
            ***REMOVED***)(idx);
            this.context.memo('help.formatH' + idx, this.lang.help['formatH' + idx]);
        ***REMOVED***
        
        this.insertParagraph = this.wrapCommand(function () ***REMOVED***
            _this.typing.insertParagraph(_this.editable);
        ***REMOVED***);
        this.insertOrderedList = this.wrapCommand(function () ***REMOVED***
            _this.bullet.insertOrderedList(_this.editable);
        ***REMOVED***);
        this.insertUnorderedList = this.wrapCommand(function () ***REMOVED***
            _this.bullet.insertUnorderedList(_this.editable);
        ***REMOVED***);
        this.indent = this.wrapCommand(function () ***REMOVED***
            _this.bullet.indent(_this.editable);
        ***REMOVED***);
        this.outdent = this.wrapCommand(function () ***REMOVED***
            _this.bullet.outdent(_this.editable);
        ***REMOVED***);
        /**
         * insertNode
         * insert node
         * @param ***REMOVED***Node***REMOVED*** node
         */
        this.insertNode = this.wrapCommand(function (node) ***REMOVED***
            if (_this.isLimited($$1(node).text().length)) ***REMOVED***
                return;
            ***REMOVED***
            var rng = _this.createRange();
            rng.insertNode(node);
            range.createFromNodeAfter(node).select();
        ***REMOVED***);
        /**
         * insert text
         * @param ***REMOVED***String***REMOVED*** text
         */
        this.insertText = this.wrapCommand(function (text) ***REMOVED***
            if (_this.isLimited(text.length)) ***REMOVED***
                return;
            ***REMOVED***
            var rng = _this.createRange();
            var textNode = rng.insertNode(dom.createText(text));
            range.create(textNode, dom.nodeLength(textNode)).select();
        ***REMOVED***);
        /**
         * paste HTML
         * @param ***REMOVED***String***REMOVED*** markup
         */
        this.pasteHTML = this.wrapCommand(function (markup) ***REMOVED***
            if (_this.isLimited(markup.length)) ***REMOVED***
                return;
            ***REMOVED***
            var contents = _this.createRange().pasteHTML(markup);
            range.createFromNodeAfter(lists.last(contents)).select();
        ***REMOVED***);
        /**
         * formatBlock
         *
         * @param ***REMOVED***String***REMOVED*** tagName
         */
        this.formatBlock = this.wrapCommand(function (tagName, $target) ***REMOVED***
            var onApplyCustomStyle = _this.options.callbacks.onApplyCustomStyle;
            if (onApplyCustomStyle) ***REMOVED***
                onApplyCustomStyle.call(_this, $target, _this.context, _this.onFormatBlock);
            ***REMOVED***
            else ***REMOVED***
                _this.onFormatBlock(tagName, $target);
            ***REMOVED***
        ***REMOVED***);
        /**
         * insert horizontal rule
         */
        this.insertHorizontalRule = this.wrapCommand(function () ***REMOVED***
            var hrNode = _this.createRange().insertNode(dom.create('HR'));
            if (hrNode.nextSibling) ***REMOVED***
                range.create(hrNode.nextSibling, 0).normalize().select();
            ***REMOVED***
        ***REMOVED***);
        /**
         * lineHeight
         * @param ***REMOVED***String***REMOVED*** value
         */
        this.lineHeight = this.wrapCommand(function (value) ***REMOVED***
            _this.style.stylePara(_this.createRange(), ***REMOVED***
                lineHeight: value
            ***REMOVED***);
        ***REMOVED***);
        /**
         * create link (command)
         *
         * @param ***REMOVED***Object***REMOVED*** linkInfo
         */
        this.createLink = this.wrapCommand(function (linkInfo) ***REMOVED***
            var linkUrl = linkInfo.url;
            var linkText = linkInfo.text;
            var isNewWindow = linkInfo.isNewWindow;
            var rng = linkInfo.range || _this.createRange();
            var isTextChanged = rng.toString() !== linkText;
            // handle spaced urls from input
            if (typeof linkUrl === 'string') ***REMOVED***
                linkUrl = linkUrl.trim();
            ***REMOVED***
            if (_this.options.onCreateLink) ***REMOVED***
                linkUrl = _this.options.onCreateLink(linkUrl);
            ***REMOVED***
            else ***REMOVED***
                // if url doesn't match an URL schema, set http:// as default
                linkUrl = /^[A-Za-z][A-Za-z0-9+-.]*\:[\/\/]?/.test(linkUrl)
                    ? linkUrl : 'http://' + linkUrl;
            ***REMOVED***
            var anchors = [];
            if (isTextChanged) ***REMOVED***
                rng = rng.deleteContents();
                var anchor = rng.insertNode($$1('<A>' + linkText + '</A>')[0]);
                anchors.push(anchor);
            ***REMOVED***
            else ***REMOVED***
                anchors = _this.style.styleNodes(rng, ***REMOVED***
                    nodeName: 'A',
                    expandClosestSibling: true,
                    onlyPartialContains: true
                ***REMOVED***);
            ***REMOVED***
            $$1.each(anchors, function (idx, anchor) ***REMOVED***
                $$1(anchor).attr('href', linkUrl);
                if (isNewWindow) ***REMOVED***
                    $$1(anchor).attr('target', '_blank');
                ***REMOVED***
                else ***REMOVED***
                    $$1(anchor).removeAttr('target');
                ***REMOVED***
            ***REMOVED***);
            var startRange = range.createFromNodeBefore(lists.head(anchors));
            var startPoint = startRange.getStartPoint();
            var endRange = range.createFromNodeAfter(lists.last(anchors));
            var endPoint = endRange.getEndPoint();
            range.create(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset).select();
        ***REMOVED***);
        /**
         * setting color
         *
         * @param ***REMOVED***Object***REMOVED*** sObjColor  color code
         * @param ***REMOVED***String***REMOVED*** sObjColor.foreColor foreground color
         * @param ***REMOVED***String***REMOVED*** sObjColor.backColor background color
         */
        this.color = this.wrapCommand(function (colorInfo) ***REMOVED***
            var foreColor = colorInfo.foreColor;
            var backColor = colorInfo.backColor;
            if (foreColor) ***REMOVED***
                document.execCommand('foreColor', false, foreColor);
            ***REMOVED***
            if (backColor) ***REMOVED***
                document.execCommand('backColor', false, backColor);
            ***REMOVED***
        ***REMOVED***);
        /**
         * Set foreground color
         *
         * @param ***REMOVED***String***REMOVED*** colorCode foreground color code
         */
        this.foreColor = this.wrapCommand(function (colorInfo) ***REMOVED***
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('foreColor', false, colorInfo);
        ***REMOVED***);
        /**
         * insert Table
         *
         * @param ***REMOVED***String***REMOVED*** dimension of table (ex : "5x5")
         */
        this.insertTable = this.wrapCommand(function (dim) ***REMOVED***
            var dimension = dim.split('x');
            var rng = _this.createRange().deleteContents();
            rng.insertNode(_this.table.createTable(dimension[0], dimension[1], _this.options));
        ***REMOVED***);
        /**
         * remove media object and Figure Elements if media object is img with Figure.
         */
        this.removeMedia = this.wrapCommand(function () ***REMOVED***
            var $target = $$1(_this.restoreTarget()).parent();
            if ($target.parent('figure').length) ***REMOVED***
                $target.parent('figure').remove();
            ***REMOVED***
            else ***REMOVED***
                $target = $$1(_this.restoreTarget()).detach();
            ***REMOVED***
            _this.context.triggerEvent('media.delete', $target, _this.$editable);
        ***REMOVED***);
        /**
         * float me
         *
         * @param ***REMOVED***String***REMOVED*** value
         */
        this.floatMe = this.wrapCommand(function (value) ***REMOVED***
            var $target = $$1(_this.restoreTarget());
            $target.toggleClass('note-float-left', value === 'left');
            $target.toggleClass('note-float-right', value === 'right');
            $target.css('float', value);
        ***REMOVED***);
        /**
         * resize overlay element
         * @param ***REMOVED***String***REMOVED*** value
         */
        this.resize = this.wrapCommand(function (value) ***REMOVED***
            var $target = $$1(_this.restoreTarget());
            $target.css(***REMOVED***
                width: value * 100 + '%',
                height: ''
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
    Editor.prototype.initialize = function () ***REMOVED***
        var _this = this;
        // bind custom events
        this.$editable.on('keydown', function (event) ***REMOVED***
            if (event.keyCode === key.code.ENTER) ***REMOVED***
                _this.context.triggerEvent('enter', event);
            ***REMOVED***
            _this.context.triggerEvent('keydown', event);
            if (!event.isDefaultPrevented()) ***REMOVED***
                if (_this.options.shortcuts) ***REMOVED***
                    _this.handleKeyMap(event);
                ***REMOVED***
                else ***REMOVED***
                    _this.preventDefaultEditableShortCuts(event);
                ***REMOVED***
            ***REMOVED***
            if (_this.isLimited(1, event)) ***REMOVED***
                return false;
            ***REMOVED***
        ***REMOVED***).on('keyup', function (event) ***REMOVED***
            _this.context.triggerEvent('keyup', event);
        ***REMOVED***).on('focus', function (event) ***REMOVED***
            _this.context.triggerEvent('focus', event);
        ***REMOVED***).on('blur', function (event) ***REMOVED***
            _this.context.triggerEvent('blur', event);
        ***REMOVED***).on('mousedown', function (event) ***REMOVED***
            _this.context.triggerEvent('mousedown', event);
        ***REMOVED***).on('mouseup', function (event) ***REMOVED***
            _this.context.triggerEvent('mouseup', event);
        ***REMOVED***).on('scroll', function (event) ***REMOVED***
            _this.context.triggerEvent('scroll', event);
        ***REMOVED***).on('paste', function (event) ***REMOVED***
            _this.context.triggerEvent('paste', event);
        ***REMOVED***);
        // init content before set event
        this.$editable.html(dom.html(this.$note) || dom.emptyPara);
        this.$editable.on(env.inputEventName, func.debounce(function () ***REMOVED***
            _this.context.triggerEvent('change', _this.$editable.html());
        ***REMOVED***, 100));
        this.$editor.on('focusin', function (event) ***REMOVED***
            _this.context.triggerEvent('focusin', event);
        ***REMOVED***).on('focusout', function (event) ***REMOVED***
            _this.context.triggerEvent('focusout', event);
        ***REMOVED***);
        if (!this.options.airMode) ***REMOVED***
            if (this.options.width) ***REMOVED***
                this.$editor.outerWidth(this.options.width);
            ***REMOVED***
            if (this.options.height) ***REMOVED***
                this.$editable.outerHeight(this.options.height);
            ***REMOVED***
            if (this.options.maxHeight) ***REMOVED***
                this.$editable.css('max-height', this.options.maxHeight);
            ***REMOVED***
            if (this.options.minHeight) ***REMOVED***
                this.$editable.css('min-height', this.options.minHeight);
            ***REMOVED***
        ***REMOVED***
        this.history.recordUndo();
    ***REMOVED***;
    Editor.prototype.destroy = function () ***REMOVED***
        this.$editable.off();
    ***REMOVED***;
    Editor.prototype.handleKeyMap = function (event) ***REMOVED***
        var keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
        var keys = [];
        if (event.metaKey) ***REMOVED***
            keys.push('CMD');
        ***REMOVED***
        if (event.ctrlKey && !event.altKey) ***REMOVED***
            keys.push('CTRL');
        ***REMOVED***
        if (event.shiftKey) ***REMOVED***
            keys.push('SHIFT');
        ***REMOVED***
        var keyName = key.nameFromCode[event.keyCode];
        if (keyName) ***REMOVED***
            keys.push(keyName);
        ***REMOVED***
        var eventName = keyMap[keys.join('+')];
        if (eventName) ***REMOVED***
            if (this.context.invoke(eventName) !== false) ***REMOVED***
                event.preventDefault();
            ***REMOVED***
        ***REMOVED***
        else if (key.isEdit(event.keyCode)) ***REMOVED***
            this.afterCommand();
        ***REMOVED***
    ***REMOVED***;
    Editor.prototype.preventDefaultEditableShortCuts = function (event) ***REMOVED***
        // B(Bold, 66) / I(Italic, 73) / U(Underline, 85)
        if ((event.ctrlKey || event.metaKey) &&
            lists.contains([66, 73, 85], event.keyCode)) ***REMOVED***
            event.preventDefault();
        ***REMOVED***
    ***REMOVED***;
    Editor.prototype.isLimited = function (pad, event) ***REMOVED***
        pad = pad || 0;
        if (typeof event !== 'undefined') ***REMOVED***
            if (key.isMove(event.keyCode) ||
                (event.ctrlKey || event.metaKey) ||
                lists.contains([key.code.BACKSPACE, key.code.DELETE], event.keyCode)) ***REMOVED***
                return false;
            ***REMOVED***
        ***REMOVED***
        if (this.options.maxTextLength > 0) ***REMOVED***
            if ((this.$editable.text().length + pad) >= this.options.maxTextLength) ***REMOVED***
                return true;
            ***REMOVED***
        ***REMOVED***
        return false;
    ***REMOVED***;
    /**
     * create range
     * @return ***REMOVED***WrappedRange***REMOVED***
     */
    Editor.prototype.createRange = function () ***REMOVED***
        this.focus();
        return range.create(this.editable);
    ***REMOVED***;
    /**
     * saveRange
     *
     * save current range
     *
     * @param ***REMOVED***Boolean***REMOVED*** [thenCollapse=false]
     */
    Editor.prototype.saveRange = function (thenCollapse) ***REMOVED***
        this.lastRange = this.createRange();
        if (thenCollapse) ***REMOVED***
            this.lastRange.collapse().select();
        ***REMOVED***
    ***REMOVED***;
    /**
     * restoreRange
     *
     * restore lately range
     */
    Editor.prototype.restoreRange = function () ***REMOVED***
        if (this.lastRange) ***REMOVED***
            this.lastRange.select();
            this.focus();
        ***REMOVED***
    ***REMOVED***;
    Editor.prototype.saveTarget = function (node) ***REMOVED***
        this.$editable.data('target', node);
    ***REMOVED***;
    Editor.prototype.clearTarget = function () ***REMOVED***
        this.$editable.removeData('target');
    ***REMOVED***;
    Editor.prototype.restoreTarget = function () ***REMOVED***
        return this.$editable.data('target');
    ***REMOVED***;
    /**
     * currentStyle
     *
     * current style
     * @return ***REMOVED***Object|Boolean***REMOVED*** unfocus
     */
    Editor.prototype.currentStyle = function () ***REMOVED***
        var rng = range.create();
        if (rng) ***REMOVED***
            rng = rng.normalize();
        ***REMOVED***
        return rng ? this.style.current(rng) : this.style.fromNode(this.$editable);
    ***REMOVED***;
    /**
     * style from node
     *
     * @param ***REMOVED***jQuery***REMOVED*** $node
     * @return ***REMOVED***Object***REMOVED***
     */
    Editor.prototype.styleFromNode = function ($node) ***REMOVED***
        return this.style.fromNode($node);
    ***REMOVED***;
    /**
     * undo
     */
    Editor.prototype.undo = function () ***REMOVED***
        this.context.triggerEvent('before.command', this.$editable.html());
        this.history.undo();
        this.context.triggerEvent('change', this.$editable.html());
    ***REMOVED***;
    /**
     * redo
     */
    Editor.prototype.redo = function () ***REMOVED***
        this.context.triggerEvent('before.command', this.$editable.html());
        this.history.redo();
        this.context.triggerEvent('change', this.$editable.html());
    ***REMOVED***;
    /**
     * before command
     */
    Editor.prototype.beforeCommand = function () ***REMOVED***
        this.context.triggerEvent('before.command', this.$editable.html());
        // keep focus on editable before command execution
        this.focus();
    ***REMOVED***;
    /**
     * after command
     * @param ***REMOVED***Boolean***REMOVED*** isPreventTrigger
     */
    Editor.prototype.afterCommand = function (isPreventTrigger) ***REMOVED***
        this.history.recordUndo();
        if (!isPreventTrigger) ***REMOVED***
            this.context.triggerEvent('change', this.$editable.html());
        ***REMOVED***
    ***REMOVED***;
    /**
     * handle tab key
     */
    Editor.prototype.tab = function () ***REMOVED***
        var rng = this.createRange();
        if (rng.isCollapsed() && rng.isOnCell()) ***REMOVED***
            this.table.tab(rng);
        ***REMOVED***
        else ***REMOVED***
            if (this.options.tabSize === 0) ***REMOVED***
                return false;
            ***REMOVED***
            if (!this.isLimited(this.options.tabSize)) ***REMOVED***
                this.beforeCommand();
                this.typing.insertTab(rng, this.options.tabSize);
                this.afterCommand();
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
    /**
     * handle shift+tab key
     */
    Editor.prototype.untab = function () ***REMOVED***
        var rng = this.createRange();
        if (rng.isCollapsed() && rng.isOnCell()) ***REMOVED***
            this.table.tab(rng, true);
        ***REMOVED***
        else ***REMOVED***
            if (this.options.tabSize === 0) ***REMOVED***
                return false;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
    /**
     * run given function between beforeCommand and afterCommand
     */
    Editor.prototype.wrapCommand = function (fn) ***REMOVED***
        var _this = this;
        return function () ***REMOVED***
            _this.beforeCommand();
            fn.apply(_this, arguments);
            _this.afterCommand();
        ***REMOVED***;
    ***REMOVED***;
    /**
     * insert image
     *
     * @param ***REMOVED***String***REMOVED*** src
     * @param ***REMOVED***String|Function***REMOVED*** param
     * @return ***REMOVED***Promise***REMOVED***
     */
    Editor.prototype.insertImage = function (src, param) ***REMOVED***
        var _this = this;
        return createImage(src, param).then(function ($image) ***REMOVED***
            _this.beforeCommand();
            if (typeof param === 'function') ***REMOVED***
                param($image);
            ***REMOVED***
            else ***REMOVED***
                if (typeof param === 'string') ***REMOVED***
                    $image.attr('data-filename', param);
                ***REMOVED***
                $image.css('width', Math.min(_this.$editable.width(), $image.width()));
            ***REMOVED***
            $image.show();
            range.create(_this.editable).insertNode($image[0]);
            range.createFromNodeAfter($image[0]).select();
            _this.afterCommand();
        ***REMOVED***).fail(function (e) ***REMOVED***
            _this.context.triggerEvent('image.upload.error', e);
        ***REMOVED***);
    ***REMOVED***;
    /**
     * insertImages
     * @param ***REMOVED***File[]***REMOVED*** files
     */
    Editor.prototype.insertImages = function (files) ***REMOVED***
        var _this = this;
        $$1.each(files, function (idx, file) ***REMOVED***
            var filename = file.name;
            if (_this.options.maximumImageFileSize && _this.options.maximumImageFileSize < file.size) ***REMOVED***
                _this.context.triggerEvent('image.upload.error', _this.lang.image.maximumFileSizeError);
            ***REMOVED***
            else ***REMOVED***
                readFileAsDataURL(file).then(function (dataURL) ***REMOVED***
                    return _this.insertImage(dataURL, filename);
                ***REMOVED***).fail(function () ***REMOVED***
                    _this.context.triggerEvent('image.upload.error');
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***;
    /**
     * insertImagesOrCallback
     * @param ***REMOVED***File[]***REMOVED*** files
     */
    Editor.prototype.insertImagesOrCallback = function (files) ***REMOVED***
        var callbacks = this.options.callbacks;
        // If onImageUpload this.options setted
        if (callbacks.onImageUpload) ***REMOVED***
            this.context.triggerEvent('image.upload', files);
            // else insert Image as dataURL
        ***REMOVED***
        else ***REMOVED***
            this.insertImages(files);
        ***REMOVED***
    ***REMOVED***;
    /**
     * return selected plain text
     * @return ***REMOVED***String***REMOVED*** text
     */
    Editor.prototype.getSelectedText = function () ***REMOVED***
        var rng = this.createRange();
        // if range on anchor, expand range with anchor
        if (rng.isOnAnchor()) ***REMOVED***
            rng = range.createFromNode(dom.ancestor(rng.sc, dom.isAnchor));
        ***REMOVED***
        return rng.toString();
    ***REMOVED***;
    Editor.prototype.onFormatBlock = function (tagName, $target) ***REMOVED***
        // [workaround] for MSIE, IE need `<`
        tagName = env.isMSIE ? '<' + tagName + '>' : tagName;
        document.execCommand('FormatBlock', false, tagName);
        // support custom class
        if ($target && $target.length) ***REMOVED***
            var className = $target[0].className || '';
            if (className) ***REMOVED***
                var currentRange = this.createRange();
                var $parent = $$1([currentRange.sc, currentRange.ec]).closest(tagName);
                $parent.addClass(className);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
    Editor.prototype.formatPara = function () ***REMOVED***
        this.formatBlock('P');
    ***REMOVED***;
    Editor.prototype.fontStyling = function (target, value) ***REMOVED***
        var rng = this.createRange();
        if (rng) ***REMOVED***
            var spans = this.style.styleNodes(rng);
            $$1(spans).css(target, value);
            // [workaround] added styled bogus span for style
            //  - also bogus character needed for cursor position
            if (rng.isCollapsed()) ***REMOVED***
                var firstSpan = lists.head(spans);
                if (firstSpan && !dom.nodeLength(firstSpan)) ***REMOVED***
                    firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
                    range.createFromNodeAfter(firstSpan.firstChild).select();
                    this.$editable.data(KEY_BOGUS, firstSpan);
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
    /**
     * unlink
     *
     * @type command
     */
    Editor.prototype.unlink = function () ***REMOVED***
        var rng = this.createRange();
        if (rng.isOnAnchor()) ***REMOVED***
            var anchor = dom.ancestor(rng.sc, dom.isAnchor);
            rng = range.createFromNode(anchor);
            rng.select();
            this.beforeCommand();
            document.execCommand('unlink');
            this.afterCommand();
        ***REMOVED***
    ***REMOVED***;
    /**
     * returns link info
     *
     * @return ***REMOVED***Object***REMOVED***
     * @return ***REMOVED***WrappedRange***REMOVED*** return.range
     * @return ***REMOVED***String***REMOVED*** return.text
     * @return ***REMOVED***Boolean***REMOVED*** [return.isNewWindow=true]
     * @return ***REMOVED***String***REMOVED*** [return.url=""]
     */
    Editor.prototype.getLinkInfo = function () ***REMOVED***
        var rng = this.createRange().expand(dom.isAnchor);
        // Get the first anchor on range(for edit).
        var $anchor = $$1(lists.head(rng.nodes(dom.isAnchor)));
        var linkInfo = ***REMOVED***
            range: rng,
            text: rng.toString(),
            url: $anchor.length ? $anchor.attr('href') : ''
        ***REMOVED***;
        // Define isNewWindow when anchor exists.
        if ($anchor.length) ***REMOVED***
            linkInfo.isNewWindow = $anchor.attr('target') === '_blank';
        ***REMOVED***
        return linkInfo;
    ***REMOVED***;
    Editor.prototype.addRow = function (position) ***REMOVED***
        var rng = this.createRange(this.$editable);
        if (rng.isCollapsed() && rng.isOnCell()) ***REMOVED***
            this.beforeCommand();
            this.table.addRow(rng, position);
            this.afterCommand();
        ***REMOVED***
    ***REMOVED***;
    Editor.prototype.addCol = function (position) ***REMOVED***
        var rng = this.createRange(this.$editable);
        if (rng.isCollapsed() && rng.isOnCell()) ***REMOVED***
            this.beforeCommand();
            this.table.addCol(rng, position);
            this.afterCommand();
        ***REMOVED***
    ***REMOVED***;
    Editor.prototype.deleteRow = function () ***REMOVED***
        var rng = this.createRange(this.$editable);
        if (rng.isCollapsed() && rng.isOnCell()) ***REMOVED***
            this.beforeCommand();
            this.table.deleteRow(rng);
            this.afterCommand();
        ***REMOVED***
    ***REMOVED***;
    Editor.prototype.deleteCol = function () ***REMOVED***
        var rng = this.createRange(this.$editable);
        if (rng.isCollapsed() && rng.isOnCell()) ***REMOVED***
            this.beforeCommand();
            this.table.deleteCol(rng);
            this.afterCommand();
        ***REMOVED***
    ***REMOVED***;
    Editor.prototype.deleteTable = function () ***REMOVED***
        var rng = this.createRange(this.$editable);
        if (rng.isCollapsed() && rng.isOnCell()) ***REMOVED***
            this.beforeCommand();
            this.table.deleteTable(rng);
            this.afterCommand();
        ***REMOVED***
    ***REMOVED***;
    /**
     * @param ***REMOVED***Position***REMOVED*** pos
     * @param ***REMOVED***jQuery***REMOVED*** $target - target element
     * @param ***REMOVED***Boolean***REMOVED*** [bKeepRatio] - keep ratio
     */
    Editor.prototype.resizeTo = function (pos, $target, bKeepRatio) ***REMOVED***
        var imageSize;
        if (bKeepRatio) ***REMOVED***
            var newRatio = pos.y / pos.x;
            var ratio = $target.data('ratio');
            imageSize = ***REMOVED***
                width: ratio > newRatio ? pos.x : pos.y / ratio,
                height: ratio > newRatio ? pos.x * ratio : pos.y
            ***REMOVED***;
        ***REMOVED***
        else ***REMOVED***
            imageSize = ***REMOVED***
                width: pos.x,
                height: pos.y
            ***REMOVED***;
        ***REMOVED***
        $target.css(imageSize);
    ***REMOVED***;
    /**
     * returns whether editable area has focus or not.
     */
    Editor.prototype.hasFocus = function () ***REMOVED***
        return this.$editable.is(':focus');
    ***REMOVED***;
    /**
     * set focus
     */
    Editor.prototype.focus = function () ***REMOVED***
        // [workaround] Screen will move when page is scolled in IE.
        //  - do focus when not focused
        if (!this.hasFocus()) ***REMOVED***
            this.$editable.focus();
        ***REMOVED***
    ***REMOVED***;
    /**
     * returns whether contents is empty or not.
     * @return ***REMOVED***Boolean***REMOVED***
     */
    Editor.prototype.isEmpty = function () ***REMOVED***
        return dom.isEmpty(this.$editable[0]) || dom.emptyPara === this.$editable.html();
    ***REMOVED***;
    /**
     * Removes all contents and restores the editable instance to an _emptyPara_.
     */
    Editor.prototype.empty = function () ***REMOVED***
        this.context.invoke('code', dom.emptyPara);
    ***REMOVED***;
    return Editor;
***REMOVED***());

var Clipboard = /** @class */ (function () ***REMOVED***
    function Clipboard(context) ***REMOVED***
        this.context = context;
        this.$editable = context.layoutInfo.editable;
    ***REMOVED***
    Clipboard.prototype.initialize = function () ***REMOVED***
        this.$editable.on('paste', this.pasteByEvent.bind(this));
    ***REMOVED***;
    /**
     * paste by clipboard event
     *
     * @param ***REMOVED***Event***REMOVED*** event
     */
    Clipboard.prototype.pasteByEvent = function (event) ***REMOVED***
        var clipboardData = event.originalEvent.clipboardData;
        if (clipboardData && clipboardData.items && clipboardData.items.length) ***REMOVED***
            var item = lists.head(clipboardData.items);
            if (item.kind === 'file' && item.type.indexOf('image/') !== -1) ***REMOVED***
                this.context.invoke('editor.insertImagesOrCallback', [item.getAsFile()]);
            ***REMOVED***
            this.context.invoke('editor.afterCommand');
        ***REMOVED***
    ***REMOVED***;
    return Clipboard;
***REMOVED***());

var Dropzone = /** @class */ (function () ***REMOVED***
    function Dropzone(context) ***REMOVED***
        this.context = context;
        this.$eventListener = $$1(document);
        this.$editor = context.layoutInfo.editor;
        this.$editable = context.layoutInfo.editable;
        this.options = context.options;
        this.lang = this.options.langInfo;
        this.documentEventHandlers = ***REMOVED******REMOVED***;
        this.$dropzone = $$1([
            '<div class="note-dropzone">',
            '  <div class="note-dropzone-message"/>',
            '</div>'
        ].join('')).prependTo(this.$editor);
    ***REMOVED***
    /**
     * attach Drag and Drop Events
     */
    Dropzone.prototype.initialize = function () ***REMOVED***
        if (this.options.disableDragAndDrop) ***REMOVED***
            // prevent default drop event
            this.documentEventHandlers.onDrop = function (e) ***REMOVED***
                e.preventDefault();
            ***REMOVED***;
            // do not consider outside of dropzone
            this.$eventListener = this.$dropzone;
            this.$eventListener.on('drop', this.documentEventHandlers.onDrop);
        ***REMOVED***
        else ***REMOVED***
            this.attachDragAndDropEvent();
        ***REMOVED***
    ***REMOVED***;
    /**
     * attach Drag and Drop Events
     */
    Dropzone.prototype.attachDragAndDropEvent = function () ***REMOVED***
        var _this = this;
        var collection = $$1();
        var $dropzoneMessage = this.$dropzone.find('.note-dropzone-message');
        this.documentEventHandlers.onDragenter = function (e) ***REMOVED***
            var isCodeview = _this.context.invoke('codeview.isActivated');
            var hasEditorSize = _this.$editor.width() > 0 && _this.$editor.height() > 0;
            if (!isCodeview && !collection.length && hasEditorSize) ***REMOVED***
                _this.$editor.addClass('dragover');
                _this.$dropzone.width(_this.$editor.width());
                _this.$dropzone.height(_this.$editor.height());
                $dropzoneMessage.text(_this.lang.image.dragImageHere);
            ***REMOVED***
            collection = collection.add(e.target);
        ***REMOVED***;
        this.documentEventHandlers.onDragleave = function (e) ***REMOVED***
            collection = collection.not(e.target);
            if (!collection.length) ***REMOVED***
                _this.$editor.removeClass('dragover');
            ***REMOVED***
        ***REMOVED***;
        this.documentEventHandlers.onDrop = function () ***REMOVED***
            collection = $$1();
            _this.$editor.removeClass('dragover');
        ***REMOVED***;
        // show dropzone on dragenter when dragging a object to document
        // -but only if the editor is visible, i.e. has a positive width and height
        this.$eventListener.on('dragenter', this.documentEventHandlers.onDragenter)
            .on('dragleave', this.documentEventHandlers.onDragleave)
            .on('drop', this.documentEventHandlers.onDrop);
        // change dropzone's message on hover.
        this.$dropzone.on('dragenter', function () ***REMOVED***
            _this.$dropzone.addClass('hover');
            $dropzoneMessage.text(_this.lang.image.dropImage);
        ***REMOVED***).on('dragleave', function () ***REMOVED***
            _this.$dropzone.removeClass('hover');
            $dropzoneMessage.text(_this.lang.image.dragImageHere);
        ***REMOVED***);
        // attach dropImage
        this.$dropzone.on('drop', function (event) ***REMOVED***
            var dataTransfer = event.originalEvent.dataTransfer;
            // stop the browser from opening the dropped content
            event.preventDefault();
            if (dataTransfer && dataTransfer.files && dataTransfer.files.length) ***REMOVED***
                _this.$editable.focus();
                _this.context.invoke('editor.insertImagesOrCallback', dataTransfer.files);
            ***REMOVED***
            else ***REMOVED***
                $$1.each(dataTransfer.types, function (idx, type) ***REMOVED***
                    var content = dataTransfer.getData(type);
                    if (type.toLowerCase().indexOf('text') > -1) ***REMOVED***
                        _this.context.invoke('editor.pasteHTML', content);
                    ***REMOVED***
                    else ***REMOVED***
                        $$1(content).each(function (idx, item) ***REMOVED***
                            _this.context.invoke('editor.insertNode', item);
                        ***REMOVED***);
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***).on('dragover', false); // prevent default dragover event
    ***REMOVED***;
    Dropzone.prototype.destroy = function () ***REMOVED***
        var _this = this;
        Object.keys(this.documentEventHandlers).forEach(function (key) ***REMOVED***
            _this.$eventListener.off(key.substr(2).toLowerCase(), _this.documentEventHandlers[key]);
        ***REMOVED***);
        this.documentEventHandlers = ***REMOVED******REMOVED***;
    ***REMOVED***;
    return Dropzone;
***REMOVED***());

var CodeMirror;
if (env.hasCodeMirror) ***REMOVED***
    if (env.isSupportAmd) ***REMOVED***
        require(['codemirror'], function (cm) ***REMOVED***
            CodeMirror = cm;
        ***REMOVED***);
    ***REMOVED***
    else ***REMOVED***
        CodeMirror = window.CodeMirror;
    ***REMOVED***
***REMOVED***
/**
 * @class Codeview
 */
var CodeView = /** @class */ (function () ***REMOVED***
    function CodeView(context) ***REMOVED***
        this.context = context;
        this.$editor = context.layoutInfo.editor;
        this.$editable = context.layoutInfo.editable;
        this.$codable = context.layoutInfo.codable;
        this.options = context.options;
    ***REMOVED***
    CodeView.prototype.sync = function () ***REMOVED***
        var isCodeview = this.isActivated();
        if (isCodeview && env.hasCodeMirror) ***REMOVED***
            this.$codable.data('cmEditor').save();
        ***REMOVED***
    ***REMOVED***;
    /**
     * @return ***REMOVED***Boolean***REMOVED***
     */
    CodeView.prototype.isActivated = function () ***REMOVED***
        return this.$editor.hasClass('codeview');
    ***REMOVED***;
    /**
     * toggle codeview
     */
    CodeView.prototype.toggle = function () ***REMOVED***
        if (this.isActivated()) ***REMOVED***
            this.deactivate();
        ***REMOVED***
        else ***REMOVED***
            this.activate();
        ***REMOVED***
        this.context.triggerEvent('codeview.toggled');
    ***REMOVED***;
    /**
     * activate code view
     */
    CodeView.prototype.activate = function () ***REMOVED***
        var _this = this;
        this.$codable.val(dom.html(this.$editable, this.options.prettifyHtml));
        this.$codable.height(this.$editable.height());
        this.context.invoke('toolbar.updateCodeview', true);
        this.$editor.addClass('codeview');
        this.$codable.focus();
        // activate CodeMirror as codable
        if (env.hasCodeMirror) ***REMOVED***
            var cmEditor_1 = CodeMirror.fromTextArea(this.$codable[0], this.options.codemirror);
            // CodeMirror TernServer
            if (this.options.codemirror.tern) ***REMOVED***
                var server_1 = new CodeMirror.TernServer(this.options.codemirror.tern);
                cmEditor_1.ternServer = server_1;
                cmEditor_1.on('cursorActivity', function (cm) ***REMOVED***
                    server_1.updateArgHints(cm);
                ***REMOVED***);
            ***REMOVED***
            cmEditor_1.on('blur', function (event) ***REMOVED***
                _this.context.triggerEvent('blur.codeview', cmEditor_1.getValue(), event);
            ***REMOVED***);
            // CodeMirror hasn't Padding.
            cmEditor_1.setSize(null, this.$editable.outerHeight());
            this.$codable.data('cmEditor', cmEditor_1);
        ***REMOVED***
        else ***REMOVED***
            this.$codable.on('blur', function (event) ***REMOVED***
                _this.context.triggerEvent('blur.codeview', _this.$codable.val(), event);
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
    /**
     * deactivate code view
     */
    CodeView.prototype.deactivate = function () ***REMOVED***
        // deactivate CodeMirror as codable
        if (env.hasCodeMirror) ***REMOVED***
            var cmEditor = this.$codable.data('cmEditor');
            this.$codable.val(cmEditor.getValue());
            cmEditor.toTextArea();
        ***REMOVED***
        var value = dom.value(this.$codable, this.options.prettifyHtml) || dom.emptyPara;
        var isChange = this.$editable.html() !== value;
        this.$editable.html(value);
        this.$editable.height(this.options.height ? this.$codable.height() : 'auto');
        this.$editor.removeClass('codeview');
        if (isChange) ***REMOVED***
            this.context.triggerEvent('change', this.$editable.html(), this.$editable);
        ***REMOVED***
        this.$editable.focus();
        this.context.invoke('toolbar.updateCodeview', false);
    ***REMOVED***;
    CodeView.prototype.destroy = function () ***REMOVED***
        if (this.isActivated()) ***REMOVED***
            this.deactivate();
        ***REMOVED***
    ***REMOVED***;
    return CodeView;
***REMOVED***());

var EDITABLE_PADDING = 24;
var Statusbar = /** @class */ (function () ***REMOVED***
    function Statusbar(context) ***REMOVED***
        this.$document = $$1(document);
        this.$statusbar = context.layoutInfo.statusbar;
        this.$editable = context.layoutInfo.editable;
        this.options = context.options;
    ***REMOVED***
    Statusbar.prototype.initialize = function () ***REMOVED***
        var _this = this;
        if (this.options.airMode || this.options.disableResizeEditor) ***REMOVED***
            this.destroy();
            return;
        ***REMOVED***
        this.$statusbar.on('mousedown', function (event) ***REMOVED***
            event.preventDefault();
            event.stopPropagation();
            var editableTop = _this.$editable.offset().top - _this.$document.scrollTop();
            var onMouseMove = function (event) ***REMOVED***
                var height = event.clientY - (editableTop + EDITABLE_PADDING);
                height = (_this.options.minheight > 0) ? Math.max(height, _this.options.minheight) : height;
                height = (_this.options.maxHeight > 0) ? Math.min(height, _this.options.maxHeight) : height;
                _this.$editable.height(height);
            ***REMOVED***;
            _this.$document.on('mousemove', onMouseMove).one('mouseup', function () ***REMOVED***
                _this.$document.off('mousemove', onMouseMove);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***;
    Statusbar.prototype.destroy = function () ***REMOVED***
        this.$statusbar.off();
    ***REMOVED***;
    return Statusbar;
***REMOVED***());

var Fullscreen = /** @class */ (function () ***REMOVED***
    function Fullscreen(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.$editor = context.layoutInfo.editor;
        this.$toolbar = context.layoutInfo.toolbar;
        this.$editable = context.layoutInfo.editable;
        this.$codable = context.layoutInfo.codable;
        this.$window = $$1(window);
        this.$scrollbar = $$1('html, body');
        this.onResize = function () ***REMOVED***
            _this.resizeTo(***REMOVED***
                h: _this.$window.height() - _this.$toolbar.outerHeight()
            ***REMOVED***);
        ***REMOVED***;
    ***REMOVED***
    Fullscreen.prototype.resizeTo = function (size) ***REMOVED***
        this.$editable.css('height', size.h);
        this.$codable.css('height', size.h);
        if (this.$codable.data('cmeditor')) ***REMOVED***
            this.$codable.data('cmeditor').setsize(null, size.h);
        ***REMOVED***
    ***REMOVED***;
    /**
     * toggle fullscreen
     */
    Fullscreen.prototype.toggle = function () ***REMOVED***
        this.$editor.toggleClass('fullscreen');
        if (this.isFullscreen()) ***REMOVED***
            this.$editable.data('orgHeight', this.$editable.css('height'));
            this.$window.on('resize', this.onResize).trigger('resize');
            this.$scrollbar.css('overflow', 'hidden');
        ***REMOVED***
        else ***REMOVED***
            this.$window.off('resize', this.onResize);
            this.resizeTo(***REMOVED*** h: this.$editable.data('orgHeight') ***REMOVED***);
            this.$scrollbar.css('overflow', 'visible');
        ***REMOVED***
        this.context.invoke('toolbar.updateFullscreen', this.isFullscreen());
    ***REMOVED***;
    Fullscreen.prototype.isFullscreen = function () ***REMOVED***
        return this.$editor.hasClass('fullscreen');
    ***REMOVED***;
    return Fullscreen;
***REMOVED***());

var Handle = /** @class */ (function () ***REMOVED***
    function Handle(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.$document = $$1(document);
        this.$editingArea = context.layoutInfo.editingArea;
        this.options = context.options;
        this.lang = this.options.langInfo;
        this.events = ***REMOVED***
            'summernote.mousedown': function (we, e) ***REMOVED***
                if (_this.update(e.target)) ***REMOVED***
                    e.preventDefault();
                ***REMOVED***
            ***REMOVED***,
            'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': function () ***REMOVED***
                _this.update();
            ***REMOVED***,
            'summernote.disable': function () ***REMOVED***
                _this.hide();
            ***REMOVED***,
            'summernote.codeview.toggled': function () ***REMOVED***
                _this.update();
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    Handle.prototype.initialize = function () ***REMOVED***
        var _this = this;
        this.$handle = $$1([
            '<div class="note-handle">',
            '<div class="note-control-selection">',
            '<div class="note-control-selection-bg"></div>',
            '<div class="note-control-holder note-control-nw"></div>',
            '<div class="note-control-holder note-control-ne"></div>',
            '<div class="note-control-holder note-control-sw"></div>',
            '<div class="',
            (this.options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing'),
            ' note-control-se"></div>',
            (this.options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>'),
            '</div>',
            '</div>'
        ].join('')).prependTo(this.$editingArea);
        this.$handle.on('mousedown', function (event) ***REMOVED***
            if (dom.isControlSizing(event.target)) ***REMOVED***
                event.preventDefault();
                event.stopPropagation();
                var $target_1 = _this.$handle.find('.note-control-selection').data('target');
                var posStart_1 = $target_1.offset();
                var scrollTop_1 = _this.$document.scrollTop();
                var onMouseMove_1 = function (event) ***REMOVED***
                    _this.context.invoke('editor.resizeTo', ***REMOVED***
                        x: event.clientX - posStart_1.left,
                        y: event.clientY - (posStart_1.top - scrollTop_1)
                    ***REMOVED***, $target_1, !event.shiftKey);
                    _this.update($target_1[0]);
                ***REMOVED***;
                _this.$document
                    .on('mousemove', onMouseMove_1)
                    .one('mouseup', function (e) ***REMOVED***
                    e.preventDefault();
                    _this.$document.off('mousemove', onMouseMove_1);
                    _this.context.invoke('editor.afterCommand');
                ***REMOVED***);
                if (!$target_1.data('ratio')) ***REMOVED***
                    $target_1.data('ratio', $target_1.height() / $target_1.width());
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
        // Listen for scrolling on the handle overlay.
        this.$handle.on('wheel', function (e) ***REMOVED***
            e.preventDefault();
            _this.update();
        ***REMOVED***);
    ***REMOVED***;
    Handle.prototype.destroy = function () ***REMOVED***
        this.$handle.remove();
    ***REMOVED***;
    Handle.prototype.update = function (target) ***REMOVED***
        if (this.context.isDisabled()) ***REMOVED***
            return false;
        ***REMOVED***
        var isImage = dom.isImg(target);
        var $selection = this.$handle.find('.note-control-selection');
        this.context.invoke('imagePopover.update', target);
        if (isImage) ***REMOVED***
            var $image = $$1(target);
            var position = $image.position();
            var pos = ***REMOVED***
                left: position.left + parseInt($image.css('marginLeft'), 10),
                top: position.top + parseInt($image.css('marginTop'), 10)
            ***REMOVED***;
            // exclude margin
            var imageSize = ***REMOVED***
                w: $image.outerWidth(false),
                h: $image.outerHeight(false)
            ***REMOVED***;
            $selection.css(***REMOVED***
                display: 'block',
                left: pos.left,
                top: pos.top,
                width: imageSize.w,
                height: imageSize.h
            ***REMOVED***).data('target', $image); // save current image element.
            var origImageObj = new Image();
            origImageObj.src = $image.attr('src');
            var sizingText = imageSize.w + 'x' + imageSize.h + ' (' + this.lang.image.original + ': ' + origImageObj.width + 'x' + origImageObj.height + ')';
            $selection.find('.note-control-selection-info').text(sizingText);
            this.context.invoke('editor.saveTarget', target);
        ***REMOVED***
        else ***REMOVED***
            this.hide();
        ***REMOVED***
        return isImage;
    ***REMOVED***;
    /**
     * hide
     *
     * @param ***REMOVED***jQuery***REMOVED*** $handle
     */
    Handle.prototype.hide = function () ***REMOVED***
        this.context.invoke('editor.clearTarget');
        this.$handle.children().hide();
    ***REMOVED***;
    return Handle;
***REMOVED***());

var defaultScheme = 'http://';
var linkPattern = /^([A-Za-z][A-Za-z0-9+-.]*\:[\/\/]?|mailto:[A-Z0-9._%+-]+@)?(www\.)?(.+)$/i;
var AutoLink = /** @class */ (function () ***REMOVED***
    function AutoLink(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.events = ***REMOVED***
            'summernote.keyup': function (we, e) ***REMOVED***
                if (!e.isDefaultPrevented()) ***REMOVED***
                    _this.handleKeyup(e);
                ***REMOVED***
            ***REMOVED***,
            'summernote.keydown': function (we, e) ***REMOVED***
                _this.handleKeydown(e);
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    AutoLink.prototype.initialize = function () ***REMOVED***
        this.lastWordRange = null;
    ***REMOVED***;
    AutoLink.prototype.destroy = function () ***REMOVED***
        this.lastWordRange = null;
    ***REMOVED***;
    AutoLink.prototype.replace = function () ***REMOVED***
        if (!this.lastWordRange) ***REMOVED***
            return;
        ***REMOVED***
        var keyword = this.lastWordRange.toString();
        var match = keyword.match(linkPattern);
        if (match && (match[1] || match[2])) ***REMOVED***
            var link = match[1] ? keyword : defaultScheme + keyword;
            var node = $$1('<a />').html(keyword).attr('href', link)[0];
            this.lastWordRange.insertNode(node);
            this.lastWordRange = null;
            this.context.invoke('editor.focus');
        ***REMOVED***
    ***REMOVED***;
    AutoLink.prototype.handleKeydown = function (e) ***REMOVED***
        if (lists.contains([key.code.ENTER, key.code.SPACE], e.keyCode)) ***REMOVED***
            var wordRange = this.context.invoke('editor.createRange').getWordRange();
            this.lastWordRange = wordRange;
        ***REMOVED***
    ***REMOVED***;
    AutoLink.prototype.handleKeyup = function (e) ***REMOVED***
        if (lists.contains([key.code.ENTER, key.code.SPACE], e.keyCode)) ***REMOVED***
            this.replace();
        ***REMOVED***
    ***REMOVED***;
    return AutoLink;
***REMOVED***());

/**
 * textarea auto sync.
 */
var AutoSync = /** @class */ (function () ***REMOVED***
    function AutoSync(context) ***REMOVED***
        var _this = this;
        this.$note = context.layoutInfo.note;
        this.events = ***REMOVED***
            'summernote.change': function () ***REMOVED***
                _this.$note.val(context.invoke('code'));
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    AutoSync.prototype.shouldInitialize = function () ***REMOVED***
        return dom.isTextarea(this.$note[0]);
    ***REMOVED***;
    return AutoSync;
***REMOVED***());

var Placeholder = /** @class */ (function () ***REMOVED***
    function Placeholder(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.$editingArea = context.layoutInfo.editingArea;
        this.options = context.options;
        this.events = ***REMOVED***
            'summernote.init summernote.change': function () ***REMOVED***
                _this.update();
            ***REMOVED***,
            'summernote.codeview.toggled': function () ***REMOVED***
                _this.update();
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    Placeholder.prototype.shouldInitialize = function () ***REMOVED***
        return !!this.options.placeholder;
    ***REMOVED***;
    Placeholder.prototype.initialize = function () ***REMOVED***
        var _this = this;
        this.$placeholder = $$1('<div class="note-placeholder">');
        this.$placeholder.on('click', function () ***REMOVED***
            _this.context.invoke('focus');
        ***REMOVED***).text(this.options.placeholder).prependTo(this.$editingArea);
        this.update();
    ***REMOVED***;
    Placeholder.prototype.destroy = function () ***REMOVED***
        this.$placeholder.remove();
    ***REMOVED***;
    Placeholder.prototype.update = function () ***REMOVED***
        var isShow = !this.context.invoke('codeview.isActivated') && this.context.invoke('editor.isEmpty');
        this.$placeholder.toggle(isShow);
    ***REMOVED***;
    return Placeholder;
***REMOVED***());

var Buttons = /** @class */ (function () ***REMOVED***
    function Buttons(context) ***REMOVED***
        this.ui = $$1.summernote.ui;
        this.context = context;
        this.$toolbar = context.layoutInfo.toolbar;
        this.options = context.options;
        this.lang = this.options.langInfo;
        this.invertedKeyMap = func.invertObject(this.options.keyMap[env.isMac ? 'mac' : 'pc']);
    ***REMOVED***
    Buttons.prototype.representShortcut = function (editorMethod) ***REMOVED***
        var shortcut = this.invertedKeyMap[editorMethod];
        if (!this.options.shortcuts || !shortcut) ***REMOVED***
            return '';
        ***REMOVED***
        if (env.isMac) ***REMOVED***
            shortcut = shortcut.replace('CMD', '⌘').replace('SHIFT', '⇧');
        ***REMOVED***
        shortcut = shortcut.replace('BACKSLASH', '\\')
            .replace('SLASH', '/')
            .replace('LEFTBRACKET', '[')
            .replace('RIGHTBRACKET', ']');
        return ' (' + shortcut + ')';
    ***REMOVED***;
    Buttons.prototype.button = function (o) ***REMOVED***
        if (!this.options.tooltip && o.tooltip) ***REMOVED***
            delete o.tooltip;
        ***REMOVED***
        o.container = this.options.container;
        return this.ui.button(o);
    ***REMOVED***;
    Buttons.prototype.initialize = function () ***REMOVED***
        this.addToolbarButtons();
        this.addImagePopoverButtons();
        this.addLinkPopoverButtons();
        this.addTablePopoverButtons();
        this.fontInstalledMap = ***REMOVED******REMOVED***;
    ***REMOVED***;
    Buttons.prototype.destroy = function () ***REMOVED***
        delete this.fontInstalledMap;
    ***REMOVED***;
    Buttons.prototype.isFontInstalled = function (name) ***REMOVED***
        if (!this.fontInstalledMap.hasOwnProperty(name)) ***REMOVED***
            this.fontInstalledMap[name] = env.isFontInstalled(name) ||
                lists.contains(this.options.fontNamesIgnoreCheck, name);
        ***REMOVED***
        return this.fontInstalledMap[name];
    ***REMOVED***;
    Buttons.prototype.isFontDeservedToAdd = function (name) ***REMOVED***
        var genericFamilies = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
        name = name.toLowerCase();
        return ((name !== '') && this.isFontInstalled(name) && ($$1.inArray(name, genericFamilies) === -1));
    ***REMOVED***;
    Buttons.prototype.addToolbarButtons = function () ***REMOVED***
        var _this = this;
        this.context.memo('button.style', function () ***REMOVED***
            return _this.ui.buttonGroup([
                _this.button(***REMOVED***
                    className: 'dropdown-toggle',
                    contents: _this.ui.dropdownButtonContents(_this.ui.icon(_this.options.icons.magic), _this.options),
                    tooltip: _this.lang.style.style,
                    data: ***REMOVED***
                        toggle: 'dropdown'
                    ***REMOVED***
                ***REMOVED***),
                _this.ui.dropdown(***REMOVED***
                    className: 'dropdown-style',
                    items: _this.options.styleTags,
                    template: function (item) ***REMOVED***
                        if (typeof item === 'string') ***REMOVED***
                            item = ***REMOVED*** tag: item, title: (_this.lang.style.hasOwnProperty(item) ? _this.lang.style[item] : item) ***REMOVED***;
                        ***REMOVED***
                        var tag = item.tag;
                        var title = item.title;
                        var style = item.style ? ' style="' + item.style + '" ' : '';
                        var className = item.className ? ' class="' + item.className + '"' : '';
                        return '<' + tag + style + className + '>' + title + '</' + tag + '>';
                    ***REMOVED***,
                    click: _this.context.createInvokeHandler('editor.formatBlock')
                ***REMOVED***)
            ]).render();
        ***REMOVED***);
        var _loop_1 = function (styleIdx, styleLen) ***REMOVED***
            var item = this_1.options.styleTags[styleIdx];
            this_1.context.memo('button.style.' + item, function () ***REMOVED***
                return _this.button(***REMOVED***
                    className: 'note-btn-style-' + item,
                    contents: '<div data-value="' + item + '">' + item.toUpperCase() + '</div>',
                    tooltip: item.toUpperCase(),
                    click: _this.context.createInvokeHandler('editor.formatBlock')
                ***REMOVED***).render();
            ***REMOVED***);
        ***REMOVED***;
        var this_1 = this;
        for (var styleIdx = 0, styleLen = this.options.styleTags.length; styleIdx < styleLen; styleIdx++) ***REMOVED***
            _loop_1(styleIdx, styleLen);
        ***REMOVED***
        this.context.memo('button.bold', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'note-btn-bold',
                contents: _this.ui.icon(_this.options.icons.bold),
                tooltip: _this.lang.font.bold + _this.representShortcut('bold'),
                click: _this.context.createInvokeHandlerAndUpdateState('editor.bold')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.italic', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'note-btn-italic',
                contents: _this.ui.icon(_this.options.icons.italic),
                tooltip: _this.lang.font.italic + _this.representShortcut('italic'),
                click: _this.context.createInvokeHandlerAndUpdateState('editor.italic')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.underline', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'note-btn-underline',
                contents: _this.ui.icon(_this.options.icons.underline),
                tooltip: _this.lang.font.underline + _this.representShortcut('underline'),
                click: _this.context.createInvokeHandlerAndUpdateState('editor.underline')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.clear', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.eraser),
                tooltip: _this.lang.font.clear + _this.representShortcut('removeFormat'),
                click: _this.context.createInvokeHandler('editor.removeFormat')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.strikethrough', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'note-btn-strikethrough',
                contents: _this.ui.icon(_this.options.icons.strikethrough),
                tooltip: _this.lang.font.strikethrough + _this.representShortcut('strikethrough'),
                click: _this.context.createInvokeHandlerAndUpdateState('editor.strikethrough')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.superscript', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'note-btn-superscript',
                contents: _this.ui.icon(_this.options.icons.superscript),
                tooltip: _this.lang.font.superscript,
                click: _this.context.createInvokeHandlerAndUpdateState('editor.superscript')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.subscript', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'note-btn-subscript',
                contents: _this.ui.icon(_this.options.icons.subscript),
                tooltip: _this.lang.font.subscript,
                click: _this.context.createInvokeHandlerAndUpdateState('editor.subscript')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.fontname', function () ***REMOVED***
            var styleInfo = _this.context.invoke('editor.currentStyle');
            // Add 'default' fonts into the fontnames array if not exist
            $$1.each(styleInfo['font-family'].split(','), function (idx, fontname) ***REMOVED***
                fontname = fontname.trim().replace(/['"]+/g, '');
                if (_this.isFontDeservedToAdd(fontname)) ***REMOVED***
                    if ($$1.inArray(fontname, _this.options.fontNames) === -1) ***REMOVED***
                        _this.options.fontNames.push(fontname);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***);
            return _this.ui.buttonGroup([
                _this.button(***REMOVED***
                    className: 'dropdown-toggle',
                    contents: _this.ui.dropdownButtonContents('<span class="note-current-fontname"/>', _this.options),
                    tooltip: _this.lang.font.name,
                    data: ***REMOVED***
                        toggle: 'dropdown'
                    ***REMOVED***
                ***REMOVED***),
                _this.ui.dropdownCheck(***REMOVED***
                    className: 'dropdown-fontname',
                    checkClassName: _this.options.icons.menuCheck,
                    items: _this.options.fontNames.filter(_this.isFontInstalled.bind(_this)),
                    template: function (item) ***REMOVED***
                        return '<span style="font-family: \'' + item + '\'">' + item + '</span>';
                    ***REMOVED***,
                    click: _this.context.createInvokeHandlerAndUpdateState('editor.fontName')
                ***REMOVED***)
            ]).render();
        ***REMOVED***);
        this.context.memo('button.fontsize', function () ***REMOVED***
            return _this.ui.buttonGroup([
                _this.button(***REMOVED***
                    className: 'dropdown-toggle',
                    contents: _this.ui.dropdownButtonContents('<span class="note-current-fontsize"/>', _this.options),
                    tooltip: _this.lang.font.size,
                    data: ***REMOVED***
                        toggle: 'dropdown'
                    ***REMOVED***
                ***REMOVED***),
                _this.ui.dropdownCheck(***REMOVED***
                    className: 'dropdown-fontsize',
                    checkClassName: _this.options.icons.menuCheck,
                    items: _this.options.fontSizes,
                    click: _this.context.createInvokeHandlerAndUpdateState('editor.fontSize')
                ***REMOVED***)
            ]).render();
        ***REMOVED***);
        this.context.memo('button.color', function () ***REMOVED***
            return _this.ui.buttonGroup(***REMOVED***
                className: 'note-color',
                children: [
                    _this.button(***REMOVED***
                        className: 'note-current-color-button',
                        contents: _this.ui.icon(_this.options.icons.font + ' note-recent-color'),
                        tooltip: _this.lang.color.recent,
                        click: function (e) ***REMOVED***
                            var $button = $$1(e.currentTarget);
                            _this.context.invoke('editor.color', ***REMOVED***
                                backColor: $button.attr('data-backColor'),
                                foreColor: $button.attr('data-foreColor')
                            ***REMOVED***);
                        ***REMOVED***,
                        callback: function ($button) ***REMOVED***
                            var $recentColor = $button.find('.note-recent-color');
                            $recentColor.css('background-color', '#FFFF00');
                            $button.attr('data-backColor', '#FFFF00');
                        ***REMOVED***
                    ***REMOVED***),
                    _this.button(***REMOVED***
                        className: 'dropdown-toggle',
                        contents: _this.ui.dropdownButtonContents('', _this.options),
                        tooltip: _this.lang.color.more,
                        data: ***REMOVED***
                            toggle: 'dropdown'
                        ***REMOVED***
                    ***REMOVED***),
                    _this.ui.dropdown(***REMOVED***
                        items: [
                            '<div class="note-palette">',
                            '  <div class="note-palette-title">' + _this.lang.color.background + '</div>',
                            '  <div>',
                            '    <button type="button" class="note-color-reset btn btn-light" data-event="backColor" data-value="inherit">',
                            _this.lang.color.transparent,
                            '    </button>',
                            '  </div>',
                            '  <div class="note-holder" data-event="backColor"/>',
                            '</div>',
                            '<div class="note-palette">',
                            '  <div class="note-palette-title">' + _this.lang.color.foreground + '</div>',
                            '  <div>',
                            '    <button type="button" class="note-color-reset btn btn-light" data-event="removeFormat" data-value="foreColor">',
                            _this.lang.color.resetToDefault,
                            '    </button>',
                            '  </div>',
                            '  <div class="note-holder" data-event="foreColor"/>',
                            '</div>'
                        ].join(''),
                        callback: function ($dropdown) ***REMOVED***
                            $dropdown.find('.note-holder').each(function (idx, item) ***REMOVED***
                                var $holder = $$1(item);
                                $holder.append(_this.ui.palette(***REMOVED***
                                    colors: _this.options.colors,
                                    eventName: $holder.data('event'),
                                    container: _this.options.container,
                                    tooltip: _this.options.tooltip
                                ***REMOVED***).render());
                            ***REMOVED***);
                        ***REMOVED***,
                        click: function (event) ***REMOVED***
                            var $button = $$1(event.target);
                            var eventName = $button.data('event');
                            var value = $button.data('value');
                            if (eventName && value) ***REMOVED***
                                var key = eventName === 'backColor' ? 'background-color' : 'color';
                                var $color = $button.closest('.note-color').find('.note-recent-color');
                                var $currentButton = $button.closest('.note-color').find('.note-current-color-button');
                                $color.css(key, value);
                                $currentButton.attr('data-' + eventName, value);
                                _this.context.invoke('editor.' + eventName, value);
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***)
                ]
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.ul', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.unorderedlist),
                tooltip: _this.lang.lists.unordered + _this.representShortcut('insertUnorderedList'),
                click: _this.context.createInvokeHandler('editor.insertUnorderedList')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.ol', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.orderedlist),
                tooltip: _this.lang.lists.ordered + _this.representShortcut('insertOrderedList'),
                click: _this.context.createInvokeHandler('editor.insertOrderedList')
            ***REMOVED***).render();
        ***REMOVED***);
        var justifyLeft = this.button(***REMOVED***
            contents: this.ui.icon(this.options.icons.alignLeft),
            tooltip: this.lang.paragraph.left + this.representShortcut('justifyLeft'),
            click: this.context.createInvokeHandler('editor.justifyLeft')
        ***REMOVED***);
        var justifyCenter = this.button(***REMOVED***
            contents: this.ui.icon(this.options.icons.alignCenter),
            tooltip: this.lang.paragraph.center + this.representShortcut('justifyCenter'),
            click: this.context.createInvokeHandler('editor.justifyCenter')
        ***REMOVED***);
        var justifyRight = this.button(***REMOVED***
            contents: this.ui.icon(this.options.icons.alignRight),
            tooltip: this.lang.paragraph.right + this.representShortcut('justifyRight'),
            click: this.context.createInvokeHandler('editor.justifyRight')
        ***REMOVED***);
        var justifyFull = this.button(***REMOVED***
            contents: this.ui.icon(this.options.icons.alignJustify),
            tooltip: this.lang.paragraph.justify + this.representShortcut('justifyFull'),
            click: this.context.createInvokeHandler('editor.justifyFull')
        ***REMOVED***);
        var outdent = this.button(***REMOVED***
            contents: this.ui.icon(this.options.icons.outdent),
            tooltip: this.lang.paragraph.outdent + this.representShortcut('outdent'),
            click: this.context.createInvokeHandler('editor.outdent')
        ***REMOVED***);
        var indent = this.button(***REMOVED***
            contents: this.ui.icon(this.options.icons.indent),
            tooltip: this.lang.paragraph.indent + this.representShortcut('indent'),
            click: this.context.createInvokeHandler('editor.indent')
        ***REMOVED***);
        this.context.memo('button.justifyLeft', func.invoke(justifyLeft, 'render'));
        this.context.memo('button.justifyCenter', func.invoke(justifyCenter, 'render'));
        this.context.memo('button.justifyRight', func.invoke(justifyRight, 'render'));
        this.context.memo('button.justifyFull', func.invoke(justifyFull, 'render'));
        this.context.memo('button.outdent', func.invoke(outdent, 'render'));
        this.context.memo('button.indent', func.invoke(indent, 'render'));
        this.context.memo('button.paragraph', function () ***REMOVED***
            return _this.ui.buttonGroup([
                _this.button(***REMOVED***
                    className: 'dropdown-toggle',
                    contents: _this.ui.dropdownButtonContents(_this.ui.icon(_this.options.icons.alignLeft), _this.options),
                    tooltip: _this.lang.paragraph.paragraph,
                    data: ***REMOVED***
                        toggle: 'dropdown'
                    ***REMOVED***
                ***REMOVED***),
                _this.ui.dropdown([
                    _this.ui.buttonGroup(***REMOVED***
                        className: 'note-align',
                        children: [justifyLeft, justifyCenter, justifyRight, justifyFull]
                    ***REMOVED***),
                    _this.ui.buttonGroup(***REMOVED***
                        className: 'note-list',
                        children: [outdent, indent]
                    ***REMOVED***)
                ])
            ]).render();
        ***REMOVED***);
        this.context.memo('button.height', function () ***REMOVED***
            return _this.ui.buttonGroup([
                _this.button(***REMOVED***
                    className: 'dropdown-toggle',
                    contents: _this.ui.dropdownButtonContents(_this.ui.icon(_this.options.icons.textHeight), _this.options),
                    tooltip: _this.lang.font.height,
                    data: ***REMOVED***
                        toggle: 'dropdown'
                    ***REMOVED***
                ***REMOVED***),
                _this.ui.dropdownCheck(***REMOVED***
                    items: _this.options.lineHeights,
                    checkClassName: _this.options.icons.menuCheck,
                    className: 'dropdown-line-height',
                    click: _this.context.createInvokeHandler('editor.lineHeight')
                ***REMOVED***)
            ]).render();
        ***REMOVED***);
        this.context.memo('button.table', function () ***REMOVED***
            return _this.ui.buttonGroup([
                _this.button(***REMOVED***
                    className: 'dropdown-toggle',
                    contents: _this.ui.dropdownButtonContents(_this.ui.icon(_this.options.icons.table), _this.options),
                    tooltip: _this.lang.table.table,
                    data: ***REMOVED***
                        toggle: 'dropdown'
                    ***REMOVED***
                ***REMOVED***),
                _this.ui.dropdown(***REMOVED***
                    className: 'note-table',
                    items: [
                        '<div class="note-dimension-picker">',
                        '  <div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"/>',
                        '  <div class="note-dimension-picker-highlighted"/>',
                        '  <div class="note-dimension-picker-unhighlighted"/>',
                        '</div>',
                        '<div class="note-dimension-display">1 x 1</div>'
                    ].join('')
                ***REMOVED***)
            ], ***REMOVED***
                callback: function ($node) ***REMOVED***
                    var $catcher = $node.find('.note-dimension-picker-mousecatcher');
                    $catcher.css(***REMOVED***
                        width: _this.options.insertTableMaxSize.col + 'em',
                        height: _this.options.insertTableMaxSize.row + 'em'
                    ***REMOVED***).mousedown(_this.context.createInvokeHandler('editor.insertTable'))
                        .on('mousemove', _this.tableMoveHandler.bind(_this));
                ***REMOVED***
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.link', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.link),
                tooltip: _this.lang.link.link + _this.representShortcut('linkDialog.show'),
                click: _this.context.createInvokeHandler('linkDialog.show')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.picture', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.picture),
                tooltip: _this.lang.image.image,
                click: _this.context.createInvokeHandler('imageDialog.show')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.video', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.video),
                tooltip: _this.lang.video.video,
                click: _this.context.createInvokeHandler('videoDialog.show')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.hr', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.minus),
                tooltip: _this.lang.hr.insert + _this.representShortcut('insertHorizontalRule'),
                click: _this.context.createInvokeHandler('editor.insertHorizontalRule')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.fullscreen', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-fullscreen',
                contents: _this.ui.icon(_this.options.icons.arrowsAlt),
                tooltip: _this.options.fullscreen,
                click: _this.context.createInvokeHandler('fullscreen.toggle')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.codeview', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-codeview',
                contents: _this.ui.icon(_this.options.icons.code),
                tooltip: _this.options.codeview,
                click: _this.context.createInvokeHandler('codeview.toggle')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.redo', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.redo),
                tooltip: _this.lang.history.redo + _this.representShortcut('redo'),
                click: _this.context.createInvokeHandler('editor.redo')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.undo', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.undo),
                tooltip: _this.lang.history.undo + _this.representShortcut('undo'),
                click: _this.context.createInvokeHandler('editor.undo')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.help', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.question),
                tooltip: _this.options.help,
                click: _this.context.createInvokeHandler('helpDialog.show')
            ***REMOVED***).render();
        ***REMOVED***);
    ***REMOVED***;
    /**
     * image : [
     *   ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
     *   ['float', ['floatLeft', 'floatRight', 'floatNone' ]],
     *   ['remove', ['removeMedia']]
     * ],
     */
    Buttons.prototype.addImagePopoverButtons = function () ***REMOVED***
        var _this = this;
        // Image Size Buttons
        this.context.memo('button.imageSize100', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: '<span class="note-fontsize-10">100%</span>',
                tooltip: _this.lang.image.resizeFull,
                click: _this.context.createInvokeHandler('editor.resize', '1')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.imageSize50', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: '<span class="note-fontsize-10">50%</span>',
                tooltip: _this.lang.image.resizeHalf,
                click: _this.context.createInvokeHandler('editor.resize', '0.5')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.imageSize25', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: '<span class="note-fontsize-10">25%</span>',
                tooltip: _this.lang.image.resizeQuarter,
                click: _this.context.createInvokeHandler('editor.resize', '0.25')
            ***REMOVED***).render();
        ***REMOVED***);
        // Float Buttons
        this.context.memo('button.floatLeft', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.alignLeft),
                tooltip: _this.lang.image.floatLeft,
                click: _this.context.createInvokeHandler('editor.floatMe', 'left')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.floatRight', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.alignRight),
                tooltip: _this.lang.image.floatRight,
                click: _this.context.createInvokeHandler('editor.floatMe', 'right')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.floatNone', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.alignJustify),
                tooltip: _this.lang.image.floatNone,
                click: _this.context.createInvokeHandler('editor.floatMe', 'none')
            ***REMOVED***).render();
        ***REMOVED***);
        // Remove Buttons
        this.context.memo('button.removeMedia', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.trash),
                tooltip: _this.lang.image.remove,
                click: _this.context.createInvokeHandler('editor.removeMedia')
            ***REMOVED***).render();
        ***REMOVED***);
    ***REMOVED***;
    Buttons.prototype.addLinkPopoverButtons = function () ***REMOVED***
        var _this = this;
        this.context.memo('button.linkDialogShow', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.link),
                tooltip: _this.lang.link.edit,
                click: _this.context.createInvokeHandler('linkDialog.show')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.unlink', function () ***REMOVED***
            return _this.button(***REMOVED***
                contents: _this.ui.icon(_this.options.icons.unlink),
                tooltip: _this.lang.link.unlink,
                click: _this.context.createInvokeHandler('editor.unlink')
            ***REMOVED***).render();
        ***REMOVED***);
    ***REMOVED***;
    /**
     * table : [
     *  ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
     *  ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
     * ],
     */
    Buttons.prototype.addTablePopoverButtons = function () ***REMOVED***
        var _this = this;
        this.context.memo('button.addRowUp', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-md',
                contents: _this.ui.icon(_this.options.icons.rowAbove),
                tooltip: _this.lang.table.addRowAbove,
                click: _this.context.createInvokeHandler('editor.addRow', 'top')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.addRowDown', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-md',
                contents: _this.ui.icon(_this.options.icons.rowBelow),
                tooltip: _this.lang.table.addRowBelow,
                click: _this.context.createInvokeHandler('editor.addRow', 'bottom')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.addColLeft', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-md',
                contents: _this.ui.icon(_this.options.icons.colBefore),
                tooltip: _this.lang.table.addColLeft,
                click: _this.context.createInvokeHandler('editor.addCol', 'left')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.addColRight', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-md',
                contents: _this.ui.icon(_this.options.icons.colAfter),
                tooltip: _this.lang.table.addColRight,
                click: _this.context.createInvokeHandler('editor.addCol', 'right')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.deleteRow', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-md',
                contents: _this.ui.icon(_this.options.icons.rowRemove),
                tooltip: _this.lang.table.delRow,
                click: _this.context.createInvokeHandler('editor.deleteRow')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.deleteCol', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-md',
                contents: _this.ui.icon(_this.options.icons.colRemove),
                tooltip: _this.lang.table.delCol,
                click: _this.context.createInvokeHandler('editor.deleteCol')
            ***REMOVED***).render();
        ***REMOVED***);
        this.context.memo('button.deleteTable', function () ***REMOVED***
            return _this.button(***REMOVED***
                className: 'btn-md',
                contents: _this.ui.icon(_this.options.icons.trash),
                tooltip: _this.lang.table.delTable,
                click: _this.context.createInvokeHandler('editor.deleteTable')
            ***REMOVED***).render();
        ***REMOVED***);
    ***REMOVED***;
    Buttons.prototype.build = function ($container, groups) ***REMOVED***
        for (var groupIdx = 0, groupLen = groups.length; groupIdx < groupLen; groupIdx++) ***REMOVED***
            var group = groups[groupIdx];
            var groupName = $$1.isArray(group) ? group[0] : group;
            var buttons = $$1.isArray(group) ? ((group.length === 1) ? [group[0]] : group[1]) : [group];
            var $group = this.ui.buttonGroup(***REMOVED***
                className: 'note-' + groupName
            ***REMOVED***).render();
            for (var idx = 0, len = buttons.length; idx < len; idx++) ***REMOVED***
                var btn = this.context.memo('button.' + buttons[idx]);
                if (btn) ***REMOVED***
                    $group.append(typeof btn === 'function' ? btn(this.context) : btn);
                ***REMOVED***
            ***REMOVED***
            $group.appendTo($container);
        ***REMOVED***
    ***REMOVED***;
    /**
     * @param ***REMOVED***jQuery***REMOVED*** [$container]
     */
    Buttons.prototype.updateCurrentStyle = function ($container) ***REMOVED***
        var _this = this;
        var $cont = $container || this.$toolbar;
        var styleInfo = this.context.invoke('editor.currentStyle');
        this.updateBtnStates($cont, ***REMOVED***
            '.note-btn-bold': function () ***REMOVED***
                return styleInfo['font-bold'] === 'bold';
            ***REMOVED***,
            '.note-btn-italic': function () ***REMOVED***
                return styleInfo['font-italic'] === 'italic';
            ***REMOVED***,
            '.note-btn-underline': function () ***REMOVED***
                return styleInfo['font-underline'] === 'underline';
            ***REMOVED***,
            '.note-btn-subscript': function () ***REMOVED***
                return styleInfo['font-subscript'] === 'subscript';
            ***REMOVED***,
            '.note-btn-superscript': function () ***REMOVED***
                return styleInfo['font-superscript'] === 'superscript';
            ***REMOVED***,
            '.note-btn-strikethrough': function () ***REMOVED***
                return styleInfo['font-strikethrough'] === 'strikethrough';
            ***REMOVED***
        ***REMOVED***);
        if (styleInfo['font-family']) ***REMOVED***
            var fontNames = styleInfo['font-family'].split(',').map(function (name) ***REMOVED***
                return name.replace(/[\'\"]/g, '')
                    .replace(/\s+$/, '')
                    .replace(/^\s+/, '');
            ***REMOVED***);
            var fontName_1 = lists.find(fontNames, this.isFontInstalled.bind(this));
            $cont.find('.dropdown-fontname a').each(function (idx, item) ***REMOVED***
                var $item = $$1(item);
                // always compare string to avoid creating another func.
                var isChecked = ($item.data('value') + '') === (fontName_1 + '');
                $item.toggleClass('checked', isChecked);
            ***REMOVED***);
            $cont.find('.note-current-fontname').text(fontName_1).css('font-family', fontName_1);
        ***REMOVED***
        if (styleInfo['font-size']) ***REMOVED***
            var fontSize_1 = styleInfo['font-size'];
            $cont.find('.dropdown-fontsize a').each(function (idx, item) ***REMOVED***
                var $item = $$1(item);
                // always compare with string to avoid creating another func.
                var isChecked = ($item.data('value') + '') === (fontSize_1 + '');
                $item.toggleClass('checked', isChecked);
            ***REMOVED***);
            $cont.find('.note-current-fontsize').text(fontSize_1);
        ***REMOVED***
        if (styleInfo['line-height']) ***REMOVED***
            var lineHeight_1 = styleInfo['line-height'];
            $cont.find('.dropdown-line-height li a').each(function (idx, item) ***REMOVED***
                // always compare with string to avoid creating another func.
                var isChecked = ($$1(item).data('value') + '') === (lineHeight_1 + '');
                _this.className = isChecked ? 'checked' : '';
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
    Buttons.prototype.updateBtnStates = function ($container, infos) ***REMOVED***
        var _this = this;
        $$1.each(infos, function (selector, pred) ***REMOVED***
            _this.ui.toggleBtnActive($container.find(selector), pred());
        ***REMOVED***);
    ***REMOVED***;
    Buttons.prototype.tableMoveHandler = function (event) ***REMOVED***
        var PX_PER_EM = 18;
        var $picker = $$1(event.target.parentNode); // target is mousecatcher
        var $dimensionDisplay = $picker.next();
        var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
        var $highlighted = $picker.find('.note-dimension-picker-highlighted');
        var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');
        var posOffset;
        // HTML5 with jQuery - e.offsetX is undefined in Firefox
        if (event.offsetX === undefined) ***REMOVED***
            var posCatcher = $$1(event.target).offset();
            posOffset = ***REMOVED***
                x: event.pageX - posCatcher.left,
                y: event.pageY - posCatcher.top
            ***REMOVED***;
        ***REMOVED***
        else ***REMOVED***
            posOffset = ***REMOVED***
                x: event.offsetX,
                y: event.offsetY
            ***REMOVED***;
        ***REMOVED***
        var dim = ***REMOVED***
            c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
            r: Math.ceil(posOffset.y / PX_PER_EM) || 1
        ***REMOVED***;
        $highlighted.css(***REMOVED*** width: dim.c + 'em', height: dim.r + 'em' ***REMOVED***);
        $catcher.data('value', dim.c + 'x' + dim.r);
        if (dim.c > 3 && dim.c < this.options.insertTableMaxSize.col) ***REMOVED***
            $unhighlighted.css(***REMOVED*** width: dim.c + 1 + 'em' ***REMOVED***);
        ***REMOVED***
        if (dim.r > 3 && dim.r < this.options.insertTableMaxSize.row) ***REMOVED***
            $unhighlighted.css(***REMOVED*** height: dim.r + 1 + 'em' ***REMOVED***);
        ***REMOVED***
        $dimensionDisplay.html(dim.c + ' x ' + dim.r);
    ***REMOVED***;
    return Buttons;
***REMOVED***());

var Toolbar = /** @class */ (function () ***REMOVED***
    function Toolbar(context) ***REMOVED***
        this.context = context;
        this.$window = $$1(window);
        this.$document = $$1(document);
        this.ui = $$1.summernote.ui;
        this.$note = context.layoutInfo.note;
        this.$editor = context.layoutInfo.editor;
        this.$toolbar = context.layoutInfo.toolbar;
        this.options = context.options;
        this.followScroll = this.followScroll.bind(this);
    ***REMOVED***
    Toolbar.prototype.shouldInitialize = function () ***REMOVED***
        return !this.options.airMode;
    ***REMOVED***;
    Toolbar.prototype.initialize = function () ***REMOVED***
        var _this = this;
        this.options.toolbar = this.options.toolbar || [];
        if (!this.options.toolbar.length) ***REMOVED***
            this.$toolbar.hide();
        ***REMOVED***
        else ***REMOVED***
            this.context.invoke('buttons.build', this.$toolbar, this.options.toolbar);
        ***REMOVED***
        if (this.options.toolbarContainer) ***REMOVED***
            this.$toolbar.appendTo(this.options.toolbarContainer);
        ***REMOVED***
        this.changeContainer(false);
        this.$note.on('summernote.keyup summernote.mouseup summernote.change', function () ***REMOVED***
            _this.context.invoke('buttons.updateCurrentStyle');
        ***REMOVED***);
        this.context.invoke('buttons.updateCurrentStyle');
        if (this.options.followingToolbar) ***REMOVED***
            this.$window.on('scroll resize', this.followScroll);
        ***REMOVED***
    ***REMOVED***;
    Toolbar.prototype.destroy = function () ***REMOVED***
        this.$toolbar.children().remove();
        if (this.options.followingToolbar) ***REMOVED***
            this.$window.off('scroll resize', this.followScroll);
        ***REMOVED***
    ***REMOVED***;
    Toolbar.prototype.followScroll = function () ***REMOVED***
        if (this.$editor.hasClass('fullscreen')) ***REMOVED***
            return false;
        ***REMOVED***
        var $toolbarWrapper = this.$toolbar.parent('.note-toolbar-wrapper');
        var editorHeight = this.$editor.outerHeight();
        var editorWidth = this.$editor.width();
        var toolbarHeight = this.$toolbar.height();
        $toolbarWrapper.css(***REMOVED***
            height: toolbarHeight
        ***REMOVED***);
        // check if the web app is currently using another static bar
        var otherBarHeight = 0;
        if (this.options.otherStaticBar) ***REMOVED***
            otherBarHeight = $$1(this.options.otherStaticBar).outerHeight();
        ***REMOVED***
        var currentOffset = this.$document.scrollTop();
        var editorOffsetTop = this.$editor.offset().top;
        var editorOffsetBottom = editorOffsetTop + editorHeight;
        var activateOffset = editorOffsetTop - otherBarHeight;
        var deactivateOffsetBottom = editorOffsetBottom - otherBarHeight - toolbarHeight;
        if ((currentOffset > activateOffset) && (currentOffset < deactivateOffsetBottom)) ***REMOVED***
            this.$toolbar.css(***REMOVED***
                position: 'fixed',
                top: otherBarHeight,
                width: editorWidth
            ***REMOVED***);
        ***REMOVED***
        else ***REMOVED***
            this.$toolbar.css(***REMOVED***
                position: 'relative',
                top: 0,
                width: '100%'
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***;
    Toolbar.prototype.changeContainer = function (isFullscreen) ***REMOVED***
        if (isFullscreen) ***REMOVED***
            this.$toolbar.prependTo(this.$editor);
        ***REMOVED***
        else ***REMOVED***
            if (this.options.toolbarContainer) ***REMOVED***
                this.$toolbar.appendTo(this.options.toolbarContainer);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
    Toolbar.prototype.updateFullscreen = function (isFullscreen) ***REMOVED***
        this.ui.toggleBtnActive(this.$toolbar.find('.btn-fullscreen'), isFullscreen);
        this.changeContainer(isFullscreen);
    ***REMOVED***;
    Toolbar.prototype.updateCodeview = function (isCodeview) ***REMOVED***
        this.ui.toggleBtnActive(this.$toolbar.find('.btn-codeview'), isCodeview);
        if (isCodeview) ***REMOVED***
            this.deactivate();
        ***REMOVED***
        else ***REMOVED***
            this.activate();
        ***REMOVED***
    ***REMOVED***;
    Toolbar.prototype.activate = function (isIncludeCodeview) ***REMOVED***
        var $btn = this.$toolbar.find('button');
        if (!isIncludeCodeview) ***REMOVED***
            $btn = $btn.not('.btn-codeview');
        ***REMOVED***
        this.ui.toggleBtn($btn, true);
    ***REMOVED***;
    Toolbar.prototype.deactivate = function (isIncludeCodeview) ***REMOVED***
        var $btn = this.$toolbar.find('button');
        if (!isIncludeCodeview) ***REMOVED***
            $btn = $btn.not('.btn-codeview');
        ***REMOVED***
        this.ui.toggleBtn($btn, false);
    ***REMOVED***;
    return Toolbar;
***REMOVED***());

var LinkDialog = /** @class */ (function () ***REMOVED***
    function LinkDialog(context) ***REMOVED***
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.$body = $$1(document.body);
        this.$editor = context.layoutInfo.editor;
        this.options = context.options;
        this.lang = this.options.langInfo;
        context.memo('help.linkDialog.show', this.options.langInfo.help['linkDialog.show']);
    ***REMOVED***
    LinkDialog.prototype.initialize = function () ***REMOVED***
        var $container = this.options.dialogsInBody ? this.$body : this.$editor;
        var body = [
            '<div class="form-group note-form-group">',
            "<label class=\"note-form-label\">" + this.lang.link.textToDisplay + "</label>",
            '<input class="note-link-text form-control note-form-control  note-input" type="text" />',
            '</div>',
            '<div class="form-group note-form-group">',
            "<label class=\"note-form-label\">" + this.lang.link.url + "</label>",
            '<input class="note-link-url form-control note-form-control note-input" type="text" value="http://" />',
            '</div>',
            !this.options.disableLinkTarget
                ? $$1('<div/>').append(this.ui.checkbox(***REMOVED***
                    id: 'sn-checkbox-open-in-new-window',
                    text: this.lang.link.openInNewWindow,
                    checked: true
                ***REMOVED***).render()).html()
                : ''
        ].join('');
        var buttonClass = 'btn btn-primary note-btn note-btn-primary note-link-btn';
        var footer = "<button type=\"submit\" href=\"#\" class=\"" + buttonClass + "\" disabled>" + this.lang.link.insert + "</button>";
        this.$dialog = this.ui.dialog(***REMOVED***
            className: 'link-dialog',
            title: this.lang.link.insert,
            fade: this.options.dialogsFade,
            body: body,
            footer: footer
        ***REMOVED***).render().appendTo($container);
    ***REMOVED***;
    LinkDialog.prototype.destroy = function () ***REMOVED***
        this.ui.hideDialog(this.$dialog);
        this.$dialog.remove();
    ***REMOVED***;
    LinkDialog.prototype.bindEnterKey = function ($input, $btn) ***REMOVED***
        $input.on('keypress', function (event) ***REMOVED***
            if (event.keyCode === key.code.ENTER) ***REMOVED***
                event.preventDefault();
                $btn.trigger('click');
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***;
    /**
     * toggle update button
     */
    LinkDialog.prototype.toggleLinkBtn = function ($linkBtn, $linkText, $linkUrl) ***REMOVED***
        this.ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
    ***REMOVED***;
    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param ***REMOVED***Object***REMOVED*** linkInfo
     * @return ***REMOVED***Promise***REMOVED***
     */
    LinkDialog.prototype.showLinkDialog = function (linkInfo) ***REMOVED***
        var _this = this;
        return $$1.Deferred(function (deferred) ***REMOVED***
            var $linkText = _this.$dialog.find('.note-link-text');
            var $linkUrl = _this.$dialog.find('.note-link-url');
            var $linkBtn = _this.$dialog.find('.note-link-btn');
            var $openInNewWindow = _this.$dialog.find('input[type=checkbox]');
            _this.ui.onDialogShown(_this.$dialog, function () ***REMOVED***
                _this.context.triggerEvent('dialog.shown');
                // if no url was given, copy text to url
                if (!linkInfo.url) ***REMOVED***
                    linkInfo.url = linkInfo.text;
                ***REMOVED***
                $linkText.val(linkInfo.text);
                var handleLinkTextUpdate = function () ***REMOVED***
                    _this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
                    // if linktext was modified by keyup,
                    // stop cloning text from linkUrl
                    linkInfo.text = $linkText.val();
                ***REMOVED***;
                $linkText.on('input', handleLinkTextUpdate).on('paste', function () ***REMOVED***
                    setTimeout(handleLinkTextUpdate, 0);
                ***REMOVED***);
                var handleLinkUrlUpdate = function () ***REMOVED***
                    _this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
                    // display same link on `Text to display` input
                    // when create a new link
                    if (!linkInfo.text) ***REMOVED***
                        $linkText.val($linkUrl.val());
                    ***REMOVED***
                ***REMOVED***;
                $linkUrl.on('input', handleLinkUrlUpdate).on('paste', function () ***REMOVED***
                    setTimeout(handleLinkUrlUpdate, 0);
                ***REMOVED***).val(linkInfo.url);
                if (!env.isSupportTouch) ***REMOVED***
                    $linkUrl.trigger('focus');
                ***REMOVED***
                _this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
                _this.bindEnterKey($linkUrl, $linkBtn);
                _this.bindEnterKey($linkText, $linkBtn);
                var isChecked = linkInfo.isNewWindow !== undefined
                    ? linkInfo.isNewWindow : _this.context.options.linkTargetBlank;
                $openInNewWindow.prop('checked', isChecked);
                $linkBtn.one('click', function (event) ***REMOVED***
                    event.preventDefault();
                    deferred.resolve(***REMOVED***
                        range: linkInfo.range,
                        url: $linkUrl.val(),
                        text: $linkText.val(),
                        isNewWindow: $openInNewWindow.is(':checked')
                    ***REMOVED***);
                    _this.ui.hideDialog(_this.$dialog);
                ***REMOVED***);
            ***REMOVED***);
            _this.ui.onDialogHidden(_this.$dialog, function () ***REMOVED***
                // detach events
                $linkText.off('input paste keypress');
                $linkUrl.off('input paste keypress');
                $linkBtn.off('click');
                if (deferred.state() === 'pending') ***REMOVED***
                    deferred.reject();
                ***REMOVED***
            ***REMOVED***);
            _this.ui.showDialog(_this.$dialog);
        ***REMOVED***).promise();
    ***REMOVED***;
    /**
     * @param ***REMOVED***Object***REMOVED*** layoutInfo
     */
    LinkDialog.prototype.show = function () ***REMOVED***
        var _this = this;
        var linkInfo = this.context.invoke('editor.getLinkInfo');
        this.context.invoke('editor.saveRange');
        this.showLinkDialog(linkInfo).then(function (linkInfo) ***REMOVED***
            _this.context.invoke('editor.restoreRange');
            _this.context.invoke('editor.createLink', linkInfo);
        ***REMOVED***).fail(function () ***REMOVED***
            _this.context.invoke('editor.restoreRange');
        ***REMOVED***);
    ***REMOVED***;
    return LinkDialog;
***REMOVED***());

var LinkPopover = /** @class */ (function () ***REMOVED***
    function LinkPopover(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.options = context.options;
        this.events = ***REMOVED***
            'summernote.keyup summernote.mouseup summernote.change summernote.scroll': function () ***REMOVED***
                _this.update();
            ***REMOVED***,
            'summernote.disable summernote.dialog.shown': function () ***REMOVED***
                _this.hide();
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    LinkPopover.prototype.shouldInitialize = function () ***REMOVED***
        return !lists.isEmpty(this.options.popover.link);
    ***REMOVED***;
    LinkPopover.prototype.initialize = function () ***REMOVED***
        this.$popover = this.ui.popover(***REMOVED***
            className: 'note-link-popover',
            callback: function ($node) ***REMOVED***
                var $content = $node.find('.popover-content,.note-popover-content');
                $content.prepend('<span><a target="_blank"></a>&nbsp;</span>');
            ***REMOVED***
        ***REMOVED***).render().appendTo(this.options.container);
        var $content = this.$popover.find('.popover-content,.note-popover-content');
        this.context.invoke('buttons.build', $content, this.options.popover.link);
    ***REMOVED***;
    LinkPopover.prototype.destroy = function () ***REMOVED***
        this.$popover.remove();
    ***REMOVED***;
    LinkPopover.prototype.update = function () ***REMOVED***
        // Prevent focusing on editable when invoke('code') is executed
        if (!this.context.invoke('editor.hasFocus')) ***REMOVED***
            this.hide();
            return;
        ***REMOVED***
        var rng = this.context.invoke('editor.createRange');
        if (rng.isCollapsed() && rng.isOnAnchor()) ***REMOVED***
            var anchor = dom.ancestor(rng.sc, dom.isAnchor);
            var href = $$1(anchor).attr('href');
            this.$popover.find('a').attr('href', href).html(href);
            var pos = dom.posFromPlaceholder(anchor);
            this.$popover.css(***REMOVED***
                display: 'block',
                left: pos.left,
                top: pos.top
            ***REMOVED***);
        ***REMOVED***
        else ***REMOVED***
            this.hide();
        ***REMOVED***
    ***REMOVED***;
    LinkPopover.prototype.hide = function () ***REMOVED***
        this.$popover.hide();
    ***REMOVED***;
    return LinkPopover;
***REMOVED***());

var ImageDialog = /** @class */ (function () ***REMOVED***
    function ImageDialog(context) ***REMOVED***
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.$body = $$1(document.body);
        this.$editor = context.layoutInfo.editor;
        this.options = context.options;
        this.lang = this.options.langInfo;
    ***REMOVED***
    ImageDialog.prototype.initialize = function () ***REMOVED***
        var $container = this.options.dialogsInBody ? this.$body : this.$editor;
        var imageLimitation = '';
        if (this.options.maximumImageFileSize) ***REMOVED***
            var unit = Math.floor(Math.log(this.options.maximumImageFileSize) / Math.log(1024));
            var readableSize = (this.options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 +
                ' ' + ' KMGTP'[unit] + 'B';
            imageLimitation = "<small>" + (this.lang.image.maximumFileSize + ' : ' + readableSize) + "</small>";
        ***REMOVED***
        var body = [
            '<div class="form-group note-form-group note-group-select-from-files">',
            '<label class="note-form-label">' + this.lang.image.selectFromFiles + '</label>',
            '<input class="note-image-input note-form-control note-input" ',
            ' type="file" name="files" accept="image/*" multiple="multiple" />',
            imageLimitation,
            '</div>',
            '<div class="form-group note-group-image-url" style="overflow:auto;">',
            '<label class="note-form-label">' + this.lang.image.url + '</label>',
            '<input class="note-image-url form-control note-form-control note-input ',
            ' col-md-12" type="text" />',
            '</div>'
        ].join('');
        var buttonClass = 'btn btn-primary note-btn note-btn-primary note-image-btn';
        var footer = "<button type=\"submit\" href=\"#\" class=\"" + buttonClass + "\" disabled>" + this.lang.image.insert + "</button>";
        this.$dialog = this.ui.dialog(***REMOVED***
            title: this.lang.image.insert,
            fade: this.options.dialogsFade,
            body: body,
            footer: footer
        ***REMOVED***).render().appendTo($container);
    ***REMOVED***;
    ImageDialog.prototype.destroy = function () ***REMOVED***
        this.ui.hideDialog(this.$dialog);
        this.$dialog.remove();
    ***REMOVED***;
    ImageDialog.prototype.bindEnterKey = function ($input, $btn) ***REMOVED***
        $input.on('keypress', function (event) ***REMOVED***
            if (event.keyCode === key.code.ENTER) ***REMOVED***
                event.preventDefault();
                $btn.trigger('click');
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***;
    ImageDialog.prototype.show = function () ***REMOVED***
        var _this = this;
        this.context.invoke('editor.saveRange');
        this.showImageDialog().then(function (data) ***REMOVED***
            // [workaround] hide dialog before restore range for IE range focus
            _this.ui.hideDialog(_this.$dialog);
            _this.context.invoke('editor.restoreRange');
            if (typeof data === 'string') ***REMOVED***
                _this.context.invoke('editor.insertImage', data);
            ***REMOVED***
            else ***REMOVED***
                _this.context.invoke('editor.insertImagesOrCallback', data);
            ***REMOVED***
        ***REMOVED***).fail(function () ***REMOVED***
            _this.context.invoke('editor.restoreRange');
        ***REMOVED***);
    ***REMOVED***;
    /**
     * show image dialog
     *
     * @param ***REMOVED***jQuery***REMOVED*** $dialog
     * @return ***REMOVED***Promise***REMOVED***
     */
    ImageDialog.prototype.showImageDialog = function () ***REMOVED***
        var _this = this;
        return $$1.Deferred(function (deferred) ***REMOVED***
            var $imageInput = _this.$dialog.find('.note-image-input');
            var $imageUrl = _this.$dialog.find('.note-image-url');
            var $imageBtn = _this.$dialog.find('.note-image-btn');
            _this.ui.onDialogShown(_this.$dialog, function () ***REMOVED***
                _this.context.triggerEvent('dialog.shown');
                // Cloning imageInput to clear element.
                $imageInput.replaceWith($imageInput.clone().on('change', function (event) ***REMOVED***
                    deferred.resolve(event.target.files || event.target.value);
                ***REMOVED***).val(''));
                $imageBtn.click(function (event) ***REMOVED***
                    event.preventDefault();
                    deferred.resolve($imageUrl.val());
                ***REMOVED***);
                $imageUrl.on('keyup paste', function () ***REMOVED***
                    var url = $imageUrl.val();
                    _this.ui.toggleBtn($imageBtn, url);
                ***REMOVED***).val('');
                if (!env.isSupportTouch) ***REMOVED***
                    $imageUrl.trigger('focus');
                ***REMOVED***
                _this.bindEnterKey($imageUrl, $imageBtn);
            ***REMOVED***);
            _this.ui.onDialogHidden(_this.$dialog, function () ***REMOVED***
                $imageInput.off('change');
                $imageUrl.off('keyup paste keypress');
                $imageBtn.off('click');
                if (deferred.state() === 'pending') ***REMOVED***
                    deferred.reject();
                ***REMOVED***
            ***REMOVED***);
            _this.ui.showDialog(_this.$dialog);
        ***REMOVED***);
    ***REMOVED***;
    return ImageDialog;
***REMOVED***());

/**
 * Image popover module
 *  mouse events that show/hide popover will be handled by Handle.js.
 *  Handle.js will receive the events and invoke 'imagePopover.update'.
 */
var ImagePopover = /** @class */ (function () ***REMOVED***
    function ImagePopover(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.editable = context.layoutInfo.editable[0];
        this.options = context.options;
        this.events = ***REMOVED***
            'summernote.disable': function () ***REMOVED***
                _this.hide();
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    ImagePopover.prototype.shouldInitialize = function () ***REMOVED***
        return !lists.isEmpty(this.options.popover.image);
    ***REMOVED***;
    ImagePopover.prototype.initialize = function () ***REMOVED***
        this.$popover = this.ui.popover(***REMOVED***
            className: 'note-image-popover'
        ***REMOVED***).render().appendTo(this.options.container);
        var $content = this.$popover.find('.popover-content,.note-popover-content');
        this.context.invoke('buttons.build', $content, this.options.popover.image);
    ***REMOVED***;
    ImagePopover.prototype.destroy = function () ***REMOVED***
        this.$popover.remove();
    ***REMOVED***;
    ImagePopover.prototype.update = function (target) ***REMOVED***
        if (dom.isImg(target)) ***REMOVED***
            var pos = dom.posFromPlaceholder(target);
            var posEditor = dom.posFromPlaceholder(this.editable);
            this.$popover.css(***REMOVED***
                display: 'block',
                left: this.options.popatmouse ? event.pageX - 20 : pos.left,
                top: this.options.popatmouse ? event.pageY : Math.min(pos.top, posEditor.top)
            ***REMOVED***);
        ***REMOVED***
        else ***REMOVED***
            this.hide();
        ***REMOVED***
    ***REMOVED***;
    ImagePopover.prototype.hide = function () ***REMOVED***
        this.$popover.hide();
    ***REMOVED***;
    return ImagePopover;
***REMOVED***());

var TablePopover = /** @class */ (function () ***REMOVED***
    function TablePopover(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.options = context.options;
        this.events = ***REMOVED***
            'summernote.mousedown': function (we, e) ***REMOVED***
                _this.update(e.target);
            ***REMOVED***,
            'summernote.keyup summernote.scroll summernote.change': function () ***REMOVED***
                _this.update();
            ***REMOVED***,
            'summernote.disable': function () ***REMOVED***
                _this.hide();
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    TablePopover.prototype.shouldInitialize = function () ***REMOVED***
        return !lists.isEmpty(this.options.popover.table);
    ***REMOVED***;
    TablePopover.prototype.initialize = function () ***REMOVED***
        this.$popover = this.ui.popover(***REMOVED***
            className: 'note-table-popover'
        ***REMOVED***).render().appendTo(this.options.container);
        var $content = this.$popover.find('.popover-content,.note-popover-content');
        this.context.invoke('buttons.build', $content, this.options.popover.table);
        // [workaround] Disable Firefox's default table editor
        if (env.isFF) ***REMOVED***
            document.execCommand('enableInlineTableEditing', false, false);
        ***REMOVED***
    ***REMOVED***;
    TablePopover.prototype.destroy = function () ***REMOVED***
        this.$popover.remove();
    ***REMOVED***;
    TablePopover.prototype.update = function (target) ***REMOVED***
        if (this.context.isDisabled()) ***REMOVED***
            return false;
        ***REMOVED***
        var isCell = dom.isCell(target);
        if (isCell) ***REMOVED***
            var pos = dom.posFromPlaceholder(target);
            this.$popover.css(***REMOVED***
                display: 'block',
                left: pos.left,
                top: pos.top
            ***REMOVED***);
        ***REMOVED***
        else ***REMOVED***
            this.hide();
        ***REMOVED***
        return isCell;
    ***REMOVED***;
    TablePopover.prototype.hide = function () ***REMOVED***
        this.$popover.hide();
    ***REMOVED***;
    return TablePopover;
***REMOVED***());

var VideoDialog = /** @class */ (function () ***REMOVED***
    function VideoDialog(context) ***REMOVED***
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.$body = $$1(document.body);
        this.$editor = context.layoutInfo.editor;
        this.options = context.options;
        this.lang = this.options.langInfo;
    ***REMOVED***
    VideoDialog.prototype.initialize = function () ***REMOVED***
        var $container = this.options.dialogsInBody ? this.$body : this.$editor;
        var body = [
            '<div class="form-group note-form-group row-fluid">',
            "<label class=\"note-form-label\">" + this.lang.video.url + " <small class=\"text-muted\">" + this.lang.video.providers + "</small></label>",
            '<input class="note-video-url form-control note-form-control note-input" type="text" />',
            '</div>'
        ].join('');
        var buttonClass = 'btn btn-primary note-btn note-btn-primary note-video-btn';
        var footer = "<button type=\"submit\" href=\"#\" class=\"" + buttonClass + "\" disabled>" + this.lang.video.insert + "</button>";
        this.$dialog = this.ui.dialog(***REMOVED***
            title: this.lang.video.insert,
            fade: this.options.dialogsFade,
            body: body,
            footer: footer
        ***REMOVED***).render().appendTo($container);
    ***REMOVED***;
    VideoDialog.prototype.destroy = function () ***REMOVED***
        this.ui.hideDialog(this.$dialog);
        this.$dialog.remove();
    ***REMOVED***;
    VideoDialog.prototype.bindEnterKey = function ($input, $btn) ***REMOVED***
        $input.on('keypress', function (event) ***REMOVED***
            if (event.keyCode === key.code.ENTER) ***REMOVED***
                event.preventDefault();
                $btn.trigger('click');
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***;
    VideoDialog.prototype.createVideoNode = function (url) ***REMOVED***
        // video url patterns(youtube, instagram, vimeo, dailymotion, youku, mp4, ogg, webm)
        var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-)***REMOVED***11***REMOVED***)(?:\S+)?$/;
        var ytMatch = url.match(ytRegExp);
        var igRegExp = /(?:www\.|\/\/)instagram\.com\/p\/(.[a-zA-Z0-9_-]*)/;
        var igMatch = url.match(igRegExp);
        var vRegExp = /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/;
        var vMatch = url.match(vRegExp);
        var vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*(\d+)[?]?.*/;
        var vimMatch = url.match(vimRegExp);
        var dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
        var dmMatch = url.match(dmRegExp);
        var youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
        var youkuMatch = url.match(youkuRegExp);
        var qqRegExp = /\/\/v\.qq\.com.*?vid=(.+)/;
        var qqMatch = url.match(qqRegExp);
        var qqRegExp2 = /\/\/v\.qq\.com\/x?\/?(page|cover).*?\/([^\/]+)\.html\??.*/;
        var qqMatch2 = url.match(qqRegExp2);
        var mp4RegExp = /^.+.(mp4|m4v)$/;
        var mp4Match = url.match(mp4RegExp);
        var oggRegExp = /^.+.(ogg|ogv)$/;
        var oggMatch = url.match(oggRegExp);
        var webmRegExp = /^.+.(webm)$/;
        var webmMatch = url.match(webmRegExp);
        var $video;
        if (ytMatch && ytMatch[1].length === 11) ***REMOVED***
            var youtubeId = ytMatch[1];
            $video = $$1('<iframe>')
                .attr('frameborder', 0)
                .attr('src', '//www.youtube.com/embed/' + youtubeId)
                .attr('width', '640').attr('height', '360');
        ***REMOVED***
        else if (igMatch && igMatch[0].length) ***REMOVED***
            $video = $$1('<iframe>')
                .attr('frameborder', 0)
                .attr('src', 'https://instagram.com/p/' + igMatch[1] + '/embed/')
                .attr('width', '612').attr('height', '710')
                .attr('scrolling', 'no')
                .attr('allowtransparency', 'true');
        ***REMOVED***
        else if (vMatch && vMatch[0].length) ***REMOVED***
            $video = $$1('<iframe>')
                .attr('frameborder', 0)
                .attr('src', vMatch[0] + '/embed/simple')
                .attr('width', '600').attr('height', '600')
                .attr('class', 'vine-embed');
        ***REMOVED***
        else if (vimMatch && vimMatch[3].length) ***REMOVED***
            $video = $$1('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
                .attr('frameborder', 0)
                .attr('src', '//player.vimeo.com/video/' + vimMatch[3])
                .attr('width', '640').attr('height', '360');
        ***REMOVED***
        else if (dmMatch && dmMatch[2].length) ***REMOVED***
            $video = $$1('<iframe>')
                .attr('frameborder', 0)
                .attr('src', '//www.dailymotion.com/embed/video/' + dmMatch[2])
                .attr('width', '640').attr('height', '360');
        ***REMOVED***
        else if (youkuMatch && youkuMatch[1].length) ***REMOVED***
            $video = $$1('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
                .attr('frameborder', 0)
                .attr('height', '498')
                .attr('width', '510')
                .attr('src', '//player.youku.com/embed/' + youkuMatch[1]);
        ***REMOVED***
        else if ((qqMatch && qqMatch[1].length) || (qqMatch2 && qqMatch2[2].length)) ***REMOVED***
            var vid = ((qqMatch && qqMatch[1].length) ? qqMatch[1] : qqMatch2[2]);
            $video = $$1('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>')
                .attr('frameborder', 0)
                .attr('height', '310')
                .attr('width', '500')
                .attr('src', 'http://v.qq.com/iframe/player.html?vid=' + vid + '&amp;auto=0');
        ***REMOVED***
        else if (mp4Match || oggMatch || webmMatch) ***REMOVED***
            $video = $$1('<video controls>')
                .attr('src', url)
                .attr('width', '640').attr('height', '360');
        ***REMOVED***
        else ***REMOVED***
            // this is not a known video link. Now what, Cat? Now what?
            return false;
        ***REMOVED***
        $video.addClass('note-video-clip');
        return $video[0];
    ***REMOVED***;
    VideoDialog.prototype.show = function () ***REMOVED***
        var _this = this;
        var text = this.context.invoke('editor.getSelectedText');
        this.context.invoke('editor.saveRange');
        this.showVideoDialog(text).then(function (url) ***REMOVED***
            // [workaround] hide dialog before restore range for IE range focus
            _this.ui.hideDialog(_this.$dialog);
            _this.context.invoke('editor.restoreRange');
            // build node
            var $node = _this.createVideoNode(url);
            if ($node) ***REMOVED***
                // insert video node
                _this.context.invoke('editor.insertNode', $node);
            ***REMOVED***
        ***REMOVED***).fail(function () ***REMOVED***
            _this.context.invoke('editor.restoreRange');
        ***REMOVED***);
    ***REMOVED***;
    /**
     * show image dialog
     *
     * @param ***REMOVED***jQuery***REMOVED*** $dialog
     * @return ***REMOVED***Promise***REMOVED***
     */
    VideoDialog.prototype.showVideoDialog = function (text) ***REMOVED***
        var _this = this;
        return $$1.Deferred(function (deferred) ***REMOVED***
            var $videoUrl = _this.$dialog.find('.note-video-url');
            var $videoBtn = _this.$dialog.find('.note-video-btn');
            _this.ui.onDialogShown(_this.$dialog, function () ***REMOVED***
                _this.context.triggerEvent('dialog.shown');
                $videoUrl.val(text).on('input', function () ***REMOVED***
                    _this.ui.toggleBtn($videoBtn, $videoUrl.val());
                ***REMOVED***);
                if (!env.isSupportTouch) ***REMOVED***
                    $videoUrl.trigger('focus');
                ***REMOVED***
                $videoBtn.click(function (event) ***REMOVED***
                    event.preventDefault();
                    deferred.resolve($videoUrl.val());
                ***REMOVED***);
                _this.bindEnterKey($videoUrl, $videoBtn);
            ***REMOVED***);
            _this.ui.onDialogHidden(_this.$dialog, function () ***REMOVED***
                $videoUrl.off('input');
                $videoBtn.off('click');
                if (deferred.state() === 'pending') ***REMOVED***
                    deferred.reject();
                ***REMOVED***
            ***REMOVED***);
            _this.ui.showDialog(_this.$dialog);
        ***REMOVED***);
    ***REMOVED***;
    return VideoDialog;
***REMOVED***());

var HelpDialog = /** @class */ (function () ***REMOVED***
    function HelpDialog(context) ***REMOVED***
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.$body = $$1(document.body);
        this.$editor = context.layoutInfo.editor;
        this.options = context.options;
        this.lang = this.options.langInfo;
    ***REMOVED***
    HelpDialog.prototype.initialize = function () ***REMOVED***
        var $container = this.options.dialogsInBody ? this.$body : this.$editor;
        var body = [
            '<p class="text-center">',
            '<a href="http://summernote.org/" target="_blank">Summernote 0.8.9</a> · ',
            '<a href="https://github.com/summernote/summernote" target="_blank">Project</a> · ',
            '<a href="https://github.com/summernote/summernote/issues" target="_blank">Issues</a>',
            '</p>'
        ].join('');
        this.$dialog = this.ui.dialog(***REMOVED***
            title: this.lang.options.help,
            fade: this.options.dialogsFade,
            body: this.createShortcutList(),
            footer: body,
            callback: function ($node) ***REMOVED***
                $node.find('.modal-body,.note-modal-body').css(***REMOVED***
                    'max-height': 300,
                    'overflow': 'scroll'
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***).render().appendTo($container);
    ***REMOVED***;
    HelpDialog.prototype.destroy = function () ***REMOVED***
        this.ui.hideDialog(this.$dialog);
        this.$dialog.remove();
    ***REMOVED***;
    HelpDialog.prototype.createShortcutList = function () ***REMOVED***
        var _this = this;
        var keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
        return Object.keys(keyMap).map(function (key) ***REMOVED***
            var command = keyMap[key];
            var $row = $$1('<div><div class="help-list-item"/></div>');
            $row.append($$1('<label><kbd>' + key + '</kdb></label>').css(***REMOVED***
                'width': 180,
                'margin-right': 10
            ***REMOVED***)).append($$1('<span/>').html(_this.context.memo('help.' + command) || command));
            return $row.html();
        ***REMOVED***).join('');
    ***REMOVED***;
    /**
     * show help dialog
     *
     * @return ***REMOVED***Promise***REMOVED***
     */
    HelpDialog.prototype.showHelpDialog = function () ***REMOVED***
        var _this = this;
        return $$1.Deferred(function (deferred) ***REMOVED***
            _this.ui.onDialogShown(_this.$dialog, function () ***REMOVED***
                _this.context.triggerEvent('dialog.shown');
                deferred.resolve();
            ***REMOVED***);
            _this.ui.showDialog(_this.$dialog);
        ***REMOVED***).promise();
    ***REMOVED***;
    HelpDialog.prototype.show = function () ***REMOVED***
        var _this = this;
        this.context.invoke('editor.saveRange');
        this.showHelpDialog().then(function () ***REMOVED***
            _this.context.invoke('editor.restoreRange');
        ***REMOVED***);
    ***REMOVED***;
    return HelpDialog;
***REMOVED***());

var AIR_MODE_POPOVER_X_OFFSET = 20;
var AirPopover = /** @class */ (function () ***REMOVED***
    function AirPopover(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.options = context.options;
        this.events = ***REMOVED***
            'summernote.keyup summernote.mouseup summernote.scroll': function () ***REMOVED***
                _this.update();
            ***REMOVED***,
            'summernote.disable summernote.change summernote.dialog.shown': function () ***REMOVED***
                _this.hide();
            ***REMOVED***,
            'summernote.focusout': function (we, e) ***REMOVED***
                // [workaround] Firefox doesn't support relatedTarget on focusout
                //  - Ignore hide action on focus out in FF.
                if (env.isFF) ***REMOVED***
                    return;
                ***REMOVED***
                if (!e.relatedTarget || !dom.ancestor(e.relatedTarget, func.eq(_this.$popover[0]))) ***REMOVED***
                    _this.hide();
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    AirPopover.prototype.shouldInitialize = function () ***REMOVED***
        return this.options.airMode && !lists.isEmpty(this.options.popover.air);
    ***REMOVED***;
    AirPopover.prototype.initialize = function () ***REMOVED***
        this.$popover = this.ui.popover(***REMOVED***
            className: 'note-air-popover'
        ***REMOVED***).render().appendTo(this.options.container);
        var $content = this.$popover.find('.popover-content');
        this.context.invoke('buttons.build', $content, this.options.popover.air);
    ***REMOVED***;
    AirPopover.prototype.destroy = function () ***REMOVED***
        this.$popover.remove();
    ***REMOVED***;
    AirPopover.prototype.update = function () ***REMOVED***
        var styleInfo = this.context.invoke('editor.currentStyle');
        if (styleInfo.range && !styleInfo.range.isCollapsed()) ***REMOVED***
            var rect = lists.last(styleInfo.range.getClientRects());
            if (rect) ***REMOVED***
                var bnd = func.rect2bnd(rect);
                this.$popover.css(***REMOVED***
                    display: 'block',
                    left: Math.max(bnd.left + bnd.width / 2, 0) - AIR_MODE_POPOVER_X_OFFSET,
                    top: bnd.top + bnd.height
                ***REMOVED***);
                this.context.invoke('buttons.updateCurrentStyle', this.$popover);
            ***REMOVED***
        ***REMOVED***
        else ***REMOVED***
            this.hide();
        ***REMOVED***
    ***REMOVED***;
    AirPopover.prototype.hide = function () ***REMOVED***
        this.$popover.hide();
    ***REMOVED***;
    return AirPopover;
***REMOVED***());

var POPOVER_DIST = 5;
var HintPopover = /** @class */ (function () ***REMOVED***
    function HintPopover(context) ***REMOVED***
        var _this = this;
        this.context = context;
        this.ui = $$1.summernote.ui;
        this.$editable = context.layoutInfo.editable;
        this.options = context.options;
        this.hint = this.options.hint || [];
        this.direction = this.options.hintDirection || 'bottom';
        this.hints = $$1.isArray(this.hint) ? this.hint : [this.hint];
        this.events = ***REMOVED***
            'summernote.keyup': function (we, e) ***REMOVED***
                if (!e.isDefaultPrevented()) ***REMOVED***
                    _this.handleKeyup(e);
                ***REMOVED***
            ***REMOVED***,
            'summernote.keydown': function (we, e) ***REMOVED***
                _this.handleKeydown(e);
            ***REMOVED***,
            'summernote.disable summernote.dialog.shown': function () ***REMOVED***
                _this.hide();
            ***REMOVED***
        ***REMOVED***;
    ***REMOVED***
    HintPopover.prototype.shouldInitialize = function () ***REMOVED***
        return this.hints.length > 0;
    ***REMOVED***;
    HintPopover.prototype.initialize = function () ***REMOVED***
        var _this = this;
        this.lastWordRange = null;
        this.$popover = this.ui.popover(***REMOVED***
            className: 'note-hint-popover',
            hideArrow: true,
            direction: ''
        ***REMOVED***).render().appendTo(this.options.container);
        this.$popover.hide();
        this.$content = this.$popover.find('.popover-content,.note-popover-content');
        this.$content.on('click', '.note-hint-item', function () ***REMOVED***
            _this.$content.find('.active').removeClass('active');
            $$1(_this).addClass('active');
            _this.replace();
        ***REMOVED***);
    ***REMOVED***;
    HintPopover.prototype.destroy = function () ***REMOVED***
        this.$popover.remove();
    ***REMOVED***;
    HintPopover.prototype.selectItem = function ($item) ***REMOVED***
        this.$content.find('.active').removeClass('active');
        $item.addClass('active');
        this.$content[0].scrollTop = $item[0].offsetTop - (this.$content.innerHeight() / 2);
    ***REMOVED***;
    HintPopover.prototype.moveDown = function () ***REMOVED***
        var $current = this.$content.find('.note-hint-item.active');
        var $next = $current.next();
        if ($next.length) ***REMOVED***
            this.selectItem($next);
        ***REMOVED***
        else ***REMOVED***
            var $nextGroup = $current.parent().next();
            if (!$nextGroup.length) ***REMOVED***
                $nextGroup = this.$content.find('.note-hint-group').first();
            ***REMOVED***
            this.selectItem($nextGroup.find('.note-hint-item').first());
        ***REMOVED***
    ***REMOVED***;
    HintPopover.prototype.moveUp = function () ***REMOVED***
        var $current = this.$content.find('.note-hint-item.active');
        var $prev = $current.prev();
        if ($prev.length) ***REMOVED***
            this.selectItem($prev);
        ***REMOVED***
        else ***REMOVED***
            var $prevGroup = $current.parent().prev();
            if (!$prevGroup.length) ***REMOVED***
                $prevGroup = this.$content.find('.note-hint-group').last();
            ***REMOVED***
            this.selectItem($prevGroup.find('.note-hint-item').last());
        ***REMOVED***
    ***REMOVED***;
    HintPopover.prototype.replace = function () ***REMOVED***
        var $item = this.$content.find('.note-hint-item.active');
        if ($item.length) ***REMOVED***
            var node = this.nodeFromItem($item);
            // XXX: consider to move codes to editor for recording redo/undo.
            this.lastWordRange.insertNode(node);
            range.createFromNode(node).collapse().select();
            this.lastWordRange = null;
            this.hide();
            this.context.triggerEvent('change', this.$editable.html(), this.$editable[0]);
            this.context.invoke('editor.focus');
        ***REMOVED***
    ***REMOVED***;
    HintPopover.prototype.nodeFromItem = function ($item) ***REMOVED***
        var hint = this.hints[$item.data('index')];
        var item = $item.data('item');
        var node = hint.content ? hint.content(item) : item;
        if (typeof node === 'string') ***REMOVED***
            node = dom.createText(node);
        ***REMOVED***
        return node;
    ***REMOVED***;
    HintPopover.prototype.createItemTemplates = function (hintIdx, items) ***REMOVED***
        var hint = this.hints[hintIdx];
        return items.map(function (item, idx) ***REMOVED***
            var $item = $$1('<div class="note-hint-item"/>');
            $item.append(hint.template ? hint.template(item) : item + '');
            $item.data(***REMOVED***
                'index': hintIdx,
                'item': item
            ***REMOVED***);
            return $item;
        ***REMOVED***);
    ***REMOVED***;
    HintPopover.prototype.handleKeydown = function (e) ***REMOVED***
        if (!this.$popover.is(':visible')) ***REMOVED***
            return;
        ***REMOVED***
        if (e.keyCode === key.code.ENTER) ***REMOVED***
            e.preventDefault();
            this.replace();
        ***REMOVED***
        else if (e.keyCode === key.code.UP) ***REMOVED***
            e.preventDefault();
            this.moveUp();
        ***REMOVED***
        else if (e.keyCode === key.code.DOWN) ***REMOVED***
            e.preventDefault();
            this.moveDown();
        ***REMOVED***
    ***REMOVED***;
    HintPopover.prototype.searchKeyword = function (index, keyword, callback) ***REMOVED***
        var hint = this.hints[index];
        if (hint && hint.match.test(keyword) && hint.search) ***REMOVED***
            var matches = hint.match.exec(keyword);
            hint.search(matches[1], callback);
        ***REMOVED***
        else ***REMOVED***
            callback();
        ***REMOVED***
    ***REMOVED***;
    HintPopover.prototype.createGroup = function (idx, keyword) ***REMOVED***
        var _this = this;
        var $group = $$1('<div class="note-hint-group note-hint-group-' + idx + '"/>');
        this.searchKeyword(idx, keyword, function (items) ***REMOVED***
            items = items || [];
            if (items.length) ***REMOVED***
                $group.html(_this.createItemTemplates(idx, items));
                _this.show();
            ***REMOVED***
        ***REMOVED***);
        return $group;
    ***REMOVED***;
    HintPopover.prototype.handleKeyup = function (e) ***REMOVED***
        var _this = this;
        if (!lists.contains([key.code.ENTER, key.code.UP, key.code.DOWN], e.keyCode)) ***REMOVED***
            var wordRange = this.context.invoke('editor.createRange').getWordRange();
            var keyword_1 = wordRange.toString();
            if (this.hints.length && keyword_1) ***REMOVED***
                this.$content.empty();
                var bnd = func.rect2bnd(lists.last(wordRange.getClientRects()));
                if (bnd) ***REMOVED***
                    this.$popover.hide();
                    this.lastWordRange = wordRange;
                    this.hints.forEach(function (hint, idx) ***REMOVED***
                        if (hint.match.test(keyword_1)) ***REMOVED***
                            _this.createGroup(idx, keyword_1).appendTo(_this.$content);
                        ***REMOVED***
                    ***REMOVED***);
                    // select first .note-hint-item
                    this.$content.find('.note-hint-item:first').addClass('active');
                    // set position for popover after group is created
                    if (this.direction === 'top') ***REMOVED***
                        this.$popover.css(***REMOVED***
                            left: bnd.left,
                            top: bnd.top - this.$popover.outerHeight() - POPOVER_DIST
                        ***REMOVED***);
                    ***REMOVED***
                    else ***REMOVED***
                        this.$popover.css(***REMOVED***
                            left: bnd.left,
                            top: bnd.top + bnd.height + POPOVER_DIST
                        ***REMOVED***);
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
            else ***REMOVED***
                this.hide();
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***;
    HintPopover.prototype.show = function () ***REMOVED***
        this.$popover.show();
    ***REMOVED***;
    HintPopover.prototype.hide = function () ***REMOVED***
        this.$popover.hide();
    ***REMOVED***;
    return HintPopover;
***REMOVED***());

var Context = /** @class */ (function () ***REMOVED***
    /**
     * @param ***REMOVED***jQuery***REMOVED*** $note
     * @param ***REMOVED***Object***REMOVED*** options
     */
    function Context($note, options) ***REMOVED***
        this.ui = $$1.summernote.ui;
        this.$note = $note;
        this.memos = ***REMOVED******REMOVED***;
        this.modules = ***REMOVED******REMOVED***;
        this.layoutInfo = ***REMOVED******REMOVED***;
        this.options = options;
        this.initialize();
    ***REMOVED***
    /**
     * create layout and initialize modules and other resources
     */
    Context.prototype.initialize = function () ***REMOVED***
        this.layoutInfo = this.ui.createLayout(this.$note, this.options);
        this._initialize();
        this.$note.hide();
        return this;
    ***REMOVED***;
    /**
     * destroy modules and other resources and remove layout
     */
    Context.prototype.destroy = function () ***REMOVED***
        this._destroy();
        this.$note.removeData('summernote');
        this.ui.removeLayout(this.$note, this.layoutInfo);
    ***REMOVED***;
    /**
     * destory modules and other resources and initialize it again
     */
    Context.prototype.reset = function () ***REMOVED***
        var disabled = this.isDisabled();
        this.code(dom.emptyPara);
        this._destroy();
        this._initialize();
        if (disabled) ***REMOVED***
            this.disable();
        ***REMOVED***
    ***REMOVED***;
    Context.prototype._initialize = function () ***REMOVED***
        var _this = this;
        // add optional buttons
        var buttons = $$1.extend(***REMOVED******REMOVED***, this.options.buttons);
        Object.keys(buttons).forEach(function (key) ***REMOVED***
            _this.memo('button.' + key, buttons[key]);
        ***REMOVED***);
        var modules = $$1.extend(***REMOVED******REMOVED***, this.options.modules, $$1.summernote.plugins || ***REMOVED******REMOVED***);
        // add and initialize modules
        Object.keys(modules).forEach(function (key) ***REMOVED***
            _this.module(key, modules[key], true);
        ***REMOVED***);
        Object.keys(this.modules).forEach(function (key) ***REMOVED***
            _this.initializeModule(key);
        ***REMOVED***);
    ***REMOVED***;
    Context.prototype._destroy = function () ***REMOVED***
        var _this = this;
        // destroy modules with reversed order
        Object.keys(this.modules).reverse().forEach(function (key) ***REMOVED***
            _this.removeModule(key);
        ***REMOVED***);
        Object.keys(this.memos).forEach(function (key) ***REMOVED***
            _this.removeMemo(key);
        ***REMOVED***);
        // trigger custom onDestroy callback
        this.triggerEvent('destroy', this);
    ***REMOVED***;
    Context.prototype.code = function (html) ***REMOVED***
        var isActivated = this.invoke('codeview.isActivated');
        if (html === undefined) ***REMOVED***
            this.invoke('codeview.sync');
            return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
        ***REMOVED***
        else ***REMOVED***
            if (isActivated) ***REMOVED***
                this.layoutInfo.codable.val(html);
            ***REMOVED***
            else ***REMOVED***
                this.layoutInfo.editable.html(html);
            ***REMOVED***
            this.$note.val(html);
            this.triggerEvent('change', html);
        ***REMOVED***
    ***REMOVED***;
    Context.prototype.isDisabled = function () ***REMOVED***
        return this.layoutInfo.editable.attr('contenteditable') === 'false';
    ***REMOVED***;
    Context.prototype.enable = function () ***REMOVED***
        this.layoutInfo.editable.attr('contenteditable', true);
        this.invoke('toolbar.activate', true);
        this.triggerEvent('disable', false);
    ***REMOVED***;
    Context.prototype.disable = function () ***REMOVED***
        // close codeview if codeview is opend
        if (this.invoke('codeview.isActivated')) ***REMOVED***
            this.invoke('codeview.deactivate');
        ***REMOVED***
        this.layoutInfo.editable.attr('contenteditable', false);
        this.invoke('toolbar.deactivate', true);
        this.triggerEvent('disable', true);
    ***REMOVED***;
    Context.prototype.triggerEvent = function () ***REMOVED***
        var namespace = lists.head(arguments);
        var args = lists.tail(lists.from(arguments));
        var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
        if (callback) ***REMOVED***
            callback.apply(this.$note[0], args);
        ***REMOVED***
        this.$note.trigger('summernote.' + namespace, args);
    ***REMOVED***;
    Context.prototype.initializeModule = function (key) ***REMOVED***
        var module = this.modules[key];
        module.shouldInitialize = module.shouldInitialize || func.ok;
        if (!module.shouldInitialize()) ***REMOVED***
            return;
        ***REMOVED***
        // initialize module
        if (module.initialize) ***REMOVED***
            module.initialize();
        ***REMOVED***
        // attach events
        if (module.events) ***REMOVED***
            dom.attachEvents(this.$note, module.events);
        ***REMOVED***
    ***REMOVED***;
    Context.prototype.module = function (key, ModuleClass, withoutIntialize) ***REMOVED***
        if (arguments.length === 1) ***REMOVED***
            return this.modules[key];
        ***REMOVED***
        this.modules[key] = new ModuleClass(this);
        if (!withoutIntialize) ***REMOVED***
            this.initializeModule(key);
        ***REMOVED***
    ***REMOVED***;
    Context.prototype.removeModule = function (key) ***REMOVED***
        var module = this.modules[key];
        if (module.shouldInitialize()) ***REMOVED***
            if (module.events) ***REMOVED***
                dom.detachEvents(this.$note, module.events);
            ***REMOVED***
            if (module.destroy) ***REMOVED***
                module.destroy();
            ***REMOVED***
        ***REMOVED***
        delete this.modules[key];
    ***REMOVED***;
    Context.prototype.memo = function (key, obj) ***REMOVED***
        if (arguments.length === 1) ***REMOVED***
            return this.memos[key];
        ***REMOVED***
        this.memos[key] = obj;
    ***REMOVED***;
    Context.prototype.removeMemo = function (key) ***REMOVED***
        if (this.memos[key] && this.memos[key].destroy) ***REMOVED***
            this.memos[key].destroy();
        ***REMOVED***
        delete this.memos[key];
    ***REMOVED***;
    /**
     * Some buttons need to change their visual style immediately once they get pressed
     */
    Context.prototype.createInvokeHandlerAndUpdateState = function (namespace, value) ***REMOVED***
        var _this = this;
        return function (event) ***REMOVED***
            _this.createInvokeHandler(namespace, value)(event);
            _this.invoke('buttons.updateCurrentStyle');
        ***REMOVED***;
    ***REMOVED***;
    Context.prototype.createInvokeHandler = function (namespace, value) ***REMOVED***
        var _this = this;
        return function (event) ***REMOVED***
            event.preventDefault();
            var $target = $$1(event.target);
            _this.invoke(namespace, value || $target.closest('[data-value]').data('value'), $target);
        ***REMOVED***;
    ***REMOVED***;
    Context.prototype.invoke = function () ***REMOVED***
        var namespace = lists.head(arguments);
        var args = lists.tail(lists.from(arguments));
        var splits = namespace.split('.');
        var hasSeparator = splits.length > 1;
        var moduleName = hasSeparator && lists.head(splits);
        var methodName = hasSeparator ? lists.last(splits) : lists.head(splits);
        var module = this.modules[moduleName || 'editor'];
        if (!moduleName && this[methodName]) ***REMOVED***
            return this[methodName].apply(this, args);
        ***REMOVED***
        else if (module && module[methodName] && module.shouldInitialize()) ***REMOVED***
            return module[methodName].apply(module, args);
        ***REMOVED***
    ***REMOVED***;
    return Context;
***REMOVED***());

$$1.fn.extend(***REMOVED***
    /**
     * Summernote API
     *
     * @param ***REMOVED***Object|String***REMOVED***
     * @return ***REMOVED***this***REMOVED***
     */
    summernote: function () ***REMOVED***
        var type = $$1.type(lists.head(arguments));
        var isExternalAPICalled = type === 'string';
        var hasInitOptions = type === 'object';
        var options = $$1.extend(***REMOVED******REMOVED***, $$1.summernote.options, hasInitOptions ? lists.head(arguments) : ***REMOVED******REMOVED***);
        // Update options
        options.langInfo = $$1.extend(true, ***REMOVED******REMOVED***, $$1.summernote.lang['en-US'], $$1.summernote.lang[options.lang]);
        options.icons = $$1.extend(true, ***REMOVED******REMOVED***, $$1.summernote.options.icons, options.icons);
        options.tooltip = options.tooltip === 'auto' ? !env.isSupportTouch : options.tooltip;
        this.each(function (idx, note) ***REMOVED***
            var $note = $$1(note);
            if (!$note.data('summernote')) ***REMOVED***
                var context = new Context($note, options);
                $note.data('summernote', context);
                $note.data('summernote').triggerEvent('init', context.layoutInfo);
            ***REMOVED***
        ***REMOVED***);
        var $note = this.first();
        if ($note.length) ***REMOVED***
            var context = $note.data('summernote');
            if (isExternalAPICalled) ***REMOVED***
                return context.invoke.apply(context, lists.from(arguments));
            ***REMOVED***
            else if (options.focus) ***REMOVED***
                context.invoke('editor.focus');
            ***REMOVED***
        ***REMOVED***
        return this;
    ***REMOVED***
***REMOVED***);

$$1.summernote = $$1.extend($$1.summernote, ***REMOVED***
    version: '0.8.9',
    ui: ui,
    dom: dom,
    plugins: ***REMOVED******REMOVED***,
    options: ***REMOVED***
        modules: ***REMOVED***
            'editor': Editor,
            'clipboard': Clipboard,
            'dropzone': Dropzone,
            'codeview': CodeView,
            'statusbar': Statusbar,
            'fullscreen': Fullscreen,
            'handle': Handle,
            // FIXME: HintPopover must be front of autolink
            //  - Script error about range when Enter key is pressed on hint popover
            'hintPopover': HintPopover,
            'autoLink': AutoLink,
            'autoSync': AutoSync,
            'placeholder': Placeholder,
            'buttons': Buttons,
            'toolbar': Toolbar,
            'linkDialog': LinkDialog,
            'linkPopover': LinkPopover,
            'imageDialog': ImageDialog,
            'imagePopover': ImagePopover,
            'tablePopover': TablePopover,
            'videoDialog': VideoDialog,
            'helpDialog': HelpDialog,
            'airPopover': AirPopover
        ***REMOVED***,
        buttons: ***REMOVED******REMOVED***,
        lang: 'en-US',
        followingToolbar: true,
        otherStaticBar: '',
        // toolbar
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ],
        // popover
        popatmouse: true,
        popover: ***REMOVED***
            image: [
                ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]
            ],
            link: [
                ['link', ['linkDialogShow', 'unlink']]
            ],
            table: [
                ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
            ],
            air: [
                ['color', ['color']],
                ['font', ['bold', 'underline', 'clear']],
                ['para', ['ul', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture']]
            ]
        ***REMOVED***,
        // air mode: inline editor
        airMode: false,
        width: null,
        height: null,
        linkTargetBlank: true,
        focus: false,
        tabSize: 4,
        styleWithSpan: true,
        shortcuts: true,
        textareaAutoSync: true,
        hintDirection: 'bottom',
        tooltip: 'auto',
        container: 'body',
        maxTextLength: 0,
        styleTags: [
            'p',
            ***REMOVED*** title: 'Blockquote', tag: 'blockquote', className: 'blockquote', value: 'blockquote' ***REMOVED***,
            'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ],
        fontNames: [
            'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
            'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande',
            'Tahoma', 'Times New Roman', 'Verdana'
        ],
        fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36'],
        // pallete colors(n x n)
        colors: [
            ['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'],
            ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'],
            ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'],
            ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'],
            ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'],
            ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'],
            ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'],
            ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']
        ],
        lineHeights: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],
        tableClassName: 'table table-bordered',
        insertTableMaxSize: ***REMOVED***
            col: 10,
            row: 10
        ***REMOVED***,
        dialogsInBody: false,
        dialogsFade: false,
        maximumImageFileSize: null,
        callbacks: ***REMOVED***
            onInit: null,
            onFocus: null,
            onBlur: null,
            onBlurCodeview: null,
            onEnter: null,
            onKeyup: null,
            onKeydown: null,
            onImageUpload: null,
            onImageUploadError: null
        ***REMOVED***,
        codemirror: ***REMOVED***
            mode: 'text/html',
            htmlMode: true,
            lineNumbers: true
        ***REMOVED***,
        keyMap: ***REMOVED***
            pc: ***REMOVED***
                'ENTER': 'insertParagraph',
                'CTRL+Z': 'undo',
                'CTRL+Y': 'redo',
                'TAB': 'tab',
                'SHIFT+TAB': 'untab',
                'CTRL+B': 'bold',
                'CTRL+I': 'italic',
                'CTRL+U': 'underline',
                'CTRL+SHIFT+S': 'strikethrough',
                'CTRL+BACKSLASH': 'removeFormat',
                'CTRL+SHIFT+L': 'justifyLeft',
                'CTRL+SHIFT+E': 'justifyCenter',
                'CTRL+SHIFT+R': 'justifyRight',
                'CTRL+SHIFT+J': 'justifyFull',
                'CTRL+SHIFT+NUM7': 'insertUnorderedList',
                'CTRL+SHIFT+NUM8': 'insertOrderedList',
                'CTRL+LEFTBRACKET': 'outdent',
                'CTRL+RIGHTBRACKET': 'indent',
                'CTRL+NUM0': 'formatPara',
                'CTRL+NUM1': 'formatH1',
                'CTRL+NUM2': 'formatH2',
                'CTRL+NUM3': 'formatH3',
                'CTRL+NUM4': 'formatH4',
                'CTRL+NUM5': 'formatH5',
                'CTRL+NUM6': 'formatH6',
                'CTRL+ENTER': 'insertHorizontalRule',
                'CTRL+K': 'linkDialog.show'
            ***REMOVED***,
            mac: ***REMOVED***
                'ENTER': 'insertParagraph',
                'CMD+Z': 'undo',
                'CMD+SHIFT+Z': 'redo',
                'TAB': 'tab',
                'SHIFT+TAB': 'untab',
                'CMD+B': 'bold',
                'CMD+I': 'italic',
                'CMD+U': 'underline',
                'CMD+SHIFT+S': 'strikethrough',
                'CMD+BACKSLASH': 'removeFormat',
                'CMD+SHIFT+L': 'justifyLeft',
                'CMD+SHIFT+E': 'justifyCenter',
                'CMD+SHIFT+R': 'justifyRight',
                'CMD+SHIFT+J': 'justifyFull',
                'CMD+SHIFT+NUM7': 'insertUnorderedList',
                'CMD+SHIFT+NUM8': 'insertOrderedList',
                'CMD+LEFTBRACKET': 'outdent',
                'CMD+RIGHTBRACKET': 'indent',
                'CMD+NUM0': 'formatPara',
                'CMD+NUM1': 'formatH1',
                'CMD+NUM2': 'formatH2',
                'CMD+NUM3': 'formatH3',
                'CMD+NUM4': 'formatH4',
                'CMD+NUM5': 'formatH5',
                'CMD+NUM6': 'formatH6',
                'CMD+ENTER': 'insertHorizontalRule',
                'CMD+K': 'linkDialog.show'
            ***REMOVED***
        ***REMOVED***,
        icons: ***REMOVED***
            'align': 'note-icon-align',
            'alignCenter': 'note-icon-align-center',
            'alignJustify': 'note-icon-align-justify',
            'alignLeft': 'note-icon-align-left',
            'alignRight': 'note-icon-align-right',
            'rowBelow': 'note-icon-row-below',
            'colBefore': 'note-icon-col-before',
            'colAfter': 'note-icon-col-after',
            'rowAbove': 'note-icon-row-above',
            'rowRemove': 'note-icon-row-remove',
            'colRemove': 'note-icon-col-remove',
            'indent': 'note-icon-align-indent',
            'outdent': 'note-icon-align-outdent',
            'arrowsAlt': 'note-icon-arrows-alt',
            'bold': 'note-icon-bold',
            'caret': 'note-icon-caret',
            'circle': 'note-icon-circle',
            'close': 'note-icon-close',
            'code': 'note-icon-code',
            'eraser': 'note-icon-eraser',
            'font': 'note-icon-font',
            'frame': 'note-icon-frame',
            'italic': 'note-icon-italic',
            'link': 'note-icon-link',
            'unlink': 'note-icon-chain-broken',
            'magic': 'note-icon-magic',
            'menuCheck': 'note-icon-menu-check',
            'minus': 'note-icon-minus',
            'orderedlist': 'note-icon-orderedlist',
            'pencil': 'note-icon-pencil',
            'picture': 'note-icon-picture',
            'question': 'note-icon-question',
            'redo': 'note-icon-redo',
            'square': 'note-icon-square',
            'strikethrough': 'note-icon-strikethrough',
            'subscript': 'note-icon-subscript',
            'superscript': 'note-icon-superscript',
            'table': 'note-icon-table',
            'textHeight': 'note-icon-text-height',
            'trash': 'note-icon-trash',
            'underline': 'note-icon-underline',
            'undo': 'note-icon-undo',
            'unorderedlist': 'note-icon-unorderedlist',
            'video': 'note-icon-video'
        ***REMOVED***
    ***REMOVED***
***REMOVED***);

***REMOVED***)));
//# sourceMappingURL=summernote-bs4.js.map
