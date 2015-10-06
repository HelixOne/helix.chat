// HomeController.js
angular
    .module('app')
    .controller('HomeController', HomeController);

function HomeController($scope, $http, $location, api, $rootScope) {


    api.posts.feed().success(function(feed) {
        $scope.feed = feed;
    });
    $scope.archive = function(conversation, i){
       conversation.archive(i)
         
    }

     $scope.conversations = [];

    api.posts.conversations().success(function(conversations) {

       

        conversations.forEach(function(conversation) {

           // console.log(conversation)
            createMessage(conversation)

         });
    });

    $scope.text = 'Hi'
    $scope.sendMessage = function(conversation) {
        if (!conversation._text){return}

        var message = {
            username: $rootScope.common.email,
            type: "text",
            data: conversation._text,

        }
        conversation._text = '';
        conversation.conversation.push(message);
        conversation.socket.emit('message', message)
    }
function createMessage(conversation){
               conversation.archive = function(value, key){
            api.posts.archive(conversation._id, {archive:true});
            $scope.conversations.splice(key, 1)
           }
            $http.get('http://beaconcoffee.azurewebsites.net/' + conversation._id).
            success(function(data, status, headers, config) {
                console.log(data.token)

                conversation.socket = io.connect('http://beaconcoffee.azurewebsites.net/' + data.token);
                conversation.socket.on('message', function(message) {
                    conversation.conversation.push(message);
                    $scope.$apply()
                    console.log(message)
                });
                $scope.conversations.push(conversation)
            })

       // });
}
    $scope.createC = function () {
        api.posts.create({}).success(function(post) {
       // console.log(feed)

               x= {    _id: post.id,
                      conversation: []
                }
                createMessage(x)
    });


    }



}
