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

  window.search = function(q){
    $('#search').val(q);
    window.searchView.onKey();
  }

  /* Main entry point. */

  $.getJSON("hackers.json", function(data) {
    window.hackers = data;
    var tagsArray = [];
    var companiesArray = [];
    _.each(hackers, function(v,k){
      tagsArray.push(v.tags);
      companiesArray.push(v.organization_name);
    });
    window.tags = _.uniq(_.flatten(tagsArray));
    window.companies = _.uniq(_.flatten(companiesArray));

    window.app = new App();
    Backbone.history.start({root:'/'}); 
  });


})();
