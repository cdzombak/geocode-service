module.exports = {
  apps : [{
    name        : "geocode",
    script      : "./geocode.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
      "GMAPS_KEY": "dev_gmaps_key",
      "CLIENT_KEY": "dev_client_key"
    },
    env_production : {
       "NODE_ENV": "production",
       "REDIS_PWD": "prod_redis_pwd",
       "GMAPS_KEY": "prod_gmaps_key",
       "CLIENT_KEY": "prod_client_key"
    }
  }]
}
