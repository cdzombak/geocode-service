'use strict';

const WEEK_IN_SECONDS = 604800

const Promise = require('bluebird')
const GoogleMaps = Promise.promisifyAll(require('@google/maps').createClient({ key: process.env.GMAPS_KEY }))
const CachemanRedis = require('cacheman-redis')

Promise.promisifyAll(CachemanRedis.prototype)

var redis_opts = {}
if (process.env.REDIS_PWD) redis_opts['password'] = process.env.REDIS_PWD
const cache = new CachemanRedis(redis_opts)

const app = require('express')()

app.set('port', (process.env.PORT || 5150))

function cacheKeyFromAddress(address) {
  return "_geocode_cachekey_" + address
}

app.get('/api/geocode', function(req, res) {
  const key = req.query['key']
  if (key !== process.env.CLIENT_KEY) {
    res.sendStatus(401)
    return
  }

  const address = req.query['address']

  cache.getAsync(cacheKeyFromAddress(address))
  .then(function(cachedResult) {
    if (cachedResult) {
      console.log('[Geocode] Cache hit for address:', address)
      res.json(cachedResult)
      return
    }

    console.log('[Geocode] Geocoding address:', address)

    return GoogleMaps.geocodeAsync({ address: address }).then(function(resp) {
      if (!resp.json.results.length) {
        return null
      }

      return resp.json.results[0].geometry.location
    })
    .then(function(latLng) {
      if (!latLng) {
        return null
      }

      return GoogleMaps.elevationAsync({
        locations: [ latLng ]
      })
    })
    .then(function(resp) {
      var result = {
        location: null,
        address: address,
        cached: null,
        elevation: null
      }

      if (resp && resp.json.results.length) {
        result['location'] = resp.json.results[0]['location']
        result['elevation'] = resp.json.results[0]['elevation'] * 3.28084
      }

      console.log('[Geocode] Finished geocoding "', address, "' with result:", result)
      res.json(result)

      result['cached'] = new Date()
      return cache.setAsync(cacheKeyFromAddress(result['address']), result, 4*WEEK_IN_SECONDS)
    })
  })
  .catch(function(err) {
    res.status(500).json(err)
    console.log('[Geocode] Error geocoding "', address, '":', err)
  })
})

app.listen(app.get('port'), function(){
  console.log('[Geocode] Listening on port', app.get('port'))
})
