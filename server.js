#!/usr/bin/env node

/**
 * ⛓️⚓⛓️
 * 
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

import { createServer } from 'http';
import { createWriteStream, createReadStream, existsSync, statSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const PORT = process.env.PORT || 3000;
const CAPSULE_FILENAME = 'TerminalStack_v1.aoscap.zip';

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
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error generating capsule');
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
        console.error('❌ Failed to pre-generate capsule');
      }
    });
  } else {
    console.log(`✓ Capsule already exists: ${CAPSULE_FILENAME}\n`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
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
