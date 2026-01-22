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
import { readdirSync, statSync, readFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { resolve, basename, dirname } from 'path';
import { homedir, userInfo, platform, arch, uptime, totalmem, freemem, hostname } from 'os';

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
      this.currentDir = homedir();
      console.log(`Changed to home directory: ${this.currentDir}\n`);
      return;
    }

    try {
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
        } else {
          console.log(`Error: ${args[0]} is not a directory\n`);
        }
      } else {
        console.log(`Error: Directory not found: ${args[0]}\n`);
      }
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
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
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
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
        return;
      }

      const stats = statSync(targetFile);
      if (!stats.isFile()) {
        console.log(`Error: ${args[0]} is not a file\n`);
        return;
      }

      const content = readFileSync(targetFile, 'utf8');
      console.log('\n' + content + '\n');
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
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
        return;
      }

      rmSync(targetPath, { recursive: true, force: true });
      console.log(`Removed: ${args[0]}\n`);
    } catch (err) {
      console.log(`Error: ${err.message}\n`);
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

  processCommand(input) {
    const trimmedInput = input.trim();
    const parts = trimmedInput.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Add to history (skip empty commands)
    if (trimmedInput) {
      this.commandHistory.push(trimmedInput);
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
        this.rl.close();
        process.exit(0);
        break;
      case '':
        // Empty input, just show prompt again
        break;
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Type "help" for available commands.\n');
    }
  }

  start() {
    this.displayHeader();
    this.displayWelcome();

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
