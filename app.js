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
    res.write("<head>\n");
    res.write("<meta charset='utf-8'/>\n");
    res.write("<title>Show your trackers</title>\n");
    res.write("<style type='text/css'>\n");
    res.write("body {background: #ff9966;text-align: center;}\n");
    res.write("h1 {font-size: 60px; font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write("button {border-style: dashed; background-color: #ff7733; border-color: black; ");
    res.write("font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write('#backbutton {border-style: dashed; border-color: #ff7733; background-color: black;');
    res.write('color: #ff7733; font-family: "Lucida Console", "Courier New", monospace;}\n');
    res.write("</style>");
    res.write("</head>\n");
    res.write("<body>\n");
    res.write("<h1>Your Trackers:</h1>\n");
    res.write(" <form action=\"/current\">\n");
    for (var i = 0; i < files.length; i++) {
        let filenamearray = files[i].toString().split('.');
        res.write("<button type = 'submit' id = 'trackerfile" + i + "' name = 'trackerfile' value = " + i + ">");
        res.write(filenamearray[0] + "</Button></br><br>\n");
    }
    res.write("</form>\n");
    res.write("<form action='http://localhost:8080/'>");
    res.write('<input id="backbutton" type="submit" value="Back to menu" />');
    res.write("</form>");
    res.write("</body>\n");
    res.write("</html>\n");
    return res.end();
}
function showTracker(res, files, query) {
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("<head>\n");
    res.write("<meta charset='utf-8'/>\n");
    res.write("<title>Show tracker</title>\n");
    res.write("<style type='text/css'>\n");
    res.write("body {background: #ff9966; text-align: center;}\n");
    res.write("table {border-collapse: collapse}\n");
    res.write("th, td {border-bottom: 10px solid black;}\n");
    res.write("h1 {font-size: 60px; font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write("th {font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write(".datenumber {padding: 10px;}\n");
    res.write("h2 {font-size: 20px; font-family: 'Lucida Console', 'Courier New', monospace; text-align: left;}\n");
    res.write("#sbutton {border-style: dashed; background-color: #ff7733; border-color: black; ");
    res.write("font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write('#backbutton {border-style: dashed; border-color: #ff7733; background-color: black;');
    res.write('color: #ff7733; font-family: "Lucida Console", "Courier New", monospace;}\n');
    res.write("</style>");
    res.write("</head>\n");
    res.write("<body>\n");
    var qdata = query;
    let data = fs.readFileSync(path.resolve(__dirname, "./Trackers/", files[qdata.trackerfile]));
    let lines = data.toString().split('#');
    var i = 0, k = 1;
    var title = lines[0];
    var amountofsubs = lines[1];
    var allsubs = lines[2];
    let separatesubs = allsubs.toString().split('*');
    var amountofcb = lines[3]; //amount of checkboxes
    var checkboxes = lines[4];
    let separatecheckboxes = checkboxes.toString().split('*');
    var dateunit = lines[5]; //days, weeks or months
    res.write("<h1>" + title + "</h1>");
    res.write("<form action='/savecurrent'>");
    res.write("<table>");
    res.write("<tr>");
    res.write("<th>" + dateunit + "</th>");
    for (i = 0; i < amountofcb; i++) {
        res.write("<th class='datenumber'>" + k + "</th>");
        k++;
    }
    res.write("</tr>");
    for (i = 0; i < amountofsubs; i++) {
        var currentcheckbox = separatecheckboxes[i];
        res.write("<tr>");
        res.write("<td><h2>" + separatesubs[i] + "</h2></td>");
        for (j = 0; j < amountofcb; j++) {

            if (currentcheckbox[j] == "1") {
                var checked = "checked";
            }
            else if (currentcheckbox[j] == "0") {
                var checked = "";
            }   
            res.write("<td><input type='checkbox' id='x" + i + 'y' + j + "' name='x" + i + 'y' + j + "' value='1' " + checked + "></td>");
            res.write("<input type='hidden' id='x" + i + 'y' + j + "' name='x" + i + 'y' + j + "' value='0' " + ">");
        }
        res.write("</tr>");
    }
    res.write("<input type='hidden' name='title' value='current'>");
    res.write("<input type='hidden' name='trackerfile' value='" + qdata.trackerfile + "'>");
    res.write("</table>");
    res.write("<br><input id='sbutton' type='submit' value='Save'>");
    res.write("</form>");
    res.write("<form action='http://localhost:8080/'>");
    res.write('<br><input id="backbutton" type="submit" value="Back to menu" />');
    res.write("</form>");
    res.write("</body>\n");
    res.write("</html>\n");
    return res.end();
}
function saveCurrent(res, files, query) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var qdata = query;
    let data = fs.readFileSync(path.resolve(__dirname, "./Trackers/", files[qdata.trackerfile]));
    let lines = data.toString().split('#');
    var title = lines[0];
    var amountofsubs = lines[1];
    var allsubs = lines[2];
    var amountofcb = lines[3]; //amount of checkboxes
    var dateunit = lines[5];
    var trackerstochange = {};
    for (i = 0; i < amountofsubs; i++) {
        trackerstochange["z" + i] ="";
        for (j = 0; j < amountofcb; j++) {
            trackerstochange["z" + i] += parseInt(qdata["x" + i + "y" + j]);
        }
    }
    var fusedcheckboxes = "";
    var s;
    for (s in trackerstochange) {
        fusedcheckboxes += trackerstochange[s] + "*";
    }
    fs.writeFileSync(path.resolve(__dirname, "./Trackers/", files[qdata.trackerfile]),
        title + "#" + amountofsubs + "#" + allsubs + "#" + amountofcb + "#" + fusedcheckboxes + "#" + dateunit);
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("<head>\n");
    res.write("<meta charset='utf-8'/>\n");
    res.write("<title>Save tracker</title>\n");
    res.write("<style type='text/css'>\n");
    res.write("body {background: #ff9966; text-align: center;}\n");
    res.write("h1, p {font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write('#backbutton {border-style: dashed; border-color: #ff7733; background-color: black;');
    res.write('color: #ff7733; font-family: "Lucida Console", "Courier New", monospace;}\n');
    res.write("</style>\n");
    res.write("<head>\n");
    res.write("</head>\n");
    res.write("<body>\n");
    res.write("<h1>Saved!</h1>\n");
    res.write("<p>Your tracker '" + title + "' was saved!</p>\n");
    res.write("<form action='http://localhost:8080/'>");
    res.write('<br><input id="backbutton" type="submit" value="Back to menu" />');
    res.write("</form>");
    res.write("</body>\n");
    res.write("</html>");
    return res.end();
}
function createTracker(res, query) {
    var qdata = query;
    var fusedcheckboxes = "";
    var allsubs = "";
    var trackerfilename = qdata.title + ".txt";
    var i = 0;
    for (i = 0; i < qdata.amountoftrackers; i++) {
        fusedcheckboxes += "v*";
    }
    for (i = 0; i < qdata.Subtitle.length; i++) {
        allsubs += qdata.Subtitle[i] + "*";
    }
    fs.writeFileSync(path.resolve(__dirname, "./Trackers/", trackerfilename),
        qdata.title + "#" + qdata.Subtitle.length + "#" + allsubs + "#" + qdata.amountoftrackers + "#" + fusedcheckboxes + "#" + qdata.dateunit);
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("<head>\n");
    res.write("<meta charset='utf-8'/>\n");
    res.write("<title>´Create tracker</title>\n");
    res.write("<style type='text/css'>\n");
    res.write("body {background: #ff9966; text-align: center;}\n");
    res.write("h1, p {font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write('#backbutton {border-style: dashed; border-color: #ff7733; background-color: black;');
    res.write('color: #ff7733; font-family: "Lucida Console", "Courier New", monospace;}\n');
    res.write("</style>\n");
    res.write("</head>\n");
    res.write("<body>\n");
    res.write("<h1>Created!</h1>\n");
    res.write("<p>Your tracker '" + qdata.title + "' was created!</p>\n");
    res.write("<form action='http://localhost:8080/'>");
    res.write('<br><input id="backbutton" type="submit" value="Back to menu" />');
    res.write("</form>");
    res.write("</body>\n");
    res.write("</html>");
    return res.end();
}
function showTrackersBeforeDel(res, files) {
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("<head>\n");
    res.write("<meta charset='utf-8'/>\n");
    res.write("<title>Show trackers before deletion</title>\n");
    res.write("<style type='text/css'>\n");
    res.write("body {background: #ff9966;text-align: center;}\n");
    res.write("h1 {font-size: 60px; font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write("button {border-style: dashed; background-color: #ff7733; border-color: black; ");
    res.write("font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write('#backbutton {border-style: dashed; border-color: #ff7733; background-color: black;');
    res.write('color: #ff7733; font-family: "Lucida Console", "Courier New", monospace;}\n');
    res.write("</style>");
    res.write("<script>");
    res.write("alert('Chosen tracker will be permanetly deleted');");
    res.write("</script>");
    res.write("</head>\n");
    res.write("<body>\n");
    res.write("<h1>Choose tracker to delete:</h1>\n");
    res.write("<form action=\"/deletetracker\">\n");
    for (var i = 0; i < files.length; i++) {
        let filenamearray = files[i].toString().split('.');
        res.write("<button type = 'submit' id = 'trackerfile" + i + "' name = 'trackerfile' value = " + i + ">");
        res.write(filenamearray[0] + "</Button></br><br>\n");
    }
    res.write("</form>\n");
    res.write("<form action='http://localhost:8080/'>");
    res.write('<input id="backbutton" type="submit" value="Back to menu" />');
    res.write("</form>");
    res.write("</body>\n");
    res.write("</html>\n");
    return res.end();
}
function deleteTracker(res, files, query) {
    var qdata = query;
    fs.unlink(path.resolve(__dirname, "./Trackers/", files[qdata.trackerfile]), (err) => {
        if (err) throw err;
    });
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='sv'>\n");
    res.write("<head>\n");
    res.write("<meta charset='utf-8'/>\n");
    res.write("<title>Delete tracker</title>\n");
    res.write("<style type='text/css'>\n");
    res.write("body {background: #ff9966; text-align: center;}\n");
    res.write("h1, p {font-family: 'Lucida Console', 'Courier New', monospace;}\n");
    res.write('#backbutton {border-style: dashed; border-color: #ff7733; background-color: black;');
    res.write('color: #ff7733; font-family: "Lucida Console", "Courier New", monospace;}\n');
    res.write("</style>\n");
    res.write("</head>\n");
    res.write("<body>\n");
    res.write("<h1>Deleted!</h1>\n");
    res.write("<form action='http://localhost:8080/'>");
    res.write('<br><input id="backbutton" type="submit" value="Back to menu" />');
    res.write("</form>");
    res.write("</body>\n");
    res.write("</html>\n");
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
    else if (path == "/createtracker") {
        createTracker(res, q.query);
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
    else if (path == "/savecurrent") {
        saveCurrent(res, files, q.query);
    }
    else if (path == "/deletetracker") {
        deleteTracker(res, files, q.query);
    }
    else if (path == "/showbeforedel") {
        showTrackersBeforeDel(res, files);
    }
}).listen(8080);
