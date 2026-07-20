import { marked } from 'marked';
import { talks } from '../../content/talks';
import { podcasts } from '../../content/podcasts';
import { statuses } from '../../content/statuses';
import type { ArchivedComment, FeedItem, PostMeta } from '$lib/types';

const metadataModules = import.meta.glob<PostMeta>('/src/content/posts/*.md', {
	eager: true,
	import: 'metadata'
});

const rawModules = import.meta.glob<string>('/src/content/posts/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const commentModules = import.meta.glob<ArchivedComment[]>('/src/content/comments/*.json', {
	eager: true,
	import: 'default'
});

function slugOf(path: string) {
	return path.split('/').pop()!.replace(/\.\w+$/, '');
}

function readingTime(raw: string) {
	const body = raw.replace(/^---[\s\S]*?---/, '');
	const minutes = Math.ceil(body.trim().split(/\s+/).length / 225);
	return minutes > 1 ? `${minutes} minutes` : `${minutes} minute`;
}

export interface Post extends PostMeta {
	slug: string;
	readingTime: string;
}

export const posts: Post[] = Object.entries(metadataModules)
	.map(([path, meta]) => ({
		...meta,
		slug: slugOf(path),
		readingTime: readingTime(rawModules[path])
	}))
	.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

export function commentsFor(slug: string): ArchivedComment[] {
	const comments = commentModules[`/src/content/comments/${slug}.json`] ?? [];
	// GitHub comments treat single newlines as breaks, like the web UI does
	return comments.map((comment) => ({
		...comment,
		body: marked.parse(comment.body, { gfm: true, breaks: true, async: false })
	}));
}

const mid = '  ·  ';

export function buildFeed(): FeedItem[] {
	const feed: FeedItem[] = [
		...posts.map((post) => ({
			type: 'blog' as const,
			date: post.date,
			href: `/${post.slug}`,
			slug: post.slug,
			text: post.title,
			isStatus: false,
			description: post.description,
			meta: [post.readingTime, post.reactions ? `${post.reactions} ♥` : null]
				.filter(Boolean)
				.join(mid)
		})),
		...talks.map((talk) => ({
			type: 'talk' as const,
			date: talk.date,
			href: talk.href,
			text: talk.title,
			isStatus: false,
			description: talk.description,
			meta: [talk.event, talk.location, talk.duration].filter(Boolean).join(mid)
		})),
		...podcasts.map((podcast) => ({
			type: 'podcast' as const,
			date: podcast.date,
			href: podcast.href,
			text: podcast.title,
			isStatus: false,
			audioSrc: podcast.audioSrc
		})),
		...statuses.map((status) => ({
			type: 'bluesky' as const,
			date: status.date,
			href: status.href,
			text: status.text,
			isStatus: true,
			meta: [
				status.likes ? `♥ ${status.likes}` : null,
				status.reposts ? `↺ ${status.reposts}` : null
			]
				.filter(Boolean)
				.join(mid)
		}))
	];
	return feed.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
