app.controller("productController", function ($scope, $routeParams, $rootScope, $http, $window, $location) {
    $scope.slug = $routeParams.slug;
    $scope.product = {};
    $scope.products = [];
    $scope.productsSame = [];

    $scope.loadData = function () {
        $http.get("http://localhost:3000/products")
            .then(res => {
                $scope.products = res.data;
                $scope.loadCart();
                for (let i = 0; i < $scope.products.length; i++) {
                    if ($scope.products[i].slug === $scope.slug) {
                        $scope.product = $scope.products[i];
                        $rootScope.message = "Chi tiết " + $scope.product.TenSP;
                        $scope.loadproductsame();
                        break;
                    }
                }
            });
    };

    $scope.loadproductsame = function () {
        for (let i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].MaDM === $scope.product.MaDM && $scope.products[i].slug !== $scope.slug) {
                $scope.productsSame.push($scope.products[i]); // Push items to the array
            }
        }
    };
    $scope.quantity = 1; // Khởi tạo số lượng ban đầu là 1

    // Hàm tăng số lượng
    $scope.increase = function () {
        if($scope.quantity < $scope.product.SoLuong){
            $scope.quantity++;
        }
    };

    // Hàm giảm số lượng
    $scope.decrease = function () {
        if ($scope.quantity > 1) {
            $scope.quantity--;
        }
    };

    // Hàm kiểm tra số lượng
    $scope.checkQuantity = function () {
        if ($scope.quantity < 1 || isNaN($scope.quantity)) {
            $scope.quantity = 1;
        }
    };
    $scope.addCart = function () {
        if (!$rootScope.User) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ')
        } else {
            var newItem = {
                product_id: $scope.product.id,
                quantity: $scope.quantity
            }
            $http.get("http://localhost:3000/cart")
                .then(res => {
                    $scope.cart = res.data;
                    $scope.cartByUser = $scope.cart.find(item => item.MaTK === $rootScope.User.id);
                    if ($scope.cartByUser) {
                        $scope.checkpro = $scope.cartByUser.items.find(item => item.product_id === $scope.product.id);
                        if ($scope.checkpro) {
                            for (let i = 0; i < $scope.cartByUser.items.length; i++) {
                                if ($scope.cartByUser.items[i].product_id === $scope.product.id) {
                                    $scope.cartByUser.items[i].quantity += $scope.quantity
                                }
                            }
                            $http.put("http://localhost:3000/cart/" + $scope.cartByUser.id, $scope.cartByUser)
                                .then(res => {
                                    $location.path("/cart");
                                })
                        } else {
                            $scope.cartByUser.items.push(newItem);
                            $http.put("http://localhost:3000/cart/" + $scope.cartByUser.id, $scope.cartByUser)
                                .then(res => {
                                    $location.path("/cart");
                                })
                        }
                    } else {
                        $scope.cartByUser = {
                            MaTK: $rootScope.User.id,
                            items: [
                                newItem
                            ]
                        }
                        $http.post("http://localhost:3000/cart", $scope.cartByUser)
                            .then(res => {
                                $location.path("/cart");
                            })
                    }
                });

        }
    };
    $scope.loadCart = function () {
        $http.get("http://localhost:3000/cart")
            .then(res => {
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
    
    
    $scope.loadData();
});
app.directive("checkQuantity", function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function(value) {
                var sl = value;
                if (sl > scope.product.SoLuong) {
                    ngModelCtrl.$setValidity('checkQuantity', false);
                    ngModelCtrl.$viewValue = scope.product.SoLuong;
                    ngModelCtrl.$render();
                    return scope.product.SoLuong;
                } else if (sl <= 0) {
                    ngModelCtrl.$setValidity('checkQuantity', true);
                    ngModelCtrl.$viewValue = 1;
                    ngModelCtrl.$render();
                    return 1;
                }
                ngModelCtrl.$setValidity('checkQuantity', true);
                return sl;
            });
        }
    };
});
