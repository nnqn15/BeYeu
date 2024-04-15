app.controller("adminProductsController", function ($scope, $http, $rootScope) {
    $rootScope.message = "Trang quản lý sản phẩm"
    $scope.addPro = function () {
        if ($scope.myAddForm.$valid) {
            $http.post("http://localhost:3000/products", $scope.product)
                .then(res => {
                    $scope.loadData()
                    alert("Thêm sản phẩm thành công")
                })
        }
    }
    $scope.products = [];
    $scope.category = [];
    $scope.loadData = function () {
        $http.get("http://localhost:3000/products")
            .then(res => {
                $scope.products = res.data
            })
    }
    $scope.loadCategory = function () {
        $http.get("http://localhost:3000/category")
            .then(res => {
                $scope.category = res.data
            })
    }
    $scope.loadData()
    $scope.loadCategory()
    $scope.deletePro = function (id) {
        $http.delete("http://localhost:3000/products/" + id)
            .then(res => {
                $scope.loadData()
            })
    }
    $scope.editPro = function (id) {
        $http.get("http://localhost:3000/products/" + id)
            .then(res => {
                $scope.editPro = res.data
            })
    }
    $scope.updatePro = function () {
        $http.put("http://localhost:3000/products/" + $scope.editPro.id, $scope.editPro)
            .then(res => {
                $scope.loadData()
                alert("Sửa sản phẩm thành công")
            })
    }

    //slug
    $scope.updateSlug = function () {
        if (!$scope.product.TenSP) return;
        $scope.product.slug = $scope.generateSlug($scope.product.TenSP);
    };

    $scope.generateSlug = function (inputText) {
        if (!inputText) return '';
        return inputText
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };
})
app.directive("addGiagiam", function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function (value) {
                var GiaGiam = value;
                if (GiaGiam >= scope.product.Gia) {
                    ngModelCtrl.$setValidity('addGiagiam', false);
                } else {
                    ngModelCtrl.$setValidity('addGiagiam', true);
                }
                return value;
            });
        }
    };
});