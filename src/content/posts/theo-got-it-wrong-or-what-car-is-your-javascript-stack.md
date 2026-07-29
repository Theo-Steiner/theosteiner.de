---
title: "Theo Got It Wrong or: What Car is Your JavaScript Stack?"
date: "2023-07-08"
description: "A rebuttal of Theo's take on RSC being a less risky bet than SvelteKit."
tags: ["code", "react", "svelte", "javascript", "RSC"]
reactions: 16
githubIssue: "https://github.com/Theo-Steiner/v1-theosteiner.de/issues/3"
standardSiteUri: "at://did:plc:nsmlf6uhdg2onrsrdr7oiyv4/site.standard.document/3mrqylqshdm23"
---

## Don’t pick the wrong tool

Theo recently published a video titled `Don’t pick the wrong tool` and as expected there are some spicy takes in it 🌶️. While I agree with much of what is said throughout the video, I think Theo got one fundamental thing wrong. And I even have a stupid car analogy to back it up 🚗.

If you haven’t seen it, go watch now: [https://www.youtube.com/watch?v=uEx9sZvTwuI](https://www.youtube.com/watch?v=uEx9sZvTwuI)

> To those who think I have gone full mad and talk about myself in the third person: While I might be slightly mad, it turns out there’s actually more than one `Theo` out there… Who would have thought 🤯 <br/>
But it’s actually not confusing at all, because [my name](https://upload.wikimedia.org/wikipedia/commons/9/91/De-Theo.ogg) is pronounced `ˈteːo` while [@t3dotgg’s name](https://en.wiktionary.org/wiki/Theo) is `ˈθioʊ`. See, not confusing at all!
> 

## The Bleeding Edge is a Gradient

To summarize the point of the video, Theo encourages the viewer to “bleed responsibly” arguing that the concept of `bleeding edge technology` is more nuanced than a simple `Technology A is new, therefore it is risky to use`. I am obviously simplifying here, but basically, Theo is suggesting that the risk associated with a new technology depends greatly on who is backing said technology. <br/>
Applied to the world of JavaScript frameworks this means that since the usage of React is orders of magnitude above the usage of Svelte, betting on the bleeding edge of the React ecosystem is associated with far less risk than betting on the bleeding edge of the Svelte ecosystem.

So far, I wholeheartedly agree: innovation doesn’t occur in a vacuum and the reputation and reach of the entity behind a new technology obviously influences its adoption in the long run. So if you want to benefit from the advancements of the bleeding edge, while at the same time keeping risks minimal, Reactland is where you wanna be!

The argument begins to break down however, once we move from the general to the specific case. While the bleeding edge for **technology A** in the React ecosystem is associated with less risk than the equivalent in the Svelte ecosystem, that does *not* automatically imply that **technology B** in React is also less risky than **technology A** in Svelte. <br/>

Yup, this mysterious **technology B** I’m talking about is `React Server Components`.
In his video, Theo equates Next 13’s app directory with SvelteKit, and argues that betting on the former is less risky since it is part of the React ecosystem. I believe by doing so, he massively understates the paradigm shift that RSCs actually are, rendering his conclusion invalid. So here comes my time to shine by busting out a car analogy to explain this in the most conflated way possible!

## What Car is Your JavaScript Stack?

So if `React` ecosystem were a car manufacturer, they'd probably be Toyota. Known for high quality and reliability, they sell the most cars while also sporting an amazing R&D department, where they constantly work on bleeding edge technology.

Literally any car technician on planet earth can service a Toyota, as the underlying technology of Internal Combustion Engines is well documented and the de-facto standard. You give it fuel (`jsx`) that the internal combustion engine (`the react library`) burns at runtime to propel the car (`render the app`). <br/>
Now, while you could just buy those car parts and build your custom ride from scratch, most people buy one of the prefabricated models on sale.

There’s quite a wide range of options to pick from, but the most popular one is the Corolla: `Next.js`. You literally can't go wrong when getting the newest model of this easy-to-use reliable ICE car for everyone that is stuffed to the brim with both proven technology and useful innovations.

Now `Svelte` would be more of a “new-kid-on-the-block” Tesla. Unsatisfied with the tradeoffs of internal combustion engines, they decided to build battery electric vehicles instead. This comes with its own set of trade-offs, such as the need to charge (`compile`) ahead of time, as they can’t run on fuel (`templates`) directly. This however, allowed them to improve performance and reduce the complexity of the system.

Other than the engine and a few minor details, the cars Tesla sells are almost identical to the ones that Toyota sells though. Their Model 3 (`SvelteKit`) is in the same price range as the Corolla (`Next.js`) and has comparable features.

Now, whether or not you should buy a Model 3 over a Toyota Corolla is mostly down to personal preference and willingness to take risk. With the Corolla, you can get it fixed everywhere on earth and don’t have to worry about the infrastructure (`ecosystem`) not being developed yet, since ICE cars have been around for ages and will be around for a long time, however you will miss out on the improved performance of the electric powertrain.

Obviously, Toyota is not sleeping on the innovation though, and they are also planning to release battery electric vehicles (`React forget`).

But perhaps most excitingly they have a clear cut vision for the future: a deeply integrated hydrogen economy where surplus energy is used to produce liquid hydrogen that can be used in a new type of car. This hydrogen fueled car can be refueled quickly while retaining most benefits of the electric powertrain. They believe so much in this, that they literally named this car *Mirai*, which means future in Japanese. 
Perhaps also "future", because for now there exist about 1000 hydrogen fuel stations. Globally.
Now could Toyota make the Hydrogen Economy happen? Probably! But a vision like that is difficult to materialize even for the biggest player.

To me `Next 13’s app directory` is the Toyota Mirai and `RSCs` are the React team’s hydrogen economy. <br/>
Don’t get me wrong, it’s all very exciting, but would you buy a Toyota Mirai over a Tesla Model 3 today? 🌶️
