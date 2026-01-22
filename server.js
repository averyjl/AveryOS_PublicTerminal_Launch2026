#!/usr/bin/env node

/**
 * ⛓️⚓⛓️
 * 
 * AveryOS Terminal Capsule Download Server
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
      resolve(outputPath);
    });

    output.on('error', (err) => {
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
    filesToInclude.forEach(file => {
      const filePath = join(__dirname, file);
      if (existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    });

    // Finalize the archive
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
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});
