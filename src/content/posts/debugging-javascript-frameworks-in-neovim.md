---
title: "Debugging JavaScript Frameworks in Neovim"
date: "2023-06-04"
description: "A guide on how to setup debugging for JavaScript projects in neovim. Learn how to debug svelte, react or vue without having to leave your editor."
tags: ["code", "nvim", "svelte", "javascript", "guide"]
reactions: 18
githubIssue: "https://github.com/Theo-Steiner/theosteiner.de/issues/2"
---

# Configuring Neovim for Debugging JavaScript Frameworks

## I have to make a confession...

When I have no clue whether or not the spaghetti code I wrote is al dente, I don't reach for a fancy JavaScript debugger like a proper Engineer, but instead arbitrarily disperse `console.log` statements throughout my code like the script kiddy I am.<br/>Sometimes, when I don't feel like a bunch of `[object Object]`s are gonna take me where I wanna go, I use the full extend of my Engineering knowledge and skillfully `JSON.stringify` the application's current state onto the page.<br/>
I do realize however, that this technique is not likely to lead me to the 500k USD base compensation role I so badly need to offset my sushi consumption. So I decided that I had to expand my skillset and leave `console.log` behind me and learn debugger-jutsu to tackle mysterious stack overflows going forward.

Only Problem: Since I'm a show-off, I use Neovim - and how on earth do you debug JavaScript from a terminal based text editor?

## The Objective

Before we dive into the config files, let us first establish what we are trying to accomplish here: Extending Neovim, so that we can debug code from (modern) JavaScript frameworks without leaving the editor.
<img src="https://github.com/Theo-Steiner/theosteiner.de/assets/40017636/9a3e958e-3d11-4eb3-9062-1e731161e7e1" alt="debug_neovim_two" width="1425" height="810" />
Since I mostly develop in Svelte.js, the settings shown here are only tested to work with Svelte and SvelteKit projects. <br/>I don’t see a reason however, why this shouldn’t work for other JavaScript frameworks, such as React or Vue and I’ll highlight where I write svelte specific configuration, so you can adjust it to accommodate your JavaScript Flavor of choice. (Or give svelte.js a try and use the config as is ❤️)

One more caveat: In order to have my neovim boot up blazingly fast, I use folke’s lazy.nvim as a package manager.<br/> If you use Packer or some other tool, you’ll have to change the lazy specific parts of my config. If you get stuck, check out [the lazy.nvim migration guide](https://github.com/folke/lazy.nvim#-migration-guide) that shows how lazy.nvim APIs map to the APIs of other package managers.

## Getting Neovim to DAP

Since vscode is a resource hungry, slow starting, evil corporation backed electron app I’m probably going to editor hell for saying this, but Microsoft really did an amazing job with its API design.<br/>Just like how their [LSP (Language Server Protocol)](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/) became the de-facto standard for communicating a language server’s diagnostics, types and completions to the editor, their [DAP (Debug Adapter Protocol)](https://microsoft.github.io/debug-adapter-protocol/specification) also standardized an Interface for brokering debugging related information between debug adapter and debug client.<br/> These interoperable standards allow neovim to tap into the work others have done for vscode targetting language-tools and provide language integrations without having to reinvent the wheel.

However, other than with the LSP, neovim does not natively support the DAP (yet). Lucky for us, neovim core team member mfussenegger publishes a plugin that provides an implementation of the Debug Adapter Protocol: [mfussenegger/nvim-dap](https://github.com/mfussenegger/nvim-dap). <br/>Since my neckbeard is not yet developed enough for me to use this plugin as is, we do as n00bs have done for thousands of years and use a GUI to debug our stuff. <br/>While I had some issues with the UI’s layout, [rcarriga/nvim-dap-ui](https://github.com/rcarriga/nvim-dap-ui) is a fantastic tool to interact with the debug adapter, although depending on your needs, you might also want to look into [theHamsta/nvim-dap-virtual-text](https://github.com/theHamsta/nvim-dap-virtual-text) to display the debug adapter’s information right inside your code.

Now, let’s see what we need to do to make Neovim ~dab~ DAP!

## Wiring up `nvim-dap` and `nvim-dap-ui`

First, we’ll write a lazy.nvim plugin spec to install the two dependencies and configure everything we need in one place.

```lua
{
	"mfussenegger/nvim-dap",
	lazy = true,
	dependencies = {
		"rcarriga/nvim-dap-ui",
	},
	keys = {
		{ "<leader>d", function() require('dap').toggle_breakpoint() end },
		{ "<leader>c", function() require('dap').continue() end },
	},
	config = function()
		require("dapui").setup()
	end
}
```

The plugin spec’s lazy property can be set to true, because you rarely debug something immediately after starting your editor. That that way the plugins don’t add to our startup time as they are lazily loaded once we call their keybinding.<br/>For sake of simplicity, I only setup keybindings for toggling a breakpoint and “continuing”, that is launching debug sessions, here. You’ll probably also want to configure keybindings for `require('dap').step_over()` and `require('dap').step_into()`.

Finally, we’ll add a config function, that will be called whenever lazy.nvim loads this plugin spec. For now, the callback only executes nvim-dap-ui’s setup function and then calls it a day.

> Now that we have this set up, let’s give our config a whirl:
> Restart neovim, let lazy.nvim install the packages, head to your favorite JavaScript file and hit the keybinding to toggle a breakpoint. If you did everything correctly so far, a `B` should appear in your gutter, just next to the line number. Great!<br/>
> If we attempt to launch the debug session with our continue keybind though, we encounter an error: `DAP No configuration found for `language`. You need to add configs to `language`(See`:h dap-configuration`)`

The error suggests that we’re pretty close and just missing a configuration, but if you took a look at the scrollbar position to the right, you might have realized that this won’t be as easy as simply adding a config.

## Missing Pieces: Config, Adapter and Debugger

So what even are we configuring? Neovim now supports the Debug Adapter _Protocol_ but we are still missing the actual Debug Adapter that implements the interface. <br/> Looking at [nvim-dap’s Debug Adapter installation wiki](https://github.com/mfussenegger/nvim-dap/wiki/Debug-Adapter-installation#vscode-js-debug), we learn that there usually is one debug adapter per language, and they are added to `nvim-dap` like so:

```lua
-- mock code for an adapter
local dap = require('dap')
dap.adapters.language = function(cb, config)
  if config.request == 'attach' then
		cb({type = "server", port = 9222})
  else if config.request == 'launch' then
		cb({type = 'executable', command = 'path/to/executable'})
  end
end
```

The above mock code shows that a `Debug Adapter` for a given language is nothing more than a function that takes two arguments: a callback and a config. The adapter then calls the callback function, passing along some settings based on the values of the config.<br/> While I won’t go into details about how adapters work under the hood (read: I have no clue - probably magic!), let’s have a brief look at the config that’s passed to the adapter: the config object has a `request` property that can either be `attach` or `launch`.<br/> In the context of debug adapters, this means we can either debug an already running process by _attaching_ to it or _launch_ a new process altogether for our debugging purposes.

But how do we actually attach to a process, how does `nvim-dap` communicate with node or chrome? We are missing one final piece of the puzzle: **the debugger itself**.

For JavaScript, [microsoft/vscode-js-debug](https://github.com/microsoft/vscode-js-debug) is the debugger of choice, as it combines debuggers for `node.js`, Chrome and more in one, actively maintained package. There even exists [mxsdev/nvim-dap-vscode-js](https://github.com/mxsdev/nvim-dap-vscode-js#user-content-fnref-1-b82b3ad3ace373e202d855e4d0ab8b68), a neovim plugin that provides a debug adapter for this debugger, so we don’t have to get into the weeds of handcrafting one ourselves.

## Draw the Rest of the Owl

Debugging JavaScript in Neovim (6 Servings)

- GUI: `nvim-dap-ui`
- DAP: `nvim-dap`
- Adapter: `nvim-dap-vscode-js`
- Debugger: `vscode-js-debug`

So now that we have identified all the ingredients for our debugging soup, let’s work our way up this list and first get our hands on a debugger.

### Building the JavaScript Debugger from Source

We could manually download and extract the latest release of `vscode-js-debug` from [their "releases" page](https://github.com/microsoft/vscode-js-debug/releases), but we wouldn’t be engineers if we didn’t programmatically build the debugger from source. Since the repo for the debugger is hosted on github, we can leverage `lazy.nvim` to automatically do this for by just adding a nested lazy spec for a new dependency to our original lazy spec.

```lua
{
	"mfussenegger/nvim-dap",
	lazy = true,
	dependencies = {
		"rcarriga/nvim-dap-ui",
		-- lazy spec to build "microsoft/vscode-js-debug" from source
		{
			"microsoft/vscode-js-debug",
			version = "1.x",
			build = "npm i && npm run compile vsDebugServerBundle && mv dist out"
		}
	},
	keys = {...},
	config = function() ... end
}
```

Let’s go over what this lazy spec does:

By specifying `version = "1.x"` we make sure that we only rebuild the debugger on new releases for version 1. That way, we don’t do the expensive rebuilding for every commit to the main branch or risk unknowingly running into breaking changes from a new major release. I set the version to `"1.x"` to still stay up to date, but you might as well specify a full release version here if you don’t want to automatically upgrade → `"1.78.0"` is the latest stable release at the time of writing this article.

So whenever a new release is published and we open neovim, we fetch the corresponding commit of the repository. However, since the debugger is written in typescript, we can’t use it as is, but need to compile it to JavaScript first. The `build` property in lazy specs allows us to specify commands for building a package. Here we first install the package’s dependencies with `npm i` and then run it’s compile script using `npm run compile vsDebugServerBundle`. Finally, we have to rename the `dist` folder where the compile output was written to, to `out`, as that’s the path that our debug adapter plugin expects.

### Setting up our Debug Adapter: `nvim-dap-vscode-js`

Next, we’ll configure the debug adapter plugin `nvim-dap-vscode-js`.

```lua
{
	"mfussenegger/nvim-dap",
	lazy = true,
	dependencies = {
		"rcarriga/nvim-dap-ui",
		"mxsdev/nvim-dap-vscode-js",
		-- lazy spec to build "microsoft/vscode-js-debug" from source
		{
			"microsoft/vscode-js-debug",
			version = "1.x",
			build = "npm i && npm run compile vsDebugServerBundle && mv dist out"
		}
	},
	keys = {...},
	config = function()
		require("dap-vscode-js").setup({
			debugger_path = vim.fn.stdpath("data") .. "/lazy/vscode-js-debug",
			adapters = { 'pwa-node', 'pwa-chrome', 'pwa-msedge', 'node-terminal', 'pwa-extensionHost' },
		})
		require("dapui").setup()
	end
}
```

The above lazy spec adds `mxsdev/nvim-dap-vscode-js` as a dependency and calls the debug adapter’s setup function in the config callback.<br/> Here we pass it the path of the debugger we just built and specify which adapters we want it to register with `nvim-dap`.<br/> For the `debugger_path` we just append neovim’s standard data path with `/lazy/vscode-js-debug` as the rest of the path to our debugger (`/out/src/dapDebugServer.js`) is hardcoded in the plugin.<br/> I am telling `nvim-dap-vscode-js` to add all it’s available adapters to `nvim-dap` here, but you might as well just specify the adapters you need.

If we hit the keybind to continue/launch a debug session now, we will actually encounter the same error as earlier. This is because, while we have set up a debug adapter and debugger, we have yet to tell neovim which debug adapter to use for which language.

### Adding Language Specific Configs to `nvim-dap`

For this, `nvim-dap` exposes a `configuration` setting, where we can configure debugging for the languages we need.

```lua
require("dap").configurations.language_a = config_a
require("dap").configurations.language_b = config_b
```

The config we pass here is not arbitrary, but a list of `debug actions` (my name, vs\*\*de calls them `launch.json`s) that configure debug actions for a language.<br/> Since most JavaScript frameworks will share this configuration, it is easiest to just put them all into a table and declaring the config iteratively.

```lua
for _, language in ipairs({ "typescript", "javascript", "svelte" }) do
			require("dap").configurations[language] = {
				-- config goes here
				...
			}
end
```

If you want to debug something other than JS, TS or Svelte, this is where you need to declare your intention to do so! Just extend the table with `"typescriptreact"`, `"vue"` or whatever language matches your jam.

Now is the part where things get interesting, as you can customize the `debug adapter config`s to fit your needs. I will go over the three `debug actions` I personally use in this article, but feel free to post your preferred configs, suggestions or fixes into the comments so other people can benefit from your knowledge!

**1. Launch current file in new node process**

The first debug action (or `launch.json`) I’ll share here is for launching the current javascript file in node (and thus won’t work inside typescript, svelte or any other non-standard dialect).

```lua
{
	-- use nvim-dap-vscode-js's pwa-node debug adapter
	type = "pwa-node",
	-- launch a new process to attach the debugger to
	request = "launch",
	-- name of the debug action you have to select for this config
	name = "Launch current file in new node process",
	program = "${file}",
	}
}
```

**2. Attach to an inspectable node process**

This debug action attaches to a node process that has been started with the
`--inspect` or `--inspect-brk` flag. For long running tasks (like a dev server) usually just using `--inspect` will do, but for short lived tasks (like a one-off script) `--inspect-brk` is better suited, as it will delay execution until the debugger has attached instead of racing through the program before the debugger could communicate any breakpoints.

But let’s say you want to debug a long running npm script, to debug server side code in a SvelteKit app while running the dev server?<br/>
If you want to debug a npm script, you can use the `--node-options` flag to pass along flags to the node binary when starting the script:

```bash
# start SvelteKit dev server with inspectable node process
npm --node-options --inspect-brk run dev
```

the below debug action assumes some defaults to make debugging common web development projects more enjoyable, but you might need to play with it to get it working for the types of projects your working with (tested with SvelteKit, should work great with other vite based meta-frameworks)

```lua
{
	-- use nvim-dap-vscode-js's pwa-node debug adapter
	type = "pwa-node",
	-- attach to an already running node process with --inspect flag
  -- default port: 9222
	request = "attach",
	-- allows us to pick the process using a picker
	processId = require 'dap.utils'.pick_process,
	-- name of the debug action
	name = "Attach debugger to existing `node --inspect` process",
	-- for compiled languages like TypeScript or Svelte.js
	sourceMaps = true,
	-- resolve source maps in nested locations while ignoring node_modules
	resolveSourceMapLocations = { "${workspaceFolder}/**",
		"!**/node_modules/**"},
	-- path to src in vite based projects (and most other projects as well)
	cwd = "${workspaceFolder}/src",
	-- we don't want to debug code inside node_modules, so skip it!
	skipFiles = { "${workspaceFolder}/node_modules/**/*.js" },
	}
},
```

**3. Debug the web in google chrome**

This launch action launches and immediately attaches to a debuggable chrome browser.
Similar to the previous one, this launch action also assumes some defaults to be tailored to a vite based dev experience.<br/>For example, it assumes that your web app will run on port `5174` (default vite port) and skips a few vite specific files in the browser to not show you auto generated code while debugging. If you don’t use vite, you’ll be able to get it working with a bit of tweaking!

```lua
{
	-- use nvim-dap-vscode-js's pwa-chrome debug adapter
	type = "pwa-chrome",
	request = "launch",
	-- name of the debug action
	name = "Launch Chrome to debug client side code",
	-- default vite dev server url
	url = "http://localhost:5173",
	-- for TypeScript/Svelte
	sourceMaps = true,
	webRoot = "${workspaceFolder}/src",
	protocol = "inspector",
	port = 9222,
	-- skip files from vite's hmr
	skipFiles = { "**/node_modules/**/*", "**/@vite/*", "**/src/client/*", "**/src/*" },
},
```

### Last but not least: an automagic GUI!

The Debug Adapter Protocol exposes a few events we can hook into to have `nvim-dap-ui`'s GUI automagically open and close when we start or terminate our debug sessions. > I’ve found `nvim-dap-ui`'s GUI a bit finicky - with the breaking when repeatedly opening it. Passing `reset = true` when launching the GUI alleviates these problems a bit.

```lua
local dap, dapui = require("dap"), require("dapui")
dap.listeners.after.event_initialized["dapui_config"] = function()
	dapui.open({ reset = true })
end
dap.listeners.before.event_terminated["dapui_config"] = dapui.close
dap.listeners.before.event_exited["dapui_config"] = dapui.close
```

While this works reliably in about ~85% of cases, you might still want to map `require("dapui").toggle()` to some key, as there are cases where the UI sticks around after an error and closing all it’s windows manually can be a bit of a pain.

## Putting it all together!

I know, I know. This article was way too long and by now you’re probably sick of my writing style, but trust me: the payoff is worth it!

First, let’s put all the pieces together for the final lazy spec you can copy and paste into your code:

```lua
require("lazy").setup({
	...,
	{
		"mfussenegger/nvim-dap",
		dependencies = {
			"rcarriga/nvim-dap-ui",
			"mxsdev/nvim-dap-vscode-js",
			-- build debugger from source
			{
				"microsoft/vscode-js-debug",
				version = "1.x",
				build = "npm i && npm run compile vsDebugServerBundle && mv dist out"
			}
		},
		keys = {
			-- normal mode is default
			{ "<leader>d", function() require 'dap'.toggle_breakpoint() end },
			{ "<leader>c", function() require 'dap'.continue() end },
			{ "<C-'>",     function() require 'dap'.step_over() end },
			{ "<C-;>",     function() require 'dap'.step_into() end },
			{ "<C-:>",     function() require 'dap'.step_out() end },
		},
		config = function()
			require("dap-vscode-js").setup({
				debugger_path = vim.fn.stdpath("data") .. "/lazy/vscode-js-debug",
				adapters = { 'pwa-node', 'pwa-chrome', 'pwa-msedge', 'node-terminal', 'pwa-extensionHost' },
			})

		for _, language in ipairs({ "typescript", "javascript", "svelte" }) do
				require("dap").configurations[language] = {
					-- attach to a node process that has been started with
					-- `--inspect` for longrunning tasks or `--inspect-brk` for short tasks
					-- npm script -> `node --inspect-brk ./node_modules/.bin/vite dev`
					{
						-- use nvim-dap-vscode-js's pwa-node debug adapter
						type = "pwa-node",
						-- attach to an already running node process with --inspect flag
						-- default port: 9222
						request = "attach",
						-- allows us to pick the process using a picker
						processId = require 'dap.utils'.pick_process,
						-- name of the debug action you have to select for this config
						name = "Attach debugger to existing `node --inspect` process",
						-- for compiled languages like TypeScript or Svelte.js
						sourceMaps = true,
						-- resolve source maps in nested locations while ignoring node_modules
						resolveSourceMapLocations = {
							"${workspaceFolder}/**",
							"!**/node_modules/**" },
						-- path to src in vite based projects (and most other projects as well)
						cwd = "${workspaceFolder}/src",
						-- we don't want to debug code inside node_modules, so skip it!
						skipFiles = { "${workspaceFolder}/node_modules/**/*.js" },
					},
					{
						type = "pwa-chrome",
						name = "Launch Chrome to debug client",
						request = "launch",
						url = "http://localhost:5173",
						sourceMaps = true,
						protocol = "inspector",
						port = 9222,
						webRoot = "${workspaceFolder}/src",
						-- skip files from vite's hmr
						skipFiles = { "**/node_modules/**/*", "**/@vite/*", "**/src/client/*", "**/src/*" },
					},
					-- only if language is javascript, offer this debug action
					language == "javascript" and {
						-- use nvim-dap-vscode-js's pwa-node debug adapter
						type = "pwa-node",
						-- launch a new process to attach the debugger to
						request = "launch",
						-- name of the debug action you have to select for this config
						name = "Launch file in new node process",
						-- launch current file
						program = "${file}",
						cwd = "${workspaceFolder}",
					} or nil,
				}
			end

			require("dapui").setup()
			local dap, dapui = require("dap"), require("dapui")
			dap.listeners.after.event_initialized["dapui_config"] = function()
				dapui.open({ reset = true })
			end
			dap.listeners.before.event_terminated["dapui_config"] = dapui.close
			dap.listeners.before.event_exited["dapui_config"] = dapui.close
		end
	}
})
```

## Neovim Debugging in Action

### Debugging plain old JavaScript

<img src="https://github.com/Theo-Steiner/theosteiner.de/assets/40017636/9a3e958e-3d11-4eb3-9062-1e731161e7e1" alt="debug_neovim_two" width="1425" height="810" />

Now with everything setup, let’s see it in action.<br/>
Let’s do a test run with a plain JavaScript file first: <br/>
Open up a new file in neovim `nvim index.js` & write some random code:

```jsx
var str = "neovim";
str = "debugger";
console.log(`hello ${str}`);
```

Now enter `gg` to jump back to line 1 and hit that keybind to add breakpoint to the current line (`<leader>d` in the config above). If a `B` shows up at the very left, everything is setup correctly.

Now let’s start up the debugging session (`<leader>c`). You should be prompted with three options now:

```
│1: Attach debugger to existing `node --inspect` process
│2: Launch Chrome to debug client
│3: Launch file in new node process
│Type number and <Enter> or click with the mouse (q or empty cancels):
```

For now, let’s select option 3: Launch file in new node process. Just type `3` and hit enter.

This will now open a few windows, which show you the current state of the runtime. Since the GUI is just comprised of windows, we can easily switch focus between them. For example, if we type `<c-w>` followed by `h`, we end up in the left top window, titled “DAP Watches”. Here we can write javascript statements and expressions with the current debugger state. I’ve bound `require 'dap'.step_over()` to `<c-'>`, so I can use that keybinding to step through the lines of code, and use the GUI to see the current values I’m interested in.

### Debugging Client Side JavaScript

<img src="https://github.com/Theo-Steiner/theosteiner.de/assets/40017636/727ba95a-6058-4056-8ac5-5903f2972dde" alt="svelte_client" width="1425" height="810" />

To debug Client Side Javascript, the concept is the same, but the steps are a bit different. Let’s go through it and try to debug the very SvelteKit site you’re reading this article on. Here are the necessary steps:

1. We start up the dev server as we usually would.
2. We edit the code with neovim and encounter some place we’d like to debug.
3. We set a breakpoint and start a debug session.
4. This time around, we select option two `2: Launch Chrome to debug client`

When the breakpoint is triggered on the client side, execution will stop and inspect the current state and step through the execution in chrome from the comfort of your own editor!

### Debugging Server Side JavaScript

Basically almost the same thing again, but now we have to pass a flag when starting the dev server, so we can connect the debugger to it.

1. We start up the dev server as we usually would, but pass a flag to node
   `npm run dev` → `npm --node-options --inspect run dev`
2. We edit the code with neovim and encounter some place we’d like to debug.
3. We set a breakpoint and start a debug session.
4. This time we select option `1: Attach debugger to existing node --inspect process`
5. Now we are prompted with a menu to select the process, enter the number corresponding to the process you want to debug and hit enter

As before, once your code reaches a breakpoint, execution will stop and you get to debug in style!

I hope this article helped you in setting up Neovim to your liking. Happy Debugging! 🤖
