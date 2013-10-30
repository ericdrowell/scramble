var page = require('webpage').create();

page.open('http://localhost:1337/processImage.html', function () {
    page.render('example.png');
    phantom.exit();
});
