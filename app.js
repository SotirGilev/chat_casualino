var express = require('express'),
    http = require('http');


var app = express();
var bodyParser = require('body-parser');
var usernicknames =[];
var listOfTypingUsers=[];
var httpServer = http.createServer(app).listen(process.env.PORT || 5000,function () {
    console.log("Listening on port 5000");
});

app.get('/',function (req,res) {
    res.sendFile(__dirname + "/" + "index.html");
});
app.use(express.static(__dirname ));
app.use(express.static(__dirname + "/chat"));



io = require('socket.io')(httpServer);

var i =0;
io.on('connection',function (socket) {
    socketio = socket;
    console.log("user connected");
    socket.on("giveMeTheList",function (data) {
        io.sockets.emit('userslist',{arrayUsers:usernicknames,lengthUsers:usernicknames.length});
        //TODO profile pics can be fetched with the facebook_id, which is saved in the database..using the multi-avatar(if I get it running)
    })
    
    console.log(usernicknames);
    socket.on('nickname',function (data) {
        socket.nickname = data;
        if(usernicknames.indexOf(socket.nickname) < 0){
            usernicknames.push(socket.nickname);
        }
        
        socket.emit('thename',socket.nickname);
        
        console.log(usernicknames);
        
    })
    socket.on('init', function () {
        io.sockets.emit('userslist',{arrayUsers:usernicknames,lengthUsers:usernicknames.length});
    })
    
    socket.on('msg',function (data) {
        io.sockets.emit('msg_to_all',{nickname:socket.nickname, msg:data});//socket.nickname + ": " + data);
    });
    socket.on('disconnect',function () {
        socket.emit('userDisconnect',false);
        usernicknames.splice(usernicknames.indexOf(socket.nickname),1);
        io.sockets.emit('userslist',{arrayUsers:usernicknames,lengthUsers:usernicknames.length});
        console.log(usernicknames);
    })
    socket.on('is-typing',function (data) {
        if(listOfTypingUsers.indexOf(socket.nickname) < 0 ){
            listOfTypingUsers.push(socket.nickname);
            io.sockets.emit('who-is-typing',{listOfWhoIsTyping:listOfTypingUsers,lengthOfTypers:listOfTypingUsers.length});
            console.log("who is typing: " + socket.nickname + " the list: " + listOfTypingUsers);
        }
        
    })
    socket.on('is-not-typing',function (data) {
        listOfTypingUsers.splice(listOfTypingUsers.indexOf(socket.nickname),1);
        io.sockets.emit('who-is-typing',{listOfWhoIsTyping:listOfTypingUsers,lengthOfTypers:listOfTypingUsers.length});
        console.log("who is typing: " + socket.nickname + " the list: " + listOfTypingUsers);
    })
    
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post("/login", function (req, res) {
    console.log("user: " + req.body.username);
    if(req.body.username == "admin" && req.body.password == "admin"){
        console.log(req.body.username);
        // $location.path("/chat");
        // socket.emit('nickname','admin');
        socketio.username = req.body.username;
        res.json({
            nickname:'admin',
            id:Math.random()
        });
    }else if(req.body.username == "user" && req.body.password == "user"){
        // $location.path("/chat");
        // socket.emit('nickname','user');
        socketio.username = req.body.username;

        res.json({
            nickname:'user',
            idUser:Math.random()
        });
    }else{
        // $location.path("/");
        // alert("Not a valid user!");
        // res.error({
        //     nickname:'401'
        // });
        res.status = 401;
        res.json({
           nickname:'Not a valid user!',
            idUser:'none'
        });

    }
})
