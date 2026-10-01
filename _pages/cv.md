---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}
{% assign cv_pdf = base_path | append: "/files/HH_CV.pdf" %}

<p class="cv-actions">
  <a class="cv-actions__icon" href="{{ cv_pdf }}" download title="Download PDF" aria-label="Download PDF"><i class="fas fa-fw fa-download" aria-hidden="true"></i></a>
  <a class="cv-actions__icon" href="{{ cv_pdf }}" target="_blank" rel="noopener" title="Open in new tab" aria-label="Open in new tab"><i class="fas fa-fw fa-external-link-alt" aria-hidden="true"></i></a>
</p>

<div id="cv-viewer" class="cv-viewer" data-src="{{ cv_pdf }}">
  <p class="cv-viewer__status">Loading CV…</p>
</div>

<noscript><p>JavaScript is off — <a href="{{ cv_pdf }}">open the CV as a PDF</a>.</p></noscript>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  (function () {
    var box = document.getElementById("cv-viewer");
    var status = box.querySelector(".cv-viewer__status");
    if (!window.pdfjsLib) { status.innerHTML = 'Could not load the viewer — <a href="' + box.dataset.src + '">open the PDF</a>.'; return; }
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    var pdf, lastWidth = 0;
    function render() {
      var width = box.clientWidth;
      if (!pdf || Math.abs(width - lastWidth) < 8) return;
      lastWidth = width;
      box.innerHTML = "";
      var dpr = window.devicePixelRatio || 1;
      for (var n = 1; n <= pdf.numPages; n++) {
        (function (canvas) {
          box.appendChild(canvas);
          pdf.getPage(n).then(function (page) {
            var scale = width / page.getViewport({ scale: 1 }).width;
            var vp = page.getViewport({ scale: scale * dpr });
            canvas.width = vp.width;
            canvas.height = vp.height;
            canvas.style.width = width + "px";
            page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
          });
        })(Object.assign(document.createElement("canvas"), { className: "cv-viewer__page" }));
      }
    }

    pdfjsLib.getDocument(box.dataset.src).promise.then(function (doc) {
      pdf = doc;
      render();
      var t;
      window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(render, 200); });
    }, function () {
      status.innerHTML = 'Could not display the CV here — <a href="' + box.dataset.src + '">open the PDF</a>.';
    });
  })();
</script>
