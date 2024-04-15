app.controller("registerController", function ($scope,$rootScope,$http, $location) {
    $rootScope.message = "Trang Đăng Ký"
    $scope.addUser = function () {
        if ($scope.myForm.$valid) {
            console.log($scope.user);
            $http.post("http://localhost:3000/users", $scope.user)
                .then(res => {
                    $scope.loadData()
                    alert("Đăng ký thành công")
                    $location.path("/login");
                })
        }
    }
    $scope.users = [];
    $scope.loadData = function () {
        $http.get("http://localhost:3000/users")
            .then(res => {
                $scope.users = res.data
            })
    }
    $scope.loadData()
})
app.directive("beyeuRepass", function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function(value) {
                var repass = value;
                if (repass === scope.user.MatKhau) {
                    ngModelCtrl.$setValidity('beyeuRepass', true);
                } else {
                    ngModelCtrl.$setValidity('beyeuRepass', false);
                }
                return value;
            });
        }
    };
});
app.directive("checkEmail", function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function(value) {
                var email = value;
                for (let i = 0; i < scope.users.length; i++) {
                    if (email === scope.users[i].Email) {
                        ngModelCtrl.$setValidity('checkEmail', false);
                        return value; // Thêm return để kết thúc ngModelCtrl.$parsers
                    }
                }
                ngModelCtrl.$setValidity('checkEmail', true);
                return value; // Thêm return để kết thúc ngModelCtrl.$parsers
            });
        }
    };
});