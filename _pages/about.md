---
layout: academic
permalink: /
title: "About Me"
excerpt: "Yu Chen · Reinforcement learning theory and robust sequential decision-making · IIIS, Tsinghua University."
redirect_from:
  - /about/
  - /about.html
---

<header class="profile-heading">
  <h1>Yu Chen <span class="name-native" lang="zh">陈禹</span></h1>
  <p class="profile-subtitle">Ph.D. student · IIIS, Tsinghua University</p>
</header>

<div class="profile-intro">
  <div class="profile-copy">
    <p>I am a third-year Ph.D. student at the <a href="https://iiis.tsinghua.edu.cn/en">Institute for Interdisciplinary Information Sciences (IIIS), Tsinghua University</a>, advised by Prof. <a href="https://people.iiis.tsinghua.edu.cn/~huang/index.html">Longbo Huang</a>.</p>
    <p>My research focuses on reinforcement learning theory and robust sequential decision-making under uncertainty.</p>
    <p>Previously, I was a research intern at <a href="https://www.microsoft.com/en-us/research/group/msr-asia-theory-center/publications/">MSR Asia Theory Center</a> from February to August 2024, working with <a href="https://www.microsoft.com/en-us/research/people/weic/">Dr. Wei Chen</a>. I received my B.S. in Mathematics from Tsinghua University.</p>
    {% include academic-contact.html %}
  </div>
  <figure class="profile-portrait">
    <img class="site-avatar" src="{{ site.baseurl }}/images/{{ site.author.avatar }}?v={{ site.time | date: '%s' }}" width="200" height="200" alt="Portrait of Yu Chen" fetchpriority="high">
  </figure>
</div>

<section class="home-section" aria-labelledby="recent-work">
  <div class="section-heading">
    <h2 id="recent-work">Recent work</h2>
    <a href="{{ site.baseurl }}/publications/">All publications</a>
  </div>
  <ul class="recent-work">
    {% assign recent_papers = site.data.publications | where: 'featured', true %}
    {% for paper in recent_papers %}
    <li>
      <span class="recent-work__meta">{{ paper.year }} <span>/</span> {{ paper.venue }}</span>
      <a href="{{ paper.url }}">{{ paper.title | escape_once }}</a>
    </li>
    {% endfor %}
  </ul>
</section>

<section class="home-section" aria-labelledby="research-interests">
  <h2 id="research-interests">Research interests</h2>
  <p class="section-intro">Theoretical foundations for reliable decision-making.</p>
  <div class="research-topic">
    <h3>Robust online learning</h3>
    <p>Designing algorithms that learn reliably from noisy, unbounded, or heavy-tailed feedback, with guarantees that adapt to both stochastic and adversarial environments.</p>
    <p class="research-links">Representative work: <a href="https://openreview.net/forum?id=2pNLknCTvG">BoBW Parameter-Free Heavy-Tailed MABs</a><a href="https://openreview.net/forum?id=j6gXeiPJ3z">BoBW Heavy-Tailed MDPs</a><a href="https://proceedings.mlr.press/v337/chen26d.html">On the Sublinear Regret of Continuous K-Max Bandits</a>.</p>
  </div>
  <div class="research-topic">
    <h3>Risk-sensitive reinforcement learning</h3>
    <p>Learning beyond expected returns, with algorithms that optimize tail performance, distributional criteria, and risk-aware long-term reward.</p>
    <p class="research-links">Representative work: <a href="https://openreview.net/forum?id=0xmfExPqFf">Distributional RL for Lipschitz Risk</a><a href="https://openreview.net/forum?id=vW1SkPl4kp">Iterated CVaR RL</a><a href="https://openreview.net/forum?id=5S8ukkEQr2">Risk-Sensitive POMDPs</a>.</p>
  </div>
  <div class="research-topic">
    <h3>Reinforcement learning with function approximation</h3>
    <p>Developing theory for large state-action spaces, using function classes to generalize while preserving sample-efficiency and finite-time guarantees.</p>
    <p class="research-links">Representative work: <a href="https://openreview.net/forum?id=U9HW6vyNClg">Reward-Free Linear RL</a><a href="https://proceedings.iclr.cc/paper_files/paper/2024/hash/81f19c0e9f3e06c831630ab6662fd8ea-Abstract-Conference.html">Risk-Sensitive Linear RL</a><a href="https://openreview.net/forum?id=0xmfExPqFf">Risk-Sensitive General Function Approximation</a>.</p>
  </div>
  <p class="section-intro">I am also interested in scheduling, distribution matching, and decision-making in large language models. Please feel free to <a href="mailto:{{ site.author.email }}">get in touch</a> to discuss ideas or collaborations.</p>
</section>

<section class="home-section" aria-labelledby="academic-services">
  <h2 id="academic-services">Academic services</h2>
  <dl class="service-list">
    <dt>Conference reviewing</dt><dd>NeurIPS, ICLR, ICML</dd>
    <dt>Journal reviewing</dt><dd>Expert Systems With Applications</dd>
  </dl>
</section>
