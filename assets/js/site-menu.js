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

  function applyMobileHeaderFixes() {
    if (document.getElementById("mobile-header-fixes")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "mobile-header-fixes";
    style.textContent =
      "@media (max-width: 920px) {" +
      ".header-row{margin-left:0;padding:0;border-radius:0;background:transparent;border:0;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none;}" +
      ".brand{display:inline-flex;align-items:center;justify-content:center;width:170px;height:auto;max-width:calc(100% - 4.5rem);padding:0.55rem 0.8rem;overflow:hidden;border-radius:22px;background:rgba(255,255,255,0.92);border:1px solid rgba(164,106,93,0.14);box-shadow:0 16px 30px rgba(114,72,63,0.12);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);}" +
      ".brand img{position:static;top:auto;width:100%;height:auto;object-fit:contain;transform:none;}" +
      ".menu-toggle{display:inline-flex;flex:0 0 auto;background:rgba(255,255,255,0.92);border:1px solid rgba(164,106,93,0.14);box-shadow:0 16px 30px rgba(114,72,63,0.12);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);}" +
      "}" +
      "@media (max-width: 760px) {" +
      ".header-row{gap:0.7rem;}" +
      ".brand{width:160px;max-width:calc(100% - 4.2rem);padding:0.5rem 0.72rem;}" +
      ".menu-toggle{width:50px;height:50px;border-radius:16px;}" +
      "}" +
      "@media (max-width: 520px) {" +
      ".header-row{gap:0.6rem;}" +
      ".brand{width:148px;max-width:calc(100% - 4rem);padding:0.45rem 0.62rem;}" +
      "}";

    document.head.appendChild(style);
  }

  if (!header || !toggle || !nav) {
    return;
  }

  applyMobileHeaderFixes();

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
