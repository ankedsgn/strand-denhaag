GoogleMap
=========

Initializes [gmap3](http://gmap3.net/).

Configure settings in `config.yml`. Then use

    {{ googlemap("example") }}

in your twig templates to initialize the map.

TODO
----

- Add filters for contenttypes
- Custom configurations (height, width, etc.) for the map
- Custom clustering algorithms
- Custom options for click, hover etc....
- Use twig template for infowindows?
- Fork me

- Unserialize all other properties as well (only fixed for geolocation).
- Allow custom queries and filters (currently gets published content only, but more options would be nice).
- Instead of dumping all variables, allow config to set which variables to return.

- Add a bunch of examples (mostly gmap3 related) from Two Kings (maybe a blog post on Bolt website?):
  - [Scala Architecten](http://www.scala-architecten.nl/pagina/kaart)
    *Simple clustering algorithm with infowindows*
  - [Vuurwerkoverlast](http://www.vuurwerkoverlast.nl/page/kaart)
    *Fast, custom clustering algorithm, based on [...]*
  - [Designkwartier](http://designkwartier.twokings.eu/plattegrond)
    *Custom icons with infowindows*


Changelog
---------

- 20140331: Fix: only fetches published content
- 20140326: Fix: unserialize geolocation so that it can be extracted on client-side