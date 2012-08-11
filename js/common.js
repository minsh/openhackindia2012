/* Make console.log wrapper so that it's working on IE as well. */
var showlog = function(){};
var debug = true;
if (debug && this.console && typeof console.log !== undefined){ 
  showlog = function(){ console.log(arguments); }
}
