var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , config = require('./appConfig.js')

app.listen(config.listen);

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
      console.log("Sending positions with the following values:")
      console.log(locations);
      socket.emit('positions', locations);
    });
  });
  //broadcast 
  
  
  socket.on('position', function (data) {
    socket.get('nickname', function (err, name) {
      console.log('Updated postion by: ', name);
      console.log(locations);

      var udata = {'username': name, 'position': data};
      locations[name] = data;
      
      socket.broadcast.emit('position', udata);
    });
  });

/*
  io.sockets.on('disconnect', function () {
    socket.get('nickname', function(name) {
      console.log(name + " disconnected.");
    });
  });

  setTimeout(function() {
    console.log('Timeout Called');
    socket.emit('positions', locations);
  }, 5000);
*/
});
