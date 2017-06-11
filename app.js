var express = require('express');
var app = express();

var http = require("http").Server(app);
var io = require ('socket.io')(http);
app.set('view engine','hbs');

app.get('/',function(request,response){
  response.render('chat.hbs');
});

io.on('connection',function(client){
  console.log('Connected');

  client.on("disconnected",function(){
    console.log("EXITED");
  });

  //client.on('incoming',function(msg){
    //io.emit("chat-msg",msg);
  //});

  client.on('join-room',function(room){
    client.join(room,function(){
      console.log(client.rooms);
      var nickname = client.nickname;
      io.to(room).emit("chat-msg",nickname);
    });
    client.on('incoming',function(msg){
      io.to(msg.room).emit('chat-msg',msg.msg);
    });
  });

});

http.listen(8000,function(){
  console.log("Listening on port 8000");
});
