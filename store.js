/**
 * Created by maruf maniruzzaman on 3/13/16.
 */

var storeThemeApp = angular.module('storeThemeApp', [
    'ngRoute',
    'storeThemeAppControllers',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'slick'
]);


storeThemeApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/categories/:categoryId?', {
            templateUrl: 'partials/categories.html',
            controller: 'CategoriesCtrl'
        }).when('/products/:productId', {
            templateUrl: 'partials/productdetail.html',
            controller: 'ProductDetailCtrl'
        }).when('/cart', {
            templateUrl: 'partials/cart.html',
            controller: 'EmptyCtrl'
        }).when('/search', {
            templateUrl: 'partials/searchresult.html',
            controller: 'EmptyCtrl'
        }).when('/myprofile', {
            templateUrl: 'partials/myprofile.html',
            controller: 'EmptyCtrl'
        }).when('/logout', {
            templateUrl: 'partials/logout.html',
            controller: 'EmptyCtrl'
        }).otherwise({
            redirectTo: '/categories'
        });
    }]);

var storeThemeAppControllers = angular.module('storeThemeAppControllers', []);

storeThemeAppControllers.controller('CategoriesCtrl', ['$scope', '$http', '$q','$routeParams',
    function ($scope, $http, $q, $routeParams) {
        $scope.categories = [];
        $scope.hashComplete = false;
        $scope.productHash = {};
        $scope.categoryHash = {};

        $scope.categoryId = $routeParams.categoryId;

        $http.get('data/categories.json').success(function (data) {
            $scope.categories = JSON.parse(data._d);
        });

        $http.get('data/products.json').success(function (data) {
            $scope.products = JSON.parse(data._d);

            var catPromise = $scope.getCategoryHash();
            catPromise.then(function (data) {
                    $scope.categoryHash = data;
                    if($scope.categoryId){
                        $scope.curCategory = $scope.categoryHash[$scope.categoryId];
                    }
                },
                function (reason) {
                }
            );

            $scope.topProducts = [];
            $scope.topProducts.push($scope.products[0]);
            $scope.topProducts.push($scope.products[1]);
        });

        $http.get('data/storesettings.json').success(function (data) {
            $scope.storesettings = data;
        });

        $scope.carousel = {"slides":[{"text":"","image":"http://bounibazar.iferi.com/images/main-slider01.jpg","href":"http://localhost:8080/#/categories/3"},{"text":"","image":"http://bounibazar.iferi.com/images/main-slider02.jpg","href":"#/categories/4"}],"wrapSlides":false,"interval":5000,"type":"carousel"};

        $scope._hashProducts = function () {
            if ($scope.products) {
                for (var i = 0; i < $scope.products.length; i++) {
                    var product = $scope.products[i];
                    $scope.productHash[product._id] = product;

                    var categoryList = product.category;
                    if (categoryList) {
                        for (var ci = 0; ci < categoryList.length; ci++) {
                            var categoryId = "" + categoryList[ci];

                            var hash = $scope.categoryHash[categoryId];

                            if (!hash) {
                                hash = [];
                                $scope.categoryHash[categoryId] = hash;
                            }
                            hash.push(product);
                        }
                    }

                }
                $scope.hashComplete = true;
            }
        };

        $scope.getCategoryHash = function () {
            return $q(function (resolve, reject) {
                if (!$scope.hashComplete) {
                    $scope._hashProducts();
                }
                resolve($scope.categoryHash || {});
            });
        };
    }]);

storeThemeAppControllers.controller('ProductDetailCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {
        $scope.productId = $routeParams.productId;
    }]);

storeThemeAppControllers.controller('MainMenuCtrl', ['$scope', '$routeParams', '$http','$location',
    function ($scope, $routeParams, $http,$location) {
        $scope.categories = [];
        $http.get('data/categories.json').success(function (data) {
            $scope.categories = JSON.parse(data._d);
        });

        $scope.loggedIn = function () {
            return true;
        };
        $scope.userName = "Kuddus";
        $scope.cartItemCount = 5;

        $scope.search = function(){
            $location.path('/search')
        };
    }]);




storeThemeAppControllers.controller('EmptyCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams) {
    }]);
