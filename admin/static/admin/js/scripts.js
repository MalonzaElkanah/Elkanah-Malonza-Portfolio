"use strict";

$(window).on("load", function () ***REMOVED***
  $(".loader").fadeOut("slow");
***REMOVED***);

feather.replace();
// Global
$(function () ***REMOVED***
  let sidebar_nicescroll_opts = ***REMOVED***
    cursoropacitymin: 0,
    cursoropacitymax: 0.8,
    zindex: 892
  ***REMOVED***,
    now_layout_class = null;

  var sidebar_sticky = function () ***REMOVED***
    if ($("body").hasClass("layout-2")) ***REMOVED***
      $("body.layout-2 #sidebar-wrapper").stick_in_parent(***REMOVED***
        parent: $("body")
      ***REMOVED***);
      $("body.layout-2 #sidebar-wrapper").stick_in_parent(***REMOVED*** recalc_every: 1 ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  sidebar_sticky();

  var sidebar_nicescroll;
  var update_sidebar_nicescroll = function () ***REMOVED***
    let a = setInterval(function () ***REMOVED***
      if (sidebar_nicescroll != null) sidebar_nicescroll.resize();
    ***REMOVED***, 10);

    setTimeout(function () ***REMOVED***
      clearInterval(a);
    ***REMOVED***, 600);
  ***REMOVED***;

  var sidebar_dropdown = function () ***REMOVED***
    if ($(".main-sidebar").length) ***REMOVED***
      $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
      sidebar_nicescroll = $(".main-sidebar").getNiceScroll();

      $(".main-sidebar .sidebar-menu li a.has-dropdown")
        .off("click")
        .on("click", function () ***REMOVED***
          var me = $(this);

          me.parent()
            .find("> .dropdown-menu")
            .slideToggle(500, function () ***REMOVED***
              update_sidebar_nicescroll();
              return false;
            ***REMOVED***);
          return false;
        ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  sidebar_dropdown();

  if ($("#top-5-scroll").length) ***REMOVED***
    $("#top-5-scroll")
      .css(***REMOVED***
        height: 315
      ***REMOVED***)
      .niceScroll();
  ***REMOVED***
  if ($("#scroll-new").length) ***REMOVED***
    $("#scroll-new")
      .css(***REMOVED***
        height: 200
      ***REMOVED***)
      .niceScroll();
  ***REMOVED***

  $(".main-content").css(***REMOVED***
    minHeight: $(window).outerHeight() - 95
  ***REMOVED***);

  $(".nav-collapse-toggle").click(function () ***REMOVED***
    $(this)
      .parent()
      .find(".navbar-nav")
      .toggleClass("show");
    return false;
  ***REMOVED***);

  $(document).on("click", function (e) ***REMOVED***
    $(".nav-collapse .navbar-nav").removeClass("show");
  ***REMOVED***);

  var toggle_sidebar_mini = function (mini) ***REMOVED***
    let body = $("body");

    if (!mini) ***REMOVED***
      body.removeClass("sidebar-mini");
      $(".main-sidebar").css(***REMOVED***
        overflow: "hidden"
      ***REMOVED***);
      setTimeout(function () ***REMOVED***
        $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
        sidebar_nicescroll = $(".main-sidebar").getNiceScroll();
      ***REMOVED***, 500);
      $(".main-sidebar .sidebar-menu > li > ul .dropdown-title").remove();
      $(".main-sidebar .sidebar-menu > li > a").removeAttr("data-toggle");
      $(".main-sidebar .sidebar-menu > li > a").removeAttr(
        "data-original-title"
      );
      $(".main-sidebar .sidebar-menu > li > a").removeAttr("title");
    ***REMOVED*** else ***REMOVED***
      body.addClass("sidebar-mini");
      body.removeClass("sidebar-show");
      sidebar_nicescroll.remove();
      sidebar_nicescroll = null;
      $(".main-sidebar .sidebar-menu > li").each(function () ***REMOVED***
        let me = $(this);

        if (me.find("> .dropdown-menu").length) ***REMOVED***
          me.find("> .dropdown-menu").hide();
          me.find("> .dropdown-menu").prepend(
            '<li class="dropdown-title pt-3">' + me.find("> a").text() + "</li>"
          );
        ***REMOVED*** else ***REMOVED***
          me.find("> a").attr("data-toggle", "tooltip");
          me.find("> a").attr("data-original-title", me.find("> a").text());
          $("[data-toggle='tooltip']").tooltip(***REMOVED***
            placement: "right"
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;

  // sticky header toggle function
  var toggle_sticky_header = function (sticky) ***REMOVED***
    if (!sticky) ***REMOVED***
      $(".main-navbar")[0].classList.remove("sticky");
    ***REMOVED*** else ***REMOVED***
      $(".main-navbar")[0].classList += " sticky";
    ***REMOVED***
  ***REMOVED***;

  $('.menu-toggle').on('click', function (e) ***REMOVED***
    var $this = $(this);
    $this.toggleClass('toggled');

  ***REMOVED***);

  $.each($('.main-sidebar .sidebar-menu li.active'), function (i, val) ***REMOVED***
    var $activeAnchors = $(val).find('a:eq(0)');

    $activeAnchors.addClass('toggled');
    $activeAnchors.next().show();
  ***REMOVED***);

  $("[data-toggle='sidebar']").click(function () ***REMOVED***
    var body = $("body"),
      w = $(window);

    if (w.outerWidth() <= 1024) ***REMOVED***
      body.removeClass("search-show search-gone");
      if (body.hasClass("sidebar-gone")) ***REMOVED***
        body.removeClass("sidebar-gone");
        body.addClass("sidebar-show");
      ***REMOVED*** else ***REMOVED***
        body.addClass("sidebar-gone");
        body.removeClass("sidebar-show");
      ***REMOVED***

      update_sidebar_nicescroll();
    ***REMOVED*** else ***REMOVED***
      body.removeClass("search-show search-gone");
      if (body.hasClass("sidebar-mini")) ***REMOVED***
        toggle_sidebar_mini(false);
      ***REMOVED*** else ***REMOVED***
        toggle_sidebar_mini(true);
      ***REMOVED***
    ***REMOVED***

    return false;
  ***REMOVED***);

  var toggleLayout = function () ***REMOVED***
    var w = $(window),
      layout_class = $("body").attr("class") || "",
      layout_classes =
        layout_class.trim().length > 0 ? layout_class.split(" ") : "";

    if (layout_classes.length > 0) ***REMOVED***
      layout_classes.forEach(function (item) ***REMOVED***
        if (item.indexOf("layout-") != -1) ***REMOVED***
          now_layout_class = item;
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***

    if (w.outerWidth() <= 1024) ***REMOVED***
      if ($("body").hasClass("sidebar-mini")) ***REMOVED***
        toggle_sidebar_mini(false);
        $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
        sidebar_nicescroll = $(".main-sidebar").getNiceScroll();
      ***REMOVED***

      $("body").addClass("sidebar-gone");
      $("body").removeClass("layout-2 layout-3 sidebar-mini sidebar-show");
      $("body")
        .off("click")
        .on("click", function (e) ***REMOVED***
          if (
            $(e.target).hasClass("sidebar-show") ||
            $(e.target).hasClass("search-show")
          ) ***REMOVED***
            $("body").removeClass("sidebar-show");
            $("body").addClass("sidebar-gone");
            $("body").removeClass("search-show");

            update_sidebar_nicescroll();
          ***REMOVED***
        ***REMOVED***);

      update_sidebar_nicescroll();

      if (now_layout_class == "layout-3") ***REMOVED***
        let nav_second_classes = $(".navbar-secondary").attr("class"),
          nav_second = $(".navbar-secondary");

        nav_second.attr("data-nav-classes", nav_second_classes);
        nav_second.removeAttr("class");
        nav_second.addClass("main-sidebar");

        let main_sidebar = $(".main-sidebar");
        main_sidebar
          .find(".container")
          .addClass("sidebar-wrapper")
          .removeClass("container");
        main_sidebar
          .find(".navbar-nav")
          .addClass("sidebar-menu")
          .removeClass("navbar-nav");
        main_sidebar.find(".sidebar-menu .nav-item.dropdown.show a").click();
        main_sidebar.find(".sidebar-brand").remove();
        main_sidebar.find(".sidebar-menu").before(
          $("<div>", ***REMOVED***
            class: "sidebar-brand"
          ***REMOVED***).append(
            $("<a>", ***REMOVED***
              href: $(".navbar-brand").attr("href")
            ***REMOVED***).html($(".navbar-brand").html())
          )
        );
        setTimeout(function () ***REMOVED***
          sidebar_nicescroll = main_sidebar.niceScroll(sidebar_nicescroll_opts);
          sidebar_nicescroll = main_sidebar.getNiceScroll();
        ***REMOVED***, 700);

        sidebar_dropdown();
        $(".main-wrapper").removeClass("container");
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      $("body").removeClass("sidebar-gone sidebar-show");
      if (now_layout_class) $("body").addClass(now_layout_class);

      let nav_second_classes = $(".main-sidebar").attr("data-nav-classes"),
        nav_second = $(".main-sidebar");

      if (
        now_layout_class == "layout-3" &&
        nav_second.hasClass("main-sidebar")
      ) ***REMOVED***
        nav_second.find(".sidebar-menu li a.has-dropdown").off("click");
        nav_second.find(".sidebar-brand").remove();
        nav_second.removeAttr("class");
        nav_second.addClass(nav_second_classes);

        let main_sidebar = $(".navbar-secondary");
        main_sidebar
          .find(".sidebar-wrapper")
          .addClass("container")
          .removeClass("sidebar-wrapper");
        main_sidebar
          .find(".sidebar-menu")
          .addClass("navbar-nav")
          .removeClass("sidebar-menu");
        main_sidebar.find(".dropdown-menu").hide();
        main_sidebar.removeAttr("style");
        main_sidebar.removeAttr("tabindex");
        main_sidebar.removeAttr("data-nav-classes");
        $(".main-wrapper").addClass("container");
        // if(sidebar_nicescroll != null)
        //   sidebar_nicescroll.remove();
      ***REMOVED*** else if (now_layout_class == "layout-2") ***REMOVED***
        $("body").addClass("layout-2");
      ***REMOVED*** else ***REMOVED***
        update_sidebar_nicescroll();
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
  toggleLayout();
  $(window).resize(toggleLayout);

  $("[data-toggle='search']").click(function () ***REMOVED***
    var body = $("body");

    if (body.hasClass("search-gone")) ***REMOVED***
      body.addClass("search-gone");
      body.removeClass("search-show");
    ***REMOVED*** else ***REMOVED***
      body.removeClass("search-gone");
      body.addClass("search-show");
    ***REMOVED***
  ***REMOVED***);

  // tooltip
  $("[data-toggle='tooltip']").tooltip();

  // popover
  $('[data-toggle="popover"]').popover(***REMOVED***
    container: "body"
  ***REMOVED***);

  // Select2
  if (jQuery().select2) ***REMOVED***
    $(".select2").select2();
  ***REMOVED***

  // Selectric
  if (jQuery().selectric) ***REMOVED***
    $(".selectric").selectric(***REMOVED***
      disableOnMobile: false,
      nativeOnMobile: false
    ***REMOVED***);
  ***REMOVED***

  $(".notification-toggle").dropdown();
  $(".notification-toggle")
    .parent()
    .on("shown.bs.dropdown", function () ***REMOVED***
      $(".dropdown-list-icons").niceScroll(***REMOVED***
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.8,
        cursorwidth: 7
      ***REMOVED***);
    ***REMOVED***);

  $(".message-toggle").dropdown();
  $(".message-toggle")
    .parent()
    .on("shown.bs.dropdown", function () ***REMOVED***
      $(".dropdown-list-message").niceScroll(***REMOVED***
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.8,
        cursorwidth: 7
      ***REMOVED***);
    ***REMOVED***);

  if (jQuery().summernote) ***REMOVED***
    $(".summernote").summernote(***REMOVED***
      dialogsInBody: true,
      minHeight: 250
    ***REMOVED***);
    $(".summernote-simple").summernote(***REMOVED***
      dialogsInBody: true,
      minHeight: 150,
      toolbar: [
        ["style", ["bold", "italic", "underline", "clear"]],
        ["font", ["strikethrough"]],
        ["para", ["paragraph"]]
      ]
    ***REMOVED***);
  ***REMOVED***

  // Dismiss function
  $("[data-dismiss]").each(function () ***REMOVED***
    var me = $(this),
      target = me.data("dismiss");

    me.click(function () ***REMOVED***
      $(target).fadeOut(function () ***REMOVED***
        $(target).remove();
      ***REMOVED***);
      return false;
    ***REMOVED***);
  ***REMOVED***);

  // Collapsable
  $("[data-collapse]").each(function () ***REMOVED***
    var me = $(this),
      target = me.data("collapse");

    me.click(function () ***REMOVED***
      $(target).collapse("toggle");
      $(target).on("shown.bs.collapse", function () ***REMOVED***
        me.html('<i class="fas fa-minus"></i>');
      ***REMOVED***);
      $(target).on("hidden.bs.collapse", function () ***REMOVED***
        me.html('<i class="fas fa-plus"></i>');
      ***REMOVED***);
      return false;
    ***REMOVED***);
  ***REMOVED***);

  // Background
  $("[data-background]").each(function () ***REMOVED***
    var me = $(this);
    me.css(***REMOVED***
      backgroundImage: "url(" + me.data("background") + ")"
    ***REMOVED***);
  ***REMOVED***);

  // Custom Tab
  $("[data-tab]").each(function () ***REMOVED***
    var me = $(this);

    me.click(function () ***REMOVED***
      if (!me.hasClass("active")) ***REMOVED***
        var tab_group = $('[data-tab-group="' + me.data("tab") + '"]'),
          tab_group_active = $(
            '[data-tab-group="' + me.data("tab") + '"].active'
          ),
          target = $(me.attr("href")),
          links = $('[data-tab="' + me.data("tab") + '"]');

        links.removeClass("active");
        me.addClass("active");
        target.addClass("active");
        tab_group_active.removeClass("active");
      ***REMOVED***
      return false;
    ***REMOVED***);
  ***REMOVED***);

  // Bootstrap 4 Validation
  $(".needs-validation").submit(function () ***REMOVED***
    var form = $(this);
    if (form[0].checkValidity() === false) ***REMOVED***
      event.preventDefault();
      event.stopPropagation();
    ***REMOVED***
    form.addClass("was-validated");
  ***REMOVED***);

  // alert dismissible
  $(".alert-dismissible").each(function () ***REMOVED***
    var me = $(this);

    me.find(".close").click(function () ***REMOVED***
      me.alert("close");
    ***REMOVED***);
  ***REMOVED***);

  if ($(".main-navbar").length) ***REMOVED***
  ***REMOVED***

  // Image cropper
  $("[data-crop-image]").each(function (e) ***REMOVED***
    $(this).css(***REMOVED***
      overflow: "hidden",
      position: "relative",
      height: $(this).data("crop-image")
    ***REMOVED***);
  ***REMOVED***);

  // Slide Toggle
  $("[data-toggle-slide]").click(function () ***REMOVED***
    let target = $(this).data("toggle-slide");

    $(target).slideToggle();
    return false;
  ***REMOVED***);

  // Dismiss modal
  $("[data-dismiss=modal]").click(function () ***REMOVED***
    $(this)
      .closest(".modal")
      .modal("hide");

    return false;
  ***REMOVED***);

  // Width attribute
  $("[data-width]").each(function () ***REMOVED***
    $(this).css(***REMOVED***
      width: $(this).data("width")
    ***REMOVED***);
  ***REMOVED***);

  // Height attribute
  $("[data-height]").each(function () ***REMOVED***
    $(this).css(***REMOVED***
      height: $(this).data("height")
    ***REMOVED***);
  ***REMOVED***);

  // Chocolat
  if ($(".chocolat-parent").length && jQuery().Chocolat) ***REMOVED***
    $(".chocolat-parent").Chocolat();
  ***REMOVED***

  // Sortable card
  if ($(".sortable-card").length && jQuery().sortable) ***REMOVED***
    $(".sortable-card").sortable(***REMOVED***
      handle: ".card-header",
      opacity: 0.8,
      tolerance: "pointer"
    ***REMOVED***);
  ***REMOVED***

  // Daterangepicker
  if (jQuery().daterangepicker) ***REMOVED***
    if ($(".datepicker").length) ***REMOVED***
      $(".datepicker").daterangepicker(***REMOVED***
        locale: ***REMOVED*** format: "YYYY-MM-DD" ***REMOVED***,
        singleDatePicker: true
      ***REMOVED***);
    ***REMOVED***
    if ($(".datetimepicker").length) ***REMOVED***
      $(".datetimepicker").daterangepicker(***REMOVED***
        locale: ***REMOVED*** format: "YYYY-MM-DD HH:mm" ***REMOVED***,
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true
      ***REMOVED***);
    ***REMOVED***
    if ($(".daterange").length) ***REMOVED***
      $(".daterange").daterangepicker(***REMOVED***
        locale: ***REMOVED*** format: "YYYY-MM-DD" ***REMOVED***,
        drops: "down",
        opens: "right"
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***

  // Timepicker
  if (jQuery().timepicker && $(".timepicker").length) ***REMOVED***
    $(".timepicker").timepicker(***REMOVED***
      icons: ***REMOVED***
        up: "fas fa-chevron-up",
        down: "fas fa-chevron-down"
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  $("#mini_sidebar_setting").on("change", function () ***REMOVED***
    var _val = $(this).is(":checked") ? "checked" : "unchecked";
    if (_val === "checked") ***REMOVED***
      toggle_sidebar_mini(true);
    ***REMOVED*** else ***REMOVED***
      toggle_sidebar_mini(false);
    ***REMOVED***
  ***REMOVED***);
  $("#sticky_header_setting").on("change", function () ***REMOVED***
    if ($(".main-navbar")[0].classList.contains("sticky")) ***REMOVED***
      toggle_sticky_header(false);
    ***REMOVED*** else ***REMOVED***
      toggle_sticky_header(true);
    ***REMOVED***
  ***REMOVED***);

  $(".theme-setting-toggle").on("click", function () ***REMOVED***
    if ($(".theme-setting")[0].classList.contains("active")) ***REMOVED***
      $(".theme-setting")[0].classList.remove("active");
    ***REMOVED*** else ***REMOVED***
      $(".theme-setting")[0].classList += " active";
    ***REMOVED***
  ***REMOVED***);

  // full screen call

  $(document).on("click", ".fullscreen-btn", function (e) ***REMOVED***
    if (
      !document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) ***REMOVED***
      // current working methods
      if (document.documentElement.requestFullscreen) ***REMOVED***
        document.documentElement.requestFullscreen();
      ***REMOVED*** else if (document.documentElement.msRequestFullscreen) ***REMOVED***
        document.documentElement.msRequestFullscreen();
      ***REMOVED*** else if (document.documentElement.mozRequestFullScreen) ***REMOVED***
        document.documentElement.mozRequestFullScreen();
      ***REMOVED*** else if (document.documentElement.webkitRequestFullscreen) ***REMOVED***
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      if (document.exitFullscreen) ***REMOVED***
        document.exitFullscreen();
      ***REMOVED*** else if (document.msExitFullscreen) ***REMOVED***
        document.msExitFullscreen();
      ***REMOVED*** else if (document.mozCancelFullScreen) ***REMOVED***
        document.mozCancelFullScreen();
      ***REMOVED*** else if (document.webkitExitFullscreen) ***REMOVED***
        document.webkitExitFullscreen();
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);

  // setting sidebar

  $(".settingPanelToggle").on("click", function () ***REMOVED***
    $(".settingSidebar").toggleClass("showSettingPanel");
  ***REMOVED***),
    $(".page-wrapper").on("click", function () ***REMOVED***
      $(".settingSidebar").removeClass("showSettingPanel");
    ***REMOVED***);

  // close right sidebar when click outside
  var mouse_is_inside = false;
  $(".settingSidebar").hover(
    function () ***REMOVED***
      mouse_is_inside = true;
    ***REMOVED***,
    function () ***REMOVED***
      mouse_is_inside = false;
    ***REMOVED***
  );

  $("body").mouseup(function () ***REMOVED***
    if (!mouse_is_inside) $(".settingSidebar").removeClass("showSettingPanel");
  ***REMOVED***);

  $(".settingSidebar-body").niceScroll();

  // theme change event
  $(".choose-theme li").on("click", function () ***REMOVED***
    var bodytag = $("body"),
      selectedTheme = $(this),
      prevTheme = $(".choose-theme li.active").attr("title");

    $(".choose-theme li").removeClass("active"),
      selectedTheme.addClass("active");
    $(".choose-theme li.active").data("theme");

    bodytag.removeClass("theme-" + prevTheme);
    bodytag.addClass("theme-" + $(this).attr("title"));
  ***REMOVED***);

  // dark light sidebar button setting
  $(".sidebar-color input:radio").change(function () ***REMOVED***
    if ($(this).val() == "1") ***REMOVED***
      $("body").removeClass("dark-sidebar");
      $("body").addClass("light-sidebar");
    ***REMOVED*** else ***REMOVED***
      $("body").removeClass("light-sidebar");
      $("body").addClass("dark-sidebar");
    ***REMOVED***
  ***REMOVED***);

  // dark light layout button setting
  $(".layout-color input:radio").change(function () ***REMOVED***
    if ($(this).val() == "1") ***REMOVED***
      $("body").removeClass();
      $("body").addClass("light");
      $("body").addClass("light-sidebar");
      $("body").addClass("theme-white");

      $(".choose-theme li").removeClass("active");
      $(".choose-theme li[title|='white']").addClass("active");
      $(".selectgroup-input[value|='1']").prop("checked", true);
    ***REMOVED*** else ***REMOVED***
      $("body").removeClass();
      $("body").addClass("dark");
      $("body").addClass("dark-sidebar");
      $("body").addClass("theme-black");

      $(".choose-theme li").removeClass("active");
      $(".choose-theme li[title|='black']").addClass("active");
      $(".selectgroup-input[value|='2']").prop("checked", true);
    ***REMOVED***
  ***REMOVED***);

  // restore default to dark theme
  $(".btn-restore-theme").on("click", function () ***REMOVED***
    //remove all class from body
    $("body").removeClass();
    jQuery("body").addClass("light");
    jQuery("body").addClass("light-sidebar");
    jQuery("body").addClass("theme-white");

    // set default theme
    $(".choose-theme li").removeClass("active");
    $(".choose-theme li[title|='white']").addClass("active");

    $(".select-layout[value|='1']").prop("checked", true);
    $(".select-sidebar[value|='2']").prop("checked", true);
    toggle_sidebar_mini(false);
    $("#mini_sidebar_setting").prop("checked", false);
    $("#sticky_header_setting").prop("checked", true);
    toggle_sticky_header(true);
  ***REMOVED***);

  //start up class add

  //add default class on body tag
  /*
  jQuery("body").addClass("light");
  jQuery("body").addClass("light-sidebar");
  jQuery("body").addClass("theme-white");
  // set theme default color
  $(".choose-theme li").removeClass("active");
  $(".choose-theme li[title|='white']").addClass("active");
  //set default dark or light layout(1=light, 2=dark)
  $(".select-layout[value|='1']").prop("checked", true);
  //set default dark or light sidebar(1=light, 2=dark)
  $(".select-sidebar[value|='1']").prop("checked", true);
  // sticky header default set to true
  $("#sticky_header_setting").prop("checked", true);
  */
***REMOVED***);
