// SPDX-License-Identifier: MIT
// © 2026 Hannes Stauss (scalarion@nimblescape.com)
// Licensed under the MIT License. See LICENSE in the repository root for details.

// How ts starts npm (src/cli/npm.ts). These tests also run on Windows in CI, where npm is the batch file npm.cmd.

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { npmCommandLine, runNpm, spawnNpm } from '../../src/cli/npm.ts';

const win32 = process.platform === 'win32';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('the command line of npm for cmd', () => {
  it('keeps the words of ts as they are', () => {
    expect(npmCommandLine(['ci'])).toBe('npm ci');
    expect(npmCommandLine(['install', '--global', 'typescript@6.0.3'])).toBe('npm install --global typescript@6.0.3');
    expect(npmCommandLine(['install', '--save-dev', '@types/node'])).toBe('npm install --save-dev @types/node');
  });

  it('quotes an argument with spaces or characters of cmd', () => {
    expect(npmCommandLine(['install', 'a b'])).toBe('npm install "a b"');
    expect(npmCommandLine(['install', 'a&b', 'typescript@^6'])).toBe('npm install "a&b" "typescript@^6"');
  });
});

describe('npm', () => {
  // The cause of the fault on Windows: Node.js does not try npm.cmd for the name npm.
  it.runIf(win32)('is not found by spawnSync without cmd on Windows', () => {
    expect((spawnSync('npm', ['--version']).error as NodeJS.ErrnoException | undefined)?.code).toBe('ENOENT');
  });

  it('starts and prints its version', () => {
    const result = spawnNpm(['--version'], { encoding: 'utf8' });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(String(result.stdout).trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  // The form of Windows, a command line for the shell, also works with the shell of Linux and macOS.
  it('starts with one command line for the shell', () => {
    const result = spawnNpm(['--version'], { encoding: 'utf8' }, 'win32');
    expect(result.status).toBe(0);
    expect(String(result.stdout).trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('runs in the given folder', () => {
    const folder = fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'ts-npm-')));
    try {
      fs.writeFileSync(path.join(folder, 'package.json'), '{ "name": "npm-folder-test", "version": "1.2.3" }\n');
      const result = spawnNpm(['pkg', 'get', 'version'], { cwd: folder, encoding: 'utf8' });
      expect(String(result.stdout).trim()).toBe('"1.2.3"');
    } finally {
      fs.rmSync(folder, { recursive: true, force: true });
    }
  });

  it('fails and says why when npm is not on the PATH', () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-no-npm-'));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      vi.stubEnv('PATH', empty);
      // On Windows, cmd starts and says itself that it does not know npm, with an exit code that is not 0.
      if (win32) expect(runNpm(['--version'])).not.toBe(0);
      else {
        expect(runNpm(['--version'])).toBe(1);
        expect(errors).toHaveBeenCalledWith(expect.stringMatching(/^ts: npm could not start: .*ENOENT/));
      }
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });
});
