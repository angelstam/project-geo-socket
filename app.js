var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8000);

var locations = [];

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {

  socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () {
      console.log("User connected with nickname: "+name);
      socket.emit('ready');
    });
  });
  //broadcast 
  socket.emit('positions', locations);
  
  socket.on('position', function (data) {
    socket.get('nickname', function (err, name) {
      console.log('Updated postion by: ', name);

      var udata = {'username': name, 'position': data};
      locations[name] = data;
      console.log(locations);
      socket.broadcast.emit('position', udata);
    });
  });


  io.sockets.on('disconnect', function () {
    socket.get('nickname', function(name) {
      console.log(name + " disconnected.");
    });
  });
});
