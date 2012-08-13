(function(){

  /* Namespace. */
  window.app = window.app || {};

  $(function(){
    /* Centralised ajax error handling. */
    $(document).ajaxError(function(e, xhr, settings, exception){
      showlog('Ajax error',e,'xhr',xhr,'settings',settings,'exception',exception);
    });
  });

var scrollevent;
var scrollTimeout;
var partitionIndex = 1;

window.scrollLoading = false;

  /* Router. */
  window.App = Backbone.Router.extend({
    routes: {
        '*filter' : 'setFilter'
    }
    , initialize: function(){
      showlog('router:initialize');
      /* Init views. */
      window.searchView  = new window.app.SearchView({});
    }
    , setFilter: function(param){
      showlog('router:setFilter', param);
      param = param.trim() || '';
      switch(param){
        default: { 
          showlog('router:search');
          window.searchView.render();
        }
      }
    }
  });

  window.search = function(q){
    $('#search').val(q);
    window.searchView.onKey();
  }

  /* Main entry point. */

  $.getJSON("hackers.json", function(data) {
    window.hackers = data;
    window.scrollLoading = false;
    var tagsArray = [];
    var companiesArray = [];
    _.each(hackers, function(v,k){
      tagsArray.push(v.tags);
      companiesArray.push(v.organization_name);
    });
    window.tags = _.uniq(_.flatten(tagsArray));
    window.companies = _.uniq(_.flatten(companiesArray));

    /* 
     * smartscroll: debounced scroll event for jQuery *
     * https://github.com/lukeshumard/smartscroll
     * based on smartresize by @louis_remi: https://github.com/lrbabe/jquery.smartresize.js *
     * Copyright 2011 Louis-Remi & lukeshumard * Licensed under the MIT license. 
     */
    scrollEvent = $.event;
    scrollEvent.special.smartscroll = {
      setup: function() {
        $(this).bind( "scroll", scrollEvent.special.smartscroll.handler );
      },
      teardown: function() {
        $(this).unbind( "scroll", scrollEvent.special.smartscroll.handler );
      },
      handler: function( scrollEvent, execAsap ) {
        // Save the context
        var context = this,
        args = arguments;

        // set correct scrollEvent type
        scrollEvent.type = "smartscroll";

        if (scrollTimeout) { clearTimeout(scrollTimeout); }
        scrollTimeout = setTimeout(function() {
          // showlog("smart");
          jQuery.event.handle.apply( context, args );
        }, execAsap === "execAsap"? 0 : 500);
      }
    };

    $.fn.smartscroll = function( fn ) {
      return fn ? this.bind( "smartscroll", fn ) : this.trigger( "smartscroll", ["execAsap"] );
    };
    /* bind smartscroll to window. */
    $(window).bind("smartscroll", function(evt) {
      /* Check scroll position only if not already loading. */
      if(!window.scrollLoading){
        // console.log($(window).scrollTop() + $(window).height(), $(document).height());
        if($(window).scrollTop() + $(window).height() > $(document).height()-1500) {
          loadMore();
        }
      }
    });

    window.loadMore = function(){
      window.scrollLoading = true;
      if (partitionIndex < window.partitionedResults.length){
        console.log("loadmore! ");
        htmlize(partitionIndex, window.partitionedResults[partitionIndex], window.searchView.resultTempl); 
        partitionIndex++;
        window.scrollLoading = false;
      }
    }

    window.app = new App();
    Backbone.history.start({root:'/'}); 
  });


})();
