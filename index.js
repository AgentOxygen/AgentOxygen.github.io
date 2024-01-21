/*
	Scrolling effect
	https://stackoverflow.com/questions/16670931/hide-scroll-bar-but-while-still-being-able-to-scroll
*/
var container = document.getElementById('container');
container.style.paddingRight = container.offsetWidth - container.clientWidth + "px";

/*
	Moving Text feature.
	https://tobiasahlin.com/moving-letters/
*/

// Wrap every letter in a span
var textWrapper = document.querySelector('.title_name');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline()
  .add({
    targets: '.title_name .letter',
    translateX: [40,0],
    translateZ: 0,
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 1200,
    delay: (el, i) => 500 + 30 * i
  });
anime.timeline().add({
    targets: '.title_menu_icon',
    translateX: [40,0],
    translateZ: 0,
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 1700,
	delay: (el, i) => 1000 + 30 * i
  });
  
  
// For clicking on the menu buttons
$(document).on('click', '.title_menu_icon', function(event) {
    console.log("test");
});