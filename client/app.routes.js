RidemonApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "components/home/home.html"
    })
    .state("pokedex", {
      url: "/pokedex",
      templateUrl: "components/pokedex/pokedex.html"
    })

}]);