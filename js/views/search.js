(function(){
  /* Namespace. */
  window.app = window.app || {};


  window.htmlize = function(partId, results, resultTempl){

    if (!results || !results.length){
      $('#results_entry').empty();
      $('#results_entry').append("no results found.");
      return;
    }
    console.log("showing "+((partId*30)+window.partitionedResults[partId].length)+" results / "+ (((window.partitionedResults.length-1)*30)+window.partitionedResults[window.partitionedResults.length-1].length));

    function _prep(r){
      r.full_name = truncate(r.full_name, 18);  
      if (r.title){
        r.wtf = truncate(truncate(r.title,20)+' @ '+r.organization_name, 28);
      } else {
        r.wtf = truncate(r.organization_name, 28);
      }

      var idx = r.wtf.indexOf('@');
      if (idx < 0) idx = -2;
      r.wtf = r.wtf.slice(0,idx+2) + '<a onclick=\'window.search("'+r.organization_name+'")\'>' + r.wtf.slice(idx+2) + '</a>';
      idx = r.wtf.indexOf('@');
      if (idx >= 0) {
        r.wtf = '<a onclick=\'window.search("'+r.title+'")\'>'+r.wtf.slice(0,idx-1)+'</a>'+r.wtf.slice(idx-1);
      }       

      var links = [];
      _.each(r.links,function(l,idx){
        //console.log(l,idx);
        var re = new RegExp('(twitter)|(github)|(linkedin)|(facebook)');
        if (l.url.match(re)){ links.push(l); } 
      });
      r.links = links;
    }

    var wasEmpty = !$('#results_entry').children().length;

    var len = results.length;
    for (var i=0; i<len; i+=2) {
      var r = results[i];
      _prep(r);
      $('#results_entry').append( resultTempl(r) );
      if (i+1<len) {
        var r = results[i+1];
        _prep(r);
        $('#results_entry').append( resultTempl(r) );
      } 
    } 

    if (wasEmpty) {
      $('#results_entry').masonry({
        itemSelector : '.result'
        , isAnimated:true
        , gutterWidth:20
        , isFitWith:true
        , columnWidth:460
      });
    } else {
      $('#results_entry').masonry('reload');
    } 
    $('#results_entry').imagesLoaded(function(){
      console.log('imagesLoaded -------------- ');
      $('#results_entry').masonry('reload');
    });
  }

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
      window.scrollLoading = false;
      var q = $.trim( this.$search.val() );
      var $results = $('#results_entry');
      if (q===''||q===' ') {
        $results.empty();
        return false;
      }
      console.log('q',q);
      var tags = [];
      var companies = [];
      var allResults = [];
      var resultsTitles = [];
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
          allResults.push(_.clone(h));
        }
        /* Search hacker titles. */
        if (h.title && h.title.match( regEx )) {
          resultsTitles.push(_.clone(h));
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

      allResults = _.union(allResults, resultsTitles, resultsCompanies, resultsTags);

      $results.empty();

      /* Partition results. */
      var temp = [];
      var partitionedResults = [];
      while (allResults.length){
        temp = _.first(allResults, 30);
        partitionedResults.push(temp);
        allResults = _.last(allResults, Math.max(allResults.length-30, 0))
      }

      window.partitionedResults = partitionedResults;
      
      /* Show first results. */
      var results = _.clone(partitionedResults[0]);
      htmlize(0,results, this.resultTempl);

      return true;
    }
  });
})()
