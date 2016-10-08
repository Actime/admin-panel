
var application = angular.module('actime_admin_main_app', ['ngRoute', 'ngCookies', 'ngMaterial', 'naif.base64'])
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
            .when( '/events/edit/:id', {
                templateUrl: '../Views/events/edit.html',
            })
            .when( '/events/convs/:id', {
                templateUrl: '../Views/events/convs.html',
            })
            .when( '/events/prices/:id', {
                templateUrl: '../Views/events/prices.html',
            })
            .when( '/events/gallery/:id', {
                templateUrl: '../Views/events/gallery.html',
            })
            .when( '/events/:id', {
                templateUrl: '../Views/events/detail.html',
            })
            .when( '/results/:id', {
                templateUrl: '../Views/events/results.html',
            })
            // Competitions
            .when( '/competitions/', {
                templateUrl: '../Views/competitions/list.html',
            })
            .when( '/competitions/new/:id', {
                templateUrl: '../Views/competitions/new.html',
            })
            .when( '/competitions/edit/:id', {
                templateUrl: '../Views/competitions/edit.html',
            })
            .when( '/competitions/:id', {
                templateUrl: '../Views/competitions/detail.html',
            })
            // Competitors
            .when( '/competitors/', {
                templateUrl: '../Views/competitors/list.html',
            })
            .when( '/competitors/new/', {
                templateUrl: '../Views/competitors/new.html',
            })
            .when( '/competitors/edit/:id', {
                templateUrl: '../Views/competitors/edit.html',
            })
            .when( '/competitors/:id', {
                templateUrl: '../Views/competitors/detail.html',
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
            .when( '/registers/cfm/:id', {
                templateUrl: '../Views/registers/confirmation_win.html',
            })
            .when( '/registers/edit/:id', {
                templateUrl: '../Views/registers/edit.html',
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
    }])
    .controller( 'homeController', [ '$scope', 'EventRepository', 'CompetitionsRepository', 'RegistersRepository', function( $scope, EventRepository, CompetitionsRepository, RegistersRepository ) {
        $scope.data = { total_events : 0, total_competitors : 0, kits_delivered : 0, kits_returned : 0, total_competitions : 0 };
        EventRepository.getAll().success( function( data ) {
            var events = data['data'];
            $scope.data.total_events = events.length;
        }).error( function( error ) {
            $.nofity( "There was an error with event data.", "error" );
        });
        CompetitionsRepository.getAllCompetitions().success( function( data ) {
            var competitions = data['data'];
            $scope.data.total_competitions = competitions.length;
        }).error( function( error ) {
            $.notify( "There was an error with competition data.", "error" );
        });
        RegistersRepository.getRegisters().success( function( data ) {
            var registers = data['data'];
            $scope.data.kits_delivered = registers.filter( register => register.kit_state === 3 ).length;
            $scope.data.kits_returned = registers.filter( register => register.kit_state === 4 ).length;
        }).error( function( error ) {
            $.notify( "There was an error with registers data.", "error" );
        });
        RegistersRepository.getAllCompetitors().success( function( data ) {
            var competitors = data['data'];
            $scope.data.total_competitors = competitors.length;
        }).error( function( error ) {

        });
    }])
    .controller( 'statsController', [ '$scope', function( $scope ) {

    }]);
