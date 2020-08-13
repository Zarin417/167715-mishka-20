"use strict";

const menuButton = document.querySelector(".main-nav__menu-button");
const mainMenu = document.querySelector(".main-nav__main-menu");
const userMenu = document.querySelector(".main-nav__user-menu");

menuButton.classList.remove("main-nav__menu-button--close");
mainMenu.classList.remove("main-nav__main-menu--no-js");
userMenu.classList.remove("main-nav__user-menu--no-js");

menuButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  menuButton.classList.toggle("main-nav__menu-button--close");
  mainMenu.classList.toggle("main-nav__main-menu--opened");
  userMenu.classList.toggle("main-nav__user-menu--opened");
});
