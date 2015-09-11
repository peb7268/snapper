var controllers = angular.module('starter.controllers', []);

controllers.controller('DashCtrl', function($scope, $http) {
  window.app_$scope = $scope;
  window.$http  = $http;
  
  /*
  ** Get the pages list from WP
  */
  function init(){
    $http({
       method : 'POST',
       url    : 'http://timsautoupholstery.com/wp-admin/admin-ajax.php',
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       data: {"action":"snapper_get_pages", "method":"pages"},
       transformRequest: function(obj) {
          var str = [];
          for(var prop in obj){
            var encodedValue = encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop]);
            str.push(encodedValue);
          }  
          
          var urlEncodedData = str.join("&");

          return urlEncodedData;
       }
    }).success(function(pages){
       $scope.pages = pages;
    });
  }

  function takePic(evt){
    var options = { 
        quality : 75, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.CAMERA, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };
    navigator.camera.getPicture(onSuccess, onFail, options);
  }

  function onSuccess(imageData) {
      $scope.imageSnapped = true;
      $scope.imgURI       = "data:image/jpeg;base64," + imageData;
      $scope.$http.post('http://timsautoupholstery.com/wp-content/themes/MobileWorld/snapper-processor.php', {image: $scope.imgURI});
      $scope.$apply();
  }

  function onFail(message) {
      alert('Failed because: ' + message);
  }

  $scope.snapPic = function(evt){
    evt.preventDefault();
    takePic(evt);  
  }

  init();
});

controllers.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

controllers.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

controllers.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
