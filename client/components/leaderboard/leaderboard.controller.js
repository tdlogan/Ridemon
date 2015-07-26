RidemonApp.controller('LeaderboardController', ['$scope', '$firebase', '$firebaseArray', '$firebaseObject', "$http", function($scope, $firebase, $firebaseArray, $firebaseObject, $http) {
  var users = new Firebase('https://ridemon.firebaseio.com/users/userIds');
  var userArray = $firebaseArray(users);
  //grab user and pokemon data
  var userPokemon = users.child('pokemonIds');
  var userPokemonArray = $firebaseObject(userPokemon);

  $scope.users;
  function retrieveUsers() {
    users.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var temp = [];
        var key = childSnapshot.key();
        // // $scope.pokemon = users.userIds
        // var pokemonIds = $firebaseArray(users.child(key).child('pokemonIds'))
        temp[0] = key;
        // temp[1] = pokemonIds
        // console.log(temp);
        // $scope.users.push(temp);
        console.log(key);
        $http.get("/pokedex", {params: {
          specialUid: key
        }}).success(function(pokemon) {
          console.log(pokemon);
          $scope.users = pokemon;
        });
      });
    })
  }
  //TODO access req.server.name
  retrieveUsers();
}])