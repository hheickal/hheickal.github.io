// Menu-bar search: the search icon opens an input; results drop down as you type.
// Index: /search.json (built by Jekyll), loaded on first open. Every query word must
// match somewhere; title matches rank higher. Works for Bangla too.
(function () {
  var script = document.currentScript;
  var item = document.querySelector(".masthead__search");
  if (!item) return;
  var toggle = item.querySelector(".masthead__search-toggle");
  var panel = item.querySelector(".search-panel");
  var input = panel.querySelector(".search-input");
  var list = panel.querySelector(".search-dropdown");
  var index = null, loading = null, active = -1, MAX = 8;

  function norm(s) { return (s || "").toLowerCase(); }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function highlight(text, words) {
    var html = esc(text);
    words.forEach(function (w) { html = html.replace(new RegExp("(" + reEsc(esc(w)) + ")", "gi"), "<mark>$1</mark>"); });
    return html;
  }
  function snippet(text, words) {
    var lower = norm(text), at = -1;
    words.forEach(function (w) { var i = lower.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; });
    if (at < 0) return text.slice(0, 110) + (text.length > 110 ? "…" : "");
    var start = Math.max(0, at - 40), end = Math.min(text.length, at + 90);
    return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
  }

  function load() {
    loading = loading || fetch(script.dataset.index).then(function (r) { return r.json(); }).then(function (d) { index = d; });
    return loading;
  }

  function search(q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    var hits = index.map(function (doc) {
      var title = norm(doc.title), meta = norm(doc.meta), text = norm(doc.text), score = 0;
      for (var i = 0; i < words.length; i++) {
        var w = words[i], t = title.indexOf(w) >= 0, m = meta.indexOf(w) >= 0, x = text.indexOf(w) >= 0;
        if (!t && !m && !x) return null;
        score += (t ? 10 : 0) + (m ? 3 : 0) + (x ? 1 : 0);
      }
      return { doc: doc, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });
    return { words: words, hits: hits };
  }

  function render() {
    var q = input.value.trim();
    active = -1;
    if (!q || !index) { list.hidden = true; list.innerHTML = ""; return; }
    var r = search(q);
    list.innerHTML = r.hits.length ? r.hits.slice(0, MAX).map(function (h) {
      var d = h.doc;
      return '<li><a href="' + d.url + '">' +
        '<div class="search-result__meta"><span class="search-result__type search-result__type--' + d.type.toLowerCase() + '">' + d.type + "</span>" + esc([d.date, d.meta].filter(Boolean).join(" · ")) + "</div>" +
        '<div class="search-result__title">' + highlight(d.title, r.words) + "</div>" +
        '<div class="search-result__snippet">' + highlight(snippet(d.text, r.words), r.words) + "</div></a></li>";
    }).join("") + (r.hits.length > MAX ? '<li class="search-empty">' + (r.hits.length - MAX) + " more — add a word to narrow down</li>" : "")
      : '<li class="search-empty">No results.</li>';
    list.hidden = false;
  }

  function links() { return list.querySelectorAll("a"); }
  function setActive(i) {
    var a = links(); if (!a.length) return;
    active = (i + a.length) % a.length;
    a.forEach(function (el, j) { el.classList.toggle("is-active", j === active); });
    a[active].scrollIntoView({ block: "nearest" });
  }

  function open() {
    panel.hidden = false; item.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true");
    input.focus(); load().then(render);
  }
  function close() {
    panel.hidden = true; item.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function (e) { e.stopPropagation(); panel.hidden ? open() : close(); });
  input.addEventListener("input", function () { load().then(render); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { close(); toggle.focus(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter") { var a = links()[active < 0 ? 0 : active]; if (a) location.href = a.href; }
  });
  document.addEventListener("click", function (e) { if (!panel.hidden && !item.contains(e.target)) close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && panel.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
  });
})();
