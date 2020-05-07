//MENU//

const menuToggle = document.getElementById("menu-toggle");
const menuNav = document.getElementById("menu-nav");
const cross = document.getElementById("cross");
const crossToggle = document.getElementById("cross-toggle");
const backTop = document.getElementById("back-to-top");
const dimBackground = document.getElementById("dim-background");




const toggleMenu = () => {
  console.log("called toggleMenu")
  menuNav.classList.toggle("menu-toggle")
  cross.classList.toggle("cross-toggle")
  jQuery("#menu-nav").appendTo("#dropdown")
  dimBackground.classList.toggle("dimmer")
}

const scrollTop = ()  => {
  console.log("called scrollTop")
    $('body,html').animate({
        scrollTop : 0
    }, 500);  
};


menuToggle.addEventListener("click", toggleMenu);
backTop.addEventListener("click", scrollTop);
