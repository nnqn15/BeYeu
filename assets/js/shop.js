app.controller("shopController", function ($scope, $rootScope, $http, $location) {
    $rootScope.message = "Trang Cửa Hàng";
    $scope.products = [];
    if($rootScope.keyword){
        $scope.loadData = function () {
            $http.get("http://localhost:3000/products")
            .then(res => {
                $scope.products = res.data.filter(pro =>
                    pro.TenSP.toLowerCase().includes($rootScope.keyword.toLowerCase())
                );
            })
        };
    }else{
        $scope.loadData = function () {
            $http.get("http://localhost:3000/products")
                .then(res => {
                    $scope.products = res.data;
                    $scope.pageCount=Math.ceil($scope.products.length/6);
                })
        };
    }
    


    $scope.search = function () {
        $http.get("http://localhost:3000/products")
            .then(res => {
                $scope.products = res.data.filter(pro =>
                    pro.TenSP.toLowerCase().includes($rootScope.keyword.toLowerCase())
                );
            })
    };

    $scope.loadData()
    $scope.prop="id"
    $scope.sortBy = function (prop){
        $scope.prop = prop
    }
    $scope.begin=0
    $scope.page = function(page){
        $scope.begin = (page -1)*6;
    }
    $scope.first= function(){
        $scope.begin =0;
    }
    $scope.last= function(){
        $scope.begin = ($scope.pageCount -1)*6;
    }

    //checkbox

    $scope.filterByPrice = function () {
        $scope.products = $scope.products.filter(function (pro) {
            if ($scope.mucGiaAll) return true; // If "Tất cả" checkbox is checked, return true for all products
            if ($scope.tren200 && pro.GiaGiam > 200000) return true;
            if ($scope.tu100den200 && pro.GiaGiam >= 100000 && pro.GiaGiam <= 200000) return true;
            if ($scope.duoi100 && pro.GiaGiam < 100000) return true;
            return false;
        });
        $scope.pageCount=Math.ceil($scope.products.length/6);
    };

    $scope.filterByPrice();
});
