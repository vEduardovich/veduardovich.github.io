---
layout: default
---
{% for post in site.posts %}
  <h2 style='marigine-top:20px;'><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
  {{ post.content }}
{% endfor %}