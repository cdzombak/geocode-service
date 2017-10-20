# geocode-service

A simple node.js + Redis caching geocoding service which returns lat/lng _and elevation_ for an address string.

Designed for aviation applications, so elevation is returned in feet.

## Environment Vars

* `PORT`: server port. Defaults to `5150`.
* `CLIENT_KEY`: client API secret key. Required.
* `GMAPS_KEY`: Google Maps API key. Required.
* `REDIS_PWD`: Redis password.

## License

MIT. See [LICENSE](LICENSE).
