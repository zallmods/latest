const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8196;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Enhanced error logging function
const logError = (source, error) => {
    console.error(`[ERROR] ${source}:`, error);
};

// Secure command execution with improved error handling
const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        // Add a list of allowed commands to prevent arbitrary execution
        const allowedCommandPrefixes = [
            'cd method && node mix.js',
            'cd method && node udp.js',
            'cd method && node tornado',
            'cd method && node TLS.js',
            'cd method && node RAPID',
            'cd method && node Cibi',
            'cd method && node MixBill.js'
        ];

        // Check if the command starts with any allowed prefix
        const isAllowedCommand = allowedCommandPrefixes.some(prefix => 
            command.trim().startsWith(prefix)
        );

        if (!isAllowedCommand) {
            return reject(new Error('Unauthorized command'));
        }

        exec(command, { 
            timeout: 600000, // 2 minutes timeout
            maxBuffer: 1024 * 1024 // 1MB max buffer
        }, (error, stdout, stderr) => {
            if (error) {
                logError('Command Execution', error);
                return reject(error);
            }

            if (stderr) {
                logError('Command STDERR', stderr);
            }

            resolve({ stdout, stderr });
        });
    });
};

// Execute command route with comprehensive error handling
app.post('/execute', async (req, res) => {
    const { command } = req.body;
    
    if (!command) {
        return res.status(400).json({
            status: 'error',
            message: 'No command received'
        });
    }
    
    try {
        const result = await executeCommand(command);
        
        res.json({
            status: 'success',
            output: result.stdout || result.stderr || 'Command executed successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logError('Execute Route', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Command execution failed',
            details: error.toString()
        });
    }
});

// Status route with system information
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        server: os.hostname(),
        platform: os.platform(),
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Broadcast Command Server',
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logError('Unhandled Error', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Hostname: ${os.hostname()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
