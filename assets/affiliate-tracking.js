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

  // .cta-link is also used for in-site buttons that route a reader from an
  // explainer into a comparison article. Those are navigation, not affiliate
  // clicks, and counting them inflates affiliate_click with internal traffic.
  // Fire only for links that actually leave for a merchant.
  var MERCHANT_HOSTS = ["www.amazon.co.jp", "amazon.co.jp", "hb.afl.rakuten.co.jp"];

  function isMerchantLink(link) {
    try {
      return MERCHANT_HOSTS.indexOf(new URL(link.href, window.location.href).hostname) !== -1;
    } catch (err) {
      return false;
    }
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest(".cta-link");
    if (!link) return;
    if (!isMerchantLink(link)) return;
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

  // internal_cta_click: a reader moving from one article to another (explainer
  // -> comparison, comparison -> related). Deliberately a separate event from
  // affiliate_click so the affiliate count stays purely merchant clicks.
  // Only fixed values are sent: article slugs and a position label, never text.
  var ARTICLE_PATH = /^\/(en\/)?articles\/([a-z0-9-]+)\.html$/i;

  function articleSlugFromPath(pathname) {
    var m = pathname.match(ARTICLE_PATH);
    return m ? (m[1] ? "en/" : "") + m[2] : null;
  }

  function getInternalPosition(link) {
    if (link.closest(".related-articles")) return "related";
    if (link.classList.contains("cta-link")) return "button";
    var pos = getCtaPosition(link);
    return pos === "other" ? "body" : pos;
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (!link) return;
    // Only links inside the article body: skips header, language switch,
    // breadcrumbs and footer, which are site navigation rather than a funnel.
    if (!link.closest("article")) return;
    if (link.closest("header, nav, footer")) return;
    if (typeof window.gtag !== "function") return;

    try {
      var url = new URL(link.href, window.location.href);
      if (url.hostname !== window.location.hostname) return;
      var to = articleSlugFromPath(url.pathname);
      var from = articleSlugFromPath(window.location.pathname);
      if (!to || !from || to === from) return;
      window.gtag("event", "internal_cta_click", {
        from: from,
        to: to,
        cta_position: getInternalPosition(link)
      });
    } catch (err) {
      /* analytics must never block navigation */
    }
  });
})();
