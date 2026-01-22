#!/usr/bin/env node

/**
 * ⛓️⚓⛓️
 * 
 * AveryOS Capsule Download Server
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

import { createServer } from 'http';
import { createReadStream, existsSync, statSync, createWriteStream } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const PORT = process.env.PORT || 3000;
const CAPSULE_FILENAME = 'TerminalStack_v1.aoscap.zip';
const VAULT_CHAIN_ANCHOR = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
const CAPSULE_URI = 'capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate the capsule ZIP file if it doesn't exist
 */
async function generateCapsule() {
  const outputPath = resolve(__dirname, CAPSULE_FILENAME);
  
  console.log('📦 Generating capsule ZIP...');
  
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

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
      console.log(`✓ Capsule generated: ${CAPSULE_FILENAME} (${sizeInMB} MB)`);
      resolve(outputPath);
    });

    output.on('error', (err) => {
      console.error(`Error creating capsule: ${err.message}`);
      reject(err);
    });

    archive.on('error', (err) => {
      console.error(`Error creating archive: ${err.message}`);
      reject(err);
    });

    archive.pipe(output);

    filesToInclude.forEach(file => {
      const filePath = join(__dirname, file);
      if (existsSync(filePath)) {
        archive.file(filePath, { name: file });
      } else {
        console.warn(`Warning: File not found: ${file}`);
      }
    });

    archive.finalize();
  });
}

/**
 * HTTP request handler
 */
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Log incoming request
  console.log(`${new Date().toISOString()} - ${req.method} ${url.pathname}`);

  // Handle different routes
  if (url.pathname === '/download' || url.pathname === '/download/') {
    // Serve the capsule ZIP file
    const capsulePath = resolve(__dirname, CAPSULE_FILENAME);
    
    // Generate capsule if it doesn't exist
    if (!existsSync(capsulePath)) {
      try {
        await generateCapsule();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Failed to generate capsule',
          message: err.message 
        }));
        return;
      }
    }

    try {
      const stats = statSync(capsulePath);
      const fileSize = stats.size;

      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${CAPSULE_FILENAME}"`,
        'Content-Length': fileSize,
        'X-Capsule-URI': CAPSULE_URI,
        'X-VaultChain-Anchor': VAULT_CHAIN_ANCHOR
      });

      const fileStream = createReadStream(capsulePath);
      fileStream.pipe(res);

      fileStream.on('error', (err) => {
        console.error(`Error streaming file: ${err.message}`);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'File streaming error' }));
        }
      });

    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Failed to read capsule file',
        message: err.message 
      }));
    }

  } else if (url.pathname === '/status' || url.pathname === '/') {
    // Status endpoint
    const capsulePath = resolve(__dirname, CAPSULE_FILENAME);
    const capsuleExists = existsSync(capsulePath);
    const capsuleSize = capsuleExists ? statSync(capsulePath).size : 0;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'AveryOS Capsule Download Server',
      version: '1.0.0',
      capsule: {
        name: 'AveryOS_PublicTerminal_Launch2026',
        uri: CAPSULE_URI,
        filename: CAPSULE_FILENAME,
        available: capsuleExists,
        size: capsuleSize,
        sizeInMB: (capsuleSize / (1024 * 1024)).toFixed(2)
      },
      endpoints: {
        download: '/download',
        status: '/status'
      },
      security: {
        capsuleEcho: 'ENABLED',
        driftProtection: 'ABSOLUTE',
        vaultChainAnchor: VAULT_CHAIN_ANCHOR
      }
    }, null, 2));

  } else if (url.pathname === '/regenerate') {
    // Regenerate capsule endpoint
    try {
      await generateCapsule();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Capsule regenerated successfully',
        filename: CAPSULE_FILENAME
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to regenerate capsule',
        message: err.message
      }));
    }

  } else {
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: `The requested path ${url.pathname} does not exist`,
      availableEndpoints: ['/', '/status', '/download', '/regenerate']
    }));
  }
}

/**
 * Start the server
 */
async function startServer() {
  console.log('\n⛓️⚓⛓️');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║    AveryOS Capsule Download Server                      ║');
  console.log('║    CapsuleEcho: ENABLED                                  ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('⛓️⚓⛓️\n');

  console.log('Capsule Information:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Name: AveryOS_PublicTerminal_Launch2026`);
  console.log(`URI: ${CAPSULE_URI}`);
  console.log(`DriftProtection: ABSOLUTE`);
  console.log(`VaultChain: ${VAULT_CHAIN_ANCHOR.substring(0, 32)}...`);
  console.log('');

  // Generate capsule on startup if it doesn't exist
  const capsulePath = resolve(__dirname, CAPSULE_FILENAME);
  if (!existsSync(capsulePath)) {
    console.log('Capsule not found, generating...\n');
    await generateCapsule();
    console.log('');
  } else {
    const stats = statSync(capsulePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✓ Capsule ready: ${CAPSULE_FILENAME} (${sizeInMB} MB)\n`);
  }

  const server = createServer(handleRequest);

  server.listen(PORT, () => {
    console.log('Server Information:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Status: RUNNING`);
    console.log(`Port: ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log('');
    console.log('Available Endpoints:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  GET /              - Server status and info`);
    console.log(`  GET /status        - Server status and info`);
    console.log(`  GET /download      - Download capsule ZIP`);
    console.log(`  GET /regenerate    - Regenerate capsule ZIP`);
    console.log('');
    console.log('Examples:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  curl http://localhost:${PORT}/status`);
    console.log(`  curl -O http://localhost:${PORT}/download`);
    console.log(`  wget http://localhost:${PORT}/download`);
    console.log('');
    console.log('⛓️⚓⛓️');
    console.log('Server ready for capsule downloads!');
    console.log('Press Ctrl+C to stop the server.\n');
  });

  server.on('error', (err) => {
    console.error(`\n❌ Server error: ${err.message}`);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      console.error(`Try setting a different port: PORT=3001 node server.js`);
    }
    process.exit(1);
  });
}

// Start the server
startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
