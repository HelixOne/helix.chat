var koa = require('koa')
var q = require('q');
var _ = require('lodash');
var route = require('koa-route')
var cors = require('koa-cors');
var bodyParser = require('koa-bodyparser');
var request = require('koa-request');
var crypto = require('crypto');
var serve = require('koa-static');
var fs = require('fs');
var port = process.env.port || 1337;

var servDir = __dirname + '/build'

var co = require('co')


var app = koa()

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser());

var errors = []
app.use(function*(next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;
        this.body = err.message;
        var e = {}
        e.message = err.message;
        e.stack = err.stack
        e.ctx = this;
        errors.push(e)
        logerrors(e)

    }
});

app.use(function* pageNotFound(next) {
    yield next;

    if (404 != this.status) return;

    // we need to explicitly set 404 here
    // so that koa doesn't assign 200 on body=
    this.status = 404;

    switch (this.accepts('html', 'json')) {
        case 'html':
            this.type = 'html';
            this.body = this.body = yield readFileThunk(servDir + '/404.html');;
            break;
        case 'json':
            this.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            this.type = 'text';
            this.body = 'Page Not Found';
    }
})

app.use(serve(servDir));


//routes
app.use(route.get('/', a));
app.use(route.get('/:id', a));
app.use(route.get('/chat/', a));
app.use(route.get('/api/chat/:id', chat));


var readFileThunk = function(src) {
    return new Promise(function(resolve, reject) {
        fs.readFile(src, {
            'encoding': 'utf8'
        }, function(err, data) {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

function logerrors(err) { }
var body = {};
var connections = {};
var delTimeout = 1000 * 60 * 60 * 24;


function* a() {
    this.body = yield readFileThunk(servDir + '/app.html');
}

function* chat(id) {


    if (!connections[id]) {
        var ns = io.of(id)
        ns.on('connection', handleConnection(id));
        connections[id] = ns
        connections[id].chat = []
        connections[id].users = {}
        setTimeout(function() {
            deleteChat(id)

        }, delTimeout)
    }

    this.body = {
        status: 'done'
    }

}

function deleteChat(id) {

    if (connections[id]) {
        connections[id].chat = []
        setTimeout(function() {
            deleteChat(id)
        }, delTimeout)

    }
}



var server = require('http').Server(app.callback()),
    io = require('socket.io')(server);
var socks = []

function handleConnection(id) {
    return function(socket) {
        socks.push(socket);


        socket.on('message', function(message) {
            console.log('rf', id)
            message.timestamp = Date.now(); 
            var x = connections[id].chat
            x = x.slice(0, 999)
            x.unshift(message)

            connections[id].chat = x;
            socket.broadcast.emit('message', message);

        });

        socket.on('newUser', function(name) {
            socket.name = name;
            connections[id].users[name] = name;
            socket.broadcast.emit('newUser', connections[id].users);
        });


    

        socket.on('init', function() {
            socket.emit('init', connections[id].chat)
            socket.emit('newUser', connections[id].users);
        });


     



        socket.on('disconnect', function() {
            delete connections[id].users[socket.name];
            socket.broadcast.emit('newUser', connections[id].users);

            var clients = findClientsSocket(id);
            if (clients.length === 0) {
                 delete connections[id].chat
            }

        });


    };
}


function findClientsSocket(namespace) {
    var res = [],
        ns = io.of(namespace || "/"); // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {          
            res.push(ns.connected[id]);          
        }
    }
    return res;
}
server.listen(port)
