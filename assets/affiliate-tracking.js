(function () {
  function getArticleSlug() {
    // The /en/ prefix has to survive into the event, or a JA page and its EN
    // translation report the same slug and their clicks merge in GA4. Japanese
    // pages keep returning the bare slug, so the existing series stays comparable.
    var match = window.location.pathname.match(/^\/(en\/)?articles\/([a-z0-9-]+)\.html$/i);
    if (!match) return window.location.pathname;
    return (match[1] ? "en/" : "") + match[2];
  }

  function getStore(link) {
    return link.classList.contains("cta-rakuten") ? "rakuten" : "amazon";
  }

  function getCtaPosition(link) {
    if (link.closest(".quick-answer")) return "quick-answer";
    if (link.closest(".product-card")) return "product-card";
    if (link.closest(".quick-pick")) return "quick-pick";
    if (link.closest(".final-cta")) return "final-cta";
    if (link.closest("td")) return "table";
    return "other";
  }

  function getProductName(link) {
    var card = link.closest(".product-card");
    if (card) {
      var cardName = card.querySelector(".product-name");
      if (cardName) return cardName.textContent.trim();
    }
    var row = link.closest("tr");
    if (row) {
      var rowLink = row.querySelector('td a[href^="#product-"]');
      if (rowLink) return rowLink.textContent.trim();
    }
    var quickAnswerCard = link.closest(".feature-card");
    if (quickAnswerCard) {
      var quickAnswerLink = quickAnswerCard.querySelector("h3 a");
      if (quickAnswerLink) return quickAnswerLink.textContent.trim();
    }
    var firstProductName = document.querySelector(".product-card .product-name");
    if (firstProductName) return firstProductName.textContent.trim();
    return "";
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest(".cta-link");
    if (!link) return;
    if (typeof window.gtag !== "function") return;

    try {
      window.gtag("event", "affiliate_click", {
        article: getArticleSlug(),
        product: getProductName(link),
        store: getStore(link),
        cta_position: getCtaPosition(link)
      });
    } catch (err) {
      /* analytics must never block navigation to the affiliate link */
    }
  });
})();
