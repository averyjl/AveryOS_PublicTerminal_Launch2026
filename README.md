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

### CLI Deployment (New!)

Deploy the capsule directly from the terminal CLI using the new `capsule deploy` command:

```bash
AveryOS> capsule deploy
```

This command executes the TerminalLive_v1 deployment script, which will:
1. Verify VaultChain integrity
2. Check prerequisites (Node.js, NPM)
3. Install production dependencies
4. Create deployment manifest
5. Verify terminal functionality
6. Generate deployment report

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

### GitHub Automation

The repository includes automated GitHub Actions workflows for seamless deployment:

#### Auto Push on Commit
Every push to the `main` branch automatically:
1. Verifies VaultChain integrity
2. Generates capsule metadata with commit information
3. Syncs with the capsule registry
4. Reports deployment status

#### Cloudflare Pages Deployment
Automatic deployment to Cloudflare Pages on push to `main`:
1. VaultChain verification
2. Executes deployment script
3. Publishes to Cloudflare Pages
4. Reports deployment status

Both workflows can be monitored in the GitHub Actions tab and provide detailed logs for troubleshooting.

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
- `capsule deploy` - Deploy capsule to production (runs TerminalLive_v1 deployment)

### Deployment Commands
- `deploy` - Deploy terminal with GitHub push automation (supports --no-push, --no-script, -m options)

### CapsuleEcho Trace Commands
- `trace` - View recent capsule traces (default: last 20)
- `trace-details <id>` - Show detailed trace information for a specific trace ID
- `trace-viewer` - Display formatted trace visualization dashboard
- `trace-clear` - Clear all trace logs and reset the trace system

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

# Deploy capsule to production
AveryOS> capsule deploy

# Export terminal as capsule
AveryOS> export

# View CapsuleEcho traces
AveryOS> trace
AveryOS> trace-details 5
AveryOS> trace-viewer
AveryOS> trace-clear
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

## CapsuleEcho Trace Viewer

The terminal includes an integrated CapsuleEcho Trace Viewer for monitoring and visualizing capsule operations. This powerful diagnostic tool helps track system activities, commands, file operations, and capsule events in real-time.

### Trace System Features

- **Automatic Trace Logging**: All commands, file operations, and system events are automatically logged
- **Category Organization**: Traces are organized by category (SYSTEM, COMMAND, FILE, CAPSULE, ERROR, etc.)
- **Detailed Information**: Each trace includes timestamp, category, message, and contextual details
- **Dashboard Visualization**: Interactive dashboard with statistics and timeline views
- **Trace History**: Maintains up to 100 recent traces in memory

### Using the Trace Viewer

#### View Recent Traces

```bash
AveryOS> trace
```

This displays the last 20 traces with timestamps and categories. You can specify a different number:

```bash
AveryOS> trace 50
```

#### View Detailed Trace Information

```bash
AveryOS> trace-details 5
```

Shows complete details for trace ID 5, including:
- Trace ID and timestamp
- Category and message
- Capsule URI
- Detailed contextual information (parameters, paths, errors, etc.)

#### Open the Trace Viewer Dashboard

```bash
AveryOS> trace-viewer
```

Displays a comprehensive dashboard with:
- **Trace Summary**: Total traces and category counts
- **Category Breakdown**: Visual bar chart of trace categories
- **Recent Activity Timeline**: Last 10 trace events
- **Active Capsule Information**: Current capsule details

#### Clear Trace Logs

```bash
AveryOS> trace-clear
```

Clears all trace logs and resets the trace system. This is useful for starting fresh or managing memory usage.

### Trace Categories

The trace system uses the following categories:

- 🔹 **SYSTEM**: System initialization, startup, and shutdown events
- 📦 **CAPSULE**: Capsule export and integrity operations
- ⌨️ **COMMAND**: Command execution tracking
- 📄 **FILE**: File system operations (read, write, directory changes)
- ❌ **ERROR**: Error conditions and failures
- ⚠️ **WARNING**: Warning conditions (unknown commands, etc.)
- ℹ️ **INFO**: Informational messages
- ✅ **SUCCESS**: Successful operation completions

### Example Trace Workflow

```bash
# Start working with files
AveryOS> mkdir myproject
AveryOS> cd myproject
AveryOS> pwd

# View what happened
AveryOS> trace

# Get details on a specific operation
AveryOS> trace-details 3

# Open the full dashboard
AveryOS> trace-viewer

# Clean up when done
AveryOS> trace-clear
```
### Capsule Download Server

The repository includes a web server that provides an HTTP endpoint for downloading the capsule ZIP file. This is ideal for deployment to terminal.averyos.com or similar hosting environments.
### HTTP Capsule Download Server

The project includes an HTTP server for serving the capsule ZIP file via download endpoints. This enables deployment to domains like terminal.averyos.com.

#### Starting the Server

```bash
npm run server
```

By default, the server runs on port 3000. You can change the port using the PORT environment variable:

```bash
PORT=8080 npm run server
```

#### Available Endpoints

- `GET /` - API information and available endpoints
- `GET /info` - Detailed capsule information including VaultChain anchor
- `GET /download/capsule` - Download the TerminalStack_v1.aoscap.zip file
- `GET /health` - Health check endpoint

#### Example Usage

```bash
# Get API information
curl http://localhost:3000/

# Get capsule information
curl http://localhost:3000/info

# Download the capsule ZIP
curl -O -J http://localhost:3000/download/capsule

# Or use wget
wget http://localhost:3000/download/capsule

# Or open in browser
open http://localhost:3000/download/capsule
```

The server automatically generates a fresh capsule on-demand or serves a cached version if it's less than 1 hour old. This ensures downloads always contain the latest terminal code.
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
- **CapsuleEcho Trace Viewer**: Real-time monitoring and visualization of capsule operations
- **Drift Protection**: ABSOLUTE protection against unauthorized modifications
- **VaultChain Anchor**: SHA-512 based integrity verification
- **Interactive Terminal**: User-friendly command-line interface
- **Retroclaim Notice**: Clear usage agreements
- **FullStack Commands**: Comprehensive file system, system information, and utility commands
- **Command History**: Track and review previously executed commands
- **Trace Logging**: Automatic logging of all operations with detailed diagnostics
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