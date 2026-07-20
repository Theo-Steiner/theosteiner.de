---
title: "Using Volar's Takeover mode in Neovim's Native LSP Client"
date: "2023-05-14"
description: "A guide on how to setup neovim to enable Volar's takeover mode to allow vscode like type checking of vue projects in nvim"
tags: ["code", "nvim", "vue", "volar"]
reactions: 10
githubIssue: "https://github.com/Theo-Steiner/theosteiner.de/issues/1"
---

## Vue Type Errors only inside Neovim

So you finally did it! 🎉  <br/>Wiped that memory hugger named vs**de from your system, installed neovim nightly and worked through ThePrimeagen's guide of how to set up neovim as your own, private IDE with git integration, fuzzy find and lsp integration.<br/>Filled with glee, you go back to your day job of changing button colors on the interwebs - ready to prove to the world that you are now a 10x developer well deserving of that pay raise you have been denied for so long.

But wait, what is that? 😨 <br/>Upon opening your trusty `vue.js` project in neovim, the newly setup native lsp client suddenly begins flooding your screen with type errors, when you could have sworn everything compiled fine just a day ago.<br/>And your memory is correct: when running `npx vue-tsc` on the file drowned in errors, everything compiles without any problems.<br/>What's going on here? What is the `tsserver` you painstakingly set up with `mason.nvim` suddenly so upset about?

Turns out, type checking inside vue projects in vs**de is not actually done by tsserver in most cases anymore.<br/>Vue's language server `Volar` has a `Takeover mode` that allows it to entirely take over and conduct all type checking in tsserver's place. This means Volar is responsible for typechecking even the `.ts` files of your vue project.

Here's what [the official Vue docs](https://vuejs.org/guide/typescript/overview.html#volar-takeover-mode) have to say about this:
> To get Vue SFCs and TypeScript working together, Volar creates a separate TS language service instance patched with Vue-specific support, and uses it in Vue SFCs. At the same time, plain TS files are still handled by VSCode's built-in TS language service, which is why we need [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to support Vue SFC imports in TS files.

## Letting Volar take over inside Neovim

So how do we get the takeover mode to work inside neovim's native LSP client? 

### 1. Manual Configuration
So an obvious but also very tedious way to solving this issue would be to quickly edit your neovim config before working on your vue projects. <br/>In your lsp settings, you simply don't let `tsserver` attach and modify the filetypes for Volar to include ".ts" files.

```lua
local default_servers = {
    -- don't setup tsserver, as we want volar to take over
    -- 'tsserver',
     'volar',
}

require('mason-lspconfig').setup_handlers({
	function(server_name)
                 local server_config = nil
		if server_name == 'volar' then 
			{filetypes = { 'vue', 'typescript', 'javascript' }}
		end
		lspconfig[server_name].setup(
			server_config
		)
	end,
})
```

You can however see, how this could quickly become tedious. Especially if you work in `vue` projects only sometimes and thus might simply forget about setting this when switching between programs. <br/> So perhaps we can find a way to setting this up, that's comparable to how you would configure the VSCode extension. Meaning that everything is automatic after the initial setup and we don't have to edit our vimconfig every time we want to work on a vue project.

### 2. Automatic Configuration - Set and Forget

At work, I mostly write vue, but in my free time, I prefer to work in svelte. So configuring this every day would be a major PITA. We're engineers, we should not do manual labor like that!<br/>
Thankfully neovim has a great plugin ecosystem and lua API that allows us to automate away repetitive tasks like this. <br/> 
Let's dive into how I use lua to automate this configuration (mostly) away.

### Preparation:

First, you need to install [folke/neoconf.nvim](https://github.com/folke/neoconf.nvim) and call it's setup function before you setup mason or your lsp-config. Neoconf is a neovim plugin that allows us to configure project-specific (and global) settings.

```lua
require("neodev").setup({})
require("mason").setup()
require('mason-lspconfig').setup({
  ensure_installed = {"volar"}
})
local lspconfig = require('lspconfig')

require('mason-lspconfig').setup_handlers({
  function(server_name)
    local server_config = {}
    lspconfig[server_name].setup(server_config)
  end,
})
```

With this setup, you want to think about a syntax to use to disable the TypeScript server, so that Volar can take over its duties. I went with a simple "disable" that is false-y by default and has to be set to true manually.

```json
{
"tsserver": { "disable": true }
}
```

You now create a `.neoconfig.json` file with the above contents at the root of your Vue project. (You can also run the command `:Neoconf` to do this from within nvim)

### Now comes the cool part:

Because the author of Neoconf, folke, is an absolute genius, this plugin has a very elegant api that allows us to get the contents of the `.neoconfig.json` file easily. So we can just call the following API to see whether or not we want the typescript language server to boot. `require("neoconf").get("tsserver.disable")` 

Let's integrate this into our config:

```lua
require('mason-lspconfig').setup_handlers({
  function(server_name)
    local server_config = {}
    if require("neoconf").get(server_name .. ".disable") then
      return
    end
    lspconfig[server_name].setup(server_config)
  end
})
```

Now there is only one thing left to do: typescript is not in the default supported filetypes for volar, so we need to add it like so:
```lua
if server_name == "volar" then
  server_config.filetypes = { 'vue', 'typescript', 'javascript' }
end
```
Now whenever we open a typescript file in the workspace with .neoconf.json at its root, tsserver won't boot and instead volar attaches to the buffer!

### Final Code:

```lua
require("neodev").setup({})
require("mason").setup()
require('mason-lspconfig').setup({
  ensure_installed = {"volar", "tsserver"}
})
local lspconfig = require('lspconfig')

require('mason-lspconfig').setup_handlers({
  function(server_name)
    local server_config = {}
    if require("neoconf").get(server_name .. ".disable") then
      return
    end
    if server_name == "volar" then
        server_config.filetypes = { 'vue', 'typescript', 'javascript' }
    end
    lspconfig[server_name].setup(server_config)
  end,
})
```

It personally took me quite a while to find out the cause of why I suddenly got unexpected TypeScript errors, so I hope this article is helpful to some fellow nvim-aficionado web developers!

Feel free to check my [dotfiles](https://github.com/Theo-Steiner/.config/blob/main/nvim/lua/ide/lsp/init.lua) if you're interested in how I integrated this with the rest of my lsp configuration or my other configuration.
