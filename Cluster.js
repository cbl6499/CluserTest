var cluster = require('cluster');
var crypto = require('crypto');
var express = require('express');
var sleep = require('sleep');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        // Erstellen der Arbeiter
        cluster.fork();
    }
} else {
    // Die Arbeiter teilen sich eine TCP Verbindung zum Server
    var app = express();

    app.get('/', function (req, res) {
        // Simuliert die Bearbeitungszeit
        var randSleep = Math.round(10000 + (Math.random() * 10000));
        sleep.usleep(randSleep);

        var numChars = Math.round(5000 + (Math.random() * 5000));
        var randChars = crypto.randomBytes(numChars).toString('hex');
        res.send(randChars);
    });

    // Alle Arbeiter benutzen diesen Port
    app.listen(8080);
}
