---
layout: default
---
{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
  <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
  {{ post.content }}
{% endfor %}