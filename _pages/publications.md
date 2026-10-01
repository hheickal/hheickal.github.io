---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
compact_contacts: true
sidebar_include: pub-topics-sidebar.html
---

{% include base_path %}
{% assign pubs = site.publications | sort: "date" | reverse %}

<p class="pub-scholar">Also on <a href="{{ site.author.googlescholar }}">Google Scholar</a>.</p>

<div id="pub-list">
{% assign year = "" %}
{% for post in pubs %}
  {% assign y = post.date | date: "%Y" %}
  {% if y != year %}
    {% assign year = y %}
    <h2 class="archive__subtitle pub-year" data-year="{{ y }}">{{ y }}</h2>
  {% endif %}
  {% include archive-single.html %}
{% endfor %}
<p class="pub-empty" hidden>No publications with this topic.</p>
</div>
