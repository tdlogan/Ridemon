var request = require('request');
var pokemonHelper = require('./pokeHelpers.js');

module.exports.requestRide = function(req, res) {
  var token = req.session.access_token;

  // First get uber products for the area of request
  var startLat  = req.body.data.start_latitude,
      startLong = req.body.data.start_longitude,
      endLat    = req.body.data.end_latitude,
      endLong   = req.body.data.end_longitude;

  // Get legendary ID if there's a legendary in the request
  var legendary = req.body.data.legendary;

  // User is not logged in if there is no token
  if(token === undefined) {
    console.log('Error: user not authenticated');
    res.status(401).end();
  } else {
    // Make request for available products to obtain ID in order to request ride
    getProducts(startLat, startLong, token, function(data) {
      // If products array is empty, there are no Uber rides available at that location
      if (data.products.length === 0) {
        res.status(400).send();
      } else {
        // Use first product ID which is for basic Uber to make ride request
        var product_id = data.products[0].product_id;
        request({
          url: 'https://sandbox-api.uber.com/v1/requests',
          method: 'POST',
          json: {
            'product_id': product_id,
            'start_latitude': startLat,
            'start_longitude': startLong,
            'end_latitude': endLat,
            'end_longitude': endLong
          },
          headers: {
            'Content-Type': 'application/JSON',
            'Authorization': 'Bearer ' + token
          }
        }, function(error, response, body) {
          var map;  // variable to store map url for sending back to client

          if(error) {
            console.log('error:', error);
          }

          // Make call to pokemon API to get new pokemon for the user
          if(legendary === false) {
            pokemonHelper.addPokemon(req, res);
          } else {
            console.log("LEGENDARY: ", legendary);
            pokemonHelper.addLegendary(req, res, legendary);
          }

          // Get map
          getMap(body.request_id, token, function(mapURL) {
            var responseData = {}; // JSON Object sent back to client as response

            responseData.map = mapURL;
            responseData.request_id = body.request_id;

            console.log(body);
            res.send(JSON.stringify(responseData));
          });
        });
      }
  });
  }
};

module.exports.cancelRide = function(req, res) {
  var token = req.session.access_token;

  if(token === undefined) {
    console.log('Error: user not authenticated');
    res.status(401).end();
  } else {
    request({
      method: 'DELETE',
      url: 'https://sandbox-api.uber.com/v1/requests/' + req.body.id,
      headers: {
            'Content-Type': 'application/JSON',
            'Authorization': 'Bearer ' + token
          }
        }, function(error, response, body) {
          if (error) {
            console.log("Error: " + error);
          }
          res.status(response.statusCode).end();
      })
  }
};

var getMap = function(request_id, token, callback) {
  request({
    url: 'https://sandbox-api.uber.com/v1/requests/' + request_id + '/map',
    method: 'GET',
    headers: {
    'Content-Type': 'application/JSON',
    'Authorization': 'Bearer ' + token
    }
  }, function(error, response, body) {
    callback(JSON.parse(body).href);
  });
};

var getProducts = function(lat, long, token, callback) {
  request({
    url: 'https://api.uber.com/v1/products',
    method: 'GET',
    qs: {
      latitude: lat,
      longitude: long
    },
    headers: {
      'Content-Type': 'application/JSON',
      'Authorization': 'Bearer ' + token
    }
  }, function(error, res, body) {
    callback(JSON.parse(body));
  });
};


