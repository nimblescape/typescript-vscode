# nimblescape TypeScript

Runs TypeScript files with Node.js in VS Code: with the command `ts` in the
terminal and with F5. `ts` checks a file with `tsc`, the TypeScript
compiler, compiles it and runs it with Node.js, in one step. A folder needs
no `tsconfig.json` and no `package.json`, and the editor shows the same
errors as `ts`. The completions offer only the imports that a program needs.

![VS Code with a terminal, in six scenes: npm installs @nimblescape/typescript globally; ts runs main.ts, and ts main.ts 3 gives the program the argument 3; ts broken.ts stops at a type error, and ts check checks main.ts; ts init writes the tsconfig.json of a project of ts, with the entry of the plugin, and installs the types of Node.js after a question; ts install outside a project lists the versions of TypeScript with the TypeScript of the newest VS Code selected, the arrow keys move the selection, and Enter installs the selected version; ts install in the project runs npm ci; ts --version prints the versions; ts completion bash turns on the Tab completion, Tab Tab lists the commands and the files, and ts --help prints the help; a blue band above the window names each scene, and a label at the bottom names a pressed key and what it does](https://raw.githubusercontent.com/nimblescape/typescript-vscode/main/docs/images/ts.gif)

The command `ts` is also the npm package
[`@nimblescape/typescript`](https://www.npmjs.com/package/@nimblescape/typescript),
for terminals outside VS Code:
`npm install --global @nimblescape/typescript`.

## What the extension does on your computer

- **When it works.** The extension starts after the start of VS Code in
  every window, and for a debug session of the type `ts`. The editor part is
  a plugin of the TypeScript server, which the TypeScript extension of
  VS Code loads for the TypeScript and JavaScript files of every workspace.
  The extension does not run in VS Code for the Web.
- **Terminals.** The extension sets environment variables in the terminals
  of VS Code: `PATH` ends with a folder that holds `ts`, so a global `ts`
  comes first; `NIMBLESCAPE_TS_TYPESCRIPT` names the TypeScript of VS Code
  and `NIMBLESCAPE_TS_TYPES` the types that the editor uses; `XDG_DATA_DIRS`
  (bash) and `FPATH` (zsh) get a folder with the Tab completion of `ts`.
  When `FPATH` is not set, the extension runs `zsh -f` once at its start to
  read the folders of zsh, without waiting for it. The terminals that are open at the start get the
  change after a restart.
- **Programs.** `ts` and F5 run your program with Node.js and the rights of
  your user, as `node` does. `ts` writes the compiled files into
  `node_modules/.cache/ts/` of the project, or into the temporary folder of
  the system, and deletes them after the run. When the packages of a
  project are missing, `ts` asks before it runs `npm ci` or `npm install`;
  `ts install` runs it without a question, because you asked for it.
- **Editor.** The plugin gives a TypeScript file without `tsconfig.json`
  the settings of `ts`, and adds the TypeScript files of its assignment
  folder (up to 300) to the project of the file. JavaScript files without
  `tsconfig.json` keep the settings and the completions of VS Code. In a
  TypeScript file, it removes entries from the list of completions and from
  the quick fixes "Add import". A project with a `tsconfig.json` that does
  not name the plugin, for example a Vite project, gets nothing from the
  plugin. It changes no other answer of the TypeScript server. When the
  plugin fails, the answers stay as TypeScript gives them.
- **No pop-ups.** The extension shows no notification: it never asks and
  never offers anything in a pop-up.
- **Files and data.** The extension writes the small script `ts` and the
  Tab completion scripts into its own storage folder of VS Code. It changes
  no file of the workspace and no setting. `ts init` writes a
  `tsconfig.json` when you run it, and a `package.json` with
  `"type": "module"` when there is none and the types of Node.js are
  missing (with TypeScript 7 always when there is none).
- **Network.** The extension and the plugin make no network connection and
  collect no telemetry. `ts` connects only to install TypeScript, when it
  finds none, when you upgrade a global TypeScript older than TypeScript 6,
  or after `ts install --global` (and `ts install` outside a project): it
  reads the newest version of VS Code from `update.code.visualstudio.com`,
  the TypeScript of that version from GitHub, and the versions of
  TypeScript from the npm registry. npm downloads packages after your answer in the terminal.
- **Restricted Mode and virtual workspaces.** In Restricted Mode, VS Code
  starts no debug session. `ts` works in the
  terminals. The plugin works where the TypeScript extension of VS Code runs
  in Restricted Mode: VS Code 1.125 runs it there with its own TypeScript,
  VS Code 1.143 does not run it there. The extension does not run in virtual
  workspaces.

[Security](https://github.com/nimblescape/typescript-vscode/blob/main/docs/security.md#what-the-extension-does-on-your-computer)
describes each step and where its protection ends.

## Features

- **The command `ts`.** `ts main.ts` checks, compiles and runs a file in
  every terminal of VS Code; `ts` alone runs `main.ts`. `ts main.js` runs
  a JavaScript file in the same way. A program can use
  `prompt()`, `alert()` and `confirm()` without an import. The
  [npm page](https://www.npmjs.com/package/@nimblescape/typescript)
  describes every option.
- **F5.** The debug type `ts` runs a file with `ts` in the JavaScript
  debugger of VS Code: breakpoints in the `.ts` files, a stop at the first
  statement (`stopOnEntry`), and `prompt()` in the integrated terminal.
  Without a `launch.json`, F5 runs the file of the active editor.
- **The same errors in the editor and in the terminal.** A TypeScript file
  without `tsconfig.json` gets the settings of `ts` in the editor: the types
  of Node.js instead of the browser, the module system of Node.js, imports
  with the extension `.ts`, and the types of `prompt()`, `alert()` and
  `confirm()`. JavaScript files without `tsconfig.json` keep the settings
  of VS Code with the types of the browser, because JavaScript without a
  bundler usually runs in a web page. A project of `ts init` keeps the
  settings of its `tsconfig.json` and also gets the types of the three
  functions, unless it has the types of the browser (`"lib"` with
  `"dom"`). The entry of the plugin in its `compilerOptions.plugins` marks
  it as a project of `ts`. Any other `tsconfig.json`, for example the one
  of a Vite project, is a standard project: `ts` and the editor check it
  as `tsc` does. The editor, `ts` and F5 use the same TypeScript, the one
  of VS Code, unless the project lists its own.
- **The imports of the assignment.** In a course with many assignments, an
  auto-import offers only the files of the assignment of the file, not the
  `Car` of five other assignments. The files of the assignment are offered
  also when they are not open.
- **Fewer wrong imports.** The completions of a name offer no import when
  the name is global already, and no import of a module whose only export
  is a global object, such as `node:console` (`console`) and `node:process`
  (`process`). The plugin reads the program, as TypeScript sees it, and uses
  no list of names.

| You type | TypeScript offers | With the extension |
| --- | --- | --- |
| `log`, `warn` | `node:console`, `console` | nothing to import: `console.log` and `console.warn` are global |
| `exit`, `argv`, `env` | `node:process`, `process` | nothing to import: `process.exit`, `process.argv` and `process.env` are global |
| `parseInt` | the global `parseInt`, `es-toolkit/compat` | the global `parseInt` |
| `on`, `once` | `node:events`, `node:cluster`, `node:stream`, `node:process` and more | the same modules without `node:process` |
| `Dog` | `./dog.ts` | `./dog.ts` |
| `Car` | `./car.ts` of this assignment and of every other assignment | `./car.ts` of this assignment |
| `round` | `es-toolkit`, `es-toolkit/compat` | `es-toolkit`, `es-toolkit/compat` |
| `existsSync`, `readFileSync` | `node:fs`, `fs` | `node:fs`, `fs` |

The table shows a project with `@types/node` and
[es-toolkit](https://es-toolkit.dev), and files `dog.ts` and `car.ts` that
export the classes `Dog` and `Car`.

## Usage

1. Install the extension, and Node.js 22 or newer.
2. Open a folder with a TypeScript file `main.ts`.
3. In a terminal of VS Code, run `ts main.ts`, or press F5.

`ts dice.ts 3 6` runs `dice.ts` with the arguments `3` and `6`, and
`ts check main.ts` only checks the file.

A `launch.json` with the debug type `ts` runs a file with F5:

```json
{
  "version": "0.2.0",
  "configurations": [
    { "name": "Run", "type": "ts", "request": "launch", "program": "${file}" }
  ]
}
```

| Attribute | Default | Effect |
| --- | --- | --- |
| `program` | `${file}` | The TypeScript file to run. |
| `args` | `[]` | The arguments of the program. |
| `cwd` | The folder of the program | The working folder of the program. |
| `env` | | More environment variables of the program. |
| `console` | `integratedTerminal` | Where the program runs: the integrated terminal, where `prompt()` reads the keyboard, or `internalConsole` (the Debug Console) for a program without input. |
| `stopOnEntry` | `false` | Stops at the first statement of the program, as `node --inspect-brk` does; in an ES module after its imports. |

Other attributes of the debug type `node`, for example `skipFiles`, reach
the debugger too. The editor of `launch.json` marks them as not allowed,
because the debug type `ts` does not list them.

## Assignment folders

An auto-import offers the files of the student only from the assignment
root of the file. The root is the first folder above the file, below the
folder that VS Code has open:

1. A folder with a name of the setting
   `nimblescape.typescript.assignmentFolders` (default `workspace`), or with
   a `package.json` or a `tsconfig.json`.
2. Only when there is none: a folder with a file of the setting
   `nimblescape.typescript.entryFiles` (default `main.ts`).

Without a root, the extension hides no file. The packages and the modules
of Node.js always stay.

## Settings

| Setting | Default | Effect |
| --- | --- | --- |
| `nimblescape.typescript.assignmentFolders` | `["workspace"]` | The names of the folders that hold an assignment. |
| `nimblescape.typescript.entryFiles` | `["main.ts"]` | The names of the files that start a program; the first folder above a file with one of them is its assignment root when no assignment folder is found. |

An entry of the plugin in a `tsconfig.json` wins over both settings. The
entry also makes the folder a project of `ts`, as `ts init` writes it:

```json
{
  "compilerOptions": {
    "plugins": [
      { "name": "nimblescape-typescript-plugin", "assignmentFolders": ["src"], "entryFiles": ["index.ts"] }
    ]
  }
}
```

## Requirements

- VS Code 1.125 or later, with its TypeScript extension "TypeScript and
  JavaScript Language Features", which VS Code enables by default.
- Node.js 22 or newer on the `PATH`, for `ts` and F5, and npm for the
  install of packages (see [Node.js on the PATH](#nodejs-on-the-path)).
- Linux, macOS or Windows (also with WSL). On Windows, the tests cover F5
  (the debug type `ts`); the editor plugin and `ts` in a terminal are tested
  on Linux and macOS.

The tests run with TypeScript 6.0.3, the TypeScript of VS Code 1.125 and
later. TypeScript 7 has no `tsserver.js` and loads no plugins: for a
project that installs TypeScript 7, VS Code uses its own TypeScript, which
loads the plugin, and `ts` uses TypeScript 7.

### Node.js on the PATH

`ts` and F5 start `node` from the `PATH`. When `ts` does not find it, it
prints "ts: Node.js was not found on the PATH" with a link to this section,
and the program does not start. `node --version` in a new terminal of
VS Code shows the Node.js that `ts` and F5 find.

**Install Node.js** 22 or newer, then close all windows of VS Code and start
it again. VS Code gets its `PATH` when it starts.

- macOS: the installer from [nodejs.org](https://nodejs.org/en/download),
  or `brew install node` with [Homebrew](https://brew.sh).
- Linux: the package of your distribution, when it has version 22 or newer,
  or the files from [nodejs.org](https://nodejs.org/en/download).
- Windows: the installer from [nodejs.org](https://nodejs.org/en/download).

**With a version manager** such as fnm or nvm, `node` is only on the `PATH`
of a shell that ran the setup of the version manager.

- macOS and Linux: when VS Code starts from the Dock or the menu of the
  desktop, it runs your login shell once and takes its variables. So put the
  setup into the file that your shell reads: for fnm, the line
  `eval "$(fnm env --use-on-cd)"` in `~/.zshrc` (zsh, the shell of macOS)
  or `~/.bashrc` (bash), and choose a default version with
  `fnm default 24`. For bash, `~/.bash_profile` or `~/.profile` must read
  `~/.bashrc`, as it does by default on most Linux distributions, because
  a login shell reads only these files. The installer of nvm adds its setup
  to these files; `nvm alias default 24` chooses the default version. Then
  start VS Code again.
- Windows: VS Code does not run the profile of PowerShell when it starts.
  For fnm, put its default Node.js on the `PATH` of your user, in
  PowerShell (use a version that `fnm list` shows):

  ```powershell
  fnm default 24
  $fnm = (fnm env --json | ConvertFrom-Json).FNM_DIR
  [Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";$fnm\aliases\default", "User")
  ```

  nvm for Windows puts a link to the selected version on the `PATH` when you
  install it; `nvm use 24` selects the version. Then start VS Code again.

## Limits

- The plugin hides an export whose name is a global name of the file, also
  when the export does something else: `escape` of `es-toolkit` escapes
  HTML, the global `escape` encodes a URL. To use such an export, write its
  import yourself.
- The quick fixes follow only the rule of the assignment root. When a file
  uses a name that it does not declare, such as `log('Hello')`, the quick
  fix of the error still offers "Add import from 'node:console'".
- A new file of an assignment appears in the auto-imports of a file without
  `tsconfig.json` after the next change of an open file.
- `prompt()`, `alert()` and `confirm()` are known only to `ts` and to the
  editor with the plugin, as the globals of Deno are known only to Deno:
  plain `tsc` reports them as unknown names (see the
  [npm page](https://www.npmjs.com/package/@nimblescape/typescript#the-functions-prompt-alert-and-confirm)).
  In the same way, only `ts` and the plugin make every file an ES module in
  a project of `ts init` without `package.json`.
- A change of the entry of the plugin in a `tsconfig.json` applies when
  the TypeScript server starts again (command "TypeScript: Restart TS
  Server", or a new window).
- VS Code puts all open files without `tsconfig.json` of one folder of the
  workspace into one project. While a TypeScript file of it is open, its
  open JavaScript files get the settings and the filter of the auto-imports
  of `ts` too, without the types of the browser; after the TypeScript file
  closes, they get the settings and the completions of VS Code again.
- A TypeScript that loads no plugins, such as TypeScript 7, shows the
  settings of VS Code for a file without `tsconfig.json`, not those of `ts`.

---

[Change log](https://github.com/nimblescape/typescript-vscode/blob/main/CHANGELOG.md) · [Contributing](https://github.com/nimblescape/typescript-vscode/blob/main/CONTRIBUTING.md) · [Support](https://github.com/nimblescape/typescript-vscode/blob/main/SUPPORT.md) · [Issues](https://github.com/nimblescape/typescript-vscode/issues) · [Source](https://github.com/nimblescape/typescript-vscode)

© 2026 Hannes Stauss (scalarion@nimblescape.com) · [MIT License](https://github.com/nimblescape/typescript-vscode/blob/main/LICENSE).
