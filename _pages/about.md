---
layout: academic
permalink: /
title: "About Me"
excerpt: "Yu Chen, Ph.D. student at IIIS, Tsinghua University, working on reinforcement learning theory and robust sequential decision-making."
redirect_from:
  - /about/
  - /about.html
---

<header class="profile-heading">
  <h1>Yu Chen <span class="name-native" lang="zh">陈禹</span></h1>
  <p class="profile-subtitle">Ph.D. student · IIIS, Tsinghua University</p>
</header>

<div class="profile-intro">
<div class="profile-copy" markdown="1">
Hi! My name is Yu Chen (陈禹 in Chinese).

I am a third-year Ph.D. student at the [Institute for Interdisciplinary Information Sciences (IIIS), Tsinghua University](https://iiis.tsinghua.edu.cn/en), where I am very fortunate to be advised by Prof. [Longbo Huang](https://people.iiis.tsinghua.edu.cn/~huang/index.html). My research focuses on reinforcement learning theory, with a particular interest in robust sequential decision-making under uncertainty.

I had the great opportunity to work as a research intern at [MSR Asia Theory Center](https://www.microsoft.com/en-us/research/group/msr-asia-theory-center/publications/) from February to August 2024, under the guidance of [Dr. Wei Chen](https://www.microsoft.com/en-us/research/people/weic/).

Prior to my Ph.D., I received my Bachelor of Science from Tsinghua University in Mathematics.

{% include academic-contact.html %}
</div>
<figure class="profile-portrait">
  <img class="site-avatar" src="{{ site.baseurl }}/images/{{ site.author.avatar }}?v={{ site.time | date: '%s' }}" width="200" height="200" alt="Portrait of Yu Chen" fetchpriority="high">
</figure>
</div>

{% include academic-topic-tags.html %}

{% include academic-featured.html %}

{% include academic-news.html %}

<section class="home-section research-interests" aria-labelledby="research-interests" markdown="1">
<h2 class="section-label" id="research-interests">Research Interests</h2>

My research aims to make AI for Decision Making more reliable by developing theoretical foundations and algorithms for sequential learning, reinforcement learning, and optimization under uncertainty. My current research is organized around three connected directions:

- **Heavy-tailed feedback and robust online decision-making**: designing algorithms that learn reliably from noisy, unbounded, or heavy-tailed feedback, with guarantees that adapt to both benign stochastic environments and more challenging adversarial regimes. Representative works include [BoBW Parameter-Free Heavy-Tailed MABs](https://openreview.net/forum?id=2pNLknCTvG), [BoBW Heavy-Tailed MDPs](https://arxiv.org/abs/2602.01295), and [On the Sublinear Regret of Continuous K-Max Bandits](https://proceedings.mlr.press/v337/chen26d.html).

- **Risk-sensitive reinforcement learning**: studying reinforcement learning beyond the standard expected-return objective, especially when the learner must optimize tail performance, distributional criteria, or other risk-aware notions of long-term reward. Representative works include [Distributional RL for Lipschitz Risk](https://openreview.net/forum?id=0xmfExPqFf), [Iterated CVaR RL](https://openreview.net/forum?id=vW1SkPl4kp), and [Risk-Sensitive POMDPs](https://openreview.net/forum?id=5S8ukkEQr2).

- **Reinforcement learning with function approximation**: developing theory for large state-action spaces beyond the tabular setting, where function classes are used to generalize across states and actions while preserving sample-efficiency and finite-time guarantees. Representative works include [Reward-Free Linear RL](https://openreview.net/forum?id=U9HW6vyNClg), [Risk-Sensitive Linear RL](https://proceedings.iclr.cc/paper_files/paper/2024/hash/81f19c0e9f3e06c831630ab6662fd8ea-Abstract-Conference.html), and [Risk Sensitive General Function Approximation](https://openreview.net/forum?id=0xmfExPqFf).

I am also broadly interested in scheduling, distribution matching, and decision-making in large language models. I am always open to new ideas and collaborations, so please feel free to reach out if you would like to discuss.
</section>

<section class="home-section service-list" aria-labelledby="academic-services" markdown="1">
<h2 class="section-label" id="academic-services">Academic Services</h2>

- **Conference Reviewing**: NeurIPS; ICLR; ICML;
- **Journal Reviewing**: Expert Systems With Applications;
</section>
