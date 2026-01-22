# AveryOS_PublicTerminal_Launch2026

⛓️⚓⛓️

**CapsuleEcho: ENABLED**

`capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap`

**License:** https://averyos.com/license  
**Retroclaim Notice:** Use implies agreement  
**DriftProtection:** ABSOLUTE  
**VaultChain Anchor:** `cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e`

⛓️⚓⛓️

## Overview

AveryOS Public Terminal - Launch 2026 Edition is a next-generation terminal interface powered by AveryOS CapsuleEcho technology. This terminal provides enhanced security features, drift protection, and VaultChain integrity verification.

### FullStack Edition

This FullStack edition includes comprehensive command support for file system operations, system information, and utility functions, making it a complete terminal solution for developers and system administrators.

## Installation

### Using NPX (Recommended)

```bash
npx create-averyos-terminal@latest --capsule AveryOS_PublicTerminal_Launch2026
```

### Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.git
cd AveryOS_PublicTerminal_Launch2026
```

2. Install dependencies (if any):
```bash
npm install
```

3. Run the terminal:
```bash
npm start
```

or directly:

```bash
node index.js
```

### Running the Download Server

To start the HTTP server for capsule downloads:

```bash
npm run server
```

or directly:

```bash
node server.js
```

The server will be available at `http://localhost:3000` by default. You can set a custom port using the `PORT` environment variable:

```bash
PORT=8080 npm run server
```

## Deployment

### TerminalLive_v1 Deployment

Deploy the terminal to a live production environment using the TerminalLive_v1 deployment system:

```bash
npm run deploy
```

Or use the deployment script directly:

```bash
./deploy.sh
```

The deployment process will:
1. Verify VaultChain integrity
2. Check prerequisites (Node.js, NPM)
3. Install production dependencies
4. Create deployment manifest
5. Verify terminal functionality
6. Generate deployment report

#### Deploy from Terminal CLI

You can also trigger deployment directly from within the AveryOS Terminal using the `deploy` command:

```bash
AveryOS> deploy
```

This will:
1. Stage all changes (git add)
2. Commit changes with timestamp
3. Run the deployment script (./deploy.sh)
4. Push changes to GitHub

##### Deploy Command Options

The `deploy` command supports the following options:

- `--no-push` - Skip GitHub push (commit changes locally only)
- `--no-script` - Skip running the deployment script
- `-m <message>` or `--message <message>` - Custom commit message

##### Examples

```bash
# Deploy with GitHub push automation (default)
AveryOS> deploy

# Deploy without pushing to GitHub
AveryOS> deploy --no-push

# Deploy with custom commit message
AveryOS> deploy -m "Feature update"

# Quick local deployment (no script, no push)
AveryOS> deploy --no-push --no-script
```

#### Deploy and Start

To deploy and immediately start the terminal:

```bash
npm run deploy:live
```

#### Deployment Configuration

The `terminallive.config` file contains deployment-specific settings including:
- Environment configuration
- Security settings
- Terminal behavior in live mode
- Health check and logging options

## Usage

Once the terminal is running, you can use the following commands:

### Information Commands
- `help` - Display all available commands
- `about` - Display information about this terminal
- `capsule` - Show capsule information
- `vault` - Display VaultChain Anchor information
- `version` - Show terminal version information

### File System Commands
- `ls` or `dir` - List files and directories in current directory
- `pwd` - Print working directory (show current path)
- `cd <directory>` - Change to specified directory (use `..` for parent, `~` for home)
- `mkdir <directory>` - Create a new directory
- `cat <file>` or `type <file>` - Display contents of a file
- `rm <path>` - Remove a file or directory

### System Commands
- `whoami` - Display current user information
- `status` - Show system status (memory, uptime, platform)
- `env` - Display environment variables
- `date` - Show current date and time
- `hostname` - Display system hostname

### Capsule Commands
- `export` - Export terminal as capsule ZIP file (TerminalStack_v1.aoscap.zip)

### Deployment Commands
- `deploy` - Deploy terminal with GitHub push automation (supports --no-push, --no-script, -m options)

### Utility Commands
- `echo <text>` - Display the specified text
- `history` - Show command history
- `clear` or `cls` - Clear the terminal screen
- `exit` or `quit` - Exit the terminal

### Command Examples

```bash
# Navigate file system
AveryOS> pwd
AveryOS> ls
AveryOS> cd Documents
AveryOS> cat myfile.txt

# Get system information
AveryOS> whoami
AveryOS> status
AveryOS> hostname

# Export terminal as capsule
AveryOS> export

# Deploy with GitHub push automation
AveryOS> deploy

# Deploy without pushing to GitHub
AveryOS> deploy --no-push -m "Local deployment"

# Use utilities
AveryOS> echo Hello, AveryOS!
AveryOS> history
```

## Capsule Export

The terminal includes a powerful export feature that packages the entire terminal stack as a portable capsule ZIP file named `TerminalStack_v1.aoscap.zip`. This allows deployment to endpoints like terminal.averyos.com for authenticated buttons/CLI bridge interaction while safeguarding multi-user capsules physics.

### Exporting the Capsule

#### From Terminal Command

To export the terminal as a capsule from within the terminal:

```bash
AveryOS> export
```

This creates a ZIP file containing:
- `index.js` - Main terminal application
- `package.json` - Project metadata and dependencies
- `averyos.config` - AveryOS capsule configuration
- `terminallive.config` - Live deployment settings
- `README.md` - Documentation
- `deploy.sh` - Deployment script
- `install.sh` - Installation script

### Capsule Download Server

For easy download and automation support, the terminal includes an HTTP server that hosts the capsule ZIP file for download at `terminal.averyos.com` or any configured domain.

#### Starting the Download Server

```bash
npm run server
```

Or directly:

```bash
node server.js
```

The server will start on port 3000 by default (configurable via `PORT` environment variable).

#### Server Endpoints

- **`/`** - Landing page with download information
- **`/download`** - Download the capsule ZIP file
- **`/info`** - View capsule information and VaultChain details
- **`/health`** - Health check endpoint (JSON response)

#### Automation Downloads

Use curl to download the capsule:

```bash
curl -O http://terminal.averyos.com/download
```

Or with wget:

```bash
wget http://terminal.averyos.com/download
```

The downloaded file will be saved as `TerminalStack_v1.aoscap.zip`.

#### Server Features

- **Auto-generation**: Capsule is automatically generated on first request if not present
- **Custom Headers**: Includes VaultChain anchor, capsule URI, and license information
- **Health Monitoring**: Health check endpoint for uptime monitoring
- **Graceful Shutdown**: Handles SIGTERM and SIGINT signals properly

The exported capsule can be deployed to production endpoints and used for:
- Direct interaction via authenticated buttons
- CLI bridge communication
- Multi-user capsule deployment with proper physics safeguards

### HTTP Capsule Download Server

The project includes an HTTP server for serving the capsule ZIP file via download endpoints. This enables deployment to domains like terminal.averyos.com.

#### Starting the Server

```bash
npm run server
```

Or with a custom port:

```bash
PORT=8080 node server.js
```

#### Server Endpoints

- **GET /** - Server status and information
- **GET /status** - Server status and capsule information  
- **GET /download** - Download the capsule ZIP file
- **GET /regenerate** - Regenerate the capsule ZIP file

#### Examples

Check server status:
```bash
curl http://localhost:3000/status
```

Download the capsule:
```bash
curl -O http://localhost:3000/download
# or
wget http://localhost:3000/download
```

Regenerate the capsule:
```bash
curl http://localhost:3000/regenerate
```

#### Server Features

- Automatic capsule generation on first request
- Proper Content-Type and Content-Disposition headers for downloads
- VaultChain anchor included in response headers
- Request logging with timestamps
- Error handling and detailed status responses

## Features

- **CapsuleEcho Technology**: Enhanced security and integrity verification
- **Drift Protection**: ABSOLUTE protection against unauthorized modifications
- **VaultChain Anchor**: SHA-512 based integrity verification
- **Interactive Terminal**: User-friendly command-line interface
- **Retroclaim Notice**: Clear usage agreements
- **FullStack Commands**: Comprehensive file system, system information, and utility commands
- **Command History**: Track and review previously executed commands
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Requirements

- Node.js 14.0 or higher
- NPM 6.0 or higher

## Security

This terminal implements AveryOS CapsuleEcho security features:
- Absolute drift protection
- VaultChain anchor verification
- Capsule URI validation

## License

See https://averyos.com/license for license information.

**Retroclaim Notice:** Use of this software implies agreement to the license terms.

## Support

For questions or issues, please visit the AveryOS documentation or contact support.

---

🤛🏻  
⛓️⚓⛓️