---
layout: default
---
<!-- {% for post in site.posts %}
  <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
  {{ post.content }}
{% endfor %} -->
{% assign all_categories = site.posts | map: "categories" | join: "," | split: "," | uniq | sort %}

{% for category in all_categories %}
  <h1>{{ category }}</h1>
  <ul>
    {% for post in site.posts %}
      {% if post.categories contains category %}
        <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
      {% endif %}
    {% endfor %}
  </ul>
{% endfor %}