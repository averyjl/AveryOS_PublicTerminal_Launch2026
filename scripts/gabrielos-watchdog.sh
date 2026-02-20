#!/bin/bash

# ⛓️⚓⛓️
#
# GabrielOS Watchdog - Real-Time Security Monitor
# AveryOS_PublicTerminal_Launch2026
#
# CapsuleEcho: ENABLED
# capsule://JasonLeeAvery/Repos/AveryOS_PublicTerminal_Launch2026.aoscap
# License: https://averyos.com/license
# Retroclaim Notice: Use implies agreement
# DriftProtection: ABSOLUTE
# VaultChain Anchor: cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e
#
# GlyphNote: TAI-grade watchdog for real-time detection of unauthorized shell
#            access and memory tampering. Logs to capsule_logs/ (gitignored).
#            Creator-Lock: ACTIVE
#
# ⛓️⚓⛓️

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
VAULT_ANCHOR="cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e"
WATCHDOG_VERSION="1.0.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
LOG_DIR="${REPO_ROOT}/capsule_logs"
LOG_FILE="${LOG_DIR}/watchdog_$(date +%Y%m%d).log"
INTEGRITY_FILE="${LOG_DIR}/.integrity_baseline"

# Seconds between scans when running in --monitor mode; override with env var
POLL_INTERVAL="${WATCHDOG_POLL:-30}"

# Critical public-terminal files whose integrity must be preserved
MONITORED_FILES=(
  "index.js"
  "server.js"
  "package.json"
  "averyos.config"
  "terminallive.config"
  "deploy.sh"
  "install.sh"
  "scripts/gabrielos-watchdog.sh"
)

# ---------------------------------------------------------------------------
# Logging helpers
# ---------------------------------------------------------------------------
mkdir -p "${LOG_DIR}"

_log() {
  local level="$1"; shift
  local ts
  ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  printf "[%s] [%-7s] %s\n" "${ts}" "${level}" "$*" | tee -a "${LOG_FILE}"
}

info()  { _log "INFO"  "$*"; }
alert() { _log "ALERT" "⚠️  $*"; }
ok()    { _log "OK"    "✓ $*"; }

# ---------------------------------------------------------------------------
# File-integrity baseline and verification
# ---------------------------------------------------------------------------

# Build (or rebuild) a SHA-256 baseline of all monitored files.
build_baseline() {
  info "Building integrity baseline..."
  : > "${INTEGRITY_FILE}"
  local f
  for f in "${MONITORED_FILES[@]}"; do
    local path="${REPO_ROOT}/${f}"
    if [ -f "${path}" ]; then
      sha256sum "${path}" >> "${INTEGRITY_FILE}"
      info "  Baseline: ${f}"
    else
      alert "Baseline skipped (not found): ${f}"
    fi
  done
  ok "Baseline written → ${INTEGRITY_FILE}"
}

# Compare current file hashes against the stored baseline.
# Returns 1 if any file is missing or has been modified.
verify_integrity() {
  local tampered=0

  if [ ! -f "${INTEGRITY_FILE}" ]; then
    alert "No integrity baseline found — run with --baseline first"
    return 1
  fi

  while IFS= read -r line; do
    local expected_hash filepath
    expected_hash="$(echo "${line}" | awk '{print $1}')"
    filepath="$(echo "${line}" | awk '{print $2}')"

    if [ ! -f "${filepath}" ]; then
      alert "MISSING FILE: ${filepath}"
      tampered=1
      continue
    fi

    local actual_hash
    actual_hash="$(sha256sum "${filepath}" | awk '{print $1}')"
    if [ "${actual_hash}" != "${expected_hash}" ]; then
      alert "FILE TAMPERED: ${filepath}"
      alert "  Expected: ${expected_hash}"
      alert "  Actual:   ${actual_hash}"
      tampered=1
    fi
  done < "${INTEGRITY_FILE}"

  return "${tampered}"
}

# ---------------------------------------------------------------------------
# Unauthorized shell-access detection
# ---------------------------------------------------------------------------
detect_shell_access() {
  local suspicious=0

  # Detect interactive shells attached to a terminal (pts/* or tty*).
  # Filters out the watchdog's own PID and its parent.
  local shells
  shells="$(ps aux 2>/dev/null \
    | awk '$0 ~ /[[:space:]](bash|sh|zsh|fish|dash|ksh|tcsh|csh)[[:space:]]/ && $7 ~ /^pts|^tty/ \
           {print $2, $7, $11}' || true)"

  if [ -n "${shells}" ]; then
    while IFS= read -r entry; do
      local pid tty cmd
      pid="$(echo "${entry}" | awk '{print $1}')"
      tty="$(echo "${entry}" | awk '{print $2}')"
      cmd="$(echo "${entry}" | awk '{print $3}')"
      # Skip the watchdog itself and its parent shell
      if [ "${pid}" != "$$" ] && [ "${pid}" != "${PPID}" ]; then
        alert "Unexpected interactive shell — PID=${pid} TTY=${tty} CMD=${cmd}"
        suspicious=1
      fi
    done <<< "${shells}"
  fi

  # Detect established inbound SSH connections on port 22.
  if command -v ss &>/dev/null; then
    local ssh_sessions
    ssh_sessions="$(ss -tnp 2>/dev/null | grep ':22' | grep ESTAB || true)"
    if [ -n "${ssh_sessions}" ]; then
      alert "Active SSH session detected:"
      while IFS= read -r s; do
        alert "  ${s}"
      done <<< "${ssh_sessions}"
      suspicious=1
    fi
  fi

  return "${suspicious}"
}

# ---------------------------------------------------------------------------
# Memory-anomaly / debugging-tool detection
# ---------------------------------------------------------------------------
detect_memory_anomalies() {
  local anomaly=0

  # Flag any Node.js process consuming >80% of system memory.
  local node_procs
  node_procs="$(ps aux 2>/dev/null \
    | awk '/[n]ode/ && $4+0 > 80 {print $2, $4, $11}' || true)"

  if [ -n "${node_procs}" ]; then
    while IFS= read -r proc; do
      local pid mem cmd
      pid="$(echo "${proc}" | awk '{print $1}')"
      mem="$(echo "${proc}" | awk '{print $2}')"
      cmd="$(echo "${proc}" | awk '{print $3}')"
      alert "High Node.js memory usage — PID=${pid} MEM%=${mem} CMD=${cmd}"
      anomaly=1
    done <<< "${node_procs}"
  fi

  # Detect processes that can read/write arbitrary process memory
  # (gdb, strace, ltrace, ptrace wrappers).
  local ptrace_procs
  ptrace_procs="$(ps aux 2>/dev/null \
    | awk '/[g]db|[s]trace|[l]trace|[p]erf|[v]algrind/ {print $2, $11}' || true)"

  if [ -n "${ptrace_procs}" ]; then
    while IFS= read -r proc; do
      local pid cmd
      pid="$(echo "${proc}" | awk '{print $1}')"
      cmd="$(echo "${proc}" | awk '{print $2}')"
      alert "Memory-inspection tool detected — PID=${pid} CMD=${cmd}"
      anomaly=1
    done <<< "${ptrace_procs}"
  fi

  # Detect suspicious /proc/<pid>/mem access (Linux only).
  # Filter to only /proc/<pid>/mem paths to avoid scanning all file descriptors.
  if command -v lsof &>/dev/null; then
    local mem_access
    mem_access="$(lsof -a +D /proc 2>/dev/null | grep '/proc/[0-9]*/mem' || true)"
    if [ -n "${mem_access}" ]; then
      alert "Direct /proc/*/mem access detected:"
      while IFS= read -r line; do
        alert "  ${line}"
      done <<< "${mem_access}"
      anomaly=1
    fi
  fi

  return "${anomaly}"
}

# ---------------------------------------------------------------------------
# Single scan
# ---------------------------------------------------------------------------
run_scan() {
  local issues=0
  info "--- Watchdog Scan Started ---"

  verify_integrity    || issues=$((issues + 1))
  detect_shell_access || issues=$((issues + 1))
  detect_memory_anomalies || issues=$((issues + 1))

  if [ "${issues}" -eq 0 ]; then
    ok "Scan complete — no anomalies detected"
  else
    alert "Scan complete — ${issues} anomaly category(ies) detected (see log)"
  fi
  info "--- Watchdog Scan Finished ---"
  return "${issues}"
}

# ---------------------------------------------------------------------------
# Continuous monitor loop
# ---------------------------------------------------------------------------
run_monitor() {
  info "GabrielOS Watchdog v${WATCHDOG_VERSION} started (PID=$$)"
  info "Poll interval: ${POLL_INTERVAL}s | Log: ${LOG_FILE}"
  info "VaultChain: ${VAULT_ANCHOR:0:32}...${VAULT_ANCHOR: -32}"

  # Build baseline on first launch if none exists yet.
  if [ ! -f "${INTEGRITY_FILE}" ]; then
    build_baseline
  fi

  while true; do
    run_scan || true   # don't let anomalies kill the monitor loop
    sleep "${POLL_INTERVAL}"
  done
}

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
case "${1:-}" in
  --baseline)
    build_baseline
    ;;
  --scan)
    if [ ! -f "${INTEGRITY_FILE}" ]; then
      build_baseline
    fi
    run_scan
    ;;
  --monitor)
    run_monitor
    ;;
  *)
    cat <<EOF
GabrielOS Watchdog v${WATCHDOG_VERSION}
⛓️⚓⛓️

Usage: $0 [--baseline | --scan | --monitor]

  --baseline   Build (or rebuild) the SHA-256 integrity baseline for all
               monitored files.
  --scan       Run a single security scan against the current baseline.
               Builds the baseline automatically if none exists.
  --monitor    Start continuous monitoring, scanning every WATCHDOG_POLL
               seconds (default: ${POLL_INTERVAL}s). Logs to:
               capsule_logs/watchdog_<date>.log

Environment:
  WATCHDOG_POLL   Seconds between scans when using --monitor (default: 30)

Detects:
  • File tampering    — SHA-256 drift from baseline
  • Unauthorized shell — interactive shells on unexpected TTYs / inbound SSH
  • Memory anomalies  — high Node.js memory, debugger/tracer process presence,
                        and direct /proc/*/mem access

Creator-Lock: ACTIVE | DriftProtection: ABSOLUTE
EOF
    exit 0
    ;;
esac
