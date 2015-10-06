// HomeController.js
angular
    .module('app')
    .controller('HomeController', HomeController);

function HomeController($scope, $http, $location, $rootScope) {

    console.log('ConversationController')



    /* particlesJS('dom-id', params);
/* @dom-id : set the html tag id [string, optional, default value : particles-js]
/* @params: set the params [object, optional, default values : check particles.js] */

    /* config dom id (optional) + config particles params */
    particlesJS('particles-js', {
        particles: {
            color: '#adadb7',
            shape: 'circle', // "circle", "edge" or "triangle"
            opacity: 1,
            size: 3,
            size_random: true,
            nb: 20,
            line_linked: {
                enable_auto: true,
                distance: 500,
                color: '#abafc9',
                opacity: 1,
                width: 1,
                condensed_mode: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 600
                }
            },
            anim: {
                enable: true,
                speed: 1
            }
        },
        interactivity: {
            enable: true,
            mouse: {
                distance: 250
            },
            detect_on: 'canvas', // "canvas" or "window"
            mode: 'grab',
            line_linked: {
                opacity: .5
            },
            events: {
                onclick: {
                    enable: true,
                    mode: 'push', // "push" or "remove" (particles)
                    nb: 4
                }
            }
        },
        /* Retina Display Support */
        retina_detect: true
    });
    
    $scope.genName = genName();
    $scope.go = function(){

        
        $location.path($scope.genName);
    }



}


