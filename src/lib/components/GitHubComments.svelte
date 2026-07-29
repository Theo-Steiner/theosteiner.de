<script lang="ts">
	import { getComments } from '$lib/data.remote';
	import { longDate } from '$lib/format';
	import { BLUESKY_URL } from '$lib/siteConfig';

	let {
		slug,
		githubIssue,
		reactions = 0
	}: { slug: string; githubIssue: string; reactions?: number } = $props();

	const comments = $derived(await getComments(slug));
</script>

<div class="reactions">
	<a class="pill" href={githubIssue}>&hearts; {reactions} reactions</a>
	<span class="cta">
		Liked this? Share it on	<a href={BLUESKY_URL} class="link-inline">Bluesky</a> to make my day!
	</span>
</div>

{#if comments.length > 0}
	<section class="comments">
		<div class="kicker">
			<h2>Comments</h2>
			<span class="kicker-ja">コメント</span>
		</div>
		<p class="note">
			These comments are from this blog&rsquo;s GitHub CMS era. If you
			<a href={githubIssue} class="link-inline">leave a comment on GitHub</a>, I&rsquo;ll do my
			best to make it show up here!
		</p>
		<ol>
			{#each comments as comment (comment.url)}
				<li>
					<div class="head">
						{#if comment.avatar}
							<img src={comment.avatar} alt="" width="28" height="28" loading="lazy" />
						{/if}
						<a href={comment.profileUrl} class="author">{comment.author}</a>
						<a href={comment.url} class="date">{longDate(comment.date)}</a>
						{#if comment.reactions > 0}
							<span class="hearts">♥ {comment.reactions}</span>
						{/if}
					</div>
					<div class="body">
						<!-- sanitized once and frozen when the GitHub archive is imported -->
						{@html comment.bodyHtml}
					</div>
				</li>
			{/each}
		</ol>
	</section>
{/if}

<style>
	.reactions {
		margin-top: 56px;
		padding-top: 24px;
		border-top: 1px solid var(--hair);
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: #21201c;
		background: var(--yellow);
		border: none;
		border-radius: var(--radius-round);
		padding: 9px 18px;
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.25s var(--ease-pop);
	}
	.pill:hover {
		transform: scale(1.05) rotate(-1deg);
	}
	.pill:active {
		transform: scale(0.96);
	}
	.cta {
		font-size: 14px;
		color: var(--soft);
	}
	.comments {
		margin-top: 64px;
	}
	.note {
		margin: 12px 0 0;
		font-size: 14px;
		line-height: 1.6;
		color: var(--soft);
	}
	ol {
		list-style: none;
		margin: 24px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	li {
		padding: 20px 0;
		border-top: 1px solid var(--hair);
	}
	.head {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.head img {
		border-radius: var(--radius-round);
	}
	.author {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
	}
	.author:hover {
		color: var(--red);
	}
	.date {
		font-family: var(--font-mono);
		font-size: 11.5px;
		color: var(--faint);
		text-decoration: none;
	}
	.date:hover {
		color: var(--ink);
	}
	.hearts {
		font-family: var(--font-mono);
		font-size: 11.5px;
		color: var(--red);
		margin-left: auto;
	}
	.body {
		margin-top: 10px;
		font-size: 15px;
		line-height: 1.7;
		color: var(--muted);
	}
	.body :global(p) {
		margin: 0 0 10px;
	}
	.body :global(p:last-child) {
		margin-bottom: 0;
	}
	.body :global(a) {
		color: var(--ink);
		text-decoration: none;
		background-image: linear-gradient(var(--ghost), var(--ghost));
		background-repeat: no-repeat;
		background-position: 0 100%;
		background-size: 100% 1px;
	}
	.body :global(a:hover) {
		background-image: linear-gradient(var(--ink), var(--ink));
	}
	.body :global(code) {
		font-family: var(--font-mono);
		font-size: 13px;
		background: var(--codebg);
		padding: 1px 6px;
		border-radius: var(--radius-1);
		color: var(--ink);
	}
	.body :global(pre) {
		background: var(--pre-bg);
		color: #e8e6e1;
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 1.7;
		padding: 14px 16px;
		border-radius: var(--radius-2);
		overflow-x: auto;
	}
	.body :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}
	.body :global(img) {
		max-width: 100%;
	}
	.body :global(blockquote) {
		margin: 10px 0;
		padding: 2px 0 2px 14px;
		border-left: 3px solid var(--yellow);
	}
</style>
