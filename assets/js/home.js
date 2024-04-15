app.controller("homeController", function ($scope,$rootScope,$http,$location) {
    $rootScope.message = "Trang Chủ"
    $scope.products = [];
    $scope.category = [];
    $scope.loadData = function () {
        $http.get("http://localhost:3000/products")
            .then(res => {
                $scope.products = res.data
            })
    }
    $rootScope.addProCart = function (proId){
        if (!$rootScope.User) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ')
            $location.path("/login");
        } else {
            var newItem = {
                product_id: proId,
                quantity: 1
            }
            $http.get("http://localhost:3000/cart")
                .then(res => {
                    $scope.cart = res.data;
                    $scope.cartByUser = $scope.cart.find(item => item.MaTK === $rootScope.User.id);
                    if ($scope.cartByUser) {
                        $scope.checkpro = $scope.cartByUser.items.find(item => item.product_id === proId);
                        if ($scope.checkpro) {
                            for (let i = 0; i < $scope.cartByUser.items.length; i++) {
                                if ($scope.cartByUser.items[i].product_id === proId) {
                                    $scope.cartByUser.items[i].quantity += 1
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
    }
    $scope.loadData()
})