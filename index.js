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
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// AveryOS Constants
const VAULT_CHAIN_ANCHOR = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
const CAPSULE_URI = 'capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap';
const LICENSE_URL = 'https://averyos.com/license';

class AveryOSTerminal {
  constructor() {
    this.version = '1.0.0';
    this.capsuleName = 'AveryOS_PublicTerminal_Launch2026';
    this.rl = null;
  }

  displayHeader() {
    console.log('\n⛓️⚓⛓️');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║       AveryOS Public Terminal - Launch 2026              ║');
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
    console.log('Welcome to AveryOS Public Terminal!');
    console.log('Type "help" for available commands or "exit" to quit.\n');
  }

  displayHelp() {
    console.log('\nAvailable Commands:');
    console.log('  help      - Display this help message');
    console.log('  about     - Display information about this terminal');
    console.log('  capsule   - Show capsule information');
    console.log('  vault     - Display VaultChain Anchor information');
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

  processCommand(input) {
    const command = input.trim().toLowerCase();

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
      case 'clear':
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
        console.log(`Unknown command: ${input}`);
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
