"use strict";

const modalShow = document.querySelector(".page__modal");
const orderBtn = document.querySelectorAll("[data-to-basket]");

function toggleVisualModal() {
  modalShow.classList.toggle("page__modal--hide");
}

orderBtn.forEach(btn => {
    btn.addEventListener("click", (evt) => {
      evt.preventDefault();
      toggleVisualModal();
      document.body.style.overflow = "hidden";
    });
});


modalShow.addEventListener("click", (evt) => {
  if (evt.target === modalShow) {
    toggleVisualModal();
    document.body.removeAttribute("style");
  }
});

document.addEventListener("keydown", (evt) => {
  if (evt.code === "Escape" && !modalShow.classList.contains("page__modal--hide")) {
    toggleVisualModal();
    document.body.removeAttribute("style");
  }
});
