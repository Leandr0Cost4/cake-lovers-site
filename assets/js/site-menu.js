/*
  ============================================================
  MENU RESPONSIVO DO CABECALHO
  - MOBILE: menu embutido com botao de 3 linhas
  - DESKTOP: menu oculto por padrao e revelado ao subir a rolagem
    ou ao levar o cursor para o topo da tela
  ============================================================
*/
(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");
  var heroSection = document.querySelector(".hero-section");

  if (!header || !toggle || !nav) {
    return;
  }

  var mobileMedia = window.matchMedia("(max-width: 920px)");
  var navLinks = nav.querySelectorAll("a");
  var lastScrollY = window.scrollY;
  var pointerNearTop = false;
  var headerHovered = false;
  var desktopHideTimer = null;

  function isMobileContext() {
    return mobileMedia.matches;
  }

  function getDesktopPinnedLimit() {
    if (!heroSection) {
      return 140;
    }

    return Math.max(140, heroSection.offsetTop + heroSection.offsetHeight - 140);
  }

  function isInDesktopHeroZone() {
    return !isMobileContext() && window.scrollY <= getDesktopPinnedLimit();
  }

  function clearDesktopHideTimer() {
    if (desktopHideTimer) {
      window.clearTimeout(desktopHideTimer);
      desktopHideTimer = null;
    }
  }

  function setMobileMenuState(isOpen) {
    header.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen && isMobileContext());
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu do site" : "Abrir menu do site");
  }

  function setDesktopVisibility(isVisible) {
    if (isMobileContext()) {
      header.classList.remove("desktop-nav-visible");
      return;
    }

    header.classList.toggle("desktop-nav-visible", isVisible);
  }

  function closeMobileMenu() {
    setMobileMenuState(false);
  }

  function hideDesktopMenu() {
    clearDesktopHideTimer();

    if (isInDesktopHeroZone()) {
      setDesktopVisibility(true);
      return;
    }

    setDesktopVisibility(false);
  }

  function scheduleDesktopHide(delay) {
    if (isMobileContext()) {
      return;
    }

    clearDesktopHideTimer();
    desktopHideTimer = window.setTimeout(function () {
      if (isInDesktopHeroZone()) {
        setDesktopVisibility(true);
        return;
      }

      if (!pointerNearTop && !headerHovered) {
        setDesktopVisibility(false);
      }
    }, delay || 180);
  }

  function syncHeaderMode() {
    if (isMobileContext()) {
      clearDesktopHideTimer();
      header.classList.remove("desktop-nav-visible");
      pointerNearTop = false;
      headerHovered = false;
      setMobileMenuState(false);
      return;
    }

    setMobileMenuState(false);
    setDesktopVisibility(isInDesktopHeroZone());
  }

  toggle.addEventListener("click", function () {
    if (!isMobileContext()) {
      return;
    }

    setMobileMenuState(!header.classList.contains("menu-open"));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (isMobileContext()) {
        closeMobileMenu();
        return;
      }

      pointerNearTop = false;
      headerHovered = false;
      scheduleDesktopHide(120);
    });
  });

  header.addEventListener("mouseenter", function () {
    if (isMobileContext()) {
      return;
    }

    headerHovered = true;
    clearDesktopHideTimer();
    setDesktopVisibility(true);
  });

  header.addEventListener("mouseleave", function () {
    if (isMobileContext()) {
      return;
    }

    headerHovered = false;

    if (!pointerNearTop) {
      scheduleDesktopHide(140);
    }
  });

  document.addEventListener("mousemove", function (event) {
    if (isMobileContext()) {
      return;
    }

    if (event.clientY <= 86) {
      pointerNearTop = true;
      clearDesktopHideTimer();
      setDesktopVisibility(true);
      return;
    }

    if (pointerNearTop) {
      pointerNearTop = false;

      if (!headerHovered) {
        scheduleDesktopHide(160);
      }
    }
  });

  window.addEventListener("scroll", function () {
    var currentScrollY = window.scrollY;

    if (isMobileContext()) {
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY <= getDesktopPinnedLimit()) {
      clearDesktopHideTimer();
      setDesktopVisibility(true);
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY < lastScrollY - 8) {
      clearDesktopHideTimer();
      setDesktopVisibility(true);
    } else if (currentScrollY > lastScrollY + 8 && !pointerNearTop && !headerHovered) {
      hideDesktopMenu();
    }

    lastScrollY = currentScrollY;
  });

  window.addEventListener("resize", function () {
    syncHeaderMode();
    lastScrollY = window.scrollY;
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }

    if (isMobileContext()) {
      closeMobileMenu();
      return;
    }

    pointerNearTop = false;
    headerHovered = false;
    hideDesktopMenu();
  });

  document.addEventListener("click", function (event) {
    if (!isMobileContext()) {
      return;
    }

    if (!header.contains(event.target)) {
      closeMobileMenu();
    }
  });

  syncHeaderMode();
})();
