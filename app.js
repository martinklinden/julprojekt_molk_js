/* Includes: */
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

function trackerMain(res) {
    fs.readFile("trackermakermain.html", function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}
function newTracker(res) {
    fs.readFile("trackertemplate.html", function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}
function makeTracker(res) {
    fs.readFile("maketracker.html", function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}
function showAllTrackers(res, files) {
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("  <head>\n");
    res.write("  </head>\n");
    res.write("  <body>\n");
    res.write(" <form action=\"/current\">\n");
    for (var i = 0; i < files.length; i++) {
        res.write("<label for='trackerfile'" + i + ">" + files[i] + "</label>\n");
        res.write("<input type = 'submit' id = 'trackerfile" + i + "' name = 'trackerfile' value = " + i + "></br>\n");
    }
    res.write(" </form>\n");
    res.write("  </body>\n");
    res.write("</html>\n");
    return res.end();
}
function howTo(res) {
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("  <head>\n");
    res.write("  </head>\n");
    res.write("  <body>\n");
    res.write("  <p>HOW TO</p>");
    res.write("  </body>\n");
    res.write("</html>\n");
    return res.end();
}
function showTracker(res, files, query) {
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("  <head>\n");
    res.write("  </head>\n");
    res.write("  <body>\n");

    var qdata = query;
    let data = fs.readFileSync(path.resolve(__dirname, "./Trackers/", files[qdata.trackerfile]));
    let lines = data.toString().split('#');

    var title = lines[0];
    var amountofsubs = lines[1];
    var allsubs = lines[2];
    let separatesubs = allsubs.toString().split('*');
    var amountofcb = lines[3]; //amount of checkboxes
    var checkboxes = lines[4];
    let separatecheckboxes = checkboxes.toString().split('*');
    res.write("     <h1>" + title + "</h1>");
    res.write("     <hr>");
    res.write("		<form action='/savecurrent'>");
    for (i = 0; i < amountofsubs; i++) {
        var currentcheckbox = separatecheckboxes[i];
        res.write("         <h2>" + separatesubs[i] + "</h2>");
        for (j = 0; j < amountofcb; j++) {

            if (currentcheckbox[j] == "1") {
                var checked = "checked";
            }
            else if (currentcheckbox[j] == "0") {
                var checked = "";
            }   
            res.write("			<input type='checkbox' id='x" + i + 'y' + j + "' name='x" + i + 'y' + j + "' value='1' " + checked + ">");
            res.write("			<input type='hidden' id='x" + i + 'y' + j + "' name='x" + i + 'y' + j + "' value='0' " + ">");
        }
    }
    res.write("             <input type='hidden' name='title' value='current'>");
    res.write("             <input type='hidden' name='trackerfile' value='" + qdata.trackerfile + "'>");
    res.write("             <br><input type='submit' value='Submit'>");
    res.write("			</form>");
    res.write("    <p onclick='showFunction()'><a href='http://localhost:8080/'>Back to main</a></p")
    res.write("  </body>\n");
    res.write("</html>\n");
    return res.end();
}

function saveCurrent(res, files, query) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    //console.log("test");
    //console.log(files);
    //var test = parseInt(query["x1y1"]);
    //console.log(test);
    //console.log(query["x1y0"]);
    //console.log(query["x1y1"]);
    //console.log(query["x1y2"]);

    var qdata = query;
    let data = fs.readFileSync(path.resolve(__dirname, "./Trackers/", files[qdata.trackerfile]));
    let lines = data.toString().split('#');

    var title = lines[0];
    var amountofsubs = lines[1];
    var allsubs = lines[2];
    //let separatesubs = allsubs.toString().split('*');
    var amountofcb = lines[3]; //amount of checkboxes
    //var checkboxes = lines[4];
    //let separatecheckboxes = checkboxes.toString().split('*');

    var trackerstochange = {};
    for (i = 0; i < amountofsubs; i++) {
        trackerstochange["z" + i] ="";
        for (j = 0; j < amountofcb; j++) {

            trackerstochange["z" + i] += parseInt(qdata["x" + i + "y" + j]);
        }
        //console.log(trackerstochange["z" + i]);
    }
    //console.log(trackerstochange);
    var fusedcheckboxes = "";
    var s;
    for (s in trackerstochange) {
        fusedcheckboxes += trackerstochange[s] + "*";
    }

    //remove after error added
    //fs.writeFile("/tmp/test", "Hey there!", function (err) {
    //    if (err) {
    //        return console.log(err);
    //    }
    //    console.log("The file was saved!");
    //}); 

    fs.writeFileSync(path.resolve(__dirname, "./Trackers/", files[qdata.trackerfile]),
        title + "#" + amountofsubs + "#" + allsubs + "#" + amountofcb + "#" + fusedcheckboxes);

    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("  <head>\n");
    res.write("  </head>\n");
    res.write("  <body>\n");
    res.write("  <h1>Saved!</h1>\n");
    res.write("  <p>Your tracker " + title + " was saved!</p>\n");
    res.write("   <p><a href='http://localhost:8080/'>Back to main</a></p")
    res.write("  </body>\n");
    res.write("</html>");

    return res.end();
}

/* Register server: */
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var path = q.pathname;
    let directory = "Trackers";
    let files = fs.readdirSync(directory);

    if (path == "/") {
        trackerMain(res);
    }
    else if (path == "/makenew") {
        newTracker(res);
    }
    else if (path == "/current") {
        showTracker(res, files, q.query);
    }
    else if (path == "/show") {
        showAllTrackers(res, files);
    }
    else if (path == "/maketracker") {
        makeTracker(res);
    }
    else if (path == "/howto") {
        howTo(res);
    }
    else if (path == "/savecurrent") {
        saveCurrent(res, files, q.query);
    }
    //res.end();
}).listen(8080);
