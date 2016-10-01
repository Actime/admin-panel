
var application = angular.module('actime_admin_main_app', ['ngRoute', 'ngCookies'])
    .run( ['$rootScope', '$location', 'AuthRepository', function( $rootScope, $location, AuthRepository ) {
        // If not loggedin, load login path
        if( !AuthRepository.isSessionSet() ) {
            // load login path
            $location.path( '/login/' );
        }
    }])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '../Views/profile.html',
            })
            // Events
            .when( '/events/', {
                templateUrl: '../Views/events/list.html',
            })
            .when( '/events/new/', {
                templateUrl: '../Views/events/new.html',
            })
            .when( '/events/:id', {
                templateUrl: '../Views/events/detail.html',
            })
            .when( '/events/edit/:id', {
                templateUrl: '../Views/events/edit.html',
            })
            .when( '/results/:id', {
                templateUrl: '../Views/events/results.html',
            })
            // Competitions
            .when( '/competitions/', {
                templateUrl: '../Views/competitions/list.html',
            })
            .when( '/competitions/:id', {
                templateUrl: '../Views/competitions/detail.html',
            })
            .when( '/competitions/new/', {
                templateUrl: '../Views/competitions/new.html',
            })
            .when( '/competitions/edit/:id', {
                templateUrl: '../Views/competitions/edit.html',
            })
            // Competitors
            .when( '/competitors/', {
                templateUrl: '../Views/competitors/list.html',
            })
            .when( '/competitors/:id', {
                templateUrl: '../Views/competitors/detail.html',
            })
            .when( '/competitions/new/', {
                templateUrl: '../Views/competitors/new.html',
            })
            .when( '/competitors/edit/:id', {
                templateUrl: '../Views/competitors/edit.html',
            })
            // categories
            .when( '/categories/', {
                templateUrl: '../Views/categories/list.html',
            })
            .when( '/categories/new/', {
                templateUrl: '../Views/categories/new.html',
            })
            // registers
            .when( '/registers/new/:id', {
                templateUrl: '../Views/registers/new.html',
            })
            // General
            .when( '/settings/', {
                templateUrl: '../Views/general/settings.html',
            })
            .when( '/contents/', {
                templateUrl: '../Views/general/site_contents.html',
            })
            // Point of sale
            .when( '/pos/', {
                templateUrl: '../Views/pos/index.html',
            })
            // Register state
            .when( '/register_states/', {
                templateUrl: '../Views/states/register_states.html',
            })
            .when( '/kit_states/', {
                templateUrl: '../Views/states/kit_states.html',
            })
            .when( '/login/', {
                templateUrl: '../login.html',
            })
            .otherwise({
              redirectTo: '/404'
            });
    }]);// End of config application function
