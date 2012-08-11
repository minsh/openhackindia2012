(function(){
  /* Namespace. */
  window.app = window.app || {};

  window.app.SearchView = Backbone.View.extend({
    el: '#search_entry'
    , initialize: function(){
      showlog('SearchView:initialize');
      this.template = _.template( $('#search_view_template').html() );
      this.resultTempl = _.template( $('#result_view_template').html() );
    } 
    , events : {
        'click      #search_btn'  : 'onClickSearchBtn' 
      , 'keyup  #search'      : 'onKey'
    }
    , render : function(){
      showlog('SearchView:render');
      this.$el.html( this.template() );
      this.$search = this.$('#search');
      return this;
    }
    , onClickSearchBtn  : function(e){
      showlog('SearchView:onClickSearchBtn');
      return false;
    }
    , onKey: function(e){
      showlog('SearchView:onKey');   
      var q = $.trim( this.$search.val() );
      var $results = $('#results_entry');
      if (q===''||q===' ') {
        $results.empty();
        return false;
      }
      console.log('q',q);

      var results = [];
      var regEx = new RegExp(q, 'gi');
      _.each(window.hackers, function(h){

        if (h.full_name.match( regEx )) {
          results.push(h);
        } 
      });
      
      $results.empty();
      /* Trim results. */
      results = _.first(results,50);
      _.each(results, function(r){
        $results.append( this.resultTempl(r) );
      }, this);

      return true;
    }
  });
})()
