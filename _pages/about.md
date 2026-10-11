---
layout: academic
permalink: /
title: "About Me"
excerpt: "Yu Chen, Ph.D. student at IIIS, Tsinghua University, working at the intersection of AI and decision-making."
redirect_from:
  - /about/
  - /about.html
---

<header class="profile-heading">
  <h1>Yu Chen <span class="name-native" lang="zh">陈禹</span></h1>
  <p class="profile-subtitle">Ph.D. student · IIIS, Tsinghua University</p>
</header>

<div class="profile-intro">
<div class="profile-side">
<figure class="profile-portrait">
  <img class="site-avatar" src="{{ site.baseurl }}/images/{{ site.author.avatar }}?v={{ site.time | date: '%s' }}" width="200" height="200" alt="Portrait of Yu Chen" fetchpriority="high">
</figure>
{% include academic-contact.html %}
</div>
<div class="profile-copy" markdown="1">
Hi! My name is Yu Chen.

I am a third-year Ph.D. student at the [Institute for Interdisciplinary Information Sciences (IIIS), Tsinghua University](https://iiis.tsinghua.edu.cn/en), where I am very fortunate to be advised by Prof. [Longbo Huang](https://people.iiis.tsinghua.edu.cn/~huang/index.html). My research lies at the intersection of AI and decision-making: I develop the theory of sequential decision-making under uncertainty, from bandits to reinforcement learning, and study how AI systems such as LLM agents make decisions.

Starting in November 2026, I will be visiting [Caltech](https://www.caltech.edu/) as a visiting student, under the guidance of Prof. [Adam Wierman](https://adamwierman.com/). Previously, I was a research intern at the [MSR Asia Theory Center](https://www.microsoft.com/en-us/research/group/msr-asia-theory-center/publications/) from February to August 2024, under the guidance of [Dr. Wei Chen](https://www.microsoft.com/en-us/research/people/weic/).

Prior to my Ph.D., I received my Bachelor of Science in Mathematics from Tsinghua University.

</div>
</div>

{% comment %}Recent news is hidden. To show it again, replace this line with: {% include academic-news.html %}{% endcomment %}

<section class="home-section research-overview" aria-labelledby="research-overview" markdown="1">
<h2 class="section-label" id="research-overview">Research Overview</h2>

A common thread in my work is decision-making in settings where standard practice or standard assumptions fall short: LLM agents and LLM training that rely on heuristics without a well-defined objective, feedback that is heavy-tailed rather than bounded, and objectives that weigh risk rather than only the expected return. In each setting, I look for formulations that lead to principled algorithms and, where possible, provable guarantees. My current work is organized around three directions.

**Decision-making in LLMs and LLM agents.** Large language models, and the agents built on them, increasingly make decisions on their own: which skills or tools to use, what to keep in a limited context, and how to act on uncertain feedback. I study what makes these decisions good, and how ideas from sequential decision-making and optimization can make them more reliable and efficient. Recent work includes [skill selection for LLM agents](https://arxiv.org/abs/2608.19993), [objectives for fine-tuning](https://openreview.net/forum?id=m3H7Oexpbx), and [robust on-policy distillation](https://arxiv.org/abs/2606.11627).

**Heavy-tailed online learning.** In many real problems, rewards and losses are heavy-tailed: rare, extreme outcomes dominate the average and break the estimators that standard algorithms rely on. I study how to learn and decide robustly under such feedback, ideally without knowing in advance how heavy the tails are or whether the environment is stochastic or adversarial. Recent work includes best-of-both-worlds algorithms for [heavy-tailed bandits](https://openreview.net/forum?id=2pNLknCTvG) and [Markov decision processes](https://openreview.net/forum?id=j6gXeiPJ3z).

**Risk-sensitive reinforcement learning.** In safety-critical applications, a good policy must care not only about the expected return but also about the risk of bad outcomes. I study when risk-aware objectives, such as conditional value-at-risk and other risk measures over the return distribution, can be learned as efficiently as the standard objective, including in large state spaces that require function approximation. Work in this direction includes provably efficient algorithms for risk-sensitive RL with [iterated CVaR objectives](https://openreview.net/forum?id=vW1SkPl4kp), [Lipschitz risk measures](https://openreview.net/forum?id=0xmfExPqFf), and [partial observability](https://openreview.net/forum?id=5S8ukkEQr2).

</section>

<section class="home-section service-list" aria-labelledby="academic-services" markdown="1">
<h2 class="section-label" id="academic-services">Academic Services</h2>

- **Conference Reviewing**: NeurIPS; ICLR; ICML;
- **Journal Reviewing**: Expert Systems With Applications;

</section>
