---
title: "Open Neovim From Your Browser - Integrating nvim with Svelte’s Inspector"
date: "2023-10-14"
description: "Integrating Svelte's Inspector with Neovim allows you to simply click on components in your browser to edit their source code."
tags: ["code", "vite", "svelte", "neovim", "click", "svelte inspector"]
image: "https://user-images.githubusercontent.com/40017636/275247342-f2e5f994-9aea-4b74-bc0e-fd7277736170.png"
reactions: 6
githubIssue: "https://github.com/Theo-Steiner/v1-theosteiner.de/issues/4"
---

<img src="https://github.com/Theo-Steiner/v1-theosteiner.de/assets/40017636/5fe2b7ff-e100-40dd-a3c4-cfbc98376b74" alt="svelte_inspector" width="1417" height="793" />
Let's say you're doing some web development and you notice that one button you haven't touched in years has a slight contrast issue. Searching for the relevant component could literally cost you seconds and just thinking about searching for it in your codebase gives you major anxiety?
What if I told you, you can just click the element in question, and just like that, your editor opens at the correct position, you finish your daily tasks with never before seen agility and finally get that promotion you deserve?

I know, I know… clicking things and using neovim goes together like bleach and acid cleaner. But hear me out on this one, because it is going to blow your mind - hopefully in a more pleasant way than inhaling the chlorine gas produced from incorrectly cleaning your toilet would! 🤯 

## Web Development for Monkeys

When building web apps, most developers have editor and browser open side by side, with the browser immediately reflecting the changes they make in their code, thanks to modern frontend tools like [vite](https://github.com/vitejs/vite).<br/> This works well enough while working on a single component of our app, but if you want to change an element that’s also on the same page but in an unrelated component tree, things start to break down. Sure, with a fuzzy finder you’ll probably find the correct file in a matter of seconds, but this requires some amount of context switching as you have to remember either the contents of the component or whatever obscure name you decided to give it. Now I might be outing myself as an utter idiot here, but sometimes this just can be too much for my monkey brain to handle. 🙈 <br/> Wouldn’t it be cool if you could just click on something in the browser and like magic the corresponding source file opens up in your editor instead? Monkey see 🐵, monkey click 🖱️, monkey magic 🐒🪄.

Well, if you’re a Svelte developer, you’re in luck as this feature now comes built in with svelte! (Well more precisely with `@sveltejs/vite-plugin-svelte`, but it is very likely that your vite based svelte projects already use [this plugin](https://github.com/sveltejs/vite-plugin-svelte) under the hood). There even seem to be similar plugins for [vue](https://github.com/webfansplz/vite-plugin-vue-inspector) and [react](https://github.com/zthxxx/react-dev-inspector), but I’ll focus on svelte in this article, as it is the only one with an “official” integration that needs no further setup.

## It Just Works™

The only thing you have to do is set a config option in your `svelte.config.js` and you’re ready to go.

```jsx
export default {
  vitePlugin: {
    inspector: true
  }
};
```

Now with your editor open, fire up the dev server of your project with `npm run dev` and navigate to `http://localhost:5173/`. <br/> If you press `cmd+shift` (`ctrl+shift` on linux, `cortana + w + shift + f12` on windows, or was it `ctrl+shift` too? ), you’ll notice your cursor change into the svelte logo wearing a party hat 🥳. Why a party hat? Well, it’s celebrating that you can now just click on any element on the page and your editor will open up  the correct file, row and column. 

Amazing how it just works™! That is, if you’re using vscode or any other of the supported [editor & operating system combinations](https://github.com/yyx990803/launch-editor#supported-editors). But let’s be real, you didn’t pick neovim as your editor because you expected stuff to work out of the box, but because you have no friends and thus don’t mind sacrificing weekends to tinker on your PDE (Personalized Development Environment or Private-life Dead End).

For an in-depth look into what happens behind the scenes of `@sveltejs/vite-plugin-svelte-inspector` and how this magic works so reliably, definitely give [Dominik G.’s talk from Svelte Summit Fall 2022](https://www.youtube.com/live/pJcbZr5VlV4?t=10421) a watch. (I even received a shoutout in the talk, [which I totally didn’t clip and watch every night before I fall asleep](https://www.youtube.com/clip/Ugkx7daLz3RhZCp4RbtB6-h1Lq-A33-P7FiN))

For our intents and purposes of bringing this experience to neovim, it’s enough to have a high level understanding what’s going on:

1. Once you set `inspector: true`, the svelte inspector is [injected into](https://github.com/sveltejs/vite-plugin-svelte/blob/29f5e0a411c8dc7a420073cedf607a42bc5ba290/packages/vite-plugin-svelte-inspector/src/runtime/load-inspector.js#L3) your vite based svelte(kit) app via `@sveltejs/vite-plugin-svelte`
2. Thanks to the `__svelte_meta` attribute, the inspector knows `file`, `row` & `column` of the source of a svelte component.
3. With this information, the inspector performs a get request to the `/__open-in-editor?file=${location}` endpoint exposed by vite.js
4. This endpoint leverages the package [yyx990803/launch-editor](https://github.com/yyx990803/launch-editor) to launch this file in your editor at the specified location

The flow above really showcases how well architected vite and its tooling is. The task of actually opening up files is neatly encapsulated to a single dependency: [yyx990803/launch-editor](https://github.com/yyx990803/launch-editor). Although the great architecture here shouldn’t come as a surprise, as you probably realized that the Github handle belongs to Evan You, the genius who initially built vite (& vue) in the first place.

## Swimming Upstream: Vite’s Launch-Editor

So let’s swim upstream and look at the guts of `yyx990803/launch-editor`, so we can hack the damn thing!

What actually happens when vite fetches `/__open-in-editor?file=${location}`? <br/> At the core of `vite` is its dev server, which really just is a server that uses a bunch of [middlewares](https://expressjs.com/en/guide/using-middleware.html) that do cool stuff such as transforming files as you request them or, well, launching a process that opens a file just where you want it. 
In fact, if we take a look at [line 620 of vite’s server implementation](https://github.com/vitejs/vite/blob/4f582c91d7e0e17c144fadf02a2b2ff485973ab5/packages/vite/src/node/server/index.ts#L620), we see that a suspicious `launchEditorMiddleware` is mounted to the `/__open-in-editor` path.

```jsx
middlewares.use('/__open-in-editor', launchEditorMiddleware())
```

[This middleware](https://github.com/yyx990803/launch-editor/blob/master/packages/launch-editor-middleware/index.js) essentially only checks the query param of our request to see if the necessary location data has been included. If it determine’s that the required information is there it passes it along to the function [launchEditor](https://github.com/yyx990803/launch-editor/blob/931700829d330cb95d173db1230d9ee2cb7c56ad/packages/launch-editor/index.js#L65), where `fileName` , `lineNumber`  and `columnNumber` are extracted from it. The program then attempts [to guess our editor](https://github.com/yyx990803/launch-editor/blob/master/packages/launch-editor/guess.js), by looking at the processes currently running on our computer and comparing them with a list of common editor process names.

While Evan You sadly was not coconut oil dev enough to straight up include neovim into this list, being a 10x dev he thought of adding a [fallback](https://github.com/yyx990803/launch-editor/blob/931700829d330cb95d173db1230d9ee2cb7c56ad/packages/launch-editor/guess.js#L97) way of detecting our preferred tool by using the `EDITOR` or `VISUAL` environment variables.

So if we just configure those environment variables to open neovim, we should be all set for a future of furious clicking?

## “3 Levels of Monkey” Or: How to Over-engineer Everything

So we add `export EDITOR = 'nvim'` to our `.zshenv` (or wherever you manage your [shell environment variables](https://cgjennings.ca/articles/environment-variables/)) and repeat the steps from the [It Just Works™](#it-just-works) chapter above.

So we

1. Set `inspector: true`
2. Start the dev server (`npm run dev`)
3. Press `cmd+shift` to switch to the inspector view
4. Click an element that we want to edit…

… and 💥 BOOOM 💥, just like that, the relevant file opens up in beautiful neovim on the terminal at the exact position we want!

### Monkey Level 1 **🐒**

This environment variable approach is **monkey level 1**: A cool thing that works out of the box, but comes with a set of annoying limitations… think of it like an iPhone📱: it lets you call your mom, endlessly swipe through tinder without ever getting matches and can even play your favorite nightcore tunes on Spotify. However, once you actually use it for a while, you realize its limitations: it doesn’t run Arch and won’t even allow you to set an animated waifu as the lockscreen.

So what are the limitations of simply using the `EDITOR` environment variable as a fallback? 

`launch_editor` opens your editor by spawning a child process with the file path, column and row as arguments. That means, every time you click to open, a new `nvim` process is started, which can lead of weird and ugly problems:

- For example, you’ll quickly run into problems with swapfiles as multiple instances of neovim attempt to edit the same file [^1] [^2]
- Even more annoyingly: I encountered a whole range of weird problems as plugins seem to run a lot less reliably
- But most importantly: having `nvim` start up in the same terminal process covers the command line output of vite’s dev server, so you miss out on error messages or useful debug information, while your editor is open

Now if you only plan on using this occasionally, there is absolutely nothing wrong with using it like this.

With that being said however, we wouldn’t be engineers if we did not massively over-engineer every pointless side project until it fit some obscure need, so let’s attempt to fix our nits with shitloads of duct-tape and wd-40.

### Monkey Level 2 **🐒🐒**

When I develop, I usually split my terminal into two panes, with the bottom pane running the dev server and the top pane running neovim, so I have both my editor and the server logs in sight.
Now, what if there were a way to open the component we clicked on with `svelte inspector` not inside a new `nvim` sub process, but somehow funnel that information into the already running `nvim` process on top…?

Enter: RPC Sockets 🔌.

[RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) is short for `Remote Procedure Call`, which translates for dummies means basically: “Make process in one place do something from another place.” So exactly like what we need!<br/>So how do we communicate the things we want to do in place A (our editor process) from place B (our running dev server)? 

This is where `Sockets` comes into play. [(IPC) Sockets](https://en.wikipedia.org/wiki/Unix_domain_socket) are a low level OS feature that can be used for bidirectional communication. Since in UNIX-land “everything is a file” at the core, a socket is nothing more than a special file that processes can read from or write to streams of data. <br/> So if we wanted to `remotely call a procedure` in process B from process A, we could have process B listen to a socket, to which we then write procedures from process A.

`Process A --write--> Socket <--read-- Process B`

Turns out, the makers of nvim already anticipated us nerds wanting to do “spooky action at a distance”-kinda stuff with our editors, so they built an [easy-to use RPC API](https://neovim.io/doc/user/remote.html) into the tool.

When starting neovim, you can pass the `—-listen {socketname}` flag, to specify a socket you want your neovim instance listen to. Then, from another process we can use  `nvim --server {socketname} --remote-send {command}` to remotely execute commands.

So we could for example do something like `nvim --listen /tmp/my-first-socket` to start the process, then open another terminal process and execute `nvim --server /tmp/my-first-socket --remote-send ":q<CR>"`.

🎉 congrats 🎉 you just managed to [exit vim](https://stackoverflow.com/questions/11828270/how-do-i-exit-vim) from another dimension! 

Now that we got that joke out of the way, let’s think about how we can apply this knowledge to our problem and open up the file we want from svelte inspector.

First, hop into your shell rc file so that we can create a little wrapper around neovim that allows us to start it with a socket without having to type all that much

```bash
# ~/.zshrc
# "remote vim" wrapper to start a neovim instance listening to a socket
rvim() {
	nvim --listen $REMOTE_VIM_SOCKET "$@"
}
```

So when we now open a file by using `rvim my-file.txt`, the neovim is ready to receive remote instructions via whatever socket we assign to the `$REMOTE_VIM_SOCKET` environment variable. Now all that’s left is setting up environment variables and creating a matching script that has to somehow be called when we click our browser using the svelte inspector.

If we go back to the implementation of launch_editor’s `guess.js`, we can see that there is an [early return on line 18 in case an environment variable named LAUNCH_EDITOR is set](https://github.com/yyx990803/launch-editor/blob/5ad87f680410710e261f4acdaddecaa808312029/packages/launch-editor/guess.js#L17). That’s just the escape hatch we need! (I wonder what genius proposed adding that environment variable… oh, [it was me](https://github.com/yyx990803/launch-editor/pull/39) 😮 I’m also on arch btw *tips fedora and makes sexy hissing sound*)

To make this work, let’s first built the script that is responsible for remotely opening the file. 

Create a new script somewhere in your path (like `~/.local/bin` or some custom directory you [add to your path](https://unix.stackexchange.com/questions/26047/how-to-correctly-add-a-path-to-path)). I’ll go with `~/.local/bin/launch_editor_script` here.

```bash
#!/bin/bash
filename=$1
line=${2:-"1"}
column=${3:-"1"}
command="<C-\\><C-N>:n $filename<CR>:call cursor($line,$column)<CR>"
nvim --server $REMOTE_VIM_SOCKET --remote-send $command
```

As for the file contents, we add a shebang declaring which interpreter should be use when running this script. I use `bash`, because I am moderately sane, but feel free to use whatever obscure language you like, I’m sure future-you will be delighted when finding out you decided to write this utility in haskell!

Remembering from earlier, we know that 

> `launch_editor` opens your editor by spawning a child process with the file path, column and row as arguments. 

We thus know that the positional arguments passed to our script are

1. `filename`
2. `line`
3. `column`

Accordingly, lines 2-4 of our script assign those to named variables, providing fallbacks for line and column, in case they are not set.

On line 4 we then construct the command to open the file at the correct position. We first enter `<C-\\><C-N>` to nope the f out from whatever vim mode you were in, use `:n $filename<CR>` to open the file and finally navigate to the right line and column with `:$line,$column<CR>`.

Finally on line 5, we call our remote procedure on any neovim instance opened with the earlier `rvim` command.

Only a few things left to do: 

First, modify the permissions for the script we just created to make it executable: `chmod +x ~/.local/bin/launch_editor_script` 

Last but not least, set the required environment variables for this to work. (They need to be in the environment even for non-interactive shells, like the one spawned by node’s child process, so if you don’t know what you’re doing `.zshenv` probably is your best bet)

```bash
# .zshenv
REMOTE_VIM_SOCKET=/tmp/remote-vim-socket
LAUNCH_EDITOR=launch_editor_script
```

With that done, open `rvim`, configure the svelte inspector and start your vite dev server… 
And just like magic, you should be able to click open your svelte files in the browser, with none of the limitations of our previous implementation!

but… you guessed it, we still can do better than this ``Monkey Level 2 Approach **🐒🐒**`!

There are still two major drawbacks to our approach:

1. If we have multiple instances of `rvim` running, we might run into the same weird swapfile issues from before
2. If I have to use a custom command like `rvim` to start nvim to be compatible with the svelte inspector, I will probably end up never using this feature. I don’t want to think about it, just have some utility function somewhere that I can forget about and stuff still just works.

### Monkey Level 3 **🐒🐒🐒**

This is the point where we go absolutely b🍌n🍌n🍌s, throw out every ounce of reason and over-engineer the hell out of our little script.

What if I told you, even when started without the `--listen` flag, nvim is controllable via Remote Procedure Calls…?

> Nvim creates a default RPC socket at startup ([https://neovim.io/doc/user/api.html](https://neovim.io/doc/user/api.html))

[Digging through neovim’s source code](https://github.com/neovim/neovim/blob/7c661207cc4357553ed2b057b6c8f28400024361/src/nvim/msgpack_rpc/server.c#L89), we find out that the name of this default RPC socket actually is always of the same shape and furthermore, contains a bunch of extremely valuable information.

```bash
/// - Other: "/tmp/nvim.user/xxx/<name>.<pid>.<counter>"
```

The default sockets are all inside some special temporary directory, and contain the process id of the neovim process they belong to.

But how is that information going to help us solve the problems of our Monkey Level 2 approach?

Well, if we want to get rid of the explicit usage of `rvim` to identify a special neovim instance, while at the same time making out launch_editor_script work for multiple arbitrary neovim instances opened simultaneously, we will need *some sort* of heuristic to decide which neovim instances we will send our remote procedure calls to.

Hold on for a sec, while I go full mad scientist here: <br/> If we assume that the present working directory of our dev server will always be the same as the present working directory at the time we started neovim, we can use the present working directory as the parameter to figure out which dev process should trigger which neovim process.

```sql
TABLE ViteDevProcess (
    Name: 'vite dev'
    PID int,
    CWD varchar,
);

TABLE NvimSockets (
    PID int,
    CWD varchar,
);

SELECT *
FROM NvimProcess 
LEFT JOIN ViteDevProcess 
ON NvimProcess.CWD = ViteDevProcess.CWD;
```

If we imagine our nvim and vite processes were each a table in a relational database, the above SQL is probably the most accurate description of what we’re trying to do here.

So let’s go to work and modify our code from Monkey Level 2 to do just that!

First of all, let’s get rid of the stuff we won’t need anymore. Rip out that whole `rvim` function from your .bashrc and also remove the `REMOTE_VIM_SOCKET` environment variable, since we won’t need them anymore.

For our bash script, for now we can get rid of the actual remote procedure call, but we’ll  reuse it almost unchanged at a later point

```diff
#!/bin/bash
filename=$1
line=${2:-"1"}
column=${3:-"1"}
command="<C-\\><C-N>:n $filename<CR>:call cursor($line,$column)<CR>"
- nvim --server $REMOTE_VIM_SOCKET --remote-send $command
```

We need to first construct our “table” of nvim sockets, to figure out where we might want to execute our Remote Procedure Calls. From the neovim implementation, we know that the sockets are nested somewhere inside `/tmp/nvim.user`, so we can use the `find` command to list them all up:

```bash
# nvim default sockets are always nested somewhere in here
socket_directory="${TMPDIR}nvim.${USER}"
# use find to, well, find them all! (-type s -> socket)
nvim_sockets=($(find "$socket_directory" -type s))
```

Now that we have a big fat list of sockets, all that’s left to do is iterate over them, and find out which directory they were started from!

```bash
for socket in "${nvim_sockets[@]}"
do
   # $socket is of shape: "/tmp/nvim.user/xxx/<name>.<pid>.<counter>"
done
```

Sadly, this is where it get’s a bit nasty. We only have a list of socket names; that does not tell us anything about what directory their related nvim processes were started from.

However, we can do some bash acrobatics to join our list of sockets with their `CWD` information!

First, we extract the PID from the socket name:

```bash
# replace "dots" in socket with linebreaks and return the second to last line (the pid)
pid=($(echo $socket | tr "." "\n" | tail -n 2))
```

then we use `lsof` to find the processes’ `CWD`:

```bash
# use lsof to get table for this pid, grep row with file descriptor cwd 
# then replace spaces in row with linebreaks and return the second to last line (the pid)
pid_cwd=($(lsof -p $pid | grep cwd | tr " " "\n" | tail -n 1))
```

> If this seems like sloppy coding to you, you’re totally right!<br/> But by now I’ve spent way too much time on this little script, so gtfo 🤣

Finally, we check if the pid_cwd is identical to the directory of the currently executing process (the vite process), and in case of a match, we make our Remote Procedure Call and…

## tada~ 🎉 IT JUST WORKS! ™

<img src="https://github.com/Theo-Steiner/v1-theosteiner.de/assets/40017636/426735a2-209f-4ac2-8703-7e0a73576036" alt="svelte_inspector1" width="1417" height="789" />

### The final code:

`~/.local/bin/launch_editor_script` :
```bash
#!/bin/bash
filename=$1
line=${2:-"1"}
column=${3:-"1"}
#<C-\\><C-N> -> go to normal mode, open file, navigate to correct line and column
command="<C-\\><C-N>:n $filename<CR>:call cursor($line,$column)<CR>"
# nvim default sockets are always nested somewhere in here
# see: https://github.com/neovim/neovim/blob/7c661207cc4357553ed2b057b6c8f28400024361/src/nvim/msgpack_rpc/server.c#L89
socket_directory="${TMPDIR}nvim.${USER}"
# use find to, well, find them all! (-type s -> socket)
nvim_sockets=($(find "$socket_directory" -type s))

for socket in "${nvim_sockets[@]}"
do
   #now it gets nasty... 
   #socket is of shape something.user.pid.count
   #so to get the pid we do this:
   #replace "dots" in socket with linebreaks and return the second to last line (the pid)
   pid=($(echo $socket | tr "." "\n" | tail -n 2))
   #now we want to get the cwd this process is running in
   #use lsof to get table for this pid, grep row with file descriptor cwd 
   #now replace spaces in row with linebreaks and return the second to last line (the pid)
   pid_cwd=($(lsof -p $pid | grep cwd | tr " " "\n" | tail -n 1))
   #only if process cwd is the same as the pwd, run the command
   if [ $PWD == $pid_cwd ]; then
      nvim --server $socket --remote-send "$command"
   fi
done
```
```bash
# .zshenv
LAUNCH_EDITOR=launch_editor_script
```

[^1]: The creators of launch_editor [anticipated this problem](https://github.com/yyx990803/launch-editor/blob/931700829d330cb95d173db1230d9ee2cb7c56ad/packages/launch-editor/index.js#L111), and provide a fix but sadly didn’t include `nvim` in it

[^2]: Note that [you can also configure neovim to be more forgiving when it comes to swapfiles](https://github.com/Theo-Steiner/.config/blob/0c7082eef92f2e4adacbd29afd6340839ee8ed45/nvim/lua/basics.lua#L43)
