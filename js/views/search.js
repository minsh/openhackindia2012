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
      , 'submit form'           : 'submit'
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
    , submit : function(){
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
      var tags = [];
      var companies = [];
      var results = [];
      var resultsTags = [];
      var resultsCompanies = [];
      var regEx = new RegExp(q, 'gi');

      /* Search companies. */
      _.each(window.companies, function(c){
        if (c && c.match( regEx )) {
          companies.push(_.clone(c));
        } 
      });
      /* Search tags. */
      _.each(window.tags, function(t){
        if (t && t.match( regEx )) {
          tags.push(_.clone(t));
        }
      });

      _.each(window.hackers, function(h){
        /* Search hacker names. */
        if (h.full_name.match( regEx )) {
          results.push(_.clone(h));
        }
        /* Search hacker companies. */
        if(_.include(companies, h.organization_name)){
          resultsCompanies.push(_.clone(h));
        }
        /* Search hacker tags. */
        if(!_.isEmpty(_.intersection(tags, h.tags))){
          resultsTags.push(_.clone(h));
        }
      });

      results = _.union(results, resultsTags, resultsCompanies);

      $results.empty();
      /* Trim results. */
      results = _.first(results,50);

      function _prep(r){
        r.full_name = truncate(r.full_name, 20);  
        if (r.title){
          r.wtf = truncate(r.title+' @ '+r.organization_name, 30);
        } else {
          r.wtf = truncate(r.organization_name, 30);
        }
        var links = [];
        _.each(r.links,function(l,idx){
          console.log(l,idx);
          var re = new RegExp('(twitter)|(github)|(linkedin)|(facebook)');
          if (l.url.match(re)){ links.push(l); } 
        });
        r.links = links;
      }

      var len = results.length;
      for (var i=0; i<len; i+=2) {
        var r = results[i];
        _prep(r);
        var $row = $('<div style="display:inline-block;">').append(this.resultTempl(results[i]));
        if (i+1<len) {
          var r = results[i+1];
          _prep(r);
          $row.append(this.resultTempl(results[i+1]));
        } 
        $results.append( $row );
      } 

      return true;
    }
  });
})()
