// AppController.js
angular
    .module('app')
    .controller('AppController', AppController);

function AppController($scope, $http, $location, $rootScope) {
	$scope.title ={
		is:'Helix One'
	}
	$scope.setTitle = function(title){
		$scope.title.is = title; 
		document.title = title;
	}
}
