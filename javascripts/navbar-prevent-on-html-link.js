function ready() {
   const url = document.URL

   const elementId = url.split("#")[1]

   let $nav;

   if (elementId) {

      $nav = $('div.navbar')

      if ( $nav.css('position') !== "fixed" ) return

      $(window).one('scroll', function () {
         window.scrollBy(0, -$nav.height() - 20)
      });
   }
}

document.addEventListener("DOMContentLoaded", ready);