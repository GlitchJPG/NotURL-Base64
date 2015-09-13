var matchRegex = /\?(.*?)\?/g;
var HtmlDefault = document.body.innerHTML.toString();
newHtml = HtmlDefault;
var parser = new DOMParser();

function resolve (url) {
  var data = atob(url);
  $("." + url).attr("href", data);
  $("." + url).text(data);
}

var thingsToLinkify = [];

while (1) {
  var result = matchRegex.exec(HtmlDefault);
  if (result == null) {
    break;
  }
  result = result[0];
  if (result.indexOf(" ") == -1) {
    var qmStrip = result.substring(1, result.length - 1);
    try {
      var data = atob(qmStrip);
      var finalLink = "<a href=\"" + data + "\" class=\"" + qmStrip + "\">NotURL Link</a> \
      <sup><a style=\"color: red;\" href=\"javascript:void(0)\" class=\"resolve\" resData=\"" + qmStrip + "\">resolve</a></sup>";
      newHtml = newHtml.replace(result, finalLink);
      HtmlDefault = HtmlDefault.replace(result, "");
      thingsToLinkify.push([result, finalLink]);
    } catch() {
      console.log("Decoded string was not valid Base64");
    }
  } else {
    HtmlDefault = HtmlDefault.replace(result, "");
  }
}

// I got this concept from the XKCD Substitutions extension. Thanks!
var linkifyEverything = (function() {
    return function(node) {
        for (i = 0; i <= thingsToLinkify.length - 1; i++) {
          if (node.nodeValue.indexOf(thingsToLinkify[i][0]) != -1 && node.parentNode && node.parentElement && node.parentElement.tagName.toLowerCase() !== "textarea") {
            console.log(node.parentElement.tagName.toLowerCase());
            var replacedLink = document.createElement("lfmt");
            $(replacedLink).html(node.nodeValue.replace(thingsToLinkify[i][0], thingsToLinkify[i][1]));
            node.parentNode.replaceChild(replacedLink, node);
          }
        }
    };
})();

var node, iter;
var iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
while ((node = iter.nextNode())) {
    linkifyEverything(node);
}

$(".resolve").click(function(){
  console.log("Resolving a URL");
  var dataToResolve = $(this).attr("resdata");
  resolve(dataToResolve);
  $(".resolve").each(function(index, element){
    if ($(element).attr("resData") == dataToResolve) {
      $(element).html("");
    }
  });
});

console.log("NotURL has completed linkifying this document.");
