/*
  ============================================================
  BOTAO FLUTUANTE DO WHATSAPP
  ALTERE O NUMERO E AS MENSAGENS NO HTML, NO BOTAO:
  - data-phone
  - data-message-mobile
  - data-message-desktop
  ============================================================
*/
(function () {
  var button = document.getElementById("whatsapp-float");

  if (!button) {
    return;
  }

  function normalizePhone(rawPhone) {
    return (rawPhone || "").replace(/\D/g, "");
  }

  function isMobileContext() {
    var hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    var hasSmallViewport = window.matchMedia("(max-width: 920px)").matches;
    var userAgent = navigator.userAgent || "";
    var mobileHint = /android|iphone|ipad|ipod|windows phone|mobile/i.test(userAgent);

    return hasCoarsePointer || hasSmallViewport || mobileHint;
  }

  function buildWhatsAppLink(phone, message, useMobileFlow) {
    var encodedMessage = encodeURIComponent((message || "").trim());

    if (!phone) {
      return "#contato";
    }

    if (useMobileFlow) {
      return "https://wa.me/" + phone + (encodedMessage ? "?text=" + encodedMessage : "");
    }

    return (
      "https://web.whatsapp.com/send/?phone=" +
      phone +
      (encodedMessage ? "&text=" + encodedMessage : "") +
      "&type=phone_number&app_absent=0"
    );
  }

  function applyWhatsAppBehavior() {
    var phone = normalizePhone(button.dataset.phone);
    var mobileMessage = button.dataset.messageMobile || "";
    var desktopMessage = button.dataset.messageDesktop || mobileMessage;
    var useMobileFlow = isMobileContext();
    var message = useMobileFlow ? mobileMessage : desktopMessage;
    var link = buildWhatsAppLink(phone, message, useMobileFlow);

    button.href = link;
    button.target = phone && !useMobileFlow ? "_blank" : "_self";

    if (phone && !useMobileFlow) {
      button.rel = "noopener noreferrer";
    } else {
      button.removeAttribute("rel");
    }

    if (!phone) {
      button.title = "Adicione o numero da loja no atributo data-phone para ativar o WhatsApp.";
    } else {
      button.title = "Abrir conversa com a Cake Lovers no WhatsApp.";
    }
  }

  applyWhatsAppBehavior();
  window.addEventListener("resize", applyWhatsAppBehavior);
})();
