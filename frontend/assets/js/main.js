document.addEventListener('DOMContentLoaded', function () {
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  document.querySelectorAll('.nav-link').forEach(function (link) {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
});
