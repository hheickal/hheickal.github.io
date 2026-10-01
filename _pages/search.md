---
layout: single
title: "Search"
permalink: /search/
author_profile: true
compact_contacts: true
sitemap: false
---

<form class="search-form" role="search" onsubmit="return false">
  <input id="search-input" class="search-input" type="search" placeholder="Search posts, publications, teaching…" aria-label="Search" autocomplete="off" autofocus>
</form>
<p id="search-status" class="search-status"></p>
<ol id="search-results" class="search-results"></ol>

<script src="{{ '/assets/js/search.js' | relative_url }}" data-index="{{ '/search.json' | relative_url }}"></script>
