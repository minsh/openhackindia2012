(function(){

  /* Namespace. */
  window.app = window.app || {};

  $(function(){
    /* Centralised ajax error handling. */
    $(document).ajaxError(function(e, xhr, settings, exception){
      showlog('Ajax error',e,'xhr',xhr,'settings',settings,'exception',exception);
    });
  });

  /* Router. */
  window.App = Backbone.Router.extend({
    routes: {
        '*filter' : 'setFilter'
    }
    , initialize: function(){
      showlog('router:initialize');
      /* Init views. */
      this.searchView  = new window.app.SearchView({});
    }
    , setFilter: function(param){
      showlog('router:setFilter', param);
      param = param.trim() || '';
      switch(param){
        default: { 
          showlog('router:search');
          this.searchView.render();
        }
      }
    }
  });

  /* Main entry point. */

  $.getJSON("hackers.json", function(data) {
    window.hackers = data;
    console.log(window.hackers);
    window.app = new App();
    Backbone.history.start({root:'/'}); 
  });

})();