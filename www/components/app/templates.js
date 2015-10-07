angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("components/auth/auth.html","<div class=\"auth\">\n    <div class=\"card center\">\n        <form class=\"username\" ng-submit=\"username.is = un\">\n            <input type=\"text\" class=\"form-control\" focus ng-model=\"un\" placeholder=\"Enter your name to join the conversation\">\n            <button ng-click=\"username.is = un\">Join!</button>\n        </form>\n    </div>\n</div>\n");
$templateCache.put("components/auth/home.html","<div class=\"home\">\n    <div class=\"inbox\">\n        <div ng-include=\"\'components/inbox/inbox.html\'\"></div>\n    </div>\n    <div class=\"feed hidden-xs hidden-sm\">\n        <div ng-include=\"\'components/feed/feed.html\'\"></div>\n    </div>\n</div>\n");
$templateCache.put("components/conversation/conversation.html","<div class=\"conversation\">\n    <div class=\"card\">\n        <div class=\"users\">\n            <div ng-repeat=\"user in users\" class=\"user\" ng-style=\" color($index)\">\n                {{user |usernameFormat}}\n                <span class=\"tooltip\">{{user}}</span>\n            </div>\n        </div>\n        <div class=\"messages\">\n            <div ng-repeat=\"(i, message) in conversation\" ng-class=\"message.type\">\n                <h3 ng-if=\"message.username !=  conversation[(i-1)].username\">{{message.username}} <span>{{message.timestamp|formatTimestamp}}</span></h3>\n                <span ng-if=\"message.type == \'image\'\"><img class=\"image\" src=\"{{message.data}}\"/></span>\n                <p ng-if=\"message.type == \'text\'\">{{message.data}}</p>\n                <p ng-if=\"message.type == \'link\'\"><a href=\"{{message.data}}\" target=\"_blank\">Read More</a></p>\n            </div>\n            <video autoplay ng-show=\"showVideo\"></video>\n            <span ng-if=\"tmpImage\"><img class=\"tmp-image\" ng-src=\"{{tmpImage}}\"/></span>\n            <h1 class=\"loader\" ng-if=\"isLoading0\">\n                  <span>L</span>\n                  <span>O</span>\n                  <span>A</span\n                  <span>D</span>\n                  <span>I</span>\n                  <span>N</span>\n                  <span>G</span>\n            </h1>\n        </div>\n        <form ng-submit=\"sendMessage()\" class=\"message-enter\">\n            <div class=\"message-input  pull-left\">\n                <label for=\"text\" class=\"sr-only\">Enter Message</label>\n                <textarea type=\"text\" class=\"form-control\" id=\"text\" ng-model=\'newMessage._text\' ng-enter=\"sendMessage()\" placeholder=\"Enter Message\" autocomplete=\"false\" rows=\"1\" tasize></textarea>           \n                <button type=\"submit\" class=\"btn btn-default\" ng-click=\"sendMessage()\" rows=\"1\">Submit</button>\n                <button ng-click=\"fileOpener()\"><i class=\"fa fa-upload\"></i></button>\n                <button ng-click=\"openVideo()\"><i class=\"fa fa-camera-retro\"></i></button>\n            </div>\n            <input class=\"picker\" type=\"file\" id=\"files\" name=\"files[]\" multiple file-select=\"file\" />\n        </form>\n    </div>\n</div>\n");
$templateCache.put("components/feed/feed.html","<div ng-repeat=\"(key, value) in feed\" class=\"card\">\n<h3>{{value.conversation[0].username}}</h3>\n    <div ng-repeat=\"(i, message) in value.conversation\">\n        <span ng-if=\"message.type == \'image\'\"><img src=\"{{message.data}}\"/></span>\n        <p ng-if=\"message.type == \'text\'\">{{message.data}}</p>\n        <p ng-if=\"message.type == \'link\'\"><a href=\"{{message.data}}\" target=\"_blank\">Read More</a></p>\n    </div>\n</div>");
$templateCache.put("components/home/home.html","<div class=\"home\">\n    <div class=\"wrapper noselect\">\n        <img class=\"logo\" src=\"/images/logo.svg\">\n        <h1>Helix.Chat</h1>\n                <div class=\"info\">\n            <p> A simply beautiful way to have a group conversations over text, voice, pictures.</p>\n            <p>No signup. On any device. On any platform.</p>\n        </div>\n        <form ng-submit=\"go()\" class=\"nameGen\">\n            <input ng-model=\"genName\" />\n            <button ng-click=\"go()\">GO!</button>\n        </form>\n    </div>\n    <div id=\"particles-js\"></div>\n</div>\n");
$templateCache.put("components/inbox/inbox.html","<button ng-click=\"createC()\">Create</button>\n<div ng-repeat=\"(key, value) in conversations\" class=\"card\">\n <button ng-click=\"archive(value, key)\"> Archive</button>\n    <div ng-repeat=\"(i, message) in value.conversation\">\n\n        <h3 ng-if=\"message.username !=  value.conversation[(i-1)].username\">{{message.username}}</h3>\n        <span ng-if=\"message.type == \'image\'\"><img src=\"{{message.data}}\"/></span>\n        <p ng-if=\"message.type == \'text\'\">{{message.data}}</p>\n        <p ng-if=\"message.type == \'link\'\"><a href=\"{{message.data}}\" target=\"_blank\">Read More</a></p>\n    </div>\n    {{value._text}}\n    <form ng-submit=\"sendMessage(value)\">\n        <div class=\"form-group\">\n            <label for=\"text\" class=\"sr-only\">Enter Message</label>\n            <input type=\"text\" class=\"form-control\" id=\"text\" ng-model=\'value._text\' placeholder=\"Enter Message\">\n        </div>\n        <button type=\"submit\" class=\"btn btn-default\" ng-click=\"sendMessage(value)\">Submit</button>\n    </form>\n</div>\n");
$templateCache.put("components/route/route.html","<div>\n    <div ng-controller=\"AuthController\" ng-if=\"!username.is\">\n        <div class=\"auth\" ng-include=\"\'components/auth/auth.html\'\"></div>\n    </div>\n    <div ng-controller=\"ConversationController\" ng-if=\"username.is\">\n        <div class=\"conversation-wrapper\" ng-include=\"\'components/conversation/conversation.html\'\"></div>\n    </div>\n</div>\n");}]);