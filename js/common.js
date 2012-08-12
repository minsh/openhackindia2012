/* Make console.log wrapper so that it's working on IE as well. */
var showlog = function(){};
var debug = true;
if (debug && this.console && typeof console.log !== undefined){ 
  showlog = function(){ console.log(arguments); }
}

/* Utility function to truncate strings that have no spaces. */
function truncate(str, size) {
  if (str.length > size+3){
    var t = str.substr(0, size);
    t = t + "...";
    return t;
  }
  return str;
}
