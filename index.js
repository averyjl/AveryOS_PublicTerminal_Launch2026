#!/usr/bin/env node

/**
 * ⛓️⚓⛓️
 * 
 * AveryOS Public Terminal - Launch 2026
 * 
 * CapsuleEcho: ENABLED
 * capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap
 * License: https://averyos.com/license
 * Retroclaim Notice: Use implies agreement
 * DriftProtection: ABSOLUTE
 * VaultChain Anchor: cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e
 * 
 * ⛓️⚓⛓️
 */

import { createInterface } from 'readline';
import { readdirSync, statSync, readFileSync, mkdirSync, rmSync, existsSync, createWriteStream } from 'fs';
import { resolve, basename, dirname, join } from 'path';
import { homedir, userInfo, platform, arch, uptime, totalmem, freemem, hostname } from 'os';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

// AveryOS Constants
const VAULT_CHAIN_ANCHOR = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
const CAPSULE_URI = 'capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap';
const LICENSE_URL = 'https://averyos.com/license';

class AveryOSTerminal {
  constructor() {
    this.version = '1.0.0';
    this.capsuleName = 'AveryOS_PublicTerminal_Launch2026';
    this.rl = null;
    this.currentDir = process.cwd();
    this.commandHistory = [];
    this.capsuleTraces = [];
    this.traceIdCounter = 1;
    this.MAX_TRACES = 100; // Maximum number of traces to keep in memory
    this.initializeCapsuleTracing();
  }

  initializeCapsuleTracing() {
    // Initialize CapsuleEcho trace system
    this.logTrace('SYSTEM', 'CapsuleEcho Trace System Initialized', { 
      version: this.version,
      capsule: this.capsuleName,
      vaultAnchor: VAULT_CHAIN_ANCHOR.substring(0, 16) + '...'
    });
  }

  logTrace(category, message, details = {}) {
    const trace = {
      id: this.traceIdCounter++,
      timestamp: new Date().toISOString(),
      category: category,
      message: message,
      details: details,
      capsuleUri: CAPSULE_URI
    };
    this.capsuleTraces.push(trace);
    
    // Keep only the last MAX_TRACES traces to avoid memory issues
    if (this.capsuleTraces.length > this.MAX_TRACES) {
      this.capsuleTraces.shift();
    }
    
    return trace.id;
  }

  displayHeader() {
    console.log('\n⛓️⚓⛓️');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║    AveryOS Terminal - FullStack Edition - Launch 2026   ║');
    console.log('║       CapsuleEcho: ENABLED                               ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('⛓️⚓⛓️\n');
    console.log(`Capsule: ${this.capsuleName}`);
    console.log(`Version: ${this.version}`);
    console.log(`License: ${LICENSE_URL}`);
    console.log('Retroclaim Notice: Use implies agreement');
    console.log('DriftProtection: ABSOLUTE\n');
  }

  displayWelcome() {
    console.log('Welcome to AveryOS Terminal - FullStack Edition!');
    console.log('Enhanced with file system, system info, and utility commands.');
    console.log('Type "help" for available commands or "exit" to quit.\n');
  }

  displayHelp() {
    console.log('\nAveryOS Terminal - FullStack Commands:');
    console.log('\n📄 Information Commands:');
    console.log('  help      - Display this help message');
    console.log('  about     - Display information about this terminal');
    console.log('  capsule   - Show capsule information');
    console.log('  vault     - Display VaultChain Anchor information');
    console.log('  version   - Show terminal version');
    console.log('\n📁 File System Commands:');
    console.log('  ls        - List files in current directory');
    console.log('  pwd       - Print working directory');
    console.log('  cd <dir>  - Change directory');
    console.log('  mkdir <d> - Create directory');
    console.log('  cat <f>   - Display file contents');
    console.log('  rm <f>    - Remove file or directory');
    console.log('\n💻 System Commands:');
    console.log('  whoami    - Display current user');
    console.log('  status    - Show system status');
    console.log('  env       - Display environment variables');
    console.log('  date      - Show current date and time');
    console.log('  hostname  - Display system hostname');
    console.log('\n📦 Capsule Commands:');
    console.log('  export    - Export terminal as capsule ZIP (TerminalStack_v1.aoscap.zip)');
    console.log('\n🔍 CapsuleEcho Trace Commands:');
    console.log('  trace           - View recent capsule traces');
    console.log('  trace-details <id> - Show detailed trace information');
    console.log('  trace-viewer    - Display formatted trace visualization');
    console.log('  trace-clear     - Clear all trace logs');
    console.log('\n🛠️  Utility Commands:');
    console.log('  echo <t>  - Display text');
    console.log('  history   - Show command history');
    console.log('  clear     - Clear the terminal screen');
    console.log('  exit      - Exit the terminal\n');
  }

  displayAbout() {
    console.log('\nAveryOS Public Terminal - Launch 2026');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('A next-generation terminal interface powered by AveryOS.');
    console.log('Built with CapsuleEcho technology for enhanced security');
    console.log('and drift protection.\n');
  }

  displayCapsuleInfo() {
    console.log('\nCapsule Information:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${this.capsuleName}`);
    console.log(`URI: ${CAPSULE_URI}`);
    console.log('Status: ENABLED');
    console.log('DriftProtection: ABSOLUTE\n');
  }

  displayVaultInfo() {
    console.log('\nVaultChain Anchor:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    // Display the hash in two lines for readability
    const firstHalf = VAULT_CHAIN_ANCHOR.substring(0, 64);
    const secondHalf = VAULT_CHAIN_ANCHOR.substring(64);
    console.log(firstHalf);
    console.log(secondHalf);
    console.log('\nIntegrity: VERIFIED ✓\n');
  }

  // FullStack File System Commands
  
  listFiles(args) {
    try {
      const targetDir = args.length > 0 ? resolve(this.currentDir, args[0]) : this.currentDir;
      const files = readdirSync(targetDir);
      
      console.log(`\nDirectory: ${targetDir}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      if (files.length === 0) {
        console.log('(empty directory)');
      } else {
        files.forEach(file => {
          try {
            const filePath = resolve(targetDir, file);
            const stats = statSync(filePath);
            const type = stats.isDirectory() ? '📁' : '📄';
            const size = stats.isDirectory() ? '<DIR>' : `${stats.size} bytes`;
            console.log(`${type} ${file.padEnd(30)} ${size}`);
          } catch (err) {
            console.log(`❌ ${file.padEnd(30)} (access denied)`);
          }
        });
      }
      console.log('');
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
    }
  }

  printWorkingDirectory() {
    console.log(`\n${this.currentDir}\n`);
  }

  changeDirectory(args) {
    if (args.length === 0) {
      const previousDir = this.currentDir;
      this.currentDir = homedir();
      console.log(`Changed to home directory: ${this.currentDir}\n`);
      this.logTrace('FILE', 'Changed to home directory', { 
        from: previousDir, 
        to: this.currentDir 
      });
      return;
    }

    try {
      const previousDir = this.currentDir;
      const targetDir = args[0] === '..' 
        ? dirname(this.currentDir)
        : args[0] === '~'
        ? homedir()
        : resolve(this.currentDir, args[0]);

      if (existsSync(targetDir)) {
        const stats = statSync(targetDir);
        if (stats.isDirectory()) {
          this.currentDir = targetDir;
          console.log(`Changed directory to: ${this.currentDir}\n`);
          this.logTrace('FILE', 'Directory changed', { 
            from: previousDir,
            to: this.currentDir 
          });
        } else {
          console.log(`Error: ${args[0]} is not a directory\n`);
          this.logTrace('ERROR', 'Directory change failed - not a directory', { 
            path: args[0] 
          });
        }
      } else {
        console.log(`Error: Directory not found: ${args[0]}\n`);
        this.logTrace('ERROR', 'Directory change failed - not found', { 
          path: args[0] 
        });
      }
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
      this.logTrace('ERROR', 'Directory change failed', { 
        error: err.message 
      });
    }
  }

  makeDirectory(args) {
    if (args.length === 0) {
      console.log('Error: Please specify a directory name\n');
      return;
    }

    try {
      const targetDir = resolve(this.currentDir, args[0]);
      mkdirSync(targetDir, { recursive: true });
      console.log(`Directory created: ${args[0]}\n`);
      this.logTrace('FILE', 'Directory created', { 
        path: targetDir 
      });
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
      this.logTrace('ERROR', 'Directory creation failed', { 
        path: args[0],
        error: err.message 
      });
    }
  }

  catFile(args) {
    if (args.length === 0) {
      console.log('Error: Please specify a file name\n');
      return;
    }

    try {
      const targetFile = resolve(this.currentDir, args[0]);
      if (!existsSync(targetFile)) {
        console.log(`Error: File not found: ${args[0]}\n`);
        this.logTrace('ERROR', 'File read failed - not found', { 
          path: args[0] 
        });
        return;
      }

      const stats = statSync(targetFile);
      if (!stats.isFile()) {
        console.log(`Error: ${args[0]} is not a file\n`);
        this.logTrace('ERROR', 'File read failed - not a file', { 
          path: args[0] 
        });
        return;
      }

      const content = readFileSync(targetFile, 'utf8');
      console.log('\n' + content + '\n');
      this.logTrace('FILE', 'File read', { 
        path: targetFile,
        size: stats.size 
      });
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
      this.logTrace('ERROR', 'File read failed', { 
        path: args[0],
        error: err.message 
      });
    }
  }

  removeFile(args) {
    if (args.length === 0) {
      console.log('Error: Please specify a file or directory name\n');
      return;
    }

    try {
      const targetPath = resolve(this.currentDir, args[0]);
      if (!existsSync(targetPath)) {
        console.log(`Error: File or directory not found: ${args[0]}\n`);
        this.logTrace('ERROR', 'Remove failed - not found', { 
          path: args[0] 
        });
        return;
      }

      rmSync(targetPath, { recursive: true, force: true });
      console.log(`Removed: ${args[0]}\n`);
      this.logTrace('FILE', 'File/directory removed', { 
        path: targetPath 
      });
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
      this.logTrace('ERROR', 'Remove failed', { 
        path: args[0],
        error: err.message 
      });
    }
  }

  // FullStack System Commands

  displayWhoAmI() {
    try {
      const user = userInfo();
      console.log('\nCurrent User Information:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Username: ${user.username}`);
      console.log(`UID: ${user.uid}`);
      console.log(`GID: ${user.gid}`);
      console.log(`Home: ${user.homedir}`);
      console.log(`Shell: ${user.shell || 'N/A'}\n`);
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
    }
  }

  displaySystemStatus() {
    try {
      const uptimeSeconds = uptime();
      const uptimeHours = Math.floor(uptimeSeconds / 3600);
      const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
      const totalMemGB = (totalmem() / (1024 ** 3)).toFixed(2);
      const freeMemGB = (freemem() / (1024 ** 3)).toFixed(2);
      const usedMemGB = ((totalmem() - freemem()) / (1024 ** 3)).toFixed(2);
      const memUsagePercent = ((usedMemGB / totalMemGB) * 100).toFixed(1);

      console.log('\nSystem Status:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Hostname: ${hostname()}`);
      console.log(`Platform: ${platform()} (${arch()})`);
      console.log(`Uptime: ${uptimeHours}h ${uptimeMinutes}m`);
      console.log(`Memory: ${usedMemGB}GB / ${totalMemGB}GB (${memUsagePercent}% used)`);
      console.log(`Node.js: ${process.version}`);
      console.log(`PID: ${process.pid}\n`);
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
    }
  }

  displayEnvironment() {
    console.log('\nEnvironment Variables:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const envVars = Object.keys(process.env).sort();
    envVars.forEach(key => {
      const value = process.env[key];
      // Truncate very long values
      const displayValue = value && value.length > 50 
        ? value.substring(0, 47) + '...'
        : value;
      console.log(`${key} = ${displayValue}`);
    });
    console.log('');
  }

  displayDateTime() {
    const now = new Date();
    console.log('\nCurrent Date and Time:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Date: ${now.toDateString()}`);
    console.log(`Time: ${now.toTimeString()}`);
    console.log(`ISO: ${now.toISOString()}`);
    console.log(`Timestamp: ${now.getTime()}\n`);
  }

  displayHostname() {
    console.log(`\n${hostname()}\n`);
  }

  displayVersion() {
    console.log('\nVersion Information:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Terminal: ${this.version}`);
    console.log(`Capsule: ${this.capsuleName}`);
    console.log(`Node.js: ${process.version}`);
    console.log(`Platform: ${platform()} ${arch()}\n`);
  }

  // FullStack Utility Commands

  echoText(args) {
    console.log('\n' + args.join(' ') + '\n');
  }

  displayHistory() {
    console.log('\nCommand History:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (this.commandHistory.length === 0) {
      console.log('(no commands in history)');
    } else {
      this.commandHistory.forEach((cmd, index) => {
        console.log(`${(index + 1).toString().padStart(4)}  ${cmd}`);
      });
    }
    console.log('');
  }

  exportCapsule() {
    console.log('\nExporting Terminal as Capsule ZIP...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Log trace for export operation
    this.logTrace('CAPSULE', 'Capsule export initiated', {
      outputFile: 'TerminalStack_v1.aoscap.zip'
    });

    const outputFileName = 'TerminalStack_v1.aoscap.zip';
    const outputPath = resolve(process.cwd(), outputFileName);
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Essential files to include in the capsule
    const filesToInclude = [
      'index.js',
      'package.json',
      'averyos.config',
      'terminallive.config',
      'README.md',
      'deploy.sh',
      'install.sh'
    ];

    output.on('close', () => {
      const sizeInMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
      console.log(`✓ Capsule exported successfully!`);
      console.log(`  File: ${outputFileName}`);
      console.log(`  Size: ${sizeInMB} MB`);
      console.log(`  Location: ${outputPath}`);
      console.log('\nCapsule Contents:');
      filesToInclude.forEach(file => {
        console.log(`  ✓ ${file}`);
      });
      console.log('\nThe capsule can now be deployed to endpoints like terminal.averyos.com');
      console.log('for authenticated buttons/CLI bridge interaction.\n');
      
      // Log successful export
      this.logTrace('CAPSULE', 'Capsule export completed successfully', {
        outputFile: outputFileName,
        sizeInMB: sizeInMB,
        filesIncluded: filesToInclude.length
      });
    });

    output.on('error', (err) => {
      console.error(`Error creating output file: ${err.message}\n`);
      this.logTrace('ERROR', 'Capsule export failed - output error', {
        error: err.message
      });
    });

    archive.on('error', (err) => {
      console.error(`Error creating archive: ${err.message}\n`);
      this.logTrace('ERROR', 'Capsule export failed - archive error', {
        error: err.message
      });
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(`Warning: ${err.message}`);
      } else {
        console.warn(`Archive warning: ${err.message}`);
      }
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add files to the archive
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    filesToInclude.forEach(file => {
      const filePath = join(__dirname, file);
      if (existsSync(filePath)) {
        archive.file(filePath, { name: file });
      } else {
        console.warn(`Warning: File not found: ${file}`);
      }
    });

    // Finalize the archive
    archive.finalize();
  }

  // CapsuleEcho Trace Viewer Commands

  displayTraces(args) {
    let limit = 20; // Default limit
    
    if (args.length > 0) {
      const parsedLimit = parseInt(args[0]);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        console.log('Error: Please specify a valid positive number for trace limit\n');
        return;
      }
      limit = parsedLimit;
    }
    
    const traces = this.capsuleTraces.slice(-limit);

    console.log('\n🔍 CapsuleEcho Trace Logs:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (traces.length === 0) {
      console.log('(no traces recorded)');
      console.log('');
      return;
    }

    console.log(`Showing last ${traces.length} traces:\n`);
    
    traces.forEach(trace => {
      const time = new Date(trace.timestamp).toLocaleTimeString();
      const categoryIcon = this.getCategoryIcon(trace.category);
      console.log(`${categoryIcon} [${trace.id}] ${time} - ${trace.category}: ${trace.message}`);
    });
    
    console.log('\n💡 Use "trace-details <id>" to view detailed information');
    console.log('💡 Use "trace-viewer" for formatted visualization\n');
  }

  displayTraceDetails(args) {
    if (args.length === 0) {
      console.log('Error: Please specify a trace ID\n');
      console.log('Usage: trace-details <id>\n');
      return;
    }

    const parsedId = parseInt(args[0]);
    if (isNaN(parsedId)) {
      console.log(`Error: Invalid trace ID "${args[0]}" - must be a number\n`);
      return;
    }

    const trace = this.capsuleTraces.find(t => t.id === parsedId);

    if (!trace) {
      console.log(`Error: Trace ID ${parsedId} not found\n`);
      return;
    }

    console.log('\n🔍 CapsuleEcho Trace Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Trace ID: ${trace.id}`);
    console.log(`Timestamp: ${trace.timestamp}`);
    console.log(`Category: ${trace.category}`);
    console.log(`Message: ${trace.message}`);
    console.log(`Capsule URI: ${trace.capsuleUri}`);
    
    if (Object.keys(trace.details).length > 0) {
      console.log('\nDetails:');
      Object.entries(trace.details).forEach(([key, value]) => {
        const displayValue = typeof value === 'object' 
          ? JSON.stringify(value, null, 2).split('\n').map((line, idx) => idx === 0 ? line : '  ' + line).join('\n')
          : value;
        console.log(`  ${key}: ${displayValue}`);
      });
    }
    console.log('');
  }

  displayTraceViewer() {
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║               🔍 CapsuleEcho Trace Viewer Dashboard                        ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝');
    console.log('');
    
    // Summary Statistics
    const totalTraces = this.capsuleTraces.length;
    const categories = {};
    this.capsuleTraces.forEach(trace => {
      categories[trace.category] = (categories[trace.category] || 0) + 1;
    });

    console.log('📊 Trace Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Traces: ${totalTraces}`);
    console.log(`Categories: ${Object.keys(categories).length}`);
    console.log('');
    
    // Category Breakdown
    console.log('📋 Category Breakdown:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
      const icon = this.getCategoryIcon(category);
      const percentage = ((count / totalTraces) * 100).toFixed(1);
      // Ensure at least one bar for any category with traces
      const barCount = Math.max(1, Math.floor(count / 2));
      const bar = '█'.repeat(barCount);
      console.log(`${icon} ${category.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%) ${bar}`);
    });
    console.log('');
    
    // Recent Activity Timeline
    console.log('📅 Recent Activity Timeline (Last 10):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const recentTraces = this.capsuleTraces.slice(-10);
    
    if (recentTraces.length === 0) {
      console.log('(no recent activity)');
    } else {
      recentTraces.forEach(trace => {
        const time = new Date(trace.timestamp).toLocaleTimeString();
        const icon = this.getCategoryIcon(trace.category);
        const shortMessage = trace.message.length > 50 
          ? trace.message.substring(0, 47) + '...' 
          : trace.message;
        console.log(`  ${icon} ${time} │ ${trace.category.padEnd(10)} │ ${shortMessage}`);
      });
    }
    console.log('');
    
    // Capsule Information
    console.log('📦 Active Capsule:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${this.capsuleName}`);
    console.log(`URI: ${CAPSULE_URI}`);
    console.log(`Vault Anchor: ${VAULT_CHAIN_ANCHOR.substring(0, 32)}...`);
    console.log('');
    
    console.log('💡 Commands:');
    console.log('  trace               - View all traces');
    console.log('  trace-details <id>  - View trace details');
    console.log('  trace-clear         - Clear all traces\n');
  }

  clearTraces() {
    const clearedCount = this.capsuleTraces.length;
    this.capsuleTraces = [];
    this.traceIdCounter = 1;
    
    console.log('\n🔍 CapsuleEcho Trace System:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✓ Cleared ${clearedCount} trace logs`);
    console.log('✓ Trace system reset\n');
    
    // Reinitialize with a fresh trace
    this.initializeCapsuleTracing();
  }

  getCategoryIcon(category) {
    const icons = {
      'SYSTEM': '⚙️',
      'CAPSULE': '📦',
      'COMMAND': '⌨️',
      'FILE': '📄',
      'ERROR': '❌',
      'WARNING': '⚠️',
      'INFO': 'ℹ️',
      'SUCCESS': '✅'
    };
    return icons[category] || '🔹';
  }

  processCommand(input) {
    const trimmedInput = input.trim();
    const parts = trimmedInput.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Add to history (skip empty commands)
    if (trimmedInput) {
      this.commandHistory.push(trimmedInput);
      // Log command execution trace
      this.logTrace('COMMAND', `Command executed: ${command}`, { 
        args: args.length > 0 ? args : null 
      });
    }

    switch (command) {
      case 'help':
        this.displayHelp();
        break;
      case 'about':
        this.displayAbout();
        break;
      case 'capsule':
        this.displayCapsuleInfo();
        break;
      case 'vault':
        this.displayVaultInfo();
        break;
      case 'version':
        this.displayVersion();
        break;
      
      // Capsule Commands
      case 'export':
        this.exportCapsule();
        break;
      
      // CapsuleEcho Trace Commands
      case 'trace':
        this.displayTraces(args);
        break;
      case 'trace-details':
        this.displayTraceDetails(args);
        break;
      case 'trace-viewer':
        this.displayTraceViewer();
        break;
      case 'trace-clear':
        this.clearTraces();
        break;
      
      // File System Commands
      case 'ls':
      case 'dir':
        this.listFiles(args);
        break;
      case 'pwd':
        this.printWorkingDirectory();
        break;
      case 'cd':
        this.changeDirectory(args);
        break;
      case 'mkdir':
        this.makeDirectory(args);
        break;
      case 'cat':
      case 'type':
        this.catFile(args);
        break;
      case 'rm':
        this.removeFile(args);
        break;
      
      // System Commands
      case 'whoami':
        this.displayWhoAmI();
        break;
      case 'status':
        this.displaySystemStatus();
        break;
      case 'env':
        this.displayEnvironment();
        break;
      case 'date':
        this.displayDateTime();
        break;
      case 'hostname':
        this.displayHostname();
        break;
      
      // Utility Commands
      case 'echo':
        this.echoText(args);
        break;
      case 'history':
        this.displayHistory();
        break;
      case 'clear':
      case 'cls':
        console.clear();
        this.displayHeader();
        break;
      case 'exit':
      case 'quit':
        console.log('\nExiting AveryOS Terminal...');
        console.log('⛓️⚓⛓️\n');
        this.logTrace('SYSTEM', 'Terminal session ended', { 
          totalCommands: this.commandHistory.length,
          totalTraces: this.capsuleTraces.length
        });
        this.rl.close();
        process.exit(0);
        break;
      case '':
        // Empty input, just show prompt again
        break;
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Type "help" for available commands.\n');
        this.logTrace('WARNING', `Unknown command attempted: ${command}`, {});
    }
  }

  start() {
    this.displayHeader();
    this.displayWelcome();
    
    // Log terminal start
    this.logTrace('SYSTEM', 'Terminal session started', {
      user: userInfo().username,
      platform: platform(),
      nodeVersion: process.version
    });

    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'AveryOS> '
    });

    this.rl.prompt();

    this.rl.on('line', (input) => {
      this.processCommand(input);
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\nTerminal session closed.');
      process.exit(0);
    });
  }
}

// Start the terminal
const terminal = new AveryOSTerminal();
terminal.start();
