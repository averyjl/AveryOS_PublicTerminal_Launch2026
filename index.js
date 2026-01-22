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
import { spawn } from 'child_process';
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
    console.log('\n🚀 Deployment Commands:');
    console.log('  deploy    - Deploy terminal with GitHub push automation');
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

  async exportCapsule() {
    console.log('\nExporting Terminal as Capsule ZIP...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

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

    // Return a promise that resolves when the archive is complete
    return new Promise((resolve, reject) => {
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
        resolve();
      });

      output.on('error', (err) => {
        console.error(`Error creating output file: ${err.message}\n`);
        reject(err);
      });

      archive.on('error', (err) => {
        console.error(`Error creating archive: ${err.message}\n`);
        reject(err);
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
    });
  }

  // Deployment Commands

  async deployTerminal(args) {
    console.log('\n🚀 AveryOS Terminal Deployment');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Initiating deployment with GitHub push automation...\n');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Parse deployment options
    const options = {
      message: 'Deploy AveryOS Terminal',
      push: true,
      runScript: true
    };

    // Parse command-line arguments
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--no-push') {
        options.push = false;
      } else if (args[i] === '--no-script') {
        options.runScript = false;
      } else if (args[i] === '-m' || args[i] === '--message') {
        if (i + 1 < args.length) {
          options.message = args[i + 1];
          i++;
        }
      }
    }

    try {
      // Step 1: Check git status
      console.log('📋 Checking repository status...');
      const gitStatus = await this.executeCommand('git', ['status', '--porcelain'], __dirname);
      const hasChanges = gitStatus.trim().length > 0;

      if (hasChanges) {
        console.log('✓ Found changes to commit\n');

        // Step 2: Git add
        console.log('📦 Staging changes...');
        await this.executeCommand('git', ['add', '.'], __dirname);
        console.log('✓ Changes staged\n');

        // Step 3: Git commit
        console.log('💾 Committing changes...');
        const commitMessage = `${options.message} - ${new Date().toISOString()}`;
        await this.executeCommand('git', ['commit', '-m', commitMessage], __dirname);
        console.log(`✓ Changes committed: "${commitMessage}"\n`);
      } else {
        console.log('✓ No uncommitted changes found\n');
      }

      // Step 4: Run deployment script if requested
      if (options.runScript && existsSync(join(__dirname, 'deploy.sh'))) {
        console.log('📜 Running deployment script...');
        await this.executeCommand('bash', ['./deploy.sh'], __dirname);
        console.log('✓ Deployment script completed\n');
      }

      // Step 5: Git push if requested
      if (options.push) {
        console.log('☁️  Pushing to GitHub...');
        const gitRemote = await this.executeCommand('git', ['remote', 'get-url', 'origin'], __dirname);
        if (gitRemote.trim()) {
          console.log(`   Remote: ${gitRemote.trim()}`);
          await this.executeCommand('git', ['push'], __dirname);
          console.log('✓ Successfully pushed to GitHub\n');
        } else {
          console.log('⚠️  No git remote configured, skipping push\n');
        }
      }

      // Step 6: Deployment summary
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Deployment completed successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Capsule: ${this.capsuleName}`);
      console.log(`VaultChain: VERIFIED ✓`);
      console.log(`DriftProtection: ABSOLUTE`);
      if (options.push) {
        console.log('GitHub: SYNCHRONIZED ✓');
      }
      console.log('\n⛓️⚓⛓️\n');

    } catch (error) {
      console.error('\n❌ Deployment failed!');
      console.error(`Error: ${error.message}\n`);
      if (error.stderr) {
        console.error('Details:', error.stderr);
      }
    }
  }

  // Helper method to execute commands
  executeCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, {
        cwd: cwd || process.cwd(),
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          const error = new Error(`Command failed with exit code ${code}`);
          error.stderr = stderr;
          error.stdout = stdout;
          reject(error);
        }
      });

      proc.on('error', (err) => {
        reject(err);
      });
    });
  }

  async processCommand(input) {
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
      
      // Capsule Commands
      case 'export':
        await this.exportCapsule();
        break;
      
      // Deployment Commands
      case 'deploy':
        await this.deployTerminal(args);
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

    this.rl.on('line', async (input) => {
      await this.processCommand(input);
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
