/* Includes: */
var http = require('http');
var url = require('url');
var fs = require('fs');

function trackerMain(res) {
    fs.readFile("trackermakermain.html", function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}

/* Register server: */
http.createServer(function (req, res) {
    //res.writeHead(200, { 'Content-Type': 'text/html' });
    //res.write(req.url);
    var q = url.parse(req.url, true);
    var path = q.pathname;

    //console.log("Serving " + req.url);
    /*
    fs.readFile("trackermakermain.html", function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
    */
    if (path == "/") {
        trackerMain(res);
    }
    //res.end();

}).listen(8080);
