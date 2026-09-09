---
layout: academic
title: "Selected Publications"
permalink: /publications/
excerpt: "Selected publications and preprints by Yu Chen."
---

<div class="page-intro">
  <p>For a complete list, please refer to my <a href="{{ site.author.googlescholar }}">Google Scholar profile</a>. The publications are listed reverse chronologically.</p>
  <p>* indicates equal contribution.</p>
</div>

{% include academic-pub-toolbar.html %}

{% assign preprints = site.data.publications | where: 'kind', 'preprint' %}
{% if preprints.size > 0 %}
<section class="publication-section" aria-labelledby="preprints">
  <h2 class="section-label" id="preprints">Preprints</h2>
  <ul class="pub-list">
    {% for paper in preprints %}{% include academic-paper.html paper=paper %}{% endfor %}
  </ul>
</section>
{% endif %}

{% assign publications = site.data.publications | where: 'kind', 'publication' %}
<section class="publication-section" aria-labelledby="publications">
  <h2 class="section-label" id="publications">Publications</h2>
  <ul class="pub-list">
    {% assign last_year = 0 %}
    {% for paper in publications %}
      {% if paper.year != last_year %}{% assign anchor = paper.year %}{% assign last_year = paper.year %}{% else %}{% assign anchor = false %}{% endif %}
      {% include academic-paper.html paper=paper anchor=anchor %}
    {% endfor %}
  </ul>
</section>

<p class="pub-empty" data-empty-message hidden>No papers match this topic yet.</p>
