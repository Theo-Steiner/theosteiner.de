<script lang="ts">
	import { ogImage } from '$lib/siteConfig';
	import portrait from '$lib/assets/theo_steiner.webp';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="About"
	description="Theo Steiner is a frontend engineer in Tokyo, Svelte Ambassador, and organizer of the Svelte community in Japan."
	path="/about"
	image={ogImage('page', 'about')}
/>

<header>
	<div class="heading">
		<h1>About me.</h1>
		<span class="ja">自己紹介</span>
	</div>
</header>

<section class="bio">
	<div class="portrait">
		<img src={portrait} alt="Theo Steiner" width="172" height="172" />
		<span class="caption">me, allegedly</span>
	</div>
	<p>
		I&rsquo;m Theo Steiner, a software engineer at <span class="mono-inline">LINE</span> in Tokyo,
		building b2b2c things for one of the world&rsquo;s biggest messaging platforms. Massive scale,
		interesting problems, and a strict personal methodology of
		<em class="serif">tummy-driven development</em>: write code, eat sushi, sleep, repeat.
	</p>
	<p>
		My native language is German; I also speak Japanese and English fluently, plus enough Spanish
		and French to confidently mispronounce <em class="serif">croissant</em> in two extra languages.
	</p>
	<p>
		I hold a Master&rsquo;s from
		<span class="mark">上智大学 (Sophia University, Tokyo)</span>, where I built a web platform for
		spatial literary analysis with GIS. My Bachelor&rsquo;s was Japanese Studies with a side of
		databases and NLP &mdash; which explains a lot about this website.
	</p>
	<p>
		Since sitting at a computer all week isn&rsquo;t bad enough for my posture, I also program for
		fun on weekends. Most of that time disappears into my neovim config or the Svelte Discord, but
		occasionally something productive escapes: tiny contributions to
		<a href="https://nodejs.org" class="link-inline">Node.js</a> and
		<a href="https://svelte.dev" class="link-inline">Svelte</a>.
	</p>
	<p>
		The community side of open source is the part I love most. I&rsquo;m honored to be one of the
		inaugural <span class="mark">Svelte Ambassadors</span>, and I sometimes organize meetups to grow
		the small but mighty
		<a href="https://svelte.jp/" class="link-inline">Svelte community in Japan</a>. Come say hi some
		day.
	</p>
</section>

<style>
	header {
		margin-top: 72px;
	}
	.heading {
		display: flex;
		align-items: baseline;
		gap: 14px;
	}
	h1 {
		margin: 0;
		font-size: 26px;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}
	.ja {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--faint);
	}
	.bio {
		margin-top: 32px;
	}
	.portrait {
		float: right;
		margin: 6px 0 16px 24px;
		position: relative;
	}
	.portrait img {
		width: 172px;
		height: 172px;
		object-fit: cover;
		border-radius: var(--radius-2);
		display: block;
		transition: transform 0.3s var(--ease-pop);
	}
	.portrait:hover img {
		transform: rotate(2deg) scale(1.03);
	}
	.caption {
		position: absolute;
		left: 8px;
		bottom: -9px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		color: #21201c;
		background: var(--yellow);
		padding: 2px 8px;
		border-radius: var(--radius-1);
	}
	.bio p {
		margin: 0;
		font-size: 17px;
		line-height: 1.75;
		color: var(--muted);
		text-wrap: pretty;
	}
	.bio p + p {
		margin-top: 16px;
	}
	.mono-inline {
		font-family: var(--font-mono);
		font-size: 15px;
	}
	@media (max-width: 480px) {
		.portrait {
			float: none;
			margin: 0 0 20px;
		}
	}
</style>
