app.controller("cartController", function ($scope, $rootScope, $http) {
    $rootScope.message = "Giỏ hàng";
    $scope.products = [];
    $scope.cartByUser = {};
    $scope.cartShow = [];

    $scope.put = function () {
        $http.put("http://localhost:3000/cart/" + $scope.cartByUser.id, $scope.cartByUser)
            .then(res => {
                $scope.loadData(); 
            })
    }
    $scope.loadData = function () {
        $http.get("http://localhost:3000/products")
            .then(res => {
                $scope.products = res.data;
                $scope.loadCart();
            });
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

    $scope.getProductById = function(productId) {
        return $scope.products.find(product => product.id === productId) || null;
    };
    $scope.deleteProCart = function (item_id) {
        var newitem = $scope.cartByUser.items.filter(item => item.product_id !== item_id);
        $scope.cartByUser.items= newitem;
        console.log($scope.cartByUser.items);
        // Update the cart on the server by posting the modified items array
        $scope.put()
    };
    // Hàm tăng số lượng
    $scope.increase = function (proId, quantity) {
        for (let i = 0; i < $scope.cartByUser.items.length; i++) {
            if ($scope.cartByUser.items[i].product_id === proId) {
                const productIndex = $scope.products.findIndex(product => product.id === proId);
                if (productIndex !== -1) {
                    const product = $scope.products[productIndex];
                    if (quantity < product.SoLuong) {
                        $scope.cartByUser.items[i].quantity++;
                        $scope.put();
                        break;
                    }
                }
            }
        }
    };

    // Hàm giảm số lượng
    $scope.decrease = function (proId, quantity) {
        if (quantity > 1) {
            for (let i = 0; i < $scope.cartByUser.items.length; i++) {
                if ($scope.cartByUser.items[i].product_id === proId) {
                    $scope.cartByUser.items[i].quantity--
                    $scope.put()
                    break
                }
            }
        }else{
            var newitem = $scope.cartByUser.items.filter(item => item.product_id !== proId);
            $scope.cartByUser.items= newitem;
            $scope.put()
        }
    };

    
    $scope.loadData();
});
app.directive("checkQuantity", function() {
    return {
        require: 'ngModel',
        scope: {
            productQuantity: '=' 
        },
        link: function(scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function(value) {
                var sl = value;
                if (sl > scope.productQuantity) {
                    ngModelCtrl.$setValidity('checkQuantity', false);
                    ngModelCtrl.$viewValue = scope.productQuantity;
                    ngModelCtrl.$render();
                    return scope.productQuantity;
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