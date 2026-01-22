#!/usr/bin/env node

/**
 * ⛓️⚓⛓️
 * 
 * AveryOS Terminal Capsule Download Server
 * AveryOS Capsule Download Server
 * AveryOS Public Terminal - Capsule Download Server
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

import express from 'express';
import { existsSync, statSync, createWriteStream } from 'fs';
import { createServer } from 'http';
import { createReadStream, existsSync, statSync, createWriteStream } from 'fs';
import { createWriteStream, createReadStream, existsSync, statSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// AveryOS Constants
const VAULT_CHAIN_ANCHOR = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
const CAPSULE_URI = 'capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap';
const LICENSE_URL = 'https://averyos.com/license';
const CAPSULE_FILENAME = 'TerminalStack_v1.aoscap.zip';

/**
 * Generate capsule ZIP file on-demand
 */
function generateCapsule() {
  return new Promise((resolve, reject) => {
    const outputPath = join(__dirname, CAPSULE_FILENAME);
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Essential files to include in the capsule
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
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') {
        console.warn(`Archive warning: ${err.message}`);
      }
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add files to the archive
      console.error(`Error creating archive: ${err.message}`);
      reject(err);
    });

    archive.pipe(output);

    filesToInclude.forEach(file => {
      const filePath = join(__dirname, file);
      if (existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    });

    // Finalize the archive
      } else {
        console.warn(`Warning: File not found: ${file}`);
      }
    });

    archive.finalize();
  });
}

// Root endpoint - provides API information
app.get('/', (req, res) => {
  res.json({
    name: 'AveryOS Terminal Capsule Server',
    version: '1.0.0',
    capsule: {
      name: 'AveryOS_PublicTerminal_Launch2026',
      uri: CAPSULE_URI,
      enabled: true,
      driftProtection: 'ABSOLUTE'
    },
    vaultChain: {
      anchor: VAULT_CHAIN_ANCHOR
    },
    license: LICENSE_URL,
    retroclaimNotice: 'Use implies agreement',
    endpoints: {
      download: '/download/capsule',
      info: '/info'
    }
  });
});

// Info endpoint - provides detailed capsule information
app.get('/info', (req, res) => {
  res.json({
    capsule: {
      name: 'AveryOS_PublicTerminal_Launch2026',
      version: '1.0.0',
      uri: CAPSULE_URI,
      filename: CAPSULE_FILENAME,
      enabled: true,
      driftProtection: 'ABSOLUTE'
    },
    vaultChain: {
      anchor: VAULT_CHAIN_ANCHOR,
      verified: true
    },
    license: {
      url: LICENSE_URL,
      retroclaimNotice: 'Use implies agreement'
    },
    download: {
      endpoint: '/download/capsule',
      method: 'GET',
      description: 'Download the Terminal as a portable capsule ZIP file'
    }
  });
});

// Download endpoint - serves the capsule ZIP file
app.get('/download/capsule', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Capsule download requested from ${req.ip}`);
    
    // Check if capsule exists, if not generate it
    const capsulePath = join(__dirname, CAPSULE_FILENAME);
    let needsGeneration = true;
    
    if (existsSync(capsulePath)) {
      // Check if file is recent (less than 1 hour old) and non-empty
      const stats = statSync(capsulePath);
      const fileAge = Date.now() - stats.mtimeMs;
      const oneHour = 60 * 60 * 1000;
      
      if (fileAge < oneHour && stats.size > 0) {
        needsGeneration = false;
        console.log(`[${new Date().toISOString()}] Using cached capsule (age: ${Math.round(fileAge / 1000)}s)`);
      }
    }
    
    if (needsGeneration) {
      console.log(`[${new Date().toISOString()}] Generating fresh capsule...`);
      await generateCapsule();
      console.log(`[${new Date().toISOString()}] Capsule generated successfully`);
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${CAPSULE_FILENAME}"`);
    res.setHeader('X-Capsule-URI', CAPSULE_URI);
    res.setHeader('X-VaultChain-Anchor', VAULT_CHAIN_ANCHOR);
    res.setHeader('X-License', LICENSE_URL);
    
    // Send the file
    res.download(capsulePath, CAPSULE_FILENAME, (err) => {
      if (err) {
        console.error(`[${new Date().toISOString()}] Error sending file:`, err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download capsule' });
        }
      } else {
        console.log(`[${new Date().toISOString()}] Capsule download completed successfully`);
      }
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error generating capsule:`, error);
    res.status(500).json({ 
      error: 'Failed to generate capsule',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: ['/', '/info', '/download/capsule', '/health']
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n⛓️⚓⛓️');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║    AveryOS Terminal Capsule Download Server             ║');
  console.log('║       CapsuleEcho: ENABLED                               ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('⛓️⚓⛓️\n');
  console.log(`Server running on port ${PORT}`);
  console.log(`Capsule: AveryOS_PublicTerminal_Launch2026`);
  console.log(`License: ${LICENSE_URL}`);
  console.log('Retroclaim Notice: Use implies agreement');
  console.log('DriftProtection: ABSOLUTE\n');
  console.log('Available endpoints:');
  console.log(`  GET http://localhost:${PORT}/              - API information`);
  console.log(`  GET http://localhost:${PORT}/info          - Capsule information`);
  console.log(`  GET http://localhost:${PORT}/download/capsule - Download capsule ZIP`);
  console.log(`  GET http://localhost:${PORT}/health        - Health check\n`);
  console.log('Ready to serve capsule downloads!\n');
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

// AveryOS Constants
const VAULT_CHAIN_ANCHOR = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
const CAPSULE_URI = 'capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap';
const LICENSE_URL = 'https://averyos.com/license';

function generateCapsule(callback) {
  console.log('\n🔧 Generating Terminal Capsule...');
  
  const outputPath = resolve(process.cwd(), CAPSULE_FILENAME);
  const output = createWriteStream(outputPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
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
    console.log(`✓ Capsule generated successfully!`);
    console.log(`  File: ${CAPSULE_FILENAME}`);
    console.log(`  Size: ${sizeInMB} MB`);
    console.log(`  Location: ${outputPath}\n`);
    callback(null, outputPath);
  });

  output.on('error', (err) => {
    console.error(`❌ Error creating output file: ${err.message}`);
    callback(err);
  });

  archive.on('error', (err) => {
    console.error(`❌ Error creating archive: ${err.message}`);
    callback(err);
  });

  archive.pipe(output);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  filesToInclude.forEach(file => {
    const filePath = join(__dirname, file);
    if (existsSync(filePath)) {
      archive.file(filePath, { name: file });
    } else {
      console.warn(`⚠️  Warning: File not found: ${file}`);
    }
  });

  archive.finalize();
}

function serveCapsule(res, capsulePath) {
  try {
    const stats = statSync(capsulePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${CAPSULE_FILENAME}"`,
      'Content-Length': stats.size,
      'X-Capsule-URI': CAPSULE_URI,
      'X-VaultChain-Anchor': VAULT_CHAIN_ANCHOR,
      'X-License': LICENSE_URL,
      'Cache-Control': 'no-cache'
    });

    const fileStream = createReadStream(capsulePath);
    fileStream.pipe(res);
    
    console.log(`📦 Serving capsule: ${CAPSULE_FILENAME} (${sizeInMB} MB)`);
  } catch (err) {
    console.error(`❌ Error serving capsule: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

function sendHTML(res, statusCode, title, body) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background-color: #0a0a0a;
      color: #00ff00;
    }
    .container {
      border: 2px solid #00ff00;
      padding: 30px;
      border-radius: 10px;
      background-color: #000;
    }
    h1 {
      text-align: center;
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
    }
    .header {
      text-align: center;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .info {
      margin: 20px 0;
      line-height: 1.8;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      margin: 20px 10px;
      background-color: #00ff00;
      color: #000;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      text-align: center;
    }
    .button:hover {
      background-color: #00cc00;
      box-shadow: 0 0 15px #00ff00;
    }
    .buttons {
      text-align: center;
      margin: 30px 0;
    }
    code {
      background-color: #1a1a1a;
      padding: 2px 6px;
      border-radius: 3px;
      color: #00ccff;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">⛓️⚓⛓️</div>
    ${body}
    <div class="footer">
      <p>⛓️⚓⛓️</p>
      <p>License: <a href="${LICENSE_URL}" style="color: #00ff00;">${LICENSE_URL}</a></p>
      <p>Retroclaim Notice: Use implies agreement</p>
    </div>
  </div>
</body>
</html>`;
  
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  console.log(`📡 ${req.method} ${url.pathname} - ${new Date().toISOString()}`);

  // Health check endpoint
  if (url.pathname === '/health' || url.pathname === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      capsule: CAPSULE_URI,
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Download endpoint - serves the capsule ZIP
  if (url.pathname === '/download' || url.pathname === '/capsule' || url.pathname === '/export') {
    const capsulePath = resolve(process.cwd(), CAPSULE_FILENAME);
    
    // Check if capsule exists
    if (existsSync(capsulePath)) {
      serveCapsule(res, capsulePath);
    } else {
      // Generate the capsule if it doesn't exist
      generateCapsule((err, generatedPath) => {
        if (err) {
          console.error(`❌ Error generating capsule: ${err.message}`);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error generating capsule. Please try again later.');
          return;
        }
        serveCapsule(res, generatedPath);
      });
    }
    return;
  }

  // Root endpoint - landing page
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const body = `
      <h1>AveryOS Public Terminal</h1>
      <h2>Launch 2026 Edition</h2>
      
      <div class="info">
        <p><strong>CapsuleEcho:</strong> ENABLED</p>
        <p><strong>Capsule URI:</strong> <code>${CAPSULE_URI}</code></p>
        <p><strong>DriftProtection:</strong> ABSOLUTE</p>
        <p><strong>Status:</strong> ✓ Active</p>
      </div>

      <div class="buttons">
        <a href="/download" class="button">📦 Download Capsule</a>
        <a href="/info" class="button">ℹ️ Information</a>
      </div>

      <div class="info">
        <h3>Automation Download:</h3>
        <p>Use the following command to download the capsule:</p>
        <code>curl -O http://terminal.averyos.com/download</code>
        <br><br>
        <p>Or with wget:</p>
        <code>wget http://terminal.averyos.com/download</code>
      </div>
    `;
    sendHTML(res, 200, 'AveryOS Public Terminal - Download', body);
    return;
  }

  // Info endpoint
  if (url.pathname === '/info') {
    const body = `
      <h1>Capsule Information</h1>
      
      <div class="info">
        <p><strong>Name:</strong> AveryOS_PublicTerminal_Launch2026</p>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>File:</strong> ${CAPSULE_FILENAME}</p>
        <p><strong>Capsule URI:</strong> <code>${CAPSULE_URI}</code></p>
        <p><strong>DriftProtection:</strong> ABSOLUTE</p>
        <p><strong>VaultChain Anchor:</strong></p>
        <code style="word-break: break-all; display: block; padding: 10px;">${VAULT_CHAIN_ANCHOR}</code>
      </div>

      <div class="buttons">
        <a href="/" class="button">← Back</a>
        <a href="/download" class="button">📦 Download</a>
      </div>
    `;
    sendHTML(res, 200, 'Capsule Information', body);
    return;
  }

  // 404 for all other routes
  const body = `
    <h1>404 - Not Found</h1>
    <p>The requested resource was not found.</p>
    <div class="buttons">
      <a href="/" class="button">← Back to Home</a>
    </div>
  `;
  sendHTML(res, 404, '404 - Not Found', body);
});

server.listen(PORT, () => {
  console.log('\n⛓️⚓⛓️');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  AveryOS Terminal - Capsule Download Server              ║');
  console.log('║  CapsuleEcho: ENABLED                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('⛓️⚓⛓️\n');
  console.log(`🌐 Server running at http://localhost:${PORT}/`);
  console.log(`📦 Capsule download: http://localhost:${PORT}/download`);
  console.log(`ℹ️  Information: http://localhost:${PORT}/info`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('\nPress Ctrl+C to stop the server\n');
  
  // Pre-generate the capsule on startup
  const capsulePath = resolve(process.cwd(), CAPSULE_FILENAME);
  if (!existsSync(capsulePath)) {
    generateCapsule((err) => {
      if (err) {
        console.error('❌ Failed to pre-generate capsule:', err.message);
      }
    });
  } else {
    console.log(`✓ Capsule already exists: ${CAPSULE_FILENAME}\n`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
  console.log('\n\n🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});
