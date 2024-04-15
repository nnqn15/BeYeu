var app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html",
            controller: "homeController"
        })
        .when("/login", {
            templateUrl: "login.html",
            controller: "loginController"
        })
        .when("/register", {
            templateUrl: "register.html",
            controller: "registerController"
        })
        .when("/shop", {
            templateUrl: "shop.html",
            controller: "shopController"
        })
        .when("/cart", {
            templateUrl: "cart.html",
            controller: "cartController"
        })
        .when("/product/:slug", {
            templateUrl: "product.html",
            controller: "productController"
        })
        .when("/adminProducts", {
            templateUrl: "adminProducts.html",
            controller: "adminProductsController"
        })
        .otherwise({
            template: "<h1>404</h1><p>Không tìm thấy trang</p>"
        });
    ;
});
app.controller("searchController", function ($scope, $location, $rootScope) {
    $scope.search = function () {
        $rootScope.keyword=$scope.txtSearch;
        $location.path("/shop")
    };
});
app.controller("slcartController", function ($scope, $http, $rootScope) {
    $scope.loadCart = function () {
        $http.get("http://localhost:3000/cart")
            .then(res => {
                $rootScope.User= $window.localStorage.getItem('user');
                $scope.cart = res.data;
                $scope.cartByUser = $scope.cart.find(item => item.MaTK === $rootScope.User.id);
                if ($scope.cartByUser) {
                    $scope.cartShow = $scope.cartByUser.items;
                    $rootScope.slcart=$scope.cartShow.length;
                } else {
                    $scope.cartShow = [];
                    $rootScope.slcart=0
                }
            });
    };
    $scope.loadCart()
});
app.filter('vndFormat', function() {
    return function(input) {
        if (!isNaN(parseFloat(input)) && isFinite(input)) {
            return parseFloat(input).toLocaleString('vi', { style: 'currency', currency: 'VND' }).replace(',00', '');
        } else {
            return input;
        }
    };
});
