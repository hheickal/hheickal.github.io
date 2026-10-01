// Client-side site search over /search.json (built by Jekyll).
// Every query word must appear somewhere; title matches rank higher. Works for Bangla too.
(function () {
  var script = document.currentScript;
  var input = document.getElementById("search-input");
  var status = document.getElementById("search-status");
  var list = document.getElementById("search-results");
  var index = null;

  function norm(s) { return (s || "").toLowerCase(); }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function highlight(text, words) {
    var html = esc(text);
    words.forEach(function (w) {
      html = html.replace(new RegExp("(" + reEsc(esc(w)) + ")", "gi"), "<mark>$1</mark>");
    });
    return html;
  }

  function snippet(text, words) {
    var lower = norm(text), at = -1;
    words.forEach(function (w) { var i = lower.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; });
    if (at < 0) return text.slice(0, 180) + (text.length > 180 ? "…" : "");
    var start = Math.max(0, at - 70), end = Math.min(text.length, at + 150);
    return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
  }

  function run() {
    var q = input.value.trim();
    var url = new URL(location.href);
    if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
    history.replaceState(null, "", url);

    list.innerHTML = "";
    if (!q) { status.textContent = ""; return; }
    var words = norm(q).split(/\s+/).filter(Boolean);

    var hits = index.map(function (doc) {
      var title = norm(doc.title), meta = norm(doc.meta), text = norm(doc.text), score = 0;
      for (var i = 0; i < words.length; i++) {
        var w = words[i], inTitle = title.indexOf(w) >= 0, inMeta = meta.indexOf(w) >= 0, inText = text.indexOf(w) >= 0;
        if (!inTitle && !inMeta && !inText) return null;
        score += (inTitle ? 10 : 0) + (inMeta ? 3 : 0) + (inText ? 1 : 0);
      }
      return { doc: doc, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });

    status.textContent = hits.length ? hits.length + (hits.length === 1 ? " result" : " results") : "No results.";
    list.innerHTML = hits.map(function (h) {
      var d = h.doc;
      return '<li class="search-result">' +
        '<div class="search-result__meta"><span class="search-result__type search-result__type--' + d.type.toLowerCase() + '">' + d.type + "</span>" +
        esc([d.date, d.meta].filter(Boolean).join(" · ")) + "</div>" +
        '<a class="search-result__title" href="' + d.url + '">' + highlight(d.title, words) + "</a>" +
        '<p class="search-result__snippet">' + highlight(snippet(d.text, words), words) + "</p></li>";
    }).join("");
  }

  fetch(script.dataset.index).then(function (r) { return r.json(); }).then(function (data) {
    index = data;
    var q = new URLSearchParams(location.search).get("q");
    if (q) input.value = q;
    input.addEventListener("input", run);
    run();
  }, function () { status.textContent = "Search is unavailable right now."; });
})();
