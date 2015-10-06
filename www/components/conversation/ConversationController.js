// ConversationController.js
angular
    .module('app')
    .controller('ConversationController', ConversationController);

function ConversationController($scope, $routeParams, $http, $timeout) {

    var localMediaStream = null;
    var webcamList;
    var currentCam = null;
    var photoReady = false;


    $scope.hi = "Hello World"
    console.log('ConversationController')


    $scope.textAreaAdjust = function(o) {
        o.style.height = "1px";
        o.style.height = (o.scrollHeight) + "px";
    }

    $scope.conversation = [];
    $scope.users = []
    var socket;

    $http.get('/api/chat/' + $routeParams.id).success(function() {

        socket = io.connect(location.origin + '/' + $routeParams.id);

        socket.on('init', function(data) {
            console.log(data)
            $scope.conversation = data || []
            $scope.conversation.reverse()
            $scope.$apply()

        });
        socket.emit('init')

        socket.on('connect', function() {
            socket.emit('newUser', $scope.username.is)
        });

        socket.on('newUser', function(user) {

            $scope.users = user;
            $scope.$apply();

        });

        socket.on('message', function(data) {

            $scope.conversation.push(data);
            showNotification(data)

            sc()

            // if (!focused) {
            //     //    tabNotification.flash(data.data)
            //     $scope.setTitle(data.data)
            // }
            $scope.$apply()
        });
    })


    //socket.emit('message', {'ok':":)"})

    hash = []

    for (i = 0; i < 1000; i++) {
        hash.push("#" + ((1 << 24) * Math.random() | 0).toString(16))
    }


    $scope.color = function(i) {
        return {
            //'background-color': 
            'background-color': hash[i]
        }

    }

    $scope.fileOpener = function() {
        document.querySelector('.picker').click()

    }

    $scope.newMessage = {}
    $scope.sendMessage = function() {
        if (!$scope.newMessage._text) {
            return
        }



        var x = $scope.newMessage._text.split('\n')
        x.forEach(function(y) {
            console.log(y)
            var message = {
                username: $scope.username.is,
                type: "text",
                data: y,
                timestamp: Date.now()
            }
            $scope.conversation.push(message);
            socket.emit('message', message)

        })
        $scope.newMessage._text = '';
        sc()

    }


    $scope.sendImage = function(image) {

        console.log(image)

        var message = {
            username: $scope.username.is,
            type: "image",
            data: image,
            timestamp: Date.now()
        }
        $scope.tmpImage = null;

        $scope.conversation.push(message);
        socket.emit('message', message)
        $scope.$apply()
        sc()

    }
    $scope.tmpImage = null;
    $scope.isLoading = false;
    $scope.loading = function() {
        $scope.isLoading = true;
        $scope.$apply();

    }
    $scope.loadTemp = function(image) {
        $scope.tmpImage = image;
        $scope.$apply();
    }


    function sc() {

        var objDiv = document.getElementsByClassName('messages')[0]
        setTimeout(function() {
            objDiv.scrollTop = objDiv.scrollHeight;
        }, 50)

    }


    var nextWebCam = function() {
        // document.getElementById('switch').disabled = true;
        if (currentCam !== null) {
            currentCam++;
            if (currentCam >= webcamList.length) {
                currentCam = 0;
            }
            //  var video = document.getElementById('videoTag');
            var video = document.querySelector('video');
            if (typeof(video.srcObject) !== 'undefined') video.srcObject = null;
            video.src = null;
            if (localMediaStream) {
                var videoTracks = localMediaStream.getVideoTracks();
                videoTracks[0].stop();
                localMediaStream = null;
            }
        } else {
            currentCam = 0;
        }

        navigator.mediaDevices.getUserMedia({
            video: {
                width: 640,
                height: 360,
                deviceId: {
                    exact: webcamList[currentCam]
                }
            }
        }).then(function(stream) {
            var video = document.querySelector('video');

            video.src = window.URL.createObjectURL(stream);
            localMediaStream = stream;

        }).catch(function(e) {});
    };



    $scope.openVideo = function() {
        console.log('video')
        $scope.showVideo = true;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        var video = document.querySelector('video');

        if (navigator.getUserMedia) {

            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {

                navigator.mediaDevices.enumerateDevices().then(function(devices) {


                    webcamList = [];
                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i].kind === 'videoinput') {
                            webcamList[webcamList.length] = devices[i].deviceId;
                        }
                    }

                    if (webcamList.length > 0) {
                        // Start video with the first device on the list
                        nextWebCam();
                        if (webcamList.length > 1) {
                            //  document.getElementById('switch').disabled = false;
                        } else {
                            // document.getElementById('switch').disabled = true;
                        }
                    } else {
                        console.log('Webcam not found.');
                    }

                    //navigator.mediaDevices.addEventListener('devicechange', deviceChanged);





                }).catch(function(e) {
                    console.log(e)
                });

            } else {
                navigator.getUserMedia({
                    audio: false,
                    video: true

                }, function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    localMediaStream = stream;

                    $timeout(function() {
                        $scope.takePicture()
                    }, 2000)

                }, function(e) {
                    console.log(e)
                });

            }


        } else {
            video.src = 'somevideo.webm'; // fallback.
        }
    }
    $scope.takePicture = function() {

        var canvas = document.createElement('canvas');

        var context = canvas.getContext('2d');
        var video = document.querySelector('video');



        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);

        var type = 'image/jpeg';
        var quality = 0.92;

        var im = canvas.toDataURL(type, quality);

        $scope.sendImage(im)
        $scope.showVideo = false;
        localMediaStream.stop()





    }

}


angular
    .module('app')
    .filter('usernameFormat', function() {

        return function(x) {
            var y = x.split(' ')

            var i = y[0][0]


            if (y[1]) {
                i = i + y[1][0]
            }


            return i
        }


    })




angular
    .module('app')
    .directive("fileSelect", function() {
        return {
            restrict: "EA",
            scope: false,
            link: function(scope, elem, attr) {
                elem.bind('change', function(event) {
                    var files = event.target.files;
                    //scope.loading();


                    //console.log(files)
                    var f
                    for (var i = 0, f; f = files[i]; i++) {
                        // var f = files[0]

                        // Only process image files.
                        // if (!f.type.match('image.*')) {
                        //     continue;
                        // }

                        var reader = new FileReader();


                        // Closure to capture the file information.
                        reader.onload = (function(theFile) {
                            return function(e) {
                                // Render thumbnail.
                                // var span = document.createElement('span');
                                // span.innerHTML = ['<img class="thumb" src="', e.target.result,
                                //     '" title="', escape(theFile.name), '"/>'
                                // ].join('');
                                // document.getElementById('list').insertBefore(span, null);
                                //console.log('dir', e.target.result)
                                //console.log(scope)

                                //FIXME
                                // 

                                //$scope.loadTemp(e.target.result)

                                var src = document.body.appendChild(new Image())
                                src.style.display = 'none'




                                src.onload = function() {

                                    var canvas = document.createElement('canvas');

                                    var tmp = new Image(),
                                        context, cW, cH;

                                    var type = 'image/jpeg';
                                    var quality = 0.92;



                                    var iW = src.naturalWidth;
                                    var iH = src.naturalHeight;

                                    var ar = iH / iW;

                                    cW = 1024;
                                    cH = 1024 * ar;


                                    canvas.width = cW;
                                    canvas.height = cH;
                                    context = canvas.getContext('2d');
                                    context.drawImage(src, 0, 0, cW, cH);

                                    var im = canvas.toDataURL(type, quality);

                                    scope.sendImage(im)


                                    document.body.removeChild(src)

                                }

                                src.src = e.target.result;






                            };
                        })(f);

                        // Read in the image file as a data URL.
                        reader.readAsDataURL(f);
                    }



                });
            }
        }
    });

function resize_image(src, dst, type, quality) {
    var tmp = new Image(),
        canvas, context, cW, cH;

    type = type || 'image/jpeg';
    quality = quality || 0.92;

    cW = src.naturalWidth;
    cH = src.naturalHeight;

    tmp.src = src.src;
    tmp.onload = function() {

        canvas = document.createElement('canvas');

        cW /= 2;
        cH /= 2;

        if (cW < src.width) cW = src.width;
        if (cH < src.height) cH = src.height;

        canvas.width = cW;
        canvas.height = cH;
        context = canvas.getContext('2d');
        context.drawImage(tmp, 0, 0, cW, cH);

        dst.src = canvas.toDataURL(type, quality);

        if (cW <= src.width || cH <= src.height)
            return;

        tmp.src = dst.src;
    }

}



angular.module('app').directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter, {
                        'event': event
                    });
                });

                event.preventDefault();
            }
        });
    };
});


var notification;


if (("Notification" in window)) {
    Notification.requestPermission()
}


tabNotification = {

    alert: function(msg) {
        // msg = the message, ti= time interval between title changes(default is 1.5s)
        this.oldTitle = document.title;
        var self = this;
        this.intervalId = setInterval(function() {
            document.title = document.title == msg ? self.oldTitle : msg;
        }, 1500);
        // this.close =  function() {
        //     if (oldTitle) {
        //         clearInterval(intervalId);
        //         document.title = oldTitle;
        //         oldTitle = intervalId = null;
        //     }

        // };
    },
    close: function() {
        if (this.oldTitle) {
            clearInterval(this.intervalId);
            document.title = this.oldTitle;
            this.oldTitle = this.intervalId = null;
        }

    }

}









var showNotification = function(data) {

    tabNotification.alert(data.data)

    if (!("Notification" in window) || focused) {
        // alert("This browser does not support desktop notification");
        return
    }

    // Let's check whether notification permissions have alredy been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        closeNote()
        notification = new Notification(data.data);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                notification = new Notification(data.data);
            }
        });
    }
}

// var tabNotification = {
//     flash: function(title) {
//         document.title = title;
//     }
// }

// var PageTitleNotification = {
//     Vars: {
//         OriginalTitle: document.title,
//         Interval: null
//     },
//     On: function(notification, intervalSpeed) {
//         console.log(notification)
//         var _this = this;
//         _this.Vars.OriginalTitle == document.title
//         document.title = notification;


//     },
//     Off: function() {
//         clearInterval(this.Vars.Interval);
//         document.title = this.Vars.OriginalTitle;
//     }
// }

function closeNote() {
    try {

        notification.close();
    } catch (err) {
        //console.log(err)
    }
    try {

        tabNotification.close()
    } catch (err) {
        //console.log(err)
    }


}
window.focused = true;

function onBlur() {
    window.focused = false;
};

function onFocus() {
    window.focused = true;
    closeNote()
};

if ( /*@cc_on!@*/ false) { // check for Internet Explorer
    document.onfocusin = onFocus;
    document.onfocusout = onBlur;
} else {
    window.onfocus = onFocus;
    window.onblur = onBlur;
}
