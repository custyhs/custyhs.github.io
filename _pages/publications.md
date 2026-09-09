---
layout: academic
title: "Publications"
permalink: /publications/
excerpt: "Selected publications and preprints by Yu Chen."
---

<div class="page-intro">
  <p>Selected papers, listed in reverse chronological order. For the complete list, see <a href="{{ site.author.googlescholar }}">Google Scholar</a>.</p>
  <p>* indicates equal contribution.</p>
</div>

<section class="publication-section" aria-labelledby="preprints">
  <h2 id="preprints">Preprints</h2>
  {% assign preprints = site.data.publications | where: 'kind', 'preprint' | group_by: 'year' %}
  {% for group in preprints %}
  <div class="publication-group">
    <h3 class="publication-year">{{ group.name }}</h3>
    <ul class="paper-list">
      {% for paper in group.items %}{% include academic-paper.html paper=paper %}{% endfor %}
    </ul>
  </div>
  {% endfor %}
</section>

<section class="publication-section" aria-labelledby="publications">
  <h2 id="publications">Publications</h2>
  {% assign publications = site.data.publications | where: 'kind', 'publication' | group_by: 'year' %}
  {% for group in publications %}
  <div class="publication-group">
    <h3 class="publication-year">{{ group.name }}</h3>
    <ul class="paper-list">
      {% for paper in group.items %}{% include academic-paper.html paper=paper %}{% endfor %}
    </ul>
  </div>
  {% endfor %}
</section>
