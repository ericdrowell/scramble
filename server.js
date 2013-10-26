var http = require('http'),
    fs = require('fs'),
    url = require('url');

http.createServer(function (req, res) {
  var url_parts = url.parse(req.url);

  switch(url_parts.pathname) {
  case '/':
    display_root(url_parts.pathname, req, res);
    break;
  case '/scrambler.js':
    display_js(url_parts.pathname, req, res);
    break;
  case '/car.jpg':
    var img = fs.readFileSync('./car.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
    break;
  default:
    display_404(url_parts.pathname, req, res);
  }
  return;

  /**
   * Display the document root
   **/
  function display_root(url, req, res) {
    fs.readFile('index.html', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  }
  /**
   * Display the script
   **/
  function display_js(url, req, res) {
    fs.readFile('scrambler.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
    });
  }
  /**
   * Display the 404 page for content that can't be found
   **/
  function display_404(url, req, res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write("<h1>404 Not Found</h1>");
    res.end("The page you were looking for: "+url+" can not be found");
  }

}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');