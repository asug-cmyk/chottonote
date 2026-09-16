(function () {
  var body = document.querySelector(".article-body");
  if (!body) return;

  var headings = Array.prototype.slice.call(body.querySelectorAll("h2"));
  if (headings.length < 2) return;

  var isEn = document.documentElement.lang === "en";

  var nav = document.createElement("nav");
  nav.className = "toc";
  nav.setAttribute("aria-label", isEn ? "Table of contents" : "目次");

  var title = document.createElement("p");
  title.className = "toc-title";
  title.textContent = isEn ? "On this page" : "目次";
  nav.appendChild(title);

  var list = document.createElement("ul");
  headings.forEach(function (h, i) {
    if (!h.id) h.id = "toc-section-" + (i + 1);
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
  });
  nav.appendChild(list);

  body.insertBefore(nav, body.firstChild);
})();
