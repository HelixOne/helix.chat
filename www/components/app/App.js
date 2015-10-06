angular
    .module('app', [
        'ngRoute',
        'ngResource',
        'ngSanitize'
    ]);


angular
    .module('app')
    .config(Config);


function Config($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider
        .html5Mode(true)
        .hashPrefix('!');

    $routeProvider
        .when('/:id', {
            templateUrl: 'components/route/route.html',
            controller: 'RouteController'
        })
        .when('/', {
            templateUrl: 'components/home/home.html',
            controller: 'HomeController'
        })
        .otherwise({
            redirectTo: '/'
        });
}



angular
    .module('app')
    .filter('displayDate', function() {
        return function(time) {
            console.log(time)
            return moment(time).format('MMMM Do YYYY, h:mm:ss a');
        };
    });


angular
    .module('app')
    .filter('formatTimestamp', function() {
        return function(time) {
            console.log(time)
            time = parseInt(time)
            if ((Date.now - time) > (1000 * 60 * 60 * 24)) {
                return moment(time).format('MMMM Do YYYY, h:mm a');
            } else {
                return moment(time).format('h:mm a');

            }
        };
    });


angular
    .module('app').directive('focus', function() {
  return {
    link: function(scope, element, attrs) {
        element[0].focus()
     
    }
  };
});