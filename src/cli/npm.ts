// SPDX-License-Identifier: MIT
// © 2026 Hannes Stauss (scalarion@nimblescape.com)
// Licensed under the MIT License. See LICENSE in the repository root for details.

// How ts starts npm. On Windows, npm is npm.cmd, a batch file: spawnSync('npm') finds no npm there (ENOENT), because
// Node.js does not try the extensions of PATHEXT, and Node.js starts a batch file only through cmd. So on Windows, ts
// gives cmd one command line, in which the arguments are words of ts (ci, install, --global, typescript@6.0.3) and
// any other argument is quoted. One command line, not a list of arguments with shell: true, because Node.js 24 warns
// about such a list (DEP0190).

import { spawnSync, type SpawnSyncOptions, type SpawnSyncReturns } from 'node:child_process';

/** An argument for cmd: a plain word stays as it is; any other gets double quotes, in which cmd changes nothing. */
function quoteForCmd(argument: string): string {
  return /^[\w@./:=+-]+$/.test(argument) ? argument : `"${argument.replaceAll('"', '""')}"`;
}

/** The command line that cmd runs for npm with `args` on Windows. */
export function npmCommandLine(args: readonly string[]): string {
  return ['npm', ...args.map(quoteForCmd)].join(' ');
}

/** Runs npm with `args` and waits for it; on Windows through cmd. */
export function spawnNpm(
  args: readonly string[],
  options: SpawnSyncOptions = {},
  platform: NodeJS.Platform = process.platform,
): SpawnSyncReturns<string | Buffer> {
  return platform === 'win32' ? spawnSync(npmCommandLine(args), { ...options, shell: true }) : spawnSync('npm', args, options);
}

/**
 * Runs npm with `args`, its output in the terminal, in `cwd`; returns its exit code. When npm cannot start, ts says so
 * and returns 1: without the message, ts would end without a reason.
 */
export function runNpm(args: readonly string[], cwd?: string): number {
  const result = spawnNpm(args, { cwd, stdio: 'inherit' });
  if (result.error) {
    console.error(`ts: npm could not start: ${result.error.message}`);
    return 1;
  }
  return result.status ?? 1;
}
