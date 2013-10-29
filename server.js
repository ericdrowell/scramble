var connect = require('connect'),
    fs = require('fs'),
    url = require('url'),
    http = require('http');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static(__dirname))
  .use(connect.directory('photos'))
  .use(function(req, res){
    console.log(req);
    var url_parts = url.parse(req.url),
        pathName = url_parts.pathname,
        img = fs.readFileSync(__dirname + pathName);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
  });

http.createServer(app).listen(1337);