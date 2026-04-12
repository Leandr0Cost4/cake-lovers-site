/*
  ============================================================
  CARROSSEL DO BANNER PRINCIPAL
  - Autoplay com pausa ao interagir
  - Setas para voltar e avancar
  - Bolinhas clicaveis
  ============================================================
*/
(function () {
  var carousels = document.querySelectorAll(".hero-carousel");

  if (!carousels.length) {
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector(".hero-track");
    var slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    var stage = carousel.closest(".hero-stage");
    var dots = stage ? Array.from(stage.querySelectorAll(".hero-dot")) : [];
    var prevButton = carousel.querySelector(".hero-nav-prev");
    var nextButton = carousel.querySelector(".hero-nav-next");

    if (!track || slides.length <= 1 || !prevButton || !nextButton) {
      return;
    }

    var currentIndex = 0;
    var autoplayId = null;
    var intervalMs = Number(carousel.dataset.autoplayInterval) || 5600;

    function syncSlides() {
      track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

      slides.forEach(function (slide, index) {
        slide.setAttribute("aria-hidden", index === currentIndex ? "false" : "true");
      });

      dots.forEach(function (dot, index) {
        var isActive = index === currentIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function stopAutoplay() {
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function startAutoplay() {
      if (reduceMotion.matches) {
        return;
      }

      stopAutoplay();
      autoplayId = window.setInterval(function () {
        goToSlide(currentIndex + 1);
      }, intervalMs);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      syncSlides();
      restartAutoplay();
    }

    prevButton.addEventListener("click", function () {
      goToSlide(currentIndex - 1);
    });

    nextButton.addEventListener("click", function () {
      goToSlide(currentIndex + 1);
    });

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        goToSlide(index);
      });
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", function (event) {
      if (!carousel.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", function () {
        if (reduceMotion.matches) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });
    }

    syncSlides();
    startAutoplay();
  });
})();
